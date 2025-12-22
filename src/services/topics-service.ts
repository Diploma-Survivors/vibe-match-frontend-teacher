import clientApi from '@/lib/apis/axios-client';
import type { ApiResponse } from '@/types/api';
import type { Topic } from '@/types/topics';
import type { AxiosResponse } from 'axios';

import { HttpStatus } from '@/types/api';

// Fetch all available Topics
async function getAllTopics(): Promise<AxiosResponse<ApiResponse<Topic[]>>> {
  // Mock data
  const mockTopics: Topic[] = [
    {
      id: 1,
      name: 'Arrays',
      slug: 'arrays',
      description: '',
      iconUrl: '',
      orderIndex: 1,
      isActive: true,
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 2,
      name: 'Strings',
      slug: 'strings',
      description: '',
      iconUrl: '',
      orderIndex: 2,
      isActive: true,
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 3,
      name: 'Dynamic Programming',
      slug: 'dp',
      description: '',
      iconUrl: '',
      orderIndex: 3,
      isActive: true,
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 4,
      name: 'Graph',
      slug: 'graph',
      description: '',
      iconUrl: '',
      orderIndex: 4,
      isActive: true,
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 5,
      name: 'Math',
      slug: 'math',
      description: '',
      iconUrl: '',
      orderIndex: 5,
      isActive: true,
      createdAt: '',
      updatedAt: '',
    },
  ];

  return {
    data: {
      data: mockTopics,
      status: HttpStatus.OK,
      apiVersion: '1.0',
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  };
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
