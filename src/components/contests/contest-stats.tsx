'use client';

import { Card, CardContent } from '@/components/ui/card';
import type { Contest } from '@/types/contest';
import { BarChart3, Clock, Trophy, Users } from 'lucide-react';

// 1. Define the props the component will accept. It needs the contest data.
interface ContestStatsProps {
  contest: Contest;
}

// 2. Move the helper function here, as it's only used by this component.
const getStatusColor = (status?: string) => {
  switch (status) {
    case 'chưa bắt đầu':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'đang diễn ra':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'đã kết thúc':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  }
};

// 3. Define the component. It's now clean, self-contained, and focused on one task.
export default function ContestStats({ contest }: ContestStatsProps) {
  // const durationHours = Math.floor(contest.durationMinutes / 60);
  // const durationRemainingMinutes = contest.durationMinutes % 60;

  return (
    <div />
    // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    //   {/* Status Card */}
    //   <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
    //     <CardContent className="p-6">
    //       <div className="flex items-center gap-4">
    //         <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600">
    //           <Trophy className="w-6 h-6 text-white" />
    //         </div>
    //         <div>
    //           <p className="text-sm text-slate-600 dark:text-slate-400">
    //             Trạng thái
    //           </p>
    //           <div
    //             className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
    //               contest.status
    //             )}`}
    //           >
    //             {contest.status}
    //           </div>
    //         </div>
    //       </div>
    //     </CardContent>
    //   </Card>

    //   {/* Participants Card (original code was commented out) */}
    //   <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
    //     <CardContent className="p-6">
    //       <div className="flex items-center gap-4">
    //         <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600">
    //           <Users className="w-6 h-6 text-white" />
    //         </div>
    //         {/*
    //         <div>
    //           <p className="text-sm text-slate-600 dark:text-slate-400">
    //             Thí sinh
    //           </p>
    //           <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
    //             {contest.participants || 0}
    //           </p>
    //         </div>
    //         */}
    //       </div>
    //     </CardContent>
    //   </Card>

    //   {/* Problems Count Card */}
    //   <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
    //     <CardContent className="p-6">
    //       <div className="flex items-center gap-4">
    //         <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600">
    //           <BarChart3 className="w-6 h-6 text-white" />
    //         </div>
    //         <div>
    //           <p className="text-sm text-slate-600 dark:text-slate-400">
    //             Số bài
    //           </p>
    //           <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
    //             {contest.problems.length}
    //           </p>
    //         </div>
    //       </div>
    //     </CardContent>
    //   </Card>

    //   {/* Duration Card */}
    //   <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
    //     <CardContent className="p-6">
    //       <div className="flex items-center gap-4">
    //         <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600">
    //           <Clock className="w-6 h-6 text-white" />
    //         </div>
    //         <div>
    //           <p className="text-sm text-slate-600 dark:text-slate-400">
    //             Thời lượng
    //           </p>
    //           <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
    //             {durationHours}h {durationRemainingMinutes}m
    //           </p>
    //         </div>
    //       </div>
    //     </CardContent>
    //   </Card>
    // </div>
  );
}
