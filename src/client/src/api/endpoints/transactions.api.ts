import { apiClient } from '../client/axios.client';
import type {
  Transaction,
  TransactionType,
  TransactionDashboard,
  Currency,
  Country,
} from '@/types/model.types';

import type {  CreateTransactionRequest } from '@/types/request.types';
import type { Result, ResultT, PagedResult } from '@/types/common.types';
import { Category } from '@/types/model.types';

export const transactionsApi = {

  getByAccountId: async (
    accountId: string,
    filters?: {
      categoryId?: string;
      transactionTypeId?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<Transaction[]> => {
    let url = `/Transaction/${accountId}`;
    
    // Query string parametreleri ekle
    const params = new URLSearchParams();
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.transactionTypeId) params.append('transactionTypeId', filters.transactionTypeId);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    
    params.append('pageSize', '1000');

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const { data } = await apiClient.get<ResultT<PagedResult<Transaction>>>(url);
    return data.value!.items;
  },

  create: async (transaction: CreateTransactionRequest): Promise<Result> => {
    const { data } = await apiClient.post<Result>('/transaction', transaction);
    return data;
  },

  delete: async (id: string): Promise<Result> => {
    const { data } = await apiClient.delete<Result>(`/transaction/${id}`);
    return data;
  },

  update: async (id: string, transaction: CreateTransactionRequest): Promise<Result> => {
    const { data } = await apiClient.put<Result>(`/transaction/${id}`, transaction);
    return data;
  },

  getAllCurrencies: async (): Promise<Currency[]> => {
    const { data } = await apiClient.get<ResultT<Currency[]>>('/Transaction/Currencies');
    return data.value!;
  },

  getAllCountries: async (): Promise<Country[]> => {
    const { data } = await apiClient.get<ResultT<Country[]>>('/Transaction/countries');
    return data.value!;
  },

  getAllCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<ResultT<Category[]>>('/Transaction/categories');
    return data.value!;
  },

  getAllTransactionTypes: async () => {
    const { data } = await apiClient.get<ResultT<TransactionType[]>>('/Transaction/types');
    return data.value!;
  },

  getAll: async (filters?: {
    categoryId?: string;
    transactionTypeId?: string;
    accountId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
  }): Promise<PagedResult<Transaction>> => {
    let url = '/Transaction';

    // Query string parametreleri ekle
    const params = new URLSearchParams();
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.transactionTypeId) params.append('transactionTypeId', filters.transactionTypeId);
    if (filters?.accountId) params.append('accountId', filters.accountId);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    params.append('page', String(filters?.page ?? 1));
    params.append('pageSize', String(filters?.pageSize ?? 20));

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const { data } = await apiClient.get<ResultT<PagedResult<Transaction>>>(url);
    return data.value!;
  },

  getDashboard: async (month: number): Promise<TransactionDashboard> => {
    const { data } = await apiClient.get<ResultT<TransactionDashboard>>(`/Transaction/dashboard/${month}`);
    return data.value!;
  }
};
