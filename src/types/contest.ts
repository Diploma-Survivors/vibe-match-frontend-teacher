import { getLexicalTextLength } from '@/lib/utils';
import { z } from 'zod';
import type { ProblemData } from './problems';

// Leaderboard Types
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

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

export interface Rankings {
  edges: RankingEdge[];
  pageInfos: PageInfo;
  totalCount: number;
}

export interface LeaderboardRequest {
  contestId: string;
  filters?: {
    name?: string;
  };
  first?: number;
  after?: string;
  last?: number;
  before?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface LeaderboardResponse {
  problems: ProblemData[];
  rankings: Rankings;
}

export interface Contest {
  id?: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  isHasDurationMinutes?: boolean;
  durationMinutes?: number;
  lateDeadline?: string;
  deadlineEnforcement: ContestDeadlineEnforcement;
  problems: ProblemData[];
  submissionStrategy: ContestSubmissionStrategy;
  createdBy?: string;
  createdAt?: string;
}

export interface ContestDTO {
  id?: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  durationMinutes?: number;
  lateDeadline?: string;
  deadlineEnforcement: ContestDeadlineEnforcement;
  problems: ContestProblemDTO[];
  createdBy?: string;
  createdAt?: string;
}

export enum ContestStatus {
  PRIVATE = 'private',
  PUBLIC = 'public',
}

export enum ContestDeadlineEnforcement {
  STRICT = 'strict',
  FLEXIBLE = 'flexible',
}

export enum ContestSubmissionStrategy {
  SINGLE_SUBMISSION = 'SINGLE_SUBMISSION',
  BEST_SCORE = 'BEST_SCORE',
  LATEST_SCORE = 'LATEST_SCORE',
  AVERAGE_SCORE = 'AVERAGE_SCORE',
}

export interface ContestFilters {
  id?: number;
  name?: string;
  status?: string;
  accessRange?: string;
}

export const CONTEST_ACCESS_RANGE_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'public', label: 'Công khai' },
  { value: 'private', label: 'Riêng tư' },
];

export const CONTEST_STATUS_COLORS = {
  upcoming: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  ongoing: 'bg-green-100 text-green-800 hover:bg-green-100',
  finished: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
};

export const CONTEST_STATUS_LABELS = {
  upcoming: 'Sắp diễn ra',
  ongoing: 'Đang diễn ra',
  finished: 'Đã kết thúc',
};

export const SUBMISSION_STRATEGY_OPTIONS = [
  {
    value: ContestSubmissionStrategy.SINGLE_SUBMISSION,
    label: 'Chỉ nộp một lần',
  },
  {
    value: ContestSubmissionStrategy.BEST_SCORE,
    label: 'Lấy điểm cao nhất',
  },
  {
    value: ContestSubmissionStrategy.LATEST_SCORE,
    label: 'Lấy điểm lần nộp cuối cùng',
  },
  {
    value: ContestSubmissionStrategy.AVERAGE_SCORE,
    label: 'Lấy điểm trung bình',
  },
];

export const TIMED_PROBLEM_SUBMISSION_POLICY = [
  {
    value: ContestDeadlineEnforcement.STRICT,
    label: 'Tự động nộp bài khi cuộc thi kết thúc',
  },
  {
    value: ContestDeadlineEnforcement.FLEXIBLE,
    label: 'Làm bài cho đến hết Time Limit',
  },
];

export const NON_TIMED_PROBLEM_SUBMISSION_POLICY = [
  {
    value: ContestDeadlineEnforcement.FLEXIBLE,
    label: 'Cho phép nộp muộn',
  },
  {
    value: ContestDeadlineEnforcement.STRICT,
    label: 'Không cho phép nộp muộn',
  },
];

export interface ContestProblemDTO {
  problemId: number;
  score: number;
}

export const ContestSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, 'Tên cuộc thi phải có ít nhất 3 ký tự')
      .max(100, 'Tên cuộc thi không được vượt quá 100 ký tự'),
    description: z.string().superRefine((val, ctx) => {
      const actualLength = getLexicalTextLength(val);

      if (actualLength < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Mô tả cuộc thi phải có ít nhất 10 ký tự',
        });
      }

      if (actualLength > 500) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Mô tả cuộc thi không được vượt quá 500 ký tự',
        });
      }
    }),
    deadlineEnforcement: z.enum(ContestDeadlineEnforcement, {
      error: () => ({ message: 'Quy định nộp muộn là bắt buộc' }),
    }),
    submissionStrategy: z.enum(ContestSubmissionStrategy, {
      error: () => ({ message: 'Chiến lược nộp bài là bắt buộc' }),
    }),
    isHasDurationMinutes: z.any().optional(),
    durationMinutes: z.any().optional(),
    lateDeadline: z.any().optional(),
    startTime: z
      .string()
      .min(1, 'Thời gian bắt đầu là bắt buộc')
      .refine((val) => new Date(val) > new Date(), {
        message: 'Thời gian bắt đầu phải ở trong tương lai',
      }),
    endTime: z.string().min(1, 'Thời gian kết thúc là bắt buộc'),
    // durationMinutes: z.number().positive('Thời lượng cuộc thi phải lớn hơn 0'),
    problems: z.array(z.any()).min(1, 'Cuộc thi phải có ít nhất 1 bài'),
    id: z.number().optional(),
    createdBy: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.isHasDurationMinutes !== true) return true;
      return data.durationMinutes > 0;
    },
    {
      message: 'Thời lượng cuộc thi phải lớn hơn 0',
      path: ['durationMinutes'],
    }
  )
  .refine(
    (data) => {
      if (
        data.isHasDurationMinutes === true ||
        data.deadlineEnforcement === ContestDeadlineEnforcement.STRICT
      )
        return true;
      return data.lateDeadline;
    },
    {
      message: 'Deadline nộp muộn là bắt buộc',
      path: ['lateDeadline'],
    }
  )
  .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
    path: ['endTime'],
  })
  .refine(
    (data) => {
      if (
        data.isHasDurationMinutes === true ||
        data.deadlineEnforcement === ContestDeadlineEnforcement.STRICT
      )
        return true;
      return new Date(data.lateDeadline) > new Date(data.endTime);
    },
    {
      message: 'Deadline nộp muộn phải sau thời gian kết thúc',
      path: ['lateDeadline'],
    }
  );

// Submission Overview Types
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

export interface SubmissionsOverviewRequest {
  contestId: string;
  filters?: {
    username?: string;
  };
  first?: number;
  after?: string;
  last?: number;
  before?: string;
  sortOrder?: 'asc' | 'desc';
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

export const initialContestData: Contest = {
  name: '',
  description: '',
  startTime: '',
  endTime: '',
  deadlineEnforcement: ContestDeadlineEnforcement.STRICT,
  submissionStrategy: ContestSubmissionStrategy.SINGLE_SUBMISSION,
  isHasDurationMinutes: false,
  problems: [],
};
