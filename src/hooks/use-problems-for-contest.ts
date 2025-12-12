import { ContestsService } from '@/services/contests-service';
import { toastService } from '@/services/toasts-service';
import type { ProblemData } from '@/types/problems';
import { useCallback, useEffect, useState } from 'react';

export interface Problem {
  id: string;
  title: string;
}

interface UseProblemsForContestReturn {
  problems: Problem[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useProblemsForContest(
  contestId: string
): UseProblemsForContestReturn {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContestProblems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ContestsService.getContestById(contestId);
      const contestData = response?.data?.data;

      if (contestData?.problems) {
        // Format problems with A. Title, B. Title, ...
        const formattedProblems = contestData.problems.map(
          (p: ProblemData, index: number) => ({
            id: p.id.toString(),
            title: `${String.fromCharCode(65 + index)}. ${p.title}`,
          })
        );
        setProblems(formattedProblems);
      }
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error('Không thể tải danh sách bài tập');
      setError(error);
      toastService.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [contestId]);

  useEffect(() => {
    fetchContestProblems();
  }, [fetchContestProblems]);

  return {
    problems,
    loading,
    error,
    refetch: fetchContestProblems,
  };
}
