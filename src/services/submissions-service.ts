import { ProgrammingLanguage } from '@/types/languages';
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

const MOCK_SUBMISSIONS: any[] = [];

// Generate 5 submissions for each of the 100 users to ensure everyone has history
for (let userId = 1; userId <= 100; userId++) {
  for (let i = 0; i < 5; i++) {
    const globalIndex = (userId - 1) * 5 + i;
    const statuses = Object.values(SubmissionStatus);
    const status = statuses[globalIndex % statuses.length];
    
    MOCK_SUBMISSIONS.push({
      id: globalIndex + 1,
      status: status,
      executionTime: Math.floor(Math.random() * 1000),
      memoryUsed: Math.floor(Math.random() * 50000),  
      testcasesPassed: status === SubmissionStatus.ACCEPTED ? 10 : Math.floor(Math.random() * 10),
      totalTestcases: 10,
      testcaseResults: Array.from({ length: 10 }).map((_, j) => {
        let caseStatus = SubmissionStatus.ACCEPTED;
        if (status !== SubmissionStatus.ACCEPTED) {
            if (j === 9) caseStatus = status;
        }
        return {
          testcaseId: j + 1,
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
        id: userId,
        username: `user_${userId}`,
        fullName: `User ${userId}`,
        email: `user_${userId}@example.com`,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      } as Partial<UserProfile>,
      problem: {
        id: (i % 4) + 1,
        title: `Problem ${(i % 4) + 1}`,
        slug: `problem-${(i % 4) + 1}`,
      } as Partial<Problem>,
      compileError: status === SubmissionStatus.COMPILATION_ERROR ? 'Syntax error on line 5...' : '',
      runtimeError: status === SubmissionStatus.RUNTIME_ERROR ? 'Runtime error: index out of bounds...' : '',
      submittedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      problemId: (i % 4) + 1,
      languageId: (i % 4) + 1,
      contestId: 1,
    });
  }
}

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

    if (params.filters?.userId) {
      filteredSubmissions = filteredSubmissions.filter(
        (s) => s.user.id === params.filters?.userId
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


export const getStatusColor = (status: SubmissionStatus) => {
        switch (status) {
            case SubmissionStatus.ACCEPTED:
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
            case SubmissionStatus.WRONG_ANSWER:
                return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
            case SubmissionStatus.PENDING:
            case SubmissionStatus.RUNNING:
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
            case SubmissionStatus.TIME_LIMIT_EXCEEDED:
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
            default:
                // Runtime errors and others
                return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
        }
    };

export const getStatusLabel = (status: SubmissionStatus) => {
        const RUNTIME_ERRORS = [
            SubmissionStatus.SIGSEGV,
            SubmissionStatus.SIGXFSZ,
            SubmissionStatus.SIGFPE,
            SubmissionStatus.SIGABRT,
            SubmissionStatus.NZEC,
            SubmissionStatus.RUNTIME_ERROR,
        ];

        if (RUNTIME_ERRORS.includes(status)) {
            return 'Runtime Error';
        }
        return status;
    };

export const getLanguageName = (languageId: number, languages: ProgrammingLanguage[]) => {
        const language = languages.find((l) => l.id === languageId);
        return language ? language.name : 'Unknown';
    };
