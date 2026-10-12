import mongoose from 'mongoose';
import User from '../models/User.js';
import MedicalRecord from '../models/MedicalRecord.js';
import ChatMessage from '../models/ChatHistory.js';

export async function initializeDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medcheck';
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });

  await Promise.all([
    User.init(),
    MedicalRecord.init(),
    ChatMessage.init()
  ]);
}

export async function closeDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
