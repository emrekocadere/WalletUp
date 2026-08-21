import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { goalsApi } from '@/api/endpoints/goals.api';
import { transactionsApi } from '@/api/endpoints/transactions.api';
import type { Currency } from '@/types/model.types';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onShowToast?: (message: string, type: 'success' | 'error') => void;
  accounts?: Array<{ id: string; name: string }>;
}

export const AddGoalModal = ({ isOpen, onClose, onSuccess, onShowToast }: AddGoalModalProps) => {
  const { t } = useTranslation('goals');
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [description, setDescription] = useState('');
  const [currencyId, setCurrencyId] = useState('');
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCurrencies, setIsLoadingCurrencies] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadCurrencies();
    }
  }, [isOpen]);

  const loadCurrencies = async () => {
    try {
      setIsLoadingCurrencies(true);
      const data = await transactionsApi.getAllCurrencies();
      setCurrencies(data);
      if (data.length > 0) {
        setCurrencyId(data[0].id || '');
      }
    } catch (error) {
      console.error('Failed to load currencies:', error);
      onShowToast?.(t('addModal.toastLoadCurrenciesFailed'), 'error');
    } finally {
      setIsLoadingCurrencies(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(targetAmount);
    if (isNaN(amount) || amount <= 0) {
      alert(t('addModal.errors.invalidAmount'));
      return;
    }

    if (!name.trim()) {
      alert(t('addModal.errors.nameRequired'));
      return;
    }

    if (!currencyId) {
      alert(t('addModal.errors.currencyRequired'));
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await goalsApi.create({
        Title: name,
        Target: amount,
        Description: description || '',
        CurrencyId: currencyId,
      });

      if (result.isSuccess) {
        setName('');
        setTargetAmount('');
        setDescription('');
        setCurrencyId(currencies[0]?.id || '');

        onShowToast?.(t('addModal.toastSuccess'), 'success');
        onSuccess?.();
        onClose();
      } else {
        onShowToast?.(String(result.error || t('addModal.toastFailed')), 'error');
      }
    } catch (err) {
      console.error('Failed to create goal:', err);
      onShowToast?.(t('addModal.toastFailedRetry'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">{t('addModal.title')}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('addModal.nameLabel')}</label>
                <input
                  type="text"
                  placeholder={t('addModal.namePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('addModal.currencyLabel')}</label>
                {isLoadingCurrencies ? (
                  <div className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-gray-400 flex items-center">
                    {t('addModal.loadingCurrencies')}
                  </div>
                ) : (
                  <select
                    value={currencyId}
                    onChange={(e) => setCurrencyId(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">{t('addModal.currencyPlaceholder')}</option>
                    {currencies.map((currency) => (
                      <option key={currency.id} value={currency.id}>
                        {currency.iso4217Code}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('addModal.targetLabel')}</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('addModal.descriptionLabel')}</label>
              <textarea
                rows={3}
                placeholder={t('addModal.descriptionPlaceholder')}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('addModal.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('addModal.submitting') : t('addModal.submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
