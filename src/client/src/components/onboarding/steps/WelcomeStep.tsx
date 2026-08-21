import { useTranslation } from 'react-i18next';

export const WelcomeStep = () => {
  const { t } = useTranslation('onboarding');
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <h2 className="text-3xl font-bold text-white mb-3">{t('welcomeStep.title')}</h2>
      <p className="text-gray-400 max-w-sm">
        {t('welcomeStep.description')}
      </p>
    </div>
  );
};
