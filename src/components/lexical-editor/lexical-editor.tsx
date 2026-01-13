import React, { useEffect, useRef, useState } from 'react';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import ToolbarPlugin from './plugins/toolbar-plugin';
// Keep your existing imports
import ExampleTheme from './theme';
// import TreeViewPlugin from './plugins/TreeViewPlugin';

// --- REUSABLE EDITOR COMPONENT ---
interface DescriptionEditorProps {
  value: string; // The JSON string from backend
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

function UpdateStatePlugin({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();
  const isMounting = useRef(true);

  useEffect(() => {
    // Skip the very first render to avoid double-setting state
    // (initialConfig handles the first load)
    if (isMounting.current) {
      isMounting.current = false;
      return;
    }

    // If value is empty, do nothing (or clear editor if you prefer)
    if (!value) return;

    // Check if the current editor state is different from the new value.
    // This prevents the "Typing Loop" where:
    // Type 'A' -> Update State -> Prop Change -> Update Editor -> Cursor Jumps
    editor.getEditorState().read(() => {
      const currentJson = JSON.stringify(editor.getEditorState());

      // Only update if the content is actually different
      if (currentJson !== value) {
        try {
          const newState = editor.parseEditorState(value);
          editor.setEditorState(newState);
        } catch (e) {
          console.error('Error parsing lexical state', e);
        }
      }
    });
  }, [value, editor]);

  return null;
}

export default function DescriptionEditor({
  value,
  onChange,
  readOnly = false,
}: DescriptionEditorProps) {
  const editorConfig = {
    namespace: 'ContestDescription',
    nodes: [], // Add your nodes here (HeadingNode, ListNode, etc.) if your Toolbar uses them
    // Handling of errors during update
    onError(error: Error) {
      throw error;
    },
    // The editor theme
    theme: ExampleTheme,
    // 1. DYNAMIC CONFIGURATION
    editable: !readOnly, // key for read-only mode
    editorState: value ? value : undefined, // key for loading data
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      {/* Container styling - adapts to ReadOnly state */}
      <div
        className={`editor-container bg-slate-50 relative rounded-xl border ${readOnly ? 'border-transparent' : 'border-slate-300 dark:bg-slate-800'}`}
      >
        {/* Only show Toolbar if editable */}
        {!readOnly && <ToolbarPlugin />}

        <div className="editor-inner relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={`editor-input outline-none resize-none ${readOnly ? '' : 'min-h-[150px]'}`}
              />
            }
            // placeholder={
            //   !readOnly ? (
            //     <div className="editor-placeholder absolute top-4 left-4 text-slate-400 pointer-events-none">
            //       Enter some rich text...
            //     </div>
            //   ) : null
            // }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          {/* {!readOnly && <AutoFocusPlugin />} */}

          {value && <UpdateStatePlugin value={value} />}

          {/* 2. EXPORT LOGIC: Update state when editor changes */}
          {!readOnly && onChange && (
            <OnChangePlugin
              onChange={(editorState) => {
                editorState.read(() => {
                  const jsonString = JSON.stringify(editorState);
                  onChange(jsonString);
                });
              }}
            />
          )}
        </div>
      </div>
    </LexicalComposer>
  );
}
