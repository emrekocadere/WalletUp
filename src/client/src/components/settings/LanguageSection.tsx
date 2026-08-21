import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '@/i18n/languages';

interface LanguageSectionProps {
  value: string;
  onChange: (language: string) => void;
}

export const LanguageSection = ({ value, onChange }: LanguageSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.077 8.767 14.482 4.5 17.24" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">{t('settings.language.title')}</h2>
          <p className="text-sm text-gray-400">{t('settings.language.subtitle')}</p>
        </div>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:border-primary-500/50 focus:outline-none transition-colors"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName}
          </option>
        ))}
      </select>
    </div>
  );
};
