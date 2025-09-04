"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockContests } from "@/lib/data/mock-contests";
import { mockProblems } from "@/lib/data/mock-problems";
import { Contest } from "@/types/contest";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Calendar,
  Clock,
  Users,
  Settings,
  Trash2,
  Plus,
  X,
} from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";

export default function ContestEditPage() {
  const params = useParams();
  const router = useRouter();
  const contest = mockContests.find((c) => c.id === params.id);

  if (!contest) {
    notFound();
  }

  // Form state
  const [formData, setFormData] = useState<Contest>({
    ...contest,
  });

  const [selectedProblems, setSelectedProblems] = useState<string[]>(contest.problems);
  const [isLoading, setIsLoading] = useState(false);

  // Handle form field changes
  const handleChange = (field: keyof Contest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle problem selection
  const addProblem = (problemId: string) => {
    if (!selectedProblems.includes(problemId)) {
      setSelectedProblems(prev => [...prev, problemId]);
      handleChange('problems', [...selectedProblems, problemId]);
    }
  };

  const removeProblem = (problemId: string) => {
    const updated = selectedProblems.filter(id => id !== problemId);
    setSelectedProblems(updated);
    handleChange('problems', updated);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would normally make an API call to update the contest
      console.log('Updated contest:', formData);
      
      // Redirect back to contest detail page
      router.push(`/contests/${params.id}`);
    } catch (error) {
      console.error('Error updating contest:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate duration from start and end times
  const calculateDuration = () => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      const durationMs = end.getTime() - start.getTime();
      const durationMinutes = Math.floor(durationMs / (1000 * 60));
      handleChange('duration', durationMinutes);
    }
  };

  const availableProblems = mockProblems.filter(problem => 
    !selectedProblems.includes(problem.id)
  );

  const contestProblems = mockProblems.filter(problem =>
    selectedProblems.includes(problem.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/contests/${params.id}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại chi tiết
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Chỉnh sửa cuộc thi
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  Cập nhật thông tin và cài đặt cuộc thi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Basic Information */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Info */}
              <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Thông tin cơ bản
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Tên cuộc thi *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Nhập tên cuộc thi"
                      className="bg-white/50 dark:bg-slate-700/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Mô tả *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      placeholder="Nhập mô tả cuộc thi"
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white/50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Phạm vi truy cập *
                      </label>
                      <Select
                        value={formData.accessRange}
                        onValueChange={(value: "public" | "private") => handleChange('accessRange', value)}
                      >
                        <SelectTrigger className="bg-white/50 dark:bg-slate-700/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Công khai</SelectItem>
                          <SelectItem value="private">Riêng tư</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Số thí sinh tối đa
                      </label>
                      <Input
                        type="number"
                        value={formData.maxParticipants || ''}
                        onChange={(e) => handleChange('maxParticipants', e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder="Không giới hạn"
                        className="bg-white/50 dark:bg-slate-700/50"
                        min="1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Time Settings */}
              <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Thời gian
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Thời gian bắt đầu *
                      </label>
                      <Input
                        type="datetime-local"
                        value={formData.startTime.slice(0, 16)}
                        onChange={(e) => {
                          handleChange('startTime', e.target.value);
                          calculateDuration();
                        }}
                        className="bg-white/50 dark:bg-slate-700/50"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Thời gian kết thúc *
                      </label>
                      <Input
                        type="datetime-local"
                        value={formData.endTime.slice(0, 16)}
                        onChange={(e) => {
                          handleChange('endTime', e.target.value);
                          calculateDuration();
                        }}
                        className="bg-white/50 dark:bg-slate-700/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Thời lượng (phút)
                    </label>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                        {Math.floor(formData.duration / 60)}h {formData.duration % 60}m
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Problem Selection */}
              <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    Danh sách bài tập ({selectedProblems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add Problem */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Thêm bài tập
                    </label>
                    <Select onValueChange={addProblem}>
                      <SelectTrigger className="bg-white/50 dark:bg-slate-700/50">
                        <SelectValue placeholder="Chọn bài tập để thêm" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProblems.map((problem) => (
                          <SelectItem key={problem.id} value={problem.id}>
                            {problem.id} - {problem.title} ({problem.difficulty})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selected Problems */}
                  <div className="space-y-3">
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
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                              {problem.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded">
                                {problem.id}
                              </span>
                              <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded">
                                {problem.difficulty}
                              </span>
                              <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-1 rounded">
                                {problem.points} điểm
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProblem(problem.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}

                    {selectedProblems.length === 0 && (
                      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        Chưa có bài tập nào được chọn
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Actions & Summary */}
            <div className="space-y-6">
              {/* Actions */}
              <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    Hành động
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push(`/contests/${params.id}`)}
                  >
                    Hủy bỏ
                  </Button>

                  <hr className="border-slate-200 dark:border-slate-600" />

                  <Button
                    type="button"
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                      if (confirm('Bạn có chắc chắn muốn xóa cuộc thi này?')) {
                        // Handle delete logic here
                        router.push('/contests');
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa cuộc thi
                  </Button>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    Tóm tắt
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Số bài tập:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {selectedProblems.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Thời lượng:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {Math.floor(formData.duration / 60)}h {formData.duration % 60}m
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Phạm vi:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {formData.accessRange === 'public' ? 'Công khai' : 'Riêng tư'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Tối đa thí sinh:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {formData.maxParticipants || 'Không giới hạn'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}