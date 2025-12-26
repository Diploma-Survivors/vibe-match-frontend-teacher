'use client';

import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ContestsService } from '@/services/contests-service';
import { ProblemHealth } from '@/types/contest-statistics';
import { ProblemDifficulty } from '@/types/problems';
import { Activity } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProblemHealthWidgetProps {
    contestId: number;
}

export function ProblemHealthWidget({ contestId }: ProblemHealthWidgetProps) {
    const [problems, setProblems] = useState<ProblemHealth[]>([]);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const data = await ContestsService.getProblemHealth(contestId);
                setProblems(data);
            } catch (error) {
                console.error('Failed to fetch problem health:', error);
            }
        };
        fetchProblems();
    }, [contestId]);

    const getDifficultyColor = (difficulty: ProblemDifficulty) => {
        switch (difficulty) {
            case ProblemDifficulty.EASY:
                return 'bg-green-100 text-green-700 border-green-200';
            case ProblemDifficulty.MEDIUM:
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case ProblemDifficulty.HARD:
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Problem Health
                </h2>
            </div>

            <div className="space-y-6">
                {problems.map((problem) => (
                    <div key={problem.problemId} className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-slate-500 text-sm">
                                        {problem.problemOrder}
                                    </span>
                                    <h3 className="font-medium text-slate-900 dark:text-slate-100 text-sm line-clamp-1">
                                        {problem.title}
                                    </h3>
                                </div>
                            </div>
                            <Badge
                                variant="outline"
                                className={`text-[10px] px-1.5 py-0 h-5 ${getDifficultyColor(
                                    problem.difficulty
                                )}`}
                            >
                                {problem.difficulty}
                            </Badge>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                                <span>{problem.solvedPercentage}% Solved</span>
                                <span>
                                    {problem.solvedCount} / {problem.totalParticipants}
                                </span>
                            </div>
                            <Progress
                                value={problem.solvedPercentage}
                                className="h-2"
                                indicatorClassName={
                                    problem.solvedPercentage > 70
                                        ? 'bg-green-500'
                                        : problem.solvedPercentage > 30
                                            ? 'bg-yellow-500'
                                            : 'bg-red-500'
                                }
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
