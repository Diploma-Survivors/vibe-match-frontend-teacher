import type { Contest } from '@/types/contest';
import { Calendar, Clock, Users } from 'lucide-react';

interface ContestInfoProps {
  contest: Contest;
}

export default function ContestInfo({ contest }: ContestInfoProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const startTime = new Date(contest.startTime);
  const endTime = new Date(contest.endTime);

  return (
    <div className="bg-white border border-gray-300 p-6">
      <h3 className="font-bold mb-4 text-gray-800">Thông tin cuộc thi</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-gray-50">
          <Calendar className="w-5 h-5 text-green-600" />
          <div className="flex-1">
            <p className="text-xs text-gray-600">Ngày bắt đầu</p>
            <p className="text-sm font-medium text-gray-800">
              {formatDate(startTime)} {formatTime(startTime)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50">
          <Calendar className="w-5 h-5 text-green-600" />
          <div className="flex-1">
            <p className="text-xs text-gray-600">Ngày kết thúc</p>
            <p className="text-sm font-medium text-gray-800">
              {formatDate(endTime)} {formatTime(endTime)}
            </p>
          </div>
        </div>

        {contest.lateDeadline && (
          <div className="flex items-center gap-3 p-3 bg-gray-50">
            <Calendar className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <p className="text-xs text-gray-600">Deadline nộp muộn</p>
              <p className="text-sm font-medium text-gray-800">
                {formatDate(new Date(contest.lateDeadline))}{' '}
                {formatTime(new Date(contest.lateDeadline))}
              </p>
            </div>
          </div>
        )}

        {contest.isHasDurationMinutes && (
          <div className="flex items-center gap-3 p-3 bg-gray-50">
            <Clock className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <p className="text-xs text-gray-600">Thời lượng</p>
              <p className="text-sm font-medium text-gray-800">
                {contest.durationMinutes} phút
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 p-3 bg-gray-50">
          <Users className="w-5 h-5 text-purple-600" />
          <div className="flex-1">
            <p className="text-xs text-gray-600">Số bài tập</p>
            <p className="text-sm font-medium text-gray-800">
              {contest.problems.length} bài
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
