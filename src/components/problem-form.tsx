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
  DIFFICULTY_OPTIONS,
  type ProblemData,
  ProblemSchema,
  initialProblemData,
} from '@/types/problems';
import type { Tag } from '@/types/tags';
import type { TestcaseSample } from '@/types/testcases';
import type { Topic } from '@/types/topics';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
  Controller,
  FieldValues,
  type SubmitHandler,
  useForm,
} from 'react-hook-form';
import CheckBoxList from './checkbox-list';
import SampleTestcases from './testcases/sample-testcases';
import TestCaseUploader from './testcases/testcases-uploader';

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
  const [isLoadingTags, setIsLoadingTags] = useState<boolean>(false);
  const [isLoadingTopics, setIsLoadingTopics] = useState<boolean>(false);

  const form = useForm<ProblemData>({
    resolver: zodResolver(ProblemSchema),
    mode: 'onTouched',
    defaultValues: initialData ? initialData : initialProblemData,
    disabled: isReadOnly,
  });

  const {
    control,
    handleSubmit,
    trigger,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = form;

  useEffect(() => {
    loadTagsAndTopics();
  }, []);

  const loadTagsAndTopics = async () => {
    try {
      setIsLoadingTags(true);
      setIsLoadingTopics(true);
      const [tagsResponse, topicsResponse] = await Promise.all([
        TagsService.getAllTags(),
        TopicsService.getAllTopics(),
      ]);

      setAvailableTags(tagsResponse.data.data);
      setAvailableTopics(topicsResponse.data.data);
    } catch (error) {
      setAvailableTags([]);
      setAvailableTopics([]);
    } finally {
      setIsLoadingTags(false);
      setIsLoadingTopics(false);
    }
  };

  const onSubmit: SubmitHandler<ProblemData> = (data) => {
    if (onSave) {
      onSave(data);
    }
  };

  // Memoized handler to avoid infinite re-renders
  const handleTestcasesSampleChange = useCallback(
    (newTestCases: TestcaseSample[]) => {
      setValue('testcaseSamples', newTestCases);
      trigger('testcaseSamples');
    },
    [trigger, setValue]
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto space-y-8"
    >
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
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
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
                  disabled={isReadOnly}
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
                    errors.inputDescription
                      ? 'ring-red-500'
                      : 'focus:ring-blue-500'
                  }`}
                />
              )}
            />
            {errors.inputDescription && (
              <p className="text-sm text-red-500">
                {errors.inputDescription.message}
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
                    errors.outputDescription
                      ? 'ring-red-500'
                      : 'focus:ring-blue-500'
                  }`}
                />
              )}
            />
            {errors.outputDescription && (
              <p className="text-sm text-red-500">
                {errors.outputDescription.message}
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
                    type="number"
                    placeholder="Nhập giới hạn thời gian..."
                    onChange={(e) =>
                      field.onChange(Number.parseInt(e.target.value, 10) || 0)
                    }
                    className={`h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 ${
                      errors.timeLimitMs
                        ? 'ring-red-500'
                        : 'focus:ring-green-500'
                    }`}
                  />
                )}
              />
              {errors.timeLimitMs && (
                <p className="text-sm text-red-500">
                  {errors.timeLimitMs.message}
                </p>
              )}
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
                    type="number"
                    placeholder="Nhập giới hạn bộ nhớ..."
                    onChange={(e) =>
                      field.onChange(Number.parseInt(e.target.value, 10) || 0)
                    }
                    className={`h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 ${
                      errors.memoryLimitKb
                        ? 'ring-red-500'
                        : 'focus:ring-green-500'
                    }`}
                  />
                )}
              />
              {errors.memoryLimitKb && (
                <p className="text-sm text-red-500">
                  {errors.memoryLimitKb.message}
                </p>
              )}
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
                    type="number"
                    placeholder="Nhập điểm tối đa..."
                    onChange={(e) =>
                      field.onChange(Number.parseInt(e.target.value, 10) || 0)
                    }
                    className={`h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 ${
                      errors.maxScore ? 'ring-red-500' : 'focus:ring-green-500'
                    }`}
                  />
                )}
              />
              {errors.maxScore && (
                <p className="text-sm text-red-500">
                  {errors.maxScore.message}
                </p>
              )}
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
            {errors.difficulty && (
              <p className="text-sm text-red-500">
                {errors.difficulty.message}
              </p>
            )}
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

            <Controller
              name="topics"
              control={control}
              render={({ field }) => (
                <div className="space-y-3">
                  {(field.value?.length ?? 0) > 0 && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="flex flex-wrap gap-2">
                        {field.value?.map((tag) => (
                          <div
                            key={`selected-${tag.id}`}
                            className="flex items-center gap-2 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 text-sm font-medium px-3 py-1 rounded-full"
                          >
                            <span>{tag.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {!isReadOnly && (
                    <CheckBoxList
                      availableItems={availableTopics}
                      selectedItemIds={field.value.map((t) => t.id)}
                      isLoading={isLoadingTopics}
                      onChange={(newTopics) => {
                        field.onChange(newTopics);
                        trigger('topics');
                      }}
                    />
                  )}
                </div>
              )}
            />
            {errors.topics && (
              <p className="text-sm text-red-500">{errors.topics.message}</p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Tags
            </label>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <div className="space-y-3">
                  {(field.value?.length ?? 0) > 0 && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="flex flex-wrap gap-2">
                        {field.value?.map((topic) => (
                          <div
                            key={`selected-${topic.id}`}
                            className="flex items-center gap-2 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 text-sm font-medium px-3 py-1 rounded-full"
                          >
                            <span>{topic.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {!isReadOnly && (
                    <CheckBoxList
                      availableItems={availableTags}
                      selectedItemIds={field.value.map((t) => t.id)}
                      isLoading={isLoadingTags}
                      onChange={(newTags) => {
                        field.onChange(newTags);
                        trigger('tags');
                      }}
                    />
                  )}
                </div>
              )}
            />
            {errors.tags && (
              <p className="text-sm text-red-500">{errors.tags.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Cases Upload */}
      <Controller
        name="testcase"
        control={control}
        render={({ field, fieldState }) => (
          <TestCaseUploader
            value={field.value}
            onChange={(val) => {
              field.onChange(val);
            }}
            onError={(message) => {
              if (message) {
                setError('testcase', { type: 'manual', message });
              } else {
                clearErrors('testcase');
              }
            }}
            errorMessage={fieldState.error?.message}
            isReadOnly={isReadOnly}
            title="Tải lên File Test Cases"
            testCaseResponse={initialData?.testcaseResponse}
          />
        )}
      />

      {/* Sample Test Cases */}
      <Controller
        name="testcaseSamples"
        control={control}
        render={({ field, fieldState }) => (
          <SampleTestcases
            sampleTestcases={field.value}
            onChange={handleTestcasesSampleChange}
            errorMessage={fieldState.error?.message}
            isReadOnly={isReadOnly}
          />
        )}
      />

      {/* Save Button */}
      {!isReadOnly && (
        <div className="flex justify-end">
          <Button
            type="submit"
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
    </form>
  );
}
