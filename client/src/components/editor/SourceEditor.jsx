import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { getLanguageById } from '../../config/languages';
import { LanguageIcon } from '../common/LanguageIcon';
import { useToast } from '../../context/ToastContext';
import { ClipboardPaste, Upload, Trash2, Maximize2, Minimize2 } from 'lucide-react';

export const SourceEditor = ({
  code,
  onChange,
  language
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { success, error } = useToast();
  const currentLang = getLanguageById(language);

  const handleClear = () => {
    onChange('');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text);
        success('Pasted code');
      }
    } catch (err) {
      error('Could not access clipboard.');
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      error('File exceeds 2MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        onChange(content);
        success(`Loaded ${file.name}`);
      }
    };
    reader.onerror = () => {
      error('Failed to read file.');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const lineCount = code ? code.split('\n').length : 0;
  const charCount = code ? code.length : 0;

  return (
    <div
      className={`flex flex-col bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs transition-all ${
        isFullscreen ? 'fixed inset-3 z-50 bg-white dark:bg-slate-950' : 'h-[520px]'
      }`}
    >
      {/* Tab Strip */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs select-none">
        <div className="flex items-center gap-2">
          {/* Active File Tab */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[11px] shadow-xs">
            <LanguageIcon language={language} className="w-3.5 h-3.5" />
            <span className="font-semibold">input{currentLang.extension}</span>
          </div>

          <span className="text-slate-400 dark:text-slate-500 text-[11px] font-mono hidden sm:inline">
            Source Code
          </span>
        </div>

        {/* Right Actions & Metrics */}
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mr-2 hidden lg:inline">
            {lineCount}L • {charCount}C
          </span>

          <button
            onClick={handlePaste}
            className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            title="Paste from clipboard"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
          </button>

          <label
            className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Upload code file"
          >
            <Upload className="w-3.5 h-3.5" />
            <input
              type="file"
              onChange={handleUpload}
              className="hidden"
              accept=".py,.java,.js,.c,.cpp,.h,.hpp,.txt"
            />
          </label>

          <button
            onClick={handleClear}
            disabled={!code}
            className="p-1.5 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-30 transition-colors"
            title="Clear editor"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            title={isFullscreen ? 'Exit full screen' : 'Full screen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 min-h-0 bg-white dark:bg-[#1e1e1e]">
        <CodeEditor
          value={code}
          onChange={onChange}
          language={currentLang.monacoId}
          placeholder={`// Paste or write your ${currentLang.name} code here...`}
        />
      </div>
    </div>
  );
};
