import { ContestsService } from '@/services/contests-service';
import type { LeaderboardRequest, LeaderboardResponse } from '@/types/contest';
import { useCallback, useEffect, useState } from 'react';

interface UseLeaderboardReturn {
  data: LeaderboardResponse | null;
  loading: boolean;
  error: Error | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  loadNext: () => Promise<void>;
  loadPrevious: () => Promise<void>;
  updateFilters: (filters: {
    username?: string;
    sortOrder?: 'asc' | 'desc';
  }) => void;
  refetch: () => Promise<void>;
  username: string;
  sortOrder: 'asc' | 'desc';
}

export function useLeaderboard(contestId: string) {
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [username, setUsername] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [request, setRequest] = useState<LeaderboardRequest>({
    contestId,
    first: 100,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ContestsService.getContestLeaderboard(request);
      console.log(request);
      console.log(response);

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

  const loadNext = useCallback(async () => {
    if (data?.rankings.pageInfos.hasNextPage) {
      setRequest((prev) => ({
        ...prev,
        after: data.rankings.pageInfos.endCursor,
        before: undefined,
      }));
    }
  }, [data]);

  const loadPrevious = useCallback(async () => {
    if (data?.rankings.pageInfos.hasPreviousPage) {
      setRequest((prev) => ({
        ...prev,
        before: data.rankings.pageInfos.startCursor,
        after: undefined,
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
    username,
    sortOrder,
  };
}
