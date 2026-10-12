const supportedLanguages = [
  { code: 'en', locale: 'en-IN', name: 'English' },
  { code: 'hi', locale: 'hi-IN', name: 'Hindi' },
  { code: 'te', locale: 'te-IN', name: 'Telugu' },
  { code: 'ta', locale: 'ta-IN', name: 'Tamil' },
  { code: 'mr', locale: 'mr-IN', name: 'Marathi' },
  { code: 'bn', locale: 'bn-IN', name: 'Bengali' },
  { code: 'kn', locale: 'kn-IN', name: 'Kannada' },
  { code: 'ml', locale: 'ml-IN', name: 'Malayalam' }
];

const languagesByIdentifier = new Map();
for (const language of supportedLanguages) {
  languagesByIdentifier.set(language.code, language);
  languagesByIdentifier.set(language.locale, language);
}

export function getSupportedLanguage(identifier) {
  return languagesByIdentifier.get(identifier) || null;
}
