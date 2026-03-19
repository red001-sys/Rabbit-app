export type Language =
  | 'pt-BR'
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'it'
  | 'zh'
  | 'ja'
  | 'ko'
  | 'hi';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', flag: '🇧🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
];

const LANG_KEY = 'calorie_app_language';

// =======================
// SAFE STORAGE
// =======================

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (err) {
    console.error('Erro ao acessar storage:', err);
    return null;
  }
}

function safeSet(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    console.error('Erro ao salvar storage:', err);
  }
}

// =======================
// LANGUAGE
// =======================

export function getSavedLanguage(): Language | null {
  const saved = safeGet(LANG_KEY);

  if (saved && LANGUAGES.some(l => l.code === saved)) {
    return saved as Language;
  }

  return null;
}

export function saveLanguage(lang: Language) {
  safeSet(LANG_KEY, lang);
}

export function getDefaultLanguage(): Language {
  return 'en';
}

// =======================
// TRANSLATIONS
// =======================

import translations from '@/i18n';

export { translations };

// =======================
// SAFE TRANSLATE
// =======================

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function t(
  key: string,
  lang: Language,
  params?: Record<string, string | number>
): string {
  try {
    const langTranslations = translations?.[lang] || {};
    const fallback = translations?.['en'] || {};

    let text =
      langTranslations[key] ??
      fallback[key] ??
      key;

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        const safeKey = escapeRegExp(k);
        text = text.replace(
          new RegExp(`\\{${safeKey}\\}`, 'g'),
          String(v)
        );
      });
    }

    return text;
  } catch (err) {
    console.error('Erro na tradução:', err);
    return key;
  }
}