'use client';

import type { Topic } from '@/types/topics';
import { useState } from 'react';

interface TopicFilterProps {
  topics: Topic[];
  selectedTopicIds: number[];
  isLoading: boolean;
  onTopicToggle: (topicId: number, isSelected: boolean) => void;
  onClearAll: () => void;
  displayLimit?: number;
}

export default function TopicFilter({
  topics,
  selectedTopicIds,
  isLoading,
  onTopicToggle,
  onClearAll,
  displayLimit = 3,
}: TopicFilterProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedTopics = showAll ? topics : topics.slice(0, displayLimit);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Topic:
        </label>
        {selectedTopicIds.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
          >
            Xóa tất cả ({selectedTopicIds.length})
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="p-4 text-center text-sm text-slate-500">
          Đang tải...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-2">
            {displayedTopics.map((topic) => {
              const isSelected = selectedTopicIds.includes(topic.id);

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => onTopicToggle(topic.id, isSelected)}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm
                    transition-all duration-200 hover:scale-[1.02]
                    bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 
                    dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-600 dark:hover:border-slate-500
                  `}
                >
                  <div
                    className={`
                      w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                      ${
                        isSelected
                          ? 'bg-green-500 border-green-500'
                          : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-500'
                      }
                    `}
                  >
                    {isSelected && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        role="img"
                        aria-label="Đã chọn"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="font-medium">{topic.name}</span>
                </button>
              );
            })}
          </div>
          {topics.length > displayLimit && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setShowAll(!showAll)}
                className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200"
              >
                {showAll ? 'Thu gọn' : 'Xem thêm'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
