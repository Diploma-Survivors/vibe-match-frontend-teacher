import { SortOrder } from "./problems";

export interface CreateTopicRequest {
  name: string;
  slug?: string;
  description: string;
}

export interface UpdateTopicRequest extends Partial<CreateTopicRequest> {
  isActive?: boolean;
}

// Temporary constants - will be replaced by dynamic data from backend
export const TOPIC_OPTIONS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'algorithms', label: 'Thuật toán' },
  { value: 'data-structures', label: 'Cấu trúc dữ liệu' },
  { value: 'math', label: 'Toán học' },
];
export interface Topic {
  id: number;
  name: string;
  slug: string;
  description: string;
  iconUrl: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  postCount?: number; // Added for UI
}

export enum TopicSortBy {
  ID = 'id',
  CREATED_AT = 'createdAt',
}

export interface TopicFilters {
  isActive?: boolean;
  search?: string;
}

export interface GetTopicListRequest {
  page?: number;
  limit?: number;
  sortOrder?: SortOrder;
  sortBy?: TopicSortBy;
  filters?: TopicFilters;
  search?: string;
}

export interface TopicMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface TopicListResponse {
  data: Topic[];
  meta: TopicMeta;
}
