'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import EditContestForm from '@/components/contests/edit-contest-form';
import { ContestFormValues } from '@/components/contests/schema';
import { ContestsService } from '@/services/contests-service';
import { toastService } from '@/services/toasts-service';
import {
    ContestCreateRequest,
    Contest,
} from '@/types/contest';
import { SelectedProblem } from '@/components/contests/problem-selection-section';
import { formatISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditContestPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [contest, setContest] = useState<Contest | null>(null);
    const [selectedProblems, setSelectedProblems] = useState<SelectedProblem[]>([]);
    const t = useTranslations('EditContestPage');

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                // Fetch contest data
                const response = await ContestsService.getContestById(id);
                const contestData = response.data.data as Contest;

                // Map API response to Contest interface
                setContest(contestData);
                setSelectedProblems(contestData.contestProblems.map((p) => ({
                    ...p.problem,
                    points: p.points || 0,
                    orderIndex: p.orderIndex
                })));
            } catch (error) {
                console.error('Failed to fetch contest:', error);
                toastService.error(t('form.loadError'));
                router.push('/contests');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, router, t]);

    const handleSubmit = async (data: ContestFormValues) => {
        setIsSubmitting(true);
        try {
            if (!contest || !id) return;
            const startTimeDate = new Date(data.startTime);
            const endTimeDate = new Date(startTimeDate.getTime() + data.durationMinutes * 60000);

            const contestCreateRequest: ContestCreateRequest = {
                id: contest.id,
                title: data.title,
                description: data.description,
                startTime: formatISO(startTimeDate),
                endTime: formatISO(endTimeDate),
                problems: data.problems,
            };
            await ContestsService.updateContest(id, contestCreateRequest);

            toastService.success(t('form.success'));
            router.push('/contests');
        } catch (error) {
            console.error('Failed to update contest:', error);
            toastService.error(t('form.error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-6 py-8">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                    <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-8">
                            <Skeleton className="h-[600px] w-full" />
                        </div>
                        <div className="space-y-8">
                            <Skeleton className="h-[400px] w-full" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!contest) {
        return null; // Or some error state
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {t('title')}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    {t('description')}
                </p>
            </div>

            <EditContestForm
                initialData={contest}
                initialSelectedProblems={selectedProblems}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
