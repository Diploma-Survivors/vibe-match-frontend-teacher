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
import type { PageInfo, ProblemData } from '@/types/problems';
import { getDifficultyColor, getDifficultyLabel } from '@/types/problems';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

interface ProblemTableProps {
  problems: ProblemData[];
  pageInfo?: PageInfo | null;
  totalCount?: number;
  onLoadMore?: () => void;
  onLoadPrevious?: () => void;
  isLoading?: boolean;
  selectionMode?: boolean;
  onProblemSelect?: (problem: ProblemData) => void;
  onProblemView?: (problem: ProblemData) => void;
}

export default function ProblemTable({
  problems,
  pageInfo,
  totalCount = 0,
  onLoadMore,
  onLoadPrevious,
  isLoading = false,
  selectionMode = false,
  onProblemSelect,
  onProblemView,
}: ProblemTableProps) {
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(
    null
  );

  const handleProblemClick = (problemId: string) => {
    if (selectionMode && onProblemView) {
      const selectedProblem = problems.find(
        (problem) => problem.id === problemId
      );
      if (selectedProblem) {
        onProblemView(selectedProblem);
      }
    }
  };

  const handleProblemSelection = (problemId: string) => {
    setSelectedProblemId(problemId);
  };

  const handleConfirmSelection = () => {
    if (selectedProblemId && onProblemSelect) {
      const selectedProblem = problems.find(
        (problem) => problem.id === selectedProblemId
      );
      if (selectedProblem) {
        onProblemSelect(selectedProblem);
      }
    }
  };

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
            📚 Danh sách bài tập
          </h3>
          {selectionMode && (
            <Button
              onClick={handleConfirmSelection}
              disabled={!selectedProblemId}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-all duration-200 shadow-lg"
            >
              Chọn bài tập
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto max-w-full">
        <div className="min-w-[1000px]">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-700/20">
                {selectionMode && (
                  <TableHead className="w-16 font-bold text-slate-700 dark:text-slate-300 text-center px-4 py-3">
                    Chọn
                  </TableHead>
                )}
                {/* <TableHead className="w-20 font-bold text-slate-700 dark:text-slate-300 text-center px-4 py-3">
                  STT
                </TableHead> */}
                <TableHead className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3 w-96">
                  Bài tập
                </TableHead>
                {!selectionMode && (
                  <TableHead className="w-32 font-bold text-slate-700 dark:text-slate-300 text-center px-4 py-3">
                    Topic
                  </TableHead>
                )}
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
                            <div className="w-12 h-4 bg-slate-300 dark:bg-slate-600 rounded" />
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
                            type="radio"
                            name="problem-selection"
                            value={problem.id}
                            checked={selectedProblemId === problem.id}
                            onChange={() => handleProblemSelection(problem.id)}
                            className="w-4 h-4 text-green-600 focus:ring-green-500 border-2 border-slate-300"
                          />
                        </TableCell>
                      )}
                      {/* <TableCell className="text-center px-4 py-4">
                      <div className="inline-flex px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border border-green-200 dark:border-green-700">
                        <code className="text-green-700 dark:text-green-300 font-bold text-sm">
                          {problem.id}
                        </code>
                      </div>
                    </TableCell> */}
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
                              className={`${getDifficultyColor(problem.difficulty)} font-medium px-3 py-1 rounded-lg border text-xs inline-block`}
                            >
                              {getDifficultyLabel(problem.difficulty)}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {/* {problem.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg"
                            >
                              {tag}
                            </span>
                          ))}
                          {problem.tags.length > 2 && (
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              +{problem.tags.length - 2}
                            </span>
                          )} */}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      {!selectionMode && (
                        <TableCell className="text-center px-4 py-4">
                          <div className="space-y-2">
                            <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm break-words">
                              {problem.topic}
                            </div>
                          </div>
                        </TableCell>
                      )}
                      {/*{!selectionMode && (*/}
                      {/*  <TableCell className="text-center px-4 py-4">*/}
                      {/*    <div*/}
                      {/*      className={`inline-flex items-center justify-center w-16 h-8 rounded-full text-xs font-bold ${*/}
                      {/*        problem.acceptanceRate >= 70*/}
                      {/*          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700"*/}
                      {/*          : problem.acceptanceRate >= 40*/}
                      {/*            ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700"*/}
                      {/*            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700"*/}
                      {/*      }`}*/}
                      {/*    >*/}
                      {/*      {problem.acceptanceRate.toFixed(1)}%*/}
                      {/*    </div>*/}
                      {/*  </TableCell>*/}
                      {/*)}*/}
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Cursor-based Pagination */}
      {pageInfo && (pageInfo.hasNextPage || pageInfo.hasPreviousPage) && (
        <div className="flex items-center justify-between p-6 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-700/10">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onLoadPrevious}
              disabled={!pageInfo.hasPreviousPage || isLoading}
              className="px-4 py-2 rounded-xl border-0 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Trang trước
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onLoadMore}
              disabled={!pageInfo.hasNextPage || isLoading}
              className="px-4 py-2 rounded-xl border-0 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
            >
              Trang sau
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                Đang tải...
              </div>
            ) : (
              <span>
                Hiển thị{' '}
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {problems.length}
                </span>{' '}
                /{' '}
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {totalCount}
                </span>{' '}
                bài tập
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
