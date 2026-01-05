import { ProblemDifficulty } from './problems';
import { VerdictCount } from './problem-statistics';
import { SubmissionStatus } from './submissions';
import { ContestStatus } from './contest';

export interface ContestStatistics {
  contestId: number;
  contestName: string;
  status: ContestStatus;
  startTime: string;
  endTime: string;
  activeUsers: number;
  totalRegistered: number;
  totalSubmissions: number;
  totalParticipants: number;
  totalAccepted: number;
  acceptanceRate: number;
  verdicts: VerdictCount[];
}

export enum ContestProblemStatus {
  SOLVED = 'SOLVED',
  ATTEMPTED = 'ATTEMPTED',
  NOT_STARTED = 'NOT_STARTED',
}

export const ContestProblemStatusLabel : Record<ContestProblemStatus, string> = {
  [ContestProblemStatus.SOLVED]: 'Solved',
  [ContestProblemStatus.ATTEMPTED]: 'Attempted',
  [ContestProblemStatus.NOT_STARTED]: 'Not Started',
}

export interface ProblemStatus {
  problemId: number;
  problemOrder: number; // Q1, Q2, etc.
  status: ContestProblemStatus;
  score?: number;
  time?: string; // Time of submission or time taken
  attempts?: number;
}


export interface LeaderboardEntry {
  rank: number;
  user: {
    id: number;
    username: string;
    avatarUrl?: string;
    fullName?: string;
  };
  totalScore: number;
  totalTime: string; // Format: HH:MM:SS
  problemStatus: ProblemStatus[];
}

export interface ProblemHealth {
  problemId: number;
  problemOrder: number;
  title: string;
  difficulty: ProblemDifficulty;
  totalSubmissions: number;
  solvedCount: number;
  totalParticipants: number;
  solvedPercentage: number;
}

export interface RecentSubmission {
  id: number;
  user: {
    id: number;
    username: string;
    avatarUrl?: string;
  };
  problemOrder: number;
  submittedAt: string; // ISO string
  status: SubmissionStatus;
  runtime: number; // ms
  memory: number; // MB
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

export interface LeaderboardResponse {
  data: LeaderboardEntry[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
