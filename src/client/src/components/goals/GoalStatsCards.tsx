import { getCurrencySymbol } from '@/utils/formatters';

interface Goal {
  targetAmount: number;
  currentAmount: number;
}

interface GoalStatsCardsProps {
  goals: Goal[];
}

export const GoalStatsCards = ({ goals }: GoalStatsCardsProps) => {
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  // Use first goal's currency, or default to USD if no goals
  const currencyCode = (goals[0] as any)?.currency?.iso4217Code || 'USD';
  const symbol = getCurrencySymbol(currencyCode);

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
      <div className="bg-white/5 backdrop-blur-xl p-3 sm:p-5 lg:p-6 rounded-lg sm:rounded-2xl border border-white/10">
        <h3 className="text-gray-400 text-[10px] sm:text-sm font-medium mb-0.5 sm:mb-2">Active Goals</h3>
        <p className="text-xl sm:text-3xl font-bold text-white">{goals.length}</p>
      </div>
      <div className="bg-white/5 backdrop-blur-xl p-3 sm:p-5 lg:p-6 rounded-lg sm:rounded-2xl border border-white/10">
        <h3 className="text-gray-400 text-[10px] sm:text-sm font-medium mb-0.5 sm:mb-2">Total Target</h3>
        <p className="text-xl sm:text-3xl font-bold text-white leading-tight">
          {symbol}{totalTarget.toLocaleString('tr-TR')}
        </p>
      </div>
      <div className="bg-white/5 backdrop-blur-xl p-3 sm:p-5 lg:p-6 rounded-lg sm:rounded-2xl border border-white/10">
        <h3 className="text-gray-400 text-[10px] sm:text-sm font-medium mb-0.5 sm:mb-2">Total Saved</h3>
        <p className="text-xl sm:text-3xl font-bold text-green-400 leading-tight">
          {symbol}{totalSaved.toLocaleString('tr-TR')}
        </p>
      </div>
    </div>
  );
};
