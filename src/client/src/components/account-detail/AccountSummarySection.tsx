import { formatBalance, formatDate } from '@/utils/formatters';
import { exportTransactionsToCSV } from '@/utils/exportToCSV';
import type { Account, Transaction } from '@/types/model.types';

type AccountSummarySectionProps = {
  account: Account;
  typeLabel: string;
  typeTone?: string;
  createdAt?: string;
  transactionCount: number;
  isLoading: boolean;
  isError: boolean;
  showDemoNotice: boolean;
  onAddTransaction?: () => void;
  onEditAccount?: () => void;
  onDeleteAccount?: () => void;
  transactions?: Transaction[];
  accounts?: Account[];
  onShowToast?: (message: string, type: 'success' | 'error') => void;
};

export const AccountSummarySection = ({
  account,
  typeLabel,
  typeTone,
  transactionCount,
  isLoading,
  onAddTransaction,
  onEditAccount,
  onDeleteAccount,
  transactions = [],
  accounts = [],
  onShowToast,
}: AccountSummarySectionProps) => {
  const handleExportCSV = () => {
    if (!transactions || transactions.length === 0) {
      onShowToast?.('No transactions to export', 'error');
      return;
    }
    if (!accounts || accounts.length === 0) {
      onShowToast?.('No accounts available', 'error');
      return;
    }
    exportTransactionsToCSV(transactions, accounts);
    onShowToast?.('Transactions exported as CSV', 'success');
  };

  return (
  <section className="bg-white/5 border border-white/10 rounded-xl sm:rounded-3xl p-2.5 sm:p-5 space-y-2.5 sm:space-y-4">
    <div className="flex flex-col gap-1.5 sm:gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-[9px] sm:text-[11px] uppercase text-gray-400">Balance</p>
        <p className="text-xl sm:text-3xl font-bold text-white leading-tight">{formatBalance(account.balance, account.currency.iso4217Code)}</p>
      </div>
      <div className="text-left sm:text-right space-y-0.5 sm:space-y-1.5">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase text-white bg-gradient-to-r ${
            typeTone ?? 'from-white/10 to-white/20'
          }`}
        >
          {typeLabel}
        </span>
        <p className="text-[9px] sm:text-[11px] text-gray-400">Created {formatDate(account.createdAt)}</p>
      </div>
    </div>

    {isLoading && <p className="text-sm text-gray-400">Loading account information...</p>}

    <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
      <div className="p-2 sm:p-3.5 rounded-lg sm:rounded-2xl bg-slate-900/60 border border-white/10">
        <p className="text-[9px] sm:text-[11px] uppercase text-gray-400">Currency</p>
        <p className="text-xs sm:text-base font-semibold text-white mt-0.5">{account.currency.iso4217Code}</p>
      </div>
      <div className="p-2 sm:p-3.5 rounded-lg sm:rounded-2xl bg-slate-900/60 border border-white/10">
        <p className="text-[9px] sm:text-[11px] uppercase text-gray-400">Account Type</p>
        <p className="text-xs sm:text-base font-semibold text-white mt-0.5">{typeLabel}</p>
      </div>
      <div className="p-2 sm:p-3.5 rounded-lg sm:rounded-2xl bg-slate-900/60 border border-white/10">
        <p className="text-[9px] sm:text-[11px] uppercase text-gray-400">Transactions</p>
        <p className="text-xs sm:text-base font-semibold text-white mt-0.5">{transactionCount}</p>
      </div>
    </div>

    <div className="space-y-1.5 sm:space-y-0 sm:flex sm:flex-row sm:flex-wrap sm:gap-2.5">
      <button
        onClick={onAddTransaction}
        className="w-full sm:w-auto px-3.5 sm:px-5 py-2 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg sm:rounded-2xl text-white text-xs sm:text-sm font-semibold transition-colors"
      >
        Add Transaction
      </button>
      <div className="grid grid-cols-3 gap-1.5 sm:flex sm:flex-row sm:gap-2.5">
        <button
          onClick={onEditAccount}
          className="px-2.5 sm:px-5 py-2 sm:py-2.5 border border-white/20 rounded-lg sm:rounded-2xl text-white text-[11px] sm:text-sm font-semibold hover:bg-white/10 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={handleExportCSV}
          className="px-2.5 sm:px-5 py-2 sm:py-2.5 bg-slate-800/50 hover:bg-slate-800 text-white text-[11px] sm:text-sm font-semibold rounded-lg sm:rounded-xl transition-all border border-white/10 flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2"
        >
          <svg
            className="w-4 sm:w-5 h-4 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 16.5V9.75m0 0l-3 3m3-3l3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0111.25 19.5H6.75z"
            />
          </svg>
          <span className="hidden sm:inline">Export CSV</span>
          <span className="sm:hidden">Export</span>
        </button>
        <button
          onClick={onDeleteAccount}
          className="px-2.5 sm:px-5 py-2 sm:py-2.5 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 rounded-lg sm:rounded-2xl text-red-400 text-[11px] sm:text-sm font-semibold transition-colors flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2"
        >
          <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="hidden sm:inline">Delete Account</span>
          <span className="sm:hidden">Delete</span>
        </button>
      </div>
    </div>
  </section>
  );
};
