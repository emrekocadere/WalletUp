import type { RecurringTransaction } from '@/types/model.types';

interface Props {
  transaction: RecurringTransaction;
  currencySymbol: string;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
}

const FREQUENCY_LABELS = {
  Weekly: 'Every week',
  BiWeekly: 'Every 2 weeks',
  Monthly: 'Every month',
  Quarterly: 'Every 3 months',
  SemiAnnually: 'Every 6 months',
  Annually: 'Every year',
};

export const RecurringTransactionCard = ({
  transaction,
  currencySymbol,
  onEdit,
  onDelete,
  onToggleActive,
}: Props) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className={`border rounded-xl p-4 transition-colors ${
      transaction.isActive
        ? 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/75'
        : 'bg-slate-900/30 border-slate-700/30 opacity-60'
    }`}>
      <div className="flex items-start justify-between gap-4">
        {/* Left content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-base font-semibold text-white truncate">{transaction.title}</h3>
            <span className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
              transaction.isActive
                ? 'bg-green-500/20 text-green-400'
                : 'bg-slate-500/20 text-slate-400'
            }`}>
              {transaction.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          {transaction.description && (
            <p className="text-sm text-slate-400 mb-3">{transaction.description}</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Frequency</p>
              <p className="text-slate-300">
                {FREQUENCY_LABELS[transaction.frequency as keyof typeof FREQUENCY_LABELS] || transaction.frequency}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Next Due</p>
              <p className="text-slate-300">{formatDate(transaction.nextOccurrence)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-0.5">Started</p>
              <p className="text-slate-300">{formatDate(transaction.startDate)}</p>
            </div>
            {transaction.endDate && (
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Ends</p>
                <p className="text-slate-300">{formatDate(transaction.endDate)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Amount + Actions */}
        <div className="flex flex-col items-end gap-3 flex-shrink-0">
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-1">Amount</p>
            <p className="text-xl font-bold text-indigo-400">
              {currencySymbol}
              {transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={onToggleActive}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                transaction.isActive
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
              }`}
              title={transaction.isActive ? 'Deactivate' : 'Activate'}
            >
              {transaction.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <button
              onClick={onEdit}
              className="px-3 py-1.5 rounded text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
              title="Edit"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-1.5 rounded text-xs font-medium bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
              title="Delete"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
