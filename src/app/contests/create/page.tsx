"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockProblems } from "@/lib/data/mock-problems";
import { ArrowLeft, Plus, Save, Search, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ContestData {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
  accessRange: string;
  problems: string[];
}

export default function CreateContestPage() {
  const [contestData, setContestData] = useState<ContestData>({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    duration: 180,
    accessRange: "public",
    problems: [],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [problemSearch, setProblemSearch] = useState("");

  const handleInputChange = (field: keyof ContestData, value: string | number | string[]) => {
    setContestData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddProblem = (problemId: string) => {
    if (!contestData.problems.includes(problemId)) {
      setContestData((prev) => ({
        ...prev,
        problems: [...prev.problems, problemId],
      }));
    }
    setShowProblemModal(false);
    setProblemSearch("");
  };

  const handleRemoveProblem = (problemId: string) => {
    setContestData((prev) => ({
      ...prev,
      problems: prev.problems.filter((id) => id !== problemId),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Creating contest:", contestData);
    setIsSaving(false);
    // Here you would typically save to your backend
  };

  // Filter problems for modal
  const filteredProblems = mockProblems.filter((problem) =>
    problemSearch
      ? problem.title.toLowerCase().includes(problemSearch.toLowerCase()) ||
        problem.id.toLowerCase().includes(problemSearch.toLowerCase())
      : true
  );

  const selectedProblems = mockProblems.filter((problem) =>
    contestData.problems.includes(problem.id)
  );

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
                  Tạo cuộc thi mới
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  Thiết lập thông tin và cấu hình cuộc thi lập trình
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Đang tạo..." : "Tạo cuộc thi"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Basic Information */}
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Thông tin cơ bản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contest Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Tên cuộc thi <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Nhập tên cuộc thi..."
                  value={contestData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Contest Description */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Mô tả cuộc thi <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Nhập mô tả chi tiết về cuộc thi..."
                  value={contestData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="w-full h-32 p-4 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Time Configuration */}
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Cấu hình thời gian
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Time */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Thời gian bắt đầu <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="datetime-local"
                    value={contestData.startTime}
                    onChange={(e) => handleInputChange("startTime", e.target.value)}
                    className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* End Time */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Thời gian kết thúc <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="datetime-local"
                    value={contestData.endTime}
                    onChange={(e) => handleInputChange("endTime", e.target.value)}
                    className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Thời lượng cuộc thi (phút) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="180"
                  value={contestData.duration}
                  onChange={(e) => handleInputChange("duration", parseInt(e.target.value) || 0)}
                  className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Thời lượng hiện tại: {Math.floor(contestData.duration / 60)}h {contestData.duration % 60}m
                </p>
              </div>

              {/* Access Range */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Phạm vi truy cập <span className="text-red-500">*</span>
                </label>
                <Select
                  value={contestData.accessRange}
                  onValueChange={(value) => handleInputChange("accessRange", value)}
                >
                  <SelectTrigger className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500">
                    <SelectValue placeholder="Chọn phạm vi truy cập" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Công khai</SelectItem>
                    <SelectItem value="private">Riêng tư</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Problem List */}
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Danh sách bài tập ({contestData.problems.length})
                </CardTitle>
                <Button
                  onClick={() => setShowProblemModal(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm bài tập
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {selectedProblems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
                    Chưa có bài tập nào được thêm vào cuộc thi
                  </p>
                  <Button
                    onClick={() => setShowProblemModal(true)}
                    variant="outline"
                    className="border-green-200 text-green-600 hover:bg-green-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm bài tập đầu tiên
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedProblems.map((problem, index) => (
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
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleRemoveProblem(problem.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg"
            >
              <Save className="w-5 h-5 mr-2" />
              {isSaving ? "Đang tạo..." : "Tạo cuộc thi"}
            </Button>
          </div>
        </div>
      </div>

      {/* Problem Selection Modal */}
      {showProblemModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Tìm kiếm bài tập..."
                  value={problemSearch}
                  onChange={(e) => setProblemSearch(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-3">
                {filteredProblems.map((problem) => (
                  <div
                    key={problem.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md ${
                      contestData.problems.includes(problem.id)
                        ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700"
                        : "bg-slate-50 border-slate-200 dark:bg-slate-700/30 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    }`}
                    onClick={() => handleAddProblem(problem.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-bold text-xs">
                          {problem.id.slice(-2)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                          {problem.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded">
                            {problem.difficulty}
                          </span>
                          <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-1 rounded">
                            {problem.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    {contestData.problems.includes(problem.id) && (
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}