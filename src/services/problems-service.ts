import clientApi from '@/lib/apis/axios-client';
import {
  type CreateProblemRequest,
  type GetProblemListRequest,
  ProblemData,
  type ProblemListResponse,
} from '@/types/problems';
import { Tag } from '@/types/tags';
import { TestcaseSample } from '@/types/testcases';
import { Topic } from '@/types/topics';
import { TagsService } from './tags-service';
import { TestcasesService } from './testcases-service';
import { TopicsService } from './topics-service';

export class ProblemsService {
  static async getProblemList(
    getProblemListRequest: GetProblemListRequest
  ): Promise<ProblemListResponse> {
    try {
      const response: any = await clientApi.post(
        '/problems/list',
        getProblemListRequest
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching problem list:', error);
      return {
        edges: [],
        pageInfos: {
          hasNextPage: false,
          hasPreviousPage: false,
          startCursor: '',
          endCursor: '',
        },
        totalCount: 0,
      };
    }
  }

  // Complete problem creation workflow
  static async createProblemComplete(
    problemRequest: CreateProblemRequest,
    testcaseFile?: File
  ): Promise<any> {
    try {
      let testcaseId: string;

      // If testcaseFile is provided, upload it first
      if (testcaseFile) {
        testcaseId =
          await TestcasesService.createTestcaseComplete(testcaseFile);
      } else if (problemRequest.testcaseId) {
        // Use existing testcase ID if provided
        testcaseId = problemRequest.testcaseId;
      } else {
        throw new Error('Either testcase file or testcase ID must be provided');
      }

      // Create the request with testcase ID
      const request: CreateProblemRequest = {
        ...problemRequest,
        testcaseId: testcaseId,
        // Ensure arrays are properly formatted
        tagIds: Array.isArray(problemRequest.tagIds)
          ? problemRequest.tagIds
          : [],
        topicIds: Array.isArray(problemRequest.topicIds)
          ? problemRequest.topicIds
          : [],
      };

      console.log('Final request payload:', JSON.stringify(request, null, 2));

      const response = await clientApi.post('/problems', request, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      console.error('Error in complete problem creation:', error);
      throw error;
    }
  }
}
