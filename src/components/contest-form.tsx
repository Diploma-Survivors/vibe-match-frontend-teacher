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
import { mockProblems } from '@/lib/data/mock-problems';
import { ProblemsService } from '@/services/problems-service';
import { toastService } from '@/services/toasts-service';
import { type Contest, ContestStatus } from '@/types/contest';
import {
  type CreateProblemRequest,
  type ProblemData,
  ProblemEndpointType,
  ProblemType,
  getDifficultyColor,
  getDifficultyLabel,
} from '@/types/problems';
import {
  BarChart3,
  Calendar,
  Clock,
  Edit,
  Plus,
  Save,
  Search,
  Settings,
  Trash2,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
import ProblemForm, { ProblemFormMode } from './problem-form';
import ProblemList from './problem-list';
import ProblemScoreModal from './problem-score-modal';
import {
  useForm,
  Controller,
  useFieldArray,
  SubmitHandler,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export enum ContestFormMode {
  CREATE = 'create',
  EDIT = 'edit',
  VIEW = 'view',
}

interface ContestFormProps {
  initialData: Contest;
  mode: ContestFormMode;
  onSave: (data: Contest) => Promise<void>;
  isSaving?: boolean;
  title: string;
  subtitle: string;
}

const contestSchema = z
  .object({
    name: z.string().trim().min(1, 'Tên cuộc thi là bắt buộc'),
    description: z.string().trim().min(1, 'Mô tả cuộc thi là bắt buộc'),
    status: z.nativeEnum(ContestStatus, {
      error: () => ({ message: 'Phạm vi truy cập là bắt buộc' }),
    }),
    startTime: z.string().min(1, 'Thời gian bắt đầu là bắt buộc'),
    endTime: z.string().min(1, 'Thời gian kết thúc là bắt buộc'),
    durationMinutes: z
      .number()
      .positive('Thời lượng cuộc thi phải lớn hơn 0'),
    problems: z.array(z.any()).min(1, 'Cuộc thi phải có ít nhất 1 bài'),
    // Keep other fields if they don't need validation
    id: z.number().optional(),
    createdBy: z.string().optional(),
  })
  .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: 'Thời gian kết thúc phải sau thời gian bắt đầu',
    path: ['endTime'], // Apply the error to the endTime field
  });



