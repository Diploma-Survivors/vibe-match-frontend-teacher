'use client';

import { Button } from '@/components/ui/button';
import { Problem, ProblemEndpointType } from '@/types/problems';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import useProblems from '@/hooks/use-problems';
import ProblemFilter from '@/components/problem-filters/problem-filter';
import ProblemTable, { ProblemTableMode } from '@/components/problem-table';
import { useDialog } from '@/components/providers/dialog-provider';
import { toastService } from '@/services/toasts-service';

import { TagsService } from '@/services/tags-service';
import { TopicsService } from '@/services/topics-service';
import type { Tag } from '@/types/tags';
import type { Topic } from '@/types/topics';
import { useEffect, useState } from 'react';

export default function ProblemsPage() {
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
    refresh,
  } = useProblems(ProblemEndpointType.PROBLEM_MANAGEMENT);

  const { confirm } = useDialog();
  const [tags, setTags] = useState<Tag[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const fetchTagsAndTopics = async () => {
      try {
        const [tagsResponse, topicsResponse] = await Promise.all([
          TagsService.getAllTags(),
          TopicsService.getAllTopics(),
        ]);
        setTags(tagsResponse.data.data.data);
        setTopics(topicsResponse.data.data.data);
      } catch (error) {
        console.error('Failed to fetch tags or topics:', error);
      }
    };

    fetchTagsAndTopics();
  }, []);

  const handleStatusChange = async (problem: Problem) => {
    const newStatus = !problem.isActive;
    const action = newStatus ? 'activate' : 'deactivate';

    const confirmed = await confirm({
      title: `Confirm ${action}`,
      message: (
        <span>
          Are you sure you want to {action} the problem
          <span className="font-semibold text-foreground"> "{problem.title}"</span>?
        </span>
      ),
      confirmText: newStatus ? 'Activate' : 'Deactivate',
      cancelText: 'Cancel',
      color: newStatus ? 'green' : 'red',
    });

    if (confirmed) {
      try {
        // Mock API call
        // await ProblemsService.updateProblem(problem.id, { isActive: newStatus });
        await new Promise(resolve => setTimeout(resolve, 500));

        toastService.success(`Problem ${action}d successfully`);
        refresh();
      } catch (error) {
        console.error(`Failed to ${action} problem:`, error);
        toastService.error(`Failed to ${action} problem`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header Section */}
      <div className="dark:bg-slate-800 dark:border-slate-700">
        <div className="container mx-auto px-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  Problem list
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Manage problem with sFinx.
                </p>
              </div>

              <Button
                asChild
                className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6 h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/problems/create">
                  <Plus className="w-5 h-5 mr-2" />
                  Create new problem
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
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
            tags={tags}
            topics={topics}
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
              mode={ProblemTableMode.VIEW}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortByChange={handleSortByChange}
              onSortOrderChange={handleSortOrderChange}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
