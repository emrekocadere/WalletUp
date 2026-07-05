import { Link } from 'react-router-dom';
import { useState } from 'react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-5">
      <div className="max-w-6xl mx-auto">
        <nav className="flex items-center justify-between px-5 py-3 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/40">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/Logo2.svg"
              alt="WalletUp"
              className="h-10 w-24 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <a href="#features" className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/8 rounded-xl transition-all font-medium">
              Features
            </a>
            <a href="#stats" className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/8 rounded-xl transition-all font-medium">
              Why Us
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:block text-sm text-gray-300 hover:text-white transition-colors font-medium px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 active:scale-95"
            >
              Get Started
            </Link>
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
                Features
              </a>
              <a href="#stats" className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium text-sm">
                Why Us
              </a>
              <Link to="/login" className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium text-sm">
                Sign In
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
