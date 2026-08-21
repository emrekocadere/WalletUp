import { useTranslation } from 'react-i18next';

const useCaseIds = ['personal', 'family', 'business', 'freelance'] as const;

interface UseCaseStepProps {
  selectedUseCase: string;
  onUseCaseChange: (useCase: string) => void;
}

export const UseCaseStep = ({ selectedUseCase, onUseCaseChange }: UseCaseStepProps) => {
  const { t } = useTranslation('onboarding');
  return (
    <div className="flex-1">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">{t('useCaseStep.title')}</h2>
        <p className="text-gray-400">{t('useCaseStep.subtitle')}</p>
      </div>

      <div className="space-y-2.5">
        {useCaseIds.map((id) => (
          <button
            key={id}
            onClick={() => onUseCaseChange(id)}
            className={`w-full px-4 py-3 rounded-xl border transition-all text-left flex items-center justify-between ${
              selectedUseCase === id
                ? 'border-primary-500/50 bg-primary-500/10 text-white'
                : 'border-slate-700 bg-slate-800/30 hover:border-slate-600 text-gray-300'
            }`}
          >
            <span className="font-medium">{t(`useCaseStep.options.${id}.label`)}</span>
            {selectedUseCase === id && (
              <svg className="w-4 h-4 text-primary-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
