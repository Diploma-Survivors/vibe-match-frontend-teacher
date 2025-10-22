import clientApi from '@/lib/apis/axios-client';
import type { ApiResponse } from '@/types/api';
import type { Topic } from '@/types/topics';
import type { AxiosResponse } from 'axios';

// Fetch all available Topics
async function getAllTopics(): Promise<AxiosResponse<ApiResponse<Topic[]>>> {
  return await clientApi.get('/topics');
}

// Fetch Topic by ID
async function getTopicById(
  id: string
): Promise<AxiosResponse<ApiResponse<Topic>>> {
  return await clientApi.get(`/topics/${id}`);
}

export const TopicsService = {
  getAllTopics,
  getTopicById,
};
