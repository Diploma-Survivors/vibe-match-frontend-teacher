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
  ProblemData, TestCase,
} from "@/types/problem";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { mockProblems } from "@/lib/data/mock-problems";


export default function EditProblemPage() {
  const params = useParams();
  const problemId = params.id as string;
  
  const [problemData, setProblemData] = useState<ProblemData>({
    name: "",
    description: "",
    inputDescription: "",
    outputDescription: "",
    timeLimit: "1000",
    memoryLimit: "256",
    difficulty: "",
    topic: "",
    tags: [],
    accessRange: "",
    testCases: [
      {
        id: "1",
        input: "",
        expectedOutput: "",
        isSample: true,
      },
    ],
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTestPage, setCurrentTestPage] = useState(1);

  // Test case pagination constants
  const testCasesPerPage = 3;
  const totalTestPages = Math.ceil(problemData.testCases.length / testCasesPerPage);
  const startTestIndex = (currentTestPage - 1) * testCasesPerPage;
  const endTestIndex = Math.min(startTestIndex + testCasesPerPage, problemData.testCases.length);
  const currentTestCases = problemData.testCases.slice(startTestIndex, endTestIndex);

  // Load existing problem data
  useEffect(() => {
    const loadProblemData = () => {
      const existingProblem = mockProblems.find(p => p.id === problemId);
      if (existingProblem) {
        // Convert existing problem to edit format
        setProblemData({
          name: existingProblem.title,
          description: "Cho số nguyên dương N, liệt kê phi hàm euler của các số từ 1 tới N và in ra màn hình.\n\nPhi hàm euler của số X hiển số lượng số nguyên tố cùng nhau với X nằm trong khoảng từ [1, X].",
          inputDescription: "Dòng duy nhất chứa số nguyên N (1 ≤ N ≤ 10^6)",
          outputDescription: "In ra phi hàm euler của các số từ 1 tới N, mỗi số cách nhau một khoảng trắng",
          timeLimit: "2000",
          memoryLimit: "256",
          difficulty: existingProblem.difficulty,
          topic: existingProblem.topic,
          tags: existingProblem.tags,
          accessRange: existingProblem.accessRange,
          testCases: [
            {
              id: "1",
              input: "5",
              expectedOutput: "1 1 2 2 4",
              isSample: true,
            },
            {
              id: "2",
              input: "10",
              expectedOutput: "1 1 2 2 4 2 6 4 6 4",
              isSample: true,
            },
            {
              id: "3",
              input: "1",
              expectedOutput: "1",
              isSample: false,
            },
          ],
        });
      }
      setIsLoading(false);
    };

    loadProblemData();
  }, [problemId]);

  const handleInputChange = (field: keyof ProblemData, value: string) => {
    setProblemData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTestCaseChange = (
    id: string,
    field: keyof TestCase,
    value: string | boolean
  ) => {
    setProblemData((prev) => ({
      ...prev,
      testCases: prev.testCases.map((testCase) =>
        testCase.id === id ? { ...testCase, [field]: value } : testCase
      ),
    }));
  };

  const addTestCase = () => {
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
    if (problemData.testCases.length > 1) {
      setProblemData((prev) => ({
        ...prev,
        testCases: prev.testCases.filter((testCase) => testCase.id !== id),
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Updating problem:", problemData);
    setIsSaving(false);
    // Here you would typically save to your backend
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 dark:from-slate-900 dark:via-green-900 dark:to-emerald-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Đang tải dữ liệu bài tập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-100 dark:from-slate-900 dark:via-green-900 dark:to-emerald-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/problems">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-slate-600 hover:text-green-600 dark:text-slate-400 dark:hover:text-emerald-400"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại danh sách
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  Chỉnh sửa bài tập
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  ID: {problemId} - Cập nhật thông tin bài tập
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
                {isSaving ? "Đang lưu..." : "Cập nhật bài tập"}
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
                  onChange={(e) =>
                    handleInputChange("inputDescription", e.target.value)
                  }
                  className="w-full h-24 p-4 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500 resize-none"
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
                  onChange={(e) =>
                    handleInputChange("outputDescription", e.target.value)
                  }
                  className="w-full h-24 p-4 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500 resize-none"
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
                    onChange={(e) =>
                      handleInputChange("memoryLimit", e.target.value)
                    }
                    className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Problem Categories */}
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
              </div>

              {/* Access Range */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Phạm vi truy cập <span className="text-red-500">*</span>
                </label>
                <Select
                  value={problemData.accessRange}
                  onValueChange={(value) => handleInputChange("accessRange", value)}
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

          {/* Test Cases Preview */}
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Test Cases ({problemData.testCases.length})
                </CardTitle>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={addTestCase}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm test case
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentTestCases.map((testCase, index) => (
                <div
                  key={testCase.id}
                  className="p-6 bg-slate-50/50 dark:bg-slate-700/30 rounded-xl border border-slate-200/50 dark:border-slate-600/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                      Test Case {startTestIndex + index + 1}
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
                      {problemData.testCases.length > 1 && (
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
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {totalTestPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                  <Button
                    onClick={() => setCurrentTestPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentTestPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    Trước
                  </Button>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Trang {currentTestPage} / {totalTestPages}
                  </span>
                  <Button
                    onClick={() =>
                      setCurrentTestPage((prev) => Math.min(prev + 1, totalTestPages))
                    }
                    disabled={currentTestPage === totalTestPages}
                    variant="outline"
                    size="sm"
                  >
                    Sau
                  </Button>
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
              {isSaving ? "Đang lưu..." : "Cập nhật bài tập"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}