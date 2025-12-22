import clientApi from '@/lib/apis/axios-client';
import type { ApiResponse } from '@/types/api';
import {
  type CreateProblemRequest,
  type GetProblemListRequest,
  type Problem,
  type ProblemDataResponse,
  type ProblemEndpointType,
  type ProblemListResponse,
  ProblemType,
  ProblemVisibility,
} from '@/types/problems';
import type { AxiosResponse } from 'axios';
import { serialize } from 'object-to-formdata';
import qs from 'qs';
import { HttpStatus } from '@/types/api';

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
): Promise<AxiosResponse<ApiResponse<Problem>>> {
  // const formData = serialize(problemRequest, {
  //   indices: true,
  //   nullsAsUndefineds: true,
  // });

  // return await clientApi.post('/problems', formData, {
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //   },
  // });

  // Mock API call
  console.log('Mock creating problem:', problemRequest);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock response data
  const mockProblem: Problem = {
    id: Math.floor(Math.random() * 1000),
    title: problemRequest.title,
    difficulty: problemRequest.difficulty,
    timeLimitMs: problemRequest.timeLimitMs,
    memoryLimitKb: problemRequest.memoryLimitKb,
    topics: [], // In a real mock, we'd map these from IDs
    tags: [], // In a real mock, we'd map these from IDs
    description: problemRequest.description,
    constraints: problemRequest.constraints,
    sampleTestcases: problemRequest.testcaseSamples,
    hints: [],
    isPremium: problemRequest.isPremium,
    isPublished: problemRequest.isPublished,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    // authorId: 'mock-author-id', // Removed as it's not in Problem interface
    slug: problemRequest.title.toLowerCase().replace(/\s+/g, '-'),
    // averageRating: 0,
    // ratingCount: 0,
    acceptanceRate: 0,
    // submissionCount: 0,
    // acceptedCount: 0,
    testcase: null,
    testcaseResponse: undefined,
    isActive: true,
    totalSubmissions: 0,
    totalAccepted: 0,
    totalAttempts: 0,
    totalSolved: 0,
    averageTimeToSolve: 0,
    difficultyRating: 0,
    testcaseCount: 0,
    similarProblems: [],
  };

  return {
    data: {
      data: mockProblem,
      status: HttpStatus.OK,
      apiVersion: '1.0',
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  };
}

async function getProblemDetail(
  problemId: number
): Promise<AxiosResponse<ApiResponse<ProblemDataResponse>>> {
  return await clientApi.get(`/problems/${problemId}/detail`);
}

async function getProblemById(
  problemId: number
): Promise<AxiosResponse<ApiResponse<Problem>>> {
  return await clientApi.get(`/problems/${problemId}`);
}

async function updateProblem(problem: Problem) {
  const mappedProblem = mapProblemToDTO(problem);
  return await clientApi.patch(`/problems/${problem.id}`, {
    ...mappedProblem,
    tagIds: JSON.stringify(mappedProblem.tagIds),
    topicIds: JSON.stringify(mappedProblem.topicIds),
    testcaseSamples: JSON.stringify(mappedProblem.testcaseSamples),
  });
}

function mapProblemToDTO(problem: Problem): CreateProblemRequest {
  const { tags, topics, testcase, ...rest } = problem;
  return {
    ...rest,
    description: problem.description || '',
    inputDescription: problem.inputDescription || '',
    outputDescription: problem.outputDescription || '',
    maxScore: problem.maxScore || 0,
    timeLimitMs: problem.timeLimitMs,
    memoryLimitKb: problem.memoryLimitKb,
    difficulty: problem.difficulty,
    type: problem.type || ProblemType.STANDALONE, // Default or handle optional
    visibility: problem.visibility || ProblemVisibility.PUBLIC, // Default
    tagIds: tags.map((tag) => tag.id),
    topicIds: topics.map((topic) => topic.id),
    testcaseFile: testcase || null,
    testcaseSamples: problem.sampleTestcases || [],
    constraints: problem.constraints,
    isPremium: problem.isPremium,
    isPublished: problem.isPublished,
    hints: problem.hints,
    hasOfficialSolution: problem.hasOfficialSolution,
    officialSolutionContent: problem.officialSolutionContent,
  };
}

function mapProblemDataResponseToProblemData(
  problemResponse: ProblemDataResponse
): Problem {
  return {
    ...problemResponse,
    testcaseResponse: problemResponse.testcase,
    testcase: null,
    sampleTestcases: problemResponse.testcaseSamples,
    constraints: '', // Default if missing in response
    isActive: true, // Default if missing
    topics: problemResponse.topics || [],
    tags: problemResponse.tags || [],
  };
}

export const ProblemsService = {
  getProblemList,
  createProblem,
  mapProblemToDTO,
  getProblemDetail,
  getProblemById,
  mapProblemDataResponseToProblemData,
  updateProblem,
};
