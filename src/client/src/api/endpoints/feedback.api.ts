import { apiClient } from '../client/axios.client';
import type { Result } from '@/types/common.types';

export const feedbackApi = {
  create: async (message: string): Promise<Result> => {
    const { data } = await apiClient.post<Result>('/feedback', { message });
    return data;
  },
};
