'use client';

import AIReviewPanel from '@/components/ai-review-panel';
import { EmptyState } from '@/components/contests/tabs/submissions/shared/empty-state';
import { ProblemTabs } from '@/components/contests/tabs/submissions/shared/problem-tabs';
import { StudentTable } from '@/components/contests/tabs/submissions/student-list/student-table';
import { SubmissionFilter } from '@/components/contests/tabs/submissions/student-list/submission-filter';
import { SubmissionsSkeleton } from '@/components/contests/tabs/submissions/student-list/submissions-skeleton';
import { SubmissionContentArea } from '@/components/contests/tabs/submissions/submission-detail/submission-content-area';
import { useProblemsForContest } from '@/hooks/use-problems-for-contest';
import { useSubmissionHistory } from '@/hooks/use-submission-history';
import { useSubmissionsOverview } from '@/hooks/use-submissions-overview';
import type { RootState } from '@/store';
import { toggleVisibility } from '@/store/slides/ai-review-slice';
import type { SortOrder } from '@/types/submissions-overview';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function ContestSubmissionsPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const contestId = params.id as string;

  // state for selected student and problem
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  const [activeProblemId, setActiveProblemId] = useState<string>('');

  // Fetch submission overview
  const {
    students,
    loading,
    error,
    hasNextPage,
    loadNext,
    updateFilters,
    name,
    sortOrder,
  } = useSubmissionsOverview(contestId);

  // Fetch contest problems for navigating among submission list
  const { problems, loading: loadingProblems } =
    useProblemsForContest(contestId);

  // Fetch submission list for selected student and problem
  const {
    submissionDetails,
    loadingSubmission,
    selectedSubmissionId,
    selectedSubmissionDetail,
    loadingSubmissionDetail,
    handleSelectSubmission,
    handleBackToList,
  } = useSubmissionHistory({
    contestParticipationId: selectedStudentId,
    problemId: activeProblemId,
  });

  // Update active problem when problems load
  useEffect(() => {
    if (problems.length > 0 && !activeProblemId) {
      setActiveProblemId(problems[0].id);
    }
  }, [problems, activeProblemId]);

  // Auto-select first student when students list loads
  useEffect(() => {
    if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }
  }, [students, selectedStudentId]);

  const selectedStudent = useMemo(
    () => students.find((s) => s.id === selectedStudentId) ?? null,
    [students, selectedStudentId]
  );

  const handleSearch = (keyword: string) => {
    updateFilters({ name: keyword });
  };

  const handleSortChange = (order: SortOrder) => {
    updateFilters({ sortOrder: order });
  };

  const isAIReviewVisible = useSelector(
    (state: RootState) => state.aiReview.isVisible
  );

  if (loading || loadingProblems) {
    return <SubmissionsSkeleton />;
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-60px)] flex items-center justify-center">
        <p className="text-red-500">Lỗi: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-60px)] flex gap-1">
      {/* Left: Students list */}
      {!isAIReviewVisible ? (
        <div className="w-1/2 border border-slate-200 rounded-xl">
          <div className="h-full flex flex-col">
            <SubmissionFilter
              onSearch={handleSearch}
              onSortChange={handleSortChange}
              sortOrder={sortOrder}
              searchKeyword={name}
            />
            <StudentTable
              students={students}
              selectedStudentId={selectedStudentId}
              onSelectStudent={setSelectedStudentId}
              hasNextPage={hasNextPage}
              loadNext={loadNext}
            />
          </div>
        </div>
      ) : (
        <div
          // style={{ width: `calc(${100 - detailWidth}% - 6px)` }}
          className="h-full w-1/2 animate-in slide-in-from-right-10 border border-slate-200 rounded-xl fade-in duration-300"
        >
          {selectedSubmissionDetail && (
            <AIReviewPanel
              submissionId={selectedSubmissionDetail.id.toString()}
              sourceCode={selectedSubmissionDetail.sourceCode}
            />
          )}
        </div>
      )}

      {/* Right: Submission detail or list */}
      <div className="w-1/2 border border-slate-200 rounded-xl">
        <div className="h-full p-4 pt-3 flex flex-col">
          {!selectedStudent ? (
            <EmptyState message="Chọn sinh viên để xem chi tiết" />
          ) : (
            <>
              {/* Problem Tabs */}
              <div className="mb-2">
                <ProblemTabs
                  problems={problems}
                  activeProblemId={activeProblemId}
                  onSelectProblem={(problemId: string) => {
                    if (isAIReviewVisible) {
                      dispatch(toggleVisibility());
                    }
                    setActiveProblemId(problemId);
                  }}
                />
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-hidden">
                <SubmissionContentArea
                  loadingSubmission={loadingSubmission}
                  submissionDetails={submissionDetails}
                  selectedSubmissionId={selectedSubmissionId}
                  loadingSubmissionDetail={loadingSubmissionDetail}
                  selectedSubmissionDetail={selectedSubmissionDetail}
                  handleSelectSubmission={handleSelectSubmission}
                  handleBackToList={handleBackToList}
                  isAIReviewVisible={isAIReviewVisible}
                  dispatch={dispatch}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
