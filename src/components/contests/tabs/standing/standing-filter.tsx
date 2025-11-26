'use client';

import { Input } from '@/components/ui/input';
import { ArrowDown, ArrowUp, Search, X } from 'lucide-react';
import { useState } from 'react';

interface StandingFilterProps {
  onFilterChange: (filters: {
    keyword: string;
    sortOrder: 'asc' | 'desc';
  }) => void;
}

export function StandingFilter({ onFilterChange }: StandingFilterProps) {
  const [keyword, setKeyword] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    onFilterChange({ keyword: value, sortOrder });
  };

  const handleSortOrderChange = (value: string) => {
    const order = value as 'asc' | 'desc';
    setSortOrder(order);
    onFilterChange({ keyword, sortOrder: order });
  };

  const handleClearFilters = () => {
    setKeyword('');
    setSortOrder('asc');
    onFilterChange({ keyword: '', sortOrder: 'asc' });
  };

  return (
    <div className="mb-4 p-2 bg-transparent">
      <div className="flex items-center gap-3 w-fit">
        {/* Title */}
        <span className="text-base font-bold text-gray-900">Lọc:</span>

        {/* Search by username */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Tìm kiếm tên truy cập..."
            value={keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            className="pl-10 pr-8 h-10 text-sm w-72 rounded-lg border border-gray-300"
          />
          {keyword && (
            <button
              type="button"
              onClick={() => handleKeywordChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort order - Title and Arrow button */}
        <span className="text-base font-bold text-gray-900">Sắp xếp:</span>
        <button
          type="button"
          onClick={() =>
            handleSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')
          }
          className="p-2.5 text-white bg-black hover:bg-gray-800 rounded-lg transition-colors font-semibold shadow-md"
          title={sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
        >
          {sortOrder === 'asc' ? (
            <ArrowUp className="w-5 h-5" />
          ) : (
            <ArrowDown className="w-5 h-5" />
          )}
        </button>

        {/* Clear filters button */}
        {keyword && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors whitespace-nowrap h-10 font-medium"
          >
            Xóa
          </button>
        )}
      </div>
    </div>
  );
}
