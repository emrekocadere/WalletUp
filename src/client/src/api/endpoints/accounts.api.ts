import { apiClient } from '../client/axios.client';
import type { Account, AccountTypeInfo } from '@/types/model.types';
import type { Result, ResultT } from '@/types/common.types';

export interface CreateAccountRequest {
  name: string;
  accountTypeId: string;
  balance: number;
  currencyId: string;
}

export interface UpdateAccountRequest {
  name?: string;
  currencyId?: string;
  accountTypeId?: string;
}

export interface AccountsResponse {
  accounts: Account[];
  totalBalanceBasedOnPreferredCurrency: number;
  accountCount: number;
}

export const accountsApi = {
  getAll: async (): Promise<AccountsResponse> => {
    const { data } = await apiClient.get<ResultT<AccountsResponse>>('/account');
    return data.value!;
  },


  create: async (account: CreateAccountRequest): Promise<ResultT<Account>> => {
    const { data } = await apiClient.post<ResultT<Account>>('/account', account);
    return data;
  },

  delete: async (id: string): Promise<Result> => {
    const { data } = await apiClient.delete<Result>(`/account/${id}`);
    return data;
  },

  getAllAccountTypes: async (): Promise<AccountTypeInfo[]> => {
    const { data } = await apiClient.get<ResultT<AccountTypeInfo[]>>('/Account/AccountTypes');
    return data.value!;
  },

  getById: async (id: string): Promise<Account> => {
    const { data } = await apiClient.get<ResultT<Account>>(`/account/${id}`);
    return data.value!;
  },

  update: async (id: string, account: UpdateAccountRequest): Promise<Result> => {
    const { data } = await apiClient.put<Result>(`/account/${id}`, account);
    return data;
  },
};