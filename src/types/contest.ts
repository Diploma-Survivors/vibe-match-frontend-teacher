import { z } from 'zod';
import type { ProblemData } from './problems';

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
  upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  ongoing: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  finished: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  public:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  private:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
} as const;

export const CONTEST_STATUS_LABELS = {
  upcoming: 'Sắp diễn ra',
  ongoing: 'Đang diễn ra',
  finished: 'Đã kết thúc',
  public: 'Công khai',
  private: 'Riêng tư',
} as const;

export const PARTICIPATION_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'yes', label: 'Đã tham gia' },
  { value: 'no', label: 'Chưa tham gia' },
];

export const CONTEST_DEADLINE_ENFORCEMENT_OPTIONS = [
  {
    value: ContestDeadlineEnforcement.STRICT,
    label: 'Không cho phép nộp muộn',
  },
  { value: ContestDeadlineEnforcement.FLEXIBLE, label: 'Cho phép nộp muộn' },
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
    description: z
      .string()
      .trim()
      .min(10, 'Mô tả cuộc thi phải có ít nhất 10 ký tự')
      .max(500, 'Mô tả cuộc thi không được vượt quá 500 ký tự'),
    deadlineEnforcement: z.enum(ContestDeadlineEnforcement, {
      error: () => ({ message: 'Quy định nộp muộn là bắt buộc' }),
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

export const initialContestData: Contest = {
  name: '',
  description: '',
  startTime: '',
  endTime: '',
  deadlineEnforcement: ContestDeadlineEnforcement.STRICT,
  isHasDurationMinutes: false,
  problems: [],
};
