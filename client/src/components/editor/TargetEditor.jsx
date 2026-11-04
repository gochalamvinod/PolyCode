import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { getLanguageById } from '../../config/languages';
import { LanguageIcon } from '../common/LanguageIcon';
import { useToast } from '../../context/ToastContext';
import { Copy, Download, BookmarkPlus, Maximize2, Minimize2, Check } from 'lucide-react';

export const TargetEditor = ({
  code,
  language,
  isConverting = false,
  confidence = null,
  onSaveProject
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { success, error } = useToast();
  const currentLang = getLanguageById(language);

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      success('Copied to clipboard');
    } catch (err) {
      error('Failed to copy.');
    }
  };

  const handleDownload = () => {
    if (!code) return;
    try {
      const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `PolyCode_Transpiled_${currentLang.name.toLowerCase()}${currentLang.extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      success(`Downloaded ${link.download}`);
    } catch (err) {
      error('Failed to download.');
    }
  };

  const lineCount = code ? code.split('\n').length : 0;
  const charCount = code ? code.length : 0;

  return (
    <div
      className={`flex flex-col bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs transition-all ${
        isFullscreen ? 'fixed inset-3 z-50 bg-white dark:bg-slate-950' : 'h-[520px]'
      }`}
    >
      {/* Target Tab Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs select-none">
        <div className="flex items-center gap-2">
          {/* Active File Tab */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[11px] shadow-xs">
            <LanguageIcon language={language} className="w-3.5 h-3.5" />
            <span className="font-semibold">output{currentLang.extension}</span>
          </div>

          {confidence && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 font-medium">
              {confidence} confidence
            </span>
          )}
        </div>

        {/* Right Actions & Metrics */}
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mr-2 hidden lg:inline">
            {lineCount}L • {charCount}C
          </span>

          {onSaveProject && code && (
            <button
              onClick={onSaveProject}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800/60 transition-colors"
              title="Save to projects"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            disabled={!code}
            className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 transition-colors"
            title="Copy converted code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleDownload}
            disabled={!code}
            className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 transition-colors"
            title="Download target code"
          >
            <Download className="w-3.5 h-3.5" />
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
      <div className="flex-1 min-h-0 relative bg-white dark:bg-[#1e1e1e]">
        <CodeEditor
          value={code}
          language={currentLang.monacoId}
          readOnly={true}
          placeholder="// Translated target code will render here..."
        />
        {isConverting && (
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center gap-3 z-10">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 tracking-wide">
              Translating to {currentLang.name}...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
