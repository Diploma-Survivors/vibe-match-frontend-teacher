'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  type ProblemData,
  getDifficultyColor,
  getDifficultyLabel,
} from '@/types/problems';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProblemScoreModalProps {
  isOpen: boolean;
  problems: ProblemData[];
  currentScores?: Record<number, number>;
  onSave: (scores: Record<number, number>) => void;
  onCancel?: () => void;
  title?: string;
}

export default function ProblemScoreModal({
  isOpen,
  problems,
  currentScores = {},
  onSave,
  onCancel,
  title = 'Thiết lập điểm cho bài tập',
}: ProblemScoreModalProps) {
  const [scores, setScores] = useState<Record<number, number>>(currentScores);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setScores(currentScores);
      setError('');
    }
  }, [isOpen, currentScores]);

  const validateScore = (score: number): boolean => {
    if (!score) {
      setError('Vui lòng nhập điểm cho bài tập');
      return false;
    }

    if (Number.isNaN(score) || score <= 0) {
      setError('Điểm phải lớn hơn 0');
      return false;
    }

    if (score > 100) {
      setError('Điểm không được vượt quá 100');
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (Object.keys(scores).length === 0) {
      setError('Vui lòng nhập điểm cho bài tập');
      return;
    }

    // Loop through all scores and validate each one
    for (const [problemId, score] of Object.entries(scores)) {
      if (!validateScore(score)) {
        return; // Stop on first error since validateScore already sets the error message
      }
    }

    onSave(scores);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleScoreChange = (problemId: number, value: string) => {
    const score = Number.parseFloat(value);
    setScores((prev) => ({
      ...prev,
      [problemId]: score,
    }));
  };

  if (!isOpen || !problems) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {title} ({problems.length} bài tập)
          </h2>
          {onCancel && (
            <Button
              onClick={handleCancel}
              variant="ghost"
              size="sm"
              className="rounded-full w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6"
          >
            Lưu điểm ({problems.length} bài tập)
          </Button>
        </div>

        {/* Error message section */}
        {error && (
          <div className="px-6 pt-1">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                {error}
              </p>
            </div>
          </div>
        )}

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Problems List */}
          {problems.map((problem) => {
            const scoreData = { score: scores[problem.id] };
            return (
              <div
                key={problem.id}
                className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 space-y-3"
              >
                {/* Problem Info */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                      {problem.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <div
                        className={`${getDifficultyColor(
                          problem.difficulty
                        )} font-medium px-2 py-0.5 rounded text-xs inline-block`}
                      >
                        {getDifficultyLabel(problem.difficulty)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score Input */}
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="Nhập điểm (0-100)"
                    value={scoreData?.score || ''}
                    onChange={(e) =>
                      handleScoreChange(problem.id, e.target.value)
                    }
                    className="h-10 rounded-lg border-0 bg-white dark:bg-slate-600/50 focus:ring-2 focus:ring-green-500"
                    min="0"
                    max="100"
                    step="0.5"
                  />
                  {/* {scoreData?.error && (
                    <p className="text-red-500 text-xs">{scoreData.error}</p>
                  )} */}
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Nhập điểm từ 0 đến 100 cho bài tập này
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
