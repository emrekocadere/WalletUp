import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Account } from '@/types/model.types';
import { getCurrencySymbol } from '@/utils/formatters';

interface TransferMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  fromAccountId?: string;
  onSubmit: (data: { fromAccountId: string; toAccountId: string; amount: number; description?: string }) => Promise<boolean>;
  onShowToast?: (message: string, type: 'success' | 'error') => void;
}

export const TransferMoneyModal = ({
  isOpen,
  onClose,
  accounts,
  fromAccountId,
  onSubmit,
  onShowToast,
}: TransferMoneyModalProps) => {
  const { t } = useTranslation('accounts');

  const [fromId, setFromId] = useState(fromAccountId || '');
  const [toId, setToId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFromId(fromAccountId || accounts[0]?.id || '');
      setToId('');
      setAmount('');
      setDescription('');
    }
  }, [isOpen, fromAccountId, accounts]);

  if (!isOpen) return null;

  const fromAccount = accounts.find(a => a.id === fromId);
  const toAccounts = accounts.filter(a => a.id !== fromId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountValue = parseFloat(amount);
    if (!fromId || !toId) {
      onShowToast?.(t('transferModal.selectBothAccounts'), 'error');
      return;
    }
    if (fromId === toId) {
      onShowToast?.(t('transferModal.sameAccount'), 'error');
      return;
    }
    if (isNaN(amountValue) || amountValue <= 0) {
      onShowToast?.(t('transferModal.invalidAmount'), 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSubmit({
        fromAccountId: fromId,
        toAccountId: toId,
        amount: amountValue,
        description: description || undefined,
      });

      if (success) {
        onShowToast?.(t('transferModal.success'), 'success');
        onClose();
      } else {
        onShowToast?.(t('transferModal.failed'), 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">{t('transferModal.title')}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('transferModal.fromAccount')}</label>
              <select
                value={fromId}
                onChange={(e) => { setFromId(e.target.value); if (e.target.value === toId) setToId(''); }}
                required
                className="w-full px-4 py-2.5 bg-slate-800/80 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 hover:bg-slate-800 transition-colors appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 14l-7 7m0 0l-7-7m7 7V3'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id} className="bg-slate-800 text-white">
                    {acc.name} ({acc.currency.iso4217Code})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('transferModal.toAccount')}</label>
              <select
                value={toId}
                onChange={(e) => setToId(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-800/80 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 hover:bg-slate-800 transition-colors appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 14l-7 7m0 0l-7-7m7 7V3'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                <option value="" className="bg-slate-800 text-white">{t('transferModal.selectAccount')}</option>
                {toAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id} className="bg-slate-800 text-white">
                    {acc.name} ({acc.currency.iso4217Code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('transferModal.amount')}</label>
              <div className="relative">
                {fromAccount && (
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {getCurrencySymbol(fromAccount.currency.iso4217Code)}
                  </span>
                )}
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  required
                  className="w-full pl-9 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('transferModal.description')}</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t('transferModal.descriptionPlaceholder')}
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
              >
                {t('transferModal.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-purple-500 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('transferModal.submitting') : t('transferModal.submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
