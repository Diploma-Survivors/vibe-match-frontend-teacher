'use client';
import { useRef } from 'react';
import EditorSplitPane, { type EditorRef } from './editor-split-pane';
import MarkdownToolbar from './markdown-toolbar';

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

export default function MarkdownEditor({
  content,
  onChange,
  className,
}: MarkdownEditorProps) {
  const editorRef = useRef<EditorRef>(null);

  const handleAction = (action: string) => {
    editorRef.current?.executeAction(action);
  };

  return (
    <div
      className={`flex flex-col border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden ${className}`}
    >
      <MarkdownToolbar onAction={handleAction} />
      <EditorSplitPane ref={editorRef} content={content} onChange={onChange} />
    </div>
  );
}
