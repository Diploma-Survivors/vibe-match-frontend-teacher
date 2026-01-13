import clientApi from '@/lib/apis/axios-client';
import { HttpStatus, type ApiResponse } from '@/types/api';
import {
  ContestStatus,
  type Contest,
  type ContestCreateRequest,
  type ContestProblemDTO,
  type SubmissionsOverviewRequest,
  type ContestListResponse,
} from '@/types/contest';
import type { AxiosResponse } from 'axios';
import { ContestProblemStatus, ContestStatistics, LeaderboardEntry, LeaderboardResponse, ProblemHealth, RecentSubmission } from '@/types/contest-statistics';
import { SubmissionStatus } from '@/types/submissions';

import { ProblemDifficulty } from '@/types/problems';
import { addMinutes, differenceInMinutes } from 'date-fns';
import qs from 'qs';


async function createContest(
  contestDTO: ContestCreateRequest
): Promise<AxiosResponse<ApiResponse<Contest>>> {
  const url = '/contests';
  return clientApi.post(url, contestDTO);
}

async function getContestById(id: string) {
  const url = `/contests/${id}`;
  const response = await clientApi.get<ApiResponse<Contest>>(url);
  
  if (response.data.data) {
    const contest = response.data.data;
    if (contest.startTime && contest.endTime) {
      contest.durationMinutes = differenceInMinutes(new Date(contest.endTime), new Date(contest.startTime));
    }
    contest.contestProblems = contest.contestProblems ?? [];
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

async function getContests(params?: any) {
  const url = '/contests/admin';
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

async function getContestStatistics(contestId: number): Promise<AxiosResponse<ApiResponse<ContestStatistics>>> {
    const url = `/contests/${contestId}/statistics`;
    const response = await clientApi.get<ApiResponse<ContestStatistics>>(url);
    return response;
}

async function getContestLeaderboard(
  id: string,
  params?: { page?: number; limit?: number; search?: string }
): Promise<AxiosResponse<ApiResponse<LeaderboardResponse>>> {
  const queryString = qs.stringify(params, {
    allowDots: true,
    skipNulls: true,
  });
  const url = queryString
    ? `/contests/${id}/leaderboard?${queryString}`
    : `/contests/${id}/leaderboard`;
  return await clientApi.get(url);
}

async function getProblemHealth(contestId: number): Promise<AxiosResponse<ApiResponse<ProblemHealth[]>>> {
    const url = `/contests/${contestId}/problems-health`;
    const response = await clientApi.get<ApiResponse<ProblemHealth[]>>(url);
    return response;
}

async function deleteContest(contestId: number): Promise<AxiosResponse<ApiResponse<void>>> {
    const url = `/contests/${contestId}`;
    const response = await clientApi.delete<ApiResponse<void>>(url);
    return response;
}

export const ContestsService = {
  createContest,
  getContestById,
  updateContest,
  getContests,
  getContestStatistics,
  getContestLeaderboard,
  getProblemHealth,
  deleteContest,
};
