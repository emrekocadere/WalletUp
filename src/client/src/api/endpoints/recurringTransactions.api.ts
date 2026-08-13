import { apiClient } from '../client/axios.client';
import type {
  RecurringTransaction,
  CreateRecurringTransactionRequest,
  UpdateRecurringTransactionRequest,
} from '@/types/model.types';
import type { Result, ResultT } from '@/types/common.types';

export const recurringTransactionsApi = {
  getAll: async (): Promise<RecurringTransaction[]> => {
    const { data } = await apiClient.get<ResultT<RecurringTransaction[]>>('/RecurringTransaction');
    return data.value!;
  },

  create: async (request: CreateRecurringTransactionRequest): Promise<Result> => {
    const { data } = await apiClient.post<Result>('/RecurringTransaction', request);
    return data;
  },

  update: async (id: string, request: UpdateRecurringTransactionRequest): Promise<Result> => {
    const { data } = await apiClient.put<Result>(`/RecurringTransaction/${id}`, request);
    return data;
  },

  delete: async (id: string): Promise<Result> => {
    const { data } = await apiClient.delete<Result>(`/RecurringTransaction/${id}`);
    return data;
  },

  toggleActive: async (id: string): Promise<Result> => {
    const { data } = await apiClient.patch<Result>(`/RecurringTransaction/${id}/toggle-active`);
    return data;
  },
};
