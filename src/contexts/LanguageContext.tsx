import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode
} from 'react';

import {
  Language,
  getSavedLanguage,
  saveLanguage,
  getDefaultLanguage,
  t as translate
} from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  hasLanguage: boolean;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLang] = useState<Language>(getDefaultLanguage());
  const [hasLanguage, setHasLanguage] = useState(false);

  // 🔐 Carrega idioma com segurança (APÓS mount)
  useEffect(() => {
    try {
      const saved = getSavedLanguage();

      if (saved) {
        setLang(saved);
        setHasLanguage(true);
      }
    } catch (err) {
      console.error('Erro ao carregar idioma:', err);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    try {
      setLang(lang);
      setHasLanguage(true);
      saveLanguage(lang);
    } catch (err) {
      console.error('Erro ao salvar idioma:', err);
    }
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      try {
        const result = translate(key, language, params);

        // fallback defensivo
        if (!result) return key;

        return result;
      } catch (err) {
        console.error('Erro na tradução:', err);
        return key;
      }
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t, hasLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);

  // 🔐 fallback seguro (NUNCA quebra o app)
  if (!ctx) {
    console.warn('useLanguage fora do provider');

    return {
      language: getDefaultLanguage(),
      setLanguage: () => {},
      t: (key: string) => key,
      hasLanguage: false
    };
  }

  return ctx;
}