import clientApi from '@/lib/apis/axios-client';
import type { CreateTagRequest, Tag } from '@/types/tags';

export class TagsService {
  // create a new tag
  static async createTag(tag: CreateTagRequest): Promise<Tag> {
    try {
      const response = await clientApi.post('/tags', tag);
      return response.data.data;
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }

  // create multiple tags
  static async createTags(tags: CreateTagRequest[]): Promise<Tag[]> {
    try {
      const response = await clientApi.post('/tags/bulk', { tags });
      return response.data.data;
    } catch (error) {
      console.error('Error creating tags:', error);
      throw error;
    }
  }

  // Fetch all available tags
  static async getTags(): Promise<Tag[]> {
    try {
      const response = await clientApi.get('/tags');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  }

  // Fetch tag by ID
  static async getTagById(id: string): Promise<Tag> {
    try {
      const response = await clientApi.get(`/tags/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching tag ${id}:`, error);
      throw error;
    }
  }

  // Update tag by ID
  static async updateTag(tag: CreateTagRequest, id: string): Promise<Tag> {
    try {
      const response = await clientApi.patch(`/tags/${id}`, tag);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating tag ${id}:`, error);
      throw error;
    }
  }

  // Delete tag by ID
  static async deleteTag(id: string): Promise<void> {
    try {
      await clientApi.delete(`/tags/${id}`);
    } catch (error) {
      console.error(`Error deleting tag ${id}:`, error);
      throw error;
    }
  }
}
