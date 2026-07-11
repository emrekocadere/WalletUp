interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  borderHoverColor: string;
  subtitleColor: string;
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  iconBgColor,
  iconColor,
  subtitleColor,
}: StatCardProps) => {
  return (
    <div className={`bg-white/5 backdrop-blur-xl p-3 sm:p-5 lg:p-8 rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 hover:border-primary-500/30 transition-all duration-300 `}>
      <div className="flex items-center justify-between mb-2 sm:mb-3 lg:mb-4">
        <h3 className="text-gray-400 font-medium text-xs sm:text-sm lg:text-base">{title}</h3>
        <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${iconBgColor} rounded-lg sm:rounded-lg lg:rounded-xl flex items-center justify-center`}>
          <div className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${iconColor}`}>
            {icon}
          </div>
        </div>
      </div>
      <p className="text-lg sm:text-xl lg:text-3xl font-bold text-white break-words">{value}</p>
      <p className={`${subtitleColor} text-xs sm:text-xs lg:text-sm mt-1 sm:mt-2`}>{subtitle}</p>
    </div>
  );
};
