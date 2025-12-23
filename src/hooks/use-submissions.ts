'use client';

import { SubmissionsService } from '@/services/submissions-service';
import {
  GetSubmissionListRequest,
  Submission,
  SubmissionFilters,
  SubmissionMeta,
  SubmissionSortBy,
  SubmissionStatus,
} from '@/types/submissions';
import { useCallback, useEffect, useState } from 'react';

const ITEMS_PER_PAGE = 20;

interface UseSubmissionsState {
  submissions: Submission[];
  meta: SubmissionMeta | null;
  isLoading: boolean;
  error: string | null;
}

interface UseSubmissionsActions {
  handleFiltersChange: (newFilters: SubmissionFilters) => void;
  handleSortByChange: (newSortBy: SubmissionSortBy) => void;
  handleSortOrderChange: (newSortOrder: 'asc' | 'desc') => void;
  handlePageChange: (page: number) => void;
  handleReset: () => void;
  refresh: () => void;
}

interface UseSubmissionsReturn extends UseSubmissionsState, UseSubmissionsActions {
  totalCount: number;
  filters: SubmissionFilters;
  sortBy: SubmissionSortBy;
  sortOrder: 'asc' | 'desc';
}

export default function useSubmissions(): UseSubmissionsReturn {
  const [state, setState] = useState<UseSubmissionsState>({
    submissions: [],
    meta: null,
    isLoading: false,
    error: null,
  });

  const [filters, setFilters] = useState<SubmissionFilters>({});
  const [sortBy, setSortBy] = useState<SubmissionSortBy>(SubmissionSortBy.ID);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [request, setRequest] = useState<GetSubmissionListRequest>({
    page: 1,
    limit: ITEMS_PER_PAGE,
    sortBy,
    sortOrder,
    filters,
  });

  const fetchSubmissions = useCallback(async (requestParams: GetSubmissionListRequest) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const response = await SubmissionsService.getSubmissions(requestParams);
      setState((prev) => ({
        ...prev,
        submissions: response.data.data.data,
        meta: response.data.data.meta,
        isLoading: false,
      }));
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setState((prev) => ({
        ...prev,
        error: 'Failed to load submissions.',
        isLoading: false,
      }));
    }
  }, []);

  useEffect(() => {
    fetchSubmissions(request);
  }, [request, fetchSubmissions]);

  const updateRequest = useCallback((updates: Partial<GetSubmissionListRequest>) => {
    setRequest((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const handleFiltersChange = useCallback(
    (newFilters: SubmissionFilters) => {
      setFilters(newFilters);
      updateRequest({ filters: newFilters, page: 1 });
    },
    [updateRequest]
  );

  const handleSortByChange = useCallback(
    (newSortBy: SubmissionSortBy) => {
      setSortBy(newSortBy);
      updateRequest({ sortBy: newSortBy, page: 1 });
    },
    [updateRequest]
  );

  const handleSortOrderChange = useCallback(
    (newSortOrder: 'asc' | 'desc') => {
      setSortOrder(newSortOrder);
      updateRequest({ sortOrder: newSortOrder, page: 1 });
    },
    [updateRequest]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateRequest({ page });
    },
    [updateRequest]
  );

  const handleReset = useCallback(() => {
    setFilters({});
    setSortBy(SubmissionSortBy.ID);
    setSortOrder('asc');
    updateRequest({
      filters: {},
      sortBy: SubmissionSortBy.ID,
      sortOrder: 'asc',
      page: 1,
    });
  }, [updateRequest]);

  const refresh = useCallback(() => {
    fetchSubmissions(request);
  }, [fetchSubmissions, request]);

  return {
    submissions: state.submissions,
    meta: state.meta,
    totalCount: state.meta?.total || 0,
    isLoading: state.isLoading,
    error: state.error,
    filters,
    sortBy,
    sortOrder,
    handleFiltersChange,
    handleSortByChange,
    handleSortOrderChange,
    handlePageChange,
    handleReset,
    refresh,
  };
}
