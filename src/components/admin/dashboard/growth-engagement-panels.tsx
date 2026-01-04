import React from 'react';
import { useTranslations } from 'next-intl';
import type { PlatformStatistics } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface GrowthEngagementPanelsProps {
    growth: PlatformStatistics['growth'];
    engagement: PlatformStatistics['engagement'];
}

export function GrowthEngagementPanels({ growth, engagement }: GrowthEngagementPanelsProps) {
    const t = useTranslations('admin.dashboard');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Panel: User Acquisition (Growth) */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                        {t('growth.title')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{t('growth.newUsersToday')}</span>
                                <span className="font-bold">{growth.newUsersToday}</span>
                            </div>
                            <Progress value={(growth.newUsersToday / 100) * 100} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{t('growth.newUsersThisWeek')}</span>
                                <span className="font-bold">{growth.newUsersThisWeek}</span>
                            </div>
                            <Progress value={(growth.newUsersThisWeek / 500) * 100} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{t('growth.newUsersThisMonth')}</span>
                                <span className="font-bold">{growth.newUsersThisMonth}</span>
                            </div>
                            <Progress value={(growth.newUsersThisMonth / 2000) * 100} className="h-2" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Right Panel: Engagement & Stickiness */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                        {t('engagement.title')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-muted/50 rounded-lg text-center">
                            <div className="text-2xl font-bold mb-1">{engagement.dailyActiveUsers}</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">{t('engagement.dau')}</div>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg text-center">
                            <div className="text-2xl font-bold mb-1">{engagement.weeklyActiveUsers}</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">{t('engagement.wau')}</div>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg text-center col-span-2">
                            <div className="text-2xl font-bold mb-1">{engagement.monthlyActiveUsers}</div>
                            <div className="text-xs text-muted-foreground uppercase tracking-wider">{t('engagement.mau')}</div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <div className="text-sm font-medium text-muted-foreground mb-1">
                                {t('engagement.avgSubmissionsPerUser')}
                            </div>
                            <div className="text-3xl font-bold text-primary">
                                {engagement.avgSubmissionsPerUser}
                            </div>
                        </div>
                        <div className="relative w-16 h-16">
                            {/* Simple circular representation using SVG */}
                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                <path
                                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#e2e8f0"
                                    strokeWidth="4"
                                />
                                <path
                                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeDasharray="75, 100"
                                    className="text-primary"
                                />
                            </svg>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
