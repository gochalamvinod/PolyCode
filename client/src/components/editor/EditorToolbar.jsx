import React from 'react';
import {
  Copy,
  Download,
  Trash2,
  Upload,
  ClipboardPaste,
  Sparkles,
  Maximize2,
  Minimize2,
  BookmarkPlus,
  FileCode2
} from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { getLanguageById } from '../../config/languages';

export const EditorToolbar = ({
  title,
  language,
  onLanguageChange,
  isSource = true,
  code = '',
  onClear,
  onPaste,
  onUpload,
  onCopy,
  onDownload,
  onLoadSample,
  onSaveProject,
  isFullscreen = false,
  onToggleFullscreen,
  conversionStatus = null
}) => {
  const lineCount = code ? code.split('\n').length : 0;
  const charCount = code ? code.length : 0;
  const langObj = getLanguageById(language);

  return (
    <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-xs select-none">
      {/* Left: Tab Title & Language Picker */}
      <div className="flex items-center gap-2">
        {/* Editor Tab Pill */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-300">
          <FileCode2 className="w-3.5 h-3.5 text-zinc-400" />
          <span>{isSource ? `input${langObj?.extension || ''}` : `output${langObj?.extension || ''}`}</span>
        </div>

        <LanguageSelector
          selectedLanguage={language}
          onSelectLanguage={onLanguageChange}
          label={title}
        />

        {isSource && onLoadSample && (
          <button
            onClick={onLoadSample}
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            title="Load sample code for this language"
          >
            <Sparkles className="w-3 h-3 text-zinc-400" />
            <span className="hidden sm:inline">Sample</span>
          </button>
        )}

        {!isSource && conversionStatus && (
          <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
            {conversionStatus}
          </span>
        )}
      </div>

      {/* Right: Actions and Metrics */}
      <div className="flex items-center gap-1 text-zinc-400">
        <span className="hidden lg:inline text-zinc-500 font-mono text-[11px] mr-2">
          {lineCount}L • {charCount}C
        </span>

        {isSource ? (
          <>
            {onPaste && (
              <button
                onClick={onPaste}
                className="p-1 rounded hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                title="Paste from clipboard"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
              </button>
            )}

            {onUpload && (
              <label
                className="p-1 rounded hover:bg-zinc-800 hover:text-zinc-200 transition-colors cursor-pointer"
                title="Upload code file"
              >
                <Upload className="w-3.5 h-3.5" />
                <input
                  type="file"
                  onChange={onUpload}
                  className="hidden"
                  accept=".py,.java,.js,.c,.cpp,.h,.hpp,.txt"
                />
              </label>
            )}

            {onClear && (
              <button
                onClick={onClear}
                disabled={!code}
                className="p-1 rounded hover:bg-zinc-800 hover:text-rose-400 disabled:opacity-30 transition-colors"
                title="Clear code"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </>
        ) : (
          <>
            {onSaveProject && code && (
              <button
                onClick={onSaveProject}
                className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                title="Save as Project"
              >
                <BookmarkPlus className="w-3 h-3" />
                <span className="hidden sm:inline">Save</span>
              </button>
            )}

            {onCopy && (
              <button
                onClick={onCopy}
                disabled={!code}
                className="p-1 rounded hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 transition-colors"
                title="Copy converted code"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}

            {onDownload && (
              <button
                onClick={onDownload}
                disabled={!code}
                className="p-1 rounded hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 transition-colors"
                title="Download file"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            )}
          </>
        )}

        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            className="p-1 rounded hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            title={isFullscreen ? 'Exit full screen' : 'Full screen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
};
