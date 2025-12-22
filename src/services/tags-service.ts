import clientApi from '@/lib/apis/axios-client';
import type { ApiResponse } from '@/types/api';
import type { Tag } from '@/types/tags';
import type { AxiosResponse } from 'axios';

import { HttpStatus } from '@/types/api';

// Fetch all available tags
async function getAllTags(): Promise<AxiosResponse<ApiResponse<Tag[]>>> {
  // Mock data
  const mockTags: Tag[] = [
    {
      id: 1,
      name: 'Easy',
      slug: 'easy',
      color: 'green',
      type: 'default',
      description: '',
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 2,
      name: 'Medium',
      slug: 'medium',
      color: 'yellow',
      type: 'default',
      description: '',
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 3,
      name: 'Hard',
      slug: 'hard',
      color: 'red',
      type: 'default',
      description: '',
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 4,
      name: 'Interview',
      slug: 'interview',
      color: 'blue',
      type: 'default',
      description: '',
      createdAt: '',
      updatedAt: '',
    },
  ];

  return {
    data: {
      data: mockTags,
      status: HttpStatus.OK,
      apiVersion: '1.0',
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  };
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
