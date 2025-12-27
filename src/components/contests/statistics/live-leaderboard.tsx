'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ContestsService } from '@/services/contests-service';
import { ParticipantDetailSheet } from './participant-detail-sheet';
import { LeaderboardEntry } from '@/types/contest-statistics';
import { Eye, Search, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

import { ContestStatus } from '@/types/contest';

interface LiveLeaderboardProps {
    contestId: number;
    contestStatus?: ContestStatus;
}

export function LiveLeaderboard({ contestId, contestStatus }: LiveLeaderboardProps) {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedParticipant, setSelectedParticipant] = useState<LeaderboardEntry | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const fetchLeaderboard = async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const response = await ContestsService.getLiveLeaderboard(
                contestId,
                page,
                20,
                search
            );
            setEntries(response.data);
            setTotalPages(response.meta.totalPages);
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error);
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    // Initial fetch and search/page changes
    useEffect(() => {
        fetchLeaderboard(true);
    }, [contestId, search, page]);

    // Polling for live updates
    useEffect(() => {
        if (contestStatus !== ContestStatus.ONGOING || search) return;

        const interval = setInterval(() => {
            fetchLeaderboard(false); // Don't show loading spinner for background updates
        }, 5000);

        return () => clearInterval(interval);
    }, [contestId, contestStatus, search, page]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACCEPTED':
            case 'SOLVED':
                return 'bg-green-500 hover:bg-green-600';
            case 'REJECTED':
            case 'ATTEMPTED':
                return 'bg-red-500 hover:bg-red-600';
            case 'PENDING':
                return 'bg-yellow-500 hover:bg-yellow-600';
            default:
                return 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600';
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-full">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        Live Leaderboard
                    </h2>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search user..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1); // Reset to first page on search
                        }}
                        className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                            <TableHead className="w-16 text-center">Rank</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead className="text-right">Score</TableHead>
                            <TableHead className="text-center">Progress</TableHead>
                            <TableHead className="text-right">Time</TableHead>
                            <TableHead className="w-16 text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                                    Loading leaderboard...
                                </TableCell>
                            </TableRow>
                        ) : entries.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                                    No participants found
                                </TableCell>
                            </TableRow>
                        ) : (
                            entries.map((entry) => (
                                <TableRow
                                    key={entry.rank}
                                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                    onClick={() => {
                                        setSelectedParticipant(entry);
                                        setIsSheetOpen(true);
                                    }}
                                >
                                    <TableCell className="text-center font-medium">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto ${entry.rank <= 3
                                                ? 'bg-yellow-100 text-yellow-700 font-bold'
                                                : 'text-slate-500'
                                                }`}
                                        >
                                            {entry.rank}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-8 h-8 border border-slate-200 dark:border-slate-700">
                                                <AvatarImage src={entry.user.avatarUrl} />
                                                <AvatarFallback>
                                                    {entry.user.username.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-slate-900 dark:text-slate-100">
                                                    {entry.user.fullName || entry.user.username}
                                                </div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                                    @{entry.user.username}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-slate-900 dark:text-slate-100">
                                        {entry.totalScore}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-center gap-1">
                                            {entry.problemStatus.map((status) => (
                                                <div
                                                    key={status.problemId}
                                                    className={`w-6 h-6 rounded-sm ${getStatusColor(
                                                        status.status
                                                    )} transition-all duration-300`}
                                                    title={`Q${status.problemOrder}: ${status.status}`}
                                                />
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-slate-600 dark:text-slate-400">
                                        {entry.totalTime}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Eye className="w-4 h-4 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                    Page {page} of {totalPages}
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages || loading}
                    >
                        Next
                    </Button>
                </div>
            </div>

            <ParticipantDetailSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                participant={selectedParticipant}
                contestId={contestId}
            />
        </div>
    );
}
