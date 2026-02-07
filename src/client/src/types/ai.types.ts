export interface AIInsight {
  id: string;
  title: string;
  summary: string;
  fullContent: string;
  icon?: 'lightbulb' | 'chart' | 'warning' | 'info';
  variant?: 'primary' | 'success' | 'warning' | 'info';
  pageType: 'dashboard' | 'accounts' | 'transactions' | 'goals' | 'account-detail';
  accountId?: string;
  createdAt: string;
  relevanceScore?: number;
}

export interface AIInsightsResponse {
  insights: AIInsight[];
  total: number;
  pageType: string;
}

export interface AIInsightRequest {
  pageType: 'dashboard' | 'accounts' | 'transactions' | 'goals' | 'account-detail';
  accountId?: string;
  limit?: number;
}

export interface InsightRecommendation {
  title: string;
  description: string;
}

export interface InsightDto {
  summary: string;
  recommendations?: InsightRecommendation[];
}
