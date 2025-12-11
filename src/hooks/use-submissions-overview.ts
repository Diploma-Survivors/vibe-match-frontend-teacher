import { ContestsService } from '@/services/contests-service';
import type {
  SortOrder,
  SubmissionsFilters,
  SubmissionsOverviewRequest,
  SubmissionsOverviewResponse,
} from '@/types/contest';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseSubmissionsOverviewReturn {
  data: SubmissionsOverviewResponse | null;
  loading: boolean;
  error: Error | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  loadNext: () => Promise<void>;
  loadPrevious: () => Promise<void>;
  updateFilters: (filters: SubmissionsFilters) => void;
  refetch: () => Promise<void>;
  name: string;
  sortOrder: SortOrder;
}

export function useSubmissionsOverview(
  contestId: string
): UseSubmissionsOverviewReturn {
  const [data, setData] = useState<SubmissionsOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [name, setName] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const [request, setRequest] = useState<SubmissionsOverviewRequest>({
    contestId,
    first: 10,
    sortOrder: 'desc',
  });

  // Use ref to track previous request to avoid infinite loop
  const prevRequestRef = useRef<string>('');

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await ContestsService.getContestSubmissionsOverview(request);

      setData(response);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch submissions')
      );
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    const requestString = JSON.stringify(request);
    if (prevRequestRef.current !== requestString) {
      prevRequestRef.current = requestString;
      fetchSubmissions();
    }
  }, [request, fetchSubmissions]);

  const updateFilters = useCallback((filters: SubmissionsFilters) => {
    // Update local state
    if (filters.name !== undefined) {
      setName(filters.name);
    }
    if (filters.sortOrder !== undefined) {
      setSortOrder(filters.sortOrder);
    }

    setRequest((prev) => ({
      ...prev,
      filters: filters.name ? { name: filters.name } : undefined,
      sortOrder: filters.sortOrder || prev.sortOrder,
      // Reset pagination when filters change
      after: undefined,
      before: undefined,
    }));
  }, []);

  const loadNext = useCallback(async () => {
    if (data?.pageInfos.hasNextPage) {
      setRequest((prev) => ({
        ...prev,
        after: data.pageInfos.endCursor,
        before: undefined,
        first: 20,
        last: undefined,
      }));
    }
  }, [data]);

  const loadPrevious = useCallback(async () => {
    if (data?.pageInfos.hasPreviousPage) {
      setRequest((prev) => ({
        ...prev,
        before: data.pageInfos.startCursor,
        after: undefined,
        first: undefined,
        last: 20,
      }));
    }
  }, [data]);

  return {
    data,
    loading,
    error,
    refetch: fetchSubmissions,
    hasNextPage: data?.pageInfos.hasNextPage ?? false,
    hasPreviousPage: data?.pageInfos.hasPreviousPage ?? false,
    loadNext,
    loadPrevious,
    updateFilters,
    name,
    sortOrder,
  };
}
