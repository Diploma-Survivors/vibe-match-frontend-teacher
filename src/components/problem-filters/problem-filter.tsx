'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TagsService } from '@/services/tags-service';
import { TopicsService } from '@/services/topics-service';
import type { ProblemFilters } from '@/types/problems';
import {
  ACCESS_RANGE_OPTIONS,
  DIFFICULTY_OPTIONS,
  TAG_OPTIONS,
} from '@/types/problems';
import type { Tag } from '@/types/tags';
import type { Topic } from '@/types/topics';
import { TOPIC_OPTIONS } from '@/types/topics';
import { Filter, RotateCcw, Search, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import DifficultyFilter from './difficulty-filter';
import TagFilter from './tag-filter';
import TopicFilter from './topic-filter';

interface ProblemFilterProps {
  keyWord: string;
  filters: ProblemFilters;
  onKeywordChange: (newKeyword: string) => void;
  onFiltersChange: (newFilters: ProblemFilters) => void;
  onSearch: () => void;
  onReset: () => void;
  isLoading: boolean;
}

export default function ProblemFilter({
  keyWord,
  filters,
  onKeywordChange,
  onFiltersChange,
  onSearch,
  onReset,
}: ProblemFilterProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [isLoadingTopics, setIsLoadingTopics] = useState(true);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Fetch tags and topics from backend
  const fetchTagsAndTopics = useCallback(async () => {
    setIsLoadingTags(true);
    setIsLoadingTopics(true);

    try {
      const [tagsResponse, topicsResponse] = await Promise.all([
        TagsService.getAllTags(),
        TopicsService.getAllTopics(),
      ]);
      setTags(tagsResponse.data.data);
      setTopics(topicsResponse.data.data);
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

  // Helper function to toggle items in array filters (topicIds, tagIds)
  const toggleArrayFilter = useCallback(
    (filterKey: 'topicIds' | 'tagIds', itemId: number, isSelected: boolean) => {
      const currentItems = filters[filterKey] || [];
      const newItems = isSelected
        ? currentItems.filter((id: number) => id !== itemId)
        : [...currentItems, itemId];

      onFiltersChange({ ...filters, [filterKey]: newItems });
    },
    [filters, onFiltersChange]
  );

  const toggleFilters = () => {
    console.log('Toggling filter visibility', !isFilterExpanded);
    setIsFilterExpanded(!isFilterExpanded);
  };

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600">
              <Search className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Bộ lọc tìm kiếm
            </h3>
          </div>

          {/* Mobile Filter Toggle Button */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFilters}
              className="xl:hidden text-green-600 dark:text-emerald-500 hover:text-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl transition-all duration-200"
            >
              {isFilterExpanded ? (
                <X className="w-4 h-4 mr-1" />
              ) : (
                <Filter className="w-4 h-4 mr-1" />
              )}
              {isFilterExpanded ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Đặt lại
            </Button>
          </div>
        </div>

        {/* Filter Fields - Hidden by default on mobile */}
        <div
          className={`space-y-4 xl:block ${
            isFilterExpanded ? 'block' : 'hidden'
          }`}
        >
          {' '}
          {/* Keyword */}
          <div className="space-y-2">
            <label
              htmlFor="problem-keyword"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Từ khóa:
            </label>
            <Input
              id="problem-keyword"
              placeholder="Nhập từ khóa..."
              value={keyWord || ''}
              onChange={(e) => onKeywordChange(e.target.value)}
              className="h-12 rounded-lg border-0 bg-slate-50 dark:bg-slate-700/50 focus-visible:ring-2 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500"
            />
          </div>
          {/* Difficulty Filter */}
          <DifficultyFilter
            selectedDifficulty={filters.difficulty}
            onDifficultyChange={(difficulty) =>
              onFiltersChange({ ...filters, difficulty })
            }
          />
          {/* Topic Filter */}
          <TopicFilter
            topics={topics}
            selectedTopicIds={filters.topicIds || []}
            isLoading={isLoadingTopics}
            onTopicToggle={(topicId, isSelected) =>
              toggleArrayFilter('topicIds', topicId, isSelected)
            }
            onClearAll={() => onFiltersChange({ ...filters, topicIds: [] })}
            displayLimit={3}
          />
          {/* Tag Filter */}
          <TagFilter
            tags={tags}
            selectedTagIds={filters.tagIds || []}
            isLoading={isLoadingTags}
            onTagToggle={(tagId, isSelected) =>
              toggleArrayFilter('tagIds', tagId, isSelected)
            }
            onClearAll={() => onFiltersChange({ ...filters, tagIds: [] })}
            displayLimit={3}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="border-t border-slate-200 dark:border-slate-700">
        <Button
          onClick={onSearch}
          className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <Search className="w-5 h-5 mr-2" />
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
}
