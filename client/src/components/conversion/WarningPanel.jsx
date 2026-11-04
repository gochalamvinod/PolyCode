import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const WarningPanel = ({ warnings = [], assumptions = [] }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const hasWarnings = warnings && warnings.length > 0;
  const hasAssumptions = assumptions && assumptions.length > 0;

  if (!hasWarnings && !hasAssumptions) return null;

  return (
    <div className="border border-amber-500/30 bg-amber-950/20 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-amber-950/40 text-left hover:bg-amber-950/60 transition-colors"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-amber-200">
            Conversion Notices & Assumptions ({warnings.length + assumptions.length})
          </span>
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-amber-400/80" /> : <ChevronDown className="w-4 h-4 text-amber-400/80" />}
      </button>

      {isExpanded && (
        <div className="p-4 border-t border-amber-500/20 space-y-4 text-xs">
          {hasWarnings && (
            <div>
              <h4 className="font-semibold text-amber-300 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Potential Differences & Warnings:
              </h4>
              <ul className="space-y-1.5 pl-2">
                {warnings.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-amber-200/90 leading-relaxed">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasAssumptions && (
            <div className={hasWarnings ? 'pt-3 border-t border-amber-500/20' : ''}>
              <h4 className="font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                Assumptions Made:
              </h4>
              <ul className="space-y-1.5 pl-2">
                {assumptions.map((a, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300 leading-relaxed">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
