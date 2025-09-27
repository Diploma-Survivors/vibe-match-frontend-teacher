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
import {
  ACCESS_RANGE_OPTIONS,
  TOPIC_OPTIONS,
  TAG_OPTIONS,
  DIFFICULTY_OPTIONS,
  ProblemData,
  TestCase,
} from "@/types/problem";
import { Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";

interface ProblemFormProps {
  initialData?: ProblemData;
  mode: "create" | "edit" | "view";
  onSave?: (data: ProblemData) => Promise<void>;
  isSaving?: boolean;
  title: string;
  subtitle: string;
}

export default function ProblemForm({
  initialData,
  mode,
  onSave,
  isSaving = false,
  title,
  subtitle,
}: ProblemFormProps) {
  
  const [problemData, setProblemData] = useState<ProblemData>(
    initialData ?? {
      name: "",
      description: "",
      inputDescription: "",
      outputDescription: "",
      timeLimit: "1000",
      memoryLimit: "256",
      difficulty: "Dễ",
      topic: "implementation",
      tags: [],
      accessRange: "public",
      testCases: [
        {
          id: "1",
          input: "",
          expectedOutput: "",
          isSample: true,
        },
      ],
    }
  );
  const [currentTestPage, setCurrentTestPage] = useState(1);

  const isReadOnly = mode === "view";

  // Test case pagination constants
  const testCasesPerPage = 3;
  const totalTestPages = Math.ceil(problemData.testCases.length / testCasesPerPage);
  const startTestIndex = (currentTestPage - 1) * testCasesPerPage;
  const endTestIndex = Math.min(startTestIndex + testCasesPerPage, problemData.testCases.length);
  const currentTestCases = problemData.testCases.slice(startTestIndex, endTestIndex);

  const handleInputChange = (field: keyof ProblemData, value: string | string[]) => {
    if (isReadOnly) return;
    setProblemData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagChange = (tag: string) => {
    if (isReadOnly) return;
    setProblemData((prev) => {
      const currentTags = prev.tags || [];
      const isSelected = currentTags.includes(tag);
      
      if (isSelected) {
        return {
          ...prev,
          tags: currentTags.filter(t => t !== tag)
        };
      } else {
        return {
          ...prev,
          tags: [...currentTags, tag]
        };
      }
    });
  };

  const handleTestCaseChange = (
    id: string,
    field: keyof TestCase,
    value: string | boolean
  ) => {
    if (isReadOnly) return;
    setProblemData((prev) => ({
      ...prev,
      testCases: prev.testCases.map((testCase) =>
        testCase.id === id ? { ...testCase, [field]: value } : testCase
      ),
    }));
  };

  const addTestCase = () => {
    if (isReadOnly) return;
    const newId = (problemData.testCases.length + 1).toString();
    setProblemData((prev) => ({
      ...prev,
      testCases: [
        ...prev.testCases,
        {
          id: newId,
          input: "",
          expectedOutput: "",
          isSample: false,
        },
      ],
    }));
  };

  const removeTestCase = (id: string) => {
    if (isReadOnly || problemData.testCases.length <= 1) return;
    setProblemData((prev) => ({
      ...prev,
      testCases: prev.testCases.filter((testCase) => testCase.id !== id),
    }));
  };

  const handleSave = () => {
    onSave?.(problemData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Info */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
          {title}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          {subtitle}
        </p>
      </div>

      {/* Basic Information */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Thông tin cơ bản
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Problem Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Tên bài tập <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Nhập tên bài tập..."
              value={problemData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500"
              disabled={isReadOnly}
            />
          </div>

          {/* Problem Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Mô tả bài toán <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Nhập mô tả chi tiết về bài toán..."
              value={problemData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full h-32 p-4 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500 resize-none"
              disabled={isReadOnly}
            />
          </div>

          {/* Input Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Mô tả đầu vào <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Mô tả định dạng và ý nghĩa của đầu vào..."
              value={problemData.inputDescription}
              onChange={(e) => handleInputChange("inputDescription", e.target.value)}
              className="w-full h-24 p-4 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500 resize-none"
              disabled={isReadOnly}
            />
          </div>

          {/* Output Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Mô tả đầu ra <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Mô tả định dạng và ý nghĩa của đầu ra..."
              value={problemData.outputDescription}
              onChange={(e) => handleInputChange("outputDescription", e.target.value)}
              className="w-full h-24 p-4 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500 resize-none"
              disabled={isReadOnly}
            />
          </div>
        </CardContent>
      </Card>

      {/* Constraints */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Giới hạn
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Time Limit */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Giới hạn thời gian (ms)
              </label>
              <Input
                type="number"
                placeholder="1000"
                value={problemData.timeLimit}
                onChange={(e) => handleInputChange("timeLimit", e.target.value)}
                className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500"
                disabled={isReadOnly}
              />
            </div>

            {/* Memory Limit */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Giới hạn bộ nhớ (MB)
              </label>
              <Input
                type="number"
                placeholder="256"
                value={problemData.memoryLimit}
                onChange={(e) => handleInputChange("memoryLimit", e.target.value)}
                className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500"
                disabled={isReadOnly}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problem Classification */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Phân loại bài tập
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Difficulty */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Mức độ <span className="text-red-500">*</span>
              </label>
              <Select
                value={problemData.difficulty}
                onValueChange={(value) => handleInputChange("difficulty", value)}
                disabled={isReadOnly}
              >
                <SelectTrigger className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500">
                  <SelectValue placeholder="Chọn mức độ" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_OPTIONS.filter((option) => option.value !== "all").map(
                    (option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Topic */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Dạng bài <span className="text-red-500">*</span>
              </label>
              <Select
                value={problemData.topic}
                onValueChange={(value) => handleInputChange("topic", value)}
                disabled={isReadOnly}
              >
                <SelectTrigger className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500">
                  <SelectValue placeholder="Chọn dạng bài" />
                </SelectTrigger>
                <SelectContent>
                  {TOPIC_OPTIONS.filter((option) => option.value !== "all").map(
                    (option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Tags - Multiple Select */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Tags
              </label>
              <Select disabled={isReadOnly}>
                <SelectTrigger className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500">
                  <SelectValue 
                    placeholder={
                      problemData.tags && problemData.tags.length > 0
                        ? `${problemData.tags.length} tag được chọn`
                        : "Chọn tags..."
                    }
                  />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl shadow-xl">
                  {TAG_OPTIONS.filter(option => option.value !== "all").map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2 px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        handleTagChange(option.value);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={problemData.tags?.includes(option.value) || false}
                        onChange={() => {}}
                        className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                        disabled={isReadOnly}
                      />
                      <span className="text-sm">{option.label}</span>
                    </div>
                  ))}
                  {problemData.tags && problemData.tags.length > 0 && !isReadOnly && (
                    <div className="border-t border-slate-200 dark:border-slate-700 mt-2 pt-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleInputChange("tags", []);
                        }}
                        className="w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        Xóa tất cả tags
                      </button>
                    </div>
                  )}
                </SelectContent>
              </Select>
              
              {/* Display selected tags */}
              {problemData.tags && problemData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {problemData.tags.map((tag) => {
                    const tagOption = TAG_OPTIONS.find(option => option.value === tag);
                    return (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md text-xs"
                      >
                        {tagOption?.label || tag}
                        {!isReadOnly && (
                          <button
                            onClick={() => handleTagChange(tag)}
                            className="ml-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                          >
                            ×
                          </button>
                        )}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Access Range */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Phạm vi truy cập <span className="text-red-500">*</span>
            </label>
            <Select
              value={problemData.accessRange}
              onValueChange={(value) => handleInputChange("accessRange", value)}
              disabled={isReadOnly}
            >
              <SelectTrigger className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500">
                <SelectValue placeholder="Chọn phạm vi truy cập" />
              </SelectTrigger>
              <SelectContent>
                {ACCESS_RANGE_OPTIONS.filter((option) => option.value !== "all").map(
                  (option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Test Cases */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Test Cases ({problemData.testCases.length})
            </CardTitle>
            {!isReadOnly && (
              <Button
                onClick={addTestCase}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Thêm test case
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Cases Display */}
          {currentTestCases.map((testCase, index) => {
            const actualIndex = startTestIndex + index;
            return (
              <div
                key={testCase.id}
                className="p-6 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl border border-slate-200/50 dark:border-slate-600/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Test Case {actualIndex + 1}
                  </h3>
                  <div className="flex items-center gap-3">
                    {/* Sample Test Case Toggle */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Loại test case:
                      </label>
                      <Select
                        value={testCase.isSample ? "sample" : "hidden"}
                        onValueChange={(value) =>
                          handleTestCaseChange(
                            testCase.id,
                            "isSample",
                            value === "sample"
                          )
                        }
                        disabled={isReadOnly}
                      >
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sample">Mẫu</SelectItem>
                          <SelectItem value="hidden">Ẩn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {!isReadOnly && problemData.testCases.length > 1 && (
                      <Button
                        onClick={() => removeTestCase(testCase.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Đầu vào
                    </label>
                    <textarea
                      placeholder="Nhập dữ liệu đầu vào..."
                      value={testCase.input}
                      onChange={(e) =>
                        handleTestCaseChange(testCase.id, "input", e.target.value)
                      }
                      className="w-full h-24 p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-green-500 resize-none text-sm font-mono"
                      disabled={isReadOnly}
                    />
                  </div>

                  {/* Expected Output */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Đầu ra mong đợi
                    </label>
                    <textarea
                      placeholder="Nhập kết quả mong đợi..."
                      value={testCase.expectedOutput}
                      onChange={(e) =>
                        handleTestCaseChange(
                          testCase.id,
                          "expectedOutput",
                          e.target.value
                        )
                      }
                      className="w-full h-24 p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-green-500 resize-none text-sm font-mono"
                      disabled={isReadOnly}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Test Cases Pagination */}
          {totalTestPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Hiển thị test case {startTestIndex + 1}-{endTestIndex} trong tổng số {problemData.testCases.length}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentTestPage(currentTestPage - 1)}
                  disabled={currentTestPage === 1}
                  className="h-8 px-3 text-xs"
                >
                  Trước
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalTestPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalTestPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentTestPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentTestPage >= totalTestPages - 2) {
                      pageNum = totalTestPages - 4 + i;
                    } else {
                      pageNum = currentTestPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentTestPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentTestPage(pageNum)}
                        className={`w-8 h-8 p-0 text-xs ${
                          currentTestPage === pageNum
                            ? "bg-green-600 text-white"
                            : "border-slate-300 dark:border-slate-600"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentTestPage(currentTestPage + 1)}
                  disabled={currentTestPage === totalTestPages}
                  className="h-8 px-3 text-xs"
                >
                  Sau
                </Button>
              </div>
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
            {isSaving ? "Đang lưu..." : mode === "create" ? "Tạo bài tập" : "Cập nhật bài tập"}
          </Button>
        </div>
      )}
    </div>
  );
}