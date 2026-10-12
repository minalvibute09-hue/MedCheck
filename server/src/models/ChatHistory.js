import { getPool } from '../config/db.js';

export async function listChatMessages(userId, conversationId) {
  const [rows] = await getPool().execute(
    `SELECT role, content, language, created_at
     FROM chat_messages
     WHERE user_id = ? AND conversation_id = ?
     ORDER BY id DESC
     LIMIT 100`,
    [userId, conversationId]
  );
  return rows.reverse();
}

export async function saveChatExchange({ userId, conversationId, question, answer, language }) {
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute(
      `INSERT INTO chat_messages (user_id, conversation_id, role, content, language)
       VALUES (?, ?, 'user', ?, ?), (?, ?, 'assistant', ?, ?)`,
      [userId, conversationId, question, language, userId, conversationId, answer, language]
    );
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
