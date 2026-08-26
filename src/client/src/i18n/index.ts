import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE_CODE } from './languages';
import { detectLanguageFromIP } from './ipLanguageDetector';

const LANGUAGE_STORAGE_KEY = 'walletup-language';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: SUPPORTED_LANGUAGES.map((lang) => lang.code),
    fallbackLng: DEFAULT_LANGUAGE_CODE,
    ns: [
      'common',
      'accounts',
      'transactions',
      'goals',
      'recurring',
      'reports',
      'onboarding',
      'auth',
      'home',
    ],
    defaultNS: 'common',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

// If the visitor never explicitly picked a language, try to refine the
// browser-language guess using their approximate location (IP geolocation).
if (!localStorage.getItem(LANGUAGE_STORAGE_KEY)) {
  detectLanguageFromIP().then((language) => {
    if (language && language !== i18n.language) {
      i18n.changeLanguage(language);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  });
}

export default i18n;
