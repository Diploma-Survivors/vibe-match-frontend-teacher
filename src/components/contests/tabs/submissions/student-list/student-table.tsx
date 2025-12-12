import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { StudentSubmissionOverview } from '@/types/submissions';
import InfiniteScroll from 'react-infinite-scroll-component';

type StudentTableProps = {
  students: StudentSubmissionOverview[];
  selectedStudentId: number | null;
  onSelectStudent: (id: number) => void;
  hasNextPage: boolean;
  loadNext: () => void;
};

export function StudentTable({
  students,
  selectedStudentId,
  onSelectStudent,
  hasNextPage,
  loadNext,
}: StudentTableProps) {
  return (
    <div className="flex-1 overflow-hidden">
      <div id="scrollableDiv" className="h-full overflow-auto p-4">
        <div className="border border-slate-200 rounded-xl bg-white overflow-hidden">
          <InfiniteScroll
            dataLength={students.length}
            next={loadNext}
            hasMore={hasNextPage}
            loader={
              <div className="p-4 text-center text-slate-500">
                Đang tải thêm...
              </div>
            }
            endMessage={
              students.length > 0 ? (
                <div className="p-4 text-center text-slate-400 border-t border-gray-300">
                  Đã hiển thị tất cả sinh viên
                </div>
              ) : (
                <div className="p-4 text-center text-slate-400 border-t border-gray-300">
                  Không có sinh viên nào
                </div>
              )
            }
            scrollableTarget="scrollableDiv"
          >
            <Table className="border-collapse w-full">
              <TableHeader>
                <TableRow className="bg-gray-50 text-gray-700">
                  <TableHead className="w-16 text-gray-700 text-center font-bold text-sm py-3 sticky left-0 bg-gray-50 z-20 border-r border-gray-300 border-b border-gray-300 last:border-r-0">
                    Email
                  </TableHead>
                  <TableHead className="min-w-[220px] text-gray-700 font-bold text-sm py-3 pl-4 border-r border-gray-300 border-b border-gray-300 last:border-r-0">
                    Sinh viên
                  </TableHead>
                  <TableHead className="w-24 text-center text-gray-700 font-bold text-sm py-3 border-r border-gray-300 border-b border-gray-300 last:border-r-0">
                    Điểm
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s, index) => {
                  const isActive = selectedStudentId === s.id;
                  return (
                    <TableRow
                      key={s.id}
                      onClick={() => onSelectStudent(s.id)}
                      className={`border-b border-gray-300 cursor-pointer ${isActive ? 'bg-blue-50' : 'hover:bg-blue-50'}`}
                    >
                      <TableCell className="sticky left-0 bg-inherit z-10 border-r border-gray-300 py-3 last:border-r-0">
                        <span className="text-gray-800 font-semibold text-sm">
                          {s.user.email}
                        </span>
                      </TableCell>
                      <TableCell className="border-r border-gray-300 py-3 pl-4 last:border-r-0">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate">
                            {s.user.lastName} {s.user.firstName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center border-r border-gray-300 py-3 last:border-r-0">
                        <span className="font-bold text-gray-900 text-sm">
                          {s.finalScore != null
                            ? s.finalScore % 1 === 0
                              ? s.finalScore.toFixed(0)
                              : s.finalScore.toFixed(2)
                            : '0'}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
}
