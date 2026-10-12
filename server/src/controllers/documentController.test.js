import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import sharp from 'sharp';
import { after, test } from 'node:test';
import { extract } from './documentController.js';
import { closeDatabase, initializeDatabase } from '../config/db.js';
import ChatMessage from '../models/ChatHistory.js';
import MedicalRecord, { listMedicalRecords } from '../models/MedicalRecord.js';
import User, { createUser } from '../models/User.js';

dotenv.config({ path: 'server/.env', quiet: true });
const originalFetch = globalThis.fetch;
const userId = randomUUID();
const email = `scan-persistence-${userId}@example.test`;
let databaseInitialized = false;

after(async () => {
  globalThis.fetch = originalFetch;
  if (databaseInitialized) {
    await Promise.all([
      MedicalRecord.deleteMany({ userId }),
      ChatMessage.deleteMany({ userId }),
      User.deleteOne({ _id: userId })
    ]);
    await closeDatabase();
  }
});

test('authenticated extraction handler saves structured document records to MongoDB', async () => {
  process.env.OLLAMA_MODEL = 'test-vision-model';
  await initializeDatabase();
  databaseInitialized = true;
  await createUser({
    id: userId,
    fullName: 'Scan Persistence Test',
    email,
    passwordHash: 'synthetic-test-hash'
  });

  globalThis.fetch = async () => new Response(JSON.stringify({
    message: {
      content: JSON.stringify({
        readable: true,
        doc_type: 'lab_report',
        doc_date: '2026-06-10',
        medicines: [{ name: 'Demo tablet', strength: '5 mg', frequency: 'once daily', duration: null, confidence: 'medium' }],
        tests: [{ name: 'Demo test', value: 110, unit: 'mg/dL', reference_low: 70, reference_high: 100, confidence: 'high' }],
        diagnoses: [],
        summary: 'A demo report lists a test result. Please confirm with your doctor.'
      })
    }
  }), { status: 200, headers: { 'content-type': 'application/json' } });

  const png = await sharp({
    create: { width: 4, height: 4, channels: 3, background: '#ffffff' }
  }).png().toBuffer();
  let statusCode;
  let responseBody;
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(body) {
      responseBody = body;
      return this;
    }
  };

  await extract({
    file: {
      buffer: png,
      mimetype: 'image/png',
      originalname: 'fictional-report.png'
    },
    body: { language: 'en-IN' },
    user: { id: userId }
  }, res, (error) => {
    if (error) throw error;
  });

  assert.equal(statusCode, 201);
  assert.equal(responseBody.readable, true);
  assert.equal(responseBody.record.fhirResources.length, 2);
  assert.equal(responseBody.record.fhirResources[0].subject.reference, `Patient/${userId}`);
  const saved = await listMedicalRecords(userId);
  assert.equal(saved.length, 1);
  assert.equal(saved[0].id, responseBody.document_id);
  assert.equal(saved[0].labValues[0].status, 'High');
});
