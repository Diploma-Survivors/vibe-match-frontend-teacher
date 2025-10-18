import clientApi from '@/lib/apis/axios-client';
import type { ApiResponse } from '@/types/api';
import type {
  CreateProblemRequest,
  GetProblemListRequest,
  ProblemEndpointType,
  ProblemListResponse,
} from '@/types/problems';
import type { AxiosResponse } from 'axios';

async function getProblemList(
  getProblemListRequest: GetProblemListRequest,
  endpointType: ProblemEndpointType
): Promise<AxiosResponse<ApiResponse<ProblemListResponse>>> {
  const params = convertToQueryParams(getProblemListRequest);
  const endpoint = `/problems/${endpointType}`;
  const queryString = params.toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;
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

    console.log('Final request payload:', JSON.stringify(formData, null, 2));

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

function convertToQueryParams(request: GetProblemListRequest): URLSearchParams {
  const params = new URLSearchParams();

  if (request.keyword) {
    params.append('keyword', request.keyword);
  }
  if (request.after) {
    params.append('after', request.after);
  }
  if (request.before) {
    params.append('before', request.before);
  }
  if (request.first) {
    params.append('first', request.first.toString());
  }
  if (request.last) {
    params.append('last', request.last.toString());
  }
  if (request.sortOrder) {
    params.append('sortOrder', request.sortOrder);
  }
  if (request.sortBy) {
    params.append('sortBy', request.sortBy);
  }

  // Handle filters
  if (request.filters) {
    if (request.filters.difficulty) {
      params.append('difficulty', request.filters.difficulty);
    }
    if (request.filters.topic) {
      params.append('topic', request.filters.topic.toString());
    }
    if (request.filters.tags && request.filters.tags.length > 0) {
      for (const tag of request.filters.tags) {
        params.append('tags', tag.toString());
      }
    }
  }

  return params;
}

export const ProblemsService = {
  getProblemList,
  createProblemComplete,
};
