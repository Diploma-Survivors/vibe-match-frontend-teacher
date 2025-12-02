import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StandingPaginationProps {
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onLoadNext: () => void;
  onLoadPrevious: () => void;
}

export function StandingPagination({
  totalCount,
  hasNextPage,
  hasPreviousPage,
  onLoadNext,
  onLoadPrevious,
}: StandingPaginationProps) {
  if (!hasNextPage && !hasPreviousPage) {
    return null;
  }

  return (
    <div className="flex items-center justify-between p-4 border-t border-gray-300">
      <div className="text-sm text-gray-600">Tổng: {totalCount} thí sinh</div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onLoadPrevious}
          disabled={!hasPreviousPage}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Trước
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onLoadNext}
          disabled={!hasNextPage}
        >
          Sau
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
