'use client';

import ProblemForm, { ProblemFormMode } from '@/components/problem-form';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/app-context';
import { LtiService } from '@/services/lti-service';
import { ProblemsService } from '@/services/problems-service';
import { type CreateProblemRequest, ProblemDifficulty } from '@/types/problems';
import { IssuerType } from '@/types/states';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CreateProblemPage() {
  const [isSaving, setIsSaving] = useState(false);
  const { shouldHideNavigation, issuer } = useApp();

  const handleSave = async (
    data: CreateProblemRequest,
    testcaseFile?: File
  ) => {
    setIsSaving(true);

    try {
      let result: any;

      if (testcaseFile) {
        result = await ProblemsService.createProblemComplete(
          data,
          testcaseFile
        );
      }

      // Handle deep linking response
      if (issuer === IssuerType.MOODLE && result.id) {
        try {
          await LtiService.sendDeepLinkingResponse(result.id);
          console.log('Deep linking response sent successfully');
        } catch (dlError) {
          console.error('Failed to send deep linking response:', dlError);
        }
      }
    } catch (error) {
      console.error('Failed to create problem:', error);
      alert('Failed to create problem. Please try again.');
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
                <Link href="/problems">
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
        <ProblemForm
          mode={ProblemFormMode.CREATE}
          onSave={handleSave}
          isSaving={isSaving}
          title="Tạo bài tập mới"
          subtitle="Tạo bài tập lập trình cho học sinh"
        />
      </div>
    </div>
  );
}
