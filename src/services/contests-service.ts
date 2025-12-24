import clientApi from '@/lib/apis/axios-client';
import { HttpStatus, type ApiResponse } from '@/types/api';
import type {
  Contest,
  ContestCreateRequest,
  ContestProblemDTO,
  LeaderboardRequest,
  LeaderboardResponse,
  SubmissionDetailsResponse,
  SubmissionsOverviewRequest,
  SubmissionsOverviewResponse,
} from '@/types/contest';
import type { AxiosResponse } from 'axios';

import { ProblemDifficulty } from '@/types/problems';
import { addMinutes } from 'date-fns';

  const mockContest: Contest = {
    id:1,
    name: 'Mock Contest ',
    description: 'This is a mock contest description.',
    startTime: new Date().toISOString(),
    durationMinutes: 120,
    problems: [
      {
        problem: {
          id: 1,
          title: 'Two Sum',
          difficulty: ProblemDifficulty.EASY,
          slug: 'two-sum',
          acceptanceRate: 45.6,
          isPremium: false,
          isPublished: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          timeLimitMs: 1000,
          memoryLimitKb: 256000,
          maxScore: 100,
          topics: [],
          tags: [],
          similarProblems: [],
          description: 'Mock description',
          constraints: '',
          sampleTestcases: [],
          hints: [],
          hasOfficialSolution: false,
          isActive: true,
        },
        order: 0,
      },
      {
        problem: {
          id: 2,
          title: 'Add Two Numbers',
          difficulty: ProblemDifficulty.MEDIUM,
          slug: 'add-two-numbers',
          acceptanceRate: 32.1,
          isPremium: false,
          isPublished: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          timeLimitMs: 1000,
          memoryLimitKb: 256000,
          maxScore: 100,
          topics: [],
          tags: [],
          similarProblems: [],
          description: 'Mock description',
          constraints: '',
          sampleTestcases: [],
          hints: [],
          hasOfficialSolution: false,
          isActive: true,
        },
        order: 1,
      },
    ],
    createdAt: new Date().toISOString(),
    createdBy: 'Mock User',
    status: undefined, // Let UI derive it
    isActive: true,
  };

async function createContest(
  contestDTO: ContestCreateRequest
): Promise<AxiosResponse<ApiResponse<Contest>>> {
  // Mock API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
    data: {
      data: mockContest,
      status: HttpStatus.OK,
      apiVersion: '1.0',
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  };
}

function mapContestToDTO(contest: Contest): ContestCreateRequest {
  return {
    ...contest,
    problems: contest.problems.map((problem) => ({
      problemId: problem.problem.id,
      order: problem.order,
    })),
  };
}

async function getContestById(id: string) {
  // Mock API call
  await new Promise((resolve) => setTimeout(resolve, 500));



  return {
    data: {
      data: mockContest,
      status: 200,
      apiVersion: '1.0',
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  };
}

async function updateContest(
  id: string,
  contestDTO: ContestCreateRequest
): Promise<AxiosResponse<ApiResponse<Contest>>> {
  // Mock API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    data: {
      data: mockContest,
      status: HttpStatus.OK,
      apiVersion: '1.0',
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  };
}

async function getContestLeaderboard(
  request: LeaderboardRequest
): Promise<LeaderboardResponse> {
  const { contestId, filters, ...restParams } = request;
  const url = `/contests/${contestId}/leaderboard`;

  // Build params with nested filters structure, excluding undefined values
  const params: Record<string, any> = {};

  // Only add defined values from restParams
  for (const [key, value] of Object.entries(restParams)) {
    if (value !== undefined) {
      params[key] = value;
    }
  }

  if (filters?.name) {
    params['filters.name'] = filters.name;
  }

  const response = await clientApi.get<ApiResponse<LeaderboardResponse>>(url, {
    params,
  });
  return response.data.data;
}

async function getContestSubmissionsOverview(
  request: SubmissionsOverviewRequest
): Promise<SubmissionsOverviewResponse> {
  const { contestId, filters, ...restParams } = request;
  const url = `/contests/${contestId}/submissions/overview`;

  // Build params with nested filters structure, excluding undefined values
  const params: Record<string, any> = {};

  // Only add defined values from restParams
  for (const [key, value] of Object.entries(restParams)) {
    if (value !== undefined) {
      params[key] = value;
    }
  }

  if (filters?.username) {
    params['filters.username'] = filters.username;
  }

  const response = await clientApi.get<
    ApiResponse<SubmissionsOverviewResponse>
  >(url, {
    params,
  });
  return response.data.data;
}

async function getSubmissionDetails(
  contestParticipationId: number,
  problemId: number,
  params?: {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
    sortOrder?: 'asc' | 'desc';
  }
): Promise<SubmissionDetailsResponse> {
  const url = `/submissions/contest-participation/${contestParticipationId}/problem/${problemId}`;

  const response = await clientApi.get<ApiResponse<SubmissionDetailsResponse>>(
    url,
    {
      params,
    }
  );
  return response.data.data;
}

async function getSubmissionById(submissionId: string) {
  const response = await clientApi.get(`/submissions/${submissionId}`);
  return response.data.data;
}

async function getContests(params?: any) {
  // Mock API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    data: {
      data: [mockContest],
      status: 200,
      apiVersion: '1.0',
      meta: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      }
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  };
}

export const ContestsService = {
  createContest,
  mapContestToDTO,
  getContestById,
  updateContest,
  getContestLeaderboard,
  getContestSubmissionsOverview,
  getSubmissionDetails,
  getSubmissionById,
  getContests,
};
