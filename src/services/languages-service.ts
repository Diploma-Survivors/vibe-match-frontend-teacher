import { ApiResponse } from '@/types/api';
import type { ProgrammingLanguage } from '@/types/languages';
import { AxiosResponse } from 'axios';
import clientApi from '@/lib/apis/axios-client';

export const LanguagesService = {
  getAllProgrammingLanguages: async (): Promise<AxiosResponse<ApiResponse<ProgrammingLanguage[]>>> => {
    const response = await clientApi.get('/programming-languages/active');
    return response;
  },
};
