'use client';

import { StudentTable } from '@/components/contests/tabs/submissions/student-table';
import { SubmissionDetail } from '@/components/contests/tabs/submissions/submission-detail';
import { useMemo, useState } from 'react';

type Problem = {
  id: string;
  title: string;
};

type Submission = {
  problemId: string;
  status: 'AC' | 'WA' | 'TLE' | 'CE' | 'RE' | 'Pending';
  score: number;
  language: string;
  timeMs: number;
  memoryKb: number;
  submittedAt: string;
  code: string;
};

type Student = {
  id: string;
  name: string;
  totalScore: number;
  submissions: Submission[];
};

export default function ContestSubmissionsPage() {
  // Mock problems
  const problems: Problem[] = useMemo(
    () => [
      { id: 'p1', title: 'A. Vòng lặp' },
      { id: 'p2', title: 'B. Mảng 1 chiều' },
      { id: 'p3', title: 'C. Xâu ký tự' },
    ],
    []
  );

  // Mock students & submissions
  const students: Student[] = useMemo(
    () => [
      {
        id: 's1',
        name: 'Nguyễn Văn A',

        totalScore: 250,
        submissions: [
          {
            problemId: 'p1',
            status: 'AC',
            score: 100,
            language: 'C++17',
            timeMs: 62,
            memoryKb: 10240,
            submittedAt: '2025-11-06 08:35',
            code: '#include <bits/stdc++.h>\nusing namespace std;\nint main(){cout<<"Hello";}',
          },
          {
            problemId: 'p2',
            status: 'WA',
            score: 70,
            language: 'C++20',
            timeMs: 120,
            memoryKb: 20480,
            submittedAt: '2025-11-06 09:10',
            code: '// wrong answer mock code',
          },
          {
            problemId: 'p3',
            status: 'Pending',
            score: 80,
            language: 'Python 3',
            timeMs: 0,
            memoryKb: 0,
            submittedAt: '2025-11-06 09:50',
            code: "print('hello')",
          },
        ],
      },
      {
        id: 's2',
        name: 'Trần Thị B',

        totalScore: 190,
        submissions: [
          {
            problemId: 'p1',
            status: 'WA',
            score: 60,
            language: 'C',
            timeMs: 230,
            memoryKb: 12288,
            submittedAt: '2025-11-06 08:55',
            code: '// WA mock',
          },
          {
            problemId: 'p2',
            status: 'AC',
            score: 100,
            language: 'Python 3',
            timeMs: 80,
            memoryKb: 11264,
            submittedAt: '2025-11-06 09:30',
            code: '# AC mock\nprint(42)',
          },
          {
            problemId: 'p3',
            status: 'CE',
            score: 30,
            language: 'C++17',
            timeMs: 0,
            memoryKb: 0,
            submittedAt: '2025-11-06 10:02',
            code: '// CE mock',
          },
        ],
      },
      {
        id: 's3',
        name: 'Phạm Minh C',

        totalScore: 140,
        submissions: [
          {
            problemId: 'p1',
            status: 'TLE',
            score: 40,
            language: 'Java 19',
            timeMs: 2000,
            memoryKb: 65536,
            submittedAt: '2025-11-06 08:40',
            code: '// TLE mock',
          },
          {
            problemId: 'p2',
            status: 'RE',
            score: 0,
            language: 'C++20',
            timeMs: 0,
            memoryKb: 0,
            submittedAt: '2025-11-06 09:15',
            code: '// RE mock',
          },
          {
            problemId: 'p3',
            status: 'AC',
            score: 100,
            language: 'Python 3',
            timeMs: 75,
            memoryKb: 15000,
            submittedAt: '2025-11-06 10:05',
            code: "# AC mock for strings\nprint('ok')",
          },
        ],
      },
    ],
    []
  );

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students[0]?.id ?? ''
  );
  const [activeProblemId, setActiveProblemId] = useState<string>(
    problems[0]?.id ?? ''
  );

  const selectedStudent = useMemo(
    () => students.find((s) => s.id === selectedStudentId) ?? null,
    [students, selectedStudentId]
  );

  const selectedSubmission = useMemo(() => {
    if (!selectedStudent) return null;
    return (
      selectedStudent.submissions.find(
        (sub) => sub.problemId === activeProblemId
      ) || null
    );
  }, [selectedStudent, activeProblemId]);

  return (
    <div className="h-[calc(100vh-60px)] flex">
      {/* Left: Students list */}
      <div className="w-1/2 border-r border-slate-200">
        <div className="p-4 h-full">
          <div className="rounded-xl border border-slate-200 bg-white h-full overflow-auto p-2">
            <StudentTable
              students={students}
              selectedStudentId={selectedStudentId}
              onSelectStudent={setSelectedStudentId}
            />
          </div>
        </div>
      </div>

      {/* Right: Submission detail */}
      <div className="w-1/2">
        <div className="p-4 h-full overflow-auto">
          {!selectedStudent || !selectedSubmission ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-slate-500">Chưa có bài nộp.</p>
            </div>
          ) : (
            <SubmissionDetail
              studentName={selectedStudent.name}
              problems={problems}
              activeProblemId={activeProblemId}
              onSelectProblem={setActiveProblemId}
              submission={{
                id: `${selectedStudent.id}-${activeProblemId}`,
                status: selectedSubmission.status,
                score: selectedSubmission.score,
                runtimeSec: selectedSubmission.timeMs / 1000,
                memoryBytes: selectedSubmission.memoryKb * 1024,
                languageName: selectedSubmission.language,
                sourceCode: selectedSubmission.code,
                passedTests: selectedSubmission.status === 'AC' ? 20 : 10,
                totalTests: 20,
                submittedAt: selectedSubmission.submittedAt,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
