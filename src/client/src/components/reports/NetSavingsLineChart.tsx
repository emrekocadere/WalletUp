import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useTranslation } from 'react-i18next';
import { formatNumber, getMonthNames } from '@/utils/formatters';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

interface Props {
  netData: number[];
  currency: string;
}

export const NetSavingsLineChart = ({ netData, currency }: Props) => {
  const { t } = useTranslation('reports');
  const MONTHS = getMonthNames('short');
  const data = {
    labels: MONTHS,
    datasets: [
      {
        label: t('netSavingsChart.label'),
        data: netData,
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.12)',
        borderColor: 'rgba(99, 102, 241, 0.9)',
        pointBackgroundColor: netData.map(v => (v >= 0 ? '#6366f1' : '#ef4444')),
        pointBorderColor: '#1e293b',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
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
          label: (ctx: any) => {
            const val: number = ctx.parsed.y ?? 0;
            const sign = val >= 0 ? '+' : '';
            return ` ${t('netSavingsChart.tooltipPrefix')}: ${sign}${currency}${formatNumber(val, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          },
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
          callback: (value: any) => {
            const num = Number(value);
            const sign = num >= 0 ? '+' : '';
            return `${sign}${currency}${formatNumber(num)}`;
          },
        },
        grid: { color: 'rgba(51, 65, 85, 0.4)' },
        border: { color: 'rgba(51, 65, 85, 0.6)' },
      },
    },
  };

  return <Line data={data} options={options} />;
};
