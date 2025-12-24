'use client';

import {
  type Contest,
  type ContestFilters,
  type ContestListResponse,
  type ContestMeta,
  ContestSortBy,
  ContestStatus,
  type GetContestListRequest,
} from '@/types/contest';
import { SortOrder } from '@/types/problems';
import { useCallback, useEffect, useState } from 'react';

const ITEMS_PER_PAGE = 20;

interface UseContestState {
  contests: Contest[];
  meta: ContestMeta | null;
  isLoading: boolean;
  error: string | null;
}

interface UseContestActions {
  handleFiltersChange: (newFilters: ContestFilters) => void;
  handleKeywordChange: (newKeyword: string) => void;
  handleSortByChange: (newSortBy: ContestSortBy) => void;
  handleSortOrderChange: (newSortOrder: SortOrder) => void;
  handleSearch: () => void;
  handleReset: () => void;
  handlePageChange: (page: number) => void;
  refresh: () => void;
}

interface UseContestReturn extends UseContestState, UseContestActions {
  totalCount: number;
  // Request params (exposed for UI)
  filters: ContestFilters;
  keyword: string;
  sortBy: ContestSortBy;
  sortOrder: SortOrder;
}

export default function useContest(): UseContestReturn {
  // Main state to manage contests and loading/error states
  const [state, setState] = useState<UseContestState>({
    contests: [],
    meta: null,
    isLoading: false,
    error: null,
  });

  // states for filters and keyword to manage input values
  const [filters, setFilters] = useState<ContestFilters>({});
  const [keyword, setKeyword] = useState<string>('');

  // state for sorting
  const [sortBy, setSortBy] = useState<ContestSortBy>(ContestSortBy.ID);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC);

  // Request state to manage API request parameters
  const [request, setRequest] = useState<GetContestListRequest>({
    page: 1,
    limit: ITEMS_PER_PAGE,
    sortBy: sortBy || ContestSortBy.ID,
    sortOrder: sortOrder || SortOrder.ASC,
    filters: {
      ...filters,
    },
  });

  // Fetch contests function
  const fetchContests = useCallback(
    async (requestParams: GetContestListRequest) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        // Simulating API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock data generation
        const mockContests: Contest[] = Array.from({
          length: requestParams.limit || 20,
        }).map((_, i) => {
          const id = (requestParams.page || 1) * 100 + i;
          const now = new Date();
          let startTime = new Date(now);
          let status = ContestStatus.UPCOMING;

          // Randomize status for mock data
          const rand = Math.random();
          if (rand < 0.33) {
            status = ContestStatus.UPCOMING;
            startTime.setDate(now.getDate() + Math.floor(Math.random() * 10) + 1);
          } else if (rand < 0.66) {
            status = ContestStatus.ONGOING;
            startTime.setHours(now.getHours() - 1);
          } else {
            status = ContestStatus.FINISHED;
            startTime.setDate(now.getDate() - Math.floor(Math.random() * 10) - 1);
          }

          return {
            id,
            name: `Contest ${id} - ${requestParams.search || 'Global Round'}`,
            description: 'This is a mock contest description.',
            startTime: startTime.toISOString(),
            durationMinutes: 120,
            problemIds: [1, 2, 3],
            createdBy: 'Admin',
            createdAt: new Date().toISOString(),
            status: status,
          };
        });

        // Apply client-side filtering for mock data if needed (simplified)
        let filteredContests = mockContests;
        if (requestParams.filters?.statuses?.length) {
           // In a real API this would be handled by backend. 
           // For mock, we just generated random statuses, so we might not get what we asked for if we filter strictly here.
           // But let's just pretend the backend returns what matches.
           // To make the mock feel real, let's filter the generated list if we want, 
           // OR just force the generated items to match the filter if present.
           
           if (requestParams.filters.statuses.length > 0) {
             filteredContests = mockContests.map(c => ({
               ...c,
               status: requestParams.filters!.statuses![Math.floor(Math.random() * requestParams.filters!.statuses!.length)]
             }));
           }
        }

        const mockResponse: ContestListResponse = {
          data: filteredContests,
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
          contests: mockResponse.data,
          meta: mockResponse.meta,
          isLoading: false,
        }));
      } catch (err) {
        console.error('Error fetching contests:', err);
        setState((prev) => ({
          ...prev,
          error: "Can't load the contests.",
          isLoading: false,
        }));
      }
    },
    []
  );

  // Effect to fetch contests when request changes
  useEffect(() => {
    fetchContests(request);
  }, [request, fetchContests]);

  // Helper function to update request
  const updateRequest = useCallback(
    (updates: Partial<GetContestListRequest>) => {
      setRequest((prev) => ({
        ...prev,
        ...updates,
      }));
    },
    []
  );

  // handle filter, keyword changes
  const handleFiltersChange = useCallback(
    (newFilters: ContestFilters) => {
      setFilters(newFilters);
      // When filters change, reset to page 1
      updateRequest({ filters: newFilters, page: 1 });
    },
    [updateRequest]
  );

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
    (newSortBy: ContestSortBy) => {
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
  const handlePageChange = useCallback(
    (page: number) => {
      updateRequest({ page });
    },
    [updateRequest]
  );

  // handle search (now just forces a refresh if needed, but debounce handles typing)
  const handleSearch = useCallback(() => {
    const trimmedKeyword = keyword.trim();
    updateRequest({
      search: trimmedKeyword || undefined,
      filters: { ...filters },
      page: 1,
    });
  }, [keyword, filters, updateRequest]);

  const handleReset = useCallback(() => {
    setFilters({});
    setKeyword('');
    setSortBy(ContestSortBy.ID);
    setSortOrder(SortOrder.ASC);

    updateRequest({
      search: undefined,
      filters: {},
      page: 1,
      sortBy: ContestSortBy.ID,
      sortOrder: SortOrder.ASC,
    });
  }, [updateRequest]);

  const refresh = useCallback(() => {
    fetchContests(request);
  }, [fetchContests, request]);

  return {
    // State
    contests: state.contests,
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
    refresh,
  };
}
