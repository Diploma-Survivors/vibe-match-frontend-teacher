'use client';

import { Button } from '@/components/ui/button';
import { getStatusMeta } from '@/lib/utils/testcase-status';
import { Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface SubmissionDetailForStudentProps {
  submission: {
    id: number;
    status: string;
    score: number;
    runtime: number;
    memory: number;
    language: {
      id: number;
      name: string;
    };
    sourceCode: string;
    passedTests?: number;
    totalTests?: number;
  };
}

const formatRuntime = (runtime: number) => {
  if (runtime === 0) return '0ms';
  return `${(runtime * 1000).toFixed(0)}ms`;
};

const formatMemory = (memory: number) => {
  if (memory === 0) return '0 KB';
  return `${(memory / 1024).toFixed(0)} KB`;
};

const languageMap: Record<string, string> = {
  'C++': 'cpp',
  C: 'c',
  Java: 'java',
  Python: 'python',
  JavaScript: 'javascript',
  TypeScript: 'typescript',
  Go: 'go',
  Rust: 'rust',
  Ruby: 'ruby',
  PHP: 'php',
  Swift: 'swift',
  Kotlin: 'kotlin',
};

export function SubmissionDetailForStudent({
  submission,
}: SubmissionDetailForStudentProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let timeoutId: any;
    const onScroll = () => {
      setIsScrolling(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsScrolling(false), 700);
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const getCodeHeight = () => {
    if (!submission) return { height: '192px' };

    const lines = submission.sourceCode.split('\n').length;
    const lineHeight = 22;
    const padding = 40;

    const totalHeight = Math.max(lines * lineHeight + padding, 200);
    return { height: `${totalHeight}px` };
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(submission.sourceCode);
  };

  const getSyntaxLanguage = (languageName: string) => {
    for (const [key, value] of Object.entries(languageMap)) {
      if (languageName.includes(key)) {
        return value;
      }
    }
    return 'plaintext';
  };

  if (!submission) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-slate-500 space-y-2">
          <div className="text-lg font-semibold">Chưa có submission nào</div>
          <div>Vui lòng chọn một submission từ danh sách.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="pr-3 h-full">
        <div
          ref={scrollRef}
          className={`rounded-xl bg-white h-full overflow-y-auto scrollbar-on-scroll ${isScrolling ? 'scrolling' : ''}`}
        >
          <div className="p-8 space-y-7">
            {/* Status */}
            {(() => {
              const statusInfo = getStatusMeta(submission.status);
              const passedTests = submission.passedTests || 0;
              const totalTests = submission.totalTests || 0;

              return (
                <div className={`p-5 rounded-lg border ${statusInfo.color}`}>
                  <div className="flex items-center gap-3 text-lg font-semibold">
                    <span className={statusInfo.iconColor}>
                      {statusInfo.icon}
                    </span>
                    <span>{statusInfo.label}</span>
                  </div>
                  <div className="text-slate-600 mt-2">
                    {passedTests}/{totalTests} test cases passed
                  </div>
                </div>
              );
            })()}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-lg border border-slate-200 p-5">
                <div className="text-xs text-slate-500">SCORE</div>
                <div className="text-xl font-semibold">
                  {submission.score} / 100
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 p-5">
                <div className="text-xs text-slate-500">RUNTIME</div>
                <div className="text-xl font-semibold">
                  {formatRuntime(submission.runtime)}
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 p-5">
                <div className="text-xs text-slate-500">MEMORY</div>
                <div className="text-xl font-semibold">
                  {formatMemory(submission.memory)}
                </div>
              </div>
            </div>

            {/* Source Code */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-slate-700">
                <span>Source Code</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyCode}
                  className="h-8"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden bg-gray-50">
                <div className="relative">
                  <div
                    className="transition-all duration-300 ease-in-out relative overflow-hidden"
                    style={getCodeHeight()}
                  >
                    <SyntaxHighlighter
                      language={getSyntaxLanguage(submission.language.name)}
                      style={tomorrow}
                      customStyle={{
                        margin: 0,
                        borderRadius: '0',
                        fontSize: '14px',
                        lineHeight: '22px',
                        fontFamily:
                          "'JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', 'Monaco', 'Courier New', monospace",
                        letterSpacing: '0.3px',
                        background: '#f5f5f5',
                        color: '#24292e',
                        padding: '20px',
                        overflow: 'auto',
                      }}
                      showLineNumbers={true}
                      lineNumberStyle={{
                        color: '#6a737d',
                        marginRight: '16px',
                        userSelect: 'none',
                        fontSize: '12px',
                      }}
                      wrapLines={true}
                      wrapLongLines={true}
                    >
                      {submission.sourceCode}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
