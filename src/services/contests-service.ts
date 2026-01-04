import clientApi from '@/lib/apis/axios-client';
import { HttpStatus, type ApiResponse } from '@/types/api';
import {
  ContestStatus,
  type Contest,
  type ContestCreateRequest,
  type ContestProblemDTO,
  type LeaderboardRequest,
  type LeaderboardResponse,
  type SubmissionDetailsResponse,
  type SubmissionsOverviewRequest,
  type SubmissionsOverviewResponse,
  type ContestListResponse,
} from '@/types/contest';
import type { AxiosResponse } from 'axios';
import { ContestProblemStatus, ContestStatistics, LeaderboardEntry, ProblemHealth, RecentSubmission } from '@/types/contest-statistics';
import { SubmissionStatus } from '@/types/submissions';

import { ProblemDifficulty } from '@/types/problems';
import { addMinutes, differenceInMinutes } from 'date-fns';

async function createContest(
  contestDTO: ContestCreateRequest
): Promise<AxiosResponse<ApiResponse<Contest>>> {
  const url = '/contests';
  return clientApi.post(url, contestDTO);
}

function mapContestToDTO(contest: Contest): ContestCreateRequest {
  return {
    ...contest,
    problems: contest.problems.map((problem) => ({
      problemId: problem.problem.id!,
      order: problem.orderIndex,
      score: problem.points || 0,
    })),
  };
}

async function getContestById(id: string) {
  const url = `/contests/${id}`;
  const response = await clientApi.get<ApiResponse<Contest>>(url);
  
  if (response.data.data) {
    const contest = response.data.data;
    if (contest.startTime && contest.endTime) {
      contest.durationMinutes = differenceInMinutes(new Date(contest.endTime), new Date(contest.startTime));
    }
    contest.problems = contest.contestProblems ?? [];
  }
  
  return response;
}

async function updateContest(
  id: string,
  contestDTO: Partial<ContestCreateRequest>
): Promise<AxiosResponse<ApiResponse<Contest>>> {
  const url = `/contests/${id}`;
  return clientApi.put(url, contestDTO);
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

async function getContests(params?: any) {
  const url = '/contests';
  const response = await clientApi.get<ApiResponse<ContestListResponse>>(url, { params });
  
  if (response.data.data && Array.isArray(response.data.data.data)) {
    response.data.data.data = response.data.data.data.map((contest) => {
      if (contest.startTime && contest.endTime) {
        contest.durationMinutes = differenceInMinutes(new Date(contest.endTime), new Date(contest.startTime));
      }
      return contest;
    });
  }
  
  return response;
}

async function getContestStatistics(contestId: number): Promise<ContestStatistics> {
    const url = `/contests/${contestId}/statistics`;
    const response = await clientApi.get<ApiResponse<ContestStatistics>>(url);
    return response.data.data;
}

async function getLiveLeaderboard(contestId: number, page: number = 1, limit: number = 20, search?: string): Promise<{ data: LeaderboardEntry[], meta: { page: number, limit: number, total: number, totalPages: number } }> {
    const url = `/contests/${contestId}/leaderboard`;
    const params: any = { page, limit };
    if (search) params.search = search;

    // We might need to adapt the response if the API returns LeaderboardResponse (Graphql style)
    // But for now assuming the API might have been updated or we map it.
    // Let's try to fetch and map if possible, or assume the API returns what we need.
    // Given the previous code had getContestLeaderboard returning LeaderboardResponse, let's use that and map it.
    
    const response = await clientApi.get<ApiResponse<LeaderboardResponse>>(url, { params });
    const leaderboardData = response.data.data;

    // Map LeaderboardResponse to LeaderboardEntry[]
    const mappedData: LeaderboardEntry[] = leaderboardData.rankings.edges.map(edge => ({
        rank: edge.node.rank,
        user: {
            id: edge.node.user.id,
            username: edge.node.user.email, // Using email as username fallback or if that's what's available
            fullName: `${edge.node.user.firstName} ${edge.node.user.lastName}`,
        },
        totalScore: edge.node.finalScore,
        totalTime: edge.node.totalTime,
        problemStatus: edge.node.problemResults.map(pr => ({
            problemId: pr.problemId,
            problemOrder: 0, // We might need to look up order from contest problems if available, or just use 0
            status: pr.status === 'SOLVED' ? ContestProblemStatus.SOLVED : 
                    pr.status === 'UNSOLVED' ? ContestProblemStatus.ATTEMPTED : 
                    ContestProblemStatus.NOT_ATTEMPTED,
            score: pr.score,
            time: pr.time
        }))
    }));

    return {
        data: mappedData,
        meta: {
            page: leaderboardData.rankings.pageInfos.hasNextPage ? page : page, // Approximation
            limit,
            total: leaderboardData.rankings.totalCount,
            totalPages: Math.ceil(leaderboardData.rankings.totalCount / limit)
        }
    };
}

async function getProblemHealth(contestId: number): Promise<ProblemHealth[]> {
    const url = `/contests/${contestId}/problems/health`;
    const response = await clientApi.get<ApiResponse<ProblemHealth[]>>(url);
    return response.data.data;
}

export const ContestsService = {
  createContest,
  mapContestToDTO,
  getContestById,
  updateContest,
  getContestSubmissionsOverview,
  getSubmissionDetails,
  getContests,
  getContestStatistics,
  getLiveLeaderboard,
  getProblemHealth,
};
