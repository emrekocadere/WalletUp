import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { authApi } from '@/api/endpoints/auth.api';
import { setCredentials } from '@/store/slices/authSlice';
import type { RegisterRequest } from '@/types/auth.types';
import type { ApiError } from '@/types/common.types';
import { PageLoader } from '@/components/common/PageLoader';

export const RegisterPage = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.register(data);

      if (!response.isSuccess) {
        // API başarısız - hata mesajı göster
        setError(response.error?.description || t('register.genericError'));
        return;
      }

      if (response.value?.accessToken) {
        dispatch(setCredentials({
          accessToken: response.value.accessToken,
          isOnboardingCompleted: response.value.isOnboardingCompleted ?? false,
        }));
        navigate('/onboarding');
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || t('register.genericError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <PageLoader message={t('register.loadingMessage')} />}

      <div className="min-h-screen bg-[#0d1224] flex items-center justify-center py-12 px-4 relative overflow-hidden">
        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-purple-700/15 blur-[120px]" />
          <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[100px]" />
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          {/* Currency icons */}
          <img src="https://www.freeiconspng.com/uploads/dollar-green-icon-5.png" alt="" aria-hidden="true" className="absolute top-10 right-0 w-48 opacity-[0.06] blur-sm select-none rotate-[10deg]" draggable={false} />
          <img src="https://www.freeiconspng.com/uploads/euro-icon-24.png" alt="" aria-hidden="true" className="absolute bottom-10 left-0 w-52 opacity-[0.06] blur-sm select-none rotate-[-8deg]" draggable={false} />
          <img src="/yen.png" alt="" aria-hidden="true" className="absolute top-1/2 -translate-y-1/2 left-10 w-36 opacity-[0.05] blur-sm select-none" draggable={false} />
        </div>

        <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Right form card (first on mobile, second on desktop) */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-8 sm:p-10 order-1 lg:order-none">
            {/* Mobile logo */}
            <div className="lg:hidden mb-6">
              <Link to="/">
                <img src="/Logo2.svg" alt="WalletUp" className="h-10 w-24 object-cover" />
              </Link>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-black text-white mb-1">{t('register.title')}</h2>
              <p className="text-gray-500 text-sm">{t('register.subtitleCard')}</p>
            </div>

            <RegisterForm onSubmit={handleRegister} isLoading={isLoading} error={error} />

            <div className="mt-7 pt-6 border-t border-white/8">
              <p className="text-center text-sm text-gray-500">
                {t('register.haveAccount')}{' '}
                <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                  {t('register.signIn')}
                </Link>
              </p>
            </div>
          </div>

          {/* Left branding panel */}
          <div className="hidden lg:flex flex-col gap-8 pl-8">
            <Link to="/">
              <img src="/Logo2.svg" alt="WalletUp" className="h-12 w-28 object-cover hover:opacity-80 transition-opacity" />
            </Link>
            <div>
              <h1 className="text-4xl font-black text-white leading-tight mb-3">
                {t('register.heading')}{' '}
                <span className="text-purple-400">{t('register.headingHighlight')}</span>
                {' '}{t('register.headingSuffix')}
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                {t('register.subtitle')}
              </p>
            </div>
            <div className="space-y-4">
              {[
                { icon: 'M13 10V3L4 14h7v7l9-11h-7z', label: t('register.features.simpleSetup.label'), sub: t('register.features.simpleSetup.sub'), color: 'text-purple-400', bg: 'bg-purple-500/15' },
                { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', label: t('register.features.trackSpending.label'), sub: t('register.features.trackSpending.sub'), color: 'text-indigo-400', bg: 'bg-indigo-500/15' },
                { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', label: t('register.features.privacy.label'), sub: t('register.features.privacy.sub'), color: 'text-purple-400', bg: 'bg-purple-500/15' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <svg className={`w-5 h-5 ${item.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
