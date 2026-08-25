import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { RegisterRequest } from '@/types/auth.types';
import { GoogleSignInButton } from './GoogleSignInButton';

interface RegisterFormProps {
  onSubmit: (data: RegisterRequest) => void;
  isLoading?: boolean;
  error?: string | null;
}

export const RegisterForm = ({ onSubmit, isLoading = false, error }: RegisterFormProps) => {
  const { t } = useTranslation('auth');
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    surname: '',
    name: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterRequest, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterRequest, string>> = {};

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
            className="mt-1 block w-full rounded-xl border-2 border-white/20 bg-white/5 backdrop-blur-sm px-4 py-3 text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-500/20 disabled:bg-white/5 disabled:cursor-not-allowed transition-all duration-200 hover:border-white/30"
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
            className="mt-1 block w-full rounded-xl border-2 border-white/20 bg-white/5 backdrop-blur-sm px-4 py-3 text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-500/20 disabled:bg-white/5 disabled:cursor-not-allowed transition-all duration-200 hover:border-white/30"
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
          className="mt-1 block w-full rounded-xl border-2 border-white/20 bg-white/5 backdrop-blur-sm px-4 py-3 text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-500/20 disabled:bg-white/5 disabled:cursor-not-allowed transition-all duration-200 hover:border-white/30"
          placeholder={t('registerForm.emailPlaceholder')}
        />
        {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-gray-200">
          {t('registerForm.password')} <span className="text-red-500">*</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-1 block w-full rounded-xl border-2 border-white/20 bg-white/5 backdrop-blur-sm px-4 py-3 text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-500/20 disabled:bg-white/5 disabled:cursor-not-allowed transition-all duration-200 hover:border-white/30"
          placeholder={t('registerForm.passwordPlaceholder')}
        />
        {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-4 bg-violet-500 hover:bg-violet-700 text-white font-bold rounded-xl disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
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
