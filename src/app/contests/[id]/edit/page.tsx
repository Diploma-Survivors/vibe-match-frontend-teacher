'use client';

import ContestForm, { ContestFormMode } from '@/components/contest-form';
import { Button } from '@/components/ui/button';
import type { Contest } from '@/types/contest';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// interface ContestData {
//   name: string;
//   description: string;
//   startTime: string;
//   endTime: string;
//   duration: number;
//   accessRange: string;
//   problems: string[];
//   participants?: number;
//   maxParticipants?: number;
//   status?: string;
//   createdBy?: string;
//   createdAt?: string;
// }

export default function EditContestPage() {
  //   const router = useRouter();
  //   const params = useParams();
  //   const contestId = params.id;

  //   const [contestData, setContestData] = useState<Contest | null>(null);
  //   const [isSaving, setIsSaving] = useState(false);
  //   const [isLoading, setIsLoading] = useState(true);

  //   // Load existing contest data
  //   useEffect(() => {
  //     const loadContestData = () => {
  //       const existingContest = mockContests.find((c) => c.id === contestId);
  //       if (existingContest) {
  //         setContestData({
  //           name: existingContest.name,
  //           description: existingContest.description,
  //           startTime: existingContest.startTime,
  //           endTime: existingContest.endTime,
  //           durationMinutes: existingContest.durationMinutes,
  //           problems: [],
  //           status: existingContest.status,
  //           createdBy: existingContest.createdBy,
  //           createdAt: existingContest.createdAt,
  //         });
  //       }
  //       setIsLoading(false);
  //     };

  //     loadContestData();
  //   }, [contestId]);

  //   const handleSave = async (data: Contest) => {
  //     setIsSaving(true);
  //     // Simulate saving
  //     await new Promise((resolve) => setTimeout(resolve, 2000));
  //     console.log('Updating contest:', data);
  //     setIsSaving(false);
  //     // Here you would typically save to your backend
  //     // router.push(`/contests/${contestId}`);
  //   };

  //   if (isLoading) {
  //     return (
  //       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
  //         <div className="text-center">
  //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
  //           <p className="text-slate-600 dark:text-slate-400">
  //             Đang tải dữ liệu cuộc thi...
  //           </p>
  //         </div>
  //       </div>
  //     );
  //   }

  //   if (!contestData) {
  //     return (
  //       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
  //         <div className="text-center">
  //           <h1 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-4">
  //             Không tìm thấy cuộc thi
  //           </h1>
  //           <p className="text-slate-500 dark:text-slate-400">
  //             Cuộc thi với ID "{contestId}" không tồn tại.
  //           </p>
  //         </div>
  //       </div>
  //     );
  //   }

  return (
    <div />
    // <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
    //   {/* Header */}
    //   <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50">
    //     <div className="container mx-auto px-6 py-6">
    //       <div className="flex items-center justify-between">
    //         <div className="flex items-center gap-4">
    //           <Link href={`/contests/${contestId}`}>
    //             <Button
    //               variant="ghost"
    //               size="sm"
    //               className="gap-2 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
    //             >
    //               <ArrowLeft className="w-4 h-4" />
    //               Quay lại chi tiết
    //             </Button>
    //           </Link>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Main Content */}
    //   <div className="container mx-auto px-6 py-8">
    //     <ContestForm
    //       initialData={contestData}
    //       mode={ContestFormMode.EDIT}
    //       onSave={handleSave}
    //       isSaving={isSaving}
    //       title="Chỉnh sửa cuộc thi"
    //       subtitle={`ID: ${contestId} - Cập nhật thông tin và cài đặt cuộc thi`}
    //     />
    //   </div>
    // </div>
  );
}
