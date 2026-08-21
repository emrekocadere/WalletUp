export interface SupportedLanguage {
  code: string;
  nativeName: string;
  intlLocale: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en', nativeName: 'English', intlLocale: 'en-US' },
  { code: 'tr', nativeName: 'Türkçe', intlLocale: 'tr-TR' },
  { code: 'de', nativeName: 'Deutsch', intlLocale: 'de-DE' },
  { code: 'nb', nativeName: 'Norsk', intlLocale: 'nb-NO' },
  { code: 'sv', nativeName: 'Svenska', intlLocale: 'sv-SE' },
  { code: 'da', nativeName: 'Dansk', intlLocale: 'da-DK' },
  { code: 'is', nativeName: 'Íslenska', intlLocale: 'is-IS' },
  { code: 'fi', nativeName: 'Suomi', intlLocale: 'fi-FI' },
];

export const DEFAULT_LANGUAGE_CODE = 'en';

export const getIntlLocale = (languageCode: string): string =>
  SUPPORTED_LANGUAGES.find((lang) => lang.code === languageCode)?.intlLocale ?? 'en-US';
