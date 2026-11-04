import React from 'react';
import { SUPPORTED_LANGUAGES } from '../../config/languages';
import { Cpu, Database } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-800 dark:text-slate-200">PolyCode</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span>Multi-Language Code Converter</span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-slate-400">
            <Cpu className="w-3 h-3 text-blue-500" />
            Gemini Flash Lite
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <span
              key={lang.id}
              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]"
            >
              {lang.name}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};
