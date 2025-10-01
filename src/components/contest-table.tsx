"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Contest } from "@/types/contest";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Trophy,
} from "lucide-react";
import Link from "next/link";

interface ContestTableProps {
  contests: Contest[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "chưa bắt đầu":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300";
    case "đang diễn ra":
      return "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300";
    case "đã kết thúc":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-900/30 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-900/30 dark:text-gray-300";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "chưa bắt đầu":
      return <Calendar className="w-4 h-4" />;
    case "đang diễn ra":
      return <Trophy className="w-4 h-4" />;
    case "đã kết thúc":
      return <Users className="w-4 h-4" />;
    default:
      return <Calendar className="w-4 h-4" />;
  }
};

export default function ContestTable({
  contests,
  currentPage,
  totalPages,
  onPageChange,
}: ContestTableProps) {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50">
        <h3 className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
          🏆 Danh sách cuộc thi
        </h3>
      </div>

      <div className="overflow-x-auto max-w-full">
        <div className="min-w-[800px]">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-700/20">
                <TableHead className="w-16 font-bold text-slate-700 dark:text-slate-300 text-center px-4 py-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-2 border-slate-300 text-green-600 focus:ring-green-500"
                  />
                </TableHead>
                <TableHead className="w-20 font-bold text-slate-700 dark:text-slate-300 text-center px-4 py-3">
                  ID
                </TableHead>
                <TableHead className="font-bold text-slate-700 dark:text-slate-300 px-4 py-3">
                  Cuộc thi
                </TableHead>
                <TableHead className="w-32 font-bold text-slate-700 dark:text-slate-300 text-center px-4 py-3">
                  Trạng thái
                </TableHead>
                <TableHead className="w-20 font-bold text-slate-700 dark:text-slate-300 text-center px-4 py-3">
                  Số bài
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contests.map((contest, index) => (
                <TableRow
                  key={contest.id}
                  className="border-b border-slate-100/50 dark:border-slate-700/30 hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-all duration-200 group"
                >
                  <TableCell className="text-center px-4 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-2 border-slate-300 text-green-600 focus:ring-green-500"
                    />
                  </TableCell>
                  <TableCell className="text-center px-4 py-4">
                    <div className="inline-flex px-3 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border border-green-200 dark:border-green-700">
                      <code className="text-green-700 dark:text-green-300 font-bold text-sm">
                        {contest.id}
                      </code>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="space-y-3">
                      <Link href={`/contests/${contest.id}`}>
                        <button
                          type="button"
                          className="text-left group-hover:text-green-600 dark:group-hover:text-green-400 font-semibold text-slate-900 dark:text-slate-100 transition-colors duration-200 hover:underline block w-full"
                        >
                          {contest.name}
                        </button>
                      </Link>
                      <div className="flex items-center gap-2">
                        <div
                          className={`${contest.accessRange === "public" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"} font-medium px-2 py-1 rounded-lg border text-xs inline-block`}
                        >
                          {contest.accessRange === "public"
                            ? "Công khai"
                            : "Riêng tư"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center px-4 py-4">
                    <div className="space-y-2">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(contest.status)}`}
                      >
                        {getStatusIcon(contest.status)}
                        {contest.status}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center px-4 py-4">
                    <div className="inline-flex items-center justify-center w-12 h-8 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
                      <span className="font-bold text-purple-700 dark:text-purple-300 text-sm">
                        {contest.problems.length}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-6 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-700/10">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-10 h-10 p-0 rounded-xl border-0 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className={`w-10 h-10 p-0 rounded-xl transition-all duration-200 ${
                      currentPage === pageNum
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                        : "border-0 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-10 h-10 p-0 rounded-xl border-0 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 transition-all duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Trang{" "}
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {currentPage}
            </span>{" "}
            /{" "}
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {totalPages}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
