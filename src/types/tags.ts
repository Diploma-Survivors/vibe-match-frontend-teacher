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
  status?: 'active' | 'inactive'; // Added for UI
}

export enum TagSortBy {
  ID = 'id',
  NAME = 'name',
  POST_COUNT = 'post_count',
  CREATED_AT = 'created_at',
}

export interface TagFilters {
  status?: 'active' | 'inactive';
  search?: string;
}

export interface GetTagListRequest {
  page?: number;
  limit?: number;
  sortOrder?: 'asc' | 'desc';
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
