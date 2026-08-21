import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTranslation } from 'react-i18next';
import { formatNumber, getMonthNames } from '@/utils/formatters';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props {
  incomeData: number[];
  expenseData: number[];
  currency: string;
}

export const MonthlyBarChart = ({ incomeData, expenseData, currency }: Props) => {
  const { t } = useTranslation('reports');
  const MONTHS = getMonthNames('short');
  const data = {
    labels: MONTHS,
    datasets: [
      {
        label: t('monthlyBarChart.income'),
        data: incomeData,
        backgroundColor: 'rgba(34, 197, 94, 0.75)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
        borderRadius: 5,
        borderSkipped: false,
      },
      {
        label: t('monthlyBarChart.expenses'),
        data: expenseData,
        backgroundColor: 'rgba(239, 68, 68, 0.75)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
        borderRadius: 5,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8',
          font: { size: 12 },
          boxWidth: 14,
          padding: 16,
        },
      },
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (ctx: any) =>
            ` ${ctx.dataset.label}: ${currency}${formatNumber(ctx.parsed.y ?? 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8', font: { size: 11 } },
        grid: { color: 'rgba(51, 65, 85, 0.4)' },
        border: { color: 'rgba(51, 65, 85, 0.6)' },
      },
      y: {
        ticks: {
          color: '#94a3b8',
          font: { size: 11 },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback: (value: any) =>
            `${currency}${formatNumber(Number(value))}`,
        },
        grid: { color: 'rgba(51, 65, 85, 0.4)' },
        border: { color: 'rgba(51, 65, 85, 0.6)' },
      },
    },
  };

  return <Bar data={data} options={options} />;
};
