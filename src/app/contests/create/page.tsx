'use client';

import ContestForm, { ContestFormMode } from '@/components/contest-form';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/app-context';
import { ContestsService } from '@/services/contests-service';
import { LtiService, ResourceType } from '@/services/lti-service';
import { toastService } from '@/services/toasts-service';
import { type Contest, ContestStatus } from '@/types/contest';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CreateContestPage() {
  const [isSaving, setIsSaving] = useState(false);
  const { shouldHideNavigation } = useApp();

  const initialData: Contest = {
    name: '',
    description: '',
    startTime: '',
    endTime: '',
    durationMinutes: 180,
    status: ContestStatus.PRIVATE,
    problems: [],
  };

  const handleSave = async (data: Contest) => {
    setIsSaving(true);

    try {
      const contestDTO = ContestsService.mapContestToDTO(data);

      const response = await ContestsService.createContest(contestDTO);
      const newContestId = response?.data?.data?.id;

      if (newContestId) {
        await LtiService.sendDeepLinkingResponse(
          newContestId,
          ResourceType.CONTEST
        );
        toastService.success(
          'Contest created and deep linking completed successfully!'
        );
      }
    } catch (error) {
      // do nothing as error is handled in axios interceptor
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 dark:from-slate-900 dark:via-green-900 dark:to-emerald-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {shouldHideNavigation ? (
                <Link href="/options">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-slate-600 hover:text-green-600 dark:text-slate-400 dark:hover:text-green-400"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại trang lựa chọn
                  </Button>
                </Link>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <ContestForm
          initialData={initialData}
          mode={ContestFormMode.CREATE}
          onSave={handleSave}
          isSaving={isSaving}
          title="Tạo cuộc thi mới"
          subtitle="Thiết lập thông tin và cấu hình cuộc thi lập trình"
        />
      </div>
    </div>
  );
}
