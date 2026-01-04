import clientApi from '@/lib/apis/axios-client';
import type { PlatformStatistics, TimeSeriesPoint, DashboardMetric, DashboardTimeSeriesResponse } from '@/types/dashboard';
import type { ApiResponse } from '@/types/api';
import type { AxiosResponse } from 'axios';

async function getPlatformStatistics(): Promise<AxiosResponse<ApiResponse<PlatformStatistics>>> {
  return await clientApi.get<ApiResponse<PlatformStatistics>>('/admin/dashboard/statistics');
}

async function getTimeSeriesMetrics(
  metric: DashboardMetric,
  from?: string,
  to?: string
): Promise<AxiosResponse<ApiResponse<DashboardTimeSeriesResponse>>> {
  return await clientApi.get<ApiResponse<DashboardTimeSeriesResponse>>('/admin/dashboard/time-series', {
    params: {
      metric,
      from,
      to,
    },
  });
}

export const DashboardService = {
  getPlatformStatistics,
  getTimeSeriesMetrics,
};
