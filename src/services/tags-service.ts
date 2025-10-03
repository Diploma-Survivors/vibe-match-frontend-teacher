import clientApi from '@/lib/apis/axios-client';
import type { Tag } from '@/types/tags';

export class TagsService {
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

  // Create new tag (if needed in the future)
  static async createTag(tag: Omit<Tag, 'id'>): Promise<Tag> {
    try {
      const response = await clientApi.post('/tags', tag);
      return response.data.data;
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  }

  // Update tag (if needed in the future)
  static async updateTag(id: string, tag: Partial<Tag>): Promise<Tag> {
    try {
      const response = await clientApi.put(`/tags/${id}`, tag);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating tag ${id}:`, error);
      throw error;
    }
  }

  // Delete tag (if needed in the future)
  static async deleteTag(id: string): Promise<void> {
    try {
      await clientApi.delete(`/tags/${id}`);
    } catch (error) {
      console.error(`Error deleting tag ${id}:`, error);
      throw error;
    }
  }
}
