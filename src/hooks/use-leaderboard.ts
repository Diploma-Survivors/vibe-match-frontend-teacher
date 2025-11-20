import { ContestsService } from '@/services/contests-service';
import type { LeaderboardResponse } from '@/types/contest';
import { useCallback, useEffect, useState } from 'react';

interface UseLeaderboardParams {
  contestId: string;
  keyword?: string;
  after?: string;
  before?: string;
  first?: number;
  last?: number;
  sortOrder?: 'asc' | 'desc';
  matchMode?: 'all' | 'any';
}

interface UseLeaderboardReturn {
  data: LeaderboardResponse | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  loadNext: () => Promise<void>;
  loadPrevious: () => Promise<void>;
}

export function useLeaderboard({
  contestId,
  keyword,
  after,
  before,
  first = 10,
  last,
  sortOrder = 'asc',
  matchMode = 'all',
}: UseLeaderboardParams): UseLeaderboardReturn {
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentAfter, setCurrentAfter] = useState<string | undefined>(after);
  const [currentBefore, setCurrentBefore] = useState<string | undefined>(
    before
  );

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ContestsService.getContestLeaderboard(contestId, {
        keyword,
        after: currentAfter,
        before: currentBefore,
        first,
        last,
        sortOrder,
        matchMode,
      });

      setData(response);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch leaderboard')
      );
    } finally {
      setLoading(false);
    }
  }, [
    contestId,
    keyword,
    currentAfter,
    currentBefore,
    first,
    last,
    sortOrder,
    matchMode,
  ]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const loadNext = useCallback(async () => {
    if (data?.rankings.pageInfos.hasNextPage) {
      setCurrentAfter(data.rankings.pageInfos.endCursor);
      setCurrentBefore(undefined);
    }
  }, [data]);

  const loadPrevious = useCallback(async () => {
    if (data?.rankings.pageInfos.hasPreviousPage) {
      setCurrentBefore(data.rankings.pageInfos.startCursor);
      setCurrentAfter(undefined);
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
  };
}
