import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import type { RootState } from '@/store/store';
import type { Account } from '@/types/model.types';

const selectStyles = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 14l-7 7m0 0l-7-7m7 7V3'%3E%3C/path%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.5rem center',
  backgroundSize: '1.5em 1.5em',
  paddingRight: '2.5rem'
} as React.CSSProperties;

const selectClass = "w-full px-4 py-2.5 bg-slate-800/80 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 hover:bg-slate-800 transition-colors appearance-none cursor-pointer";

interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: Account;
  onSubmit: (data: { name?: string; accountTypeId?: string; currencyId?: string }) => Promise<boolean>;
  onShowToast?: (message: string, type: 'success' | 'error') => void;
}

export const EditAccountModal = ({ isOpen, onClose, account, onSubmit, onShowToast }: EditAccountModalProps) => {
  const { t } = useTranslation('accounts');
  const { accountTypes, currencies } = useSelector((state: RootState) => state.appData);
  const [accountName, setAccountName] = useState(account.name);
  const [accountTypeId, setAccountTypeId] = useState(account.accountType.id);
  const [currencyId, setCurrencyId] = useState(account.currency.id);

  useEffect(() => {
    if (isOpen) {
      setAccountName(account.name);
      setAccountTypeId(account.accountType.id);
      setCurrencyId(account.currency.id);
    }
  }, [isOpen, account]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updateData: { name?: string; accountTypeId?: string; currencyId?: string } = {};
    
    if (accountName !== account.name) updateData.name = accountName;
    if (accountTypeId !== account.accountType.id) updateData.accountTypeId = accountTypeId;
    if (currencyId !== account.currency.id) updateData.currencyId = currencyId;

    if (Object.keys(updateData).length === 0) {
      onShowToast?.(t('editAccountModal.noChanges'), 'error');
      return;
    }

    if (await onSubmit(updateData)) {
      onShowToast?.(t('editAccountModal.updated'), 'success');
      onClose();
    } else {
      onShowToast?.(t('editAccountModal.updateFailed'), 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-lg w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">{t('editAccountModal.title')}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('editAccountModal.accountName')}</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder={t('editAccountModal.accountNamePlaceholder')}
                required
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('editAccountModal.accountType')}</label>
              <select value={accountTypeId} onChange={(e) => setAccountTypeId(e.target.value)} className={selectClass} style={selectStyles}>
                {accountTypes.map((type) => (
                  <option key={type.id} value={type.id} className="bg-slate-800 text-white">
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('editAccountModal.currency')}</label>
              <select value={currencyId} onChange={(e) => setCurrencyId(e.target.value)} className={selectClass} style={selectStyles}>
                {currencies.map((currency) => (
                  <option key={currency.id} value={currency.id} className="bg-slate-800 text-white">
                    {currency.iso4217Code || t('editAccountModal.unknown')}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-medium text-white transition-all">
                {t('editAccountModal.cancel')}
              </button>
              <button type="submit" className="flex-1 px-4 py-2.5 bg-purple-500 hover:bg-purple-700 rounded-lg font-semibold text-white transition-all shadow-lg shadow-purple-500/30">
                {t('editAccountModal.save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
