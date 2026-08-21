import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const CTASection = () => {
  const { t } = useTranslation('home');
  return (
    <section id="stats" className="relative z-10 px-4 py-24">
      <div className="max-w-6xl mx-auto">

        {/* CTA banner */}
        <div className="relative overflow-hidden  from-violet-900/80 to-indigo-900/80 backdrop-blur-2xl rounded-3xl border border-violet-400/25 p-10 md:p-16">
          {/* Decorative blobs */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-3 tracking-tight">
                {t('ctaSection.titlePrefix')}{' '}
                <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">{t('ctaSection.titleEmphasis')}</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-lg">
                {t('ctaSection.subtitle')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl transition-colors duration-200 whitespace-nowrap"
              >
                {t('ctaSection.getStartedFree')}
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-2xl border border-white/15 transition-all whitespace-nowrap"
              >
                {t('ctaSection.signIn')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
