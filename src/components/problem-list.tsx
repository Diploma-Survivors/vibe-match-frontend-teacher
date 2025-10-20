'use client';

import useProblems from '@/hooks/use-problems';
import { ProblemsService } from '@/services/problems-service';
import {
  type GetProblemListRequest,
  type PageInfo,
  type ProblemData,
  type ProblemEndpointType,
  type ProblemListResponse,
  SortBy,
  SortOrder,
} from '@/types/problems';
import { useEffect, useState } from 'react';
import ProblemTable, { type ProblemTableMode } from './problem-table';
import SortControls from './sort-controls';

export enum ProblemListMode {
  VIEW = 'view',
  SELECT = 'select',
  MULTIPLE_SELECT = 'multiple_select',
}

interface ProblemListProps {
  mode: ProblemListMode;
  endpointType: ProblemEndpointType;
  onProblemView?: (problem: ProblemData) => void;
  onProblemSelect?: (problem: ProblemData) => void;
  onMultipleProblemsSelect?: (problems: ProblemData[]) => void;
}

export default function ProblemList({
  mode,
  endpointType,
  onProblemView,
  onProblemSelect,
  onMultipleProblemsSelect,
}: ProblemListProps) {
  const {
    // State
    problems,
    pageInfo,
    totalCount,
    isLoading,
    error,

    // Request params (exposed for UI)
    filters,
    keyword,
    sortBy,
    sortOrder,

    // Handlers
    handleFiltersChange,
    handleKeywordChange,
    handleSortByChange,
    handleSortOrderChange,
    handleSearch,
    handleReset,
    handleLoadMore,
  } = useProblems(endpointType);

  const handleProblemSelection = (problem: ProblemData) => {
    if (onProblemSelect) {
      onProblemSelect(problem);
    }
  };

  const handleMultipleProblemsSelect = (selectedProblems: ProblemData[]) => {
    if (mode === ProblemListMode.MULTIPLE_SELECT && onMultipleProblemsSelect) {
      onMultipleProblemsSelect(selectedProblems);
    }
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
            {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl">
              <div className="flex items-center gap-4">
                <SortControls
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSortByChange={handleSortByChange}
                  onSortOrderChange={handleSortOrderChange}
                />
              </div>
            </div> */}

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
                hasMore={pageInfo?.hasNextPage ?? false}
                totalCount={totalCount}
                onLoadMore={handleLoadMore}
                isLoading={isLoading}
                mode={mode as unknown as ProblemTableMode}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortByChange={handleSortByChange}
                onSortOrderChange={handleSortOrderChange}
                onProblemSelect={handleProblemSelection}
                onProblemView={onProblemView}
                onMultipleProblemsSelect={handleMultipleProblemsSelect}
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
