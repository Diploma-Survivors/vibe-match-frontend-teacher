import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { LeaderboardResponse } from '@/types/contest';
import { Trophy } from 'lucide-react';
import { ProblemCell } from './problem-cell';
import { StandingPagination } from './standing-pagination';
import { UserInfoCell } from './user-info-cell';

interface StandingTableProps {
  data: LeaderboardResponse;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onLoadNext: () => void;
  onLoadPrevious: () => void;
}

export function StandingTable({
  data,
  hasNextPage,
  hasPreviousPage,
  onLoadNext,
  onLoadPrevious,
}: StandingTableProps) {
  const { problems, rankings } = data;

  return (
    <div className="border border-gray-300 overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <Table className="border-collapse">
          <TableHeader>
            <TableRow className="bg-gray-700 hover:bg-gray-700">
              <TableHead className="w-16 text-center font-bold text-sm py-3 sticky left-0 bg-gray-700 z-20 border-r border-gray-300 border-b border-gray-300 text-white">
                Hạng
              </TableHead>
              <TableHead className="min-w-[240px] font-bold text-sm py-3 pl-4 border-r border-gray-300 border-b border-gray-300 text-white">
                Tên truy cập
              </TableHead>
              <TableHead className="w-28 text-center font-bold text-sm py-3 border-r border-gray-300 border-b border-gray-300 text-white">
                Điểm
              </TableHead>
              {problems.map((problem, index) => (
                <TableHead
                  key={problem.id}
                  className="w-20 text-center font-bold text-sm py-3 border-r border-gray-300 border-b border-gray-300 last:border-r-0 text-white"
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-base text-white">{index + 1}</span>
                    <span className="text-[11px] text-white font-normal">
                      {problem.maxScore}
                    </span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankings.edges.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3 + problems.length}
                  className="text-center py-16 text-gray-500"
                >
                  <div className="flex flex-col items-center gap-3">
                    <Trophy className="w-16 h-16 text-gray-300" />
                    <p className="text-lg">Chưa có dữ liệu xếp hạng</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rankings.edges.map(({ node }) => (
                <TableRow
                  key={node.user.id}
                  className="border-b border-gray-300 hover:bg-blue-50 transition-colors bg-white"
                >
                  <UserInfoCell node={node} />
                  {problems.map((problem) => (
                    <TableCell
                      key={problem.id}
                      className="text-center p-0 border-r border-gray-300 last:border-r-0"
                    >
                      <ProblemCell
                        problemId={problem.id as number}
                        problemResults={node.problemResults}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <StandingPagination
        totalCount={rankings.totalCount}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onLoadNext={onLoadNext}
        onLoadPrevious={onLoadPrevious}
      />
    </div>
  );
}
