import { ContestsService } from '@/services/contests-service';
import type {
  LeaderboardFilters,
  LeaderboardRequest,
  LeaderboardResponse,
  SortOrder,
} from '@/types/contest';
import { useCallback, useEffect, useState } from 'react';

const PAGE_SIZE = 20;

interface UseLeaderboardReturn {
  data: LeaderboardResponse | null;
  loading: boolean;
  error: Error | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  loadNext: () => Promise<void>;
  loadPrevious: () => Promise<void>;
  updateFilters: (filters: LeaderboardFilters) => void;
  refetch: () => Promise<void>;
  name: string;
  sortOrder: SortOrder;
}

export function useLeaderboard(contestId: string): UseLeaderboardReturn {
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [name, setName] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [request, setRequest] = useState<LeaderboardRequest>({
    contestId,
    first: PAGE_SIZE,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ContestsService.getContestLeaderboard(request);
      setData(response);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch leaderboard')
      );
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const updateFilters = useCallback((filters: LeaderboardFilters) => {
    // Update local state
    if (filters.name !== undefined) {
      setName(filters.name);
    }
    if (filters.sortOrder !== undefined) {
      setSortOrder(filters.sortOrder);
    }

    // Build filters object with both name and sortOrder
    const hasFilters = filters.name || filters.sortOrder;
    const newFilters: LeaderboardFilters | undefined = hasFilters
      ? {
          ...(filters.name && { name: filters.name }),
          ...(filters.sortOrder && { sortOrder: filters.sortOrder }),
        }
      : undefined;

    setRequest((prev) => ({
      ...prev,
      filters: newFilters,
      // Reset pagination when filters change
      after: undefined,
      before: undefined,
    }));
  }, []);

  const loadNext = useCallback(async () => {
    if (data?.rankings.pageInfos.hasNextPage) {
      setRequest((prev) => ({
        ...prev,
        after: data.rankings.pageInfos.endCursor,
        before: undefined,
        first: PAGE_SIZE,
        last: undefined,
      }));
    }
  }, [data]);

  const loadPrevious = useCallback(async () => {
    if (data?.rankings.pageInfos.hasPreviousPage) {
      setRequest((prev) => ({
        ...prev,
        before: data.rankings.pageInfos.startCursor,
        after: undefined,
        first: undefined,
        last: PAGE_SIZE,
      }));
    }
  }, [data]);

  return {
    data,
    loading,
    error,
    refetch: fetchLeaderboard,
    hasNextPage: data?.rankings.pageInfos.hasNextPage ?? false,
    hasPreviousPage: data?.rankings.pageInfos.hasPreviousPage ?? false,
    loadNext,
    loadPrevious,
    updateFilters,
    name,
    sortOrder,
  };
}
