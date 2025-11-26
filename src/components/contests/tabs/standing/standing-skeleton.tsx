import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function StandingSkeleton() {
  return (
    <div>
      {/* Filter Skeleton */}
      <div className="mb-4 p-2 bg-transparent">
        <div className="flex items-center gap-3 w-fit">
          <Skeleton width={32} height={16} />
          <Skeleton width={288} height={40} borderRadius={8} />
          <Skeleton width={100} height={40} borderRadius={8} />
          <Skeleton width={64} height={16} />
          <Skeleton width={40} height={40} borderRadius={8} />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="border border-gray-300 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="bg-gray-700">
                <th className="w-16 text-center py-3 border-r border-gray-300 border-b border-gray-300">
                  <Skeleton
                    width={40}
                    height={16}
                    baseColor="#4b5563"
                    highlightColor="#6b7280"
                  />
                </th>
                <th className="min-w-[240px] py-3 pl-4 border-r border-gray-300 border-b border-gray-300">
                  <Skeleton
                    width={100}
                    height={16}
                    baseColor="#4b5563"
                    highlightColor="#6b7280"
                  />
                </th>
                <th className="w-28 text-center py-3 border-r border-gray-300 border-b border-gray-300">
                  <Skeleton
                    width={50}
                    height={16}
                    baseColor="#4b5563"
                    highlightColor="#6b7280"
                  />
                </th>
                {[1, 2, 3].map((i) => (
                  <th
                    key={i}
                    className="w-20 text-center py-3 border-r border-gray-300 border-b border-gray-300 last:border-r-0"
                  >
                    <div className="flex flex-col items-center gap-0.5">
                      <Skeleton
                        width={20}
                        height={16}
                        baseColor="#4b5563"
                        highlightColor="#6b7280"
                      />
                      <Skeleton
                        width={30}
                        height={12}
                        baseColor="#4b5563"
                        highlightColor="#6b7280"
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {[...Array(5)].map((_, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-gray-300 bg-white"
                >
                  {/* Rank */}
                  <td className="text-center py-3 border-r border-gray-300">
                    <Skeleton width={20} height={14} />
                  </td>

                  {/* User Info */}
                  <td className="border-r border-gray-300 py-3 pl-4">
                    <div className="flex flex-col gap-0.5">
                      <Skeleton width={180} height={16} />
                      <Skeleton width={120} height={14} />
                    </div>
                  </td>

                  {/* Total Score */}
                  <td className="text-center border-r border-gray-300 py-3">
                    <div className="flex flex-col gap-0.5 items-center">
                      <Skeleton width={50} height={16} />
                      <Skeleton width={60} height={12} />
                    </div>
                  </td>

                  {/* Problem Results */}
                  {[1, 2, 3].map((i) => (
                    <td
                      key={i}
                      className="text-center border-r border-gray-300 last:border-r-0 py-3"
                    >
                      <div className="flex flex-col gap-0.5 items-center">
                        <Skeleton width={40} height={16} />
                        <Skeleton width={50} height={12} />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
