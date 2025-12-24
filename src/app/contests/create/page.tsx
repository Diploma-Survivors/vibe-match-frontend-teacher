'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CreateContestForm from '@/components/contests/create-contest-form';
import { ContestFormValues } from '@/components/contests/schema';
import { ContestsService } from '@/services/contests-service';
import { toastService } from '@/services/toasts-service';
import { ContestCreateRequest } from '@/types/contest';
import { formatISO } from 'date-fns';

export default function CreateContestPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: ContestFormValues) => {
        setIsSubmitting(true);
        try {
            if (!data) return;
            const contestCreateRequest: ContestCreateRequest = {
                name: data.name,
                description: data.description,
                startTime: formatISO(data.startTime),
                durationMinutes: data.durationMinutes,
                problems: data.problems,
            };
            await ContestsService.createContest(contestCreateRequest);

            toastService.success('Contest created successfully');
            localStorage.removeItem('contestDraft');
            router.push('/contests');
        } catch (error) {
            console.error('Failed to create contest:', error);
            toastService.error('Failed to create contest');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    Create New Contest
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Fill in the details to create a new contest.
                </p>
            </div>

            <CreateContestForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
    );
}
