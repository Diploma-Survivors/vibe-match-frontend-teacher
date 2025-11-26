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
import { StandingPagination } from './standing-pagination';

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
                  {/* Rank */}
                  <TableCell className="text-center sticky left-0 bg-inherit z-10 border-r border-gray-300 py-3">
                    <span className="text-gray-800 font-semibold text-sm">
                      {node.rank}
                    </span>
                  </TableCell>

                  {/* User Info */}
                  <TableCell className="border-r border-gray-300 py-3 pl-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-base text-gray-800 font-bold">
                        {node.user.email}
                      </span>
                      <span className="text-sm text-gray-600 font-bold">
                        {node.user.firstName} {node.user.lastName}
                      </span>
                    </div>
                  </TableCell>

                  {/* Total Score */}
                  <TableCell className="text-center border-r border-gray-300 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-gray-900 text-sm">
                        {node.totalScore % 1 === 0
                          ? node.totalScore.toFixed(0)
                          : node.totalScore.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-600 font-mono">
                        {node.totalTime}
                      </span>
                    </div>
                  </TableCell>

                  {/* Problem Results */}
                  {node.problemResults.map((result) => (
                    <TableCell
                      key={result.problemId}
                      className="text-center p-0 border-r border-gray-300 last:border-r-0"
                    >
                      {result.status === 'ACCEPTED' ? (
                        <div
                          className="flex flex-col items-center justify-center text-gray-800 font-semibold py-2 min-h-[60px]"
                          style={{ backgroundColor: 'rgb(183, 249, 147)' }}
                        >
                          <span className="text-sm leading-tight">
                            {result.score % 1 === 0
                              ? result.score.toFixed(0)
                              : result.score.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-gray-700 opacity-90 mt-0.5 font-normal">
                            {result.time}
                          </span>
                        </div>
                      ) : result.status === 'NOT_ACCEPTED' ? (
                        <div className="flex flex-col items-center justify-center text-gray-800 py-2 min-h-[60px]">
                          <span className="text-sm leading-tight">
                            {result.score % 1 === 0
                              ? result.score.toFixed(0)
                              : result.score.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-gray-700 opacity-90 mt-0.5 font-normal">
                            {result.time}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center text-gray-300 py-2 min-h-[60px]">
                          <span className="text-sm">-</span>
                        </div>
                      )}
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
