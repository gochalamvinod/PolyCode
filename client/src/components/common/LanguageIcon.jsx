import React from 'react';

export const LanguageIcon = ({ language = '', className = 'w-4 h-4' }) => {
  const lang = (language || '').toLowerCase();

  switch (lang) {
    case 'python':
      return (
        <span className={`inline-flex items-center justify-center font-mono font-bold text-[10px] text-amber-300 bg-blue-950/80 border border-blue-800/80 rounded px-1 ${className}`}>
          PY
        </span>
      );
    case 'java':
      return (
        <span className={`inline-flex items-center justify-center font-mono font-bold text-[10px] text-orange-300 bg-orange-950/80 border border-orange-800/80 rounded px-1 ${className}`}>
          JV
        </span>
      );
    case 'javascript':
    case 'js':
      return (
        <span className={`inline-flex items-center justify-center font-mono font-bold text-[10px] text-yellow-300 bg-yellow-950/80 border border-yellow-800/80 rounded px-1 ${className}`}>
          JS
        </span>
      );
    case 'c':
      return (
        <span className={`inline-flex items-center justify-center font-mono font-bold text-[10px] text-sky-300 bg-sky-950/80 border border-sky-800/80 rounded px-1 ${className}`}>
          C
        </span>
      );
    case 'cpp':
    case 'c++':
      return (
        <span className={`inline-flex items-center justify-center font-mono font-bold text-[10px] text-indigo-300 bg-indigo-950/80 border border-indigo-800/80 rounded px-1 ${className}`}>
          C++
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center justify-center font-mono font-bold text-[10px] text-zinc-300 bg-zinc-900 border border-zinc-750 rounded px-1 ${className}`}>
          &lt;/&gt;
        </span>
      );
  }
};
