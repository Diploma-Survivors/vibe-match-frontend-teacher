import type { PageInfo, SortOrder } from './leaderboard';

export type { PageInfo, SortOrder };

export interface SubmissionUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface SubmissionNode {
  id: number;
  user: SubmissionUser;
  startTime: string;
  endTime: string | null;
  finalScore: number;
}

export interface SubmissionEdge {
  node: SubmissionNode;
  cursor: string;
}

export interface SubmissionsFilters {
  name?: string;
  sortOrder?: SortOrder;
}

export interface SubmissionsOverviewRequest {
  contestId: string;
  filters?: {
    name?: string;
  };
  first?: number;
  after?: string;
  last?: number;
  before?: string;
  sortOrder?: SortOrder;
}

export interface SubmissionsOverviewResponse {
  edges: SubmissionEdge[];
  pageInfos: PageInfo;
  totalCount: number;
}

// Submission Details Types
export interface SubmissionLanguage {
  id: number;
  name: string;
}

export interface SubmissionDetailNode {
  id: number;
  status: string;
  score: number;
  runtime: number;
  memory: number;
  language: SubmissionLanguage;
  note: string | null;
  user: SubmissionUser;
}

export interface SubmissionDetailEdge {
  node: SubmissionDetailNode;
  cursor: string;
}

export interface SubmissionDetailsResponse {
  edges: SubmissionDetailEdge[];
  pageInfos: PageInfo;
  totalCount: number;
}
