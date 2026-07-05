import { useState } from 'react';
import type { LoginRequest } from '@/types/auth.types';
import { GoogleSignInButton } from './GoogleSignInButton';

interface LoginFormProps {
  onSubmit: (data: LoginRequest) => void;
  isLoading?: boolean;
}

export const LoginForm = ({ onSubmit, isLoading = false }: LoginFormProps) => {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LoginRequest, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LoginRequest, string>> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
    if (errors[name as keyof LoginRequest]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-200">
          Email <span className="text-red-400">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          className={`mt-1 block w-full rounded-xl border-2 bg-white/5 backdrop-blur-sm px-4 py-3 text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-500/20 disabled:bg-white/5 disabled:cursor-not-allowed transition-all duration-200 hover:border-white/30 ${
            errors.email ? 'border-red-500/50 hover:border-red-500/70' : 'border-white/20'
          }`}
          placeholder="you@example.com"
        />
        {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-gray-200">
          Password <span className="text-red-400">*</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          className={`mt-1 block w-full rounded-xl border-2 bg-white/5 backdrop-blur-sm px-4 py-3 text-white placeholder-gray-400 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-500/20 disabled:bg-white/5 disabled:cursor-not-allowed transition-all duration-200 hover:border-white/30 ${
            errors.password ? 'border-red-500/50 hover:border-red-500/70' : 'border-white/20'
          }`}
          placeholder="••••••••"
        />
        {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-4 bg-gradient-to-r from-primary-600 to-primary-400 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:shadow-none transition-shadow duration-300"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>

      <GoogleSignInButton isLoading={isLoading}  />
    </form>
  );
};
