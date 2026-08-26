import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@/api/client/axios.client';
import type { Result } from '@/types/common.types';

interface ChangePasswordSectionProps {
  onToast: (toast: { message: string; type: 'success' | 'error' }) => void;
}

export const ChangePasswordSection = ({ onToast }: ChangePasswordSectionProps) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = t('settings.changePassword.errors.currentRequired');
    }
    if (!formData.newPassword) {
      newErrors.newPassword = t('settings.changePassword.errors.newRequired');
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = t('settings.changePassword.errors.newTooShort');
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('settings.changePassword.errors.confirmRequired');
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t('settings.changePassword.errors.mismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await apiClient.post<Result>('/Identity/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response.data.isSuccess) {
        onToast({ message: t('settings.changePassword.toastSuccess'), type: 'success' });
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setErrors({});
        setIsExpanded(false);
      } else {
        onToast({ message: String(response.data.error || t('settings.changePassword.toastFailed')), type: 'error' });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || t('settings.changePassword.toastFailed');
      onToast({ message: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between "
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-white">{t('settings.changePassword.title')}</h3>
            <p className="text-sm text-gray-400">{t('settings.changePassword.subtitle')}</p>
          </div>
        </div>
        <svg
          className={`w-6 h-6 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {isExpanded && (
        <div className="border-t border-slate-700 px-6 py-6 space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('settings.changePassword.current')}</label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => {
                setFormData({ ...formData, currentPassword: e.target.value });
                if (errors.currentPassword) {
                  setErrors({ ...errors, currentPassword: '' });
                }
              }}
              placeholder={t('settings.changePassword.currentPlaceholder')}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            {errors.currentPassword && (
              <p className="text-sm text-red-400 mt-1">{errors.currentPassword}</p>
            )}
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('settings.changePassword.new')}</label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => {
                setFormData({ ...formData, newPassword: e.target.value });
                if (errors.newPassword) {
                  setErrors({ ...errors, newPassword: '' });
                }
              }}
              placeholder={t('settings.changePassword.newPlaceholder')}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            {errors.newPassword && (
              <p className="text-sm text-red-400 mt-1">{errors.newPassword}</p>
            )}
          </div>

      
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('settings.changePassword.confirm')}</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                if (errors.confirmPassword) {
                  setErrors({ ...errors, confirmPassword: '' });
                }
              }}
              placeholder={t('settings.changePassword.confirmPlaceholder')}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-400 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => {
                setIsExpanded(false);
                setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setErrors({});
              }}
              className="flex-1 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
              disabled={isLoading}
            >
              {t('settings.changePassword.cancel')}
            </button>
            <button
              onClick={handleChangePassword}
              disabled={isLoading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
              className="flex-1 px-4 py-2.5 bg-purple-500 hover:bg-purple-700 text-white font-medium rounded-lg transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('settings.changePassword.submitting') : t('settings.changePassword.submit')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
