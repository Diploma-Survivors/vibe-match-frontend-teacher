import clientApi from '@/lib/apis/axios-client';
import type { Topic } from '@/types/topics';

export class TopicsService {
  // Fetch all available topics
  static async getTopics(): Promise<Topic[]> {
    try {
      const response = await clientApi.get('/topics');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching topics:', error);
      throw error;
    }
  }

  // Fetch topic by ID
  static async getTopicById(id: string): Promise<Topic> {
    try {
      const response = await clientApi.get(`/topics/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching topic ${id}:`, error);
      throw error;
    }
  }

  // Create new topic (if needed in the future)
  static async createTopic(topic: Omit<Topic, 'id'>): Promise<Topic> {
    try {
      const response = await clientApi.post('/topics', topic);
      return response.data.data;
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    }
  }

  // Update topic (if needed in the future)
  static async updateTopic(id: string, topic: Partial<Topic>): Promise<Topic> {
    try {
      const response = await clientApi.put(`/topics/${id}`, topic);
      return response.data.data;
    } catch (error) {
      console.error(`Error updating topic ${id}:`, error);
      throw error;
    }
  }

  // Delete topic (if needed in the future)
  static async deleteTopic(id: string): Promise<void> {
    try {
      await clientApi.delete(`/topics/${id}`);
    } catch (error) {
      console.error(`Error deleting topic ${id}:`, error);
      throw error;
    }
  }
}
