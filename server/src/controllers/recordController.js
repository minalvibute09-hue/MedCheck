import { listMedicalRecords, saveMedicalRecord } from '../models/MedicalRecord.js';

export async function list(req, res, next) {
  try {
    return res.json({ records: await listMedicalRecords(req.user.id) });
  } catch (error) {
    return next(error);
  }
}

export async function save(req, res, next) {
  const record = req.body?.record;
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return res.status(400).json({ error: 'A medical record is required.' });
  }

  try {
    const saved = await saveMedicalRecord(req.user.id, record);
    return res.status(201).json(saved);
  } catch (error) {
    return next(error);
  }
}
