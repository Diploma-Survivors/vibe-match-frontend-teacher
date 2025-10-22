import type { SortBy, SortOrder } from '@/types/problems';
import { FaList } from 'react-icons/fa6';
import SortControls from './sort-controls';

interface ProblemTableHeaderProps {
  currentCount: number;
  totalCount: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSortByChange: (newSortBy: SortBy) => void;
  onSortOrderChange: (newSortOrder: SortOrder) => void;
}

export default function ProblemTableHeader({
  currentCount,
  totalCount,
  sortBy,
  sortOrder,
  onSortByChange,
  onSortOrderChange,
}: ProblemTableHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {currentCount}
            </span>{' '}
            / {totalCount} bài tập
          </div>
          <SortControls
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortByChange={onSortByChange}
            onSortOrderChange={onSortOrderChange}
          />
        </div>
      </div>
    </div>
  );
}
