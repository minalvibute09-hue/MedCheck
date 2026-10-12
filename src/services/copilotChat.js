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

export async function answerHealthQuery(query, activeRecord, messages, language = 'en') {
  const languageLocales = { en: 'en-IN', hi: 'hi-IN', te: 'te-IN' };
  const response = await fetch('/api/ask-ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: query,
      record: getRecordContext(activeRecord),
      history: messages
        .filter((message) => message.sender === 'user' || message.sender === 'bot')
        .slice(-10)
        .map(({ sender, text }) => ({ role: sender === 'user' ? 'user' : 'model', text })),
      language: languageLocales[language] || language
    })
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || `Gemini request failed (${response.status}).`);
  }

  if (typeof result.text !== 'string' || !result.text.trim()) {
    throw new Error('Gemini returned an empty response. Please try again.');
  }

  return result.text;
}
