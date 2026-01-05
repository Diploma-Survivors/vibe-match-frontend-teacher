import { ProgrammingLanguage } from '@/types/languages';
import { Problem } from '@/types/problems';
import {
  GetSubmissionListRequest,
  Submission,
  SubmissionListResponse,
  SubmissionStatus,
  SubmissionStatusLabels,
} from '@/types/submissions';
import { UserProfile } from '@/types/user';
import clientApi from '@/lib/apis/axios-client';
import { ApiResponse } from '@/types/api';
import { AxiosResponse } from 'axios';


export const SubmissionsService = {
  getSubmissions: async (
    params: GetSubmissionListRequest
  ): Promise<AxiosResponse<ApiResponse<SubmissionListResponse>>> => {
    const response = await clientApi.get('/submissions', { params });
    return response;
  },

  getSubmissionById: async (id: number): Promise<AxiosResponse<ApiResponse<Submission>>> => {
    const response = await clientApi.get(`/submissions/${id}`);
    return response;
  },
};


export const getStatusColor = (status: SubmissionStatus) => {
        switch (status) {
            case SubmissionStatus.ACCEPTED:
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
            case SubmissionStatus.WRONG_ANSWER:
                return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
            case SubmissionStatus.PENDING:
            case SubmissionStatus.RUNNING:
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
            case SubmissionStatus.TIME_LIMIT_EXCEEDED:
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
            default:
                // Runtime errors and others
                return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
        }
    };

export const getStatusLabel = (status: SubmissionStatus) => {
        return SubmissionStatusLabels[status];
  };

export const getLanguageName = (languageId: number, languages: ProgrammingLanguage[]) => {
        const language = languages.find((l) => l.id === languageId);
        return language ? language.name : 'Unknown';
    };
