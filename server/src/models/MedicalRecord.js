import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  recordKey: { type: String, required: true, maxlength: 100 },
  title: { type: String, required: true, maxlength: 255 },
  recordData: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true, versionKey: false });

medicalRecordSchema.index({ userId: 1, recordKey: 1 }, { unique: true });
medicalRecordSchema.index({ userId: 1, createdAt: -1 });

const MedicalRecord = mongoose.models.MedicalRecord ||
  mongoose.model('MedicalRecord', medicalRecordSchema);

export async function listMedicalRecords(userId) {
  const rows = await MedicalRecord.find({ userId })
    .sort({ createdAt: -1 })
    .select('recordKey recordData')
    .lean();

  return rows.map(({ recordKey, recordData }) => ({
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

  await MedicalRecord.updateOne(
    { userId, recordKey },
    { $set: { title, recordData: record } },
    { upsert: true, runValidators: true }
  );
  return { recordKey };
}

export default MedicalRecord;
