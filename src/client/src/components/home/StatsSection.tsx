import { useTranslation } from 'react-i18next';

interface StatCardProps {
  value: string;
  label: string;
}

const StatCard = ({ value, label }: StatCardProps) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10">
      <h4 className="text-4xl font-bold text-primary-400 mb-2">{value}</h4>
      <p className="text-gray-400">{label}</p>
    </div>
  );
};

export const StatsSection = () => {
  const { t } = useTranslation('home');
  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <StatCard value="10K+" label={t('statsSection.activeUsers')} />
        <StatCard value="$500M+" label={t('statsSection.trackedExpenses')} />
        <StatCard value="99.9%" label={t('statsSection.uptime')} />
      </div>
    </div>
  );
};