export default function ContestForm({
  initialData,
  mode,
  onSave,
  isSaving = false,
  title,
  subtitle,
}: ContestFormProps) {
  const [contestData, setContestData] = useState<Contest>(initialData);
  const [showProblemModal, setShowProblemModal] = useState(false);
  const [problemSearch, setProblemSearch] = useState('');
  const [showNewProblemModal, setShowNewProblemModal] = useState(false);
  const [isCreatingProblem, setIsCreatingProblem] = useState(false);
  const [showProblemDetailModal, setShowProblemDetailModal] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<ProblemData | null>(
    null
  );



  // Score modal states
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [pendingProblem, setPendingProblem] = useState<ProblemData | null>(
    null
  );

  const isReadOnly = mode === ContestFormMode.VIEW;

  const form = useForm<Contest>({
     resolver: zodResolver(contestSchema), // We will create this schema next
    mode: 'onTouched', // Or 'onBlur'
    defaultValues: initialData,
    disabled: isReadOnly,
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    setError, // <-- Get setError
    clearErrors, // <-- Get clearErrors
  } = form;

  // Add this handler function
  const handleViewProblemDetail = async (problem: ProblemData) => {
    setSelectedProblem(problem);
    setShowProblemDetailModal(true);
  };

  const handleInputChange = (
    field: keyof Contest,
    value: string | number | string[]
  ) => {
    if (isReadOnly) return;
    setContestData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddProblem = (problem: ProblemData) => {
    if (isReadOnly) return;
    if (contestData.problems.some((obj) => obj.id === problem.id)) {
      toastService.error('Bài thi đã được thêm vào cuộc thi.');
      return;
    }
    setContestData((prev) => ({
      ...prev,
      problems: [...prev.problems, problem],
    }));
    setPendingProblem(problem);
    setShowScoreModal(true);
    setShowProblemModal(false);
    setProblemSearch('');
  };

  const handleCreateProblem = async (data: CreateProblemRequest) => {
    setIsCreatingProblem(true);

    try {
      let result: any;

      if (data.testcase) {
        result = await ProblemsService.createProblemComplete({
          ...data,
          type: ProblemType.CONTEST,
        });
      }
      if (result) {
        const newProblem = result;

        // Transform API response to ProblemData format if needed
        const problemData: ProblemData = {
          id: newProblem.id,
          title: newProblem.title,
          description: newProblem.description,
          inputDescription: newProblem.inputDescription,
          outputDescription: newProblem.outputDescription,
          maxScore: newProblem.maxScore,
          timeLimitMs: newProblem.timeLimitMs,
          memoryLimitKb: newProblem.memoryLimitKb,
          difficulty: newProblem.difficulty,
          tags: newProblem.tagIds || [],
          topic: newProblem.topicIds?.[0] || '',
          testcase: newProblem.testcaseId || '',
          testcaseSamples: newProblem.testcaseSamples || [],
        };

        setContestData((prevData) => ({
          ...prevData,
          problems: [...prevData.problems, problemData],
        }));

        setPendingProblem(problemData);
        setShowScoreModal(true);
        setShowNewProblemModal(false);
      }
    } catch (error) {
      console.error('Failed to create problem:', error);
      alert('Failed to create problem. Please try again.');
    } finally {
      setIsCreatingProblem(false);
    }
  };

  const handleRemoveProblem = (problemId: number) => {
    if (isReadOnly) return;
    setContestData((prev) => ({
      ...prev,
      problems: prev.problems.filter((problem) => problem.id !== problemId),
    }));
  };

  const calculateDuration = () => {
    if (contestData.startTime && contestData.endTime) {
      const start = new Date(contestData.startTime);
      const end = new Date(contestData.endTime);
      const durationMs = end.getTime() - start.getTime();
      const durationMinutes = Math.floor(durationMs / (1000 * 60));
      handleInputChange('durationMinutes', durationMinutes);
    }
  };

  const handleSave = () => {
    onSave(contestData);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'chưa bắt đầu':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'đang diễn ra':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'đã kết thúc':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const handleSaveScore = (score: number) => {
    if (pendingProblem) {
      setContestData((prev) => ({
        ...prev,
        problems: prev.problems.map((p) =>
          p.id === pendingProblem.id ? { ...p, score } : p
        ),
      }));
    }

    setShowScoreModal(false);
    setPendingProblem(null);
  };

  const handleEditProblemScore = (problem: ProblemData) => {
    if (isReadOnly) return;
    setPendingProblem(problem);
    setShowScoreModal(true);
  };

  const onSubmit: SubmitHandler<Contest> = (data) => {
    // Run manual validation first
    // if (validateForm(data)) {
    //   // If valid, call onSave
    //   onSave(data);
    // }
    onSave(data);
  };


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
     className="max-w-6xl mx-auto space-y-8">
      {/* Header Info */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
          {title}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">{subtitle}</p>
      </div>

      {/* Contest Stats (View mode only) */}
      {mode === ContestFormMode.VIEW && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Trạng thái
                  </p>
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      contestData.status
                    )}`}
                  >
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
                {/* <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Thí sinh
                  </p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {contestData.participants || 0}
                  </p>
                </div> */}
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
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Số bài
                  </p>
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
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Thời lượng
                  </p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {Math.floor(contestData.durationMinutes / 60)}h{' '}
                    {contestData.durationMinutes % 60}m
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
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Nhập tên cuộc thi..."
                  className={`h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 ${
                    errors.name ? 'ring-red-500' : 'focus:ring-blue-500'
                  }`}
                />
              )}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Contest Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Mô tả cuộc thi <span className="text-red-500">*</span>
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="Nhập mô tả chi tiết về cuộc thi..."
                  className={`w-full h-32 p-4 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 resize-none ${
                    errors.description ? 'ring-red-500' : 'focus:ring-blue-500'
                  }`}
                />
              )}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Access Range */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Phạm vi truy cập <span className="text-red-500">*</span>
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    // The disabled state is now handled automatically by the form config
                  >
                    <SelectTrigger
                      className={`h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 ${
                        errors.status
                          ? 'ring-red-500' // Apply red ring on error
                          : 'focus:ring-green-500'
                      }`}
                    >
                      <SelectValue placeholder="Chọn phạm vi truy cập" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ContestStatus.PUBLIC}>
                        Công khai
                      </SelectItem>
                      <SelectItem value={ContestStatus.PRIVATE}>
                        Riêng tư
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {/* Display validation error message */}
              {errors.status && (
                <p className="text-sm text-red-500">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>

          {/* Creator info (View mode only) */}
          {mode === ContestFormMode.VIEW && contestData.createdBy && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Người tạo
              </label>
              <p className="text-slate-600 dark:text-slate-400">
                {contestData.createdBy}
              </p>
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
              <Controller
                name="startTime"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="datetime-local"
                      value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                      onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value).toISOString() : '')}
                      className={`h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 ${
                        errors.startTime ? 'ring-red-500' : 'focus:ring-blue-500'
                      }`}
                    />
                  )}
                />
                {errors.startTime && <p className="text-sm text-red-500">{errors.startTime.message}</p>}
            </div>

            {/* End Time */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Thời gian kết thúc <span className="text-red-500">*</span>
              </label>
              <Controller
                name="endTime"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="datetime-local"
                      value={field.value ? new Date(field.value).toISOString().slice(0, 16) : ''}
                      onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value).toISOString() : '')}
                      className={`h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 ${
                        errors.startTime ? 'ring-red-500' : 'focus:ring-blue-500'
                      }`}
                    />
                  )}
                />
                {errors.endTime && <p className="text-sm text-red-500">{errors.endTime.message}</p>}
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Thời lượng cuộc thi (phút)
            </label>
            <Controller
              name="durationMinutes"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                  placeholder="180"
                  className={`h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 ${errors.durationMinutes ? 'ring-red-500' : 'focus:ring-green-500'}`}
                />
              )}
            />
            {errors.durationMinutes && <p className="text-sm text-red-500">{errors.durationMinutes.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Problems List */}
      <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Danh sách bài tập ({contestData.problems.length})
            </CardTitle>
            {!isReadOnly && (
              <div>
                <Button
                  className="cursor-pointer bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  onClick={() => setShowNewProblemModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo bài tập mới
                </Button>
                <Button
                  onClick={() => setShowProblemModal(true)}
                  className="ml-3 cursor-pointer bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm bài tập
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {contestData.problems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                {isReadOnly
                  ? 'Cuộc thi này chưa có bài tập nào'
                  : 'Chưa có bài tập nào được thêm vào cuộc thi'}
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
              {contestData.problems.map((problem, index) => (
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
                        <div
                          className={`${getDifficultyColor(
                            problem.difficulty
                          )} font-medium px-3 py-1 rounded-lg border text-xs inline-block`}
                        >
                          {getDifficultyLabel(problem.difficulty)}
                        </div>
                        {problem.score !== undefined && (
                          <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded font-semibold">
                            {problem.score} điểm
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isReadOnly && (
                      <>
                        <Button
                          onClick={() => handleEditProblemScore(problem)}
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleRemoveProblem(problem.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
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
          type="submit"
            // onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg"
          >
            <Save className="w-5 h-5 mr-2" />
            {isSaving
              ? 'Đang lưu...'
              : mode === ContestFormMode.CREATE
                ? 'Tạo cuộc thi'
                : 'Cập nhật cuộc thi'}
          </Button>
        </div>
      )}

      {showNewProblemModal && !isReadOnly && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Tạo bài tập mới
              </h2>
              <Button
                onClick={() => setShowNewProblemModal(false)}
                variant="ghost"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <ProblemForm
                mode={ProblemFormMode.CREATE}
                onSave={handleCreateProblem}
                isSaving={isCreatingProblem}
                title="Tạo bài tập mới"
                subtitle="Nhập thông tin chi tiết về bài tập mới"
              />
            </div>
          </div>
        </div>
      )}

      {/* Problems Selection Modal */}
      {showProblemModal && !isReadOnly && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-8xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-2 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
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
            </div>
            <div className="px-2 overflow-y-auto no-top-offset ">
              <ProblemList
                mode="select"
                endpointType={ProblemEndpointType.SELECTABLE_FOR_CONTEST}
                onProblemSelect={handleAddProblem}
                onProblemView={handleViewProblemDetail}
              />
            </div>
          </div>
        </div>
      )}

      {/* Problems Detail Modal */}
      {showProblemDetailModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Chi tiết bài tập
              </h2>
              <div>
                {selectedProblem && (
                  <Button
                    onClick={() => {
                      if (selectedProblem) {
                        handleAddProblem(selectedProblem);
                        setShowProblemDetailModal(false);
                      }
                    }}
                    className="mr-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    Chọn bài tập này
                  </Button>
                )}
                <Button
                  onClick={() => setShowProblemDetailModal(false)}
                  variant="ghost"
                  size="sm"
                  className="rounded-full w-8 h-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {selectedProblem ? (
                <ProblemForm
                  initialData={selectedProblem}
                  mode={ProblemFormMode.VIEW}
                  isSaving={false}
                  title="Chi tiết bài tập"
                  subtitle="Thông tin chi tiết về bài tập này"
                />
              ) : (
                <div className="text-center text-slate-500 py-10">
                  Không thể tải thông tin bài tập. Vui lòng thử lại sau.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <ProblemScoreModal
        isOpen={showScoreModal}
        problem={pendingProblem}
        currentScore={pendingProblem?.score}
        onSave={handleSaveScore}
        title={
          pendingProblem?.score
            ? 'Chỉnh sửa điểm bài tập'
            : 'Thiết lập điểm cho bài tập'
        }
      />
    </form>
  );
}
