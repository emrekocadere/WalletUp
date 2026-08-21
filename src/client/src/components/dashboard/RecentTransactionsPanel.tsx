import { useTranslation } from 'react-i18next';
import type { Transaction } from '@/types/model.types';
import { getCurrencySymbol, formatNumber, formatShortDate } from '@/utils/formatters';

interface RecentTransactionsPanelProps {
  transactions: Transaction[];
  isLoading: boolean;
  currency?: string;
}

export const RecentTransactionsPanel = ({ transactions, isLoading, currency = 'USD' }: RecentTransactionsPanelProps) => {
  const { t } = useTranslation();

  if (isLoading) {
    return <p className="text-gray-400">{t('dashboard.loadingTransactions')}</p>;
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">{t('dashboard.noTransactions')}</p>
        <p className="text-gray-500 text-sm mt-2">{t('dashboard.noTransactionsSubtitle')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => {
        const isIncome = transaction.transactionType?.name?.toLowerCase() === 'income';
        const date = transaction.date ? formatShortDate(transaction.date) : '';

        return (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5 hover:border-primary-400/20"
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isIncome
                  ? 'bg-green-500/20'
                  : 'bg-red-500/20'
              }`}>
                <svg
                  className={`w-6 h-6 ${isIncome ? 'text-green-400' : 'text-red-400'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isIncome ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  )}
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {transaction.description || t('dashboard.noDescription')}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-indigo-300 px-2 py-1 bg-indigo-500/15 border border-indigo-500/20 rounded-full hover:border-indigo-400/40 transition-all">
                    {transaction.category?.name || t('dashboard.uncategorized')}
                  </span>
                  {date && (
                    <span className="text-xs text-gray-500">
                      {date}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right ml-4 flex-shrink-0">
              <p className={`text-lg font-bold ${
                isIncome ? 'text-green-400' : 'text-white'
              }`}>
                {isIncome ? '+' : '-'}{getCurrencySymbol(transaction.account?.currency?.iso4217Code || currency)}{formatNumber(transaction.amount, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                {transaction.transactionType?.name || t('dashboard.unknownType')}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
