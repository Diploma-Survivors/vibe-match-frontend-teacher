'use client';

import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { KPICards } from '@/components/problems/statistics/kpi-cards';
import { VerdictChart } from '@/components/problems/statistics/verdict-chart';
import { PerformanceAnalysis } from '@/components/problems/statistics/performance-analysis';
import { LanguageTable } from '@/components/problems/statistics/language-table';
import { StatisticsSkeleton } from '@/components/problems/statistics/skeleton';
import { ProblemsService } from '@/services/problems-service';
import type { ProblemStatistics } from '@/types/problem-statistics';
import { Edit, ChevronLeft, Calendar, ChevronRight } from 'lucide-react';
import { useRouter, Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { subDays, format } from 'date-fns';
import { useTranslations } from 'next-intl';

export default function ProblemStatisticsPage() {
    const t = useTranslations('ProblemStatistics');
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);
    const [stats, setStats] = useState<ProblemStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [dateRangeType, setDateRangeType] = useState('all');
    const [customFrom, setCustomFrom] = useState('');
    const [customTo, setCustomTo] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                let from: string | undefined;
                let to: string | undefined;

                if (dateRangeType === 'custom') {
                    from = customFrom;
                    to = customTo;
                } else if (dateRangeType === '7d') {
                    to = new Date().toISOString();
                    from = subDays(new Date(), 7).toISOString();
                } else if (dateRangeType === '30d') {
                    to = new Date().toISOString();
                    from = subDays(new Date(), 30).toISOString();
                }

                const response = await ProblemsService.getProblemStatistics(id, from, to);
                if (response.data && response.data.data) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch statistics:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            if (dateRangeType === 'custom' && (!customFrom || !customTo)) {
                return;
            }
            fetchStats();
        }
    }, [id, dateRangeType, customFrom, customTo]);

    if (loading) {
        return <StatisticsSkeleton />;
    }

    if (!stats) {
        return <div className="p-8 flex justify-center">{t('errors.loadFailed')}</div>;
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="cursor-pointer">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                    {dateRangeType === 'custom' && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-[300px] justify-start text-left font-normal cursor-pointer"
                                >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {customFrom && customTo ? (
                                        <>
                                            {format(new Date(customFrom), "LLL dd, y")} -{" "}
                                            {format(new Date(customTo), "LLL dd, y")}
                                        </>
                                    ) : (
                                        <span>{t('dateRange.pick')}</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-4" align="end">
                                <div className="space-y-4">
                                    <h4 className="font-medium leading-none">{t('dateRange.label')}</h4>
                                    <div className="grid gap-2">
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="from">{t('dateRange.from')}</Label>
                                            <Input
                                                id="from"
                                                type="date"
                                                className="col-span-2 h-8"
                                                value={customFrom}
                                                onChange={(e) => setCustomFrom(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 items-center gap-4">
                                            <Label htmlFor="to">{t('dateRange.to')}</Label>
                                            <Input
                                                id="to"
                                                type="date"
                                                className="col-span-2 h-8"
                                                value={customTo}
                                                onChange={(e) => setCustomTo(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}

                    <Select value={dateRangeType} onValueChange={setDateRangeType}>
                        <SelectTrigger className="w-[180px] cursor-pointer">
                            <SelectValue placeholder={t('dateRange.placeholder')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all" className="cursor-pointer">{t('dateRange.all')}</SelectItem>
                            <SelectItem value="30d" className="cursor-pointer">{t('dateRange.last30d')}</SelectItem>
                            <SelectItem value="7d" className="cursor-pointer">{t('dateRange.last7d')}</SelectItem>
                            <SelectItem value="custom" className="cursor-pointer">{t('dateRange.custom')}</SelectItem>
                        </SelectContent>
                    </Select>

                    <Link href={`/problems/${id}/edit`}>
                        <Button variant="default" className="cursor-pointer bg-green-600 hover:bg-green-700 text-white">
                            <Edit className="mr-2 h-4 w-4" />
                            {t('buttons.editProblem')}
                        </Button>
                    </Link>

                    <Link href={`/submissions?problemIds=${id}`}>
                        <Button variant="ghost" className="cursor-pointer">
                            {t('buttons.allSubmissions')}
                            <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Top Section: Overview & Outcomes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-1">
                    <KPICards stats={stats} />
                </div>
                <div className="lg:col-span-1 h-[300px] lg:h-auto">
                    <VerdictChart verdicts={stats.verdicts} />
                </div>
            </div>

            {/* Middle Section: Performance Analysis */}
            <PerformanceAnalysis
                runtimeDistribution={stats.runtimeDistribution}
                memoryDistribution={stats.memoryDistribution}
            />

            {/* Bottom Section: Language Breakdown */}
            <LanguageTable languages={stats.languageStats} />
        </div>
    );
}
