'use client';

import { ProblemTabs } from '@/components/contests/tabs/submissions/problem-tabs';
import { StudentTable } from '@/components/contests/tabs/submissions/student-table';
import { SubmissionDetailForStudent } from '@/components/contests/tabs/submissions/submission-detail-for-student';
import { SubmissionFilter } from '@/components/contests/tabs/submissions/submission-filter';
import { SubmissionHistoryList } from '@/components/contests/tabs/submissions/submission-history-list';
import { useContestSubmissions } from '@/hooks/use-contest-submissions';
import { ContestsService } from '@/services/contests-service';
import type { ProblemData } from '@/types/problems';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

type Problem = {
  id: string;
  title: string;
};

type Submission = {
  problemId: string;
  status: 'AC' | 'WA' | 'TLE' | 'CE' | 'RE' | 'Pending';
  score: number;
  language: string;
  timeMs: number;
  memoryKb: number;
  submittedAt: string;
  code: string;
};

type Student = {
  id: string;
  name: string;
  totalScore: number;
  submissions: Submission[];
};

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

  // Transform API data to Student format
  const students: Student[] = useMemo(() => {
    if (!data?.edges) return [];

    return data.edges.map((edge) => ({
      id: edge.node.id.toString(),
      name: `${edge.node.user.lastName} ${edge.node.user.firstName}`,
      totalScore: edge.node.finalScore,
      submissions: [], // TODO: Fetch individual submissions when needed
    }));
  }, [data]);

  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
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
        Number(selectedStudentId),
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

  const handleSelectSubmission = async (submission: any) => {
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
  };

  useEffect(() => {
    fetchSubmissionDetails();
  }, [fetchSubmissionDetails]);

  // Update active problem when problems load
  useEffect(() => {
    if (problems.length > 0 && !activeProblemId) {
      setActiveProblemId(problems[0].id);
    }
  }, [problems, activeProblemId]);

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
    return (
      <div className="h-[calc(100vh-60px)] flex items-center justify-center">
        <p className="text-slate-500">Đang tải dữ liệu...</p>
      </div>
    );
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
              {/* Problem Tabs - Always visible */}
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
                  <div className="h-full flex items-center justify-center">
                    <p className="text-slate-500">Đang tải bài nộp...</p>
                  </div>
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
                            <div className="mb-4">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedSubmissionId(null);
                                  setSelectedSubmissionDetail(null);
                                }}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                >
                                  <title>Back arrow</title>
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                  />
                                </svg>
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
                                    selectedSubmissionDetail.status ===
                                    'ACCEPTED'
                                      ? 20
                                      : 10,
                                  totalTests: 20,
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
