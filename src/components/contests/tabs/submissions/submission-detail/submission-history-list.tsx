import type { SubmissionDetailEdge } from '@/types/submissions-overview';
import { Search } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { SubmissionHistoryRow } from './submission-history-row';

interface SubmissionHistoryListProps {
  submissions: SubmissionDetailEdge[];
  selectedSubmissionId: number | null;
  onSelectSubmission: (submission: any) => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoading?: boolean;
}

export function SubmissionHistoryList({
  submissions,
  selectedSubmissionId,
  onSelectSubmission,
  hasMore = false,
  onLoadMore,
  isLoading = false,
}: SubmissionHistoryListProps) {
  return (
    <div className="h-full flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700">
          Lịch sử nộp bài ({submissions.length})
        </h3>
      </div>

      {/* Submissions Table */}
      <div
        className="flex-1 overflow-y-auto bg-gray-50"
        id="submission-history-scroll"
      >
        {submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không có submission nào
            </h3>
            <p className="text-gray-500 text-center max-w-sm">
              Sinh viên chưa nộp bài cho bài tập này.
            </p>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={submissions.length}
            next={onLoadMore || (() => {})}
            hasMore={hasMore}
            loader={
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="dots-loader mb-4" />
              </div>
            }
            scrollableTarget="submission-history-scroll"
            className="overflow-x-auto"
          >
            <table className="w-full">
              <thead className="bg-white border-b border-gray-200 sticky top-0 z-10 text-xs">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 tracking-wider">
                    Language
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 tracking-wider">
                    Runtime
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 tracking-wider">
                    Memory
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {submissions.map((submission, index) => (
                  <SubmissionHistoryRow
                    key={submission.node.id}
                    submission={submission.node}
                    index={index}
                    isSelected={selectedSubmissionId === submission.node.id}
                    onSelect={onSelectSubmission}
                  />
                ))}
              </tbody>
            </table>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}
