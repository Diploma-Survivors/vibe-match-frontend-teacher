import type { ProblemData } from './problems';

export interface Contest {
  id?: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  problems: ProblemData[];
  status?: ContestStatus;
  createdBy?: string;
  createdAt?: string;
}

export interface ContestDTO {
  id?: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  problems: ContestProblemDTO[];
  status?: ContestStatus;
  createdBy?: string;
  createdAt?: string;
}

export enum ContestStatus {
  PRIVATE = 'private',
  PUBLIC = 'public',
}

export interface ContestFilters {
  id?: number;
  name?: string;
  status?: string;
  accessRange?: string;
}

export const CONTEST_STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'chưa bắt đầu', label: 'Chưa bắt đầu' },
  { value: 'đang diễn ra', label: 'Đang diễn ra' },
  { value: 'đã kết thúc', label: 'Đã kết thúc' },
];

export const CONTEST_ACCESS_RANGE_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'public', label: 'Công khai' },
  { value: 'private', label: 'Riêng tư' },
];

export interface ContestProblemDTO {
  problemId: number;
  score: number;
}
