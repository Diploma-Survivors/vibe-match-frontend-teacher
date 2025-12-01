'use client';

import ProblemList, { ProblemListMode } from '@/components/problem-list';
import { type ProblemData, ProblemEndpointType } from '@/types/problems';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function ProblemsPage() {
  const router = useRouter();

  const handleProblemView = useCallback(
    (problem: ProblemData) => {
      console.log(problem.id);
      router.push(`/problems/${problem.id}/edit`);
    },
    [router]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-100 bg-clip-text text-transparent mb-2">
                Vibe Match Problems
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Khám phá và chinh phục hàng ngàn bài tập lập trình
              </p>
            </div>
            {/*<ProblemStats problems={problems} />*/}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <ProblemList
        mode={ProblemListMode.VIEW}
        endpointType={ProblemEndpointType.PROBLEM_MANAGEMENT}
        onProblemView={handleProblemView}
      />
    </div>
  );
}
