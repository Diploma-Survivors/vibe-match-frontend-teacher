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
import { useSearchParams } from 'next/navigation';
import { SortOrder } from '@/types/problems';

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
  handleSortOrderChange: (newSortOrder: SortOrder) => void;
  handlePageChange: (page: number) => void;
  handleReset: () => void;
  refresh: () => void;
}

interface UseSubmissionsReturn extends UseSubmissionsState, UseSubmissionsActions {
  totalCount: number;
  filters: SubmissionFilters;
  sortBy: SubmissionSortBy;
  sortOrder: SortOrder;
}

export default function useSubmissions(): UseSubmissionsReturn {
  const [state, setState] = useState<UseSubmissionsState>({
    submissions: [],
    meta: null,
    isLoading: false,
    error: null,
  });

  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<SubmissionFilters>(() => {
    const initialFilters: SubmissionFilters = {};
    
    // Parse problemId
    const problemId = searchParams.get('problemId');
    if (problemId && !isNaN(Number(problemId))) initialFilters.problemId = Number(problemId);

    // Parse contestId
    const contestId = searchParams.get('contestId');
    if (contestId && !isNaN(Number(contestId))) initialFilters.contestId = Number(contestId);

    // Parse languageId
    const languageId = searchParams.get('languageId');
    if (languageId && !isNaN(Number(languageId))) initialFilters.languageId = Number(languageId);

    // Parse userId
    const userId = searchParams.get('userId');
    if (userId && !isNaN(Number(userId))) initialFilters.userId = Number(userId);

    // Parse fromDate
    const fromDate = searchParams.get('fromDate');
    if (fromDate) initialFilters.fromDate = fromDate;

    // Parse toDate
    const toDate = searchParams.get('toDate');
    if (toDate) initialFilters.toDate = toDate;

    // Parse status
    const status = searchParams.get('status');
    if (status && Object.values(SubmissionStatus).includes(status as SubmissionStatus)) {
      initialFilters.status = status as SubmissionStatus;
    }

    return initialFilters;
  });

  const [sortBy, setSortBy] = useState<SubmissionSortBy>(SubmissionSortBy.ID);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.ASC);

  const [request, setRequest] = useState<GetSubmissionListRequest>({
    page: 1,
    limit: ITEMS_PER_PAGE,
    sortBy,
    sortOrder,
    ...filters,
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
      setRequest((prev) => ({
        page: 1,
        limit: prev.limit,
        sortBy: prev.sortBy,
        sortOrder: prev.sortOrder,
        ...newFilters,
      }));
    },
    []
  );

  const handleSortByChange = useCallback(
    (newSortBy: SubmissionSortBy) => {
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

  const handlePageChange = useCallback(
    (page: number) => {
      updateRequest({ page });
    },
    [updateRequest]
  );

  const handleReset = useCallback(() => {
    setFilters({});
    setSortBy(SubmissionSortBy.ID);
    setSortOrder(SortOrder.ASC);
    setRequest({
      page: 1,
      limit: ITEMS_PER_PAGE,
      sortBy: SubmissionSortBy.ID,
      sortOrder: SortOrder.ASC,
    });
  }, []);

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
