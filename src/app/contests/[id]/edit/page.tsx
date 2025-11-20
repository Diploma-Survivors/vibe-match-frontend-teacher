'use client';

import ContestForm, { ContestFormMode } from '@/components/contest-form';
import ContestDescription from '@/components/contests/tabs/edit/contest-description';
import ContestEditSkeleton from '@/components/contests/tabs/edit/contest-edit-skeleton';
import ContestInfo from '@/components/contests/tabs/edit/contest-info';
import ContestProblemList from '@/components/contests/tabs/edit/contest-problem-list';
import ContestQuickStats from '@/components/contests/tabs/edit/contest-quick-stats';
import { Button } from '@/components/ui/button';
import { ContestsService } from '@/services/contests-service';
import { toastService } from '@/services/toasts-service';
import { HttpStatus } from '@/types/api';
import type { Contest } from '@/types/contest';
import { X } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export default function EditContestPage() {
  const params = useParams();
  const contestId = params.id as string;

  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchContestData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ContestsService.getContestById(contestId);
      setContest(response?.data?.data);

      console.log(response?.data?.data);
    } catch (error) {
      console.error('Error fetching contest:', error);
    } finally {
      setLoading(false);
    }
  }, [contestId]);

  useEffect(() => {
    fetchContestData();
  }, [fetchContestData]);

  const handleSave = async (data: Contest) => {
    setIsSaving(true);

    try {
      const contestDTO = ContestsService.mapContestToDTO(data);
      const response = await ContestsService.updateContest(
        contestId,
        contestDTO
      );

      if (response.data.status === HttpStatus.OK) {
        toastService.success('Cập nhật cuộc thi thành công!');
        setShowEditModal(false);
        // Refresh contest data
        await fetchContestData();
      }
    } catch (error) {
      toastService.error('Cập nhật cuộc thi không thành công!');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <ContestEditSkeleton />;
  }

  if (!contest) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="border border-gray-300 p-8 max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Không tìm thấy cuộc thi
          </h2>
        </div>
      </div>
    );
  }

  const totalScore = contest.problems.reduce(
    (sum, p) => sum + (typeof p.score === 'number' ? p.score : 0),
    0
  );

  return (
    <div className="min-h-screen py-6">
      <div className="w-full px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            <ContestDescription
              name={contest.name}
              description={contest.description}
              onEditClick={() => setShowEditModal(true)}
            />
            <ContestProblemList problems={contest.problems} />
          </div>

          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <ContestInfo contest={contest} />
            <ContestQuickStats
              problemCount={contest.problems.length}
              totalScore={totalScore}
              durationMinutes={contest.durationMinutes || 0}
            />
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && contest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-300 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                Chỉnh sửa cuộc thi
              </h2>
              <Button
                type="button"
                onClick={() => setShowEditModal(false)}
                variant="ghost"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <ContestForm
                initialData={contest}
                mode={ContestFormMode.EDIT}
                onSave={handleSave}
                isSaving={isSaving}
                title="Chỉnh sửa cuộc thi"
                subtitle="Cập nhật thông tin và cấu hình cuộc thi"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
