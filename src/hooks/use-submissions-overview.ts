import { ContestsService } from '@/services/contests-service';
import { toastService } from '@/services/toasts-service';
import type {
  SortOrder,
  SubmissionNode,
  SubmissionsFilters,
  SubmissionsOverviewRequest,
  SubmissionsOverviewResponse,
} from '@/types/submissions-overview';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface UseSubmissionsOverviewReturn {
  students: SubmissionNode[];
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

  const fetchSubmissionsOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await ContestsService.getContestSubmissionsOverview(request);

      setData(response);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to fetch submissions');
      setError(error);
      toastService.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    const requestString = JSON.stringify(request);
    if (prevRequestRef.current !== requestString) {
      prevRequestRef.current = requestString;
      fetchSubmissionsOverview();
    }
  }, [request, fetchSubmissionsOverview]);

  const updateFilters = useCallback(
    (filters: SubmissionsFilters) => {
      // Update local state
      if (filters.name !== undefined) {
        setName(filters.name);
      }
      if (filters.sortOrder !== undefined) {
        setSortOrder(filters.sortOrder);
      }

      setRequest((prev) => {
        // Merge new filters with existing ones
        const newName = filters.name !== undefined ? filters.name : name;
        const newSortOrder =
          filters.sortOrder !== undefined ? filters.sortOrder : sortOrder;

        return {
          ...prev,
          filters: newName ? { name: newName } : undefined,
          sortOrder: newSortOrder,
          // Reset pagination when filters change
          after: undefined,
          before: undefined,
        };
      });
    },
    [name, sortOrder]
  );

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

  // Extract students from API response
  const students = useMemo(() => {
    if (!data?.edges) return [];
    return data.edges.map((edge) => edge.node);
  }, [data]);

  return {
    students,
    loading,
    error,
    refetch: fetchSubmissionsOverview,
    hasNextPage: data?.pageInfos.hasNextPage ?? false,
    hasPreviousPage: data?.pageInfos.hasPreviousPage ?? false,
    loadNext,
    loadPrevious,
    updateFilters,
    name,
    sortOrder,
  };
}
