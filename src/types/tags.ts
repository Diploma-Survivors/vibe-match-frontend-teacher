import { SortOrder } from "./problems";

export interface CreateTagRequest {
  name: string;
  slug?: string;
  description?: string;
}

export interface UpdateTagRequest {
  name?: string;
  slug?: string;
  description?: string;
}
export interface Tag {
  id: number;
  name: string;
  slug: string;
  type: string;
  description: string;
  color: string;
  createdAt: string;
  updatedAt?: string;
  postCount?: number; // Added for UI
  isActive?: boolean; // Added for UI
}

export enum TagSortBy {
  ID = 'id',
  CREATED_AT = 'createdAt',
}

export interface TagFilters {
  isActive?: boolean;
  search?: string;
}

export interface GetTagListRequest {
  page?: number;
  limit?: number;
  sortOrder?: SortOrder;
  sortBy?: TagSortBy;
  filters?: TagFilters;
  search?: string;
}

export interface TagMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface TagListResponse {
  data: Tag[];
  meta: TagMeta;
}
