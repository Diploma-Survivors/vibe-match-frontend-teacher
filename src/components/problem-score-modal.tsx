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
  problem: ProblemData | null;
  currentScore?: number;
  onSave: (score: number) => void;
  onCancel?: () => void;
  title?: string;
}

export default function ProblemScoreModal({
  isOpen,
  problem,
  currentScore,
  onSave,
  onCancel,
  title = 'Thiết lập điểm cho bài tập',
}: ProblemScoreModalProps) {
  const [score, setScore] = useState<string>(currentScore?.toString() || '');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setScore(currentScore?.toString() || '');
      setError('');
    }
  }, [isOpen, currentScore]);

  const handleSave = () => {
    const numScore = Number.parseFloat(score);

    if (!score.trim()) {
      setError('Vui lòng nhập điểm cho bài tập');
      return;
    }

    if (Number.isNaN(numScore) || numScore < 0) {
      setError('Điểm phải là số không âm');
      return;
    }

    if (numScore > 100) {
      setError('Điểm không được vượt quá 100');
      return;
    }

    onSave(numScore);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  if (!isOpen || !problem) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {title}
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
        </div>

        <div className="p-6 space-y-4">
          {/* Problem Info */}
          <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
              {problem.title}
            </h3>
            <div className="flex items-center gap-2">
              <div
                className={`${getDifficultyColor(problem.difficulty)} font-medium px-3 py-1 rounded-lg border text-xs inline-block`}
              >
                {getDifficultyLabel(problem.difficulty)}
              </div>
            </div>
          </div>

          {/* Score Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Điểm tối đa <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              placeholder="Nhập điểm (0-100)"
              value={score}
              onChange={(e) => {
                setScore(e.target.value);
                setError('');
              }}
              className="h-12 rounded-xl border-0 bg-slate-50 dark:bg-slate-700/50 focus:ring-2 focus:ring-blue-500"
              min="0"
              max="100"
              step="0.5"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Nhập điểm từ 0 đến 100 cho bài tập này
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            {onCancel && (
              <Button onClick={handleCancel} variant="outline" className="px-6">
                Hủy
              </Button>
            )}
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6"
            >
              Lưu điểm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
