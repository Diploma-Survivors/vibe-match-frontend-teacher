'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { VerdictCount } from '@/types/problem-statistics';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useTranslations } from 'next-intl';
import { getStatusLabel } from '@/services/submissions-service';
import { SubmissionStatus } from '@/types/submissions';

interface VerdictChartProps {
    verdicts: VerdictCount[];
}

const COLORS = ['#22c55e', '#ef4444', '#eab308', '#f97316', '#a855f7'];

export function VerdictChart({ verdicts }: VerdictChartProps) {
    const t = useTranslations('ProblemStatistics.verdict');
    const data = verdicts.map((v) => ({
        name: getStatusLabel(v.verdict as SubmissionStatus),
        value: v.count,
        percentage: v.percentage,
    }));

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="p-3 pb-2">
                <CardTitle className="text-sm font-medium">{t('title')}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-[150px] flex items-center p-3 pt-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="40%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number, name: string, props: any) => [
                                `${value.toLocaleString()} (${props.payload.percentage}%)`,
                                name
                            ]}
                        />
                        <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            wrapperStyle={{ paddingLeft: '20px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
