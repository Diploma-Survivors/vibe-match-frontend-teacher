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
import qs from 'qs';

// Fetch all available Topics with pagination, sorting, and filtering
async function getAllTopicsWithPagination(
  getTopicListRequest: GetTopicListRequest
): Promise<AxiosResponse<ApiResponse<TopicListResponse>>> {
    const { filters, ...rest } = getTopicListRequest;
    const params = qs.stringify(
      { ...rest, ...filters },
      {
        allowDots: true,
        skipNulls: true,
      }
    );
    const endpoint = '/topics/admin/list';
    const url = params ? `${endpoint}?${params}` : endpoint;
    return await clientApi.get<ApiResponse<TopicListResponse>>(url);

  // Mock data
  // Mock data
  // const mockTopics: Topic[] = Array.from({ length: 50 }).map((_, i) => ({
  //   id: i + 1,
  //   name: `Topic ${i + 1}`,
  //   slug: `topic-${i + 1}`,
  //   description: `Description for Topic ${i + 1}`,
  //   iconUrl: '',
  //   orderIndex: i + 1,
  //   isActive: i % 5 !== 0,
  //   createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  //   updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
  //   postCount: Math.floor(Math.random() * 1000),
  // }));

  // // Simulate server-side processing
  // let filteredTopics = [...mockTopics];

  // // 1. Filtering
  // if (params?.search) {
  //   const searchLower = params.search.toLowerCase();
  //   filteredTopics = filteredTopics.filter(
  //     (topic) =>
  //       topic.name.toLowerCase().includes(searchLower) ||
  //       topic.slug.toLowerCase().includes(searchLower)
  //   );
  // }

  // if (params?.filters?.isActive !== undefined) {
  //   filteredTopics = filteredTopics.filter(
  //     (topic) => topic.isActive === params.filters?.isActive
  //   );
  // }

  // // 2. Sorting
  // if (params?.sortBy) {
  //   filteredTopics.sort((a, b) => {
  //     const order = params.sortOrder === 'desc' ? -1 : 1;
  //     switch (params.sortBy) {
  //       case TopicSortBy.NAME:
  //         return a.name.localeCompare(b.name) * order;
  //       case TopicSortBy.POST_COUNT:
  //         return ((a.postCount || 0) - (b.postCount || 0)) * order;
  //       case TopicSortBy.CREATED_AT:
  //         return (
  //           (new Date(a.createdAt).getTime() -
  //             new Date(b.createdAt).getTime()) *
  //           order
  //         );
  //       case TopicSortBy.ID:
  //       default:
  //         return (a.id - b.id) * order;
  //     }
  //   });
  // }

  // // 3. Pagination
  // const page = params?.page || 1;
  // const limit = params?.limit || 10;
  // const startIndex = (page - 1) * limit;
  // const endIndex = startIndex + limit;
  // const paginatedTopics = filteredTopics.slice(startIndex, endIndex);

  // const response: TopicListResponse = {
  //   data: paginatedTopics,
  //   meta: {
  //     page,
  //     limit,
  //     total: filteredTopics.length,
  //     totalPages: Math.ceil(filteredTopics.length / limit),
  //     hasPreviousPage: page > 1,
  //     hasNextPage: endIndex < filteredTopics.length,
  //   },
  // };

  // await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay

  // return {
  //   data: {
  //     data: response,
  //     status: HttpStatus.OK,
  //     apiVersion: '1.0',
  //   },
  //   status: 200,
  //   statusText: 'OK',
  //   headers: {},
  //   config: {} as any,
  // };
}

async function getAllTopics(): Promise<AxiosResponse<ApiResponse<Topic[]>>> {
  const response = await clientApi.get<ApiResponse<Topic[]>>('/topics');
  return response;
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
  const response = await clientApi.post<ApiResponse<Topic>>('/topics', data);
  return response;
}

async function updateTopic(
  id: number,
  data: Partial<Topic>
): Promise<AxiosResponse<ApiResponse<Topic>>> {
  const response = await clientApi.put<ApiResponse<Topic>>(`/topics/${id}`, data);
  return response;
}

async function deleteTopic(id: number): Promise<AxiosResponse<ApiResponse<Topic>>> {
  const response = await clientApi.delete<ApiResponse<Topic>>(`/topics/${id}`);
  return response;
}

async function updateTopicStatus(id: number): Promise<AxiosResponse<ApiResponse<any>>> {
  const response = await clientApi.post<ApiResponse<any>>(`/topics/${id}/toggle`);
  return response;
}

export const TopicsService = {
  getAllTopicsWithPagination,
  getAllTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
  updateTopicStatus,
};
