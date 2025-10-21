'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type {
  PageInfo,
  ProblemData,
  SortBy,
  SortOrder,
} from '@/types/problems';
import { getDifficultyColor, getDifficultyLabel } from '@/types/problems';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaList } from 'react-icons/fa6';
import InfiniteScroll from 'react-infinite-scroll-component';
import ProblemTableHeader from './problem-table-header';
import SortControls from './sort-controls';

export enum ProblemTableMode {
  VIEW = 'view',
  SELECT = 'select',
  MULTIPLE_SELECT = 'multiple_select',
}

interface ProblemTableProps {
  problems: ProblemData[];
  hasMore: boolean;
  // pageInfo?: PageInfo | null;
  totalCount?: number;
  onLoadMore: () => void;
  // onLoadPrevious?: () => void;
  isLoading?: boolean;
  mode: ProblemTableMode;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortByChange: (newSortBy: SortBy) => void;
  onSortOrderChange: (newSortOrder: SortOrder) => void;
  onProblemSelect?: (problem: ProblemData) => void;
  onMultipleProblemsSelect?: (problems: ProblemData[]) => void;
  onProblemView?: (problem: ProblemData) => void;
}

export default function ProblemTable({
  problems,
  totalCount = 0,
  onLoadMore,
  isLoading = false,
  hasMore,
  mode,
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
  onProblemSelect,
  onMultipleProblemsSelect,
  onProblemView,
}: ProblemTableProps) {
  const selectionMode =
    mode === ProblemTableMode.SELECT ||
    mode === ProblemTableMode.MULTIPLE_SELECT;
  const isMultipleSelect = mode === ProblemTableMode.MULTIPLE_SELECT;
  const [selectedProblemId, setSelectedProblemId] = useState<number | null>(
    null
  );
  const [selectedProblemIds, setSelectedProblemIds] = useState<Set<number>>(
    new Set()
  );

  const handleProblemClick = (problemId: number) => {
    if (selectionMode && onProblemView) {
      const selectedProblem = problems.find(
        (problem) => problem.id === problemId
      );
      if (selectedProblem) {
        onProblemView(selectedProblem);
      }
    }
  };

  const handleProblemSelection = (problemId: number) => {
    if (isMultipleSelect) {
      setSelectedProblemIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(problemId)) {
          newSet.delete(problemId);
        } else {
          newSet.add(problemId);
        }
        return newSet;
      });
    } else {
      setSelectedProblemId(problemId);
    }
  };

  const handleConfirmSelection = () => {
    if (isMultipleSelect && onMultipleProblemsSelect) {
      const selectedProblems = problems.filter((problem) =>
        selectedProblemIds.has(problem.id)
      );
      if (selectedProblems.length > 0) {
        onMultipleProblemsSelect(selectedProblems);
      }
    } else if (selectedProblemId && onProblemSelect) {
      const selectedProblem = problems.find(
        (problem) => problem.id === selectedProblemId
      );
      if (selectedProblem) {
        onProblemSelect(selectedProblem);
      }
    }
  };

  const hasSelection = isMultipleSelect
    ? selectedProblemIds.size > 0
    : selectedProblemId !== null;

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FaList className="text-slate-700 dark:text-slate-200" />
            <span className="bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
              Danh sách bài tập
            </span>
          </h3>
          {selectionMode && (
            <Button
              onClick={handleConfirmSelection}
              disabled={!hasSelection}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-all duration-200 shadow-lg"
            >
              {isMultipleSelect
                ? `Chọn ${selectedProblemIds.size} bài tập`
                : 'Chọn bài tập'}
            </Button>
          )}
        </div>
      </div>

      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {problems.length}
              </span>{' '}
              / {totalCount} bài tập
            </div>
            <SortControls
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortByChange={onSortByChange}
              onSortOrderChange={onSortOrderChange}
            />
          </div>
        </div>
      </div>

      <InfiniteScroll
        dataLength={problems.length}
        next={onLoadMore}
        hasMore={hasMore}
        loader={
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="dots-loader mb-4" />
          </div>
        }
        endMessage={
          <div className="text-center py-8 px-4">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full border border-green-200 dark:border-green-700">
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                Bạn đã xem hết tất cả bài tập!
              </p>
            </div>
          </div>
        }
        scrollThreshold={0.9}
        style={{ overflow: 'visible' }}
      >
        <div className="overflow-x-auto max-w-full">
          <div className="min-w-[1000px]">
            <Table className="w-full table-fixed">
              <TableHeader>
                <TableRow className="border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-700/20">
                  {selectionMode && (
                    <TableHead className="w-8 font-bold text-slate-700 dark:text-slate-300 text-center px-4 py-3">
                      Chọn
                    </TableHead>
                  )}
                  <TableHead className="w-8 font-bold text-slate-700 dark:text-slate-300 text-center px-4 py-3">
                    ID
                  </TableHead>
                  <TableHead className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 w-96 ml-4">
                    Bài tập
                  </TableHead>
                  <TableHead className="w-32 font-bold text-slate-700 dark:text-slate-300 text-center px-4 py-3">
                    Topic
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && problems.length === 0
                  ? // Loading skeleton for initial load
                    Array.from({ length: 3 }, (_, index) => index).map(
                      (skeletonId) => (
                        <TableRow
                          key={`loading-skeleton-${skeletonId}`}
                          className="border-b border-slate-100/50 dark:border-slate-700/30"
                        >
                          {selectionMode && (
                            <TableCell className="text-center px-4 py-4">
                              <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                            </TableCell>
                          )}
                          <TableCell className="text-center px-4 py-4">
                            <div className="inline-flex px-3 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse">
                              <div className="w-4 h-4 bg-slate-300 dark:bg-slate-600 rounded" />
                            </div>
                          </TableCell>
                          <TableCell className="px-4 py-4">
                            <div className="space-y-3">
                              <div className="w-3/4 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                              <div className="flex items-center gap-3">
                                <div className="w-16 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                                <div className="w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                              </div>
                            </div>
                          </TableCell>
                          {!selectionMode && (
                            <TableCell className="text-center px-4 py-4">
                              <div className="w-20 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mx-auto" />
                            </TableCell>
                          )}
                        </TableRow>
                      )
                    )
                  : problems.map((problem, index) => (
                      <TableRow
                        key={problem.id}
                        className="border-b border-slate-100/50 dark:border-slate-700/30 hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-all duration-200 group"
                      >
                        {selectionMode && (
                          <TableCell className="text-center px-4 py-4">
                            <input
                              type={isMultipleSelect ? 'checkbox' : 'radio'}
                              name={
                                isMultipleSelect
                                  ? undefined
                                  : 'problem-selection'
                              }
                              value={problem.id}
                              checked={
                                isMultipleSelect
                                  ? selectedProblemIds.has(problem.id)
                                  : selectedProblemId === problem.id
                              }
                              onChange={() =>
                                handleProblemSelection(problem.id)
                              }
                              className="w-4 h-4 text-green-600 focus:ring-green-500 border-2 border-slate-300"
                            />
                          </TableCell>
                        )}
                        <TableCell className="text-center px-4 py-4">
                          <div className="inline-flex px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border border-green-200 dark:border-green-700">
                            <code className="text-green-700 dark:text-green-300 font-bold text-sm">
                              {problem.id}
                            </code>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-4">
                          <div className="space-y-3">
                            {selectionMode ? (
                              <button
                                type="button"
                                className="text-left group-hover:text-green-600 dark:group-hover:text-green-400 font-semibold text-slate-900 dark:text-slate-100 transition-colors duration-200 hover:underline block w-full"
                                onClick={() => handleProblemClick(problem.id)}
                              >
                                {problem.title}
                              </button>
                            ) : (
                              <Link href={`/problems/${problem.id}`}>
                                <button
                                  type="button"
                                  className="text-left group-hover:text-green-600 dark:group-hover:text-green-400 font-semibold text-slate-900 dark:text-slate-100 transition-colors duration-200 hover:underline block w-full"
                                >
                                  {problem.title}
                                </button>
                              </Link>
                            )}
                            <div className="flex items-center gap-3 flex-wrap">
                              <div
                                className={`${getDifficultyColor(
                                  problem.difficulty
                                )} font-medium px-3 py-1 rounded-lg border text-xs inline-block`}
                              >
                                {getDifficultyLabel(problem.difficulty)}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {problem.tags.map((tag) => (
                                  <span
                                    key={tag.id}
                                    className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg"
                                  >
                                    {tag.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center px-4 py-4">
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1 justify-center">
                              {problem.topic && problem.topic.length > 0 ? (
                                problem.topic.map((topicItem) => (
                                  <span
                                    key={topicItem.id}
                                    className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-medium"
                                  >
                                    {topicItem.name}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-slate-500 dark:text-slate-400 italic">
                                  Chưa phân loại
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </InfiniteScroll>
    </div>
  );
}
