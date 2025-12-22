import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ProblemTable, { ProblemTableMode } from '@/components/problem-table';
import ProblemFilter from '@/components/problem-filters/problem-filter';
import useProblems from '@/hooks/use-problems';
import {
  type Problem,
  ProblemDifficulty,
  SortBy,
  SortOrder,
} from '@/types/problems';
import { Plus } from 'lucide-react';

interface RelatedProblemsModalProps {
  selectedProblemIds: number[];
  onProblemsSelect: (problems: Problem[]) => void;
}

export function RelatedProblemsModal({
  selectedProblemIds,
  onProblemsSelect,
}: RelatedProblemsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localSelectedIds, setLocalSelectedIds] = useState<Set<number>>(
    new Set(selectedProblemIds)
  );

  // Sync with props when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSelectedIds(new Set(selectedProblemIds));
    }
  }, [isOpen, selectedProblemIds]);

  const {
    problems,
    isLoading,
    meta,
    filters,
    handleFiltersChange,
    sortBy,
    handleSortByChange,
    sortOrder,
    handleSortOrderChange,
    handlePageChange,
    totalCount,
    keyword,
    handleKeywordChange,
    handleSearch,
    handleReset,
  } = useProblems(
    'selectable-for-contest' as any // Using 'any' to bypass enum check if needed, or import enum
  );

  const handleMultipleProblemsSelect = (selectedProblems: Problem[]) => {
    onProblemsSelect(selectedProblems);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-slate-500 font-normal"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add related problems...
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Related Problems</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          <ProblemFilter
            keyWord={keyword}
            onKeywordChange={handleKeywordChange}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            sortBy={sortBy}
            onSortByChange={handleSortByChange}
            sortOrder={sortOrder}
            onSortOrderChange={handleSortOrderChange}
            onSearch={handleSearch}
            onReset={handleReset}
            isLoading={isLoading}
          />

          <ProblemTable
            problems={problems}
            meta={meta}
            totalCount={totalCount}
            onPageChange={handlePageChange}
            isLoading={isLoading}
            mode={ProblemTableMode.MULTIPLE_SELECT}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortByChange={handleSortByChange}
            onSortOrderChange={handleSortOrderChange}
            initialSelectedProblemIds={localSelectedIds}
            onMultipleProblemsSelect={handleMultipleProblemsSelect}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
