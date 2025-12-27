import clientApi from '@/lib/apis/axios-client';
import type { ApiResponse } from '@/types/api';
import type {
  Topic,
  TopicListResponse,
  GetTopicListRequest,
  CreateTopicRequest,
} from '@/types/topics';
import { TopicSortBy } from '@/types/topics';
import type { AxiosResponse } from 'axios';

import { HttpStatus } from '@/types/api';

// Fetch all available Topics with pagination, sorting, and filtering
async function getAllTopics(
  params?: GetTopicListRequest
): Promise<AxiosResponse<ApiResponse<TopicListResponse>>> {
  // Mock data
  // Mock data
  const mockTopics: Topic[] = Array.from({ length: 50 }).map((_, i) => ({
    id: i + 1,
    name: `Topic ${i + 1}`,
    slug: `topic-${i + 1}`,
    description: `Description for Topic ${i + 1}`,
    iconUrl: '',
    orderIndex: i + 1,
    isActive: i % 5 !== 0,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
    postCount: Math.floor(Math.random() * 1000),
  }));

  // Simulate server-side processing
  let filteredTopics = [...mockTopics];

  // 1. Filtering
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filteredTopics = filteredTopics.filter(
      (topic) =>
        topic.name.toLowerCase().includes(searchLower) ||
        topic.slug.toLowerCase().includes(searchLower)
    );
  }

  if (params?.filters?.isActive !== undefined) {
    filteredTopics = filteredTopics.filter(
      (topic) => topic.isActive === params.filters?.isActive
    );
  }

  // 2. Sorting
  if (params?.sortBy) {
    filteredTopics.sort((a, b) => {
      const order = params.sortOrder === 'desc' ? -1 : 1;
      switch (params.sortBy) {
        case TopicSortBy.NAME:
          return a.name.localeCompare(b.name) * order;
        case TopicSortBy.POST_COUNT:
          return ((a.postCount || 0) - (b.postCount || 0)) * order;
        case TopicSortBy.CREATED_AT:
          return (
            (new Date(a.createdAt).getTime() -
              new Date(b.createdAt).getTime()) *
            order
          );
        case TopicSortBy.ID:
        default:
          return (a.id - b.id) * order;
      }
    });
  }

  // 3. Pagination
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTopics = filteredTopics.slice(startIndex, endIndex);

  const response: TopicListResponse = {
    data: paginatedTopics,
    meta: {
      page,
      limit,
      total: filteredTopics.length,
      totalPages: Math.ceil(filteredTopics.length / limit),
      hasPreviousPage: page > 1,
      hasNextPage: endIndex < filteredTopics.length,
    },
  };

  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay

  return {
    data: {
      data: response,
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

async function createTopic(
  data: CreateTopicRequest
): Promise<AxiosResponse<ApiResponse<Topic>>> {
  // Mock create
  console.log('Mock creating topic:', data);
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    data: {
      data: {
        id: Math.floor(Math.random() * 1000),
        name: data.name,
        slug: data.name.toLowerCase().replace(/\s+/g, '-'),
        description: data.description,
        iconUrl: '',
        orderIndex: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        postCount: 0,
      } as Topic,
      status: HttpStatus.OK,
      apiVersion: '1.0',
    },
    status: 201,
    statusText: 'Created',
    headers: {},
    config: {} as any,
  };
}

async function updateTopic(
  id: number,
  data: Partial<Topic>
): Promise<AxiosResponse<ApiResponse<Topic>>> {
  // Mock update
  console.log('Mock updating topic:', id, data);
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    data: {
      data: {
        id,
        name: data.name || 'Updated Topic',
        slug: (data.name || 'updated-topic').toLowerCase().replace(/\s+/g, '-'),
        description: data.description || '',
        iconUrl: '',
        orderIndex: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        postCount: 0,
      } as Topic,
      status: HttpStatus.OK,
      apiVersion: '1.0',
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  };
}

export const TopicsService = {
  getAllTopics,
  getTopicById,
  createTopic,
  updateTopic,
};
