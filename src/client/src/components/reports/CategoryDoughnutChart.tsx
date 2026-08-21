import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTranslation } from 'react-i18next';
import type { CategoryExpense } from '@/types/model.types';
import { formatNumber } from '@/utils/formatters';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  'rgba(99, 102, 241, 0.85)',
  'rgba(239, 68, 68, 0.85)',
  'rgba(34, 197, 94, 0.85)',
  'rgba(245, 158, 11, 0.85)',
  'rgba(6, 182, 212, 0.85)',
  'rgba(168, 85, 247, 0.85)',
  'rgba(249, 115, 22, 0.85)',
  'rgba(20, 184, 166, 0.85)',
  'rgba(236, 72, 153, 0.85)',
  'rgba(59, 130, 246, 0.85)',
];

interface Props {
  categories: CategoryExpense[];
  currency: string;
}

export const CategoryDoughnutChart = ({ categories, currency }: Props) => {
  const { t } = useTranslation('reports');

  if (!categories.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-500 text-sm">{t('categoryChart.noData')}</p>
      </div>
    );
  }

  const data = {
    labels: categories.map(c => c.categoryName),
    datasets: [
      {
        data: categories.map(c => c.amount),
        backgroundColor: COLORS.slice(0, categories.length),
        borderColor: COLORS.slice(0, categories.length).map(c => c.replace('0.85', '1')),
        borderWidth: 1,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#94a3b8',
          font: { size: 12 },
          padding: 14,
          boxWidth: 14,
          boxHeight: 14,
        },
      },
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (ctx: any) => {
            const cat = categories[ctx.dataIndex];
            return ` ${currency}${formatNumber(ctx.parsed ?? 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${cat.percentage.toFixed(1)}%)`;
          },
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};
