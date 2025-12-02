'use client';

import { Input } from '@/components/ui/input';
import { ArrowDown, ArrowUp, Search, X } from 'lucide-react';
import { useState } from 'react';

interface StandingFilterProps {
  onFilterChange: (filters: {
    name: string;
    sortOrder: 'asc' | 'desc';
  }) => void;
  initialName?: string;
  initialSortOrder?: 'asc' | 'desc';
}

export function StandingFilter({
  onFilterChange,
  initialName = '',
  initialSortOrder = 'asc',
}: StandingFilterProps) {
  const [name, setName] = useState(initialName);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder);

  const handleSearch = () => {
    onFilterChange({ name, sortOrder });
  };

  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handleSortOrderChange = (value: string) => {
    const order = value as 'asc' | 'desc';
    setSortOrder(order);
    onFilterChange({ name, sortOrder: order });
  };

  const handleClearFilters = () => {
    setName('');
    setSortOrder('asc');
    onFilterChange({ name: '', sortOrder: 'asc' });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="mb-4 p-2 bg-transparent">
      <div className="flex items-center gap-3 w-fit">
        {/* Title */}
        <span className="text-base font-bold text-gray-900">Lọc:</span>

        {/* Search by username */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Tìm kiếm tên..."
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 pr-8 h-10 text-sm w-72 rounded-lg border border-gray-300"
            />
            {name && (
              <button
                type="button"
                onClick={() => handleNameChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Button */}
          <button
            type="button"
            onClick={handleSearch}
            className="px-4 py-2 h-10 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium whitespace-nowrap"
          >
            Tìm kiếm
          </button>
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
      </div>
    </div>
  );
}
