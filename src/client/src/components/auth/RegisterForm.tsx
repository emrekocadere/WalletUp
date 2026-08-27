import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { RegisterRequest } from '@/types/auth.types';
import { GoogleSignInButton } from './GoogleSignInButton';

interface RegisterFormProps {
  onSubmit: (data: RegisterRequest) => void;
  isLoading?: boolean;
  error?: string | null;
}

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

export const RegisterForm = ({ onSubmit, isLoading = false, error }: RegisterFormProps) => {
  const { t } = useTranslation('auth');
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    surname: '',
    name: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterRequest | 'confirmPassword', string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterRequest | 'confirmPassword', string>> = {};

    if (!formData.email) {
      newErrors.email = t('registerForm.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('registerForm.errors.emailInvalid');
    }

    if (!formData.password) {
      newErrors.password = t('registerForm.errors.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('registerForm.errors.passwordTooShort');
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t('registerForm.errors.confirmPasswordRequired');
    } else if (confirmPassword !== formData.password) {
      newErrors.confirmPassword = t('registerForm.errors.passwordsDoNotMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof RegisterRequest]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-200">
            {t('registerForm.name')}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 block w-full rounded-xl border-2 border-white/20 bg-white/5 backdrop-blur-sm px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400/50 focus:outline-none focus:ring-4 focus:ring-purple-500/10 disabled:bg-white/5 disabled:cursor-not-allowed transition-all duration-200 hover:border-white/30"
            placeholder={t('registerForm.namePlaceholder')}
          />
        </div>

        <div>
          <label htmlFor="surname" className="block text-sm font-semibold text-gray-200">
            {t('registerForm.surname')} <span className="text-red-500">*</span>
          </label>
          <input
            id="surname"
            name="surname"
            type="text"
            required
            value={formData.surname}
            onChange={handleChange}
            disabled={isLoading}
            className="mt-1 block w-full rounded-xl border-2 border-white/20 bg-white/5 backdrop-blur-sm px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400/50 focus:outline-none focus:ring-4 focus:ring-purple-500/10 disabled:bg-white/5 disabled:cursor-not-allowed transition-all duration-200 hover:border-white/30"
            placeholder={t('registerForm.surnamePlaceholder')}
          />
          {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-200">
          {t('registerForm.email')} <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-1 block w-full rounded-xl border-2 border-white/20 bg-white/5 backdrop-blur-sm px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400/50 focus:outline-none focus:ring-4 focus:ring-purple-500/10 disabled:bg-white/5 disabled:cursor-not-allowed transition-all duration-200 hover:border-white/30"
          placeholder={t('registerForm.emailPlaceholder')}
        />
        {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-gray-200">
          {t('registerForm.password')} <span className="text-red-500">*</span>
        </label>
        <div className="relative mt-1">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            className="block w-full rounded-xl border-2 border-white/20 bg-white/5 backdrop-blur-sm px-4 py-3 pr-11 text-white placeholder-gray-400 focus:border-purple-400/50 focus:outline-none focus:ring-4 focus:ring-purple-500/10 disabled:bg-white/5 disabled:cursor-not-allowed transition-all duration-200 hover:border-white/30"
            placeholder={t('registerForm.passwordPlaceholder')}
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
        {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-200">
          {t('registerForm.confirmPassword')} <span className="text-red-500">*</span>
        </label>
        <div className="relative mt-1">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            disabled={isLoading}
            className="block w-full rounded-xl border-2 border-white/20 bg-white/5 backdrop-blur-sm px-4 py-3 pr-11 text-white placeholder-gray-400 focus:border-purple-400/50 focus:outline-none focus:ring-4 focus:ring-purple-500/10 disabled:bg-white/5 disabled:cursor-not-allowed transition-all duration-200 hover:border-white/30"
            placeholder={t('registerForm.confirmPasswordPlaceholder')}
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
        {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-4 bg-purple-500 hover:bg-purple-700 text-white font-bold rounded-xl disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isLoading ? t('registerForm.submitting') : t('registerForm.submit')}
      </button>

      <GoogleSignInButton
        isLoading={isLoading}
        onClick={() => {}}
      />
    </form>
  );
};
