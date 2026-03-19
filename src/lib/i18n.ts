// src/lib/i18n.ts

type Translations = {
  [key: string]: {
    [language: string]: string;
  };
};

const translations: Translations = {
  greeting: {
    en: "Hello",
    pt: "Olá",
    es: "Hola",
  },
  goodbye: {
    en: "Goodbye",
    pt: "Adeus",
    es: "Adiós",
  },
  // Add more translations as needed
};

export function getDefaultLanguage(): string {
  return "en"; // Default to English
}

export function getSavedLanguage(): string {
  return localStorage.getItem("language") || getDefaultLanguage();
}

export function saveLanguage(language: string): void {
  localStorage.setItem("language", language);
}

export function translate(key: string): string {
  const language = getSavedLanguage();
  return translations[key][language] || translations[key][getDefaultLanguage()];
}
