import { formatBalance, formatDate } from '@/utils/formatters';

type AccountStatusPanelProps = {
  incomeTotal: number;
  expenseTotal: number;
  latestActivity?: string;
  transactionCount: number;
  currency: string;
};

export const AccountStatusPanel = ({
  incomeTotal,
  expenseTotal,
  latestActivity,
  transactionCount,
  currency,
}: AccountStatusPanelProps) => (
  <aside className="bg-slate-900/40 border border-white/10 rounded-3xl p-6 space-y-4">
    <div>
      <p className="text-xs uppercase text-gray-400">Summary</p>
      <h3 className="text-xl font-semibold text-white">Quick Overview</h3>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 space-y-2">
        <p className="text-xs uppercase text-gray-400">+</p>
        <p className="text-2xl font-semibold text-emerald-300">{formatBalance(incomeTotal, currency)}</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 space-y-2">
        <p className="text-xs uppercase text-gray-400">-</p>
        <p className="text-2xl font-semibold text-primary-300">{formatBalance(-expenseTotal, currency)}</p>
      </div>
    </div>
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 space-y-1">
      <p className="text-xs uppercase text-gray-400">Latest Activity</p>
      <p className="text-sm font-semibold text-white">{formatDate(latestActivity)}</p>
      <p className="text-xs text-gray-500">Total {transactionCount} transactions</p>
    </div>
  </aside>
);
