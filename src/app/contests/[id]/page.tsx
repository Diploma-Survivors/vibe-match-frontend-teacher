"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockContests } from "@/lib/data/mock-contests";
import { mockProblems } from "@/lib/data/mock-problems";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  Trophy,
  Users,
  Settings,
  BarChart3,
  Download,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";


// Mock participants data
const mockParticipants = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    rank: 1,
    score: 100,
    solvedProblems: 5,
    totalTime: "2h 15m",
    status: "Hoàn thành",
  },
  {
    id: "2",
    name: "Trần Thị B",
    rank: 2,
    score: 85,
    solvedProblems: 4,
    totalTime: "2h 45m",
    status: "Hoàn thành",
  },
  {
    id: "3",
    name: "Lê Văn C",
    rank: 3,
    score: 75,
    solvedProblems: 4,
    totalTime: "2h 50m",
    status: "Hoàn thành",
  },
  {
    id: "4",
    name: "Phạm Thị D",
    rank: 4,
    score: 60,
    solvedProblems: 3,
    totalTime: "2h 30m",
    status: "Đang thi",
  },
  {
    id: "5",
    name: "Hoàng Văn E",
    rank: 5,
    score: 45,
    solvedProblems: 2,
    totalTime: "1h 45m",
    status: "Đang thi",
  },
];

export default function ContestDetailPage() {
  const params = useParams();
  const contest = mockContests.find((c) => c.id === params.id);

  if (!contest) {
    notFound();
  }

  const contestProblems = mockProblems.filter((problem) =>
    contest.problems.includes(problem.id)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "chưa bắt đầu":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "đang diễn ra":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "đã kết thúc":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case 2:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
      case 3:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300";
    }
  };

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
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  {contest.name}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  Chi tiết và thống kê cuộc thi
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/contests/${params.id}/edit`}>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                  <Edit className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Contest Info Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Trạng thái</p>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(contest.status)}`}>
                      {contest.status}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Thí sinh</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {contest.participants}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Số bài</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {contest.problems.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Thời lượng</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {Math.floor(contest.duration / 60)}h {contest.duration % 60}m
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contest Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Contest Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    Thông tin cuộc thi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Mô tả</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {contest.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Thời gian bắt đầu</h3>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Calendar className="w-4 h-4" />
                        {new Date(contest.startTime).toLocaleString("vi-VN")}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Thời gian kết thúc</h3>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Calendar className="w-4 h-4" />
                        {new Date(contest.endTime).toLocaleString("vi-VN")}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Phạm vi truy cập</h3>
                      <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                        contest.accessRange === "public"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                      }`}>
                        {contest.accessRange === "public" ? "Công khai" : "Riêng tư"}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Người tạo</h3>
                      <p className="text-slate-600 dark:text-slate-400">{contest.createdBy}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Problem List */}
              <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    Danh sách bài tập ({contestProblems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contestProblems.map((problem, index) => (
                      <div
                        key={problem.id}
                        className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl border border-slate-200/50 dark:border-slate-600/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <Link href={`/problems/${problem.id}`}>
                              <h3 className="font-semibold text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                {problem.title}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded">
                                {problem.id}
                              </span>
                              <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded">
                                {problem.difficulty}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {problem.acceptanceRate}% AC
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-500">
                            {problem.submissionCount} lần nộp
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}