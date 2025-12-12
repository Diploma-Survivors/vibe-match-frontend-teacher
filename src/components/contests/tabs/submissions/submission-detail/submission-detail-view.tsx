import { toggleVisibility } from '@/store/slides/ai-review-slice';
import { ChevronLeft } from 'lucide-react';
import { EmptyState } from '../shared/empty-state';
import { SubmissionDetailForStudent } from './submission-detail';

interface SubmissionDetailViewProps {
  loadingSubmissionDetail: boolean;
  selectedSubmissionDetail: any;
  handleBackToList: () => void;
  isAIReviewVisible: boolean;
  dispatch: any;
}

export const SubmissionDetailView = ({
  loadingSubmissionDetail,
  selectedSubmissionDetail,
  handleBackToList,
  isAIReviewVisible,
  dispatch,
}: SubmissionDetailViewProps) => {
  if (loadingSubmissionDetail) {
    return <EmptyState message="Đang tải..." />;
  }

  if (!selectedSubmissionDetail) {
    return (
      <EmptyState message="Không thể tải chi tiết submission, vui lòng thử lại sau" />
    );
  }

  return (
    <>
      {/* Back button */}
      <div className="mb-2">
        <button
          type="button"
          onClick={() => {
            handleBackToList();
            if (isAIReviewVisible) {
              dispatch(toggleVisibility());
            }
          }}
          className="flex items-center gap-1.5 px-2 py-1.5 text-base font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-all duration-200 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </button>
      </div>

      {/* Submission Detail Content */}
      <div className="flex-1 overflow-hidden">
        <SubmissionDetailForStudent
          submission={{
            id: selectedSubmissionDetail.id,
            status: selectedSubmissionDetail.status,
            score: selectedSubmissionDetail.score,
            maxScore: selectedSubmissionDetail.maxScore,
            runtime: selectedSubmissionDetail.runtime,
            memory: selectedSubmissionDetail.memory,
            language: selectedSubmissionDetail.language,
            sourceCode: selectedSubmissionDetail.sourceCode,
            passedTests: selectedSubmissionDetail.passedTests,
            totalTests: selectedSubmissionDetail.totalTests,
          }}
        />
      </div>
    </>
  );
};
