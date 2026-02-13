import type { Transaction } from '@/types/model.types';
import { formatCurrency } from '@/utils/formatters';

interface TransactionStatsProps {
  transactions: Transaction[];
}

export const TransactionStats = ({ transactions }: TransactionStatsProps) => {
  const totalIncome = transactions
    .filter((t) => t.transactionType?.name === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.transactionType?.name === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Total Transactions</p>
            <p className="text-3xl font-bold text-white">{transactions.length}</p>
          </div>
          <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Total Income</p>
            <p className="text-3xl font-bold text-green-400">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 11l5-5m0 0l5 5m-5-5v12"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Total Expenses</p>
            <p className="text-3xl font-bold text-red-400">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 13l-5 5m0 0l-5-5m5 5V6"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
