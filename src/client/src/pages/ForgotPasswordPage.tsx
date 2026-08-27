import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { authApi } from '@/api/endpoints/auth.api';
import { PageLoader } from '@/components/common/PageLoader';

type Step = 'email' | 'otp' | 'reset';

const PasswordEyeIcon = ({ visible }: { visible: boolean }) => {
  if (visible) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.6 18.6 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
};

const inputClass =
  'mt-1 block w-full rounded-xl border-2 border-white/20 bg-white/5 backdrop-blur-sm px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400/50 focus:outline-none focus:ring-4 focus:ring-purple-500/10 disabled:bg-white/5 disabled:cursor-not-allowed transition-all duration-200 hover:border-white/30';

export const ForgotPasswordPage = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('email');
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error(t('forgotPassword.errors.emailInvalid'));
      return;
    }

    setIsLoading(true);
    try {
      const result = await authApi.forgotPassword({ email });
      if (!result.isSuccess) {
        toast.error(result.error?.description || t('forgotPassword.genericError'));
        return;
      }
      toast.success(t('forgotPassword.codeSent'));
      setStep('otp');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      toast.error(t('forgotPassword.errors.otpInvalid'));
      return;
    }

    setIsLoading(true);
    try {
      const result = await authApi.verifyOtp({ email, otpCode });
      if (!result.isSuccess) {
        toast.error(result.error?.description || t('forgotPassword.genericError'));
        return;
      }
      setStep('reset');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error(t('forgotPassword.errors.passwordTooShort'));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t('forgotPassword.errors.passwordsDoNotMatch'));
      return;
    }

    setIsLoading(true);
    try {
      const result = await authApi.resetPassword({ email, otpCode, newPassword });
      if (!result.isSuccess) {
        toast.error(result.error?.description || t('forgotPassword.genericError'));
        return;
      }
      toast.success(t('forgotPassword.passwordResetSuccess'));
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <PageLoader message={t('forgotPassword.loadingMessage')} />}

      <div className="min-h-screen bg-[#0d1224] flex items-center justify-center py-12 px-4 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-purple-700/15 blur-[120px]" />
          <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[100px]" />
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-8 sm:p-10">
            <div className="mb-6">
              <Link to="/">
                <img src="/Logo2.svg" alt="WalletUp" className="h-10 w-24 object-cover" />
              </Link>
            </div>

            {step === 'email' && (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-white mb-1">{t('forgotPassword.title')}</h2>
                  <p className="text-gray-500 text-sm">{t('forgotPassword.subtitle')}</p>
                </div>
                <form onSubmit={handleSendCode} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-200">
                      {t('forgotPassword.email')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      className={inputClass}
                      placeholder={t('forgotPassword.emailPlaceholder')}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 px-4 bg-purple-500 hover:bg-purple-700 text-white font-bold rounded-xl disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {t('forgotPassword.sendCode')}
                  </button>
                </form>
              </>
            )}

            {step === 'otp' && (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-white mb-1">{t('forgotPassword.otpTitle')}</h2>
                  <p className="text-gray-500 text-sm">{t('forgotPassword.otpSubtitle', { email })}</p>
                </div>
                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div>
                    <label htmlFor="otpCode" className="block text-sm font-semibold text-gray-200">
                      {t('forgotPassword.otpCode')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="otpCode"
                      name="otpCode"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      disabled={isLoading}
                      className={`${inputClass} tracking-[0.5em] text-center text-lg`}
                      placeholder="••••••"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 px-4 bg-purple-500 hover:bg-purple-700 text-white font-bold rounded-xl disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {t('forgotPassword.verifyCode')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    disabled={isLoading}
                    className="w-full text-sm text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    {t('forgotPassword.changeEmail')}
                  </button>
                </form>
              </>
            )}

            {step === 'reset' && (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-white mb-1">{t('forgotPassword.resetTitle')}</h2>
                  <p className="text-gray-500 text-sm">{t('forgotPassword.resetSubtitle')}</p>
                </div>
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-200">
                      {t('forgotPassword.newPassword')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-1">
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={isLoading}
                        className={`${inputClass} mt-0 pr-11`}
                        placeholder={t('forgotPassword.newPasswordPlaceholder')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        disabled={isLoading}
                        tabIndex={-1}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-200 disabled:cursor-not-allowed"
                        aria-label={showPassword ? t('registerForm.hidePassword') : t('registerForm.showPassword')}
                      >
                        <PasswordEyeIcon visible={showPassword} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="confirmNewPassword" className="block text-sm font-semibold text-gray-200">
                      {t('forgotPassword.confirmNewPassword')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative mt-1">
                      <input
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        className={`${inputClass} mt-0 pr-11`}
                        placeholder={t('forgotPassword.newPasswordPlaceholder')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        disabled={isLoading}
                        tabIndex={-1}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-200 disabled:cursor-not-allowed"
                        aria-label={showConfirmPassword ? t('registerForm.hidePassword') : t('registerForm.showPassword')}
                      >
                        <PasswordEyeIcon visible={showConfirmPassword} />
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 px-4 bg-purple-500 hover:bg-purple-700 text-white font-bold rounded-xl disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {t('forgotPassword.resetPasswordSubmit')}
                  </button>
                </form>
              </>
            )}

            <div className="mt-7 pt-6 border-t border-white/8">
              <p className="text-center text-sm text-gray-500">
                <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                  {t('forgotPassword.backToLogin')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
