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
import { 
  Plus, 
  Save, 
  Search, 
  Trash2, 
  X, 
  Calendar, 
  Clock, 
  Settings,
  Users,
  Trophy,
  BarChart3
} from "lucide-react";
import { useState } from "react";

interface ContestData {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
  accessRange: string;
  problems: string[];
  participants?: number;
  maxParticipants?: number;
  status?: string;
  createdBy?: string;
  createdAt?: string;
}

interface ContestFormProps {
  initialData: ContestData;
  mode: "create" | "edit" | "view";
  onSave: (data: ContestData) => Promise<void>;
  isSaving?: boolean;
  title: string;
  subtitle: string;
}

export default function ContestForm({
  initialData,
  mode,
  onSave,
  isSaving = false,
  title,
  subtitle,
}: ContestFormProps) {
  const [contestData, setContestData] = useState<ContestData>(initialData);
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [problemSearch, setProblemSearch] = useState("");

  const isReadOnly = mode === "view";

  const handleInputChange = (field: keyof ContestData, value: string | number | string[]) => {
    if (isReadOnly) return;
    setContestData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddProblem = (problemId: string) => {
    if (isReadOnly) return;
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
    if (isReadOnly) return;
    setContestData((prev) => ({
      ...prev,
      problems: prev.problems.filter((id) => id !== problemId),
    }));
  };

  const calculateDuration = () => {
    if (contestData.startTime && contestData.endTime) {
      const start = new Date(contestData.startTime);
      const end = new Date(contestData.endTime);
      const durationMs = end.getTime() - start.getTime();
      const durationMinutes = Math.floor(durationMs / (1000 * 60));
      handleInputChange('duration', durationMinutes);
    }
  };

  const handleSave = () => {
    onSave(contestData);
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

  const getStatusColor = (status?: string) => {
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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Info */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
          {title}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          {subtitle}
        </p>
      </div>

      {/* Contest Stats (View mode only) */}
      {mode === "view" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Trạng thái</p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(contestData.status)}`}>
                    {contestData.status}
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
                    {contestData.participants || 0}
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
                    {contestData.problems.length}
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
                    {Math.floor(contestData.duration / 60)}h {contestData.duration % 60}m
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Basic Information */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Settings className="w-5 h-5" />
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
              disabled={isReadOnly}
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
              disabled={isReadOnly}
            />
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Access Range */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Phạm vi truy cập <span className="text-red-500">*</span>
              </label>
              {isReadOnly ? (
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  contestData.accessRange === "public"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                }`}>
                  {contestData.accessRange === "public" ? "Công khai" : "Riêng tư"}
                </div>
              ) : (
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
              )}
            </div>

          </div>

          {/* Creator info (View mode only) */}
          {mode === "view" && contestData.createdBy && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Người tạo
              </label>
              <p className="text-slate-600 dark:text-slate-400">{contestData.createdBy}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Time Configuration */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
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
            {isReadOnly ? (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Calendar className="w-4 h-4" />
                {new Date(contestData.startTime).toLocaleString("vi-VN")}
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                <Input
                    type="date"
                    value={contestData.startTime ? new Date(contestData.startTime).toISOString().split('T')[0] : ""}
                    onChange={(e) => {
                    const currentTime = contestData.startTime ? new Date(contestData.startTime).toTimeString().slice(0, 5) : "09:00";
                    const newDateTime = `${e.target.value}T${currentTime}`;
                    handleInputChange("startTime", newDateTime);
                    calculateDuration();
                    }}
                    className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500"
                />
                <Input
                    type="time"
                    value={contestData.startTime ? new Date(contestData.startTime).toTimeString().slice(0, 5) : ""}
                    onChange={(e) => {
                    const currentDate = contestData.startTime ? new Date(contestData.startTime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
                    const newDateTime = `${currentDate}T${e.target.value}`;
                    handleInputChange("startTime", newDateTime);
                    calculateDuration();
                    }}
                    className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500"
                />
                </div>
            )}
            </div>

            {/* End Time */}
            <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Thời gian kết thúc <span className="text-red-500">*</span>
            </label>
            {isReadOnly ? (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Calendar className="w-4 h-4" />
                {new Date(contestData.endTime).toLocaleString("vi-VN")}
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                <Input
                    type="date"
                    value={contestData.endTime ? new Date(contestData.endTime).toISOString().split('T')[0] : ""}
                    onChange={(e) => {
                    const currentTime = contestData.endTime ? new Date(contestData.endTime).toTimeString().slice(0, 5) : "12:00";
                    const newDateTime = `${e.target.value}T${currentTime}`;
                    handleInputChange("endTime", newDateTime);
                    calculateDuration();
                    }}
                    className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500"
                />
                <Input
                    type="time"
                    value={contestData.endTime ? new Date(contestData.endTime).toTimeString().slice(0, 5) : ""}
                    onChange={(e) => {
                    const currentDate = contestData.endTime ? new Date(contestData.endTime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
                    const newDateTime = `${currentDate}T${e.target.value}`;
                    handleInputChange("endTime", newDateTime);
                    calculateDuration();
                    }}
                    className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500"
                />
                </div>
            )}
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Thời lượng cuộc thi
            </label>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                {Math.floor(contestData.duration / 60)}h {contestData.duration % 60}m
              </span>
            </div>
            {!isReadOnly && (
              <>
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
              </>
            )}
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
            {!isReadOnly && (
              <Button
                onClick={() => setShowProblemModal(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm bài tập
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {selectedProblems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                {isReadOnly ? "Cuộc thi này chưa có bài tập nào" : "Chưa có bài tập nào được thêm vào cuộc thi"}
              </p>
              {!isReadOnly && (
                <Button
                  onClick={() => setShowProblemModal(true)}
                  variant="outline"
                  className="border-green-200 text-green-600 hover:bg-green-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm bài tập đầu tiên
                </Button>
              )}
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
                  <div className="flex items-center gap-2">
                    {mode === "view" && (
                      <div className="text-right">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {problem.acceptanceRate}% AC
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          {problem.submissionCount} lần nộp
                        </p>
                      </div>
                    )}
                    {!isReadOnly && (
                      <Button
                        onClick={() => handleRemoveProblem(problem.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      {!isReadOnly && (
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg"
          >
            <Save className="w-5 h-5 mr-2" />
            {isSaving ? "Đang lưu..." : mode === "create" ? "Tạo cuộc thi" : "Cập nhật cuộc thi"}
          </Button>
        </div>
      )}

      {/* Problem Selection Modal */}
      {showProblemModal && !isReadOnly && (
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
                            {problem.topic}
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