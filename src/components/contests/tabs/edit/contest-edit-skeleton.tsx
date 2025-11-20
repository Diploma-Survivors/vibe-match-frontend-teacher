import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ContestEditSkeleton() {
  return (
    <div className="min-h-screen py-6">
      <div className="w-full px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Contest Description Skeleton */}
            <div className="bg-white border border-gray-300 p-6">
              <div className="flex items-start justify-between mb-4">
                <Skeleton width="66%" height={36} />
                <Skeleton width={32} height={32} />
              </div>
              <div className="space-y-2">
                <Skeleton count={3} />
              </div>
            </div>

            {/* Problems Table Skeleton */}
            <div className="bg-white border border-gray-300 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="px-4 py-3 text-left text-sm font-bold text-white w-16">
                        STT
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-white">
                        Tên bài tập
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-bold text-white w-32">
                        Thời gian
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-bold text-white w-32">
                        Bộ nhớ
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-bold text-white w-24">
                        Điểm
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i}>
                        <td className="px-4 py-4">
                          <Skeleton width={32} height={20} />
                        </td>
                        <td className="px-4 py-4">
                          <Skeleton width="75%" height={20} />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            <Skeleton width={64} height={20} />
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            <Skeleton width={64} height={20} />
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            <Skeleton width={48} height={20} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            {/* Contest Info Skeleton */}
            <div className="bg-white border border-gray-300 p-6">
              <Skeleton width="50%" height={24} className="mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-gray-50"
                  >
                    <Skeleton width={20} height={20} circle />
                    <div className="flex-1 space-y-2">
                      <Skeleton width="33%" height={12} />
                      <Skeleton width="66%" height={16} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats Skeleton */}
            <div className="bg-white border border-gray-300 p-6">
              <Skeleton width="50%" height={24} className="mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton width="33%" height={16} />
                    <Skeleton width="25%" height={16} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
