'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ContestsService } from '@/services/contests-service';
import type { Contest } from '@/types/contest';
import { Trophy } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface StandingEntry {
  rank: number;
  participant: {
    id: number;
    name: string;
    username: string;
  };
  totalScore: number;
  totalTime: number; // in seconds
  problems: {
    problemId: number;
    score: number;
    attempts: number;
    isSolved: boolean;
    solvedAt?: string;
    timeTaken?: number; // in seconds
  }[];
}

export default function ContestStandingPage() {
  const params = useParams();
  const contestId = params.id as string;

  const [contest, setContest] = useState<Contest | null>(null);
  const [standings, setStandings] = useState<StandingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContestData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ContestsService.getContestById(contestId);
      const contestData = response?.data?.data;

      // Ensure contest has 5 problems for demo
      if (contestData?.problems) {
        while (contestData.problems.length < 5) {
          contestData.problems.push({
            id: contestData.problems.length + 1,
            title: `Bài ${contestData.problems.length + 1}`,
            score: 100,
            timeLimitMs: 2000,
            memoryLimitKb: 512,
          });
        }
      }

      setContest(contestData);

      // TODO: Replace with actual standings API call
      // For now, using mock data
      const mockStandings: StandingEntry[] = [
        {
          rank: 1,
          participant: {
            id: 1,
            name: 'Trần Nhật Long',
            username: 'TranNhatLong',
          },
          totalScore: 500,
          totalTime: 923, // 15:23 in seconds
          problems: [
            {
              problemId: 1,
              score: 100,
              attempts: 1,
              isSolved: true,
              solvedAt: '2024-01-01T10:00:00',
              timeTaken: 44,
            },
            {
              problemId: 2,
              score: 100,
              attempts: 1,
              isSolved: true,
              solvedAt: '2024-01-01T10:05:00',
              timeTaken: 107,
            },
            {
              problemId: 3,
              score: 100,
              attempts: 1,
              isSolved: true,
              solvedAt: '2024-01-01T10:10:00',
              timeTaken: 230,
            },
            {
              problemId: 4,
              score: 100,
              attempts: 1,
              isSolved: true,
              solvedAt: '2024-01-01T10:15:00',
              timeTaken: 312,
            },
            {
              problemId: 5,
              score: 100,
              attempts: 1,
              isSolved: true,
              solvedAt: '2024-01-01T10:20:00',
              timeTaken: 230,
            },
          ],
        },
        {
          rank: 2,
          participant: {
            id: 2,
            name: 'Lê Văn Khải',
            username: 'le_van_khai_342',
          },
          totalScore: 500,
          totalTime: 1211, // 20:11 in seconds
          problems: [
            {
              problemId: 1,
              score: 100,
              attempts: 1,
              isSolved: true,
              solvedAt: '2024-01-01T10:00:00',
              timeTaken: 67,
            },
            {
              problemId: 2,
              score: 100,
              attempts: 1,
              isSolved: true,
              solvedAt: '2024-01-01T10:08:00',
              timeTaken: 145,
            },
            {
              problemId: 3,
              score: 100,
              attempts: 1,
              isSolved: true,
              solvedAt: '2024-01-01T10:12:00',
              timeTaken: 280,
            },
            {
              problemId: 4,
              score: 100,
              attempts: 1,
              isSolved: true,
              solvedAt: '2024-01-01T10:18:00',
              timeTaken: 389,
            },
            {
              problemId: 5,
              score: 100,
              attempts: 1,
              isSolved: true,
              solvedAt: '2024-01-01T10:22:00',
              timeTaken: 330,
            },
          ],
        },
        {
          rank: 3,
          participant: {
            id: 3,
            name: 'Trung Lê',
            username: 'Trung_Le2710',
          },
          totalScore: 500,
          totalTime: 1523,
          problems: [
            {
              problemId: 1,
              score: 100,
              attempts: 1,
              isSolved: true,
              solvedAt: '2024-01-01T10:01:00',
              timeTaken: 89,
            },
            {
              problemId: 2,
              score: 100,
              attempts: 1,
              isSolved: true,
              solvedAt: '2024-01-01T10:10:00',
              timeTaken: 167,
            },
            {
              problemId: 3,
              score: 100,
              attempts: 1,
              isSolved: true,
              solvedAt: '2024-01-01T10:15:00',
              timeTaken: 312,
            },
            {
              problemId: 4,
              score: 100,
              attempts: 1,
              isSolved: true,
              solvedAt: '2024-01-01T10:22:00',
              timeTaken: 445,
            },
            {
              problemId: 5,
              score: 100,
              attempts: 1,
              isSolved: true,
              solvedAt: '2024-01-01T10:28:00',
              timeTaken: 510,
            },
          ],
        },
      ];
      setStandings(mockStandings);
    } catch (error) {
      console.error('Error fetching contest:', error);
    } finally {
      setLoading(false);
    }
  }, [contestId]);

  useEffect(() => {
    fetchContestData();
  }, [fetchContestData]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getUsernameColor = (rank: number) => {
    if (rank === 1) return 'text-red-600 font-semibold';
    if (rank === 2) return 'text-red-600 font-semibold';
    return 'text-purple-600';
  };

  const getRankBgColor = (rank: number, index: number) => {
    return 'bg-white';
  };

  const getProblemStatus = (problem: StandingEntry['problems'][0]) => {
    if (problem.isSolved) {
      return (
        <div
          className="flex flex-col items-center justify-center text-gray-800 font-semibold py-2 min-h-[60px]"
          style={{ backgroundColor: 'rgb(183, 249, 147)' }}
        >
          <span className="text-sm leading-tight">{problem.score}</span>
          {problem.timeTaken && (
            <span className="text-[10px] text-gray-700 opacity-90 mt-0.5 font-normal">
              {formatTime(problem.timeTaken)}
            </span>
          )}
          {problem.attempts > 1 && (
            <span className="text-[10px] text-gray-700 opacity-80 mt-0.5">
              +{problem.attempts - 1}
            </span>
          )}
        </div>
      );
    }
    if (problem.attempts > 0) {
      return (
        <div className="flex items-center justify-center text-red-600 font-medium py-2 min-h-[60px]">
          <span className="text-sm">-{problem.attempts}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center text-gray-300 py-2 min-h-[60px]">
        <span className="text-sm">-</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải bảng xếp hạng...</p>
        </div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="border border-gray-300 p-8 max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Không tìm thấy cuộc thi
          </h2>
          <p className="text-gray-600">
            Cuộc thi này không tồn tại hoặc đã bị xóa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Standings Table */}
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
                {contest.problems.map((problem, index) => (
                  <TableHead
                    key={problem.id}
                    className="w-20 text-center font-bold text-sm py-3 border-r border-gray-300 border-b border-gray-300 last:border-r-0 text-white"
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-base text-white">{index + 1}</span>
                      <span className="text-[11px] text-white font-normal">
                        {problem.score}
                      </span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {standings.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3 + contest.problems.length}
                    className="text-center py-16 text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <Trophy className="w-16 h-16 text-gray-300" />
                      <p className="text-lg">Chưa có dữ liệu xếp hạng</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                standings.map((entry, index) => (
                  <TableRow
                    key={entry.participant.id}
                    className={`border-b border-gray-300 hover:bg-blue-50 transition-colors ${getRankBgColor(entry.rank, index)}`}
                  >
                    <TableCell className="text-center sticky left-0 bg-inherit z-10 border-r border-gray-300 py-3">
                      <span className="text-gray-800 font-semibold text-sm">
                        {entry.rank}
                      </span>
                    </TableCell>
                    <TableCell className="border-r border-gray-300 py-3 pl-4">
                      <div className="flex flex-col gap-0.5">
                        <span
                          className={`text-sm ${getUsernameColor(entry.rank)}`}
                        >
                          {entry.participant.username}
                        </span>
                        <span className="text-xs text-gray-600">
                          {entry.participant.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center border-r border-gray-300 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-gray-900 text-sm">
                          {entry.totalScore}
                        </span>
                        <span className="text-xs text-gray-600 font-mono">
                          {formatTime(entry.totalTime)}
                        </span>
                      </div>
                    </TableCell>
                    {entry.problems.map((problem) => (
                      <TableCell
                        key={problem.problemId}
                        className="text-center p-0 border-r border-gray-300 last:border-r-0"
                      >
                        {getProblemStatus(problem)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
