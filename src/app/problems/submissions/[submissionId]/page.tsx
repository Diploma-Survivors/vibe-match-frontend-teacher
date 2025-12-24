'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { SubmissionsService } from '@/services/submissions-service';
import { Submission } from '@/types/submissions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchLanguages } from '@/store/slices/metadata-slice';
import SubmissionDetail from '@/components/submission-detail';

export default function SubmissionDetailPage() {
    const params = useParams();
    const submissionId = Number(params.submissionId);
    const [submission, setSubmission] = useState<Submission | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const dispatch = useAppDispatch();
    const { languages } = useAppSelector((state) => state.metadata);

    useEffect(() => {
        if (languages.length === 0) {
            dispatch(fetchLanguages());
        }
    }, [dispatch, languages.length]);

    useEffect(() => {
        const fetchSubmission = async () => {
            try {
                setIsLoading(true);
                const response = await SubmissionsService.getSubmissionById(submissionId);
                setSubmission(response.data);
            } catch (err) {
                setError('Failed to load submission details');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (submissionId) {
            fetchSubmission();
        }
    }, [submissionId]);

    return (
        <SubmissionDetail
            submission={submission}
            isLoading={isLoading}
            error={error}
        />
    );
}
