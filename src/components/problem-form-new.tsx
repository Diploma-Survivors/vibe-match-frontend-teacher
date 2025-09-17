"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DIFFICULTY_OPTIONS,
  ProblemData,
  TestcaseSample,
  Tag,
  Topic,
} from "@/types/problem";
import { problemApi } from "@/lib/apis/problem-api";
import { Plus, Save, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface ProblemFormProps {
  readonly initialData: ProblemData;
  readonly mode: "create" | "edit" | "view";
  readonly onSave: (data: ProblemData) => Promise<void>;
  readonly isSaving?: boolean;
  readonly title: string;
  readonly subtitle: string;
}

export default function ProblemForm({
  initialData,
  mode,
  onSave,
  isSaving = false,
  title,
  subtitle,
}: ProblemFormProps) {
  const [problemData, setProblemData] = useState<ProblemData>(initialData);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [availableTopics, setAvailableTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [testcaseFile, setTestcaseFile] = useState<File | null>(null);
  const [testcaseError, setTestcaseError] = useState<string | null>(null);
  const [cachedTestcaseResponse, setCachedTestcaseResponse] =
    useState<any>(null);

  const isReadOnly = mode === "view";

  // Load tags and topics on component mount
  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [tags, topics] = await Promise.all([
          problemApi.getTags(),
          problemApi.getTopics(),
        ]);
        setAvailableTags(tags);
        setAvailableTopics(topics);
      } catch (error) {
        console.error("Failed to load tags and topics:", error);
        // Mock data for development if API fails
        const currentDate = new Date();
        setAvailableTags([
          {
            id: "1",
            name: "Toán học",
            createdAt: currentDate,
            updatedAt: currentDate,
          },
          {
            id: "2",
            name: "Cấu trúc dữ liệu",
            createdAt: currentDate,
            updatedAt: currentDate,
          },
          {
            id: "3",
            name: "Thuật toán",
            createdAt: currentDate,
            updatedAt: currentDate,
          },
        ]);
        setAvailableTopics([
          {
            id: "1",
            name: "Lập trình cơ bản",
            description: "Các khái niệm cơ bản trong lập trình",
            createdAt: currentDate,
            updatedAt: currentDate,
          },
          {
            id: "2",
            name: "Thuật toán sắp xếp",
            description: "Các thuật toán sắp xếp phổ biến",
            createdAt: currentDate,
            updatedAt: currentDate,
          },
          {
            id: "3",
            name: "Đồ thị",
            description: "Lý thuyết đồ thị và các thuật toán liên quan",
            createdAt: currentDate,
            updatedAt: currentDate,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadDependencies();
  }, []);

  const handleInputChange = (field: keyof ProblemData, value: any) => {
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

  const handleTestcaseSampleChange = (
    index: number,
    field: keyof TestcaseSample,
    value: string
  ) => {
    if (isReadOnly) return;
    setProblemData((prev) => ({
      ...prev,
      testcaseSamples: prev.testcaseSamples.map((sample, i) =>
        i === index ? { ...sample, [field]: value } : sample
      ),
    }));
  };

  const addTestcaseSample = () => {
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

  const removeTestcaseSample = (index: number) => {
    if (isReadOnly || problemData.testcaseSamples.length <= 1) return;
    setProblemData((prev) => ({
      ...prev,
      testcaseSamples: prev.testcaseSamples.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    // Validate that testcase file is selected
    if (!testcaseFile) {
      alert("Please select a testcase file before creating the problem.");
      return;
    }

    try {
      let testcaseResponse;

      // Check if we already have a cached testcase response for retry scenarios
      if (cachedTestcaseResponse) {
        console.log(
          "Using cached testcase response for retry:",
          cachedTestcaseResponse
        );
        testcaseResponse = cachedTestcaseResponse;
      } else {
        // STEP 1: Upload testcase file to /testcases endpoint with form-data
        // Returns: { id, fileUrl, createdAt, updatedAt }
        testcaseResponse = await problemApi.createTestcaseFile(testcaseFile);
        console.log("Testcase uploaded successfully:", testcaseResponse);

        // Cache the response for potential retries
        setCachedTestcaseResponse(testcaseResponse);
      }

      // STEP 2: Prepare problem data with testcase ID for /problems endpoint
      const updatedProblemData: ProblemData = {
        ...problemData,
        testcase: testcaseResponse.id,
      };

      // STEP 3: Call parent component's onSave which will:
      // - Send to /problems endpoint with required fields
      // - Then call /lti/dl/response with the created problem URL
      await onSave(updatedProblemData);

      // Clear cache on successful completion
      setCachedTestcaseResponse(null);
    } catch (error) {
      console.error("Failed to upload testcase or create problem:", error);

      // If we have a cached testcase response, the error is likely in step 2 or 3
      if (cachedTestcaseResponse) {
        alert(
          "Problem creation failed, but testcase is saved. You can retry without re-uploading the file."
        );
      } else {
        alert("Failed to create problem. Please try again.");
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setTestcaseFile(file);
      setTestcaseError(null);
      setCachedTestcaseResponse(null); // Clear cached response when new file is selected
    }
  };

  const resetTestcaseUpload = () => {
    setTestcaseFile(null);
    setTestcaseError(null);
    setCachedTestcaseResponse(null); // Clear cached response when resetting
  };

  const getTagName = (tagId: string) => {
    const tag = availableTags.find((t) => t.id === tagId);
    return tag?.name || tagId;
  };

  const getTopicName = (topicId: string) => {
    const topic = availableTopics.find((t) => t.id === topicId);
    return topic?.name || topicId;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

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
            <label
              htmlFor="problem-title"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Tiêu đề bài tập <span className="text-red-500">*</span>
            </label>
            <Input
              id="problem-title"
              placeholder="Nhập tiêu đề bài tập (3-128 ký tự)..."
              value={problemData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500"
              disabled={isReadOnly}
            />
          </div>

          {/* Problem Description */}
          <div className="space-y-2">
            <label
              htmlFor="problem-description"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Mô tả bài toán <span className="text-red-500">*</span>
            </label>
            <textarea
              id="problem-description"
              placeholder="Nhập mô tả chi tiết về bài toán (16-512 ký tự)..."
              value={problemData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full h-32 p-4 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500 resize-none"
              disabled={isReadOnly}
            />
          </div>

          {/* Input Description */}
          <div className="space-y-2">
            <label
              htmlFor="input-description"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Mô tả đầu vào <span className="text-red-500">*</span>
            </label>
            <textarea
              id="input-description"
              placeholder="Mô tả định dạng và ý nghĩa của đầu vào (8-512 ký tự)..."
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
            <label
              htmlFor="output-description"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Mô tả đầu ra <span className="text-red-500">*</span>
            </label>
            <textarea
              id="output-description"
              placeholder="Mô tả định dạng và ý nghĩa của đầu ra (3-512 ký tự)..."
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

      {/* Constraints and Scoring */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Điểm số và Giới hạn
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Max Score */}
            <div className="space-y-2">
              <label
                htmlFor="max-score"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Điểm tối đa <span className="text-red-500">*</span>
              </label>
              <Input
                id="max-score"
                type="number"
                placeholder="100"
                value={problemData.maxScore}
                onChange={(e) =>
                  handleInputChange("maxScore", parseInt(e.target.value) || 0)
                }
                className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500"
                disabled={isReadOnly}
                min={1}
              />
            </div>

            {/* Time Limit */}
            <div className="space-y-2">
              <label
                htmlFor="time-limit"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Giới hạn thời gian (ms) <span className="text-red-500">*</span>
              </label>
              <Input
                id="time-limit"
                type="number"
                placeholder="1000"
                value={problemData.timeLimitMs}
                onChange={(e) =>
                  handleInputChange(
                    "timeLimitMs",
                    parseInt(e.target.value) || 0
                  )
                }
                className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500"
                disabled={isReadOnly}
                min={1}
              />
            </div>

            {/* Memory Limit */}
            <div className="space-y-2">
              <label
                htmlFor="memory-limit"
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
              >
                Giới hạn bộ nhớ (KB) <span className="text-red-500">*</span>
              </label>
              <Input
                id="memory-limit"
                type="number"
                placeholder="262144"
                value={problemData.memoryLimitKb}
                onChange={(e) =>
                  handleInputChange(
                    "memoryLimitKb",
                    parseInt(e.target.value) || 0
                  )
                }
                className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500"
                disabled={isReadOnly}
                min={1}
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
          {/* Difficulty */}
          <div className="space-y-2">
            <label
              htmlFor="difficulty"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Mức độ khó <span className="text-red-500">*</span>
            </label>
            <select
              id="difficulty"
              value={problemData.difficulty}
              onChange={(e) =>
                handleInputChange(
                  "difficulty",
                  e.target.value as "easy" | "medium" | "hard"
                )
              }
              className="w-full h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500"
              disabled={isReadOnly}
            >
              <option value="">Chọn mức độ khó</option>
              {DIFFICULTY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Topics */}
          <div className="space-y-2">
            <span className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Chủ đề <span className="text-red-500">*</span>
            </span>
            <div className="space-y-2">
              {availableTopics.map((topic) => (
                <label
                  key={topic.id}
                  className="flex items-center space-x-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={problemData.topics?.includes(topic.id) || false}
                    onChange={() => handleTopicChange(topic.id)}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    disabled={isReadOnly}
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium">{topic.name}</span>
                    {topic.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {topic.description}
                      </p>
                    )}
                  </div>
                </label>
              ))}
            </div>

            {/* Display selected topics */}
            {problemData.topics && problemData.topics.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {problemData.topics.map((topicId) => (
                  <span
                    key={topicId}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-md text-xs"
                  >
                    {getTopicName(topicId)}
                    {!isReadOnly && (
                      <button
                        type="button"
                        onClick={() => handleTopicChange(topicId)}
                        className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <span className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Tags
            </span>
            <div className="space-y-2">
              {availableTags.map((tag) => (
                <label
                  key={tag.id}
                  className="flex items-center space-x-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={problemData.tags?.includes(tag.id) || false}
                    onChange={() => handleTagChange(tag.id)}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    disabled={isReadOnly}
                  />
                  <span className="text-sm">{tag.name}</span>
                </label>
              ))}
            </div>

            {/* Display selected tags */}
            {problemData.tags && problemData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {problemData.tags.map((tagId) => (
                  <span
                    key={tagId}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-md text-xs"
                  >
                    {getTagName(tagId)}
                    {!isReadOnly && (
                      <button
                        type="button"
                        onClick={() => handleTagChange(tagId)}
                        className="ml-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Testcase File Upload */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Tệp Test Case
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="testcase-file"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
            >
              Tải Tệp Test Case <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Select a text file containing test case data. The file will be
              uploaded when you create the problem.
            </p>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <input
                  id="testcase-file"
                  type="file"
                  accept=".txt,.text,text/plain"
                  onChange={handleFileChange}
                  disabled={isReadOnly}
                  className="w-full h-12 p-3 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
              </div>

              {testcaseFile && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    {cachedTestcaseResponse
                      ? "File ready (cached)"
                      : "File selected"}
                  </div>
                  {cachedTestcaseResponse && (
                    <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      Testcase uploaded ✓
                    </div>
                  )}
                  {!isReadOnly && (
                    <Button
                      onClick={resetTestcaseUpload}
                      size="sm"
                      variant="ghost"
                      className="text-slate-500 hover:text-slate-700"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              )}

              {testcaseError && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <XCircle className="w-4 h-4" />
                  Error: {testcaseError}
                </div>
              )}
            </div>

            {testcaseFile && (
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Selected file: {testcaseFile.name} (
                {Math.round(testcaseFile.size / 1024)} KB)
              </div>
            )}

            {testcaseError && (
              <div className="text-sm text-red-600 dark:text-red-400">
                Please try selecting a different file.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Case Samples */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
            Test Case Mẫu
            {!isReadOnly && (
              <Button
                onClick={addTestcaseSample}
                size="sm"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm Test Case
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {problemData.testcaseSamples.map((sample, index) => (
              <div
                key={`testcase-sample-${sample.input}-${sample.output}-${index}`}
                className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300">
                    Test Case {index + 1}
                  </h4>
                  {!isReadOnly && problemData.testcaseSamples.length > 1 && (
                    <Button
                      onClick={() => removeTestcaseSample(index)}
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor={`input-${index}`}
                      className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Đầu vào
                    </label>
                    <textarea
                      id={`input-${index}`}
                      placeholder="Nhập dữ liệu đầu vào..."
                      value={sample.input}
                      onChange={(e) =>
                        handleTestcaseSampleChange(
                          index,
                          "input",
                          e.target.value
                        )
                      }
                      className="w-full h-20 p-3 rounded-lg border-0 bg-white dark:bg-slate-600 focus:ring-2 focus:ring-green-500 resize-none"
                      disabled={isReadOnly}
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor={`output-${index}`}
                      className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                    >
                      Đầu ra mong đợi
                    </label>
                    <textarea
                      id={`output-${index}`}
                      placeholder="Nhập kết quả mong đợi..."
                      value={sample.output}
                      onChange={(e) =>
                        handleTestcaseSampleChange(
                          index,
                          "output",
                          e.target.value
                        )
                      }
                      className="w-full h-20 p-3 rounded-lg border-0 bg-white dark:bg-slate-600 focus:ring-2 focus:ring-green-500 resize-none"
                      disabled={isReadOnly}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      {!isReadOnly && (
        <div className="flex justify-center pt-8">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {mode === "create" ? "Tạo bài tập" : "Cập nhật bài tập"}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
