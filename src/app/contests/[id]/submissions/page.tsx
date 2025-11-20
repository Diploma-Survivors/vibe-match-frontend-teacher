'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useMemo, useRef, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/hljs';

type Problem = {
  id: string;
  title: string;
};

type Submission = {
  problemId: string;
  status: 'AC' | 'WA' | 'TLE' | 'CE' | 'RE' | 'Pending';
  score: number; // 0-100
  language: string;
  timeMs: number;
  memoryKb: number;
  submittedAt: string;
  code: string;
};

type Student = {
  id: string;
  name: string;
  totalScore: number; // sum best per problem
  submissions: Submission[];
};

const STATUS_COLOR: Record<Submission['status'], string> = {
  AC: 'text-green-600',
  WA: 'text-red-600',
  TLE: 'text-orange-600',
  CE: 'text-slate-600',
  RE: 'text-amber-600',
  Pending: 'text-slate-500',
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
    <div className="min-h-screen">
      <div className="h-[calc(100vh-60px)] flex">
        {/* Left: Students list (card-wrapped like right side) */}
        <div className="w-1/2 border-r border-slate-200">
          <div className="p-4 h-full">
            <div className="rounded-xl border border-slate-200 bg-white h-full overflow-auto p-2">
              <div className="border border-gray-300 rounded-md overflow-hidden">
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
                          onClick={() => setSelectedStudentId(s.id)}
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
                              {s.totalScore}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Submission detail */}
        <div className="w-1/2">
          {/* Detail (tabs moved inside card) */}
          <div className="p-4 h-full overflow-auto">
            {!selectedStudent || !selectedSubmission ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-slate-500">Chưa có bài nộp.</p>
              </div>
            ) : (
              <SubmissionDetailMock
                studentName={selectedStudent.name}
                problems={problems}
                activeProblemId={activeProblemId}
                onSelectProblem={setActiveProblemId}
                submission={{
                  id: `${selectedStudent.id}-${activeProblemId}`,
                  status: selectedSubmission.status,
                  score: selectedSubmission.score,
                  runtimeSec: Math.max(
                    0,
                    Math.round(selectedSubmission.timeMs / 1000)
                  ),
                  memoryBytes: Math.max(0, selectedSubmission.memoryKb * 1024),
                  languageName: selectedSubmission.language,
                  sourceCode: selectedSubmission.code,
                  passedTests: selectedSubmission.status === 'AC' ? 20 : 10, // mock
                  totalTests: 20, // mock
                  submittedAt: selectedSubmission.submittedAt,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div className="p-3 rounded-md border border-slate-200 bg-white">
      <p className="text-xs text-slate-500">{label}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function SubmissionDetailMock({
  studentName,
  problems,
  activeProblemId,
  onSelectProblem,
  submission,
}: {
  studentName: string;
  problems: Problem[];
  activeProblemId: string;
  onSelectProblem: (id: string) => void;
  submission: {
    id: string;
    status: Submission['status'];
    score: number;
    runtimeSec: number;
    memoryBytes: number;
    languageName: string;
    sourceCode: string;
    passedTests: number;
    totalTests: number;
    submittedAt: string;
  };
}) {
  const statusMeta = getStatusMeta(submission.status);

  const formatRuntime = (sec: number) =>
    `${Math.max(0, sec * 1000).toFixed(0)}ms`;
  const formatMemory = (bytes: number) =>
    `${Math.max(0, bytes / 1024).toFixed(0)} KB`;

  const handleCopy = () => {
    navigator.clipboard.writeText(submission.sourceCode);
  };

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let t: any;
    const onScroll = () => {
      setIsScrolling(true);
      clearTimeout(t);
      t = setTimeout(() => setIsScrolling(false), 700);
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const getSyntaxLanguage = (languageName: string) => {
    const name = languageName.toLowerCase();
    if (name.includes('python')) return 'python';
    if (name.includes('java ')) return 'java';
    if (name.includes('java')) return 'java';
    if (name.includes('c++') || name.includes('cpp')) return 'cpp';
    if (name === 'c') return 'c';
    if (name.includes('pypy')) return 'python';
    return 'plaintext';
  };

  const getCodeHeight = () => {
    const lines = submission.sourceCode.split('\n').length;
    const lineHeight = 22;
    const padding = 40;
    const total = Math.max(lines * lineHeight + padding, 200);
    return { height: `${total}px` };
  };

  return (
    <div className="h-full pr-3">
      <div
        className="rounded-xl border border-slate-200 bg-white h-full overflow-y-auto"
        ref={scrollRef}
      >
        {/* Tabs inside card */}
        <div className="border-b bg-white sticky top-0 z-10">
          <div className="flex items-center justify-center gap-3 px-4 h-12">
            <div className="flex items-center gap-2 max-w-[640px] w-full justify-center mx-auto">
              {problems.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => onSelectProblem(p.id)}
                  className={`px-4 py-2 rounded-none text-sm font-medium whitespace-nowrap transition border ${
                    activeProblemId === p.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`p-8 space-y-8 ${isScrolling ? 'scrolling' : ''}`}>
          {/* Status */}
          <div
            className={`p-5 rounded-lg border ${statusMeta.border} ${statusMeta.bg}`}
          >
            <div className="flex items-center gap-3 text-lg font-semibold">
              <span className={statusMeta.iconColor}>{statusMeta.icon}</span>
              <span className={statusMeta.text}>{statusMeta.label}</span>
            </div>
            <div className="text-slate-600 mt-2">
              {submission.passedTests}/{submission.totalTests} test cases passed
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-slate-200 p-5 bg-slate-50">
              <div className="text-xs text-slate-500">SCORE</div>
              <div className="mt-1 text-2xl font-semibold text-slate-800">
                {submission.score} / 100
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 p-5 bg-slate-50">
              <div className="text-xs text-slate-500">RUNTIME</div>
              <div className="mt-1 text-2xl font-semibold text-slate-800">
                {formatRuntime(submission.runtimeSec)}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 p-5 bg-slate-50">
              <div className="text-xs text-slate-500">MEMORY</div>
              <div className="mt-1 text-2xl font-semibold text-slate-800">
                {formatMemory(submission.memoryBytes)}
              </div>
            </div>
          </div>

          {/* Source Code */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-slate-700">Source Code</div>
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="text-xs px-2 py-1 border border-slate-200 bg-white hover:bg-slate-50"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-gray-50">
              <div className="relative" style={getCodeHeight()}>
                <SyntaxHighlighter
                  language={getSyntaxLanguage(submission.languageName)}
                  style={tomorrow}
                  customStyle={{
                    margin: 0,
                    borderRadius: '0',
                    fontSize: '14px',
                    lineHeight: '22px',
                    fontFamily:
                      "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', 'Monaco', 'Courier New', monospace",
                    letterSpacing: '0.3px',
                    background: '#f5f5f5',
                    color: '#24292e',
                    padding: '20px',
                    overflow: 'auto',
                  }}
                  showLineNumbers={true}
                  lineNumberStyle={{
                    color: '#6a737d',
                    marginRight: '16px',
                    userSelect: 'none',
                    fontSize: '12px',
                  }}
                  wrapLines={true}
                  wrapLongLines={true}
                >
                  {submission.sourceCode}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusMeta(status: Submission['status']) {
  switch (status) {
    case 'AC':
      return {
        label: 'Accepted',
        border: 'border-green-200',
        bg: 'bg-green-50',
        text: 'text-green-700',
        icon: '✅',
        iconColor: 'text-green-700',
      };
    case 'WA':
      return {
        label: 'Wrong Answer',
        border: 'border-red-200',
        bg: 'bg-red-50',
        text: 'text-red-700',
        icon: '❌',
        iconColor: 'text-red-700',
      };
    case 'TLE':
      return {
        label: 'Time Limit Exceeded',
        border: 'border-orange-200',
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        icon: '⏱️',
        iconColor: 'text-orange-700',
      };
    case 'CE':
      return {
        label: 'Compile Error',
        border: 'border-slate-300',
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        icon: '🧱',
        iconColor: 'text-slate-700',
      };
    case 'RE':
      return {
        label: 'Runtime Error',
        border: 'border-amber-200',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        icon: '⚠️',
        iconColor: 'text-amber-700',
      };
    default:
      return {
        label: 'Pending',
        border: 'border-slate-200',
        bg: 'bg-slate-50',
        text: 'text-slate-600',
        icon: '⏳',
        iconColor: 'text-slate-600',
      };
  }
}
