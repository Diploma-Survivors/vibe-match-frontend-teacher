'use client';

import ProblemCreateForm from '@/components/problem-create-form';

export default function CreateProblemPage() {
  return (
    <div className="container mx-auto py-8 px-6 pt-0">
      <div className="mb-8">
        <div className="mt-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Tạo Bài Tập Mới
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Thiết lập bài tập lập trình đa bước với quy trình chi tiết.
          </p>
        </div>
      </div>

      <ProblemCreateForm />
    </div>
  );
}
