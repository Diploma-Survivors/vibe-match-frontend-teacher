import Loading from "@/components/ui/loading";

export default function EditProblemLoading() {
  return (
    <Loading 
      title="Đang tải form chỉnh sửa..."
      description="Vui lòng chờ trong khi chúng tôi tải dữ liệu bài tập"
    />
  );
}