import { SubmissionHistoryList } from '../submission-detail/submission-history-list';

interface SubmissionListViewProps {
  submissionDetails: any[];
  loadingSubmission: boolean;
  handleSelectSubmission: (submission: any) => Promise<void>;
}

export const SubmissionListView = ({
  submissionDetails,
  loadingSubmission,
  handleSelectSubmission,
}: SubmissionListViewProps) => (
  <SubmissionHistoryList
    submissions={submissionDetails}
    selectedSubmissionId={null}
    onSelectSubmission={handleSelectSubmission}
    hasMore={false}
    isLoading={loadingSubmission}
  />
);
