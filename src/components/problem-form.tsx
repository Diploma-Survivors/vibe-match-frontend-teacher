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
  DIFFICULTY_OPTIONS,
  ProblemData,
  TestcaseSample,
  Tag,
  Topic,
} from "@/types/problem";
import { problemApi } from "@/lib/apis/problem-api";
import { Plus, Save, Trash2 } from "lucide-react";
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
        // You might want to show a toast notification here
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
          tags: currentTags.filter(t => t !== tagId)
        };
      } else {
        return {
          ...prev,
          tags: [...currentTags, tagId]
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
          topics: currentTopics.filter(t => t !== topicId)
        };
      } else {
        return {
          ...prev,
          topics: [...currentTopics, topicId]
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

  const handleSave = () => {
    onSave(problemData);
  };

  const getTagName = (tagId: string) => {
    const tag = availableTags.find(t => t.id === tagId);
    return tag?.name || tagId;
  };

  const getTopicName = (topicId: string) => {
    const topic = availableTopics.find(t => t.id === topicId);
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
          {/* Problem Title */}
          <div className="space-y-2">
            <label htmlFor="problem-title" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Tiêu đề bài tập <span className="text-red-500">*</span>
            </label>
            <Input
              id="problem-title"
              placeholder="Nhập tiêu đề bài tập (3-128 ký tự)..."
              value={problemData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500"
              disabled={isReadOnly}
              minLength={3}
              maxLength={128}
            />
          </div>

          {/* Problem Description */}
          <div className="space-y-2">
            <label htmlFor="problem-description" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Mô tả bài toán <span className="text-red-500">*</span>
            </label>
            <textarea
              id="problem-description"
              placeholder="Nhập mô tả chi tiết về bài toán (16-512 ký tự)..."
              value={problemData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full h-32 p-4 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500 resize-none"
              disabled={isReadOnly}
              minLength={16}
              maxLength={512}
            />
          </div>

          {/* Input Description */}
          <div className="space-y-2">
            <label htmlFor="input-description" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Mô tả đầu vào <span className="text-red-500">*</span>
            </label>
            <textarea
              id="input-description"
              placeholder="Mô tả định dạng và ý nghĩa của đầu vào (8-512 ký tự)..."
              value={problemData.inputDescription}
              onChange={(e) => handleInputChange("inputDescription", e.target.value)}
              className="w-full h-24 p-4 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500 resize-none"
              disabled={isReadOnly}
              minLength={8}
              maxLength={512}
            />
          </div>

          {/* Output Description */}
          <div className="space-y-2">
            <label htmlFor="output-description" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Mô tả đầu ra <span className="text-red-500">*</span>
            </label>
            <textarea
              id="output-description"
              placeholder="Mô tả định dạng và ý nghĩa của đầu ra (3-512 ký tự)..."
              value={problemData.outputDescription}
              onChange={(e) => handleInputChange("outputDescription", e.target.value)}
              className="w-full h-24 p-4 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500 resize-none"
              disabled={isReadOnly}
              minLength={3}
              maxLength={512}
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
              <label htmlFor="max-score" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Điểm tối đa <span className="text-red-500">*</span>
              </label>
              <Input
                id="max-score"
                type="number"
                placeholder="100"
                value={problemData.maxScore}
                onChange={(e) => handleInputChange("maxScore", parseInt(e.target.value) || 0)}
                className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500"
                disabled={isReadOnly}
                min={1}
              />
            </div>

            {/* Time Limit */}
            <div className="space-y-2">
              <label htmlFor="time-limit" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Giới hạn thời gian (ms) <span className="text-red-500">*</span>
              </label>
              <Input
                id="time-limit"
                type="number"
                placeholder="1000"
                value={problemData.timeLimitMs}
                onChange={(e) => handleInputChange("timeLimitMs", parseInt(e.target.value) || 0)}
                className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-green-500"
                disabled={isReadOnly}
                min={1}
              />
            </div>

            {/* Memory Limit */}
            <div className="space-y-2">
              <label htmlFor="memory-limit" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Giới hạn bộ nhớ (KB) <span className="text-red-500">*</span>
              </label>
              <Input
                id="memory-limit"
                type="number"
                placeholder="262144"
                value={problemData.memoryLimitKb}
                onChange={(e) => handleInputChange("memoryLimitKb", parseInt(e.target.value) || 0)}
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
            <label htmlFor="difficulty" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Mức độ khó <span className="text-red-500">*</span>
            </label>
            <Select
              value={problemData.difficulty}
              onValueChange={(value: 'easy' | 'medium' | 'hard') => handleInputChange("difficulty", value)}
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

          {/* Topics */}
          <div className="space-y-2">
            <span className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Chủ đề <span className="text-red-500">*</span>
            </span>
            <div className="max-h-40 overflow-y-auto border rounded-xl bg-slate-50 dark:bg-slate-700/50 p-2">
              {availableTopics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  className="flex items-center space-x-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg cursor-pointer w-full text-left"
                  onClick={() => handleTopicChange(topic.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleTopicChange(topic.id);
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    checked={problemData.topics?.includes(topic.id) || false}
                    onChange={() => {}}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    disabled={isReadOnly}
                  />
                  <span className="text-sm">{topic.name}</span>
                </button>
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
            <div className="max-h-40 overflow-y-auto border rounded-xl bg-slate-50 dark:bg-slate-700/50 p-2">
              {availableTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  className="flex items-center space-x-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg cursor-pointer w-full text-left"
                  onClick={() => handleTagChange(tag.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleTagChange(tag.id);
                    }
                  }}
                >
                  <input
                    type="checkbox"
                    checked={problemData.tags?.includes(tag.id) || false}
                    onChange={() => {}}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                    disabled={isReadOnly}
                  />
                  <span className="text-sm">{tag.name}</span>
                </button>
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
                key={`testcase-${index}`}
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
                    <label htmlFor={`input-${index}`} className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Đầu vào
                    </label>
                    <textarea
                      id={`input-${index}`}
                      placeholder="Nhập dữ liệu đầu vào..."
                      value={sample.input}
                      onChange={(e) => handleTestcaseSampleChange(index, "input", e.target.value)}
                      className="w-full h-20 p-3 rounded-lg border-0 bg-white dark:bg-slate-600 focus:ring-2 focus:ring-green-500 resize-none"
                      disabled={isReadOnly}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor={`output-${index}`} className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Đầu ra mong đợi
                    </label>
                    <textarea
                      id={`output-${index}`}
                      placeholder="Nhập kết quả mong đợi..."
                      value={sample.output}
                      onChange={(e) => handleTestcaseSampleChange(index, "output", e.target.value)}
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
    onSave(problemData);
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