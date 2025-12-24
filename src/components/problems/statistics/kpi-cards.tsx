import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { ProblemStatistics } from '@/types/problem-statistics';
import { Users, FileText } from 'lucide-react';

interface KPICardsProps {
    stats: ProblemStatistics;
}

export function KPICards({ stats }: KPICardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {/* Submissions Card */}
            <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-6">
                    <div className="p-2 bg-green-50 rounded-lg">
                        <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-base font-semibold">Submissions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Total Submissions</span>
                            <span className="text-lg font-bold">{stats.totalSubmissions.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Total Accepted</span>
                            <span className="text-lg font-bold">{stats.totalAccepted.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="h-px bg-border w-full" />

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Acceptance Rate</span>
                            <span className="text-lg font-bold text-green-600">{stats.acceptanceRate}%</span>
                        </div>
                        <Progress value={stats.acceptanceRate} className="h-2" indicatorClassName="bg-green-500" />
                    </div>
                </CardContent>
            </Card>

            {/* Solvers Card */}
            <Card>
                <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-6">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-base font-semibold">Solvers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Total Attempts</span>
                            <span className="text-lg font-bold">{stats.totalAttempts.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Total Solveds</span>
                            <span className="text-lg font-bold">{stats.totalSolved.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="h-px bg-border w-full" />

                    <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-muted-foreground">Average Time to Solved</span>
                        <span className="text-xl font-bold">{Math.round(stats.averageTimeToSolve / 1000 / 60)}m</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
