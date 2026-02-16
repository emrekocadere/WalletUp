import { apiClient } from '../client/axios.client';
import type { Result } from '@/types/common.types';

export interface Country {
  id: string;
  name: string;
}

export interface Currency {
  id: string;
  iso4217Code: string;
}

export interface CreatePreferenceRequest {
  currencyId: string;
  countryId: string;
  occupation?: string;
  monthlyIncome?: number;
}

export interface UpdatePreferenceRequest {
  currencyId?: string;
  countryId?: string;
  occupation?: string;
  monthlyIncome?: number;
}


export const preferenceApi = {


  create: async (preferenceData: CreatePreferenceRequest): Promise<Result> => {
    const { data } = await apiClient.post<Result>(
      '/Preference',
      preferenceData
    );
    return data;
  },

  update: async (preferenceData: UpdatePreferenceRequest): Promise<Result> => {
    const { data } = await apiClient.patch<Result>(
      '/Preference',
      preferenceData
    );
    return data;
  },


};
