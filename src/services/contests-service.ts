import clientApi from '@/lib/apis/axios-client';
import type { ApiResponse } from '@/types/api';
import type { Contest, ContestDTO, ContestProblemDTO } from '@/types/contest';
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

export const ContestsService = {
  createContest,
  mapContestToDTO,
  getContestById,
  updateContest,
};
