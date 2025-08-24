'use client'
import Loading from "@/components/ui/loading";

export default function ProblemsLoading() {
  return (
    <Loading 
      title="Đang tải danh sách bài tập..."
      description="Vui lòng chờ trong khi chúng tôi tải dữ liệu bài tập"
    />
  );
}