import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    name: string;
    accountTypeId: string;
    initialBalance: number;
    currencyId: string;
  }) => Promise<boolean>;
  onShowToast?: (message: string, type: 'success' | 'error') => void;
}

export const AddAccountModal = ({ isOpen, onClose, onSubmit, onShowToast }: AddAccountModalProps) => {
  const { accountTypes, currencies } = useSelector((state: RootState) => state.appData);

  const [accountName, setAccountName] = useState('');
  const [accountTypeId, setAccountTypeId] = useState('');
  const [accountBalance, setAccountBalance] = useState('0');
  const [currencyId, setCurrencyId] = useState('');

  useEffect(() => {
    if (accountTypes.length > 0 && !accountTypeId) {
      setAccountTypeId(accountTypes[0].id);
    }
    if (currencies.length > 0 && !currencyId) {
      setCurrencyId(currencies[0].id);
    }
  }, [accountTypes, accountTypeId, currencies, currencyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const balanceValue = parseFloat(accountBalance);
    if (isNaN(balanceValue)) {
      onShowToast?.('Invalid balance', 'error');
      return;
    }
    const success = await onSubmit?.({
      name: accountName,
      accountTypeId: accountTypeId,
      initialBalance: balanceValue,
      currencyId: currencyId,
    }) || false;

    if (success) {
      onShowToast?.('Created successfully', 'success');

      setAccountName('');
      if (accountTypes.length > 0) {
        setAccountTypeId(accountTypes[0].id);
      }
      if (currencies.length > 0) {
        setCurrencyId(currencies[0].id);
      }
      setAccountBalance('0');
      onClose();
    } else {
      onShowToast?.('Failed to create account', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Add New Account</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Account Name</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="e.g., Main Checking, Savings, etc."
                required
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Account Type</label>
              <select
                value={accountTypeId}
                onChange={(e) => setAccountTypeId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800/80 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 hover:bg-slate-800 transition-colors appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 14l-7 7m0 0l-7-7m7 7V3'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                {accountTypes.length > 0 ? (
                  accountTypes.map((type) => (
                    <option key={type.id} value={type.id} className="bg-slate-800 text-white">
                      {type.name}
                    </option>
                  ))
                ) : (
                  <option value="" className="bg-slate-800 text-white">Loading...</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
              <select
                value={currencyId}
                onChange={(e) => setCurrencyId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800/80 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 hover:bg-slate-800 transition-colors appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 14l-7 7m0 0l-7-7m7 7V3'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                {currencies.length > 0 ? (
                  currencies.map((currency) => (
                    <option key={currency.id} value={currency.id} className="bg-slate-800 text-white">
                      {currency.iso4217Code || 'Unknown'}
                    </option>
                  ))
                ) : (
                  <option value="" className="bg-slate-800 text-white">Loading...</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Initial Balance</label>
              <input
                type="number"
                value={accountBalance}
                onChange={(e) => setAccountBalance(e.target.value)}
                step="0.01"
                placeholder="0.00"
                required
                className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/30"
              >
                Add Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
