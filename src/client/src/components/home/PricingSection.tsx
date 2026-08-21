import { useTranslation } from 'react-i18next';

const CheckIcon = () => (
  <svg className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export const PricingSection = () => {
  const { t } = useTranslation('home');
  const freeFeatures = t('pricingSection.free.features', { returnObjects: true }) as string[];
  const plusFeatures = t('pricingSection.plus.features', { returnObjects: true }) as { title: string; description: string }[];

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">{t('pricingSection.title')}</h2>
        <p className="text-gray-400 text-lg">{t('pricingSection.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
          <h3 className="text-2xl font-bold text-white mb-2">{t('pricingSection.free.name')}</h3>
          <div className="mb-6">
            <span className="text-4xl font-bold text-white">{t('pricingSection.free.price')}</span>
            <span className="text-gray-400 ml-2">{t('pricingSection.free.period')}</span>
          </div>
          <p className="text-gray-400 mb-6">{t('pricingSection.free.description')}</p>
          <ul className="space-y-3 mb-8">
            {freeFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <CheckIcon />
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Plus Plan */}
        <div className="bg-gradient-to-br from-primary-500/20 to-indigo-500/20 backdrop-blur-xl p-8 rounded-2xl border-2 border-primary-500/50 hover:border-primary-500/70 transition-all relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <span className="bg-gradient-to-r from-primary-500 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
              {t('pricingSection.plus.badge')}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{t('pricingSection.plus.name')}</h3>
          <div className="mb-6">
            <span className="text-4xl font-bold text-white">{t('pricingSection.plus.price')}</span>
            <span className="text-gray-400 ml-2">{t('pricingSection.plus.period')}</span>
          </div>
          <p className="text-gray-400 mb-6">{t('pricingSection.plus.description')}</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <CheckIcon />
              <span className="text-white font-semibold">{t('pricingSection.plus.everythingInFree')}</span>
            </li>
            {plusFeatures.map((feature) => (
              <li key={feature.title} className="flex items-start gap-3">
                <CheckIcon />
                <span className="text-gray-300"><strong className="text-white">{feature.title}</strong> - {feature.description}</span>
              </li>
            ))}
            <li className="flex items-start gap-3">
              <CheckIcon />
              <span className="text-gray-300">{t('pricingSection.plus.prioritySupport')}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
