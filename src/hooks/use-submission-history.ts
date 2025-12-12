import { ContestsService } from '@/services/contests-service';
import { toastService } from '@/services/toasts-service';
import { useCallback, useEffect, useState } from 'react';

interface UseSubmissionHistoryParams {
  contestParticipationId: number | null;
  problemId: string;
}

interface UseSubmissionHistoryReturn {
  submissionDetails: any[];
  loadingSubmission: boolean;
  selectedSubmissionId: number | null;
  selectedSubmissionDetail: any;
  loadingSubmissionDetail: boolean;
  handleSelectSubmission: (submission: any) => Promise<void>;
  handleBackToList: () => void;
}

export function useSubmissionHistory({
  contestParticipationId,
  problemId,
}: UseSubmissionHistoryParams): UseSubmissionHistoryReturn {
  const [submissionDetails, setSubmissionDetails] = useState<any[]>([]);
  const [loadingSubmission, setLoadingSubmission] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<
    number | null
  >(null);
  const [selectedSubmissionDetail, setSelectedSubmissionDetail] =
    useState<any>(null);
  const [loadingSubmissionDetail, setLoadingSubmissionDetail] = useState(false);

  const fetchSubmissionDetails = useCallback(async () => {
    if (!contestParticipationId || !problemId) {
      setSubmissionDetails([]);
      setSelectedSubmissionId(null);
      setSelectedSubmissionDetail(null);
      return;
    }

    try {
      setLoadingSubmission(true);
      const response = await ContestsService.getSubmissionDetails(
        contestParticipationId,
        Number(problemId),
        { first: 100, sortOrder: 'desc' }
      );

      setSubmissionDetails(response.edges);

      // Don't auto-select, show list view first
      setSelectedSubmissionId(null);
      setSelectedSubmissionDetail(null);
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error('Không thể tải danh sách bài nộp');
      toastService.error(error.message);
      setSubmissionDetails([]);
      setSelectedSubmissionId(null);
      setSelectedSubmissionDetail(null);
    } finally {
      setLoadingSubmission(false);
    }
  }, [contestParticipationId, problemId]);

  const handleSelectSubmission = useCallback(async (submission: any) => {
    setSelectedSubmissionId(submission.id);
    setSelectedSubmissionDetail(null);
    setLoadingSubmissionDetail(true);

    try {
      const response = await ContestsService.getSubmissionById(
        submission.id.toString()
      );
      setSelectedSubmissionDetail(response);
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error('Không thể tải chi tiết bài nộp');
      toastService.error(error.message);
    } finally {
      setLoadingSubmissionDetail(false);
    }
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedSubmissionId(null);
    setSelectedSubmissionDetail(null);
  }, []);

  useEffect(() => {
    fetchSubmissionDetails();
  }, [fetchSubmissionDetails]);

  return {
    submissionDetails,
    loadingSubmission,
    selectedSubmissionId,
    selectedSubmissionDetail,
    loadingSubmissionDetail,
    handleSelectSubmission,
    handleBackToList,
  };
}
