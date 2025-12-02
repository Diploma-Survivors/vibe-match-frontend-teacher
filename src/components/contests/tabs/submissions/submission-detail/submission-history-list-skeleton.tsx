import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function SubmissionHistoryListSkeleton() {
  return (
    <div className="h-full flex flex-col bg-white border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-gray-50">
        <Skeleton width={150} height={16} />
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead className="bg-white border-b border-gray-200 sticky top-0 z-10 text-xs">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Skeleton width={50} height={14} />
                </th>
                <th className="px-4 py-3 text-left">
                  <Skeleton width={70} height={14} />
                </th>
                <th className="px-4 py-3 text-left">
                  <Skeleton width={60} height={14} />
                </th>
                <th className="px-4 py-3 text-left">
                  <Skeleton width={60} height={14} />
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(5)].map((_, index) => (
                <tr key={index} className="transition-all duration-200">
                  <td className="px-4 py-3">
                    <Skeleton width={100} height={16} />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton width={80} height={16} />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton width={50} height={16} />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton width={50} height={16} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
