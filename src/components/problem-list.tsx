'use client';

import useProblems from '@/hooks/use-problems';
import type { Problem, ProblemEndpointType } from '@/types/problems';
import ProblemFilter from './problem-filters/problem-filter';
import ProblemTable, { type ProblemTableMode } from './problem-table';

export enum ProblemListMode {
  VIEW = 'view',
  SELECT = 'select',
  MULTIPLE_SELECT = 'multiple_select',
}

interface ProblemListProps {
  mode: ProblemListMode;
  endpointType: ProblemEndpointType;
  initialSelectedProblemIds?: Set<number>;
  onProblemView?: (problem: Problem) => void;
  onProblemSelect?: (problem: Problem) => void;
  onMultipleProblemsSelect?: (problems: Problem[]) => void;
}

export default function ProblemList({
  mode,
  endpointType,
  initialSelectedProblemIds,
  onProblemView,
  onProblemSelect,
  onMultipleProblemsSelect,
}: ProblemListProps) {
  const {
    // State
    problems,
    meta,
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
    handlePageChange,
  } = useProblems(endpointType);

  const handleProblemSelection = (problem: Problem) => {
    if (onProblemSelect) {
      onProblemSelect(problem);
    }
  };

  const handleMultipleProblemsSelect = (selectedProblems: Problem[]) => {
    if (mode === ProblemListMode.MULTIPLE_SELECT && onMultipleProblemsSelect) {
      onMultipleProblemsSelect(selectedProblems);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8" style={{ maxWidth: 'none' }}>
      <div className="space-y-6">
        {/* Filter Section */}
        <ProblemFilter
          keyWord={keyword}
          filters={filters}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onKeywordChange={handleKeywordChange}
          onFiltersChange={handleFiltersChange}
          onSortByChange={handleSortByChange}
          onSortOrderChange={handleSortOrderChange}
          onSearch={handleSearch}
          onReset={handleReset}
          isLoading={isLoading}
        />

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
            meta={meta}
            totalCount={totalCount}
            onPageChange={handlePageChange}
            isLoading={isLoading}
            mode={mode as unknown as ProblemTableMode}
            sortBy={sortBy}
            sortOrder={sortOrder}
            initialSelectedProblemIds={initialSelectedProblemIds}
            onSortByChange={handleSortByChange}
            onSortOrderChange={handleSortOrderChange}
            onProblemSelect={handleProblemSelection}
            onProblemView={onProblemView}
            onMultipleProblemsSelect={handleMultipleProblemsSelect}
          />
        )}
      </div>
    </div>
  );
}
