import { z } from 'zod';
import type { ProblemData } from './problems';

export interface Contest {
  id?: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  problems: ProblemData[];
  status: ContestStatus;
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
    status: z.enum(ContestStatus, {
      error: () => ({ message: 'Phạm vi truy cập là bắt buộc' }),
    }),
    startTime: z
      .string()
      .min(1, 'Thời gian bắt đầu là bắt buộc')
      .refine((val) => new Date(val) > new Date(), {
        message: 'Thời gian bắt đầu phải ở trong tương lai',
      }),
    endTime: z.string().min(1, 'Thời gian kết thúc là bắt buộc'),
    durationMinutes: z.number().positive('Thời lượng cuộc thi phải lớn hơn 0'),
    problems: z.array(z.any()).min(1, 'Cuộc thi phải có ít nhất 1 bài'),
    id: z.number().optional(),
    createdBy: z.string().optional(),
  })
  .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
    path: ['endTime'],
  });

export const initialContestData: Contest = {
  name: '',
  description: '',
  startTime: '',
  endTime: '',
  durationMinutes: 180,
  status: ContestStatus.PRIVATE,
  problems: [],
};
