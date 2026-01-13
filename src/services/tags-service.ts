import clientApi from '@/lib/apis/axios-client';
import type { ApiResponse } from '@/types/api';
import type {
  Tag,
  TagListResponse,
  GetTagListRequest,
  CreateTagRequest,
} from '@/types/tags';
import { TagSortBy } from '@/types/tags';
import type { AxiosResponse } from 'axios';

import { HttpStatus } from '@/types/api';
import qs from 'qs';

// Fetch all available tags with pagination, sorting, and filtering
async function getAllTagsWithPagination(
  getTagListRequest: GetTagListRequest
): Promise<AxiosResponse<ApiResponse<TagListResponse>>> {
  const { filters, ...rest } = getTagListRequest;
    const params = qs.stringify(
      { ...rest, ...filters },
      {
        allowDots: true,
        skipNulls: true,
      }
    );
  const endpoint = '/tags/admin/list';
  const url = params ? `${endpoint}?${params}` : endpoint;
  return await clientApi.get<ApiResponse<TagListResponse>>(url);
}

async function getAllTags(): Promise<AxiosResponse<ApiResponse<Tag[]>>> {
  return await clientApi.get<ApiResponse<Tag[]>>('/tags');
}

// Fetch tag by ID
async function getTagById(
  id: string
): Promise<AxiosResponse<ApiResponse<Tag>>> {
  return await clientApi.get(`/tags/${id}`);
}

async function createTag(
  data: CreateTagRequest
): Promise<AxiosResponse<ApiResponse<Tag>>> {
  return await clientApi.post('/tags', data);

}



async function updateTag(
  id: number,
  data: Partial<Tag>
): Promise<AxiosResponse<ApiResponse<Tag>>> {
  return await clientApi.put(`/tags/${id}`, data);

}

async function deleteTag(id: number): Promise<AxiosResponse<ApiResponse<void>>> {
  return await clientApi.delete(`/tags/${id}`);
}

async function updateTagStatus(id: number): Promise<AxiosResponse<ApiResponse<any>>> {
  const response = await clientApi.post(`/tags/${id}/toggle`);
  return response;
}

export const TagsService = {
  getAllTagsWithPagination,
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
  updateTagStatus,
};
