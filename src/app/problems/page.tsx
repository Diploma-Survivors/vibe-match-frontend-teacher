'use client';

import ProblemList from '@/components/problem-list';
import type { SortField, SortOrder } from '@/components/sort-controls';
import { Button } from '@/components/ui/button';
import { mockProblems } from '@/lib/data/mock-problems';
import { ProblemEndpointType, type ProblemFilters } from '@types/problems';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const ITEMS_PER_PAGE = 10;

const mockFetchwithPromise = async () => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
};

export default function ProblemsPage() {
  mockFetchwithPromise();

  const [filters, setFilters] = useState<ProblemFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // First, fix the filtering to handle tags array
  const filteredAndSortedProblems = useMemo(() => {
    // First filter
    const filtered = mockProblems.filter((problem) => {
      if (
        filters.id &&
        !problem.id.toLowerCase().includes(filters.id.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.title &&
        !problem.title.toLowerCase().includes(filters.title.toLowerCase())
      ) {
        return false;
      }
      if (filters.difficulty && problem.difficulty !== filters.difficulty) {
        return false;
      }
      if (filters.topic && problem.topic !== filters.topic) {
        return false;
      }
      // Handle tags array filtering
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some((tag) =>
          problem.tags?.includes(tag)
        );
        if (!hasMatchingTag) {
          return false;
        }
      }
      if (filters.accessRange && problem.accessRange !== filters.accessRange) {
        return false;
      }
      return true;
    });

    // Then sort - fix the type assertion
    filtered.sort((a, b) => {
      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];

      // Handle special sorting for difficulty
      if (sortField === 'difficulty') {
        const difficultyOrder = { Dễ: 1, 'Trung bình': 2, Khó: 3 };
        aValue =
          difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0;
        bValue =
          difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0;
      }

      // Handle string sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    });

    return filtered;
  }, [filters, sortField, sortOrder]);

  // Paginate filtered and sorted problems
  const paginatedProblems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedProblems.slice(startIndex, endIndex);
  }, [filteredAndSortedProblems, currentPage]);

  const totalPages = Math.ceil(
    filteredAndSortedProblems.length / ITEMS_PER_PAGE
  );

  const handleFiltersChange = (newFilters: ProblemFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = () => {
    // Search is handled automatically through filtering
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortChange = (field: SortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handleRemoveFilter = (key: keyof ProblemFilters) => {
    setFilters((prev) => ({
      ...prev,
      [key]: '',
    }));
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 dark:from-slate-900 dark:via-green-900 dark:to-emerald-900 pt-4">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                Vibe Match Problems
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Khám phá và chinh phục hàng ngàn bài tập lập trình
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/problems/create">
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6">
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo bài tập mới
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <ProblemList
        mode="view"
        endpointType={ProblemEndpointType.SELECTABLE_FOR_ASSIGNMENT}
      />
    </div>
  );
}
