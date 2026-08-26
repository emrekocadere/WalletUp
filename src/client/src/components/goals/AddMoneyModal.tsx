import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { Goal } from '@/types/model.types';
import { goalsApi } from '@/api/endpoints/goals.api';
import type { RootState } from '@/store/store';
import { getCurrencySymbol, formatNumber } from '@/utils/formatters';

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  onSuccess: () => void;
}

export const AddMoneyModal = ({ isOpen, onClose, goal, onSuccess }: AddMoneyModalProps) => {
  const { t } = useTranslation('goals');
  const [amount, setAmount] = useState('');
  const [transactionTypeId, setTransactionTypeId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const transactionTypes = useSelector((state: RootState) => state.appData.transactionTypes);

  if (!isOpen || !goal) return null;

  const currentAmount = goal.currentAmount || 0;
  const targetAmount = goal.target || 0;
  const remainingAmount = targetAmount - currentAmount;
  const currencySymbol = getCurrencySymbol(goal.currency?.iso4217Code);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      alert(t('addMoneyModal.errors.invalidAmount'));
      return;
    }

    if (!transactionTypeId) {
      alert(t('addMoneyModal.errors.typeRequired'));
      return;
    }

    setIsLoading(true);
    try {
      const result = await goalsApi.addMoney(goal.id, {
        amount: amountValue,
        transactionTypeId: transactionTypeId
      });


      if (result.isSuccess) {
        setAmount('');
        setTransactionTypeId('');
        onSuccess();
        onClose();
      } else {
        alert(result.error || t('addMoneyModal.toastFailed'));
      }
    } catch (error) {
      console.error('Failed to add money:', error);
      alert(t('addMoneyModal.toastFailedRetry'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-white/10 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{t('addMoneyModal.title')}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-3">{goal.title}</h3>
          {goal.description && (
            <p className="text-sm text-gray-400 mb-3">{goal.description}</p>
          )}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">{t('addMoneyModal.current')}</span>
              <span className="text-white font-semibold">{currencySymbol}{formatNumber(currentAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{t('addMoneyModal.target')}</span>
              <span className="text-white font-semibold">{currencySymbol}{formatNumber(targetAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">{t('addMoneyModal.remaining')}</span>
              <span className="text-purple-400 font-semibold">{currencySymbol}{formatNumber(remainingAmount)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              {t('addMoneyModal.transactionType')}
            </label>
            <select
              value={transactionTypeId}
              onChange={(e) => setTransactionTypeId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 hover:bg-slate-700 transition-colors appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 14l-7 7m0 0l-7-7m7 7V3'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem'
              }}
              required
              disabled={isLoading}
            >
              <option value="" className="bg-slate-800 text-white">{t('addMoneyModal.transactionTypePlaceholder')}</option>
              {transactionTypes.map((type) => (
                <option key={type.id} value={type.id} className="bg-slate-800 text-white">
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              {t('addMoneyModal.amountLabel')}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{currencySymbol}</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                required
                disabled={isLoading}
                autoFocus
              />
            </div>
            {parseFloat(amount) > 0 && (
              <p className="mt-2 text-sm text-gray-400">
                {t('addMoneyModal.newTotal', { amount: `${currencySymbol}${formatNumber(currentAmount + parseFloat(amount))}` })}
              </p>
            )}
          </div>


          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-lg transition-all"
              disabled={isLoading}
            >
              {t('addMoneyModal.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-purple-500 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !amount || parseFloat(amount) <= 0 || !transactionTypeId}
            >
              {isLoading ? t('addMoneyModal.submitting') : t('addMoneyModal.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
