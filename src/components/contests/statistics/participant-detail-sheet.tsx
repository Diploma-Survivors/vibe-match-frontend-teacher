'use client';

import { useEffect, useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LeaderboardEntry, ContestProblemStatus } from '@/types/contest-statistics';
import { Submission, SubmissionSortBy, SubmissionStatus } from '@/types/submissions';
import { getLanguageName, getStatusColor, getStatusLabel, SubmissionsService } from '@/services/submissions-service';
import { ContestsService } from '@/services/contests-service';
import { ExternalLink, Trophy, Code2, Clock, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import SubmissionDetail from '@/components/submission-detail';
import { SortOrder } from '@/types/problems';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';

interface ParticipantDetailSheetProps {
    isOpen: boolean;
    onClose: () => void;
    participant: LeaderboardEntry | null;
    contestId: number;
}

export function ParticipantDetailSheet({
    isOpen,
    onClose,
    participant,
    contestId,
}: ParticipantDetailSheetProps) {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loadingSubmissions, setLoadingSubmissions] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
    const [submissionDetailLoading, setSubmissionDetailLoading] = useState(false);

    // Pagination state
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const { languages } = useAppSelector((state) => state.metadata);

    // Reset state when participant changes
    useEffect(() => {
        if (isOpen) {
            setSubmissions([]);
            setPage(1);
            setHasMore(true);
        }
    }, [participant?.user.id, isOpen]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            if (!participant || !isOpen) return;

            // Prevent duplicate fetches
            if (page === 1 && loadingSubmissions) return;
            if (page > 1 && isFetchingMore) return;

            if (page === 1) {
                setLoadingSubmissions(true);
            } else {
                setIsFetchingMore(true);
            }

            try {
                const response = await SubmissionsService.getSubmissions({
                    filters: {
                        // TODO: Add contestIds and userId when apis is available
                        // contestIds: [contestId],
                        // userId: participant.user.id,
                    },
                    page: page,
                    limit: 20, // Smaller limit for smoother infinite scroll
                    sortOrder: SortOrder.DESC,
                    sortBy: SubmissionSortBy.SUBMITTED_AT,
                });

                const newSubmissions = response.data.data.data;
                const meta = response.data.data.meta;

                if (page === 1) {
                    setSubmissions(newSubmissions);
                } else {
                    setSubmissions(prev => [...prev, ...newSubmissions]);
                }

                setHasMore(meta.hasNextPage);
            } catch (error) {
                console.error('Failed to fetch participant submissions:', error);
            } finally {
                setLoadingSubmissions(false);
                setIsFetchingMore(false);
            }
        };

        fetchSubmissions();
    }, [participant, contestId, isOpen, page]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isFetchingMore && !loadingSubmissions) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 0.1 }
        );

        const sentinel = document.getElementById('submission-scroll-sentinel');
        if (sentinel) {
            observer.observe(sentinel);
        }

        return () => {
            if (sentinel) {
                observer.unobserve(sentinel);
            }
        };
    }, [hasMore, isFetchingMore, loadingSubmissions, submissions.length]);

    const handleSubmissionClick = async (submissionId: number) => {
        setSubmissionDetailLoading(true);
        setIsSubmissionModalOpen(true);
        try {
            const response = await SubmissionsService.getSubmissionById(submissionId);
            setSelectedSubmission(response.data);
        } catch (error) {
            console.error('Failed to fetch submission details:', error);
        } finally {
            setSubmissionDetailLoading(false);
        }
    };

    const getContestProblemStatusColor = (status: string) => {
        switch (status) {
            case 'ACCEPTED':
            case 'SOLVED':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
            case 'REJECTED':
            case 'ATTEMPTED':
                return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
            default:
                return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
        }
    };

    const getSubmissionStatusIcon = (status: SubmissionStatus) => {
        switch (status) {
            case SubmissionStatus.ACCEPTED:
                return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case SubmissionStatus.WRONG_ANSWER:
                return <XCircle className="w-4 h-4 text-red-500" />;
            case SubmissionStatus.TIME_LIMIT_EXCEEDED:
                return <Clock className="w-4 h-4 text-orange-500" />;
            case SubmissionStatus.RUNTIME_ERROR:
                return <AlertCircle className="w-4 h-4 text-yellow-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-slate-500" />;
        }
    };

    if (!participant) return null;

    return (
        <>
            <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto" side="right">
                    <SheetHeader className="space-y-4 pb-6 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-16 h-16 border-2 border-slate-200 dark:border-slate-700">
                                    <AvatarImage src={participant.user.avatarUrl} />
                                    <AvatarFallback className="text-xl">
                                        {participant.user.username.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                            {participant.user.fullName || participant.user.username}
                                        </h2>
                                        <Badge variant="outline" className="text-sm font-medium bg-slate-100 dark:bg-slate-800">
                                            #{participant.rank}
                                        </Badge>
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 font-mono text-sm">
                                        @{participant.user.username}
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" asChild>
                                <a href={`/profile/${participant.user.username}`} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-5 h-5 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100" />
                                </a>
                            </Button>
                        </div>
                    </SheetHeader>

                    <div className="py-6 space-y-8">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card>
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                        <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">Total Score</p>
                                        <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{participant.totalScore}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase">Total Time</p>
                                        <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                            {participant.totalTime}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Problem Status Grid */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Problem Status</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {participant.problemStatus.map((status) => (
                                    <div
                                        key={status.problemId}
                                        className={`p-3 rounded-lg border ${getContestProblemStatusColor(status.status)} flex flex-col justify-between h-24`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className="font-bold text-sm">Q{status.problemOrder}</span>
                                            <Badge variant="secondary" className="bg-white/50 dark:bg-black/20 text-xs backdrop-blur-sm border-0">
                                                {status.status}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-end text-xs opacity-80">
                                            <span>
                                                {status.attempts}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submission History */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Submission History</h3>
                            <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                                            <TableHead>Problem</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Language</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loadingSubmissions ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="h-24 text-center text-slate-500">
                                                    Loading history...
                                                </TableCell>
                                            </TableRow>
                                        ) : submissions.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="h-24 text-center text-slate-500">
                                                    No submissions found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            submissions.map((sub) => (
                                                <TableRow
                                                    key={sub.id}
                                                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                                    onClick={() => handleSubmissionClick(sub.id)}
                                                >
                                                    <TableCell className="font-medium">
                                                        {sub.problem.title}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={cn('font-normal', getStatusColor(sub.status))}
                                                        >
                                                            {getStatusLabel(sub.status)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono text-xs text-slate-500">
                                                        {getLanguageName(sub.languageId, languages)}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                        {/* Sentinel for infinite scroll */}
                                        <TableRow id="submission-scroll-sentinel">
                                            <TableCell colSpan={3} className="p-0 border-0" />
                                        </TableRow>
                                        {isFetchingMore && (
                                            <TableRow>
                                                <TableCell colSpan={3} className="h-12 text-center text-slate-500 text-xs">
                                                    Loading more...
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            <Dialog open={isSubmissionModalOpen} onOpenChange={setIsSubmissionModalOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Submission Details</DialogTitle>
                    </DialogHeader>
                    <SubmissionDetail
                        submission={selectedSubmission}
                        isLoading={submissionDetailLoading}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}
