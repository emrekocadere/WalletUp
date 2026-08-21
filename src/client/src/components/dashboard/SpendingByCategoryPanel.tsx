import { useTranslation } from 'react-i18next';

interface CategorySpending {
  name: string;
  percentage: number;
  gradient: string;
}

interface SpendingByCategoryPanelProps {
  categories: CategorySpending[];
}

export const SpendingByCategoryPanel = ({ categories }: SpendingByCategoryPanelProps) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 ">
      <h2 className="text-xl font-bold text-white mb-6">{t('dashboard.spendingByCategory')}</h2>

      <div className="space-y-5">
        {categories.map((category, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">{category.name}</span>
              <span className="text-white font-bold">{category.percentage}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${category.gradient}`}
                style={{ width: `${category.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
