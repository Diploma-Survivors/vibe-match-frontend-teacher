"use client";

import ContestFilter from "@/components/contest-filter";
import ContestTable from "@/components/contest-table";
import { Button } from "@/components/ui/button";
import { mockContests } from "@/lib/data/mock-contests";
import type { Contest, ContestFilters } from "@/types/contest";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const ITEMS_PER_PAGE = 10;

export default function ContestsPage() {
  const [filters, setFilters] = useState<ContestFilters>({});
  const [currentPage, setCurrentPage] = useState(1);

  // Filter contests
  const filteredContests = useMemo(() => {
    return mockContests.filter((contest) => {
      if (
        filters.id &&
        !contest.id.toLowerCase().includes(filters.id.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.name &&
        !contest.name.toLowerCase().includes(filters.name.toLowerCase())
      ) {
        return false;
      }
      if (filters.status && contest.status !== filters.status) {
        return false;
      }
      if (filters.accessRange && contest.accessRange !== filters.accessRange) {
        return false;
      }
      return true;
    });
  }, [filters]);

  // Paginate filtered contests
  const paginatedContests = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredContests.slice(startIndex, endIndex);
  }, [filteredContests, currentPage]);

  const totalPages = Math.ceil(filteredContests.length / ITEMS_PER_PAGE);

  const handleFiltersChange = (newFilters: ContestFilters) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 dark:from-slate-900 dark:via-green-900 dark:to-emerald-900 pt-4">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                Vibe Match Contests
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Quản lý và tổ chức các cuộc thi lập trình
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/contests/create">
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6">
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo cuộc thi mới
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Sidebar - Filters */}
          <div className="xl:col-span-1">
            <div className="xl:sticky xl:top-32 xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto xl:custom-scrollbar xl:pr-2">
              <div className="space-y-6">
                <ContestFilter
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onSearch={handleSearch}
                  onReset={handleReset}
                />
              </div>
            </div>
          </div>

          {/* Right Content - Contest List */}
          <div className="xl:col-span-3">
            <div className="space-y-6">
              {/* Stats */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl">
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    {paginatedContests.length} / {filteredContests.length} cuộc
                    thi
                  </span>
                </div>
              </div>

              {/* Contest Table */}
              <ContestTable
                contests={paginatedContests}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
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
                {mockContests.length}
              </strong>{" "}
              cuộc thi đã được tạo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
