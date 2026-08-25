import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { AIInsight } from '@/types/ai.types';
import { AIInsightCard } from './AIInsightCard';
import { AIInsightSkeleton } from './AIInsightSkeleton';

interface AIInsightsSectionProps {
  insights: AIInsight[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
}

export const AIInsightsSection = ({
  insights,
  loading = false,
  error = null,
  emptyMessage
}: AIInsightsSectionProps) => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);

  if (loading) {
    return <AIInsightSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-primary-500/30 bg-primary-500/10 p-4 text-sm text-primary-200">
        {error}
      </div>
    );
  }

  if (!insights || insights.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-slate-800/30 p-4 text-sm text-gray-300">
        {emptyMessage ?? t('common.aiInsightsUnavailable')}
      </div>
    );
  }

  const [summaryInsight, ...detailInsights] = insights;

  return (
    <div className="space-y-3">
      <AIInsightCard
        key={summaryInsight.id}
        title={summaryInsight.title}
        summary={summaryInsight.summary}
        fullContent={summaryInsight.fullContent}
        icon={summaryInsight.icon}
        variant={summaryInsight.variant}
        showToggle={false}
      />

      {detailInsights.length > 0 && (
        <button
          type="button"
          onClick={() => setShowDetails((prev) => !prev)}
          className="flex items-center gap-2 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>{showDetails ? t('common.hideDetails') : t('common.showMore')}</span>
          <svg
            className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      {showDetails &&
        detailInsights.map((insight) => (
          <AIInsightCard
            key={insight.id}
            title={insight.title}
            summary={insight.summary}
            fullContent={insight.fullContent}
            icon={insight.icon}
            variant={insight.variant}
            showToggle={false}
          />
        ))}
    </div>
  );
};
