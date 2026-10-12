import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import sharp from 'sharp';
import { getSupportedLanguage } from '../config/languages.js';
import { answerWithOllama, generateWithOllama } from './ollama.js';
import {
  buildMedicationRequest,
  buildObservation,
  callDocumentAi,
  extractMedicalDocument,
  normalizeDocument,
  parseExtractionJson,
  prepareFile,
  renderPdfPages
} from './documentExtraction.js';

const originalFetch = globalThis.fetch;
const originalOllamaModel = process.env.OLLAMA_MODEL;
const originalOllamaBaseUrl = process.env.OLLAMA_BASE_URL;

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalOllamaModel === undefined) delete process.env.OLLAMA_MODEL;
  else process.env.OLLAMA_MODEL = originalOllamaModel;
  if (originalOllamaBaseUrl === undefined) delete process.env.OLLAMA_BASE_URL;
  else process.env.OLLAMA_BASE_URL = originalOllamaBaseUrl;
});

function onePagePdf() {
  const content = 'BT /F1 12 Tf 20 50 Td (Demo report) Tj ET';
  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 100] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>\nendobj\n',
    `4 0 obj\n<< /Length ${Buffer.byteLength(content, 'ascii')} >>\nstream\n${content}\nendstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n'
  ];
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  for (const object of objects) {
    offsets.push(Buffer.byteLength(pdf, 'ascii'));
    pdf += object;
  }
  const xrefOffset = Buffer.byteLength(pdf, 'ascii');
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('');
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf, 'ascii');
}

test('local language configuration supports English and seven Indian languages', () => {
  const expected = [
    ['en', 'en-IN', 'English'],
    ['hi', 'hi-IN', 'Hindi'],
    ['te', 'te-IN', 'Telugu'],
    ['ta', 'ta-IN', 'Tamil'],
    ['mr', 'mr-IN', 'Marathi'],
    ['bn', 'bn-IN', 'Bengali'],
    ['kn', 'kn-IN', 'Kannada'],
    ['ml', 'ml-IN', 'Malayalam']
  ];
  for (const [code, locale, name] of expected) {
    assert.deepEqual(getSupportedLanguage(code), { code, locale, name });
    assert.deepEqual(getSupportedLanguage(locale), { code, locale, name });
  }
  assert.equal(getSupportedLanguage('fr-FR'), null);
});

test('Ollama receives a local chat request and returns generated content', async () => {
  process.env.OLLAMA_BASE_URL = 'http://127.0.0.1:11434/';
  process.env.OLLAMA_MODEL = 'test-vision-model';
  let requestUrl;
  let requestBody;
  globalThis.fetch = async (url, options) => {
    requestUrl = url;
    requestBody = JSON.parse(options.body);
    return new Response(JSON.stringify({
      message: { role: 'assistant', content: 'A plain-language answer.' }
    }), { status: 200, headers: { 'content-type': 'application/json' } });
  };

  const answer = await generateWithOllama({
    messages: [{ role: 'user', content: 'What does this report say?' }],
    images: [Buffer.from('sample-image')],
    jsonMode: true
  });

  test('chat request retains medical safety and sends selected language to local Ollama', async () => {
    let requestBody;
    globalThis.fetch = async (_url, options) => {
      requestBody = JSON.parse(options.body);
      return new Response(JSON.stringify({ message: { content: 'ನಿಮ್ಮ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.' } }), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      });
    };

    const answer = await answerWithOllama({
      question: 'What does my report say?',
      record: { title: 'Example report' },
      history: [{ role: 'user', text: 'Earlier question' }],
      language: 'Kannada',
      languageProvided: true
    });

    assert.equal(answer, 'ನಿಮ್ಮ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.');
    assert.match(requestBody.messages[0].content, /Never diagnose, prescribe/u);
    assert.match(requestBody.messages[0].content, /Reply in Kannada/u);
    assert.deepEqual(requestBody.messages.map(({ role }) => role), ['system', 'user', 'user']);
  });

  assert.equal(requestUrl, 'http://127.0.0.1:11434/api/chat');
  assert.equal(requestBody.model, 'test-vision-model');
  assert.equal(requestBody.stream, false);
  assert.equal(requestBody.format, 'json');
  assert.deepEqual(requestBody.messages[0].images, [Buffer.from('sample-image').toString('base64')]);
  assert.equal(answer, 'A plain-language answer.');
});

test('Ollama reports when its local service is unavailable', async () => {
  globalThis.fetch = async () => { throw new TypeError('connection refused'); };
  await assert.rejects(
    generateWithOllama({ messages: [{ role: 'user', content: 'Hello' }] }),
    { message: /Start Ollama and download the configured model/u, status: 503 }
  );
});

test('Ollama identifies a model that has not been downloaded', async () => {
  process.env.OLLAMA_MODEL = 'missing-model';
  globalThis.fetch = async () => new Response(
    JSON.stringify({ error: 'model "missing-model" not found, try pulling it first' }),
    { status: 404, headers: { 'content-type': 'application/json' } }
  );
  await assert.rejects(
    generateWithOllama({ messages: [{ role: 'user', content: 'Hello' }] }),
    { message: /ollama pull missing-model/u, status: 503 }
  );
});

test('parseExtractionJson accepts fenced JSON and reports invalid JSON clearly', () => {
  assert.deepEqual(parseExtractionJson('```json\n{"readable":false}\n```'), { readable: false });
  assert.throws(() => parseExtractionJson('no structured response'), /invalid result/i);
  assert.throws(() => parseExtractionJson('{"readable": }'), /invalid JSON/i);
});

test('prepareFile normalizes images and keeps PDFs ready for page rendering', async () => {
  const inputImage = await sharp({
    create: { width: 2400, height: 1200, channels: 3, background: '#ffffff' }
  }).png().toBuffer();
  const preparedImage = await prepareFile(inputImage, 'image/png');
  const metadata = await sharp(preparedImage.data).metadata();
  assert.equal(preparedImage.mimeType, 'image/jpeg');
  assert.equal(metadata.format, 'jpeg');
  assert.ok(Math.max(metadata.width, metadata.height) <= 2000);

  const pdf = onePagePdf();
  const preparedPdf = await prepareFile(pdf, 'application/pdf');
  assert.equal(preparedPdf.data, pdf);
  assert.equal(preparedPdf.mimeType, 'application/pdf');
  const pages = await renderPdfPages(preparedPdf.data);
  assert.equal(pages.length, 1);
  assert.equal((await sharp(pages[0]).metadata()).format, 'jpeg');
});

test('normalization computes test flags and creates patient-linked FHIR-style resources', () => {
  const result = normalizeDocument({
    readable: true,
    doc_type: 'lab_report',
    doc_date: '2026-02-30',
    medicines: [
      { name: 'Example tablet', strength: '5 mg', frequency: 'once daily', duration: null, confidence: 'medium' }
    ],
    tests: [
      { name: 'Glucose', value: '110', unit: 'mg/dL', reference_low: '70', reference_high: '100', confidence: 'high' },
      { name: 'Vitamin D', value: 12, unit: 'ng/mL', reference_low: 20, reference_high: 60, confidence: 'low' },
      { name: 'Unknown test', value: 'not numeric', unit: null, reference_low: null, reference_high: null, confidence: 'low' }
    ],
    diagnoses: [{ name: 'As printed' }],
    summary: 'Please confirm with your doctor.'
  }, {
    fileName: 'example.png',
    mimeType: 'image/jpeg',
    patientId: 'patient-123',
    language: 'en-IN'
  });

  assert.equal(result.doc_date, null);
  assert.equal(result.tests[0].flag, 'high');
  assert.equal(result.tests[1].flag, 'low');
  assert.equal(result.tests[2].value, null);
  assert.equal(result.tests[2].flag, 'unknown');
  assert.equal(result.record.labValues[0].status, 'High');
  assert.equal(result.record.medications[0].confidence, 'medium');
  assert.deepEqual(result.record.fhirResources.map((resource) => resource.resourceType), [
    'Observation',
    'Observation',
    'MedicationRequest'
  ]);
  assert.deepEqual(result.record.fhirResources[0].subject, { reference: 'Patient/patient-123' });
  assert.deepEqual(result.record.fhirResources[1].subject, { reference: 'Patient/patient-123' });
  assert.equal(buildObservation(result.tests[0], 'patient-123', null).interpretation[0].text, 'high');
  assert.equal(
    buildMedicationRequest(result.record.medications[0], 'patient-123', null).resourceType,
    'MedicationRequest'
  );
});

test('document extraction sends the requested language and image to local vision model', async () => {
  process.env.OLLAMA_MODEL = 'test-vision-model';
  let requestBody;
  globalThis.fetch = async (_url, options) => {
    requestBody = JSON.parse(options.body);
    return new Response(JSON.stringify({
      message: {
        content: JSON.stringify({
          readable: true,
          doc_type: 'prescription',
          doc_date: '2026-06-10',
          medicines: [{ name: 'Example medicine', strength: null, frequency: 'once daily', duration: null, confidence: 'low' }],
          tests: [],
          diagnoses: [],
          summary: 'ಈ ಔಷಧಿಯ ವಿವರಗಳನ್ನು ವೈದ್ಯರೊಂದಿಗೆ ದೃಢಪಡಿಸಿ.'
        })
      }
    }), { status: 200, headers: { 'content-type': 'application/json' } });
  };

  const image = await sharp({
    create: { width: 3, height: 3, channels: 3, background: '#ffffff' }
  }).jpeg().toBuffer();
  const result = await extractMedicalDocument({
    data: image,
    mimeType: 'image/jpeg',
    fileName: 'demo.jpg',
    patientId: 'patient-456',
    language: 'kn-IN'
  });

  assert.equal(requestBody.model, 'test-vision-model');
  assert.equal(requestBody.format, 'json');
  assert.match(requestBody.messages[0].content, /Kannada/u);
  const prepared = await prepareFile(image, 'image/jpeg');
  assert.deepEqual(requestBody.messages[0].images, [prepared.data.toString('base64')]);
  assert.equal(result.readable, true);
  assert.equal(result.record.plainSummary.kn, 'ಈ ಔಷಧಿಯ ವಿವರಗಳನ್ನು ವೈದ್ಯರೊಂದಿಗೆ ದೃಢಪಡಿಸಿ.');
  assert.equal(result.record.fhirResources[0].resourceType, 'MedicationRequest');
});

test('PDF extraction renders every page for local vision processing', async () => {
  let requestBody;
  globalThis.fetch = async (_url, options) => {
    requestBody = JSON.parse(options.body);
    return new Response(JSON.stringify({
      message: {
        content: JSON.stringify({
          readable: false
        })
      }
    }), { status: 200, headers: { 'content-type': 'application/json' } });
  };

  const result = await extractMedicalDocument({
    data: onePagePdf(),
    mimeType: 'application/pdf',
    fileName: 'demo.pdf',
    patientId: 'patient-456',
    language: 'en-IN'
  });
  assert.deepEqual(result, { readable: false });
  assert.equal(requestBody.messages[0].images.length, 1);
});

test('unreadable local vision response is returned without invented document details', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({
    message: { content: '{"readable":false}' }
  }), { status: 200, headers: { 'content-type': 'application/json' } });

  const result = await extractMedicalDocument({
    data: onePagePdf(),
    mimeType: 'application/pdf',
    fileName: 'blurry.pdf',
    patientId: 'patient-456',
    language: 'en-IN'
  });
  assert.deepEqual(result, { readable: false });
});
