import { useState } from 'react';

interface AIInsightCardProps {
  title: string;
  summary: string;
  fullContent: string;
  icon?: 'lightbulb' | 'chart' | 'warning' | 'info';
  variant?: 'primary' | 'success' | 'warning' | 'info';
  showToggle?: boolean;
}

export const AIInsightCard = ({
  title,
  summary,
  fullContent,
  icon = 'lightbulb',
  variant = 'primary',
  showToggle = true
}: AIInsightCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const content = showToggle ? (isExpanded ? fullContent : summary) : fullContent;

  const variantClasses = {
    primary: 'from-primary-500/10 to-indigo-500/10 border-primary-500/30',
    success: 'from-green-500/10 to-emerald-500/10 border-green-500/30',
    warning: 'from-amber-500/10 to-orange-500/10 border-amber-500/30',
    info: 'from-blue-500/10 to-cyan-500/10 border-blue-500/30',
  };

  const iconColorClasses = {
    primary: 'text-primary-400',
    success: 'text-green-400',
    warning: 'text-amber-400',
    info: 'text-blue-400',
  };

  const icons = {
    lightbulb: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    chart: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${variantClasses[variant]} backdrop-blur-sm transition-all duration-300 hover:shadow-lg`}
    >
      <div className="relative p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center ${iconColorClasses[variant]}`}>
            {icons[icon]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <span className="px-2 py-0.5 text-xs font-medium bg-primary-500/20 text-primary-400 rounded-full">
                AI Insight
              </span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              {content}
            </p>
          </div>
        </div>

        {/* Expand Button */}
        {showToggle && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors mt-2 group"
          >
            <span>{isExpanded ? 'Show less' : 'Show more'}</span>
            <svg
              className={`w-4 h-4 group-hover:translate-x-0.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

