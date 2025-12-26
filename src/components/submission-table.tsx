'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
    Submission,
    SubmissionMeta,
    SubmissionSortBy,
    SubmissionStatus,
} from '@/types/submissions';
import { ProgrammingLanguage } from '@/types/languages';
import {
    MoreHorizontal,
    Eye,
    Trash2,
    Clock,
    Cpu,
    ArrowUpDown,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { DataTablePagination } from './ui/data-table-pagination';
import { getLanguageName, getStatusColor, getStatusLabel } from '@/services/submissions-service';

interface SubmissionTableProps {
    submissions: Submission[];
    meta: SubmissionMeta | null;
    isLoading: boolean;
    onPageChange: (page: number) => void;
    sortBy: SubmissionSortBy;
    sortOrder: 'asc' | 'desc';
    onSortByChange: (sortBy: SubmissionSortBy) => void;
    onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
    languages: ProgrammingLanguage[];
}

export default function SubmissionTable({
    submissions,
    meta,
    isLoading,
    onPageChange,
    sortBy,
    sortOrder,
    onSortByChange,
    onSortOrderChange,
    languages,
}: SubmissionTableProps) {
    const handleSort = (column: SubmissionSortBy) => {
        if (sortBy === column) {
            onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            onSortByChange(column);
            onSortOrderChange('asc');
        }
    };

    const currentPage = meta?.page || 1;
    const totalPages = meta?.totalPages || 1;



    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Problem</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Statistics</TableHead>
                                <TableHead>Language</TableHead>
                                <TableHead>Submitted At</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Problem</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Statistics</TableHead>
                            <TableHead>Language</TableHead>
                            <TableHead>Submitted At</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {submissions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    No submissions found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            submissions.map((submission) => (
                                <TableRow key={submission.id}>
                                    <TableCell className="font-medium">#{submission.id}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={submission.user.avatarUrl || `https://api.dicebear.com/9.x/miniavs/svg?seed=${submission.user.username}`} />
                                                <AvatarFallback>
                                                    {submission.user.fullName}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">
                                                    {submission.user.fullName}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {submission.user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-medium">{submission.problem.title}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={cn('font-normal', getStatusColor(submission.status))}
                                        >
                                            {getStatusLabel(submission.status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {submission.executionTime} ms
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Cpu className="h-3 w-3" />
                                                {(submission.memoryUsed / 1024).toFixed(1)} KB
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getLanguageName(submission.languageId, languages)}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {new Date(submission.submittedAt || '').toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild className="cursor-pointer">
                                                    <a href={`/problems/submissions/${submission.id}`}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </a>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* Footer & Pagination */}
            <DataTablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                meta={meta || undefined}
                entityName="problems"
            />
        </div>
    );
}
