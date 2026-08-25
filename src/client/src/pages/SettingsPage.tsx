import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Toast } from '@/components/common/Toast';
import { BaseCurrencySection } from '@/components/settings/BaseCurrencySection';
import { CountrySection } from '@/components/settings/CountrySection';
import { LanguageSection } from '@/components/settings/LanguageSection';
import { PreferencesSection } from '@/components/settings/PreferencesSection';
import { ChangePasswordSection } from '@/components/settings/ChangePasswordSection';
import { DeleteAccountSection } from '@/components/settings/DeleteAccountSection';
import { preferenceApi } from '@/api/endpoints/preferences.api';
import { transactionsApi } from '@/api/endpoints/transactions.api';
import { DEFAULT_LANGUAGE_CODE } from '@/i18n/languages';
import type { Country, Currency } from '@/types/model.types';
import type { ApiError } from '@/types/common.types';

export const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  const [preferences, setPreferences] = useState({
    currencyId: '',
    countryId: '',
    occupation: '' as string | undefined,
    monthlyIncome: undefined as number | undefined,
    language: i18n.language || DEFAULT_LANGUAGE_CODE,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countriesData, currenciesData] = await Promise.all([
          transactionsApi.getAllCountries(),
          transactionsApi.getAllCurrencies()
        ]);
        setCountries(countriesData);
        setCurrencies(currenciesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setToast({ message: t('settings.loadFailed'), type: 'error' });
      }
    };

    fetchData();

    const savedOnboarding = localStorage.getItem('walletup-onboarding');

    if (savedOnboarding) {
      const onboardingData = JSON.parse(savedOnboarding);
      setPreferences((prev) => ({
        ...prev,
        currencyId: onboardingData.baseCurrency || '',
        countryId: onboardingData.country || '',
        occupation: onboardingData.aiPreferences?.occupation || '',
        monthlyIncome: onboardingData.aiPreferences?.incomeRange
          ? parseFloat(onboardingData.aiPreferences.incomeRange)
          : undefined,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLanguageChange = (language: string) => {
    setPreferences({ ...preferences, language });
    i18n.changeLanguage(language);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await preferenceApi.update({
        currencyId: preferences.currencyId || undefined,
        countryId: preferences.countryId || undefined,
        occupation: preferences.occupation || undefined,
        monthlyIncome: preferences.monthlyIncome,
        language: preferences.language || undefined,
      });

      const savedOnboarding = localStorage.getItem('walletup-onboarding');
      if (savedOnboarding) {
        const onboardingData = JSON.parse(savedOnboarding);
        onboardingData.baseCurrency = preferences.currencyId;
        onboardingData.country = preferences.countryId;
        onboardingData.aiPreferences.occupation = preferences.occupation;
        onboardingData.aiPreferences.incomeRange = preferences.monthlyIncome?.toString() || '';
        localStorage.setItem('walletup-onboarding', JSON.stringify(onboardingData));
      }
      
      localStorage.setItem('walletup-settings', JSON.stringify({
        baseCurrency: preferences.currencyId,
        country: preferences.countryId,
      }));

      setToast({ message: t('settings.saved'), type: 'success' });
    } catch (error) {
      const apiError = error as ApiError;
      setToast({ message: apiError.message || t('settings.saveFailed'), type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1224]">
      <Header />

      <main className="lg:ml-64">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 pt-16 lg:pt-12">
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">{t('settings.title')}</h1>
            <p className="text-sm sm:text-base text-gray-400">{t('settings.subtitle')}</p>
          </div>

          {/* Settings Cards - responsive grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BaseCurrencySection
              value={preferences.currencyId}
              onChange={(currency) => setPreferences({ ...preferences, currencyId: currency })}
              currencies={currencies}
            />

            <CountrySection
              value={preferences.countryId}
              onChange={(country) => setPreferences({ ...preferences, countryId: country })}
              countries={countries}
            />

            <LanguageSection
              value={preferences.language}
              onChange={handleLanguageChange}
            />

            <div className="md:col-span-2">
              <PreferencesSection
                value={preferences}
                onChange={(prefs) => setPreferences({ ...preferences, ...prefs })}
              />
            </div>

            <div className="md:col-span-2">
              <ChangePasswordSection onToast={setToast} />
            </div>

            <div className="md:col-span-2">
              <DeleteAccountSection onToast={setToast} />
            </div>
          </div>
            {/* Save Button */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-white/5 hover:bg-white/10 text-white text-sm sm:text-base font-semibold rounded-xl transition-colors border border-white/10"
            >
              {t('settings.cancel')}
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-violet-500 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm sm:text-base font-semibold rounded-xl transition-colors"
            >
              {isLoading ? t('settings.saving') : t('settings.save')}
            </button>
          </div>
        </div>

        <Footer />
      </main>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
