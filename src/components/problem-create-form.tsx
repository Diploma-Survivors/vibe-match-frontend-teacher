import { useState, useEffect, useRef } from 'react';
import { useForm, useWatch, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Stepper } from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    ProblemDifficulty,
    ProblemType,
    ProblemVisibility,
    ProblemSchema,
} from '@/types/problems';

import { toastService } from '@/services/toasts-service';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setDraft, clearDraft } from '@/store/slices/create-problem-slice';
import { useDialog } from '@/components/providers/dialog-provider';

import { TagsService } from '@/services/tags-service';
import { TopicsService } from '@/services/topics-service';
import { ProblemsService } from '@/services/problems-service';

import { GeneralInformationStep } from './problems/problem-form-steps/general-information-step';
import { ProblemDescriptionStep } from './problems/problem-form-steps/problem-description-step';
import { ConstraintsStep } from './problems/problem-form-steps/constraints-step';
import { TestCasesStep } from './problems/problem-form-steps/test-cases-step';
import { SolutionHintsStep } from './problems/problem-form-steps/solution-hints-step';
import type { Tag } from '@/types/tags';
import type { Topic } from '@/types/topics';
import type { CreateProblemRequest } from '@/types/problems';

export const CreateProblemSchema = ProblemSchema.omit({
    id: true,
    slug: true,
    createdAt: true,
    updatedAt: true,
    createdBy: true,
    updatedBy: true,
    hints: true,
})
    .extend({
        hints: z
            .array(
                z.object({
                    content: z.string().min(1, 'Hint content cannot be empty'),
                    order: z.number(),
                })
            )
            .optional(),
        testcaseFile: z
            .any()
            .refine((file) => file instanceof File, 'Testcase file is required'),
        sampleTestcases: z
            .array(
                z.object({
                    input: z.string().min(1, 'Input cannot be empty'),
                    output: z.string().min(1, 'Output cannot be empty'),
                    explanation: z.string().optional(),
                })
            )
            .min(1, 'At least one sample test case is required'),
        officialSolutionContent: z.string().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.hasOfficialSolution) {
            if (
                !data.officialSolutionContent ||
                data.officialSolutionContent.length <= 16
            ) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        'Official solution content must be longer than 16 characters',
                    path: ['officialSolutionContent'],
                });
            }
        }
    });

export type CreateProblemFormValues = z.infer<typeof CreateProblemSchema>;

const STEPS = [
    { title: 'General Information', description: 'General Info' },
    { title: 'Problem Description', description: 'Description' },
    { title: 'Constraints', description: 'Constraints' },
    { title: 'Test Cases', description: 'Test Cases' },
    { title: 'Solution & Hints', description: 'Solution & Hints' },
];

