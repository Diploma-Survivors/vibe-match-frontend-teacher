import { getStatusMeta } from '@/lib/utils/testcase-status';

type StatusBadgeProps = {
  status: string;
  passedTests: number;
  totalTests: number;
};

// Local helper for badge-specific styling (border, background)
function getBadgeStyles(status: string) {
  const statusMeta = getStatusMeta(status);

  // Map the color from statusMeta to badge-specific styles
  if (statusMeta.color.includes('green')) {
    return {
      border: 'border-green-200',
      bg: 'bg-green-50',
      text: 'text-green-700',
    };
  }

  if (statusMeta.color.includes('red')) {
    return {
      border: 'border-red-200',
      bg: 'bg-red-50',
      text: 'text-red-700',
    };
  }

  if (statusMeta.color.includes('orange')) {
    return {
      border: 'border-orange-200',
      bg: 'bg-orange-50',
      text: 'text-orange-700',
    };
  }

  return {
    border: 'border-slate-200',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
  };
}

export function StatusBadge({
  status,
  passedTests,
  totalTests,
}: StatusBadgeProps) {
  const statusMeta = getStatusMeta(status);
  const badgeStyles = getBadgeStyles(status);

  return (
    <div
      className={`p-5 rounded-lg border ${badgeStyles.border} ${badgeStyles.bg}`}
    >
      <div className="flex items-center gap-3 text-lg font-semibold">
        <span className={statusMeta.iconColor}>{statusMeta.icon}</span>
        <span className={badgeStyles.text}>{statusMeta.label}</span>
      </div>
      <div className="text-slate-600 mt-2">
        {passedTests}/{totalTests} test cases passed
      </div>
    </div>
  );
}
