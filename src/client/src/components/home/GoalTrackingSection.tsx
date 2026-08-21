import { useTranslation } from 'react-i18next';

const FEATURE_KEYS = ['customGoals', 'visualProgress', 'deadlineTracking', 'smartSuggestions'] as const;

export const GoalTrackingSection = () => {
  const { t } = useTranslation('home');
  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">
      <div className="bg-primary-500/5 backdrop-blur-xl p-12 rounded-3xl border border-primary-500/20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - Icon & Visual */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-indigo-500/5 rounded-3xl flex items-center justify-center border border-indigo-500/30">
              <svg className="w-16 h-16 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4">
              <span className="text-xs font-semibold text-indigo-300">{t('goalTrackingSection.badge')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('goalTrackingSection.title')}
            </h2>
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              {t('goalTrackingSection.description')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FEATURE_KEYS.map((key) => (
                <div key={key} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{t(`goalTrackingSection.features.${key}.title`)}</h4>
                    <p className="text-sm text-gray-400">{t(`goalTrackingSection.features.${key}.description`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
