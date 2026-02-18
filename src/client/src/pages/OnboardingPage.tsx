import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setOnboardingCompleted } from '@/store/slices/authSlice';
import { Toast } from '@/components/common/Toast';
import { ProgressIndicator } from '@/components/onboarding/common/ProgressIndicator';
import { NavigationFooter } from '@/components/onboarding/common/NavigationFooter';
import { WelcomeStep } from '@/components/onboarding/steps/WelcomeStep';
import { CurrencyStep } from '@/components/onboarding/steps/CurrencyStep';
import { CountryStep } from '@/components/onboarding/steps/CountryStep';
import { UseCaseStep } from '@/components/onboarding/steps/UseCaseStep';
import { GoalsStep } from '@/components/onboarding/steps/GoalsStep';
import { AIPreferencesStep } from '@/components/onboarding/steps/AIPreferencesStep';
import { transactionsApi } from '@/api/endpoints/transactions.api';
import { preferenceApi } from '@/api/endpoints/preferences.api';
import type { Country, Currency, AIPreferences } from '@/types/model.types';

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const [countries, setCountries] = useState<Country[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  
  const [onboardingData, setOnboardingData] = useState({
    baseCurrency: '',
    country: '',
    useCase: '',
    financialGoals: [] as string[],
    aiPreferences: {
      enabled: true,
      enableInsights: true,
      insightsFrequency: 'daily',
      spendingCategories: [] as string[],
      budgetAlerts: true,
      investmentAdvice: false,
      occupation: '',
      incomeRange: '',
      riskTolerance: 'moderate',
      financialExperience: 'beginner',
      focusArea: '',
    }
  });

  // Load Countries and Currencies from API
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
        console.error('Failed to fetch countries and currencies:', error);
        setToast({ message: 'Failed to load data', type: 'error' });
      }
    };
    
    fetchData();
  }, []);

  const totalSteps = 5;

  const toggleGoal = (id: string) => {
    setOnboardingData({
      ...onboardingData,
      financialGoals: onboardingData.financialGoals.includes(id)
        ? onboardingData.financialGoals.filter((g) => g !== id)
        : [...onboardingData.financialGoals, id],
    });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return onboardingData.baseCurrency !== '';
      case 2:
        return onboardingData.country !== '';
      case 3:
        return onboardingData.useCase !== '';
      case 4:
        return onboardingData.financialGoals.length > 0;
      case 5:
        return true; // AI preferences step is optional
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!canProceed() && step !== 0) {
      setToast({ message: 'Please make a selection to continue', type: 'error' });
      return;
    }
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    if (!canProceed()) {
      setToast({ message: 'Please select at least one financial goal', type: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      await preferenceApi.create({
        currencyId: onboardingData.baseCurrency,
        countryId: onboardingData.country,
        occupation: onboardingData.aiPreferences.occupation || undefined,
        monthlyIncome: onboardingData.aiPreferences.incomeRange 
          ? parseFloat(onboardingData.aiPreferences.incomeRange) 
          : undefined,
      });

      localStorage.setItem('walletup-onboarding', JSON.stringify(onboardingData));
      localStorage.setItem('walletup-settings', JSON.stringify({
        baseCurrency: onboardingData.baseCurrency,
        country: onboardingData.country,
        aiEnabled: true,
        aiInsightsFrequency: 'daily',
        aiAutoAnalyze: true,
      }));

      dispatch(setOnboardingCompleted(true));

      setToast({ message: 'Setup complete! Taking you to your dashboard...', type: 'success' });
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Failed to create preference:', error);
      setToast({ message: 'Failed to save preferences. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAIPreferencesChange = (preferences: Partial<AIPreferences>) => {
    setOnboardingData({
      ...onboardingData,
      aiPreferences: {
        ...onboardingData.aiPreferences,
        ...preferences,
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">

        <div className="text-center mb-8">
          <img 
            src="/Logo2.svg" 
            alt="WalletUp Logo" 
            className="h-16 w-32 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <h1 className="text-3xl font-bold text-white mb-2">WalletUp</h1>
          <p className="text-gray-400">Your Smart Financial Companion</p>
        </div>
        <ProgressIndicator currentStep={step} totalSteps={totalSteps} />

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 overflow-hidden">
          <div className="p-8 min-h-[400px] flex flex-col">
            {step === 0 && <WelcomeStep />}

            {step === 1 && (
              <CurrencyStep
                currencies={currencies}
                selectedCurrency={onboardingData.baseCurrency}
                onCurrencyChange={(currency) =>
                  setOnboardingData({ ...onboardingData, baseCurrency: currency })
                }
              />
            )}

            {step === 2 && (
              <CountryStep
                countries={countries}
                selectedCountry={onboardingData.country}
                onCountryChange={(country) =>
                  setOnboardingData({ ...onboardingData, country })
                }
              />
            )}

            {step === 3 && (
              <UseCaseStep
                selectedUseCase={onboardingData.useCase}
                onUseCaseChange={(useCase) =>
                  setOnboardingData({ ...onboardingData, useCase })
                }
              />
            )}

            {step === 4 && (
              <GoalsStep
                selectedGoals={onboardingData.financialGoals}
                onGoalToggle={toggleGoal}
              />
            )}

            {step === 5 && (
              <AIPreferencesStep
                aiPreferences={onboardingData.aiPreferences}
                onAIPreferencesChange={handleAIPreferencesChange}
              />
            )}
          </div>

          <NavigationFooter
            currentStep={step}
            totalSteps={totalSteps}
            canProceed={canProceed()}
            isLoading={isLoading}
            onBack={handleBack}
            onNext={handleNext}
            onComplete={handleComplete}
          />
        </div>

       
        {step > 0 && step < totalSteps && (
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              Skip for now →
            </button>
          </div>
        )}
      </div>

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
