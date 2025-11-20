import { useEffect, useRef, useState } from 'react';
import { CodeViewer } from './code-viewer';
import { ProblemTabs } from './problem-tabs';
import { StatsGrid } from './stats-grid';
import { StatusBadge } from './status-badge';

type Problem = {
  id: string;
  title: string;
};

type SubmissionStatus = 'AC' | 'WA' | 'TLE' | 'CE' | 'RE' | 'Pending';

type SubmissionDetailProps = {
  studentName: string;
  problems: Problem[];
  activeProblemId: string;
  onSelectProblem: (id: string) => void;
  submission: {
    id: string;
    status: SubmissionStatus;
    score: number;
    runtimeSec: number;
    memoryBytes: number;
    languageName: string;
    sourceCode: string;
    passedTests: number;
    totalTests: number;
    submittedAt: string;
  };
};

export function SubmissionDetail({
  studentName,
  problems,
  activeProblemId,
  onSelectProblem,
  submission,
}: SubmissionDetailProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let t: any;
    const onScroll = () => {
      setIsScrolling(true);
      clearTimeout(t);
      t = setTimeout(() => setIsScrolling(false), 700);
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const runtimeMs = Math.max(0, Math.round(submission.runtimeSec * 1000));

  return (
    <div className="h-full pr-3">
      <div
        className="rounded-xl border border-slate-200 bg-white h-full overflow-y-auto"
        ref={scrollRef}
      >
        <ProblemTabs
          problems={problems}
          activeProblemId={activeProblemId}
          onSelectProblem={onSelectProblem}
        />

        <div className={`p-8 space-y-8 ${isScrolling ? 'scrolling' : ''}`}>
          <StatusBadge
            status={submission.status}
            passedTests={submission.passedTests}
            totalTests={submission.totalTests}
          />

          <StatsGrid
            score={submission.score}
            runtimeMs={runtimeMs}
            memoryBytes={submission.memoryBytes}
          />

          <CodeViewer
            sourceCode={submission.sourceCode}
            languageName={submission.languageName}
          />
        </div>
      </div>
    </div>
  );
}
