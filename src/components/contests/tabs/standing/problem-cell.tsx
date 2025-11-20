import type { ProblemResult } from '@/types/contest';

interface ProblemCellProps {
  problemId: number;
  problemResults: ProblemResult[];
}

export function ProblemCell({ problemId, problemResults }: ProblemCellProps) {
  const result = problemResults.find((pr) => pr.problemId === problemId);

  if (!result) {
    return (
      <div className="flex items-center justify-center text-gray-300 py-2 min-h-[60px]">
        <span className="text-sm">-</span>
      </div>
    );
  }

  if (result.isAccepted) {
    return (
      <div
        className="flex flex-col items-center justify-center text-gray-800 font-semibold py-2 min-h-[60px]"
        style={{ backgroundColor: 'rgb(183, 249, 147)' }}
      >
        <span className="text-sm leading-tight">{result.score}</span>
        <span className="text-[10px] text-gray-700 opacity-90 mt-0.5 font-normal">
          {result.time}
        </span>
        {result.attempts > 1 && (
          <span className="text-[10px] text-gray-700 opacity-80 mt-0.5">
            +{result.attempts - 1}
          </span>
        )}
      </div>
    );
  }

  if (result.attempts > 0) {
    return (
      <div className="flex items-center justify-center text-red-600 font-medium py-2 min-h-[60px]">
        <span className="text-sm">-{result.attempts}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center text-gray-300 py-2 min-h-[60px]">
      <span className="text-sm">-</span>
    </div>
  );
}
