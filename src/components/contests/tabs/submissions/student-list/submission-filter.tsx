import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import { useState } from 'react';

type SubmissionFilterProps = {
  onSearch: (keyword: string) => void;
  onSortChange: (order: 'asc' | 'desc') => void;
  sortOrder: 'asc' | 'desc';
  searchKeyword: string;
};

export function SubmissionFilter({
  onSearch,
  onSortChange,
  sortOrder,
  searchKeyword,
}: SubmissionFilterProps) {
  const [keyword, setKeyword] = useState(searchKeyword);

  const handleSearch = () => {
    onSearch(keyword);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleSort = () => {
    onSortChange(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="flex gap-2 p-4 bg-white">
      <div className="flex gap-2">
        <div className="relative w-80">
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên sinh viên..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>
        <Button onClick={handleSearch} variant="default">
          Tìm kiếm
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-base font-bold text-gray-900">Sắp xếp:</span>
        <button
          type="button"
          onClick={toggleSort}
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
