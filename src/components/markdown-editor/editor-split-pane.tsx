import MarkdownRenderer from '@/components/markdown-editor/markdown-renderer';
import Editor, { type OnMount } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { forwardRef, useImperativeHandle, useRef } from 'react';

export interface EditorRef {
  executeAction: (action: string) => void;
}

interface EditorSplitPaneProps {
  content: string;
  onChange: (content: string) => void;
}

const EditorSplitPane = forwardRef<EditorRef, EditorSplitPaneProps>(
  ({ content, onChange }, ref) => {
    const { theme } = useTheme();
    const editorRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
      editorRef.current = editor;
      editor.updateOptions({
        scrollbar: {
          alwaysConsumeMouseWheel: false,
        },
      });
    };

    useImperativeHandle(ref, () => ({
      executeAction: (action: string) => {
        const editor = editorRef.current;
        if (!editor) return;

        const selection = editor.getSelection();
        const model = editor.getModel();
        if (!selection || !model) return;

        const text = model.getValueInRange(selection);
        let newText = text;
        let cursorOffset = 0;

        switch (action) {
          case 'bold':
            newText = `**${text || 'bold text'}**`;
            cursorOffset = 2;
            break;
          case 'italic':
            newText = `*${text || 'italic text'}*`;
            cursorOffset = 1;
            break;
          case 'heading':
            newText = `# ${text || 'Heading'}`;
            cursorOffset = 2;
            break;
          case 'list':
            newText = `- ${text || 'List item'}`;
            cursorOffset = 2;
            break;
          case 'ordered-list':
            newText = `1. ${text || 'List item'}`;
            cursorOffset = 3;
            break;
          case 'code':
            newText = `\`\`\`\n${text || 'code'}\n\`\`\``;
            cursorOffset = 4;
            break;
          case 'quote':
            newText = `> ${text || 'Quote'}`;
            cursorOffset = 2;
            break;
          case 'link':
            newText = `[${text || 'Link text'}](url)`;
            cursorOffset = 1;
            break;
          case 'image':
            newText = `![${text || 'Image alt'}](url)`;
            cursorOffset = 2;
            break;
        }

        editor.executeEdits('toolbar', [
          {
            range: selection,
            text: newText,
            forceMoveMarkers: true,
          },
        ]);

        // Focus editor
        editor.focus();
      },
    }));

    return (
      <div ref={containerRef} className="flex-1 flex relative overflow-hidden">
        {/* Editor */}
        <div className="h-full flex flex-col w-1/2 border-r border-slate-200 dark:border-slate-800">
          <Editor
            height="100%"
            defaultLanguage="markdown"
            value={content}
            onChange={(value) => onChange(value || '')}
            onMount={handleEditorDidMount}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'off',
              wordWrap: 'on',
              scrollBeyondLastLine: false,
              padding: { top: 16, bottom: 16 },
              scrollbar: {
                alwaysConsumeMouseWheel: false,
              },
            }}
          />
        </div>

        {/* Preview */}
        <div className="h-full w-1/2 overflow-y-auto p-8 pt-0 bg-white dark:bg-slate-950 prose dark:prose-invert max-w-none">
          <MarkdownRenderer content={content} />
        </div>
      </div>
    );
  }
);

EditorSplitPane.displayName = 'EditorSplitPane';

export default EditorSplitPane;
