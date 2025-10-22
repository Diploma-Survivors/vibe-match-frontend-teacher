import clientApi from '@/lib/apis/axios-client';
import type { ApiResponse } from '@/types/api';
import type { Tag } from '@/types/tags';
import type { AxiosResponse } from 'axios';

// Fetch all available tags
async function getAllTags(): Promise<AxiosResponse<ApiResponse<Tag[]>>> {
  return await clientApi.get('/tags');
}

// Fetch tag by ID
async function getTagById(
  id: string
): Promise<AxiosResponse<ApiResponse<Tag>>> {
  return await clientApi.get(`/tags/${id}`);
}

export const TagsService = {
  getAllTags,
  getTagById,
};
