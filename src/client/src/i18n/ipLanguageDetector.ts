import { SUPPORTED_LANGUAGES } from './languages';

// ISO 3166-1 alpha-2 country code -> our supported language code.
// Only maps countries where the dominant language matches one of SUPPORTED_LANGUAGES;
// everything else is left undetected (caller falls back to browser language).
const COUNTRY_TO_LANGUAGE: Record<string, string> = {
  TR: 'tr',
  DE: 'de', AT: 'de', LI: 'de',
  NO: 'nb',
  SE: 'sv',
  DK: 'da', GL: 'da', FO: 'da',
  IS: 'is',
  FI: 'fi', AX: 'fi',
  FR: 'fr', MC: 'fr', LU: 'fr',
  IT: 'it', SM: 'it', VA: 'it',
  NL: 'nl',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es',
  EC: 'es', GT: 'es', CU: 'es', BO: 'es', DO: 'es', HN: 'es', PY: 'es',
  SV: 'es', NI: 'es', CR: 'es', PA: 'es', UY: 'es', GQ: 'es',
  PT: 'pt', BR: 'pt', AO: 'pt', MZ: 'pt', CV: 'pt', GW: 'pt', ST: 'pt', TL: 'pt',
  US: 'en', GB: 'en', IE: 'en', AU: 'en', NZ: 'en', CA: 'en',
};

const SUPPORTED_CODES = new Set(SUPPORTED_LANGUAGES.map((l) => l.code));

/** Resolves the visitor's country via IP geolocation and maps it to a supported language, if any. */
export const detectLanguageFromIP = async (): Promise<string | undefined> => {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) return undefined;

    const data: { country_code?: string } = await res.json();
    const language = data.country_code ? COUNTRY_TO_LANGUAGE[data.country_code] : undefined;

    return language && SUPPORTED_CODES.has(language) ? language : undefined;
  } catch {
    return undefined;
  }
};
