type SubmissionStatus = 'AC' | 'WA' | 'TLE' | 'CE' | 'RE' | 'Pending';

type StatusBadgeProps = {
  status: SubmissionStatus;
  passedTests: number;
  totalTests: number;
};

function getStatusMeta(status: SubmissionStatus) {
  switch (status) {
    case 'AC':
      return {
        label: 'Accepted',
        border: 'border-green-200',
        bg: 'bg-green-50',
        text: 'text-green-700',
        icon: '✅',
        iconColor: 'text-green-700',
      };
    case 'WA':
      return {
        label: 'Wrong Answer',
        border: 'border-red-200',
        bg: 'bg-red-50',
        text: 'text-red-700',
        icon: '❌',
        iconColor: 'text-red-700',
      };
    case 'TLE':
      return {
        label: 'Time Limit Exceeded',
        border: 'border-orange-200',
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        icon: '⏱️',
        iconColor: 'text-orange-700',
      };
    case 'CE':
      return {
        label: 'Compile Error',
        border: 'border-slate-300',
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        icon: '🧱',
        iconColor: 'text-slate-700',
      };
    case 'RE':
      return {
        label: 'Runtime Error',
        border: 'border-amber-200',
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        icon: '⚠️',
        iconColor: 'text-amber-700',
      };
    default:
      return {
        label: 'Pending',
        border: 'border-slate-200',
        bg: 'bg-slate-50',
        text: 'text-slate-600',
        icon: '⏳',
        iconColor: 'text-slate-600',
      };
  }
}

export function StatusBadge({
  status,
  passedTests,
  totalTests,
}: StatusBadgeProps) {
  const statusMeta = getStatusMeta(status);

  return (
    <div
      className={`p-5 rounded-lg border ${statusMeta.border} ${statusMeta.bg}`}
    >
      <div className="flex items-center gap-3 text-lg font-semibold">
        <span className={statusMeta.iconColor}>{statusMeta.icon}</span>
        <span className={statusMeta.text}>{statusMeta.label}</span>
      </div>
      <div className="text-slate-600 mt-2">
        {passedTests}/{totalTests} test cases passed
      </div>
    </div>
  );
}
