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
import type { ProblemFilters } from '@/types/problems';
import {
  ACCESS_RANGE_OPTIONS,
  DIFFICULTY_OPTIONS,
  TAG_OPTIONS,
} from '@/types/problems';
import { TOPIC_OPTIONS } from '@/types/topics';
import { Filter, RotateCcw, Search, X } from 'lucide-react';
import React, { useState } from 'react';

interface ProblemFilterProps {
  filters: ProblemFilters;
  onFiltersChange: (filters: ProblemFilters) => void;
  onSearch: () => void;
  onReset: () => void;
}

export default function ProblemFilter({
  filters,
  onFiltersChange,
  onSearch,
  onReset,
}: ProblemFilterProps) {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const handleFilterChange = (
    key: keyof ProblemFilters,
    value: string | string[]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

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
          className={`space-y-4 xl:block ${isFilterExpanded ? 'block' : 'hidden'}`}
        >
          {' '}
          {/* Mã bài */}
          <div className="space-y-2">
            <label
              htmlFor="problem-id"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Mã bài:
            </label>
            <Input
              id="problem-id"
              placeholder="Nhập mã bài..."
              value={filters.id || ''}
              onChange={(e) => handleFilterChange('id', e.target.value)}
              className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500 transition-all duration-200"
            />
          </div>
          {/* Tên bài */}
          <div className="space-y-2">
            <label
              htmlFor="problem-title"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Tên bài:
            </label>
            <Input
              id="problem-title"
              placeholder="Nhập tên bài..."
              value={filters.title || ''}
              onChange={(e) => handleFilterChange('title', e.target.value)}
              className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500 transition-all duration-200"
            />
          </div>
          {/* Mức độ */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Mức độ:
            </label>
            <Select
              value={filters.difficulty || 'all'}
              onValueChange={(value) =>
                handleFilterChange('difficulty', value === 'all' ? '' : value)
              }
            >
              <SelectTrigger className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500 transition-all duration-200">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-xl">
                {DIFFICULTY_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="rounded-lg"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Dạng bài */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Topic:
            </label>
            <Select
              value={filters.topic || 'all'}
              onValueChange={(value) =>
                handleFilterChange('topic', value === 'all' ? '' : value)
              }
            >
              <SelectTrigger className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500 transition-all duration-200">
                <SelectValue placeholder="Tham lam" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-xl">
                {TOPIC_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="rounded-lg"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Lựa chọn tag */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Lựa chọn tag:
            </label>
            <Select>
              <SelectTrigger className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500 transition-all duration-200">
                <SelectValue
                  placeholder={
                    filters.tags && filters.tags.length > 0
                      ? `${filters.tags.length} tag được chọn`
                      : 'Chọn tag...'
                  }
                />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-xl">
                {TAG_OPTIONS.filter((option) => option.value !== 'all').map(
                  (option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        const currentTags = filters.tags || [];
                        const isSelected = currentTags.includes(option.value);

                        if (isSelected) {
                          // Remove from selection
                          const newTags = currentTags.filter(
                            (t) => t !== option.value
                          );
                          handleFilterChange('tags', newTags);
                        } else {
                          // Add to selection
                          const newTags = [...currentTags, option.value];
                          handleFilterChange('tags', newTags);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          const currentTags = filters.tags || [];
                          const isSelected = currentTags.includes(option.value);

                          if (isSelected) {
                            // Remove from selection
                            const newTags = currentTags.filter(
                              (t) => t !== option.value
                            );
                            handleFilterChange('tags', newTags);
                          } else {
                            // Add to selection
                            const newTags = [...currentTags, option.value];
                            handleFilterChange('tags', newTags);
                          }
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-pressed={
                        filters.tags?.includes(option.value) || false
                      }
                    >
                      <input
                        type="checkbox"
                        checked={filters.tags?.includes(option.value) || false}
                        onChange={() => {}} // Handled by parent div onClick
                        className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                      />
                      <span className="text-sm">{option.label}</span>
                    </div>
                  )
                )}
                {filters.tags && filters.tags.length > 0 && (
                  <div className="border-t border-slate-200 dark:border-slate-700 mt-2 pt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleFilterChange('tags', []);
                      }}
                      className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      Xóa tất cả
                    </button>
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
          {/* Phạm vi truy cập */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Phạm vi truy cập:
            </label>
            <Select
              value={filters.accessRange || 'all'}
              onValueChange={(value) =>
                handleFilterChange('accessRange', value === 'all' ? '' : value)
              }
            >
              <SelectTrigger className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500 transition-all duration-200">
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-xl">
                {ACCESS_RANGE_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="rounded-lg"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
          <Button
            onClick={onSearch}
            className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Search className="w-5 h-5 mr-2" />
            Tìm kiếm
          </Button>
        </div>
      </div>
    </div>
  );
}
