import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from '../../context/ThemeContext';
import { Loader } from '../common/Loader';

export const CodeEditor = ({
  value = '',
  onChange,
  language = 'javascript',
  readOnly = false,
  placeholder = '',
  onMount
}) => {
  const { isDark } = useTheme();
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    if (onMount) onMount(editor, monaco);
  };

  return (
    <div className="relative w-full h-full min-h-[420px] bg-slate-950/60">
      <Editor
        height="100%"
        width="100%"
        language={language}
        value={value}
        theme={isDark ? 'vs-dark' : 'light'}
        onChange={onChange}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full">
            <Loader size="md" text="Initializing Monaco Code Engine..." />
          </div>
        }
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 13.5,
          fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, Courier New, monospace",
          fontLigatures: true,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          renderLineHighlight: 'all',
          padding: { top: 12, bottom: 12 },
          lineDecorationsWidth: 10,
          overviewRulerBorder: false,
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8
          }
        }}
      />
      {!value && !readOnly && placeholder && (
        <div className="absolute top-4 left-14 pointer-events-none text-slate-500 text-xs italic font-mono select-none">
          {placeholder}
        </div>
      )}
    </div>
  );
};
