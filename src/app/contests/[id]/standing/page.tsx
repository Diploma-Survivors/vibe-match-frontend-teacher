'use client';

import { StandingFilter } from '@/components/contests/tabs/standing/standing-filter';
import { StandingTable } from '@/components/contests/tabs/standing/standing-table';
import { useLeaderboard } from '@/hooks/use-leaderboard';
import { useParams } from 'next/navigation';

export default function ContestStandingPage() {
  const params = useParams();
  const contestId = params.id as string;

  const {
    data,
    loading,
    error,
    hasNextPage,
    hasPreviousPage,
    loadNext,
    loadPrevious,
    updateFilters,
    username,
    sortOrder,
  } = useLeaderboard(contestId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải bảng xếp hạng...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="border border-gray-300 p-8 max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Không thể tải bảng xếp hạng
          </h2>
          <p className="text-gray-600">
            {error?.message || 'Đã có lỗi xảy ra khi tải dữ liệu.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <StandingFilter
        initialUsername={username}
        initialSortOrder={sortOrder}
        onFilterChange={({
          username: newUsername,
          sortOrder: newSortOrder,
        }) => {
          updateFilters({ username: newUsername, sortOrder: newSortOrder });
        }}
      />
      <StandingTable
        data={data}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onLoadNext={loadNext}
        onLoadPrevious={loadPrevious}
      />
    </>
  );
}