export default function ProblemCreateForm() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableTopics, setAvailableTopics] = useState<Topic[]>([]);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();
    const dispatch = useAppDispatch();
    const draft = useAppSelector((state) => state.createProblem);
    const { confirm } = useDialog();

    const form = useForm<CreateProblemFormValues>({
        resolver: zodResolver(CreateProblemSchema),
        defaultValues: draft, // Initialize with saved draft from Redux
        mode: 'onChange',
    });

    const [errorSteps, setErrorSteps] = useState<number[]>([]);

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = form;

    // Save draft on change
    const watchedValues = useWatch({ control });

    const isCancellingRef = useRef(false);

    // Save draft on change
    useEffect(() => {
        if (isCancellingRef.current) return;

        // Exclude testcaseFile from draft persistence to avoid Redux non-serializable error
        const safeDraft: Record<string, any> = {};
        for (const key in watchedValues) {
            if (key !== 'testcaseFile') {
                safeDraft[key] = (watchedValues as any)[key];
            }
        }

        // Exclude testcaseFile from draft for comparison
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { testcaseFile, ...draftWithoutFile } = draft;

        // Prevent infinite loops and unnecessary updates
        if (JSON.stringify(safeDraft) !== JSON.stringify(draftWithoutFile)) {
            dispatch(setDraft(safeDraft as Partial<CreateProblemFormValues>));
        }
    }, [watchedValues, dispatch, draft]);

    // Fetch topics and tags
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [topicsRes, tagsRes] = await Promise.all([
                    TopicsService.getAllTopics(),
                    TagsService.getAllTags(),
                ]);
                setAvailableTopics(topicsRes.data.data.data);
                setAvailableTags(tagsRes.data.data.data);
            } catch (err) {
                console.error('Failed to fetch topics or tags', err);
                toastService.error('Failed to load topics and tags.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // handleNext and handleBack removed as we use Stepper for navigation

    const handleCancel = async () => {
        const confirmed = await confirm({
            title: 'Cancel creating problem',
            message:
                'Are you sure you want to cancel? Any unsaved changes will be lost.',
            confirmText: 'Yes',
            cancelText: 'No',
            color: 'red',
        });

        if (confirmed) {
            isCancellingRef.current = true;
            dispatch(clearDraft());
            router.back();
        }
    };

    const onError = (errors: any) => {
        const newErrorSteps: number[] = [];

        // Step 1: General Info
        if (errors.title || errors.difficulty || errors.topics || errors.tags) {
            newErrorSteps.push(0);
        }

        // Step 2: Description
        if (errors.description) {
            newErrorSteps.push(1);
        }

        // Step 3: Constraints
        if (errors.constraints) {
            newErrorSteps.push(2);
        }

        // Step 4: Test Cases
        if (errors.testcaseFile || errors.sampleTestcases) {
            newErrorSteps.push(3);
        }

        // Step 5: Solution & Hints
        if (errors.officialSolutionContent || errors.hints) {
            newErrorSteps.push(4);
        }

        setErrorSteps(newErrorSteps);
        toastService.error('Please fix the errors in the highlighted steps.');
    };

    const onSubmit = async (data: CreateProblemFormValues) => {
        setIsSubmitting(true);
        setErrorSteps([]); // Reset errors

        try {
            const problemRequest: CreateProblemRequest = {
                ...data,
                inputDescription: data.inputDescription || '',
                outputDescription: data.outputDescription || '',
                maxScore: data.maxScore || 100,
                tagIds: data.tags.map((t: any) => t.id),
                topicIds: data.topics.map((t: any) => t.id),
                testcaseFile: data.testcaseFile,
                testcaseSamples:
                    data.sampleTestcases?.map((tc) => ({
                        input: tc.input,
                        expectedOutput: tc.output,
                        explanation: tc.explanation,
                    })) || [],
                hints: data.hints,
            };

            await ProblemsService.createProblem(problemRequest);

            toastService.success('Problem created successfully!');
            dispatch(clearDraft());

            // Redirect to problems list
            router.push('/problems');
        } catch (err) {
            console.error('Error creating problem:', err);
            toastService.error('Failed to create problem. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // topicOptions and tagOptions logic moved to GeneralInformationStep

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-[calc(100vh-100px)] bg-slate-50 dark:bg-slate-900">
                {/* Stepper Skeleton */}
                <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="container py-4">
                        <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-3 flex-1 min-w-[120px] justify-center">
                                    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                                    <Skeleton className="h-4 w-24 hidden sm:block" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Skeleton */}
                <div className="container py-8 flex-1">
                    <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                        <div className="mb-6">
                            <Skeleton className="h-8 w-48" />
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-10 w-full" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-24" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="h-10 w-full" />
                            </div>

                            <div className="space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-32 w-full" />
                            </div>

                            {/* Footer Buttons Skeleton */}
                            <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                                <Skeleton className="h-10 w-24" />
                                <Skeleton className="h-10 w-32" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-[calc(100vh-100px)] bg-slate-50 dark:bg-slate-900">
            {/* Stepper Header */}
            <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="container">
                    <Stepper
                        steps={STEPS}
                        currentStep={currentStep}
                        onStepClick={setCurrentStep}
                        errorSteps={errorSteps}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="container py-8 flex-1">
                <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                            {STEPS[currentStep].title}
                        </h2>
                    </div>

                    <FormProvider {...form}>
                        <form
                            onSubmit={handleSubmit(onSubmit, onError)}
                            className="space-y-6"
                        >
                            {/* Step 1: General Information */}
                            {currentStep === 0 && (
                                <GeneralInformationStep
                                    availableTopics={availableTopics}
                                    availableTags={availableTags}
                                />
                            )}

                            {/* Step 2: Problem Description */}
                            {currentStep === 1 && <ProblemDescriptionStep />}

                            {/* Step 3: Constraints */}
                            {currentStep === 2 && <ConstraintsStep />}

                            {/* Step 4: Test Cases */}
                            {currentStep === 3 && <TestCasesStep />}

                            {/* Step 5: Solution & Hints */}
                            {currentStep === 4 && <SolutionHintsStep />}

                            {/* Footer Buttons */}
                            <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="min-w-[100px] cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="min-w-[100px] bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Problem'}
                                </Button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </div>
    );
}
