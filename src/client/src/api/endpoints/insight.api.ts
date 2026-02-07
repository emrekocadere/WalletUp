import { apiClient } from '../client/axios.client';
import type { InsightDto } from '@/types/ai.types';
import type { ResultT } from '@/types/common.types';

export const insightApi = {
  getInsight: async (taskName: string): Promise<InsightDto> => {
    const { data } = await apiClient.get<InsightDto | ResultT<InsightDto>>('/Insight', {
      params: { taskName },
      timeout: 0,
    });

    if ((data as ResultT<InsightDto>).value) {
      return (data as ResultT<InsightDto>).value!;
    }

    return data as InsightDto;
  },
};
