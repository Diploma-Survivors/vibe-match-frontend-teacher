'use client';

import { ProblemFilters } from "@/types/problem";
import { useEffect, useMemo, useState } from "react";
import SortControls, { SortField, SortOrder } from "./sort-controls";
import { mockProblems } from "@/lib/data/mock-problems";
import ProblemFilter from "./problem-filter";
import ProblemTable from "./problem-table";
import { ProblemService } from "@/services/problem-service";
import { LtiService } from "@/services/lti-service";

const ITEMS_PER_PAGE = 10;

const mockFetchwithPromise = async () => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
}

interface ProblemTableProps {
  mode: "view" | "select";
  onProblemView?: (problemId: string) => void;
}

export default function ProblemList({
  mode,
  onProblemView
}: ProblemTableProps) {
  mockFetchwithPromise();

  const [filters, setFilters] = useState<ProblemFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await ProblemService.getAll();
        console.log(data);
        setProblems(data);
      } catch (error) {
        console.log("Data Fetch error", error);
      }
    };

    fetchProblems();
  }, []);

  const handleProblemSelectForDeeplinkingResponse = async (problemId: string) => {
    try {
      const response = await LtiService.sendDeepLinkingResponse(problemId);
    } catch (error) {
      console.log("FAID");
    }
  }

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
        const hasMatchingTag = filters.tags.some(tag =>
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
      if (sortField === "difficulty") {
        const difficultyOrder = { Dễ: 1, "Trung bình": 2, Khó: 3 };
        aValue =
          difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0;
        bValue =
          difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0;
      }

      // Handle string sorting
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
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
      [key]: "",
    }));
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };


  return (
    <div className="container mx-auto px-6 py-8">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Left Sidebar - Filters */}
        <div className="xl:col-span-1">
          <div className="xl:sticky xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto xl:custom-scrollbar xl:pr-2">
            <div className="space-y-6">
              <ProblemFilter
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onSearch={handleSearch}
                onReset={handleReset}
              />
              {/* 
                <QuickFilters
                    activeFilters={filters}
                    onRemoveFilter={handleRemoveFilter}
                    onClearAll={handleClearAllFilters}
                /> */}
            </div>
          </div>
        </div>

        {/* Right Content - Problem List */}
        <div className="xl:col-span-3">
          <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl">
              <div className="flex items-center gap-4">
                <SortControls
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSortChange={handleSortChange}
                />
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  {paginatedProblems.length} /{" "}
                  {filteredAndSortedProblems.length} bài tập
                </span>
              </div>
            </div>

            {/* Problem Table */}
            <ProblemTable
              problems={problems}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              selectionMode={mode === "select"}
              onProblemSelect={handleProblemSelectForDeeplinkingResponse}
              onProblemView={onProblemView}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-white/20 dark:border-slate-700/50">
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
              {mockProblems.length}
            </strong>{" "}
            bài tập từ nhiều chủ đề
          </p>
        </div>
      </div>
    </div>
  )
}
