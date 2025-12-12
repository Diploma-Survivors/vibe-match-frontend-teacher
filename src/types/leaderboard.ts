import type { ProblemData } from './problems';

export type SortOrder = 'asc' | 'desc';

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

export interface LeaderboardUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ProblemResult {
  problemId: number;
  score: number;
  time: string;
  status: 'SOLVED' | 'UNSOLVED' | 'UNATTEMPTED';
}

export interface RankingNode {
  rank: number;
  user: LeaderboardUser;
  finalScore: number;
  totalTime: string;
  problemResults: ProblemResult[];
}

export interface RankingEdge {
  node: RankingNode;
  cursor: string;
}

export interface Rankings {
  edges: RankingEdge[];
  pageInfos: PageInfo;
  totalCount: number;
}

export interface LeaderboardFilters {
  name?: string;
  sortOrder?: SortOrder;
}

export interface LeaderboardRequest {
  contestId: string;
  filters?: LeaderboardFilters;
  first?: number;
  after?: string;
  last?: number;
  before?: string;
}

export interface LeaderboardResponse {
  problems: ProblemData[];
  rankings: Rankings;
}
