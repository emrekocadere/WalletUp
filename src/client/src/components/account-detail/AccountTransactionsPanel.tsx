import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatBalance, formatDate } from '@/utils/formatters';
import type { Transaction } from '@/types/model.types';

type AccountTransactionsPanelProps = {
  transactions: Transaction[];
  currency: string;
};

export const AccountTransactionsPanel = ({ transactions, currency }: AccountTransactionsPanelProps) => {
  const { t } = useTranslation('accounts');
  return (
  <section className="bg-slate-900/40 border border-white/10 rounded-3xl p-6 space-y-5">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="text-2xl font-semibold text-white">{t('accountTransactionsPanel.title')}</h3>
      </div>
      <Link to="/transactions" className="text-primary-400 text-sm font-medium hover:text-primary-300">
        {t('accountTransactionsPanel.allTransactions')}
      </Link>
    </div>

    {transactions.length === 0 ? (
      <p className="text-sm text-gray-400">{t('accountTransactionsPanel.empty')}</p>
    ) : (
      <div className="space-y-2">
        {transactions.slice(0, 5).map((tx) => {
          const tone = tx.amount >= 0 ? 'text-emerald-300' : 'text-primary-300';
          return (
            <div
              key={tx.id}
              className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-900/60 px-4 py-3 space-y-2"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">{tx.title}</p>
                <span className="text-[11px] text-gray-400">{formatDate(tx.date)}</span>
              </div>
              {tx.description && <p className="text-[11px] text-gray-400">{tx.description}</p>}
              <div className="flex items-center justify-end text-[11px] text-gray-400">
                <span className={`text-sm font-semibold ${tone}`}>{formatBalance(tx.amount, currency)}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <span className="px-2 py-0.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:border-indigo-400/50 transition-all">{tx.category?.id || t('accountTransactionsPanel.category')}</span>
                <span className="text-gray-500">#{tx.id}</span>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </section>
  );
};
