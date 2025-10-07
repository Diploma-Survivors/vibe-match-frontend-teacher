'use client';

import { LtiService } from '@/services/lti-service';
import { ProblemsService } from '@/services/problems-service';
import {
  type GetProblemListRequest,
  type PageInfo,
  type ProblemData,
  type ProblemEndpointType,
  ProblemFilters,
  type ProblemListResponse,
  SortBy,
  SortOrder,
} from '@/types/problems';
import { useEffect, useMemo, useState } from 'react';
import ProblemFilter from './problem-filter';
import ProblemTable from './problem-table';
import SortControls, { type SortField } from './sort-controls';

interface ProblemTableProps {
  mode: 'view' | 'select';
  endpointType: ProblemEndpointType;
  onProblemView?: (problem: ProblemData) => void;
  onProblemSelect?: (problem: ProblemData) => void;
}

export default function ProblemList({
  mode,
  endpointType,
  onProblemView,
  onProblemSelect,
}: ProblemTableProps) {
  const [error, setError] = useState<string | null>(null);
  const [problems, setProblems] = useState<ProblemData[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [getProblemsRequest, setGetProblemsRequest] =
    useState<GetProblemListRequest>({
      keyword: '',
      first: 3,
      sortBy: SortBy.CREATED_AT,
      sortOrder: SortOrder.DESC,
    });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setIsLoading(true);

        const axiosResponse = await ProblemsService.getProblemList(
          getProblemsRequest,
          endpointType
        );
        const response: ProblemListResponse = axiosResponse?.data?.data;

        // Extract problems from edges
        const problemsData = response?.edges.map((edge) => ({
          ...edge.node,
        }));

        setProblems(problemsData);
        setPageInfo(response.pageInfos);
        setTotalCount(response.totalCount);
      } catch (err) {
        console.error('Error fetching problems:', err);
        setError("Can't load the problems.");
        setProblems([]);
        setPageInfo(null);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, [getProblemsRequest, endpointType]);

  const handleProblemSelection = (problem: ProblemData) => {
    if (onProblemSelect) {
      onProblemSelect(problem);
    }
  };

  const handleLoadMore = () => {
    if (pageInfo?.hasNextPage && !isLoading) {
      setGetProblemsRequest((prev) => ({
        ...prev,
        after: pageInfo.endCursor,
        before: undefined,
        first: prev.first || 10,
        last: undefined,
      }));
    }
  };

  const handleLoadPrevious = () => {
    if (pageInfo?.hasPreviousPage && !isLoading) {
      setGetProblemsRequest((prev) => ({
        ...prev,
        before: pageInfo.startCursor,
        after: undefined,
        first: undefined,
        last: prev.first || 10,
      }));
    }
  };

  const handleResetPagination = () => {
    setGetProblemsRequest((prev) => ({
      ...prev,
      after: undefined,
      before: undefined,
      first: prev.first || 10,
      last: undefined,
    }));
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Left Sidebar - Filters */}
        <div className="xl:col-span-1">
          <div className="xl:sticky xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto xl:custom-scrollbar xl:pr-2">
            <div className="space-y-6">
              {/* <ProblemFilter
                filters={getProblemsRequest.filters || {}}
                onFiltersChange={(filters) => {
                  console.log("Filters changed:", filters);
                  setGetProblemsRequest(prev => ({
                    ...prev,
                    filters,
                    // Reset pagination when filters change
                    after: undefined,
                    before: undefined,
                    first: prev.first || 2,
                    last: undefined
                  }));
                }}
                onSearch={() => {
                  console.log("Search triggered");
                  // ProblemFilter handles search internally through filters
                  // This is just a trigger callback
                }}
                onReset={() => {
                  console.log("Reset filters");
                  setGetProblemsRequest({
                    keyword: "",
                    first: 2,
                    sortBy: SortBy.CREATED_AT,
                    sortOrder: SortOrder.DESC,
                    filters: {}
                  });
                }}
              /> */}
              {/* 
                <QuickFilters
                    activeFilters={getProblemsRequest.filters || {}}
                    onRemoveFilter={(filterType) => {
                      console.log("Removing filter:", filterType);
                      const newFilters = { ...getProblemsRequest.filters };
                      delete newFilters[filterType];
                      setGetProblemsRequest(prev => ({
                        ...prev,
                        filters: newFilters,
                        after: undefined,
                        before: undefined,
                        first: prev.first || 2,
                        last: undefined
                      }));
                    }}
                    onClearAll={handleResetPagination}
                /> */}
            </div>
          </div>
        </div>

        {/* Right Content - Problems List */}
        <div className="xl:col-span-3">
          <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl">
              <div className="flex items-center gap-4">
                <SortControls
                  sortField={getProblemsRequest.sortBy as SortField}
                  sortOrder={getProblemsRequest.sortOrder || SortOrder.DESC}
                  onSortChange={(field, order) => {
                    setGetProblemsRequest((prev) => ({
                      ...prev,
                      sortBy: field as SortBy,
                      sortOrder: order as SortOrder,
                      after: undefined,
                      before: undefined,
                      first: prev.first || 2,
                      last: undefined,
                    }));
                  }}
                />
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full">
                  Tìm kiếm
                </span>
              </div>
            </div>

            {/* Problems Table */}
            {error ? (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl p-8 text-center">
                <div className="text-slate-500 dark:text-slate-400 text-lg">
                  {error}
                </div>
              </div>
            ) : (
              <ProblemTable
                problems={problems}
                pageInfo={pageInfo}
                totalCount={totalCount}
                onLoadMore={handleLoadMore}
                onLoadPrevious={handleLoadPrevious}
                isLoading={isLoading}
                selectionMode={mode === 'select'}
                onProblemSelect={handleProblemSelection}
                onProblemView={onProblemView}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      {/* <div className="mt-16 pt-8 border-t border-white/20 dark:border-slate-700/50">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-slate-600 dark:text-slate-400 font-medium">
              Dữ liệu được đồng bộ real-time từ Vibe Match
            </span>
          </div>
          <p className="mt-4 text-slate-500 dark:text-slate-500">
            Tổng cộng{" "}
            <strong className="text-green-600 dark:text-emerald-400">
              {totalCount}
            </strong>{" "}
            bài tập từ nhiều chủ đề
          </p>
        </div>
      </div> */}
    </div>
  );
}
