import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  conversationId: { type: String, required: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  language: { type: String, required: true, maxlength: 10 }
}, { timestamps: { createdAt: true, updatedAt: false }, versionKey: false });

chatMessageSchema.index({ userId: 1, conversationId: 1, createdAt: -1 });

const ChatMessage = mongoose.models.ChatMessage ||
  mongoose.model('ChatMessage', chatMessageSchema);

export async function listChatMessages(userId, conversationId) {
  const rows = await ChatMessage.find({ userId, conversationId })
    .sort({ createdAt: -1, _id: -1 })
    .limit(100)
    .select('role content language createdAt')
    .lean();

  return rows.reverse().map(({ role, content, language, createdAt }) => ({
    role,
    content,
    language,
    created_at: createdAt
  }));
}

export async function saveChatExchange({ userId, conversationId, question, answer, language }) {
  await ChatMessage.insertMany([
    { userId, conversationId, role: 'user', content: question, language },
    { userId, conversationId, role: 'assistant', content: answer, language }
  ]);
}

export default ChatMessage;
