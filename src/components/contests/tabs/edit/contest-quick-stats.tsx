interface ContestQuickStatsProps {
  problemCount: number;
  totalScore: number;
  durationMinutes: number;
}

export default function ContestQuickStats({
  problemCount,
  totalScore,
  durationMinutes,
}: ContestQuickStatsProps) {
  return (
    <div className="bg-white border border-gray-300 p-6">
      <h3 className="font-bold mb-4 text-gray-800">Thống kê nhanh</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Số bài tập:</span>
          <span className="font-semibold text-gray-800">
            {problemCount} bài
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Điểm tối đa:</span>
          <span className="font-semibold text-gray-800">{totalScore}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Thời lượng:</span>
          <span className="font-semibold text-green-600">
            {durationMinutes} phút
          </span>
        </div>
      </div>
    </div>
  );
}
