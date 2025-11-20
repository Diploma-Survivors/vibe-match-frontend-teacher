import ProblemDetailModal from '@/components/contests/problem-detail-modal';
import type { Contest } from '@/types/contest';
import { useState } from 'react';

interface ContestProblemListProps {
  problems: Contest['problems'];
}

export default function ContestProblemList({
  problems,
}: ContestProblemListProps) {
  const [selectedProblemId, setSelectedProblemId] = useState<number | null>(
    null
  );
  return (
    <div className="bg-white border border-gray-300 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800">
              <th className="px-4 py-3 text-left text-sm font-bold text-white w-16">
                STT
              </th>
              <th className="px-4 py-3 text-left text-sm font-bold text-white">
                Tên bài tập
              </th>
              <th className="px-4 py-3 text-center text-sm font-bold text-white w-32">
                Thời gian
              </th>
              <th className="px-4 py-3 text-center text-sm font-bold text-white w-32">
                Bộ nhớ
              </th>
              <th className="px-4 py-3 text-center text-sm font-bold text-white w-24">
                Điểm
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {problems.map((problem, index) => (
              <tr
                key={problem.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-4">
                  <span className="text-base font-semibold text-black">
                    {index + 1}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => setSelectedProblemId(problem.id)}
                    className="text-base font-bold text-black hover:text-green-600 hover:underline cursor-pointer"
                  >
                    {problem.title}
                  </button>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="text-base font-semibold text-black">
                    {problem.timeLimitMs}ms
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="text-base font-semibold text-black">
                    {Math.round(problem.memoryLimitKb / 1024)}MB
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className="text-base font-bold text-black">
                    {problem.score}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedProblemId && (
        <ProblemDetailModal
          problemId={selectedProblemId}
          onClose={() => setSelectedProblemId(null)}
        />
      )}
    </div>
  );
}
