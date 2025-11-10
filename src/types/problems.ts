import { z } from 'zod';
import type { UserInfo } from './states';
import type { Tag } from './tags';
import type { TestCase, TestcaseSample } from './testcases';
import type { Topic } from './topics';

export enum ProblemDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum ProblemVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

export enum SortBy {
  TITLE = 'title',
  DIFFICULTY = 'difficulty',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum ProblemType {
  STANDALONE = 'standalone',
  CONTEST = 'contest',
}

export enum MatchMode {
  ANY = 'any',
  ALL = 'all',
}

export interface CreateProblemRequest {
  title: string;
  description: string;
  inputDescription: string;
  outputDescription: string;
  maxScore: number;
  timeLimitMs: number;
  memoryLimitKb: number;
  difficulty: ProblemDifficulty;
  type: ProblemType;
  visibility: ProblemVisibility;
  tagIds: number[];
  topicIds: number[];
  testcaseFile: File | null;
  testcaseSamples: TestcaseSample[];
}

export interface TestcaseFileResponse {
  id: number;
  fileUrl: string;
}

export interface ProblemQuickStats {
  totalSubmissions: number;
  totalAcceptedSubmissions: number;
  acceptanceRate: number;
  solvedUsers: number;
  averageAttempts: number;
}

export interface ProblemData {
  id: number;
  title: string;
  description: string;
  inputDescription: string;
  outputDescription: string;
  maxScore: number;
  timeLimitMs: number;
  memoryLimitKb: number;
  difficulty: ProblemDifficulty;
  type: ProblemType;
  visibility: ProblemVisibility;
  createdAt?: string;
  updatedAt?: string;
  tags: Tag[];
  topics: Topic[];
  testcase: File | null;
  testcaseSamples: TestcaseSample[];
  score?: number; // For use in contests or assignments
  testcaseResponse?: TestcaseFileResponse;
  quickStats?: ProblemQuickStats;
}

export interface ProblemDataResponse {
  id: number;
  title: string;
  description: string;
  inputDescription: string;
  outputDescription: string;
  maxScore: number;
  timeLimitMs: number;
  memoryLimitKb: number;
  difficulty: ProblemDifficulty;
  visibility: ProblemVisibility;
  type: ProblemType;
  createdAt?: string;
  updatedAt?: string;
  author: UserInfo;
  tags: Tag[];
  topics: Topic[];
  testcase: TestcaseFileResponse;
  testcaseSamples: TestcaseSample[];
  quickStats: ProblemQuickStats;
}

export const initialProblemData: ProblemData = {
  id: 0,
  title: '',
  description: '',
  inputDescription: '',
  outputDescription: '',
  maxScore: 100,
  timeLimitMs: 1000,
  memoryLimitKb: 256000,
  difficulty: ProblemDifficulty.EASY,
  visibility: ProblemVisibility.PUBLIC,
  type: ProblemType.CONTEST,
  tags: [],
  topics: [],
  testcase: null,
  testcaseSamples: [],
};

export interface ProblemFilters {
  difficulty?: ProblemDifficulty;
  type?: ProblemType;
  topicIds?: number[];
  tagIds?: number[];
}

export interface GetProblemListRequest {
  keyword?: string;
  after?: string;
  before?: string;
  first?: number;
  last?: number;
  sortOrder?: SortOrder;
  matchMode?: MatchMode;
  sortBy?: SortBy;
  filters?: ProblemFilters;
}

export interface ProblemEdge {
  node: ProblemData;
  cursor: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

export interface ProblemListResponse {
  edges: ProblemEdge[];
  pageInfos: PageInfo;
  totalCount: number;
}

export const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Dễ' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'hard', label: 'Khó' },
];

export const TAG_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'easy', label: 'Dễ' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'hard', label: 'Khó' },
];

export const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
];

