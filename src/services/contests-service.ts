import clientApi from '@/lib/apis/axios-client';
import type { ApiResponse } from '@/types/api';
import type {
  Contest,
  ContestDTO,
  ContestProblemDTO,
  LeaderboardResponse,
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
  id: string,
  params?: {
    keyword?: string;
    after?: string;
    before?: string;
    first?: number;
    last?: number;
    sortOrder?: 'asc' | 'desc';
    matchMode?: 'all' | 'any';
  }
): Promise<LeaderboardResponse> {
  // Mock data since database doesn't have data yet
  const mockResponse: LeaderboardResponse = {
    problems: [
      {
        id: 1,
        title: 'Two Sum',
        description: 'Find two numbers that add up to a target',
        inputDescription: 'Array of integers and target sum',
        outputDescription: 'Indices of the two numbers',
        maxScore: 100,
        timeLimitMs: 1000,
        memoryLimitKb: 1024,
        difficulty: 'EASY' as any,
        type: 'STANDALONE' as any,
        createdAt: '2025-10-01T12:00:00Z',
        updatedAt: '2025-10-01T12:00:00Z',
      },
      {
        id: 2,
        title: 'Binary Search',
        description: 'Implement binary search algorithm',
        inputDescription: 'Sorted array and target value',
        outputDescription: 'Index of target or -1',
        maxScore: 100,
        timeLimitMs: 1000,
        memoryLimitKb: 1024,
        difficulty: 'EASY' as any,
        type: 'STANDALONE' as any,
        createdAt: '2025-10-01T12:00:00Z',
        updatedAt: '2025-10-01T12:00:00Z',
      },
      {
        id: 3,
        title: 'Reverse Linked List',
        description: 'Reverse a singly linked list',
        inputDescription: 'Head of linked list',
        outputDescription: 'New head of reversed list',
        maxScore: 100,
        timeLimitMs: 1000,
        memoryLimitKb: 1024,
        difficulty: 'MEDIUM' as any,
        type: 'STANDALONE' as any,
        createdAt: '2025-10-01T12:00:00Z',
        updatedAt: '2025-10-01T12:00:00Z',
      },
      {
        id: 4,
        title: 'Valid Parentheses',
        description: 'Check if parentheses are valid',
        inputDescription: 'String containing parentheses',
        outputDescription: 'Boolean result',
        maxScore: 100,
        timeLimitMs: 1000,
        memoryLimitKb: 1024,
        difficulty: 'EASY' as any,
        type: 'STANDALONE' as any,
        createdAt: '2025-10-01T12:00:00Z',
        updatedAt: '2025-10-01T12:00:00Z',
      },
      {
        id: 5,
        title: 'Merge Sort',
        description: 'Implement merge sort algorithm',
        inputDescription: 'Unsorted array',
        outputDescription: 'Sorted array',
        maxScore: 100,
        timeLimitMs: 2000,
        memoryLimitKb: 2048,
        difficulty: 'MEDIUM' as any,
        type: 'STANDALONE' as any,
        createdAt: '2025-10-01T12:00:00Z',
        updatedAt: '2025-10-01T12:00:00Z',
      },
    ] as any,
    rankings: {
      edges: [
        {
          node: {
            rank: 1,
            user: {
              id: 1,
              firstName: 'Trần',
              lastName: 'Nhật Longgg',
              email: '22120451@student.hcmus.edu.vn',
            },
            totalScore: 500,
            totalTime: '15:23',
            problemResults: [
              {
                problemId: 1,
                score: 100,
                time: '00:44',
                isAccepted: true,
                attempts: 1,
              },
              {
                problemId: 2,
                score: 100,
                time: '01:47',
                isAccepted: true,
                attempts: 1,
              },
              {
                problemId: 3,
                score: 100,
                time: '03:50',
                isAccepted: true,
                attempts: 1,
              },
              {
                problemId: 4,
                score: 100,
                time: '05:12',
                isAccepted: true,
                attempts: 1,
              },
              {
                problemId: 5,
                score: 100,
                time: '03:50',
                isAccepted: true,
                attempts: 1,
              },
            ],
          },
          cursor: 'eyJpZCI6IjI5ZjllODYxLWQxMWUtNGIxMQ==',
        },
        {
          node: {
            rank: 2,
            user: {
              id: 2,
              firstName: 'Lê',
              lastName: 'Văn Khải',
              email: '22120342@student.hcmus.edu.vn',
            },
            totalScore: 500,
            totalTime: '20:11',
            problemResults: [
              {
                problemId: 1,
                score: 100,
                time: '01:07',
                isAccepted: true,
                attempts: 1,
              },
              {
                problemId: 2,
                score: 100,
                time: '02:25',
                isAccepted: true,
                attempts: 1,
              },
              {
                problemId: 3,
                score: 100,
                time: '04:40',
                isAccepted: true,
                attempts: 1,
              },
              {
                problemId: 4,
                score: 100,
                time: '06:29',
                isAccepted: true,
                attempts: 1,
              },
              {
                problemId: 5,
                score: 100,
                time: '05:30',
                isAccepted: true,
                attempts: 1,
              },
            ],
          },
          cursor: 'eyJpZCI6IjI5ZjllODYxLWQxMWUtNGIxMg==',
        },
        {
          node: {
            rank: 3,
            user: {
              id: 3,
              firstName: 'Trung',
              lastName: 'Lê',
              email: '22120278@student.hcmus.edu.vn',
            },
            totalScore: 500,
            totalTime: '25:23',
            problemResults: [
              {
                problemId: 1,
                score: 100,
                time: '01:29',
                isAccepted: true,
                attempts: 1,
              },
              {
                problemId: 2,
                score: 100,
                time: '02:47',
                isAccepted: true,
                attempts: 1,
              },
              {
                problemId: 3,
                score: 100,
                time: '05:12',
                isAccepted: true,
                attempts: 1,
              },
              {
                problemId: 4,
                score: 100,
                time: '07:25',
                isAccepted: true,
                attempts: 1,
              },
              {
                problemId: 5,
                score: 100,
                time: '08:30',
                isAccepted: true,
                attempts: 1,
              },
            ],
          },
          cursor: 'eyJpZCI6IjI5ZjllODYxLWQxMWUtNGIxMw==',
        },
        {
          node: {
            rank: 4,
            user: {
              id: 4,
              firstName: 'Nguyễn',
              lastName: 'Văn An',
              email: '22120123@student.hcmus.edu.vn',
            },
            totalScore: 400,
            totalTime: '18:45',
            problemResults: [
              {
                problemId: 1,
                score: 100,
                time: '00:52',
                isAccepted: true,
                attempts: 1,
              },
              {
                problemId: 2,
                score: 100,
                time: '02:15',
                isAccepted: true,
                attempts: 2,
              },
              {
                problemId: 3,
                score: 100,
                time: '04:38',
                isAccepted: true,
                attempts: 1,
              },
              {
                problemId: 4,
                score: 100,
                time: '06:00',
                isAccepted: true,
                attempts: 1,
              },
              {
                problemId: 5,
                score: 0,
                time: '05:00',
                isAccepted: false,
                attempts: 3,
              },
            ],
          },
          cursor: 'eyJpZCI6IjI5ZjllODYxLWQxMWUtNGIxNA==',
        },
        {
          node: {
            rank: 5,
            user: {
              id: 5,
              firstName: 'Phạm',
              lastName: 'Thị Bình',
              email: '22120089@student.hcmus.edu.vn',
            },
            totalScore: 300,
            totalTime: '22:30',
            problemResults: [
              {
                problemId: 1,
                score: 100,
                time: '01:20',
                isAccepted: true,
                attempts: 1,
              },
              {
                problemId: 2,
                score: 100,
                time: '03:10',
                isAccepted: true,
                attempts: 1,
              },
              {
                problemId: 3,
                score: 100,
                time: '06:00',
                isAccepted: true,
                attempts: 2,
              },
              {
                problemId: 4,
                score: 0,
                time: '07:00',
                isAccepted: false,
                attempts: 2,
              },
              {
                problemId: 5,
                score: 0,
                time: '05:00',
                isAccepted: false,
                attempts: 1,
              },
            ],
          },
          cursor: 'eyJpZCI6IjI5ZjllODYxLWQxMWUtNGIxNQ==',
        },
      ],
      pageInfos: {
        hasNextPage: true,
        hasPreviousPage: false,
        startCursor: 'eyJpZCI6IjI5ZjllODYxLWQxMWUtNGIxMQ==',
        endCursor: 'eyJpZCI6IjI5ZjllODYxLWQxMWUtNGIxNQ==',
      },
      totalCount: 15,
    },
  };

  // When real API is ready, uncomment this:
  // const response = await clientApi.get<ApiResponse<LeaderboardResponse>>(
  //   `/contests/${id}/leaderboard`,
  //   { params }
  // );
  // return response.data.data;

  return mockResponse;
}

export const ContestsService = {
  createContest,
  mapContestToDTO,
  getContestById,
  updateContest,
  getContestLeaderboard,
};
