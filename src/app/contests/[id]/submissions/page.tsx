'use client';

import AIReviewPanel from '@/components/ai-review-panel';
import { ProblemTabs } from '@/components/contests/tabs/submissions/shared/problem-tabs';
import { StudentTable } from '@/components/contests/tabs/submissions/student-list/student-table';
import { SubmissionFilter } from '@/components/contests/tabs/submissions/student-list/submission-filter';
import { SubmissionsSkeleton } from '@/components/contests/tabs/submissions/student-list/submissions-skeleton';
import { SubmissionDetailForStudent } from '@/components/contests/tabs/submissions/submission-detail/submission-detail';
import { SubmissionHistoryList } from '@/components/contests/tabs/submissions/submission-detail/submission-history-list';
import { SubmissionHistoryListSkeleton } from '@/components/contests/tabs/submissions/submission-detail/submission-history-list-skeleton';
import { useProblemsForContest } from '@/hooks/use-problems-for-contest';
import { useSubmissionHistory } from '@/hooks/use-submission-history';
import { useSubmissionsOverview } from '@/hooks/use-submissions-overview';
import { ContestsService } from '@/services/contests-service';
import type { RootState } from '@/store';
import { toggleVisibility } from '@/store/slides/ai-review-slice';
import type { ProblemData } from '@/types/problems';
import type { Problem, StudentSubmissionOverview } from '@/types/submissions';
import type { SortOrder } from '@/types/submissions-overview';
import { ChevronLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
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
  const {
    problems,
    loading: loadingProblems,
    error: problemsError,
  } = useProblemsForContest(contestId);

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

  const { isVisible: isAIReviewVisible } = useSelector(
    (state: RootState) => state.aiReview
  );

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
            <div className="flex-1 overflow-hidden">
              <div id="scrollableDiv" className="h-full overflow-auto p-4">
                <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
                  <InfiniteScroll
                    dataLength={students.length}
                    next={loadNext}
                    hasMore={hasNextPage}
                    loader={
                      <div className="p-4 text-center text-slate-500">
                        Đang tải thêm...
                      </div>
                    }
                    endMessage={
                      students.length > 0 ? (
                        <div className="p-4 text-center text-slate-400 border-t border-gray-300">
                          Đã hiển thị tất cả sinh viên
                        </div>
                      ) : (
                        <div className="p-4 text-center text-slate-400 border-t border-gray-300">
                          Không có sinh viên nào
                        </div>
                      )
                    }
                    scrollableTarget="scrollableDiv"
                  >
                    <StudentTable
                      students={students}
                      selectedStudentId={selectedStudentId}
                      onSelectStudent={setSelectedStudentId}
                    />
                  </InfiniteScroll>
                </div>
              </div>
            </div>
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
            <div className="h-full flex items-center justify-center">
              <p className="text-slate-500">Chọn sinh viên để xem chi tiết</p>
            </div>
          ) : (
            <>
              {/* Problem Tabs*/}
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
                {loadingSubmission ? (
                  <SubmissionHistoryListSkeleton />
                ) : !submissionDetails || submissionDetails.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-slate-500">Chưa có bài nộp.</p>
                  </div>
                ) : (
                  <>
                    {/* Show submission list or detail based on view state */}
                    {!selectedSubmissionId ? (
                      // Submission List View
                      <SubmissionHistoryList
                        submissions={submissionDetails}
                        selectedSubmissionId={null}
                        onSelectSubmission={handleSelectSubmission}
                        hasMore={false}
                        isLoading={loadingSubmission}
                      />
                    ) : (
                      // Submission Detail View
                      <div className="h-full flex flex-col">
                        {loadingSubmissionDetail ? (
                          <div className="h-full flex items-center justify-center">
                            <p className="text-slate-500">
                              Đang tải chi tiết...
                            </p>
                          </div>
                        ) : selectedSubmissionDetail ? (
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
                                  sourceCode:
                                    selectedSubmissionDetail.sourceCode,
                                  passedTests:
                                    selectedSubmissionDetail.passedTests,
                                  totalTests:
                                    selectedSubmissionDetail.totalTests,
                                }}
                              />
                            </div>
                          </>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <p className="text-slate-500">
                              Không thể tải chi tiết submission
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
