import { Problem } from '@/types/problems';
import {
  GetSubmissionListRequest,
  Submission,
  SubmissionListResponse,
  SubmissionStatus,
} from '@/types/submissions';
import { UserProfile } from '@/types/user';

const MOCK_SOURCE_CODE = `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> hash;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (hash.find(complement) != hash.end()) {
                return {hash[complement], i};
            }
            hash[nums[i]] = i;
        }
        return {};
    }
};`;

const MOCK_SUBMISSIONS: any[] = Array.from({ length: 100 }).map((_, index) => {
  const statuses = Object.values(SubmissionStatus);
  // Ensure we cycle through all statuses to have at least one of each
  const status = statuses[index % statuses.length];
  
  return {
    id: index + 1,
    status: status,
    executionTime: Math.floor(Math.random() * 1000),
    memoryUsed: Math.floor(Math.random() * 50000),  
    testcasesPassed: status === SubmissionStatus.ACCEPTED ? 10 : Math.floor(Math.random() * 10),
    totalTestcases: 10,
    testcaseResults:
      Array.from({ length: 10 }).map((_, i) => {
            // For accepted submissions, all test cases are accepted
            // For others, make the last one fail with the submission status
            // and mix in some other statuses for variety if requested,
            // but strictly following the submission status logic:
            // usually if overall is X, at least one test case is X.
            
            let caseStatus = SubmissionStatus.ACCEPTED;
            if (status !== SubmissionStatus.ACCEPTED) {
                // Make the last test case fail with the main status
                if (i === 9) {
                    caseStatus = status;
                } 
                // Just for "include all statuses" variety as requested, 
                // maybe we can make some intermediate ones different if it's not Accepted?
                // But to be consistent, usually it's Accepted until the first failure.
                // I will stick to: Accepted...Accepted -> FailureStatus.
            }

            return {
              testcaseId: i + 1,
              status: caseStatus,
              actualOutput: 'Actual output content...',
              expectedOutput: 'Expected output content...',
              executionTime: Math.floor(Math.random() * 100),
              memoryUsed: Math.floor(Math.random() * 50000),
              error: caseStatus !== SubmissionStatus.ACCEPTED ? 'Error description...' : '',
            };
          }),
    sourceCode: MOCK_SOURCE_CODE,
    user: {
      id: 1,
      username: 'html',
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      avatarUrl: 'https://github.com/shadcn.png',
    } as Partial<UserProfile>,
    problem: {
      id: 1,
      title: `Problem ${index + 1}`,
      slug: `problem-${index + 1}`,
    } as Partial<Problem>,
    compileError: status === SubmissionStatus.COMPILATION_ERROR ? 'Syntax error on line 5...' : '',
    runtimeError: status === SubmissionStatus.RUNTIME_ERROR ? 'Runtime error: index out of bounds...' : '',
    submittedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    problemId: 1,
    languageId: (index % 4) + 1,
    contestId: Math.random() > 0.5 ? 1 : undefined,
  };
});

export const SubmissionsService = {
  getSubmissions: async (
    params: GetSubmissionListRequest
  ): Promise<{ data: { data: SubmissionListResponse } }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredSubmissions = [...MOCK_SUBMISSIONS];

    if (params.filters?.status) {
      filteredSubmissions = filteredSubmissions.filter(
        (s) => s.status === params.filters?.status
      );
    }

    if (params.filters?.languageIds && params.filters.languageIds.length > 0) {
      filteredSubmissions = filteredSubmissions.filter(
        (s) => params.filters?.languageIds?.includes(s.languageId)
      );
    }
    
    if (params.filters?.problemIds && params.filters.problemIds.length > 0) {
       filteredSubmissions = filteredSubmissions.filter(
        (s) => params.filters?.problemIds?.includes(s.problemId)
      );
    }

    if (params.filters?.contestIds && params.filters.contestIds.length > 0) {
      filteredSubmissions = filteredSubmissions.filter(
       (s) => s.contestId && params.filters?.contestIds?.includes(s.contestId)
     );
   }

    // Sort
    if (params.sortBy) {
      filteredSubmissions.sort((a, b) => {
        const aValue = a[params.sortBy!];
        const bValue = b[params.sortBy!];
        if (params.sortOrder === 'desc') {
          return aValue < bValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    } else {
        // Default sort by submittedAt desc
        filteredSubmissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    }

    const page = params.page || 1;
    const limit = params.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSubmissions = filteredSubmissions.slice(startIndex, endIndex);

    return {
      data: {
        data: {
          data: paginatedSubmissions,
          meta: {
            page,
            limit,
            total: filteredSubmissions.length,
            totalPages: Math.ceil(filteredSubmissions.length / limit),
            hasPreviousPage: page > 1,
            hasNextPage: endIndex < filteredSubmissions.length,
          },
        },
      },
    };
  },

  getSubmissionById: async (id: number): Promise<{ data: Submission }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const submission = MOCK_SUBMISSIONS.find((s) => s.id === id);
    if (!submission) {
      throw new Error('Submission not found');
    }
    return { data: submission };
  },
};
