import React from 'react';
import { SUPPORTED_LANGUAGES } from '../../config/languages';
import { ChevronDown } from 'lucide-react';

export const LanguageSelector = ({ selectedLanguage, onSelectLanguage, disabled = false, label = 'Language' }) => {
  return (
    <div className="relative inline-flex items-center">
      <label htmlFor={`lang-select-${label}`} className="sr-only">
        {label}
      </label>
      <select
        id={`lang-select-${label}`}
        disabled={disabled}
        value={selectedLanguage}
        onChange={(e) => onSelectLanguage(e.target.value)}
        className="appearance-none bg-zinc-900 hover:bg-zinc-850 text-zinc-200 text-xs font-mono py-1 pl-2.5 pr-7 rounded border border-zinc-800 hover:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-500 cursor-pointer disabled:opacity-40 transition-colors"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.id} value={lang.id} className="bg-zinc-900 text-zinc-200 py-1 font-mono">
            {lang.name} ({lang.extension})
          </option>
        ))}
      </select>
      <ChevronDown className="w-3 h-3 text-zinc-500 absolute right-2 pointer-events-none" />
    </div>
  );
};
