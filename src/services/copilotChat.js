import { getLanguageLocale } from '../data/languageOptions';

function getRecordContext(record) {
  if (!record) return null;

  return {
    title: record.title,
    date: record.date,
    summary: record.plainSummary?.en,
    diagnoses: record.diagnoses?.map(({ name, severity }) => ({ name, severity })),
    medications: record.medications?.map(({ name, generic, dosage, frequency, timing, duration }) => ({
      name,
      generic,
      dosage,
      frequency,
      timing,
      duration
    })),
    vitals: record.vitals,
    labValues: record.labValues,
    abnormalFindings: record.abnormalFindings
  };
}

export async function answerHealthQuery(query, activeRecord, messages, language = 'en', token, conversationId) {
  const response = await fetch('/api/chat/ask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      question: query,
      conversationId,
      record: getRecordContext(activeRecord),
      history: messages
        .filter((message) => message.sender === 'user' || message.sender === 'bot')
        .slice(-10)
        .map(({ sender, text }) => ({ role: sender === 'user' ? 'user' : 'model', text })),
      language: getLanguageLocale(language)
    })
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(result.error || `Local AI request failed (${response.status}).`);
    error.status = response.status;
    throw error;
  }

  if (typeof result.text !== 'string' || !result.text.trim()) {
    throw new Error('The local AI returned an empty response. Please try again.');
  }

  return result.text;
}
