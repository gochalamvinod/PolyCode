import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

export const ExplanationPanel = ({ explanations = [] }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!explanations || explanations.length === 0) return null;

  return (
    <div className="border border-slate-800 bg-slate-900/60 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/90 text-left hover:bg-slate-850 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-slate-200">
            Conversion Explanations ({explanations.length})
          </span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {isExpanded && (
        <div className="p-4 border-t border-slate-800/80 space-y-2.5">
          <ul className="space-y-2">
            {explanations.map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
