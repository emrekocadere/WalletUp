import { useTranslation } from 'react-i18next';
import type { Currency } from '@/types/model.types';

interface BaseCurrencySectionProps {
  value: string;
  onChange: (currency: string) => void;
  currencies: Currency[];
}

export const BaseCurrencySection = ({ value, onChange, currencies }: BaseCurrencySectionProps) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 ">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
          <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">{t('settings.currency.title')}</h2>
          <p className="text-sm text-gray-400">{t('settings.currency.subtitle')}</p>
        </div>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-white focus:border-primary-500/50 focus:outline-none transition-colors"
      >
        <option value="">{t('settings.currency.placeholder')}</option>
        {currencies.map((curr) => (
          <option key={curr.id} value={curr.id}>
            {curr.iso4217Code} 
          </option>
        ))}
      </select>
    </div>
  );
};
