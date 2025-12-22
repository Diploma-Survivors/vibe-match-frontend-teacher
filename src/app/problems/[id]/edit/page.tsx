import ProblemEditForm from '@/components/problem-edit-form';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProblemPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="container mx-auto py-8 px-6 pt-0">
      <div className="mb-8">
        <div className="mt-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Chỉnh Sửa Bài Tập
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Cập nhật thông tin và nội dung bài tập.
          </p>
        </div>
      </div>

      <ProblemEditForm problemId={Number.parseInt(id)} />
    </div>
  );
}
