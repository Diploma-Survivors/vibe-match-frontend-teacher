export interface PlatformStatistics {
  platform: {
    totalUsers: number;
    activeUsers: number;
    totalProblems: number;
    activeProblems: number;
    totalSubmissions: number;
    totalContests: number;
  };
  growth: {
    newUsersToday: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
    submissionsToday: number;
    activeUsersTotal: number;
  };
  engagement: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    avgSubmissionsPerUser: number;
  };
  revenue: {
    totalPremiumUsers: number;
    premiumConversionRate: number;
    totalRevueToday: number;
    revenueToday: number; // Keeping as per API sample, though likely a typo in API
    revenueThisMonth: number;
    newPremiumToday: number;
    newPremiumThisWeek: number;
    newPremiumThisMonth: number;
    averageRevenuePerUser: number;
  };
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface DashboardTimeSeriesResponse {
  dailyNewUsers: TimeSeriesPoint[];
  dailySubmissions: TimeSeriesPoint[];
  dailyActiveUsers: TimeSeriesPoint[];
  dailyRevenue: TimeSeriesPoint[];
  dailyAcceptedSubmissions: TimeSeriesPoint[];
}

export type DashboardMetric = 'users' | 'submissions' | 'active_users';
