import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TagsService } from '@/services/tags-service';
import { TopicsService } from '@/services/topics-service';
import {
  type ProblemFilters,
  SortBy,
  SortOrder,
  DIFFICULTY_OPTIONS,
} from '@/types/problems';
import type { Tag } from '@/types/tags';
import type { Topic } from '@/types/topics';
import {
  ChevronDown,
  RotateCcw,
  Search,
  ArrowDown,
  ArrowUp,
  Check,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface ProblemFilterProps {
  keyWord: string;
  filters: ProblemFilters;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onKeywordChange: (newKeyword: string) => void;
  onFiltersChange: (newFilters: ProblemFilters) => void;
  onSortByChange: (newSortBy: SortBy) => void;
  onSortOrderChange: (newSortOrder: SortOrder) => void;
  onSearch: () => void;
  onReset: () => void;
  isLoading: boolean;
}

export default function ProblemFilter({
  keyWord,
  filters,
  sortBy,
  sortOrder,
  onKeywordChange,
  onFiltersChange,
  onSortByChange,
  onSortOrderChange,
  onSearch,
  onReset,
}: ProblemFilterProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);

  // Search states for dropdowns
  const [topicSearch, setTopicSearch] = useState('');
  const [tagSearch, setTagSearch] = useState('');

  // Fetch tags and topics from backend
  const fetchTagsAndTopics = useCallback(async () => {
    setIsLoadingTags(true);
    setIsLoadingTopics(true);

    try {
      // Mocking API calls
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockTags: Tag[] = [
        { id: 1, name: 'Array', slug: 'array', color: 'blue', type: 'default', description: '', createdAt: '', updatedAt: '' },
        { id: 2, name: 'String', slug: 'string', color: 'green', type: 'default', description: '', createdAt: '', updatedAt: '' },
        { id: 3, name: 'Dynamic Programming', slug: 'dp', color: 'red', type: 'default', description: '', createdAt: '', updatedAt: '' },
        { id: 4, name: 'Graph', slug: 'graph', color: 'purple', type: 'default', description: '', createdAt: '', updatedAt: '' },
        { id: 5, name: 'Tree', slug: 'tree', color: 'yellow', type: 'default', description: '', createdAt: '', updatedAt: '' },
        { id: 6, name: 'Sorting', slug: 'sorting', color: 'orange', type: 'default', description: '', createdAt: '', updatedAt: '' },
      ];

      const mockTopics: Topic[] = [
        { id: 1, name: 'Algorithms', slug: 'algorithms', description: 'Algorithmic problems', iconUrl: '', orderIndex: 1, isActive: true, createdAt: '', updatedAt: '' },
        { id: 2, name: 'Data Structures', slug: 'data-structures', description: 'Data structure problems', iconUrl: '', orderIndex: 2, isActive: true, createdAt: '', updatedAt: '' },
        { id: 3, name: 'Database', slug: 'database', description: 'SQL and NoSQL problems', iconUrl: '', orderIndex: 3, isActive: true, createdAt: '', updatedAt: '' },
        { id: 4, name: 'Artificial Intelligence', slug: 'ai', description: 'AI related problems', iconUrl: '', orderIndex: 4, isActive: true, createdAt: '', updatedAt: '' },
      ];

      setTags(mockTags);
      setTopics(mockTopics);
    } catch (error) {
      setTags([]);
      setTopics([]);
    } finally {
      setIsLoadingTags(false);
      setIsLoadingTopics(false);
    }
  }, []);

  useEffect(() => {
    fetchTagsAndTopics();
  }, [fetchTagsAndTopics]);

  // Helper to handle multi-select changes
  const handleMultiSelectChange = (
    key: 'difficulty' | 'topicIds' | 'tagIds',
    value: any
  ) => {
    const currentValues = (filters[key] as any[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v: any) => v !== value)
      : [...currentValues, value];

    onFiltersChange({ ...filters, [key]: newValues });
  };

  const handleStatusChange = (value: string) => {
    const isActive = value === 'active' ? true : value === 'inactive' ? false : undefined;
    onFiltersChange({ ...filters, isActive });
  };

  // Filtered lists based on search
  const filteredTopics = topics.filter(topic =>
    topic.name.toLowerCase().includes(topicSearch.toLowerCase())
  );

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div className="space-y-4 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
      {/* Row 1: Search & Sort */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Find ..."
            value={keyWord}
            onChange={(e) => onKeywordChange(e.target.value)}
            className="pl-10 h-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div className="flex items-center gap-2">
          <div>Sort by:</div>
          <Select
            value={sortBy}
            onValueChange={(value) => onSortByChange(value as SortBy)}
          >
            <SelectTrigger className="w-[180px] h-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-0 focus:ring-offset-0 cursor-pointer">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SortBy.ID} className="cursor-pointer">ID</SelectItem>
              <SelectItem value={SortBy.DIFFICULTY} className="cursor-pointer">Difficulty</SelectItem>
              <SelectItem value={SortBy.ACCEPTANCE_RATE} className="cursor-pointer">Acceptance</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              onSortOrderChange(
                sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC
              )
            }
            className="h-10 w-10 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
          >
            {sortOrder === SortOrder.ASC ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Row 2: Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Difficulty Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-10 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
            >
              Difficulty
              {filters.difficulty && filters.difficulty.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                  {filters.difficulty.length}
                </Badge>
              )}
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Select Difficulty</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {DIFFICULTY_OPTIONS.map((option) => {
              const isChecked = filters.difficulty?.includes(option.value as any);
              return (
                <div
                  key={option.value}
                  className="flex items-center px-2 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMultiSelectChange('difficulty', option.value as any);
                  }}
                >
                  <div className={`flex items-center justify-center w-4 h-4 mr-2 border rounded ${isChecked ? 'bg-primary border-primary text-primary-foreground' : 'border-slate-300'}`}>
                    {isChecked && <Check className="h-3 w-3" />}
                  </div>
                  <span className="text-sm">{option.label}</span>
                </div>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Filter */}
        <Select
          value={
            filters.isActive === true
              ? 'active'
              : filters.isActive === false
                ? 'inactive'
                : 'all'
          }
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[150px] h-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-0 focus:ring-offset-0 cursor-pointer">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">All Status</SelectItem>
            <SelectItem value="active" className="cursor-pointer">Active</SelectItem>
            <SelectItem value="inactive" className="cursor-pointer">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* Topics Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-10 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
            >
              Topics
              {filters.topicIds && filters.topicIds.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                  {filters.topicIds.length}
                </Badge>
              )}
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 max-h-80 overflow-y-auto">
            <div className="p-2 sticky top-0 bg-white dark:bg-slate-950 z-10">
              <Input
                placeholder="Search topics..."
                value={topicSearch}
                onChange={(e) => setTopicSearch(e.target.value)}
                className="h-8 text-xs focus-visible:ring-0"
              />
            </div>
            <DropdownMenuSeparator />
            {isLoadingTopics ? (
              <div className="p-2 text-sm text-slate-500">Loading...</div>
            ) : filteredTopics.length === 0 ? (
              <div className="p-2 text-sm text-slate-500">No topics found</div>
            ) : (
              filteredTopics.map((topic) => {
                const isChecked = filters.topicIds?.includes(topic.id);
                return (
                  <div
                    key={topic.id}
                    className="flex items-center px-2 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleMultiSelectChange('topicIds', topic.id);
                    }}
                  >
                    <div className={`flex items-center justify-center w-4 h-4 mr-2 border rounded ${isChecked ? 'bg-green-700 border-green-700 text-white' : 'border-slate-300'}`}>
                      {isChecked && <Check className="h-3 w-3" />}
                    </div>
                    <span className="text-sm">{topic.name}</span>
                  </div>
                );
              })
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Tags Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-10 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
            >
              Tags
              {filters.tagIds && filters.tagIds.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                  {filters.tagIds.length}
                </Badge>
              )}
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 max-h-80 overflow-y-auto">
            <div className="p-2 sticky top-0 bg-white dark:bg-slate-950 z-10">
              <Input
                placeholder="Search tags..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                className="h-8 text-xs focus-visible:ring-0"
              />
            </div>
            <DropdownMenuSeparator />
            {isLoadingTags ? (
              <div className="p-2 text-sm text-slate-500">Loading...</div>
            ) : filteredTags.length === 0 ? (
              <div className="p-2 text-sm text-slate-500">No tags found</div>
            ) : (
              filteredTags.map((tag) => {
                const isChecked = filters.tagIds?.includes(tag.id);
                return (
                  <div
                    key={tag.id}
                    className="flex items-center px-2 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleMultiSelectChange('tagIds', tag.id);
                    }}
                  >
                    <div className={`flex items-center justify-center w-4 h-4 mr-2 border rounded ${isChecked ? 'bg-green-700 border-green-700 text-white' : 'border-slate-300'}`}>
                      {isChecked && <Check className="h-3 w-3" />}
                    </div>
                    <span className="text-sm">{tag.name}</span>
                  </div>
                );
              })
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Reset Button */}
        <Button
          variant="ghost"
          onClick={onReset}
          className="h-10 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
}
