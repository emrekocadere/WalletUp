import { useTranslation } from 'react-i18next';

interface LineItem {
  icon: React.ReactNode;
  key: string;
  path: string;
}

const items: LineItem[] = [
  {
    path: '/insights',
    key: 'insights',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.657-6.657l-1.414 1.414M6.757 17.243l-1.414 1.414m12.728 0l-1.414-1.414M6.757 6.757L5.343 5.343M12 8a4 4 0 100 8 4 4 0 000-8z" />
    ),
  },
  {
    path: '/reports',
    key: 'reports',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19V9m6 10V5m6 14V13M3 19V15" />
    ),
  },
  {
    path: '/goals',
    key: 'goals',
    icon: (
      <>
        <circle cx="12" cy="12" r="8" strokeWidth={1.75} />
        <circle cx="12" cy="12" r="4" strokeWidth={1.75} />
        <circle cx="12" cy="12" r="0.5" strokeWidth={1.75} fill="currentColor" />
      </>
    ),
  },
  {
    path: '/recurring',
    key: 'recurring',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 4v5h5M20 20v-5h-5M4.5 9a8 8 0 0114.5-3.5M19.5 15a8 8 0 01-14.5 3.5" />
    ),
  },
  {
    path: '/transactions',
    key: 'csvExport',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 16.5V9.75m0 0l-3 3m3-3l3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0111.25 19.5H6.75z" />
    ),
  },
  {
    path: '/accounts',
    key: 'multiCurrency',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 8h10M7 8a2 2 0 012-2h4a2 2 0 012 2M7 8v8a2 2 0 002 2h6a2 2 0 002-2V8M10 12h4" />
    ),
  },
  {
    path: '/security',
    key: 'security',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
    ),
  },
];

export const FeaturesSection = () => {
  const { t } = useTranslation('home');
  return (
    <section id="features" className="relative z-10 px-4 py-24 sm:py-32">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <div className="mb-14">
          <p className="font-mono text-xs tracking-[0.25em] text-violet-400/80 uppercase mb-4">
            {t('featuresSection.eyebrow')}
          </p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
            {t('featuresSection.titlePrefix')}<span className="text-violet-400 italic">{t('featuresSection.titleEmphasis')}</span>{t('featuresSection.titleSuffix')}
          </h2>
          <p className="text-gray-400 text-lg mt-4 max-w-md">
            {t('featuresSection.subtitle')}
          </p>
        </div>

        {/* Ledger */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden">
          {items.map((item, i) => (
            <div
              key={item.key}
              className={`group flex items-start gap-4 sm:gap-5 px-5 sm:px-7 py-6 transition-colors hover:bg-white/[0.03] ${
                i !== items.length - 1 ? 'border-b border-white/10' : ''
              }`}
            >
              <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-violet-400 group-hover:border-violet-400/30 transition-colors">
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  {item.icon}
                </svg>
              </div>

              <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
                <div>
                  <h3 className="text-base font-bold text-white mb-1">{t(`featuresSection.items.${item.key}.name`)}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed max-w-md">{t(`featuresSection.items.${item.key}.description`)}</p>
                </div>
                <span className="font-mono text-xs text-gray-600 group-hover:text-violet-400/70 transition-colors whitespace-nowrap flex-shrink-0">
                  {item.path}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
