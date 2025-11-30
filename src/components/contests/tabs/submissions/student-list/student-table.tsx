import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Student = {
  id: string;
  name: string;
  totalScore: number;
};

type StudentTableProps = {
  students: Student[];
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
};

export function StudentTable({
  students,
  selectedStudentId,
  onSelectStudent,
}: StudentTableProps) {
  return (
    <Table className="border-collapse w-full">
      <TableHeader>
        <TableRow className="bg-gray-700 hover:bg-gray-700">
          <TableHead className="w-16 text-center font-bold text-sm py-3 sticky left-0 bg-gray-700 z-20 border-r border-gray-300 border-b border-gray-300 text-white last:border-r-0">
            #
          </TableHead>
          <TableHead className="min-w-[220px] font-bold text-sm py-3 pl-4 border-r border-gray-300 border-b border-gray-300 text-white last:border-r-0">
            Sinh viên
          </TableHead>
          <TableHead className="w-24 text-center font-bold text-sm py-3 border-r border-gray-300 border-b border-gray-300 text-white last:border-r-0">
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
              <TableCell className="text-center sticky left-0 bg-inherit z-10 border-r border-gray-300 py-3 last:border-r-0">
                <span className="text-gray-800 font-semibold text-sm">
                  {index + 1}
                </span>
              </TableCell>
              <TableCell className="border-r border-gray-300 py-3 pl-4 last:border-r-0">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 truncate">
                    {s.name}
                  </p>
                </div>
              </TableCell>
              <TableCell className="text-center border-r border-gray-300 py-3 last:border-r-0">
                <span className="font-bold text-gray-900 text-sm">
                  {s.totalScore != null
                    ? s.totalScore % 1 === 0
                      ? s.totalScore.toFixed(0)
                      : s.totalScore.toFixed(2)
                    : '0'}
                </span>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
