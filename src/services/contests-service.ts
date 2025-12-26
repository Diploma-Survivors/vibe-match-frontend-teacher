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
} from '@/types/contest';
import type { AxiosResponse } from 'axios';
import { ContestProblemStatus, ContestStatistics, LeaderboardEntry, ProblemHealth, RecentSubmission } from '@/types/contest-statistics';
import { SubmissionStatus } from '@/types/submissions';

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

// async function getContestLeaderboard(
//   request: LeaderboardRequest
// ): Promise<LeaderboardResponse> {
//   const { contestId, filters, ...restParams } = request;
//   const url = `/contests/${contestId}/leaderboard`;

//   // Build params with nested filters structure, excluding undefined values
//   const params: Record<string, any> = {};

//   // Only add defined values from restParams
//   for (const [key, value] of Object.entries(restParams)) {
//     if (value !== undefined) {
//       params[key] = value;
//     }
//   }

//   if (filters?.name) {
//     params['filters.name'] = filters.name;
//   }

//   const response = await clientApi.get<ApiResponse<LeaderboardResponse>>(url, {
//     params,
//   });
//   return response.data.data;
// }

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


const generateVerdicts = () => [
  { verdict: 'Accepted', count: 1200, percentage: 45 },
  { verdict: 'Wrong Answer', count: 800, percentage: 30 },
  { verdict: 'Time Limit Exceeded', count: 400, percentage: 15 },
  { verdict: 'Runtime Error', count: 200, percentage: 7.5 },
  { verdict: 'Compilation Error', count: 66, percentage: 2.5 },
];

const generateLeaderboard = (count: number): LeaderboardEntry[] => {
  return Array.from({ length: count }).map((_, i) => ({
    rank: i + 1,
    user: {
      id: i + 1,
      username: `user_${i + 1}`,
      fullName: `User ${i + 1}`,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 1}`,
    },
    totalScore: Math.floor(Math.random() * 400),
    totalTime: `${Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
    problemStatus: [
      { problemId: 1, problemOrder: 1, status: Math.random() > 0.2 ? ContestProblemStatus.SOLVED : ContestProblemStatus.NOT_ATTEMPTED },
      { problemId: 2, problemOrder: 2, status: Math.random() > 0.4 ? ContestProblemStatus.SOLVED : Math.random() > 0.5 ? ContestProblemStatus.NOT_ATTEMPTED : ContestProblemStatus.ATTEMPTED },
      { problemId: 3, problemOrder: 3, status: Math.random() > 0.6 ? ContestProblemStatus.SOLVED : Math.random() > 0.5 ? ContestProblemStatus.NOT_ATTEMPTED : ContestProblemStatus.ATTEMPTED },
      { problemId: 4, problemOrder: 4, status: Math.random() > 0.8 ? ContestProblemStatus.SOLVED : Math.random() > 0.5 ? ContestProblemStatus.NOT_ATTEMPTED : ContestProblemStatus.ATTEMPTED },
    ],
  }));
};

const generateProblemHealth = (): ProblemHealth[] => [
  {
    problemId: 1,
    problemOrder: 1,
    title: 'Two Sum',
    difficulty: ProblemDifficulty.EASY,
    solvedCount: 800,
    totalParticipants: 1000,
    solvedPercentage: 80,
  },
  {
    problemId: 2,
    problemOrder: 2,
    title: 'Add Two Numbers',
    difficulty: ProblemDifficulty.MEDIUM,
    solvedCount: 500,
    totalParticipants: 1000,
    solvedPercentage: 50,
  },
  {
    problemId: 3,
    problemOrder: 3,
    title: 'Longest Substring Without Repeating Characters',
    difficulty: ProblemDifficulty.MEDIUM,
    solvedCount: 300,
    totalParticipants: 1000,
    solvedPercentage: 30,
  },
  {
    problemId: 4,
    problemOrder: 4,
    title: 'Median of Two Sorted Arrays',
    difficulty: ProblemDifficulty.HARD,
    solvedCount: 100,
    totalParticipants: 1000,
    solvedPercentage: 10,
  },
];

const generateRecentSubmissions = (count: number): RecentSubmission[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    user: {
      id: i + 1,
      username: `user_${Math.floor(Math.random() * 100)}`,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 1}`,
    },
    problemOrder: Math.floor(Math.random() * 4) + 1,
    submittedAt: new Date().toISOString(),
    timeAgo: `${Math.floor(Math.random() * 60)}s ago`,
    status: Math.random() > 0.3 ? SubmissionStatus.ACCEPTED : SubmissionStatus.WRONG_ANSWER,
    runtime: Math.floor(Math.random() * 100),
    memory: Math.floor(Math.random() * 50),
  }));
};

async function getContestStatistics(contestId: number): Promise<ContestStatistics> {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
    return {
      contestId,
      contestName: 'Weekly Contest 388',
      status: ContestStatus.ONGOING,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 3600000).toISOString(),
      activeUsers: 2405,
      totalRegistered: 5000,
      totalSubmissions: 15000,
      totalAccepted: 6000,
      acceptanceRate: 40,
      verdicts: generateVerdicts(),
    };
}

// Store mock leaderboard in memory to simulate persistence and updates
let MOCK_LEADERBOARD: LeaderboardEntry[] = [];

const updateMockLeaderboard = () => {
  if (MOCK_LEADERBOARD.length === 0) {
    MOCK_LEADERBOARD = generateLeaderboard(100);
  }

  // Randomly update 5 participants
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * MOCK_LEADERBOARD.length);
    const entry = MOCK_LEADERBOARD[randomIndex];
    
    // 50% chance to solve a new problem or improve score
    if (Math.random() > 0.5) {
      entry.totalScore += 10;
      
      // Update a random problem status
      const problemIndex = Math.floor(Math.random() * 4);
      if (entry.problemStatus[problemIndex].status !== ContestProblemStatus.SOLVED) {
         entry.problemStatus[problemIndex].status = ContestProblemStatus.SOLVED;
      }
    }
  }

  // Re-sort leaderboard based on score (desc)
  MOCK_LEADERBOARD.sort((a, b) => b.totalScore - a.totalScore);

  // Update ranks
  MOCK_LEADERBOARD.forEach((entry, index) => {
    entry.rank = index + 1;
  });
};

async function getLiveLeaderboard(contestId: number, page: number = 1, limit: number = 20, search?: string): Promise<{ data: LeaderboardEntry[], meta: { page: number, limit: number, total: number, totalPages: number } }> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Simulate live updates
    updateMockLeaderboard();

    const allEntries = MOCK_LEADERBOARD;
    // Simple filter
    const filtered = search 
      ? allEntries.filter(e => e.user.username.includes(search) || e.user.fullName?.includes(search))
      : allEntries;
    
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    
    return {
      data: filtered.slice(start, start + limit),
      meta: {
        page,
        limit,
        total,
        totalPages
      }
    };
}

async function getProblemHealth(contestId: number): Promise<ProblemHealth[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return generateProblemHealth();
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
