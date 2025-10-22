'use client';

import ProblemForm, { ProblemFormMode } from '@/components/problem-form';
import { Button } from '@/components/ui/button';
import {
  type CreateProblemRequest,
  type ProblemData,
  ProblemDifficulty,
  ProblemType,
} from '@/types/problems';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProblemDetailsPage() {
  //   const params = useParams();
  //   const problemId = Number.parseInt(params.id as string, 10);

  //   const [problemData, setProblemData] = useState<ProblemData | null>(null);
  //   const [isLoading, setIsLoading] = useState(true);

  //   // Load existing problem data
  //   useEffect(() => {
  //     const loadProblemData = () => {
  //       const existingProblem = mockProblems.find((p) => p.id === problemId);
  //       if (existingProblem) {
  //         // Convert existing problem to view format
  //         setProblemData({
  //           id: 1,
  //           title: 'Two Sum',
  //           description: `
  //                       <p>Cho một mảng các số nguyên <code>nums</code> và một số nguyên <code>target</code>, hãy trả về các chỉ số của hai số sao cho tổng của chúng bằng <code>target</code>.</p>

  //                       <p>Bạn có thể giả định rằng mỗi đầu vào sẽ có chính xác một lời giải, và bạn không thể sử dụng cùng một phần tử hai lần.</p>

  //                       <p>Bạn có thể trả về câu trả lời theo bất kỳ thứ tự nào.</p>

  //                       <h3>Ví dụ 1:</h3>
  //                       <pre>
  //                       Input: nums = [2,7,11,15], target = 9
  //                       Output: [0,1]
  //                       Giải thích: Vì nums[0] + nums[1] == 9, chúng ta trả về [0, 1].
  //                       </pre>

  //                       <h3>Ví dụ 2:</h3>
  //                       <pre>
  //                       Input: nums = [3,2,4], target = 6
  //                       Output: [1,2]
  //                       </pre>
  //                     `,
  //           inputDescription: `
  //                       <p>Dòng đầu tiên chứa hai số nguyên <code>n</code> và <code>target</code> (1 ≤ n ≤ 10^4, -10^9 ≤ target ≤ 10^9)</p>
  //                       <p>Dòng thứ hai chứa <code>n</code> số nguyên <code>nums[i]</code> (-10^9 ≤ nums[i] ≤ 10^9)</p>
  //                     `,
  //           outputDescription: `
  //                       <p>In ra hai số nguyên là chỉ số của hai phần tử có tổng bằng target, cách nhau bởi dấu cách.</p>
  //                     `,
  //           maxScore: 100,
  //           timeLimitMs: 1000,
  //           memoryLimitKb: 256000,
  //           difficulty: ProblemDifficulty.EASY,
  //           type: ProblemType.STANDALONE,
  //           createdAt: '2024-01-15T10:30:00Z',
  //           updatedAt: '2024-01-20T14:45:00Z',
  //           tags: [1, 3, 5], // Array manipulation, Hash table, Two pointers
  //           topic: 1, // Data Structures
  //           testcase: 1,
  //           testcaseSamples: [
  //             {
  //               input: '4 9\n2 7 11 15',
  //               output: '0 1',
  //             },
  //             {
  //               input: '3 6\n3 2 4',
  //               output: '1 2',
  //             },
  //           ],
  //         });
  //       }
  //       setIsLoading(false);
  //     };

  //     loadProblemData();
  //   }, [problemId]);

  //   const handleSave = async (data: CreateProblemRequest) => {
  //     // This won't be called in view mode
  //     console.log('View mode - save not available');
  //   };

  //   if (isLoading) {
  //     return (
  //       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 dark:from-slate-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center">
  //         <div className="text-center">
  //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
  //           <p className="text-slate-600 dark:text-slate-400">
  //             Đang tải dữ liệu bài tập...
  //           </p>
  //         </div>
  //       </div>
  //     );
  //   }

  //   if (!problemData) {
  //     return (
  //       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 dark:from-slate-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center">
  //         <div className="text-center">
  //           <h1 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-4">
  //             Không tìm thấy bài tập
  //           </h1>
  //           <p className="text-slate-500 dark:text-slate-400">
  //             Bài tập với ID "{problemId}" không tồn tại.
  //           </p>
  //         </div>
  //       </div>
  //     );
  //   }

  return (
    <div />
    // <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 dark:from-slate-900 dark:via-green-900 dark:to-emerald-900">
    //   {/* Header */}
    //   <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50">
    //     <div className="container mx-auto px-6 py-6">
    //       <div className="flex items-center justify-between">
    //         <div className="flex items-center gap-4">
    //           <Link href="/problems">
    //             <Button
    //               variant="ghost"
    //               size="sm"
    //               className="gap-2 text-slate-600 hover:text-green-600 dark:text-slate-400 dark:hover:text-emerald-400"
    //             >
    //               <ArrowLeft className="w-4 h-4" />
    //               Quay lại danh sách
    //             </Button>
    //           </Link>
    //         </div>
    //         <Link href={`/problems/${problemId}/edit`}>
    //           <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6">
    //             <Edit className="w-4 h-4 mr-2" />
    //             Chỉnh sửa
    //           </Button>
    //         </Link>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Main Content */}
    //   <div className="container mx-auto px-6 py-8">
    //     <ProblemForm
    //       initialData={problemData}
    //       mode={ProblemFormMode.VIEW}
    //       onSave={handleSave}
    //       isSaving={false}
    //       title="Chi tiết bài tập"
    //       subtitle={''}
    //     />
    //   </div>
    // </div>
  );
}
