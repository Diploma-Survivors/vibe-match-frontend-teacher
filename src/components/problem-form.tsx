'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TagsService } from '@/services/tags-service';
import { TopicsService } from '@/services/topics-service';
import {
  type CreateProblemRequest,
  DIFFICULTY_OPTIONS,
  type ProblemData,
  ProblemDifficulty,
  ProblemType,
  ProblemSchema,
  AllowedTypes,
  AllowedExtensions
} from '@/types/problems';
import type { Tag } from '@/types/tags';
import type { TestcaseSample } from '@/types/testcases';
import type { Topic } from '@/types/topics';
import {
  FileSpreadsheet,
  FileText,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, useFieldArray, type SubmitHandler } from 'react-hook-form';
import path from 'path';

export enum ProblemFormMode {
  CREATE = 'create',
  EDIT = 'edit',
  VIEW = 'view',
}

interface ProblemFormProps {
  mode: ProblemFormMode;
  onSave?: (data: ProblemData) => Promise<void>;
  isSaving?: boolean;
  title?: string;
  subtitle?: string;
  initialData?: ProblemData;
}



export default function ProblemForm({
  mode,
  onSave,
  isSaving = false,
  title,
  subtitle,
  initialData,
}: ProblemFormProps) {
  const isReadOnly = mode === ProblemFormMode.VIEW;

  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [availableTopics, setAvailableTopics] = useState<Topic[]>([]);
  const [currentTestPage, setCurrentTestPage] = useState(1);
  const [dragActive, setDragActive] = useState(false);
  const [showTestcaseError, setShowTestcaseError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<ProblemData>({
    resolver: zodResolver(ProblemSchema),
    mode: 'onTouched',
    defaultValues: initialData,
    disabled: isReadOnly,
  });

  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = form;

  const testcaseFile = watch('testcase');



  useEffect(() => {
    if (initialData) {
      setCreateProblemRequest({
        title: initialData.title || '',
        description: initialData.description || '',
        inputDescription: initialData.inputDescription || '',
        outputDescription: initialData.outputDescription || '',
        maxScore: initialData.maxScore || 100,
        timeLimitMs: initialData.timeLimitMs || 1000,
        memoryLimitKb: initialData.memoryLimitKb || 262144,
        difficulty: initialData.difficulty || ProblemDifficulty.EASY,
        type: (initialData.type as ProblemType) || ProblemType.STANDALONE,
        tagIds: initialData.tags?.map((tag) => tag.id) || [],
        topicIds: initialData.topics?.map((topic) => topic.id) || [],
        testcase: (initialData.testcase as File) || undefined,
        testcaseSamples: initialData.testcaseSamples?.length
          ? initialData.testcaseSamples
          : [{ input: '', output: '' }],
      });
    }
  }, [initialData]);

  const mockTags : Tag[] = [
    { id: 1, name: 'Array' },
    { id: 2, name: 'String' },]

  const mockTopics : Topic[] = [
    { id: 1, name: 'Data Structures' },
    { id: 2, name: 'Algorithms' },]

  // Load tags and topics when component mounts
  useEffect(() => {
    // const loadTagsAndTopics = async () => {
    //   try {
    //     const [tagsResponse, topicsResponse] = await Promise.all([
    //       TagsService.getAllTags(),
    //       TopicsService.getAllTopics(),
    //     ]);

    //     setAvailableTags(tagsResponse.data.data);
    //     setAvailableTopics(topicsResponse.data.data);
    //   } catch (error) {
    //     setAvailableTags([]);
    //     setAvailableTopics([]);
    //   }
    // };

    // loadTagsAndTopics();
    setAvailableTags(mockTags);
    setAvailableTopics(mockTopics);
  }, []);

  // Test case pagination constants
  const testCasesPerPage = 3;
  const totalTestPages = Math.ceil(
    (createProblemRequest.testcaseSamples?.length || 0) / testCasesPerPage
  );
  const startTestIndex = (currentTestPage - 1) * testCasesPerPage;
  const endTestIndex = Math.min(
    startTestIndex + testCasesPerPage,
    createProblemRequest.testcaseSamples?.length || 0
  );
  const currentTestCases = (createProblemRequest.testcaseSamples || []).slice(
    startTestIndex,
    endTestIndex
  );


  const handleTagChange = (tagId: number) => {
    if (isReadOnly) return;
    setCreateProblemRequest((prev) => {
      const currentTags = prev.tagIds || [];
      const isSelected = currentTags.includes(tagId);

      if (isSelected) {
        return {
          ...prev,
          tagIds: currentTags.filter((t: number) => t !== tagId),
        };
      }
      return {
        ...prev,
        tagIds: [...currentTags, tagId],
      };
    });
  };

  const handleTopicChange = (topicId: number) => {
    if (isReadOnly) return;
    setCreateProblemRequest((prev) => {
      const currentTopics = prev.topicIds || [];
      const isSelected = currentTopics.includes(topicId);

      if (isSelected) {
        return {
          ...prev,
          topicIds: currentTopics.filter((t: number) => t !== topicId),
        };
      }
      return {
        ...prev,
        topicIds: [...currentTopics, topicId],
      };
    });
  };

  const handleTestCaseChange = (
    index: number,
    field: keyof TestcaseSample,
    value: string
  ) => {
    if (isReadOnly) return;
    setCreateProblemRequest((prev) => ({
      ...prev,
      testcaseSamples: prev.testcaseSamples.map((testCase, i) =>
        i === index ? { ...testCase, [field]: value } : testCase
      ),
    }));
  };

  const addTestCase = () => {
    if (isReadOnly) return;
    setCreateProblemRequest((prev) => ({
      ...prev,
      testcaseSamples: [
        ...prev.testcaseSamples,
        {
          input: '',
          output: '',
        },
      ],
    }));
  };

  const removeTestCase = (index: number) => {
    if (isReadOnly || (createProblemRequest.testcaseSamples?.length || 0) <= 1)
      return;
    setCreateProblemRequest((prev) => ({
      ...prev,
      testcaseSamples: (prev.testcaseSamples || []).filter(
        (_, i) => i !== index
      ),
    }));
  };

  // File upload handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      processFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setValue('testcase', null, { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit: SubmitHandler<ProblemData> = (data) => {
    // 1. Conditional validation: check for the file only in 'create' mode
    if (mode === ProblemFormMode.CREATE && !data.testcase) {
      setError('testcase', {
        type: 'manual',
        message: 'File test case là bắt buộc khi tạo bài tập mới.',
      });
      return; // Stop submission
    }

    // 2. If all validation passes, call the onSave prop
    if (onSave) {
      onSave(data);
    }
  };


// --- NEW UNIFIED FILE PROCESSING LOGIC ---
const processFile = (file: File | undefined) => {
  if (!file) return;

  const validationResult = validateTestcaseFile(file);

  if (validationResult.isValid) {
    setValue('testcase', file, { shouldValidate: true });
    clearErrors('testcase'); // Clear any previous errors
  } else {
    setValue('testcase', null, { shouldValidate: true }); // Clear the invalid file from the form state
    setError('testcase', { type: 'manual', message: validationResult.error });
  }
};

function validateTestcaseFile(file: File | null): { isValid: boolean; error?: string } {
  if (!file) {
    // This is not an error in itself, but the file is not valid for upload.
    return { isValid: false };
  }

  const hasValidType = AllowedTypes.includes(file.type);
  const hasValidExtension = AllowedExtensions.some((ext) =>
    file.name.toLowerCase().endsWith(ext)
  );

  if (hasValidType || hasValidExtension) {
    return { isValid: true };
  }

  return {
    isValid: false,
    error: `Định dạng file không hợp lệ. Chỉ chấp nhận: ${AllowedExtensions.join(', ')}`,
  };
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
          {/* Problems Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Tên bài tập <span className="text-red-500">*</span>
            </label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Nhập tên bài tập..."
                  className={`h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 ${
                    errors.title ? 'ring-red-500' : 'focus:ring-green-500'
                  }`}
                />
              )}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          {/* Problems Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Mô tả bài toán <span className="text-red-500">*</span>
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="Nhập mô tả chi tiết về bài tập..."
                  className={`w-full h-32 p-4 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 resize-none ${
                    errors.description ? 'ring-red-500' : 'focus:ring-blue-500'
                  }`}
                />
              )}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Input Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Mô tả đầu vào <span className="text-red-500">*</span>
            </label>
            <Controller
              name="inputDescription"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="Nhập mô tả đầu vào..."
                  className={`w-full h-32 p-4 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 resize-none ${
                    errors.description ? 'ring-red-500' : 'focus:ring-blue-500'
                  }`}
                />
              )}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Output Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Mô tả đầu ra <span className="text-red-500">*</span>
            </label>
            <Controller
              name="outputDescription"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="Nhập mô tả đầu ra..."
                  className={`w-full h-32 p-4 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 resize-none ${
                    errors.description ? 'ring-red-500' : 'focus:ring-blue-500'
                  }`}
                />
              )}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
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
              <Controller
              name="timeLimitMs"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  // placeholder="Nhập tên bài tập..."
                  className={`h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 ${
                    errors.title ? 'ring-red-500' : 'focus:ring-green-500'
                  }`}
                />
              )}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            {/* Memory Limit */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Giới hạn bộ nhớ (KB)
              </label>
              <Controller
              name="memoryLimitKb"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  // placeholder="Nhập tên bài tập..."
                  className={`h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 ${
                    errors.title ? 'ring-red-500' : 'focus:ring-green-500'
                  }`}
                />
              )}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            {/* Max Score */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Điểm tối đa
              </label>
              <Controller
              name="maxScore"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  // placeholder="Nhập tên bài tập..."
                  className={`h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 ${
                    errors.title ? 'ring-red-500' : 'focus:ring-green-500'
                  }`}
                />
              )}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Mức độ khó <span className="text-red-500">*</span>
            </label>
            <Controller
              name="difficulty"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={field.disabled}
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
              )}
            />
            {errors.difficulty && <p className="text-sm text-red-500">{errors.difficulty.message}</p>}            
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
                        createProblemRequest.topicIds?.includes(topic.id)
                          ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 dark:bg-slate-700/30 dark:border-slate-600 dark:hover:bg-slate-700/50'
                      }`}
                      onClick={() => !isReadOnly && handleTopicChange(topic.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          !isReadOnly && handleTopicChange(topic.id);
                        }
                      }}
                      // role="button"
                      // tabIndex={0}
                      aria-label={`Toggle ${topic.name} topic`}
                    >
                      <input
                        type="checkbox"
                        checked={
                          createProblemRequest.topicIds?.includes(topic.id) ||
                          false
                        }
                        onChange={() => {}}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
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
                        createProblemRequest.tagIds?.includes(tag.id)
                          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 dark:bg-slate-700/30 dark:border-slate-600 dark:hover:bg-slate-700/50'
                      }`}
                      onClick={() => !isReadOnly && handleTagChange(tag.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          !isReadOnly && handleTagChange(tag.id);
                        }
                      }}
                      // role="button"
                      // tabIndex={0}
                      aria-label={`Toggle ${tag.name} tag`}
                    >
                      <input
                        type="checkbox"
                        checked={
                          createProblemRequest.tagIds?.includes(tag.id) || false
                        }
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
                ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                : 'border-slate-300 dark:border-slate-600'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {createProblemRequest.testcase ? (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full">
                  {createProblemRequest.testcase.name
                    .toLowerCase()
                    .endsWith('.csv') ||
                  createProblemRequest.testcase.name
                    .toLowerCase()
                    .endsWith('.xlsx') ||
                  createProblemRequest.testcase.name
                    .toLowerCase()
                    .endsWith('.xls') ? (
                    <FileSpreadsheet className="w-8 h-8 text-green-600 dark:text-green-400" />
                  ) : (
                    <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    {createProblemRequest.testcase.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {(createProblemRequest.testcase.size / 1024).toFixed(2)} KB
                  </p>
                  <span className="inline-block px-2 py-1 mt-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-md">
                    {createProblemRequest.testcase.name
                      .split('.')
                      .pop()
                      ?.toUpperCase()}
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

          {/* Error message for missing testcase file */}
          {showTestcaseError && mode === ProblemFormMode.CREATE && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-label="Error icon"
                    role="img"
                  >
                    <title>Error</title>
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    File test case bắt buộc
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    Vui lòng tải lên file test case để tạo bài tập. File test
                    case chứa các test case sẽ được sử dụng để kiểm tra code của
                    học sinh.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Test Cases */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Test Cases Mẫu ({createProblemRequest.testcaseSamples.length})
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
                  {!isReadOnly &&
                    createProblemRequest.testcaseSamples.length > 1 && (
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
                          'input',
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
                          'output',
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
                tổng số {createProblemRequest.testcaseSamples.length}
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
                            currentTestPage === pageNum ? 'default' : 'outline'
                          }
                          size="sm"
                          onClick={() => setCurrentTestPage(pageNum)}
                          className={`w-8 h-8 p-0 text-xs ${
                            currentTestPage === pageNum
                              ? 'bg-green-600 text-white'
                              : 'border-slate-300 dark:border-slate-600'
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
              ? 'Đang lưu...'
              : mode === ProblemFormMode.CREATE
                ? 'Tạo bài tập'
                : 'Cập nhật bài tập'}
          </Button>
        </div>
      )}
    </div>
  );
}
