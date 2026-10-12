import { saveChatExchange, listChatMessages } from '../models/ChatHistory.js';
import { answerWithGemini } from '../services/gemini.js';

const languages = new Map([
  ['en-IN', { locale: 'en-IN', name: 'English' }],
  ['hi-IN', { locale: 'hi-IN', name: 'Hindi' }],
  ['te-IN', { locale: 'te-IN', name: 'Telugu' }],
  ['en', { locale: 'en-IN', name: 'English' }],
  ['hi', { locale: 'hi-IN', name: 'Hindi' }],
  ['te', { locale: 'te-IN', name: 'Telugu' }]
]);

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function ask(req, res, next) {
  const question = typeof req.body.question === 'string' ? req.body.question.trim() : '';
  const conversationId = req.body.conversationId;
  const language = languages.get(req.body.language || 'en');

  if (!question || question.length > 2000) {
    return res.status(400).json({ error: 'Enter a question of no more than 2,000 characters.' });
  }
  if (!uuidPattern.test(conversationId || '')) {
    return res.status(400).json({ error: 'The chat conversation is invalid. Refresh the page and try again.' });
  }
  if (!language) {
    return res.status(400).json({ error: 'Language must be English, Hindi, or Telugu.' });
  }

  try {
    const history = Array.isArray(req.body.history)
      ? req.body.history
        .filter((item) => item && ['user', 'model'].includes(item.role) && typeof item.text === 'string')
        .slice(-10)
        .map((item) => ({ role: item.role, text: item.text.slice(0, 4000) }))
      : [];
    const answer = await answerWithGemini({
      question,
      record: req.body.record,
      history,
      language: language.name,
      languageProvided: req.body.language !== undefined
    });

    await saveChatExchange({
      userId: req.user.id,
      conversationId,
      question,
      answer,
      language: language.locale
    });
    return res.json({ text: answer });
  } catch (error) {
    return next(error);
  }
}

export async function history(req, res, next) {
  const conversationId = req.query.conversationId;
  if (!uuidPattern.test(conversationId || '')) {
    return res.status(400).json({ error: 'The chat conversation is invalid.' });
  }

  try {
    const messages = await listChatMessages(req.user.id, conversationId);
    return res.json({ messages });
  } catch (error) {
    return next(error);
  }
}
