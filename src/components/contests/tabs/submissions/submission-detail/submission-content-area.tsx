import { EmptyState } from '../shared/empty-state';
import { SubmissionDetailView } from './submission-detail-view';
import { SubmissionHistoryListSkeleton } from './submission-history-list-skeleton';
import { SubmissionListView } from './submission-list-view';

interface SubmissionContentAreaProps {
  loadingSubmission: boolean;
  submissionDetails: any[];
  selectedSubmissionId: number | null;
  loadingSubmissionDetail: boolean;
  selectedSubmissionDetail: any;
  handleSelectSubmission: (submission: any) => Promise<void>;
  handleBackToList: () => void;
  isAIReviewVisible: boolean;
  dispatch: any;
}

export const SubmissionContentArea = ({
  loadingSubmission,
  submissionDetails,
  selectedSubmissionId,
  loadingSubmissionDetail,
  selectedSubmissionDetail,
  handleSelectSubmission,
  handleBackToList,
  isAIReviewVisible,
  dispatch,
}: SubmissionContentAreaProps) => {
  // Loading state
  if (loadingSubmission) {
    return <SubmissionHistoryListSkeleton />;
  }

  // Empty state
  if (!submissionDetails || submissionDetails.length === 0) {
    return <EmptyState message="Chưa có bài nộp." />;
  }

  // List view vs Detail view
  if (!selectedSubmissionId) {
    return (
      <SubmissionListView
        submissionDetails={submissionDetails}
        loadingSubmission={loadingSubmission}
        handleSelectSubmission={handleSelectSubmission}
      />
    );
  }

  // Detail view
  return (
    <div className="h-full flex flex-col">
      <SubmissionDetailView
        loadingSubmissionDetail={loadingSubmissionDetail}
        selectedSubmissionDetail={selectedSubmissionDetail}
        handleBackToList={handleBackToList}
        isAIReviewVisible={isAIReviewVisible}
        dispatch={dispatch}
      />
    </div>
  );
};
