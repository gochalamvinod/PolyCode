import React from 'react';
import { ArrowLeftRight, Settings, RotateCcw, Play, Sparkles } from 'lucide-react';
import { SUPPORTED_LANGUAGES, getLanguageById } from '../../config/languages';
import { LanguageIcon } from '../common/LanguageIcon';

export const ConversionControls = ({
  sourceLanguage,
  targetLanguage,
  onSourceLanguageChange,
  onTargetLanguageChange,
  onSwapLanguages,
  onOpenSettings,
  onClearAll,
  onLoadSample,
  onConvert,
  isConverting = false,
  hasSourceCode = false
}) => {
  const sourceObj = getLanguageById(sourceLanguage);
  const targetObj = getLanguageById(targetLanguage);

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs backdrop-blur-sm transition-colors">
      {/* Left: Interactive Language Flow Bridge */}
      <div className="flex items-center gap-2">
        {/* Source Language Picker */}
        <div className="relative inline-flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-lg p-1 transition-all shadow-xs">
          <div className="px-1.5 py-0.5">
            <LanguageIcon language={sourceLanguage} />
          </div>
          <select
            value={sourceLanguage}
            onChange={(e) => onSourceLanguageChange(e.target.value)}
            disabled={isConverting}
            className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-100 py-1 pl-1 pr-6 appearance-none cursor-pointer focus:outline-none"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-1">
                {lang.name}
              </option>
            ))}
          </select>
          <span className="absolute right-2 text-slate-400 text-[9px] pointer-events-none">▼</span>
        </div>

        {/* Swap Languages Bridge Button */}
        <button
          onClick={onSwapLanguages}
          disabled={isConverting}
          title="Swap source and target languages"
          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
          aria-label="Swap programming languages"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
        </button>

        {/* Target Language Picker */}
        <div className="relative inline-flex items-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-lg p-1 transition-all shadow-xs">
          <div className="px-1.5 py-0.5">
            <LanguageIcon language={targetLanguage} />
          </div>
          <select
            value={targetLanguage}
            onChange={(e) => onTargetLanguageChange(e.target.value)}
            disabled={isConverting}
            className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-100 py-1 pl-1 pr-6 appearance-none cursor-pointer focus:outline-none"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-1">
                {lang.name}
              </option>
            ))}
          </select>
          <span className="absolute right-2 text-slate-400 text-[9px] pointer-events-none">▼</span>
        </div>

        {/* Quick Sample Loader */}
        {onLoadSample && (
          <button
            onClick={onLoadSample}
            disabled={isConverting}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={`Load ${sourceObj?.name || ''} example code`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Load Sample</span>
          </button>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSettings}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 transition-all shadow-xs"
          title="Conversion preferences"
        >
          <Settings className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span className="hidden md:inline">Settings</span>
        </button>

        {hasSourceCode && (
          <button
            onClick={onClearAll}
            disabled={isConverting}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900/60 transition-all disabled:opacity-40"
            title="Clear code from workspace"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Clear</span>
          </button>
        )}

        {/* Primary Convert Code Action */}
        <button
          onClick={onConvert}
          disabled={!hasSourceCode || isConverting}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] shadow-sm shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none transition-all"
        >
          {isConverting ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Transpiling...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Convert Code</span>
              <kbd className="hidden md:inline text-[10px] bg-white/20 dark:bg-black/25 px-1.5 py-0.5 rounded font-mono text-white/90">
                Ctrl+↵
              </kbd>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
