'use client';

import dynamic from 'next/dynamic';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const SyntaxHighlighter = dynamic(
  () => import('react-syntax-highlighter/dist/esm/default-highlight'),
  { ssr: false, loading: () => <div className="p-4">Loading...</div> }
) as any;

type CodeViewerProps = {
  sourceCode: string;
  languageName: string;
};

function getSyntaxLanguage(languageName: string) {
  const name = languageName.toLowerCase();
  if (name.includes('python')) return 'python';
  if (name.includes('java ')) return 'java';
  if (name.includes('java')) return 'java';
  if (name.includes('c++') || name.includes('cpp')) return 'cpp';
  if (name === 'c') return 'c';
  if (name.includes('pypy')) return 'python';
  return 'plaintext';
}

function getCodeHeight(sourceCode: string) {
  const lines = sourceCode.split('\n').length;
  const lineHeight = 22;
  const padding = 40;
  const total = Math.max(lines * lineHeight + padding, 200);
  return { height: `${total}px` };
}

export function CodeViewer({ sourceCode, languageName }: CodeViewerProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(sourceCode);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="font-semibold text-slate-700">Source Code</div>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="text-xs px-2 py-1 border border-slate-200 bg-white hover:bg-slate-50"
          >
            Copy
          </button>
        </div>
      </div>
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-gray-50">
        <div className="relative" style={getCodeHeight(sourceCode)}>
          <SyntaxHighlighter
            language={getSyntaxLanguage(languageName)}
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
            {sourceCode}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}
