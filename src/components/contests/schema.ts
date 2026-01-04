import { z } from 'zod';
import { ContestStatus } from '@/types/contest';

export const ContestSchema = z.object({
    title: z.string().min(1, 'Contest name is required'),
    description: z.string().min(1, 'Description is required'),
    startTime: z.string().refine((val) => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && date > new Date();
    }, {
        message: 'Start time must be in the future',
    }),
    durationMinutes: z.coerce.number().min(1, 'Duration must be at least 1 minute'),
    status: z.nativeEnum(ContestStatus),
    problems: z.array(z.object({
        problemId: z.number(),
        orderIndex: z.number(),
        points: z.coerce.number().min(0, 'Score must be non-negative'),
    })).min(1, 'Contest must have at least one problem'),
});

export type ContestFormValues = z.infer<typeof ContestSchema>;
