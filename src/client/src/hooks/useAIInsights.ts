import { useState, useEffect } from 'react';
import type { AIInsight, InsightDto } from '@/types/ai.types';
import { insightApi } from '@/api/endpoints/insight.api';

interface UseAIInsightsOptions {
  pageType: 'dashboard' | 'accounts' | 'transactions' | 'goals' | 'account-detail';
  taskName?: string;
  enabled?: boolean;
}

const DEFAULT_TASK_NAME = 'spending_behavior_analysis';

const buildInsightsFromDto = (
  dto: InsightDto,
  pageType: AIInsight['pageType'],
  taskName: string
): AIInsight[] => {
  const createdAt = new Date().toISOString();
  const insights: AIInsight[] = [];

  if (dto.summary) {
    insights.push({
      id: `${taskName}-summary`,
      title: 'Spending Behavior Analysis',
      summary: dto.summary,
      fullContent: dto.summary,
      icon: 'lightbulb',
      variant: 'info',
      pageType,
      createdAt,
    });
  }

  if (dto.recommendations?.length) {
    dto.recommendations.forEach((recommendation, index) => {
      insights.push({
        id: `${taskName}-rec-${index}`,
        title: recommendation.title,
        summary: recommendation.description,
        fullContent: recommendation.description,
        icon: 'chart',
        variant: 'primary',
        pageType,
        createdAt,
      });
    });
  }

  return insights;
};

export const useAIInsights = ({ pageType, taskName, enabled = true }: UseAIInsightsOptions) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const resolvedTaskName = taskName ?? DEFAULT_TASK_NAME;

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const fetchInsights = async () => {
      try {
        setLoading(true);
        setError(null);


        const result = await insightApi.getInsight(resolvedTaskName);
        setInsights(buildInsightsFromDto(result, pageType, resolvedTaskName));
      } catch (err) {
        setError('Failed to load AI insights');
        console.error('Error fetching AI insights:', err);
        setInsights([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [pageType, enabled, resolvedTaskName]);

  return { insights, loading, error };
};
