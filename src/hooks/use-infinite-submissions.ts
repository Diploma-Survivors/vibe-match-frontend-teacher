import { SubmissionsService } from '@/services/submissions-service';
import {
    GetSubmissionListRequest,
    Submission,
    SubmissionFilters,
    SubmissionSortBy,
} from '@/types/submissions';
import { SortOrder } from '@/types/problems';
import { useCallback, useEffect, useState } from 'react';

const ITEMS_PER_PAGE = 20;

interface UseInfiniteSubmissionsProps {
    initialFilters?: SubmissionFilters;
    initialSortBy?: SubmissionSortBy;
    initialSortOrder?: SortOrder;
    enabled?: boolean;
}

interface UseInfiniteSubmissionsReturn {
    submissions: Submission[];
    isLoading: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => void;
    refresh: () => void;
}

export function useInfiniteSubmissions({
    initialFilters = {},
    initialSortBy = SubmissionSortBy.SUBMITTED_AT,
    initialSortOrder = SortOrder.DESC,
    enabled = true,
}: UseInfiniteSubmissionsProps = {}): UseInfiniteSubmissionsReturn {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [totalCount, setTotalCount] = useState(0);

    const fetchSubmissions = useCallback(
        async (currentPage: number, isRefresh = false) => {
            try {
                setIsLoading(true);
                setError(null);

                const requestParams: GetSubmissionListRequest = {
                    page: currentPage,
                    limit: ITEMS_PER_PAGE,
                    sortBy: initialSortBy,
                    sortOrder: initialSortOrder,
                    ...initialFilters,
                };

                const response = await SubmissionsService.getSubmissions(requestParams);
                const { data, meta } = response.data.data;

                if (isRefresh) {
                    setSubmissions(data);
                } else {
                    setSubmissions((prev) => [...prev, ...data]);
                }

                setTotalCount(meta.total);
                setHasMore(data.length === ITEMS_PER_PAGE);
            } catch (err) {
                console.error('Error fetching submissions:', err);
                setError('Failed to load submissions');
            } finally {
                setIsLoading(false);
            }
        },
        [initialFilters]
    );

    // Initial load
    useEffect(() => {
        if (enabled) {
            setPage(1);
            setHasMore(true);
            fetchSubmissions(1, true);
        }
    }, [fetchSubmissions, enabled]);

    const loadMore = useCallback(() => {
        if (!isLoading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchSubmissions(nextPage);
        }
    }, [isLoading, hasMore, page, fetchSubmissions]);

    const refresh = useCallback(() => {
        setPage(1);
        setHasMore(true);
        fetchSubmissions(1, true);
    }, [fetchSubmissions]);

    return {
        submissions,
        isLoading,
        error,
        hasMore,
        loadMore,
        refresh,
    };
}
