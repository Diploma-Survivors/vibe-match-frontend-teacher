import { ContestsService } from '@/services/contests-service';
import type {
  SubmissionsOverviewRequest,
  SubmissionsOverviewResponse,
} from '@/types/contest';
import { useCallback, useEffect, useState } from 'react';

interface UseContestSubmissionsReturn {
  data: SubmissionsOverviewResponse | null;
  loading: boolean;
  loadingMore: boolean;
  error: Error | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  loadMore: () => Promise<void>;
  updateFilters: (filters: {
    username?: string;
    sortOrder?: 'asc' | 'desc';
  }) => void;
  refetch: () => Promise<void>;
  username: string;
  sortOrder: 'asc' | 'desc';
}

export function useContestSubmissions(
  contestId: string
): UseContestSubmissionsReturn {
  const [data, setData] = useState<SubmissionsOverviewResponse | null>(null);
  const [username, setUsername] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [request, setRequest] = useState<SubmissionsOverviewRequest>({
    contestId,
    first: 20,
    sortOrder: 'desc',
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubmissions = useCallback(
    async (isLoadingMore = false) => {
      try {
        if (isLoadingMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const response =
          await ContestsService.getContestSubmissionsOverview(request);

        if (isLoadingMore && data) {
          // Append new data for infinite scroll
          setData({
            ...response,
            edges: [...data.edges, ...response.edges],
          });
        } else {
          setData(response);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch submissions')
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [request, data]
  );

  useEffect(() => {
    fetchSubmissions(false);
  }, [fetchSubmissions]);

  const updateFilters = useCallback(
    (filters: { username?: string; sortOrder?: 'asc' | 'desc' }) => {
      // Update local state
      if (filters.username !== undefined) {
        setUsername(filters.username);
      }
      if (filters.sortOrder !== undefined) {
        setSortOrder(filters.sortOrder);
      }

      setRequest((prev) => ({
        ...prev,
        filters: filters.username ? { username: filters.username } : undefined,
        sortOrder: filters.sortOrder || prev.sortOrder,
        // Reset pagination when filters change
        after: undefined,
        before: undefined,
      }));
    },
    []
  );

  const loadMore = useCallback(async () => {
    if (data?.pageInfos.hasNextPage && !loadingMore) {
      setRequest((prev) => ({
        ...prev,
        after: data.pageInfos.endCursor,
        before: undefined,
      }));
    }
  }, [data, loadingMore]);

  return {
    data,
    loading,
    loadingMore,
    error,
    refetch: () => fetchSubmissions(false),
    hasNextPage: data?.pageInfos.hasNextPage ?? false,
    hasPreviousPage: data?.pageInfos.hasPreviousPage ?? false,
    loadMore,
    updateFilters,
    username,
    sortOrder,
  };
}
