import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';
import { LoginForm } from '@/components/auth/LoginForm';
import { authApi } from '@/api/endpoints/auth.api';
import { setCredentials } from '@/store/slices/authSlice';
import type { LoginRequest } from '@/types/auth.types';
import type { ApiError } from '@/types/common.types';
import { PageLoader } from '@/components/common/PageLoader';
import toast from 'react-hot-toast';

export const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, onboarding_completed } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(onboarding_completed ? '/dashboard' : '/onboarding', { replace: true });
    }
  }, [isAuthenticated, onboarding_completed, navigate]);

  const handleLogin = async (data: LoginRequest) => {
    setIsLoading(true);

    try {
      const response = await authApi.login(data);

      if (!response.isSuccess) {
        // API başarısız - hata mesajı göster
        toast.error(response.error?.description || 'Login failed. Please try again.');
        return;
      }

      if (response.value?.accessToken) {
        dispatch(setCredentials({ accessToken: response.value.accessToken, isOnboardingCompleted: response.value.isOnboardingCompleted ?? false }));

        if (response.value.isOnboardingCompleted) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      }

    } catch (err) {
      const apiError = err as ApiError;
      toast.error(apiError.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <PageLoader message="Giriş yapılıyor..." />}

      <div className="min-h-screen bg-[#0d1224] flex items-center justify-center py-12 px-4 relative overflow-hidden">
        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-violet-700/15 blur-[120px]" />
          <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[100px]" />
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          {/* Currency icons */}
          <img src="https://www.freeiconspng.com/uploads/euro-icon-24.png" alt="" aria-hidden="true" className="absolute top-10 left-0 w-48 opacity-[0.06] blur-sm select-none rotate-[-12deg]" draggable={false} />
          <img src="https://www.freeiconspng.com/uploads/dollar-green-icon-5.png" alt="" aria-hidden="true" className="absolute bottom-10 right-0 w-56 opacity-[0.06] blur-sm select-none rotate-[10deg]" draggable={false} />
          <img src="/yen.png" alt="" aria-hidden="true" className="absolute top-1/2 -translate-y-1/2 right-10 w-40 opacity-[0.05] blur-sm select-none" draggable={false} />
        </div>

        <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left branding panel */}
          <div className="hidden lg:flex flex-col gap-8 pr-8">
            <Link to="/">
              <img src="/Logo2.svg" alt="WalletUp" className="h-12 w-28 object-cover hover:opacity-80 transition-opacity" />
            </Link>
            <div>
              <h1 className="text-4xl font-black text-white leading-tight mb-3">
                Welcome{' '}
                <span className="text-violet-400">back.</span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                Your finances, at a glance. Pick up right where you left off.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Track Expenses', sub: 'Log and categorize your spending', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
                { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', label: 'View Reports', sub: 'See where your money goes', color: 'text-indigo-400', bg: 'bg-indigo-500/15' },
                { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Set Goals', sub: 'Plan your savings targets', color: 'text-violet-400', bg: 'bg-violet-500/15' },
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

          {/* Right form card */}
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-8 sm:p-10">
            {/* Mobile logo */}
            <div className="lg:hidden mb-6">
              <Link to="/">
                <img src="/Logo2.svg" alt="WalletUp" className="h-10 w-24 object-cover" />
              </Link>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-black text-white mb-1">Sign In</h2>
              <p className="text-gray-500 text-sm">Welcome back to WalletUp</p>
            </div>

            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

            <div className="mt-7 pt-6 border-t border-white/8">
              <p className="text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                  Create one →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
