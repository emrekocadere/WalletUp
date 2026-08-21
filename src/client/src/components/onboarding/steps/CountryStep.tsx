import { useTranslation } from 'react-i18next';
import { SelectCombobox } from '@/components/SelectCombobox';
import type { Country } from '@/api/endpoints/preferences.api';

interface CountryStepProps {
  countries: Country[];
  selectedCountry: string;
  onCountryChange: (country: string) => void;
}

export const CountryStep = ({ countries, selectedCountry, onCountryChange }: CountryStepProps) => {
  const { t } = useTranslation('onboarding');
  return (
    <div className="flex-1">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">{t('countryStep.title')}</h2>
        <p className="text-gray-400">{t('countryStep.subtitle')}</p>
      </div>

      <div className="max-w-md mx-auto">
        {countries.length > 0 ? (
          <SelectCombobox
            options={countries.map((country) => ({
              value: country.id,
              label: country.name,
            }))}
            value={selectedCountry}
            onChange={onCountryChange}
            placeholder={t('countryStep.placeholder')}
          />
        ) : (
          <div className="text-center text-gray-400 py-8">
            <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            {t('countryStep.loading')}
          </div>
        )}
      </div>
    </div>
  );
};
