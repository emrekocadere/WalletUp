import { apiClient } from '../client/axios.client';
import type { AnnualReport } from '@/types/model.types';
import type { ResultT } from '@/types/common.types';

export const reportsApi = {
  getAnnualReport: async (year: number): Promise<AnnualReport> => {
    const { data } = await apiClient.get<ResultT<AnnualReport>>(`/Report/annual/${year}`);
    return data.value!;
  },
};
