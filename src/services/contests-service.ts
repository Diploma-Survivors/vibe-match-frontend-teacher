import clientApi from '@/lib/apis/axios-client';
import type { ApiResponse } from '@/types/api';
import type {
  Contest,
  ContestDTO,
  ContestProblemDTO,
  LeaderboardRequest,
  LeaderboardResponse,
  SubmissionDetailsResponse,
  SubmissionsOverviewRequest,
  SubmissionsOverviewResponse,
} from '@/types/contest';
import type { AxiosResponse } from 'axios';

async function createContest(
  contestDTO: ContestDTO
): Promise<AxiosResponse<ApiResponse<ContestDTO>>> {
  return await clientApi.post<ApiResponse<ContestDTO>>('/contests', contestDTO);
}

function mapContestToDTO(contest: Contest): ContestDTO {
  return {
    ...contest,
    problems: contest.problems.map(
      (problem) =>
        ({
          problemId: problem.id,
          score: problem.score,
        }) as ContestProblemDTO
    ),
  };
}

async function getContestById(id: string) {
  return await clientApi.get(`/contests/${id}`);
}

async function updateContest(
  id: string,
  contestDTO: ContestDTO
): Promise<AxiosResponse<ApiResponse<ContestDTO>>> {
  return await clientApi.put<ApiResponse<ContestDTO>>(
    `/contests/${id}`,
    contestDTO
  );
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

export const ContestsService = {
  createContest,
  mapContestToDTO,
  getContestById,
  updateContest,
  getContestLeaderboard,
  getContestSubmissionsOverview,
  getSubmissionDetails,
  getSubmissionById,
};
