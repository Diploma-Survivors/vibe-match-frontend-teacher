'use client';

import { VerdictChart } from '@/components/problems/statistics/verdict-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContestStatistics } from '@/types/contest-statistics';
import { Users, Activity, PieChart } from 'lucide-react';
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface KeyMetricsProps {
    stats: ContestStatistics;
}

const COLORS = ['#22c55e', '#ef4444', '#eab308', '#f97316', '#a855f7'];

export function KeyMetrics({ stats }: KeyMetricsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Active Users Card */}
            <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Active Participants
                    </CardTitle>
                    <Users className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {stats.activeUsers.toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        / {stats.totalRegistered.toLocaleString()} Registered
                    </p>
                    <div className="mt-4 h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{
                                width: `${(stats.activeUsers / stats.totalRegistered) * 100}%`,
                            }}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Submission Rate Card */}
            <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Submission Rate
                    </CardTitle>
                    <Activity className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between items-end">
                        <div>
                            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                {stats.totalSubmissions.toLocaleString()}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Total Submissions
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-bold text-green-600 dark:text-green-400">
                                {stats.acceptanceRate}%
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Acceptance Rate
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span>{stats.totalAccepted.toLocaleString()} AC</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-slate-300" />
                            <span>
                                {(stats.totalSubmissions - stats.totalAccepted).toLocaleString()} Non-AC
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="md:col-span-2">
                <VerdictChart verdicts={stats.verdicts} />
            </div>
        </div>
    );
}
