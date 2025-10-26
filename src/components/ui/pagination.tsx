import { Button } from '../ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxPageButtons?: number; // optional, default 5
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxPageButtons = 5,
}: PaginationProps) {
  if (totalPages === 0) return null;

  const pages: number[] = [];

  if (totalPages <= maxPageButtons) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else if (currentPage <= Math.floor(maxPageButtons / 2) + 1) {
    for (let i = 1; i <= maxPageButtons; i++) pages.push(i);
  } else if (currentPage >= totalPages - Math.floor(maxPageButtons / 2)) {
    for (let i = totalPages - maxPageButtons + 1; i <= totalPages; i++)
      pages.push(i);
  } else {
    const start = currentPage - Math.floor(maxPageButtons / 2);
    const end = start + maxPageButtons - 1;
    for (let i = start; i <= end; i++) pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 px-3 text-xs"
      >
        Trước
      </Button>

      {pages.map((page) => (
        <Button
          type="button"
          key={page}
          variant={currentPage === page ? 'default' : 'outline'}
          size="sm"
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 p-0 text-xs ${
            currentPage === page
              ? 'bg-green-600 text-white'
              : 'border-slate-300 dark:border-slate-600'
          }`}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 px-3 text-xs"
      >
        Sau
      </Button>
    </div>
  );
}
