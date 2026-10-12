import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import sharp from 'sharp';
import {
  buildMedicationRequest,
  buildObservation,
  callDocumentAi,
  extractMedicalDocument,
  normalizeDocument,
  parseExtractionJson,
  prepareFile
} from './documentExtraction.js';

const originalFetch = globalThis.fetch;
const originalApiKey = process.env.GEMINI_API_KEY;

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalApiKey === undefined) delete process.env.GEMINI_API_KEY;
  else process.env.GEMINI_API_KEY = originalApiKey;
});

test('parseExtractionJson accepts fenced JSON and reports invalid JSON clearly', () => {
  assert.deepEqual(parseExtractionJson('```json\n{"readable":false}\n```'), { readable: false });
  assert.throws(() => parseExtractionJson('no structured response'), /invalid result/i);
  assert.throws(() => parseExtractionJson('{"readable": }'), /invalid JSON/i);
});

test('prepareFile normalizes images and leaves valid PDF bytes unchanged', async () => {
  const inputImage = await sharp({
    create: { width: 2400, height: 1200, channels: 3, background: '#ffffff' }
  }).png().toBuffer();
  const preparedImage = await prepareFile(inputImage, 'image/png');
  const metadata = await sharp(preparedImage.data).metadata();
  assert.equal(preparedImage.mimeType, 'image/jpeg');
  assert.equal(metadata.format, 'jpeg');
  assert.ok(Math.max(metadata.width, metadata.height) <= 2000);

  const pdf = Buffer.from('%PDF-1.7 test');
  const preparedPdf = await prepareFile(pdf, 'application/pdf');
  assert.equal(preparedPdf.data, pdf);
  assert.equal(preparedPdf.mimeType, 'application/pdf');
});

test('normalization computes flags and creates FHIR-style patient-linked resources', () => {
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
    language: 'en'
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
  assert.equal(result.record.fhirResources.length, 3);
  assert.deepEqual(result.record.fhirResources[0].subject, { reference: 'Patient/patient-123' });
  assert.deepEqual(result.record.fhirResources[1].subject, { reference: 'Patient/patient-123' });
  assert.equal(buildObservation(result.tests[0], 'patient-123', null).interpretation[0].text, 'high');
  assert.equal(
    buildMedicationRequest(result.record.medications[0], 'patient-123', null).resourceType,
    'MedicationRequest'
  );
});

test('document extraction sends language and structured JSON request to Gemini', async () => {
  process.env.GEMINI_API_KEY = 'test-key';
  let requestBody;
  globalThis.fetch = async (_url, options) => {
    requestBody = JSON.parse(options.body);
    return new Response(JSON.stringify({
      output_text: JSON.stringify({
        readable: true,
        doc_type: 'prescription',
        doc_date: '2026-06-10',
        medicines: [{ name: 'Example medicine', strength: null, frequency: 'once daily', duration: null, confidence: 'low' }],
        tests: [],
        diagnoses: [],
        summary: 'This document lists a medicine. Please confirm with your doctor.'
      })
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
    language: 'hi-IN'
  });

  assert.equal(requestBody.generation_config.response_mime_type, 'application/json');
  assert.match(requestBody.input[0].text, /Hindi/u);
  assert.equal(requestBody.input[1].type, 'image');
  assert.equal(requestBody.input[1].mime_type, 'image/jpeg');
  assert.equal(result.readable, true);
  assert.equal(result.record.plainSummary.hi, 'This document lists a medicine. Please confirm with your doctor.');
  assert.equal(result.record.fhirResources[0].resourceType, 'MedicationRequest');
});

test('Gemini unreadable response is returned without invented document details', async () => {
  process.env.GEMINI_API_KEY = 'test-key';
  globalThis.fetch = async () => new Response(JSON.stringify({
    output_text: '{"readable":false}'
  }), { status: 200, headers: { 'content-type': 'application/json' } });

  const result = await extractMedicalDocument({
    data: Buffer.from('%PDF-1.7 test'),
    mimeType: 'application/pdf',
    fileName: 'blurry.pdf',
    patientId: 'patient-456',
    language: 'en-IN'
  });
  assert.deepEqual(result, { readable: false });
});

test('Gemini retries rate-limit responses and succeeds when service recovers', async () => {
  process.env.GEMINI_API_KEY = 'test-key';
  let attemptCount = 0;
  globalThis.fetch = async () => {
    attemptCount += 1;
    if (attemptCount < 2) {
      return new Response(JSON.stringify({ error: { status: 'RESOURCE_EXHAUSTED' } }), { status: 429 });
    }
    return new Response(JSON.stringify({ output_text: '{"readable":false}' }), { status: 200 });
  };
  const result = await callDocumentAi('Return JSON.', Buffer.from('%PDF-1.7 test'), 'application/pdf');
  assert.deepEqual(result, { readable: false });
  assert.equal(attemptCount, 2);
});
