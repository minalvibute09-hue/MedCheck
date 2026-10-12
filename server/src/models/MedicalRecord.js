import { getPool } from '../config/db.js';

export async function listMedicalRecords(userId) {
  const [rows] = await getPool().execute(
    'SELECT record_key, record_data FROM medical_records WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );

  return rows.map(({ record_key: recordKey, record_data: recordData }) => ({
    ...recordData,
    id: recordData.id || recordKey
  }));
}

export async function saveMedicalRecord(userId, record) {
  const recordKey = String(record.id || '');
  const title = String(record.title || 'Untitled record').slice(0, 255);
  if (!recordKey || recordKey.length > 100) {
    const error = new Error('The medical record has an invalid identifier.');
    error.status = 400;
    throw error;
  }

  const [result] = await getPool().execute(
    `INSERT INTO medical_records (user_id, record_key, title, record_data)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE title = VALUES(title), record_data = VALUES(record_data)`,
    [userId, recordKey, title, JSON.stringify(record)]
  );

  return { id: result.insertId, recordKey };
}
