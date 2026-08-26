import { useTranslation } from 'react-i18next';
import type { Transaction } from '@/types/model.types';
import { formatDate, formatNumber, getCurrencySymbol } from '@/utils/formatters';
import { TransactionRowActions } from '@/components/transactions/TransactionRowActions';

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  accounts: Array<{ id: string; name: string }>;
  hasFilters: boolean;
  onDelete?: (transactionId: string) => Promise<void>;
  onEdit?: (transaction: Transaction) => void;
  onShowToast?: (message: string, type: 'success' | 'error') => void;
}

export const TransactionTable = ({
  transactions,
  isLoading,
  accounts,
  hasFilters,
  onDelete,
  onEdit,
  onShowToast,
}: TransactionTableProps) => {
  const { t } = useTranslation('transactions');
  const handleEdit = (transaction: Transaction) => {
    onEdit?.(transaction);
  };

  const handleDelete = async (transaction: Transaction) => {
    if (!transaction.id) return;
    try {
      await onDelete?.(transaction.id);
      onShowToast?.(t('table.deleteSuccess'), 'success');
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      onShowToast?.(t('table.deleteFailed'), 'error');
    }
  };
  if (isLoading) {
    return <div className="text-center py-12 text-gray-400">{t('table.loading')}</div>;
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 text-gray-600 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-gray-400 mb-2">{t('table.empty')}</p>
        <p className="text-gray-500 text-sm">
          {hasFilters ? t('table.emptyFiltered') : t('table.emptyUnfiltered')}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View - hidden on mobile */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('table.date')}</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('table.titleColumn')}</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('table.category')}</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('table.account')}</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('table.type')}</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">{t('table.amount')}</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">{t('table.actions')}</th>
            </tr>
          </thead>
        <tbody className="divide-y divide-white/5">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-white/5 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-300">{formatDate(transaction.date)}</td>
              <td className="px-6 py-4">
                <div>
                  <p className="text-white font-medium">{transaction.title || t('table.untitled')}</p>
                  {transaction.description && (
                    <p className="text-gray-500 text-sm">{transaction.description}</p>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/15 text-purple-300 rounded-lg text-sm border border-purple-500/20 hover:border-purple-400/40 transition-all">
                  {transaction.category?.name || t('table.noCategory')}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-300">
                {transaction.account?.name || accounts.find((a) => a.id === transaction.accountId)?.name || t('table.unknown')}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium ${
                    transaction.transactionType?.name?.toLowerCase() === 'income'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {transaction.transactionType?.name?.toLowerCase() === 'income' ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 11l5-5m0 0l5 5m-5-5v12"
                      />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 13l-5 5m0 0l-5-5m5 5V6"
                      />
                    </svg>
                  )}
                  {transaction.transactionType?.name || t('table.unknown')}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <span
                  className={`text-lg font-bold ${
                    transaction.transactionType?.name?.toLowerCase() === 'income' ? 'text-green-400' : 'text-white'
                  }`}
                >
                  {transaction.transactionType?.name?.toLowerCase() === 'income' ? '+' : '-'}
                  {getCurrencySymbol(transaction.account?.currency?.iso4217Code)}{formatNumber(transaction.amount, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </td>
              <td className="px-6 py-4 text-center relative">
                <TransactionRowActions
                  transaction={transaction}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 hover:bg-white/[0.07] transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-white font-semibold text-base mb-1">
                  {transaction.title || t('table.untitled')}
                </h3>
                <p className="text-gray-400 text-xs">{formatDate(transaction.date)}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-lg font-bold whitespace-nowrap ${
                    transaction.transactionType?.name?.toLowerCase() === 'income' ? 'text-green-400' : 'text-white'
                  }`}
                >
                  {transaction.transactionType?.name?.toLowerCase() === 'income' ? '+' : '-'}
                  {getCurrencySymbol(transaction.account?.currency?.iso4217Code)}{formatNumber(transaction.amount, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <TransactionRowActions
                  transaction={transaction}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            </div>

            {transaction.description && (
              <p className="text-gray-500 text-sm mb-3">{transaction.description}</p>
            )}

            <div className="flex flex-wrap gap-2 items-center">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/15 text-purple-300 rounded-lg text-xs border border-purple-500/20">
                {transaction.category?.name || t('table.noCategory')}
              </span>
              
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                  transaction.transactionType?.name?.toLowerCase() === 'income'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {transaction.transactionType?.name?.toLowerCase() === 'income' ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 11l5-5m0 0l5 5m-5-5v12"
                    />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 13l-5 5m0 0l-5-5m5 5V6"
                    />
                  </svg>
                )}
                {transaction.transactionType?.name || t('table.unknown')}
              </span>

              <span className="text-gray-400 text-xs">
                {transaction.account?.name || accounts.find((a) => a.id === transaction.accountId)?.name || t('table.unknown')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
