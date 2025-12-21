import { ProblemsService } from '@/services/problems-service';
import {
  type GetProblemListRequest,
  type Problem,
  type ProblemEndpointType,
  type ProblemFilters,
  type ProblemListResponse,
  type ProblemMeta,
  SortBy,
  SortOrder,
} from '@/types/problems';
import { useCallback, useEffect, useState } from 'react';

const ITEMS_PER_PAGE = 20;

interface UseProblemsState {
  problems: Problem[];
  meta: ProblemMeta | null;
  isLoading: boolean;
  error: string | null;
}

interface UseProblemsActions {
  handleFiltersChange: (newFilters: ProblemFilters) => void;
  handleKeywordChange: (newKeyword: string) => void;
  handleSortByChange: (newSortBy: SortBy) => void;
  handleSortOrderChange: (newSortOrder: SortOrder) => void;
  handleSearch: () => void;
  handleReset: () => void;
  handlePageChange: (page: number) => void;
}

interface UseProblemsReturn extends UseProblemsState, UseProblemsActions {
  totalCount: number;
  // Request params (exposed for UI)
  filters: ProblemFilters;
  keyword: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
}

export default function useProblems(
  endpointType: ProblemEndpointType
): UseProblemsReturn {
  // Main state to manage problems and loading/error states
  const [state, setState] = useState<UseProblemsState>({
    problems: [],
    meta: null,
    isLoading: false,
    error: null,
  });

  // states for filters and keyword to manage input values
  const [filters, setFilters] = useState<ProblemFilters>({});
  const [keyword, setKeyword] = useState<string>('');

  // state for sorting
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.TITLE);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);

  // Request state to manage API request parameters
  const [request, setRequest] = useState<GetProblemListRequest>({
    page: 1,
    limit: ITEMS_PER_PAGE,
    sortBy: sortBy || SortBy.TITLE,
    sortOrder: sortOrder || SortOrder.DESC,
    filters: {
      ...filters,
    },
  });

  // Fetch problems function
  const fetchProblems = useCallback(
    async (requestParams: GetProblemListRequest) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        
        // Mock API call since endpoint is not available
        // In a real scenario, we would call ProblemsService.getProblemList(requestParams, endpointType)
        
        // Simulating API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock data generation (replace with actual service call when available)
        // For now, we'll try to use the service if it exists, otherwise fallback or mock
        // Since the user asked to mock, we will implement a mock fetch here or in the service.
        // Let's assume we need to mock it here for now as the service might not be updated.
        
        // However, to keep it clean, let's try to call the service and if it fails or we want to force mock:
        // But the user explicitly said "this endpoint is not available, so please mock them"
        
        // Let's generate some mock data based on the request
        const mockProblems: Problem[] = Array.from({ length: requestParams.limit || 20 }).map((_, i) => ({
          id: (requestParams.page || 1) * 100 + i,
          title: `Problem ${((requestParams.page || 1) - 1) * 20 + i + 1} - ${requestParams.search || 'Random'}`,
          slug: `problem-${((requestParams.page || 1) - 1) * 20 + i + 1}`,
          description: 'Description',
          difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as any,
          isPremium: Math.random() > 0.8,
          isPublished: true,
          isActive: true,
          totalSubmissions: Math.floor(Math.random() * 1000),
          totalAccepted: Math.floor(Math.random() * 500),
          acceptanceRate: Math.random() * 100,
          tags: [
            { id: 1, name: 'Array', slug: 'array', color: 'blue', type: 'default', description: '', createdAt: '', updatedAt: '' },
            { id: 2, name: 'Easy', slug: 'easy', color: 'green', type: 'default', description: '', createdAt: '', updatedAt: '' }
          ],
          topics: [
             { id: 1, name: 'Algorithms', slug: 'algorithms', description: 'Algorithmic problems', iconUrl: '', orderIndex: 1, isActive: true, createdAt: '', updatedAt: '' }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          constraints: '',
          timeLimitMs: 1000,
          memoryLimitKb: 256,
          sampleTestcases: [],
          hints: [],
          hasOfficialSolution: false,
          testcaseCount: 0,
        }));

        const mockResponse: ProblemListResponse = {
          data: mockProblems,
          meta: {
            page: requestParams.page || 1,
            limit: requestParams.limit || 20,
            total: 100, // Mock total
            totalPages: 5,
            hasPreviousPage: (requestParams.page || 1) > 1,
            hasNextPage: (requestParams.page || 1) < 5,
          },
        };

        setState((prev) => ({
          ...prev,
          problems: mockResponse.data,
          meta: mockResponse.meta,
          isLoading: false,
        }));
      } catch (err) {
        console.error('Error fetching problems:', err);
        setState((prev) => ({
          ...prev,
          error: "Can't load the problems.",
          isLoading: false,
        }));
      }
    },
    [endpointType]
  );

  // Effect to fetch problems when request changes
  useEffect(() => {
    fetchProblems(request);
  }, [request, fetchProblems]);

  // Helper function to update request
  const updateRequest = useCallback(
    (updates: Partial<GetProblemListRequest>) => {
      setRequest((prev) => ({
        ...prev,
        ...updates,
      }));
    },
    []
  );

  // handle filter, keyword changes
  const handleFiltersChange = useCallback((newFilters: ProblemFilters) => {
    setFilters(newFilters);
    // When filters change, reset to page 1
    updateRequest({ filters: newFilters, page: 1 });
  }, [updateRequest]);

  const handleKeywordChange = useCallback((newKeyword: string) => {
    setKeyword(newKeyword);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      updateRequest({
        search: keyword.trim() || undefined,
        page: 1,
      });
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [keyword, updateRequest]);

  // handle sorting changes
  const handleSortByChange = useCallback(
    (newSortBy: SortBy) => {
      setSortBy(newSortBy);
      updateRequest({ sortBy: newSortBy, page: 1 });
    },
    [updateRequest]
  );

  const handleSortOrderChange = useCallback(
    (newSortOrder: SortOrder) => {
      setSortOrder(newSortOrder);
      updateRequest({ sortOrder: newSortOrder, page: 1 });
    },
    [updateRequest]
  );

  // handle page change
  const handlePageChange = useCallback((page: number) => {
    updateRequest({ page });
  }, [updateRequest]);

  // handle search (now just forces a refresh if needed, but debounce handles typing)
  const handleSearch = useCallback(() => {
    const trimmedKeyword = keyword.trim();
    updateRequest({
      search: trimmedKeyword || undefined,
      filters: { ...filters },
      page: 1,
    });
  }, [keyword, filters, updateRequest]);

  // handle reset
  const handleReset = useCallback(() => {
    setFilters({});
    setKeyword('');
    setSortBy(SortBy.TITLE);
    setSortOrder(SortOrder.DESC);

    updateRequest({
      search: undefined,
      filters: {},
      page: 1,
      sortBy: SortBy.TITLE,
      sortOrder: SortOrder.DESC,
    });
  }, [updateRequest]);

  return {
    // State
    problems: state.problems,
    meta: state.meta,
    totalCount: state.meta?.total || 0,
    isLoading: state.isLoading,
    error: state.error,

    // Request params (exposed for UI)
    filters,
    keyword,
    sortBy,
    sortOrder,

    // Handlers
    handleFiltersChange,
    handleKeywordChange,
    handleSortByChange,
    handleSortOrderChange,
    handleSearch,
    handleReset,
    handlePageChange,
  };
}
