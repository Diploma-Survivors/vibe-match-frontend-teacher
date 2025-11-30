'use client';

import { ProblemTabs } from '@/components/contests/tabs/submissions/shared/problem-tabs';
import { StudentTable } from '@/components/contests/tabs/submissions/student-list/student-table';
import { SubmissionFilter } from '@/components/contests/tabs/submissions/student-list/submission-filter';
import { SubmissionsSkeleton } from '@/components/contests/tabs/submissions/student-list/submissions-skeleton';
import { SubmissionDetailForStudent } from '@/components/contests/tabs/submissions/submission-detail/submission-detail-for-student';
import { SubmissionHistoryList } from '@/components/contests/tabs/submissions/submission-detail/submission-history-list';
import { SubmissionHistoryListSkeleton } from '@/components/contests/tabs/submissions/submission-detail/submission-history-list-skeleton';
import { useContestSubmissions } from '@/hooks/use-contest-submissions';
import { ContestsService } from '@/services/contests-service';
import type { ProblemData } from '@/types/problems';
import type { Problem, StudentSubmissionOverview } from '@/types/submissions';
import { ChevronLeft } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function ContestSubmissionsPage() {
  const params = useParams();
  const contestId = params.id as string;

  // Fetch submissions data from API
  const {
    data,
    loading,
    loadingMore,
    error,
    hasNextPage,
    loadMore,
    updateFilters,
    username,
    sortOrder,
  } = useContestSubmissions(contestId);

  // Fetch contest problems from API
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loadingProblems, setLoadingProblems] = useState(true);

  const fetchContestProblems = useCallback(async () => {
    try {
      setLoadingProblems(true);
      const response = await ContestsService.getContestById(contestId);
      const contestData = response?.data?.data;

      if (contestData?.problems) {
        const formattedProblems = contestData.problems.map(
          (p: ProblemData, index: number) => ({
            id: p.id.toString(),
            title: `${String.fromCharCode(65 + index)}. ${p.title}`,
          })
        );
        setProblems(formattedProblems);
      }
    } catch (error) {
      console.error('Error fetching contest problems:', error);
    } finally {
      setLoadingProblems(false);
    }
  }, [contestId]);

  useEffect(() => {
    fetchContestProblems();
  }, [fetchContestProblems]);

  // Extract nodes from API response
  const students: StudentSubmissionOverview[] = useMemo(() => {
    if (!data?.edges) return [];
    return data.edges.map((edge) => edge.node);
  }, [data]);

  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  const [activeProblemId, setActiveProblemId] = useState<string>('');

  // Fetch submission list for selected student and problem
  const [submissionDetails, setSubmissionDetails] = useState<any[]>([]);
  const [loadingSubmission, setLoadingSubmission] = useState(false);

  // Selected submission and its detail
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<
    number | null
  >(null);
  const [selectedSubmissionDetail, setSelectedSubmissionDetail] =
    useState<any>(null);
  const [loadingSubmissionDetail, setLoadingSubmissionDetail] = useState(false);

  const fetchSubmissionDetails = useCallback(async () => {
    if (!selectedStudentId || !activeProblemId) {
      setSubmissionDetails([]);
      setSelectedSubmissionId(null);
      setSelectedSubmissionDetail(null);
      return;
    }

    try {
      setLoadingSubmission(true);
      const response = await ContestsService.getSubmissionDetails(
        selectedStudentId,
        Number(activeProblemId),
        { first: 100, sortOrder: 'desc' }
      );

      setSubmissionDetails(response.edges);

      // Don't auto-select, show list view first
      setSelectedSubmissionId(null);
      setSelectedSubmissionDetail(null);
    } catch (error) {
      console.error('Error fetching submission details:', error);
      setSubmissionDetails([]);
      setSelectedSubmissionId(null);
      setSelectedSubmissionDetail(null);
    } finally {
      setLoadingSubmission(false);
    }
  }, [selectedStudentId, activeProblemId]);

  const handleSelectSubmission = useCallback(async (submission: any) => {
    setSelectedSubmissionId(submission.id);
    setSelectedSubmissionDetail(null);
    setLoadingSubmissionDetail(true);

    try {
      const response = await ContestsService.getSubmissionById(
        submission.id.toString()
      );
      setSelectedSubmissionDetail(response);
    } catch (error) {
      console.error('Error fetching submission detail:', error);
    } finally {
      setLoadingSubmissionDetail(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissionDetails();
  }, [fetchSubmissionDetails]);

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
    updateFilters({ username: keyword });
  };

  const handleSortChange = (order: 'asc' | 'desc') => {
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
    <div className="h-[calc(100vh-60px)] flex">
      {/* Left: Students list */}
      <div className="w-1/2 border-r border-slate-200">
        <div className="h-full flex flex-col">
          <SubmissionFilter
            onSearch={handleSearch}
            onSortChange={handleSortChange}
            sortOrder={sortOrder}
            searchKeyword={username}
          />
          <div className="flex-1 overflow-hidden">
            <div id="scrollableDiv" className="h-full overflow-auto p-4">
              <div className="border border-slate-200 bg-white overflow-hidden">
                <InfiniteScroll
                  dataLength={students.length}
                  next={loadMore}
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

      {/* Right: Submission detail or list */}
      <div className="w-1/2">
        <div className="h-full p-4 flex flex-col">
          {!selectedStudent ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-slate-500">Chọn sinh viên để xem chi tiết</p>
            </div>
          ) : (
            <>
              {/* Problem Tabs*/}
              <div className="mb-4">
                <ProblemTabs
                  problems={problems}
                  activeProblemId={activeProblemId}
                  onSelectProblem={setActiveProblemId}
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
                                  setSelectedSubmissionId(null);
                                  setSelectedSubmissionDetail(null);
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
