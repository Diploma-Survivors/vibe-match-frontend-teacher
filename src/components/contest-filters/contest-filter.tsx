'use client';

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
import {
    type ContestFilters,
    ContestSortBy,
    ContestStatus,
    CONTEST_STATUS_LABELS,
} from '@/types/contest';
import { SortOrder } from '@/types/problems';
import {
    ArrowDown,
    ArrowUp,
    Check,
    ChevronDown,
    RotateCcw,
    Search,
    Calendar,
} from 'lucide-react';
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

interface ContestFilterProps {
    keyword: string;
    filters: ContestFilters;
    sortBy: ContestSortBy;
    sortOrder: SortOrder;
    onKeywordChange: (newKeyword: string) => void;
    onFiltersChange: (newFilters: ContestFilters) => void;
    onSortByChange: (newSortBy: ContestSortBy) => void;
    onSortOrderChange: (newSortOrder: SortOrder) => void;
    onSearch: () => void;
    onReset: () => void;
    isLoading: boolean;
}

export default function ContestFilter({
    keyword,
    filters,
    sortBy,
    sortOrder,
    onKeywordChange,
    onFiltersChange,
    onSortByChange,
    onSortOrderChange,
    onSearch,
    onReset,
}: ContestFilterProps) {
    const handleStatusChange = (status: ContestStatus) => {
        const currentStatuses = filters.statuses || [];
        const newStatuses = currentStatuses.includes(status)
            ? currentStatuses.filter((s) => s !== status)
            : [...currentStatuses, status];

        onFiltersChange({ ...filters, statuses: newStatuses });
    };

    const handleDateChange = (type: 'from' | 'to', value: string) => {
        const currentRange = filters.startTimeRange || {};
        const newRange = { ...currentRange, [type]: value };
        // If value is empty, remove the key
        if (!value) {
            delete newRange[type];
        }

        // If both empty, remove the range object
        if (!newRange.from && !newRange.to) {
            const { startTimeRange, ...rest } = filters;
            onFiltersChange(rest);
        } else {
            onFiltersChange({ ...filters, startTimeRange: newRange });
        }
    };

    return (
        <div className="space-y-4 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            {/* Row 1: Search & Sort */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search contests..."
                        value={keyword}
                        onChange={(e) => onKeywordChange(e.target.value)}
                        className="pl-10 h-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-slate-500">Sort by:</div>
                    <Select
                        value={sortBy}
                        onValueChange={(value) => onSortByChange(value as ContestSortBy)}
                    >
                        <SelectTrigger className="w-[180px] h-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-0 focus:ring-offset-0 cursor-pointer">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ContestSortBy.ID} className="cursor-pointer">ID</SelectItem>
                            <SelectItem value={ContestSortBy.START_TIME} className="cursor-pointer">Start Time</SelectItem>
                            <SelectItem value={ContestSortBy.DURATION} className="cursor-pointer">Duration</SelectItem>
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
                {/* Status Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="h-10 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
                        >
                            Status
                            {filters.statuses && filters.statuses.length > 0 && (
                                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                                    {filters.statuses.length}
                                </Badge>
                            )}
                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuLabel>Select Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {Object.values(ContestStatus).map((status) => {
                            const isChecked = filters.statuses?.includes(status);
                            return (
                                <div
                                    key={status}
                                    className="flex items-center px-2 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleStatusChange(status);
                                    }}
                                >
                                    <div className={`flex items-center justify-center w-4 h-4 mr-2 border rounded ${isChecked ? 'bg-primary border-primary text-primary-foreground' : 'border-slate-300'}`}>
                                        {isChecked && <Check className="h-3 w-3" />}
                                    </div>
                                    <span className="text-sm">{CONTEST_STATUS_LABELS[status]}</span>
                                </div>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Start Time Range Filter */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="h-10 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
                        >
                            <Calendar className="mr-2 h-4 w-4 opacity-50" />
                            Start Time
                            {(filters.startTimeRange?.from || filters.startTimeRange?.to) && (
                                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                                    Active
                                </Badge>
                            )}
                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4" align="start">
                        <div className="space-y-4">
                            <h4 className="font-medium leading-none">Date Range</h4>
                            <div className="grid gap-2">
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="from">From</Label>
                                    <Input
                                        id="from"
                                        type="date"
                                        className="col-span-2 h-8"
                                        value={filters.startTimeRange?.from || ''}
                                        onChange={(e) => handleDateChange('from', e.target.value)}
                                    />
                                </div>
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="to">To</Label>
                                    <Input
                                        id="to"
                                        type="date"
                                        className="col-span-2 h-8"
                                        value={filters.startTimeRange?.to || ''}
                                        onChange={(e) => handleDateChange('to', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

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
