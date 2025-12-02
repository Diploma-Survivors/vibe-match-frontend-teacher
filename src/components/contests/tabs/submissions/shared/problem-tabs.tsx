import type { Problem } from '@/types/submissions';

type ProblemTabsProps = {
  problems: Problem[];
  activeProblemId: string;
  onSelectProblem: (id: string) => void;
};

export function ProblemTabs({
  problems,
  activeProblemId,
  onSelectProblem,
}: ProblemTabsProps) {
  return (
    <div className="bg-white sticky top-0 z-10">
      <div className="overflow-x-auto px-4 h-12 flex items-center">
        <div className="flex items-center gap-2 min-w-max">
          {problems.map((p) => (
            <button
              type="button"
              key={p.id}
              onClick={() => onSelectProblem(p.id)}
              className={`px-4 py-2 rounded-none text-sm font-medium whitespace-nowrap transition border ${
                activeProblemId === p.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
