'use client';

import ContestForm, { ContestFormMode } from '@/components/contest-form';
import { Button } from '@/components/ui/button';
import { mockContests } from '@/lib/data/mock-contests';
import type { Contest } from '@/types/contest';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ContestDetailPage() {
  const params = useParams();
  const contestId = params.id;

  const [contestData, setContestData] = useState<Contest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load existing contest data
  useEffect(() => {
    const loadContestData = () => {
      const existingContest = mockContests.find((c) => c.id === contestId);
      if (existingContest) {
        setContestData({
          name: existingContest.name,
          description: existingContest.description,
          startTime: existingContest.startTime,
          endTime: existingContest.endTime,
          durationMinutes: existingContest.durationMinutes,
          problems: [],
          status: existingContest.status,
          createdBy: existingContest.createdBy,
          createdAt: existingContest.createdAt,
        });
      }
      setIsLoading(false);
    };

    loadContestData();
  }, [contestId]);

  const handleSave = async (data: Contest) => {
    // This won't be called in view mode
    console.log('View mode - save not available');
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 2:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      case 3:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 dark:from-slate-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">
            Đang tải dữ liệu cuộc thi...
          </p>
        </div>
      </div>
    );
  }

  if (!contestData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 dark:from-slate-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-4">
            Không tìm thấy cuộc thi
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Cuộc thi với ID "{contestId}" không tồn tại.
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
              <Link href="/contests">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-slate-600 hover:text-green-600 dark:text-slate-400 dark:hover:text-green-400"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại danh sách
                </Button>
              </Link>
            </div>
            <Link href={`/contests/${contestId}/edit`}>
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
        <div className="space-y-8">
          {/* Contest Information */}
          <ContestForm
            initialData={contestData}
            mode={ContestFormMode.VIEW}
            onSave={handleSave}
            isSaving={false}
            title="Chi tiết cuộc thi"
            subtitle={''}
          />
        </div>
      </div>
    </div>
  );
}
