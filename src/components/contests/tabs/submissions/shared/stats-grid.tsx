type StatsGridProps = {
  score: number;
  runtimeMs: number;
  memoryBytes: number;
};

function formatRuntime(ms: number) {
  return `${Math.max(0, ms).toFixed(0)}ms`;
}

function formatMemory(bytes: number) {
  return `${Math.max(0, bytes / 1024).toFixed(0)} KB`;
}

export function StatsGrid({ score, runtimeMs, memoryBytes }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="rounded-lg border border-slate-200 p-5 bg-slate-50">
        <div className="text-xs text-slate-500">SCORE</div>
        <div className="mt-1 text-2xl font-semibold text-slate-800">
          {score} / 100
        </div>
      </div>
      <div className="rounded-lg border border-slate-200 p-5 bg-slate-50">
        <div className="text-xs text-slate-500">RUNTIME</div>
        <div className="mt-1 text-2xl font-semibold text-slate-800">
          {formatRuntime(runtimeMs)}
        </div>
      </div>
      <div className="rounded-lg border border-slate-200 p-5 bg-slate-50">
        <div className="text-xs text-slate-500">MEMORY</div>
        <div className="mt-1 text-2xl font-semibold text-slate-800">
          {formatMemory(memoryBytes)}
        </div>
      </div>
    </div>
  );
}
