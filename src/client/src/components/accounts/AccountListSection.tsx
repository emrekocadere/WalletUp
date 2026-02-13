import { Link } from 'react-router-dom';
import { accountTypeMeta } from '@/utils/account-type.utils';
import { formatBalance, formatDate } from '@/utils/formatters';
import type { Account } from '@/types/model.types';
import { AccountType } from '@/types/model.types';

type AccountListSectionProps = {
  accounts: Account[];
  isLoading: boolean;
  currencies: Record<string, number>;
};

export const AccountListSection = ({ accounts, isLoading }: AccountListSectionProps) => (
  <section className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
    <div className="p-6">
      {isLoading ? (
        <p className="text-gray-400">Loading accounts...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {accounts.map((account) => {
            const accountTypeEnum = account.accountType.name as AccountType;
            const typeMeta = accountTypeMeta[accountTypeEnum];
            const typeLabel = typeMeta?.label ?? account.accountType.name;
            return (
              <Link key={account.id} to={`/accounts/${account.id}`} className="group block">
                <article className="bg-gradient-to-br from-slate-900/60 to-slate-900/30 border border-white/10 rounded-2xl p-5 shadow-xl shadow-black/20 transition duration-200 ease-out hover:border-primary-500/40 hover:shadow-primary-500/40">
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs uppercase text-gray-400">{typeLabel}</p>
                      <h2 className="text-2xl font-semibold text-white">{account.name}</h2>
                    </div>
                    <span
                      className={`text-xs font-semibold uppercase px-3 py-1 border border-white/10 rounded-full text-gray-300 bg-gradient-to-r ${typeMeta?.tone ?? 'from-white/5 to-white/10'}`}
                    >
                      {account.currency.iso4217Code}
                    </span>
                  </div>
                  <p className="mt-3 text-3xl font-bold text-white">{formatBalance(account.balance, account.currency.iso4217Code)}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    <span>Created {formatDate(account.createdAt)}</span>
                    <span className="px-2 py-1 rounded-full border border-white/10 text-[10px] uppercase tracking-wider">
                      View Details
                    </span>
                    {typeMeta && <span className="text-[11px] text-gray-400">{typeMeta.description}</span>}
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  </section>
);
