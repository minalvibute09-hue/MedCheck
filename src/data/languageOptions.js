export const languageOptions = [
  { code: 'en', label: 'English', native: 'English', locale: 'en-IN', aiName: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', locale: 'hi-IN', aiName: 'Hindi' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', locale: 'te-IN', aiName: 'Telugu' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', locale: 'ta-IN', aiName: 'Tamil' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', locale: 'mr-IN', aiName: 'Marathi' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', locale: 'bn-IN', aiName: 'Bengali' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', locale: 'kn-IN', aiName: 'Kannada' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം', locale: 'ml-IN', aiName: 'Malayalam' }
];

export const languageLocaleByCode = Object.fromEntries(
  languageOptions.map(({ code, locale }) => [code, locale])
);

export const languageByLocale = Object.fromEntries(
  languageOptions.map(({ locale, ...language }) => [locale, language])
);

export function getLanguageLocale(language) {
  if (languageLocaleByCode[language]) return languageLocaleByCode[language];
  return languageByLocale[language] ? language : 'en-IN';
}

export function getLanguageCode(language) {
  if (languageLocaleByCode[language]) return language;
  return languageByLocale[language]?.code || 'en';
}
