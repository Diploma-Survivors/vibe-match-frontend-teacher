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
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SubmissionFilters,
    SubmissionSortBy,
    SubmissionStatus,
} from '@/types/submissions';
import { ProgrammingLanguage } from '@/types/languages';
import {
    ChevronDown,
    RotateCcw,
    Search,
    Check,
    Loader2,
    ArrowDown,
    ArrowUp,
} from 'lucide-react';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import useProblems from '@/hooks/use-problems';
import { ProblemEndpointType, Problem, SortOrder } from '@/types/problems';

interface SubmissionFilterProps {
    filters: SubmissionFilters;
    onFiltersChange: (newFilters: SubmissionFilters) => void;
    onReset: () => void;
    isLoading: boolean;
    languages: ProgrammingLanguage[];
}

const RUNTIME_ERROR_STATUSES = [
    SubmissionStatus.RUNTIME_ERROR,
    SubmissionStatus.SIGSEGV,
    SubmissionStatus.SIGXFSZ,
    SubmissionStatus.SIGFPE,
    SubmissionStatus.SIGABRT,
    SubmissionStatus.NZEC,
];

export default function SubmissionFilter({
    filters,
    onFiltersChange,
    onReset,
    languages,
    sortBy,
    onSortByChange,
    sortOrder,
    onSortOrderChange,
}: SubmissionFilterProps & {
    sortBy: SubmissionSortBy;
    onSortByChange: (sortBy: SubmissionSortBy) => void;
    sortOrder: 'asc' | 'desc';
    onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
}) {
    // Problem Filter State
    const [problemSearch, setProblemSearch] = useState('');
    const [accumulatedProblems, setAccumulatedProblems] = useState<Problem[]>([]);
    const [isProblemDropdownOpen, setIsProblemDropdownOpen] = useState(false);
    const observerTarget = useRef<HTMLDivElement>(null);

    // Main Search State (debounced)
    const [searchValue, setSearchValue] = useState(filters.search || '');

    const {
        problems,
        meta: problemsMeta,
        isLoading: isProblemsLoading,
        handleKeywordChange: handleProblemKeywordChange,
        handlePageChange: handleProblemPageChange,
    } = useProblems(ProblemEndpointType.PROBLEM_MANAGEMENT);

    // Sync accumulated problems with fetched problems
    useEffect(() => {
        if (problemsMeta?.page === 1) {
            setAccumulatedProblems(problems);
        } else if (problems.length > 0) {
            setAccumulatedProblems((prev) => {
                const newProblems = problems.filter(
                    (p) => !prev.some((existing) => existing.id === p.id)
                );
                return [...prev, ...newProblems];
            });
        }
    }, [problems, problemsMeta?.page]);

    // Handle problem search
    useEffect(() => {
        handleProblemKeywordChange(problemSearch);
    }, [problemSearch, handleProblemKeywordChange]);

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && problemsMeta?.hasNextPage && !isProblemsLoading) {
                    handleProblemPageChange((problemsMeta.page || 1) + 1);
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [problemsMeta?.hasNextPage, isProblemsLoading, handleProblemPageChange, problemsMeta?.page]);

    // Language Filter
    const [languageSearch, setLanguageSearch] = useState('');
    const filteredLanguages = languages.filter((lang) =>
        lang.name.toLowerCase().includes(languageSearch.toLowerCase())
    );

    // Status Filter Logic
    const handleStatusChange = (status: SubmissionStatus) => {
        if (status === SubmissionStatus.RUNTIME_ERROR) {
            onFiltersChange({ ...filters, status: SubmissionStatus.RUNTIME_ERROR });
        } else {
            onFiltersChange({ ...filters, status });
        }
    };

    const handleProblemToggle = (problemId: number) => {
        const currentIds = filters.problemIds || [];
        const newIds = currentIds.includes(problemId)
            ? currentIds.filter((id) => id !== problemId)
            : [...currentIds, problemId];
        onFiltersChange({ ...filters, problemIds: newIds.length > 0 ? newIds : undefined });
    };

    const handleLanguageToggle = (languageId: number) => {
        const currentIds = filters.languageIds || [];
        const newIds = currentIds.includes(languageId)
            ? currentIds.filter((id) => id !== languageId)
            : [...currentIds, languageId];
        onFiltersChange({ ...filters, languageIds: newIds.length > 0 ? newIds : undefined });
    };

    const selectedProblemsCount = filters.problemIds?.length || 0;
    const selectedLanguagesCount = filters.languageIds?.length || 0;

    // Debounce main search
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentSearch = filters.search || '';
            if (searchValue !== currentSearch) {
                onFiltersChange({ ...filters, search: searchValue || undefined });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchValue, filters, onFiltersChange]);

    // Sync local search state with filters prop (e.g. on reset)
    useEffect(() => {
        if (filters.search !== searchValue) {
            setSearchValue(filters.search || '');
        }
    }, [filters.search]);

    return (
        <div className="space-y-4 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            {/* Top Row: Search and Sort */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Find ..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus-visible:ring-0"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <span className="text-sm text-slate-500 whitespace-nowrap">Sort by:</span>
                    <Select value={sortBy} onValueChange={(value) => onSortByChange(value as SubmissionSortBy)}>
                        <SelectTrigger className="w-[140px] bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-0">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={SubmissionSortBy.ID}>ID</SelectItem>
                            <SelectItem value={SubmissionSortBy.SUBMITTED_AT}>Submitted At</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="shrink-0 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                    >
                        {sortOrder === 'asc' ? (
                            <ArrowDown className="h-4 w-4" />
                        ) : (
                            <ArrowUp className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>

            {/* Bottom Row: Filters */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Problem Filter */}
                <DropdownMenu open={isProblemDropdownOpen} onOpenChange={setIsProblemDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="h-10 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer min-w-[150px] justify-between"
                        >
                            Problems
                            {selectedProblemsCount > 0 && (
                                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                                    {selectedProblemsCount}
                                </Badge>
                            )}
                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-80 max-h-80 overflow-y-auto">
                        <div className="p-2 sticky top-0 bg-white dark:bg-slate-950 z-10">
                            <Input
                                placeholder="Search problems..."
                                value={problemSearch}
                                onChange={(e) => setProblemSearch(e.target.value)}
                                className="h-8 text-xs focus-visible:ring-0"
                            />
                        </div>
                        <DropdownMenuSeparator />
                        {accumulatedProblems.length === 0 && !isProblemsLoading ? (
                            <div className="p-2 text-sm text-slate-500">No problems found</div>
                        ) : (
                            accumulatedProblems.map((problem) => (
                                <div
                                    key={problem.id}
                                    className="flex items-center px-2 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleProblemToggle(problem.id);
                                    }}
                                >
                                    <div className={`flex items-center justify-center w-4 h-4 mr-2 border rounded ${filters.problemIds?.includes(problem.id) ? 'bg-green-700 border-green-700 text-white' : 'border-slate-300'}`}>
                                        {filters.problemIds?.includes(problem.id) && <Check className="h-3 w-3" />}
                                    </div>
                                    <span className="text-sm truncate">{problem.title}</span>
                                </div>
                            ))
                        )}
                        {isProblemsLoading && (
                            <div className="flex justify-center p-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                        )}
                        <div ref={observerTarget} className="h-1" />
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Language Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="h-10 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer min-w-[150px] justify-between"
                        >
                            Languages
                            {selectedLanguagesCount > 0 && (
                                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                                    {selectedLanguagesCount}
                                </Badge>
                            )}
                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64 max-h-80 overflow-y-auto">
                        <div className="p-2 sticky top-0 bg-white dark:bg-slate-950 z-10">
                            <Input
                                placeholder="Search languages..."
                                value={languageSearch}
                                onChange={(e) => setLanguageSearch(e.target.value)}
                                className="h-8 text-xs focus-visible:ring-0"
                            />
                        </div>
                        <DropdownMenuSeparator />
                        {filteredLanguages.length === 0 ? (
                            <div className="p-2 text-sm text-slate-500">No languages found</div>
                        ) : (
                            filteredLanguages.map((lang) => (
                                <div
                                    key={lang.id}
                                    className="flex items-center px-2 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleLanguageToggle(lang.id);
                                    }}
                                >
                                    <div className={`flex items-center justify-center w-4 h-4 mr-2 border rounded ${filters.languageIds?.includes(lang.id) ? 'bg-green-700 border-green-700 text-white' : 'border-slate-300'}`}>
                                        {filters.languageIds?.includes(lang.id) && <Check className="h-3 w-3" />}
                                    </div>
                                    <span className="text-sm">{lang.name}</span>
                                </div>
                            ))
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Status Filter */}
                <Select
                    value={filters.status || 'all'}
                    onValueChange={(value) => {
                        if (value === 'all') {
                            const { status, ...rest } = filters;
                            onFiltersChange(rest);
                        } else {
                            handleStatusChange(value as SubmissionStatus);
                        }
                    }}
                >
                    <SelectTrigger className="w-[180px] h-10 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-0 focus:ring-offset-0 cursor-pointer">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all" className="cursor-pointer">All Statuses</SelectItem>
                        {Object.values(SubmissionStatus)
                            .filter(status => !RUNTIME_ERROR_STATUSES.includes(status) || status === SubmissionStatus.RUNTIME_ERROR)
                            .map((status) => (
                                <SelectItem key={status} value={status} className="cursor-pointer">
                                    {status}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>

                {/* Reset Button */}
                <Button
                    variant="ghost"
                    onClick={() => {
                        setProblemSearch('');
                        setLanguageSearch('');
                        setSearchValue('');
                        onReset();
                    }}
                    className="h-10 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
                >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                </Button>
            </div>
        </div>
    );
}
