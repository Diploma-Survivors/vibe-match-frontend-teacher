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
  totalAccepted: number;
  acceptanceRate: number;
  verdicts: VerdictCount[];
}

export enum ContestProblemStatus {
  SOLVED = 'SOLVED',
  ATTEMPTED = 'ATTEMPTED',
  NOT_ATTEMPTED = 'NOT_ATTEMPTED',
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
  timeAgo: string; // e.g., "10s ago" - computed or provided
  status: SubmissionStatus;
  runtime: number; // ms
  memory: number; // MB
}
