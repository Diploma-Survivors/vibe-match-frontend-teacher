'use client';

import ProblemForm, { ProblemFormMode } from '@/components/problem-form';
import { Button } from '@/components/ui/button';
import { mockProblems } from '@/lib/data/mock-problems';
import type { ProblemData } from '@types/problems';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProblemDetailsPage() {
  const params = useParams();
  const problemId = params.id as string;

  const [problemData, setProblemData] = useState<ProblemData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load existing problem data
  useEffect(() => {
    const loadProblemData = () => {
      const existingProblem = mockProblems.find((p) => p.id === problemId);
      if (existingProblem) {
        // Convert existing problem to view format
        setProblemData({
          name: existingProblem.title,
          description:
            'Cho số nguyên dương N, liệt kê phi hàm euler của các số từ 1 tới N và in ra màn hình.\n\nPhi hàm euler của số X hiển số lượng số nguyên tố cùng nhau với X nằm trong khoảng từ [1, X].',
          inputDescription: 'Dòng duy nhất chứa số nguyên N (1 ≤ N ≤ 10^6)',
          outputDescription:
            'In ra phi hàm euler của các số từ 1 tới N, mỗi số cách nhau một khoảng trắng',
          timeLimit: '2000',
          memoryLimit: '256',
          difficulty: existingProblem.difficulty,
          topic: existingProblem.topic,
          tags: existingProblem.tags,
          accessRange: existingProblem.accessRange,
          testCases: [
            {
              id: '1',
              input: '5',
              expectedOutput: '1 1 2 2 4',
              isSample: true,
            },
            {
              id: '2',
              input: '10',
              expectedOutput: '1 1 2 2 4 2 6 4 6 4',
              isSample: true,
            },
            {
              id: '3',
              input: '1',
              expectedOutput: '1',
              isSample: false,
            },
          ],
        });
      }
      setIsLoading(false);
    };

    loadProblemData();
  }, [problemId]);

  const handleSave = async (data: ProblemData) => {
    // This won't be called in view mode
    console.log('View mode - save not available');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 dark:from-slate-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            Đang tải dữ liệu bài tập...
          </p>
        </div>
      </div>
    );
  }

  if (!problemData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 dark:from-slate-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-4">
            Không tìm thấy bài tập
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Bài tập với ID "{problemId}" không tồn tại.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 dark:from-slate-900 dark:via-green-900 dark:to-emerald-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/problems">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-slate-600 hover:text-green-600 dark:text-slate-400 dark:hover:text-emerald-400"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại danh sách
                </Button>
              </Link>
            </div>
            <Link href={`/problems/${problemId}/edit`}>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6">
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <ProblemForm
          initialData={problemData}
          mode={ProblemFormMode.VIEW}
          onSave={handleSave}
          isSaving={false}
          title="Chi tiết bài tập"
          subtitle={''}
        />
      </div>
    </div>
  );
}
