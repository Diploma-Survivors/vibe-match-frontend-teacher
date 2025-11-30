import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function SubmissionsSkeleton() {
  return (
    <div className="h-screen flex">
      {/* Left Panel - Student List */}
      <div className="w-1/2 border-r border-slate-200">
        <div className="h-full flex flex-col">
          {/* Search Filter */}
          <div className="flex gap-2 p-4 bg-white">
            <div className="flex-1 flex gap-2">
              <Skeleton
                height={40}
                borderRadius={8}
                containerClassName="flex-1"
              />
              <Skeleton width={100} height={40} borderRadius={8} />
            </div>
            <Skeleton width={120} height={40} borderRadius={8} />
          </div>

          {/* Student Table */}
          <div className="flex-1 overflow-hidden p-4">
            <div className="border border-slate-200 bg-white overflow-hidden">
              <table className="w-full">
                {/* Table Header */}
                <thead>
                  <tr className="bg-slate-700">
                    <th className="w-16 text-center py-3 border-r border-slate-300">
                      <Skeleton
                        width={20}
                        height={16}
                        baseColor="#475569"
                        highlightColor="#64748b"
                      />
                    </th>
                    <th className="py-3 px-4 border-r border-slate-300">
                      <Skeleton
                        width={80}
                        height={16}
                        baseColor="#475569"
                        highlightColor="#64748b"
                      />
                    </th>
                    <th className="w-32 text-center py-3">
                      <Skeleton
                        width={50}
                        height={16}
                        baseColor="#475569"
                        highlightColor="#64748b"
                      />
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {[...Array(8)].map((_, index) => (
                    <tr
                      key={index}
                      className="border-b border-slate-200 last:border-b-0"
                    >
                      <td className="text-center py-3 border-r border-slate-200">
                        <Skeleton width={20} height={14} />
                      </td>
                      <td className="py-3 px-4 border-r border-slate-200">
                        <Skeleton width={150} height={16} />
                      </td>
                      <td className="text-center py-3">
                        <Skeleton width={60} height={16} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Submission Detail */}
      <div className="w-1/2">
        <div className="h-full p-4 flex flex-col">
          {/* Problem Tabs */}
          <div className="mb-4">
            <div className="border-b border-slate-200 bg-white">
              <div className="flex items-center justify-center gap-3 px-4 h-12">
                <div className="flex items-center gap-2">
                  {[...Array(3)].map((_, index) => (
                    <Skeleton
                      key={index}
                      width={80}
                      height={36}
                      borderRadius={4}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex items-center justify-center">
            <Skeleton width={200} height={20} />
          </div>
        </div>
      </div>
    </div>
  );
}
