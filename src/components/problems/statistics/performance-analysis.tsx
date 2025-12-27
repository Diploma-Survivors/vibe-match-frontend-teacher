'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DistributionBucket } from '@/types/problem-statistics';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTranslations } from 'next-intl';

interface PerformanceAnalysisProps {
    runtimeDistribution: DistributionBucket[];
    memoryDistribution: DistributionBucket[];
}

export function PerformanceAnalysis({ runtimeDistribution, memoryDistribution }: PerformanceAnalysisProps) {
    const t = useTranslations('ProblemStatistics.performance');

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DistributionChart
                title={t('runtimeTitle')}
                data={runtimeDistribution}
                color="#3b82f6"
                unit="ms"
            />
            <DistributionChart
                title={t('memoryTitle')}
                data={memoryDistribution}
                color="#8b5cf6"
                unit="MB"
            />
        </div>
    );
}

interface DistributionChartProps {
    title: string;
    data: DistributionBucket[];
    color: string;
    unit: string;
}

function DistributionChart({ title, data, color, unit }: DistributionChartProps) {
    const t = useTranslations('ProblemStatistics.performance');

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="range"
                            tick={{ fontSize: 12 }}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    const dataPoint = payload[0].payload as DistributionBucket;
                                    return (
                                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                        {t('range')}
                                                    </span>
                                                    <span className="font-bold text-muted-foreground">
                                                        {label}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                        {t('count')}
                                                    </span>
                                                    <span className="font-bold">
                                                        {dataPoint.count}
                                                    </span>
                                                </div>
                                                {dataPoint.percentile !== undefined && (
                                                    <div className="col-span-2 flex flex-col border-t pt-2">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                            {t('percentile')}
                                                        </span>
                                                        <span className="font-bold text-green-600">
                                                            {t('beats', { percent: dataPoint.percentile })}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar
                            dataKey="count"
                            fill={color}
                            radius={[4, 4, 0, 0]}
                            className="hover:opacity-80 cursor-pointer"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
