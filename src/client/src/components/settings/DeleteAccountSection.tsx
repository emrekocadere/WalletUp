import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logout } from '@/store/slices/authSlice';
import { authApi } from '@/api/endpoints/auth.api';
import type { ApiError } from '@/types/common.types';

interface DeleteAccountSectionProps {
  onToast: (toast: { message: string; type: 'success' | 'error' }) => void;
}

export const DeleteAccountSection = ({ onToast }: DeleteAccountSectionProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await authApi.deleteAccount();


      localStorage.removeItem('walletup-settings');
      localStorage.removeItem('walletup-onboarding');


      dispatch(logout());

      onToast({ message: t('settings.deleteAccount.toastSuccess'), type: 'success' });


      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      const apiError = err as ApiError;
      onToast({ message: apiError.message || t('settings.deleteAccount.toastFailed'), type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-red-500/20">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">{t('settings.deleteAccount.title')}</h3>
          <p className="text-gray-400 mb-4">{t('settings.deleteAccount.description')}</p>

          <div className="flex">
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              {isDeleting ? t('settings.deleteAccount.deleting') : t('settings.deleteAccount.button')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};