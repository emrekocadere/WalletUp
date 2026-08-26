import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageDropdown } from '@/components/common/LanguageDropdown';

export const Header = () => {
  const { t } = useTranslation('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-5">
      <div className="max-w-6xl mx-auto">
        <nav className="relative flex items-center justify-between px-5 py-3 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/40">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/Logo2.svg"
              alt="WalletUp"
              className="h-10 w-24 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            <a href="#features" className="px-4 py-2 text-sm text-gray-200 hover:text-white hover:bg-white/8 rounded-xl transition-all font-medium">
              {t('header.features')}
            </a>
            <a href="#stats" className="px-4 py-2 text-sm text-gray-200 hover:text-white hover:bg-white/8 rounded-xl transition-all font-medium">
              {t('header.whyUs')}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:block text-sm bg-slate-700 hover:bg-slate-600 text-white font-medium px-4 py-2 rounded-xl transition-all"
            >
              {t('header.signIn')}
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-purple-500 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-colors duration-200"
            >
              {t('header.getStarted')}
            </Link>
            <LanguageDropdown className="hidden sm:flex" align="right" />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="md:hidden mt-2 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-white/10 overflow-hidden">
            <nav className="flex flex-col p-3 space-y-1">
              <a href="#features" className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium text-sm">
                {t('header.features')}
              </a>
              <a href="#stats" className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium text-sm">
                {t('header.whyUs')}
              </a>
              <Link to="/login" className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium text-sm">
                {t('header.signIn')}
              </Link>
              <div className="px-4 py-2">
                <LanguageDropdown />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