export enum ProblemEndpointType {
  SELECTABLE_FOR_CONTEST = 'selectable-for-contest',
  SELECTABLE_FOR_ASSIGNMENT = 'selectable-for-assignment',
  TRAINING = 'training',
}

export const DIFFICULTY_LABELS = new Map([
  [ProblemDifficulty.EASY, 'Dễ'],
  [ProblemDifficulty.MEDIUM, 'Trung bình'],
  [ProblemDifficulty.HARD, 'Khó'],
]);

export const DIFFICULTY_COLORS = new Map([
  [ProblemDifficulty.EASY, 'bg-green-100 text-green-800 hover:bg-green-200'],
  [
    ProblemDifficulty.MEDIUM,
    'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  ],
  [ProblemDifficulty.HARD, 'bg-red-100 text-red-800 hover:bg-red-200'],
]);

export const DEFAULT_DIFFICULTY_COLOR =
  'bg-gray-100 text-gray-800 hover:bg-gray-200';

export const getDifficultyColor = (difficulty: ProblemDifficulty): string => {
  return DIFFICULTY_COLORS.get(difficulty) || DEFAULT_DIFFICULTY_COLOR;
};

export const getDifficultyLabel = (difficulty: ProblemDifficulty): string => {
  return DIFFICULTY_LABELS.get(difficulty) || difficulty;
};

export const ProblemSchema = z
  .object({
    id: z.number(),
    title: z
      .string()
      .trim()
      .min(3, 'Tên bài tập phải có ít nhất 3 ký tự')
      .max(128, 'Tên bài tập không được vượt quá 128 ký tự'),

    description: z
      .string()
      .trim()
      .min(16, 'Mô tả bài tập phải có ít nhất 16 ký tự')
      .max(512, 'Mô tả bài tập không được vượt quá 512 ký tự'),

    inputDescription: z
      .string()
      .trim()
      .min(3, 'Mô tả đầu vào phải có ít nhất 3 ký tự')
      .max(512, 'Mô tả đầu vào không được vượt quá 512 ký tự'),

    outputDescription: z
      .string()
      .trim()
      .min(1, 'Mô tả đầu ra phải có ít nhất 1 ký tự')
      .max(512, 'Mô tả đầu ra không được vượt quá 512 ký tự'),

    maxScore: z
      .number('Điểm tối đa phải là số')
      .positive('Điểm tối đa phải là số dương'),

    timeLimitMs: z
      .number('Giới hạn thời gian phải là số')
      .positive('Giới hạn thời gian phải là số dương'),

    memoryLimitKb: z
      .number('Giới hạn bộ nhớ phải là số')
      .positive('Giới hạn bộ nhớ phải là số dương'),

    difficulty: z.enum(ProblemDifficulty, {
      error: () => ({ message: 'Vui lòng chọn mức độ khó' }),
    }),
    visibility: z.enum(ProblemVisibility, {
      error: () => ({ message: 'Vui lòng chọn phạm vi' }),
    }),
    type: z.enum(ProblemType, {
      error: () => ({ message: 'Vui lòng chọn loại cho bài tập' }),
    }),
    topics: z
      .array(z.any())
      .min(1, 'Vui lòng chọn ít nhất một chủ đề')
      .max(3, 'Chỉ được chọn tối đa 3 chủ đề'),
    tags: z
      .array(z.any())
      .min(1, 'Vui lòng chọn ít nhất một tag')
      .max(4, 'Chỉ được chọn tối đa 4 tag'),
    testcase: z.instanceof(File).nullable(), // We'll add custom validation for this
    testcaseSamples: z
      .array(z.any())
      .min(1, 'Vui lòng thêm ít nhất một test case mẫu'),
  })
  .refine((data) => data.testcase !== undefined && data.testcase !== null, {
    message: 'File test case là bắt buộc',
    path: ['testcase'],
  });

export const AllowedTypes = ['text/plain'];

export const AllowedExtensions = ['.txt'];
