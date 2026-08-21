import { useTranslation } from 'react-i18next';

interface EmptyGoalsStateProps {
  onCreateGoal: () => void;
}

export const EmptyGoalsState = ({ onCreateGoal }: EmptyGoalsStateProps) => {
  const { t } = useTranslation('goals');
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">{t('emptyState.title')}</h2>
      <p className="text-gray-400 mb-6">{t('emptyState.subtitle')}</p>
      <button
        onClick={onCreateGoal}
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all"
      >
        {t('emptyState.cta')}
      </button>
    </div>
  );
};
