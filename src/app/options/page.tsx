'use client';

import ProblemForm, { ProblemFormMode } from '@/components/problem-form';
import ProblemList, { ProblemListMode } from '@/components/problem-list';
import { Button } from '@/components/ui/button';
import { LtiService } from '@/services/lti-service';
import { type ProblemData, ProblemEndpointType } from '@/types/problems';
import { ChevronRight, File, FilePlus, Trophy, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function OptionsPage() {
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [showProblemDetailModal, setShowProblemDetailModal] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<ProblemData | null>(
    null
  );
  const [problemData, setProblemData] = useState<ProblemData | null>(null);

  const handleProblemSelectionClick = () => {
    setShowProblemModal(true);
  };

  const handleViewProblemDetail = async (problem: ProblemData) => {
    setSelectedProblem(problem);
    setShowProblemDetailModal(true);
  };

  const handleProblemSelectForDeeplinkingResponse = async (
    problem: ProblemData
  ) => {
    try {
      const response = await LtiService.sendDeepLinkingResponse(problem.id);
    } catch (error) {
      console.error('Error sending deep linking response:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 dark:from-slate-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center">
      {/* Non-dismissible modal */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-white/20 dark:border-slate-700/50 backdrop-blur-xl">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Chào mừng đến với SolVibe
          </h2>
          <p className="text-center text-slate-600 dark:text-slate-400 mt-2">
            Hãy chọn một tùy chọn để bắt đầu
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Option 1: Create Assignment (with links) */}
          <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-6 border border-slate-200/50 dark:border-slate-600/50 hover:shadow-md transition-all duration-200">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <File className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Tạo assignment
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Tạo bài tập mới hoặc chọn từ bài tập có sẵn
                </p>

                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="w-full justify-between border-slate-200 dark:border-slate-600"
                    onClick={() => handleProblemSelectionClick()}
                  >
                    Chọn một problem có sẵn
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>

                  <Link href="/problems/create" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full justify-between border-slate-200 dark:border-slate-600"
                    >
                      Tạo một problem mới
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Option 2: Create Contest */}
          <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-6 border border-slate-200/50 dark:border-slate-600/50 hover:shadow-md transition-all duration-200">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Trophy className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  Tạo contest mới
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Tạo một cuộc thi lập trình mới cho học sinh
                </p>

                <Link href="/contests/create" className="w-full block">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                    Tạo contest <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problems Selection Modal */}
      {showProblemModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-8xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-2 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Chọn bài tập
                </h2>
                <Button
                  onClick={() => setShowProblemModal(false)}
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="px-2 overflow-y-auto no-top-offset ">
              <ProblemList
                mode={ProblemListMode.SELECT}
                endpointType={ProblemEndpointType.SELECTABLE_FOR_ASSIGNMENT}
                onProblemView={handleViewProblemDetail}
                onProblemSelect={handleProblemSelectForDeeplinkingResponse}
              />
            </div>
          </div>
        </div>
      )}

      {/* Problems Detail Modal */}
      {showProblemDetailModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Chi tiết bài tập
              </h2>
              <div>
                {selectedProblem && (
                  <Button
                    onClick={() => {
                      if (selectedProblem) {
                        handleProblemSelectForDeeplinkingResponse(
                          selectedProblem
                        );
                        setShowProblemDetailModal(false);
                        setShowProblemModal(false);
                      }
                    }}
                    className="mr-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    Chọn bài tập này
                  </Button>
                )}
                <Button
                  onClick={() => setShowProblemDetailModal(false)}
                  variant="ghost"
                  size="sm"
                  className="rounded-full w-8 h-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {selectedProblem ? (
                <ProblemForm
                  initialData={selectedProblem}
                  mode={ProblemFormMode.VIEW}
                  isSaving={false}
                  title="Chi tiết bài tập"
                  subtitle="Thông tin chi tiết về bài tập này"
                />
              ) : (
                <div className="text-center text-slate-500 py-10">
                  Không thể tải thông tin bài tập. Vui lòng thử lại sau.
                </div>
              )}
            </div>
            {/* <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <Button
                onClick={() => setShowProblemDetailModal(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 mr-2"
              >
                Đóng
              </Button>
              <Button
                onClick={() => {
                  console.log('Selected problem ID:', selectedProblemId);
                  if (selectedProblemId) {
                    console.log('Selected problem ID:', selectedProblemId);
                    setShowProblemDetailModal(false);
                    handleProblemSelectForDeeplinkingResponse(selectedProblemId);
                  }
                }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                Chọn bài tập này a
              </Button>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
}
