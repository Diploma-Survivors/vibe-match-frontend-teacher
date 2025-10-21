import clientApi from '@/lib/apis/axios-client';
import type { ApiResponse } from '@/types/api';
import type {
  CreateProblemRequest,
  GetProblemListRequest,
  ProblemEndpointType,
  ProblemListResponse,
} from '@/types/problems';
import type { AxiosResponse } from 'axios';
import qs from 'qs';

async function getProblemList(
  getProblemListRequest: GetProblemListRequest,
  endpointType: ProblemEndpointType
): Promise<AxiosResponse<ApiResponse<ProblemListResponse>>> {
  const params = qs.stringify(getProblemListRequest, {
    allowDots: true,
    skipNulls: true,
  });
  const endpoint = `/problems/${endpointType}`;
  const url = params ? `${endpoint}?${params}` : endpoint;
  return await clientApi.get(url);
}

// Complete problem creation workflow
async function createProblemComplete(
  problemRequest: CreateProblemRequest
): Promise<any> {
  try {
    if (!problemRequest.testcase) {
      throw new Error(
        'Testcase file is required for complete problem creation.'
      );
    }

    const formData = new FormData();
    formData.append('title', problemRequest.title);
    formData.append('description', problemRequest.description);
    formData.append('inputDescription', problemRequest.inputDescription);
    formData.append('outputDescription', problemRequest.outputDescription);
    formData.append('maxScore', problemRequest.maxScore.toString());
    formData.append('timeLimitMs', problemRequest.timeLimitMs.toString());
    formData.append('memoryLimitKb', problemRequest.memoryLimitKb.toString());
    formData.append('difficulty', problemRequest.difficulty);
    formData.append('type', problemRequest.type);
    formData.append('tagIds', JSON.stringify(problemRequest.tagIds || []));
    formData.append('topicIds', JSON.stringify(problemRequest.topicIds || []));
    formData.append('testcaseFile', problemRequest.testcase);
    formData.append(
      'testcaseSamples',
      JSON.stringify(problemRequest.testcaseSamples || [])
    );

    const response = await clientApi.post('/problems', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error in complete problem creation:', error);
    throw error;
  }
}

export const ProblemsService = {
  getProblemList,
  createProblemComplete,
};
