import clientApi from '@/lib/apis/axios-client';
import type { ApiResponse } from '@/types/api';
import type {
  CreateProblemRequest,
  GetProblemListRequest,
  ProblemData,
  ProblemDataResponse,
  ProblemEndpointType,
  ProblemListResponse,
} from '@/types/problems';
import type { AxiosResponse } from 'axios';
import { serialize } from 'object-to-formdata';
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

async function createProblem(
  problemRequest: CreateProblemRequest
): Promise<AxiosResponse<ApiResponse<ProblemData>>> {
  if (!problemRequest.testcaseFile) {
    throw new Error('Testcase file is required for complete problem creation.');
  }

  const problemForFormData = {
    ...problemRequest,
    tagIds: JSON.stringify(problemRequest.tagIds),
    topicIds: JSON.stringify(problemRequest.topicIds),
    testcaseSamples: JSON.stringify(problemRequest.testcaseSamples),
  };

  const formData = serialize(problemForFormData, {
    indices: true,
    allowEmptyArrays: true,
    nullsAsUndefineds: true,
  });

  return await clientApi.post('/problems', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

async function getProblemDetail(
  problemId: number
): Promise<AxiosResponse<ApiResponse<ProblemDataResponse>>> {
  return await clientApi.get(`/problems/${problemId}/detail`);
}

function mapProblemToDTO(problem: ProblemData): CreateProblemRequest {
  const { tags, topics, testcase, ...rest } = problem;
  return {
    ...rest,
    tagIds: tags.map((tag) => tag.id),
    topicIds: topics.map((topic) => topic.id),
    testcaseFile: testcase,
  };
}

function mapProblemDataResponseToProblemData(
  problemResponse: ProblemDataResponse
): ProblemData {
  return {
    ...problemResponse,
    testcaseResponse: problemResponse.testcase,
    testcase: null,
  };
}

export const ProblemsService = {
  getProblemList,
  createProblem,
  mapProblemToDTO,
  getProblemDetail,
  mapProblemDataResponseToProblemData,
};
