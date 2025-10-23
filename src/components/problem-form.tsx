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
  initialProblemData,
  type ProblemData,
  ProblemSchema
} from "@/types/problems";
import type { Tag } from "@/types/tags";
import type { Topic } from "@/types/topics";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Save
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Controller,
  type SubmitHandler,
  useForm
} from "react-hook-form";
import SampleTestcases from "./testcases/sample-testcases";
import TestCaseUploader from "./testcases/testcases-uploader";

export enum ProblemFormMode {
  CREATE = "create",
  EDIT = "edit",
  VIEW = "view",
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

  const form = useForm<ProblemData>({
    resolver: zodResolver(ProblemSchema),
    mode: "onTouched",
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
    // try {
    //   const [tagsResponse, topicsResponse] = await Promise.all([
    //     TagsService.getAllTags(),
    //     TopicsService.getAllTopics(),
    //   ]);

    //   setAvailableTags(tagsResponse.data.data);
    //   setAvailableTopics(topicsResponse.data.data);
    // } catch (error) {
    //   setAvailableTags([]);
    //   setAvailableTopics([]);
    // }
    const mockTags = [
      { id: 1, name: "Array" },
      { id: 2, name: "String" },
      { id: 3, name: "Dynamic Programming" },
      { id: 4, name: "Graph" },
    ];
    const mockTopics = [
      { id: 1, name: "Beginner" },
      { id: 2, name: "Intermediate" },
      { id: 3, name: "Advanced" },
      { id: 4, name: "Expert" },
    ];
    setAvailableTags(mockTags);
    setAvailableTopics(mockTopics);

  };

  const handleToggleSelection = (
    currentSelection: number[] | undefined,
    itemId: number,
    onChange: (newSelection: number[]) => void
  ) => {
    if (isReadOnly) return;

    const selection = currentSelection || [];
    const isSelected = selection.includes(itemId);

    let newSelection: number[];

    if (isSelected) {
      // If it's already selected, remove it
      newSelection = selection.filter((id) => id !== itemId);
    } else {
      // If it's not selected, add it
      newSelection = [...selection, itemId];
    }

    onChange(newSelection);
  };

  const onSubmit: SubmitHandler<ProblemData> = (data) => {
    if (onSave) {
      onSave(data);
    }
  };

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
                    errors.title ? "ring-red-500" : "focus:ring-green-500"
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
                  placeholder="Nhập mô tả chi tiết về bài tập..."
                  className={`w-full h-32 p-4 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 resize-none ${
                    errors.description ? "ring-red-500" : "focus:ring-blue-500"
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
                    errors.inputDescription ? "ring-red-500" : "focus:ring-blue-500"
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
                    errors.outputDescription ? "ring-red-500" : "focus:ring-blue-500"
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
                      errors.timeLimitMs ? "ring-red-500" : "focus:ring-green-500"
                    }`}
                  />
                )}
              />
              {errors.timeLimitMs && (
                <p className="text-sm text-red-500">{errors.timeLimitMs.message}</p>
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
                      errors.memoryLimitKb ? "ring-red-500" : "focus:ring-green-500"
                    }`}
                  />
                )}
              />
              {errors.memoryLimitKb && (
                <p className="text-sm text-red-500">{errors.memoryLimitKb.message}</p>
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
                      errors.maxScore ? "ring-red-500" : "focus:ring-green-500"
                    }`}
                  />
                )}
              />
              {errors.maxScore && (
                <p className="text-sm text-red-500">{errors.maxScore.message}</p>
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
                  {availableTopics.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {availableTopics.map((topic) => {
                        // Check if the current topic is selected
                        const isSelected = field.value?.some(
                          (t) => t.id === topic.id
                        );
                        return (
                          <div
                            key={topic.id}
                            className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                              isSelected
                                ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700"
                                : "bg-slate-50 border-slate-200 hover:bg-slate-100 dark:bg-slate-700/30 dark:border-slate-600 dark:hover:bg-slate-700/50"
                            }`}
                            onClick={() =>
                              handleToggleSelection(
                                field.value?.map((t) => t.id),
                                topic.id,
                                (newIds) => {
                                  const newTopics = availableTopics.filter(
                                    (t) => newIds.includes(t.id)
                                  );
                                  field.onChange(newTopics);
                                  trigger('topics');
                                }
                              )
                            }
                            aria-label={`Toggle ${topic.name} topic`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected || false}
                              readOnly
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                              disabled={isReadOnly}
                            />
                            <span className="text-sm font-medium">
                              {topic.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-slate-500">
                      Đang tải chủ đề...
                    </div>
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
                  {availableTags.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {availableTags.map((tag) => {
                        const isSelected = field.value?.some(
                          (t) => t.id === tag.id
                        );
                        return (
                          <div
                            key={tag.id}
                            className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                              isSelected
                                ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700"
                                : "bg-slate-50 border-slate-200 hover:bg-slate-100 dark:bg-slate-700/30 dark:border-slate-600 dark:hover:bg-slate-700/50"
                            }`}
                            onClick={() =>
                              handleToggleSelection(
                                field.value?.map((t) => t.id),
                                tag.id,
                                (newIds) => {
                                  const newTags = availableTags.filter((t) =>
                                    newIds.includes(t.id)
                                  );
                                  field.onChange(newTags);
                                  trigger('tags');
                                }
                              )
                            }
                            aria-label={`Toggle ${tag.name} tag`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected || false}
                              readOnly
                              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                              disabled={isReadOnly}
                            />
                            <span className="text-sm font-medium">
                              {tag.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-slate-500">
                      Đang tải tags...
                    </div>
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
                setError("testcase", { type: "manual", message });
              } else {
                clearErrors("testcase");
              }
            }}
            errorMessage={fieldState.error?.message}
            isReadOnly={isReadOnly}
            title="Tải lên File Test Cases"
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
            onChange={(val) => {
              field.onChange(val);
              trigger('testcaseSamples');
            }}
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
              ? "Đang lưu..."
              : mode === ProblemFormMode.CREATE
              ? "Tạo bài tập"
              : "Cập nhật bài tập"}
          </Button>
        </div>
      )}
    </form>
  );
}
