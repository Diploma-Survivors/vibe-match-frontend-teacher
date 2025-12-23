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

// Fetch all available tags with pagination, sorting, and filtering
async function getAllTags(
  params?: GetTagListRequest
): Promise<AxiosResponse<ApiResponse<TagListResponse>>> {
  // Mock data
  // Mock data
  const mockTags: Tag[] = Array.from({ length: 50 }).map((_, i) => ({
    id: i + 1,
    name: `Tag ${i + 1}`,
    slug: `tag-${i + 1}`,
    color: ['green', 'yellow', 'red', 'blue', 'purple'][i % 5],
    type: 'default',
    description: `Description for Tag ${i + 1}`,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
    postCount: Math.floor(Math.random() * 1000),
    status: i % 5 === 0 ? 'inactive' : 'active',
  }));

  // Simulate server-side processing
  let filteredTags = [...mockTags];

  // 1. Filtering
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filteredTags = filteredTags.filter(
      (tag) =>
        tag.name.toLowerCase().includes(searchLower) ||
        tag.slug.toLowerCase().includes(searchLower)
    );
  }

  if (params?.filters?.status) {
    filteredTags = filteredTags.filter(
      (tag) => tag.status === params.filters?.status
    );
  }

  // 2. Sorting
  if (params?.sortBy) {
    filteredTags.sort((a, b) => {
      const order = params.sortOrder === 'desc' ? -1 : 1;
      switch (params.sortBy) {
        case TagSortBy.NAME:
          return a.name.localeCompare(b.name) * order;
        case TagSortBy.POST_COUNT:
          return ((a.postCount || 0) - (b.postCount || 0)) * order;
        case TagSortBy.CREATED_AT:
          return (
            (new Date(a.createdAt).getTime() -
              new Date(b.createdAt).getTime()) *
            order
          );
        case TagSortBy.ID:
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
  const paginatedTags = filteredTags.slice(startIndex, endIndex);

  const response: TagListResponse = {
    data: paginatedTags,
    meta: {
      page,
      limit,
      total: filteredTags.length,
      totalPages: Math.ceil(filteredTags.length / limit),
      hasPreviousPage: page > 1,
      hasNextPage: endIndex < filteredTags.length,
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

// Fetch tag by ID
async function getTagById(
  id: string
): Promise<AxiosResponse<ApiResponse<Tag>>> {
  return await clientApi.get(`/tags/${id}`);
}

async function createTag(
  data: CreateTagRequest
): Promise<AxiosResponse<ApiResponse<Tag>>> {
  // Mock create
  console.log('Mock creating tag:', data);
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    data: {
      data: {
        id: Math.floor(Math.random() * 1000),
        name: data.name,
        slug: data.name.toLowerCase().replace(/\s+/g, '-'),
        type: 'default',
        description: '',
        color: 'blue',
        createdAt: new Date().toISOString(),
        status: 'active',
        postCount: 0,
      } as Tag,
      status: HttpStatus.OK,
      apiVersion: '1.0',
    },
    status: 201,
    statusText: 'Created',
    headers: {},
    config: {} as any,
  };
}



async function updateTag(
  id: number,
  data: Partial<Tag>
): Promise<AxiosResponse<ApiResponse<Tag>>> {
  // Mock update
  console.log('Mock updating tag:', id, data);
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    data: {
      data: {
        id,
        name: data.name || 'Updated Tag',
        slug: (data.name || 'updated-tag').toLowerCase().replace(/\s+/g, '-'),
        type: 'default',
        description: '',
        color: 'blue',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        postCount: 0,
      } as Tag,
      status: HttpStatus.OK,
      apiVersion: '1.0',
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  };
}

async function deleteTag(id: number): Promise<AxiosResponse<ApiResponse<void>>> {
  // Mock delete
  console.log('Mock deleting tag:', id);
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    data: {
      data: undefined,
      status: HttpStatus.OK,
      apiVersion: '1.0',
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  };
}

export const TagsService = {
  getAllTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
};
