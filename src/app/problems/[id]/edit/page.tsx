'use client';

import ProblemForm, { ProblemFormMode } from '@/components/problem-form';
import { Button } from '@/components/ui/button';
import { ProblemsService } from '@/services/problems-service';
import type { ProblemData, ProblemDataResponse } from '@/types/problems';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditProblemPage() {
  const params = useParams();
  const problemId = Number.parseInt(params.id as string, 10);

  const [problemData, setProblemData] = useState<ProblemDataResponse | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load existing problem data
  useEffect(() => {
    const loadProblemData = async () => {
      setIsLoading(true);
      const response = await ProblemsService.getProblemDetail(problemId);
      console.log('Problem Loaded', response.data.data);
      setProblemData(response.data.data);
      setIsLoading(false);
    };

    loadProblemData();
  }, [problemId]);

  const handleSave = async (data: ProblemData) => {
    setIsSaving(true);
    await ProblemsService.updateProblem(data);
    setIsSaving(false);
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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <ProblemForm
          initialData={{
            ...problemData,
            testcaseResponse: problemData.testcase,
            testcase: null,
          }}
          mode={ProblemFormMode.EDIT}
          onSave={handleSave}
          isSaving={isSaving}
          title="Chỉnh sửa bài tập"
          subtitle={`ID: ${problemId} - Cập nhật thông tin bài tập`}
        />
      </div>
    </div>
  );
}
