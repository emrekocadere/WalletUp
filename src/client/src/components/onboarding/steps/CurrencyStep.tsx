import { useTranslation } from 'react-i18next';
import { SelectCombobox } from '@/components/SelectCombobox';
import type { Currency } from '@/types/model.types';

interface CurrencyStepProps {
  currencies: Currency[];
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

export const CurrencyStep = ({ currencies, selectedCurrency, onCurrencyChange }: CurrencyStepProps) => {
  const { t } = useTranslation('onboarding');
  return (
    <div className="flex-1">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">{t('currencyStep.title')}</h2>
        <p className="text-gray-400">{t('currencyStep.subtitle')}</p>
      </div>

      <div className="max-w-md mx-auto">
        {currencies.length > 0 ? (
          <SelectCombobox
            options={currencies.map((curr) => ({
              value: curr.id,
              label: curr.iso4217Code,
            }))}
            value={selectedCurrency}
            onChange={onCurrencyChange}
            placeholder={t('currencyStep.placeholder')}
            icon="💱"
          />
        ) : (
          <div className="text-center text-gray-400 py-8">
            <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            {t('currencyStep.loading')}
          </div>
        )}
      </div>
    </div>
  );
};
