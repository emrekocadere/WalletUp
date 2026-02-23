import { getCurrencySymbol } from '@/utils/formatters';

type AccountsHeroStatsProps = {
  totalBalance: number;
  totalAccounts: number;
  preferredCurrency?: string;
};

export const AccountsHeroStats = ({ totalBalance, totalAccounts, preferredCurrency = 'USD' }: AccountsHeroStatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4">
      <div className="bg-white/5 border border-white/10 rounded-lg sm:rounded-2xl p-3 sm:p-6 flex flex-col gap-2 sm:gap-4">
        <p className="text-[10px] sm:text-sm uppercase text-gray-400 tracking-[0.2em]">Total Balance</p>
        <div className="flex items-center">
          <p className="text-xl sm:text-3xl font-bold text-white leading-tight">{getCurrencySymbol(preferredCurrency)}{totalBalance.toFixed(2)}</p>
        </div>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-lg sm:rounded-2xl p-3 sm:p-6 flex flex-col gap-2 sm:gap-4">
        <p className="text-[10px] sm:text-sm uppercase text-gray-400 tracking-[0.2em]">Accounts</p>
        <div className="flex items-center">
          <p className="text-xl sm:text-3xl font-bold text-white leading-tight">{totalAccounts}</p>
        </div>
      </div>
    </div>
  );
};



