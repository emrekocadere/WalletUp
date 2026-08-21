import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Hero = () => {
  const { t } = useTranslation('home');
  return (
    <section className="relative min-h-screen flex items-center pt-40 pb-16 px-4 overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source src="/292716.webm" type="video/webm" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/20" style={{ zIndex: 1 }} />

      {/* Subtle ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-700/10 blur-[140px]" />
        <div className="absolute top-1/3 -right-60 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 gap-16 items-center w-full">
          {/* Left: Text */}
          <div className="space-y-8 text-center mx-auto max-w-4xl">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
              <span className="text-white">{t('hero.titleLine1')}</span>
              <br />
              <span className="text-violet-500">
                {t('hero.titleLine2')}
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-100 leading-relaxed font-medium">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-violet-500 text-white font-bold rounded-2xl transition-colors duration-200"
              >
                {t('hero.startFree')}
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-2xl border border-white/15 transition-all"
              >
                {t('hero.signIn')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
