import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  FileText,
  CheckCircle2
} from 'lucide-react';

export const ConversionResult = ({ result }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!result) return null;

  const {
    summary,
    explanation = [],
    warnings = [],
    assumptions = [],
    confidence = 'high',
    syntaxValid = true,
    sourceName,
    targetName
  } = result;

  const tabs = [
    { id: 'summary', name: 'Overview', icon: FileText, count: null },
    { id: 'explanations', name: 'Explanations', icon: Lightbulb, count: explanation.length },
    { id: 'warnings', name: 'Notices & Pitfalls', icon: AlertTriangle, count: warnings.length },
    { id: 'assumptions', name: 'Assumptions', icon: HelpCircle, count: assumptions.length }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs text-xs transition-colors">
      {/* Dock Header */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 select-none">
        <div className="flex items-center gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (isCollapsed) setIsCollapsed(false);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive && !isCollapsed
                    ? 'bg-white dark:bg-slate-850 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-750 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.name}</span>
                {tab.count !== null && tab.count > 0 && (
                  <span className={`px-1.5 rounded-full text-[10px] font-mono font-semibold ${
                    tab.id === 'warnings' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Info & Toggle */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 px-2.5 py-0.5 rounded-full font-medium">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            {sourceName} → {targetName}
          </span>

          <span className="hidden md:inline-flex items-center text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-800 font-semibold">
            {confidence}
          </span>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand dock' : 'Collapse dock'}
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Dock Content Body */}
      {!isCollapsed && (
        <div className="p-4 max-h-60 overflow-y-auto bg-white dark:bg-slate-900/60 leading-relaxed text-slate-700 dark:text-slate-300">
          {activeTab === 'summary' && (
            <div className="space-y-3">
              <div className="text-xs font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                {summary || 'Code translated successfully.'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[11px]">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-500">Target Language:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">{targetName}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-500">Heuristic Syntax:</span>
                  <span className={`font-mono font-semibold ${syntaxValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {syntaxValid ? 'Verified Balanced' : 'Check Brackets'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'explanations' && (
            <div className="space-y-2">
              {explanation.length === 0 ? (
                <p className="text-slate-400 italic">No specific explanations generated.</p>
              ) : (
                <ul className="space-y-2">
                  {explanation.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === 'warnings' && (
            <div className="space-y-2">
              {warnings.length === 0 ? (
                <p className="text-slate-400 italic">No warnings or unsupported features detected.</p>
              ) : (
                <ul className="space-y-2">
                  {warnings.map((w, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/20 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800/40">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === 'assumptions' && (
            <div className="space-y-2">
              {assumptions.length === 0 ? (
                <p className="text-slate-400 italic">No special assumptions recorded.</p>
              ) : (
                <ul className="space-y-2">
                  {assumptions.map((a, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
