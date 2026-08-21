import { useTranslation } from 'react-i18next';
import type { AIPreferences } from '@/types/model.types';
import { getCurrencySymbol } from '@/utils/formatters';

interface AIPreferencesStepProps {
  aiPreferences: AIPreferences;
  onAIPreferencesChange: (preferences: Partial<AIPreferences>) => void;
  currencyCode?: string;
}

export const AIPreferencesStep = ({ aiPreferences, onAIPreferencesChange, currencyCode }: AIPreferencesStepProps) => {
  const { t } = useTranslation('onboarding');
  const currencySymbol = getCurrencySymbol(currencyCode);
  const handleInputChange = (key: keyof AIPreferences, value: any) => {
    onAIPreferencesChange({ [key]: value });
  };

  return (
    <div className="flex-1">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">{t('aiPreferencesStep.title')}</h2>
        <p className="text-gray-400">{t('aiPreferencesStep.subtitle')}</p>
      </div>

      <div className="space-y-6 max-w-md mx-auto">

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <label className="text-white font-semibold text-sm mb-3 block">{t('aiPreferencesStep.occupationLabel')}</label>
          <input
            type="text"
            placeholder={t('aiPreferencesStep.occupationPlaceholder')}
            value={aiPreferences.occupation}
            onChange={(e) => handleInputChange('occupation', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-primary-400/50 focus:outline-none transition-colors"
          />
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <label className="text-white font-semibold text-sm mb-3 block">{t('aiPreferencesStep.incomeLabel')}</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {currencySymbol}
            </span>
            <input
              type="number"
              placeholder={t('aiPreferencesStep.incomePlaceholder')}
              value={aiPreferences.incomeRange || ''}
              onChange={(e) => handleInputChange('incomeRange', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-primary-400/50 focus:outline-none transition-colors"
              min="0"
            />
          </div>
        </div>

       

      </div>
    </div>
  );
};
