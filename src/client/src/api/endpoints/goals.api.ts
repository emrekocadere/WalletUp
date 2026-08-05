import { apiClient } from '../client/axios.client';


import type {  AddTransactionToGoalRequest, CreateGoalRequest, UpdateGoalRequest } from '@/types/request.types';
import type { Result,ResultT } from '@/types/common.types';
import { Goal } from '@/types/model.types';

export const goalsApi = {
  

  create: async (goal: CreateGoalRequest): Promise<Result> => {
    const { data } = await apiClient.post<Result>('/goal', goal);
    return data;
  },

  GetAll: async (): Promise<ResultT<Goal[]>> => {
    const { data } = await apiClient.get<ResultT<Goal[]>>('/goal');
    return data;
  },

  addMoney: async (goalId: string, body: AddTransactionToGoalRequest): Promise<Result> => {
    const { data } = await apiClient.post<Result>(`/goal/${goalId}/transaction`, body);
    return data;
  },

  delete: async (goalId: string): Promise<Result> => {
    const { data } = await apiClient.delete<Result>(`/goal/${goalId}`);
    return data;
  },

  update: async (goalId: string, goal: Partial<UpdateGoalRequest>): Promise<Result> => {
    const { data } = await apiClient.patch<Result>(`/goal/${goalId}`, goal);
    return data;
  }

};
  