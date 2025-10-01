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
  DIFFICULTY_OPTIONS,
  ProblemData,
  TestcaseSample,
  Tag,
  Topic,
  ProblemDifficulty,
} from "@/types/problem";
import {
  Plus,
  Save,
  Trash2,
  Upload,
  FileText,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ProblemService } from "@/services/problem-service";

interface ProblemFormProps {
  mode: "create" | "edit" | "view";
  onSave: (data: ProblemData, testcaseFile?: File) => Promise<void>;
  isSaving?: boolean;
  title: string;
  subtitle: string;
}

export default function ProblemForm({
  mode,
  onSave,
  isSaving = false,
  title,
  subtitle,
}: ProblemFormProps) {
  const [problemData, setProblemData] = useState<ProblemData>({
    title: "",
    description: "",
    inputDescription: "",
    outputDescription: "",
    maxScore: 100,
    timeLimitMs: 1000,
    memoryLimitKb: 262144,
    difficulty: ProblemDifficulty.EASY,
    tags: [],
    topics: [],
    testcase: "",
    testcaseSamples: [
      {
        input: "",
        output: "",
      },
    ],
  });

  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [availableTopics, setAvailableTopics] = useState<Topic[]>([]);
  const [testcaseFile, setTestcaseFile] = useState<File | null>(null);
  const [currentTestPage, setCurrentTestPage] = useState(1);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isReadOnly = mode === "view";

  // Load tags and topics when component mounts
  useEffect(() => {
    const loadTagsAndTopics = async () => {
      try {
        const [tagsData, topicsData] = await Promise.all([
          ProblemService.getTags(),
          ProblemService.getTopics(),
        ]);
        setAvailableTags(tagsData);
        setAvailableTopics(topicsData);
      } catch (error) {
        console.error("Failed to load tags and topics:", error);
      }
    };

    loadTagsAndTopics();
  }, []);

  // Test case pagination constants
  const testCasesPerPage = 3;
  const totalTestPages = Math.ceil(
    problemData.testcaseSamples.length / testCasesPerPage
  );
  const startTestIndex = (currentTestPage - 1) * testCasesPerPage;
  const endTestIndex = Math.min(
    startTestIndex + testCasesPerPage,
    problemData.testcaseSamples.length
  );
  const currentTestCases = problemData.testcaseSamples.slice(
    startTestIndex,
    endTestIndex
  );

  const handleInputChange = (
    field: keyof ProblemData,
    value: string | string[] | number
  ) => {
    if (isReadOnly) return;
    setProblemData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagChange = (tagId: string) => {
    if (isReadOnly) return;
    setProblemData((prev) => {
      const currentTags = prev.tags || [];
      const isSelected = currentTags.includes(tagId);

      if (isSelected) {
        return {
          ...prev,
          tags: currentTags.filter((t) => t !== tagId),
        };
      } else {
        return {
          ...prev,
          tags: [...currentTags, tagId],
        };
      }
    });
  };

  const handleTopicChange = (topicId: string) => {
    if (isReadOnly) return;
    setProblemData((prev) => {
      const currentTopics = prev.topics || [];
      const isSelected = currentTopics.includes(topicId);

      if (isSelected) {
        return {
          ...prev,
          topics: currentTopics.filter((t) => t !== topicId),
        };
      } else {
        return {
          ...prev,
          topics: [...currentTopics, topicId],
        };
      }
    });
  };

  const handleTestCaseChange = (
    index: number,
    field: keyof TestcaseSample,
    value: string
  ) => {
    if (isReadOnly) return;
    setProblemData((prev) => ({
      ...prev,
      testcaseSamples: prev.testcaseSamples.map((testCase, i) =>
        i === index ? { ...testCase, [field]: value } : testCase
      ),
    }));
  };

  const addTestCase = () => {
    if (isReadOnly) return;
    setProblemData((prev) => ({
      ...prev,
      testcaseSamples: [
        ...prev.testcaseSamples,
        {
          input: "",
          output: "",
        },
      ],
    }));
  };

  const removeTestCase = (index: number) => {
    if (isReadOnly || problemData.testcaseSamples.length <= 1) return;
    setProblemData((prev) => ({
      ...prev,
      testcaseSamples: prev.testcaseSamples.filter((_, i) => i !== index),
    }));
  };

  // File upload handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const allowedTypes = [
        "text/plain",
        "text/csv",
        "application/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      const allowedExtensions = [".txt", ".csv", ".xlsx", ".xls"];

      const hasValidType = allowedTypes.includes(file.type);
      const hasValidExtension = allowedExtensions.some((ext) =>
        file.name.toLowerCase().endsWith(ext)
      );

      if (hasValidType || hasValidExtension) {
        setTestcaseFile(file);
      } else {
        alert("Chỉ chấp nhận file .txt, .csv, .xlsx, .xls");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = [
        "text/plain",
        "text/csv",
        "application/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      const allowedExtensions = [".txt", ".csv", ".xlsx", ".xls"];

      const hasValidType = allowedTypes.includes(file.type);
      const hasValidExtension = allowedExtensions.some((ext) =>
        file.name.toLowerCase().endsWith(ext)
      );

      if (hasValidType || hasValidExtension) {
        setTestcaseFile(file);
      } else {
        alert("Chỉ chấp nhận file .txt, .csv, .xlsx, .xls");
      }
    }
  };

  const removeFile = () => {
    setTestcaseFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    // callback
    if (onSave) {
      onSave(problemData, testcaseFile ?? undefined);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Info */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
          {title}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">{subtitle}</p>
      </div>

      {/* Basic Information */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Thông tin cơ bản
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Problem Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Tên bài tập <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Nhập tên bài tập..."
              value={problemData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
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
              onChange={(e) =>
                handleInputChange("inputDescription", e.target.value)
              }
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
              onChange={(e) =>
                handleInputChange("outputDescription", e.target.value)
              }
              className="w-full h-24 p-4 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500 resize-none"
              disabled={isReadOnly}
            />
          </div>
        </CardContent>
      </Card>

      {/* Constraints & Settings */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Cài đặt & Giới hạn
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Time Limit */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Giới hạn thời gian (ms)
              </label>
              <Input
                type="number"
                placeholder="1000"
                value={problemData.timeLimitMs}
                onChange={(e) =>
                  handleInputChange(
                    "timeLimitMs",
                    parseInt(e.target.value) || 1000
                  )
                }
                className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500"
                disabled={isReadOnly}
              />
            </div>

            {/* Memory Limit */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Giới hạn bộ nhớ (KB)
              </label>
              <Input
                type="number"
                placeholder="262144"
                value={problemData.memoryLimitKb}
                onChange={(e) =>
                  handleInputChange(
                    "memoryLimitKb",
                    parseInt(e.target.value) || 262144
                  )
                }
                className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500"
                disabled={isReadOnly}
              />
            </div>

            {/* Max Score */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Điểm tối đa
              </label>
              <Input
                type="number"
                placeholder="100"
                value={problemData.maxScore}
                onChange={(e) =>
                  handleInputChange("maxScore", parseInt(e.target.value) || 100)
                }
                className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500"
                disabled={isReadOnly}
              />
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Mức độ khó <span className="text-red-500">*</span>
            </label>
            <Select
              value={problemData.difficulty}
              onValueChange={(value) => handleInputChange("difficulty", value)}
              disabled={isReadOnly}
            >
              <SelectTrigger className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500">
                <SelectValue placeholder="Chọn mức độ khó" />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Topics & Tags */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Phân loại bài tập
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Topics */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Chủ đề
            </label>
            <div className="space-y-3">
              {availableTopics.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                        problemData.topics?.includes(topic.id)
                          ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100 dark:bg-slate-700/30 dark:border-slate-600 dark:hover:bg-slate-700/50"
                      }`}
                      onClick={() => !isReadOnly && handleTopicChange(topic.id)}
                    >
                      <input
                        type="checkbox"
                        checked={
                          problemData.topics?.includes(topic.id) || false
                        }
                        onChange={() => {}}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        disabled={isReadOnly}
                      />
                      <span className="text-sm font-medium">{topic.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-slate-500">
                  Đang tải chủ đề...
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Tags
            </label>
            <div className="space-y-3">
              {availableTags.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableTags.map((tag) => (
                    <div
                      key={tag.id}
                      className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                        problemData.tags?.includes(tag.id)
                          ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100 dark:bg-slate-700/30 dark:border-slate-600 dark:hover:bg-slate-700/50"
                      }`}
                      onClick={() => !isReadOnly && handleTagChange(tag.id)}
                    >
                      <input
                        type="checkbox"
                        checked={problemData.tags?.includes(tag.id) || false}
                        onChange={() => {}}
                        className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                        disabled={isReadOnly}
                      />
                      <span className="text-sm font-medium">{tag.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-slate-500">
                  Đang tải tags...
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Cases Upload */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Test Cases File (Tùy chọn)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
              dragActive
                ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                : "border-slate-300 dark:border-slate-600"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {testcaseFile ? (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full">
                  {testcaseFile.name.toLowerCase().endsWith(".csv") ||
                  testcaseFile.name.toLowerCase().endsWith(".xlsx") ||
                  testcaseFile.name.toLowerCase().endsWith(".xls") ? (
                    <FileSpreadsheet className="w-8 h-8 text-green-600 dark:text-green-400" />
                  ) : (
                    <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    {testcaseFile.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {(testcaseFile.size / 1024).toFixed(2)} KB
                  </p>
                  <span className="inline-block px-2 py-1 mt-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-md">
                    {testcaseFile.name.split(".").pop()?.toUpperCase()}
                  </span>
                </div>
                <Button
                  onClick={removeFile}
                  variant="outline"
                  size="sm"
                  className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                  Xóa file
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-700 rounded-full">
                  <Upload className="w-8 h-8 text-slate-500" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                    Tải lên file test cases
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Kéo thả file .txt, .csv, .xlsx, .xls vào đây hoặc click để
                    chọn file
                  </p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="gap-2"
                    disabled={isReadOnly}
                  >
                    <Upload className="w-4 h-4" />
                    Chọn file
                  </Button>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.csv,.xlsx,.xls,text/plain,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isReadOnly}
            />
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
            <p>
              <strong>Lưu ý:</strong> File test cases sẽ được ưu tiên sử dụng
              thay vì test cases thủ công bên dưới.
            </p>
            <p>Hỗ trợ các định dạng: .txt, .csv, .xlsx, .xls</p>
            <p>
              <strong>Định dạng file:</strong>
            </p>
            <ul className="ml-4 space-y-1">
              <li>
                • <strong>TXT:</strong> Mỗi dòng là một test case, format:
                input|output
              </li>
              <li>
                • <strong>CSV:</strong> 2 cột: input, output
              </li>
              <li>
                • <strong>XLSX/XLS:</strong> 2 cột đầu tiên là input và output
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Manual Test Cases */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Test Cases Mẫu ({problemData.testcaseSamples.length})
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
                key={actualIndex}
                className="p-6 bg-gradient-to-r from-slate-50/50 to-blue-50/30 dark:from-slate-700/30 dark:to-blue-900/20 rounded-xl border border-slate-200/50 dark:border-slate-600/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Test Case {actualIndex + 1}
                  </h3>
                  {!isReadOnly && problemData.testcaseSamples.length > 1 && (
                    <Button
                      onClick={() => removeTestCase(actualIndex)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Đầu vào
                    </label>
                    <textarea
                      placeholder="Nhập dữ liệu đầu vào..."
                      value={testCase.input}
                      onChange={(e) =>
                        handleTestCaseChange(
                          actualIndex,
                          "input",
                          e.target.value
                        )
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
                      value={testCase.output}
                      onChange={(e) =>
                        handleTestCaseChange(
                          actualIndex,
                          "output",
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
                Hiển thị test case {startTestIndex + 1}-{endTestIndex} trong
                tổng số {problemData.testcaseSamples.length}
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
                  {Array.from(
                    { length: Math.min(5, totalTestPages) },
                    (_, i) => {
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
                          variant={
                            currentTestPage === pageNum ? "default" : "outline"
                          }
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
                    }
                  )}
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
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <Save className="w-5 h-5 mr-2" />
            {isSaving
              ? "Đang lưu..."
              : mode === "create"
                ? "Tạo bài tập"
                : "Cập nhật bài tập"}
          </Button>
        </div>
      )}
    </div>
  );
}
