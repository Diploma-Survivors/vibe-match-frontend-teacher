import { useState } from 'react';

interface CheckBoxListProps {
  readonly availableItems: any[];
  readonly selectedItemIds: number[];
  readonly isReadOnly?: boolean;
  readonly onChange: (newItems: any[]) => void;
  readonly isLoading: boolean;
  readonly displayLimit?: number;
}

export default function CheckBoxList({
  availableItems,
  selectedItemIds,
  isReadOnly = false,
  onChange,
  isLoading,
  displayLimit = 4,
}: CheckBoxListProps) {
  const [showAll, setShowAll] = useState(false);
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

  const displayedItems = !showAll
    ? availableItems.slice(0, displayLimit)
    : availableItems;

  return (
    <div>
      {!isLoading ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {displayedItems.map((item) => {
              // Check if the current topic is selected
              const isSelected = selectedItemIds.some((t) => t === item.id);
              return (
                <div
                  key={item.id}
                  className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 dark:bg-slate-700/30 dark:border-slate-600 dark:hover:bg-slate-700/50'
                  }`}
                  onClick={() =>
                    handleToggleSelection(
                      selectedItemIds,
                      item.id,
                      (newIds) => {
                        const newTopics = availableItems.filter((t) =>
                          newIds.includes(t.id)
                        );
                        onChange(newTopics);
                      }
                    )
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ')
                      handleToggleSelection(
                        selectedItemIds,
                        item.id,
                        (newIds) => {
                          const newTopics = availableItems.filter((t) =>
                            newIds.includes(t.id)
                          );
                          onChange(newTopics);
                        }
                      );
                  }}
                  aria-label={`Toggle ${item.name} topic`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected || false}
                    readOnly
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                    disabled={isReadOnly}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              );
            })}
          </div>
          {availableItems.length > displayLimit && (
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
      ) : (
        <div className="text-center py-4 text-slate-500">Đang tải...</div>
      )}
    </div>
  );
}
