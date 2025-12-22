import clientApi from '@/lib/apis/axios-client';
import type { ApiResponse } from '@/types/api';
import {
  type CreateProblemRequest,
  type GetProblemListRequest,
  type Problem,
  type ProblemDataResponse,
  ProblemDifficulty,
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
  // Mock API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  const mockProblem: Problem = {
    id: problemId,
    title: 'Two Sum',
    slug: 'two-sum',
    description: `# Two Sum

Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have **exactly one solution**, and you may not use the *same* element twice.

You can return the answer in any order.

## Example 1:

\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`
`,
    constraints: `- \`2 <= nums.length <= 10^4\`
- \`-10^9 <= nums[i] <= 10^9\`
- \`-10^9 <= target <= 10^9\`
- **Only one valid answer exists.**`,
    difficulty: ProblemDifficulty.EASY,
    timeLimitMs: 1000,
    memoryLimitKb: 256000,
    topics: [
      {
        id: 1,
        name: 'Array',
        slug: 'array',
        description: 'Array problems',
        iconUrl: '',
        orderIndex: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'Hash Table',
        slug: 'hash-table',
        description: 'Hash Table problems',
        iconUrl: '',
        orderIndex: 2,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ],
    tags: [
      {
        id: 1,
        name: 'Blind 75',
        slug: 'blind-75',
        type: 'default',
        description: 'Blind 75 list',
        color: 'blue',
        createdAt: new Date().toISOString(),
      },
    ],
    sampleTestcases: [
      {
        input: '2\n2 7 11 15\n9',
        expectedOutput: '0 1',
        explanation: '2 + 7 = 9',
      },
    ],
    hints: [
      {
        order: 1,
        content:
          'A really brute force way would be to search for all possible pairs of numbers but that would be too slow.',
      },
      {
        order: 2,
        content:
          'So, if we fix one of the numbers, say x, we have to scan the entire array to find the next number y which is value - x where value is the input parameter.',
      },
    ],
    isPremium: false,
    isPublished: true,
    isActive: true,
    hasOfficialSolution: true,
    officialSolutionContent: 'This is the official solution content.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalSubmissions: 100,
    totalAccepted: 50,
    acceptanceRate: 50,
    totalAttempts: 200,
    totalSolved: 50,
    averageTimeToSolve: 300,
    difficultyRating: 1000,
    testcaseCount: 10,
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

async function updateProblem(problem: Problem) {
  const mappedProblem = mapProblemToDTO(problem);
  const formData = serialize(mappedProblem, {
    indices: true,
    nullsAsUndefineds: true,
  });

  return await clientApi.put(`/problems/${problem.id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
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
