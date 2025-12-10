import { Button } from '@/components/ui/button';
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
      <div className="overflow-x-auto h-12 flex items-center">
        <div className="flex items-center gap-2 min-w-max">
          {problems.map((p) => (
            <Button
              type="button"
              key={p.id}
              onClick={() => onSelectProblem(p.id)}
              className={`text-sm bg-green-600 text-white ${
                activeProblemId === p.id
                  ? 'hover:bg-green-700 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              {p.title}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
