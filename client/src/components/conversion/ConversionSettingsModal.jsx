import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Sliders, Check, RotateCcw } from 'lucide-react';

export const ConversionSettingsModal = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  additionalInstructions,
  onUpdateInstructions
}) => {
  const styles = [
    { id: 'idiomatic', label: 'Idiomatic', desc: 'Canonical conventions & idioms' },
    { id: 'preserve_structure', label: 'Strict 1:1', desc: 'Exact line-by-line structure' },
    { id: 'simple_readable', label: 'Simple', desc: 'Maximum readability & clean syntax' }
  ];

  const details = [
    { id: 'detailed', label: 'Standard', desc: 'Balanced explanations' },
    { id: 'with_explanations', label: 'In-Depth', desc: 'Comprehensive reasoning' },
    { id: 'basic', label: 'Brief', desc: 'Concise summary only' }
  ];

  const preferences = [
    { id: 'preserve_algorithm', label: 'Strict Algorithm', desc: 'Preserves exact control loop' },
    { id: 'optimize_safe', label: 'Safe Idioms', desc: 'Utilizes built-in primitives' }
  ];

  const handleResetDefaults = () => {
    onUpdateSettings({
      conversionStyle: 'idiomatic',
      conversionDetail: 'detailed',
      codePreferences: 'preserve_algorithm',
      addComments: true
    });
    onUpdateInstructions('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Conversion Preferences" maxWidth="max-w-xl">
      <div className="space-y-5 text-xs text-slate-700 dark:text-slate-300">
        {/* Style Segment */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-900 dark:text-white">Conversion Style</label>
            <span className="text-[11px] text-slate-500">
              {styles.find((s) => s.id === settings.conversionStyle)?.desc}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            {styles.map((item) => {
              const selected = settings.conversionStyle === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, conversionStyle: item.id })}
                  className={`py-1.5 px-3 rounded-md font-medium text-xs transition-all ${
                    selected
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail Level Segment */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-900 dark:text-white">Explanation Depth</label>
            <span className="text-[11px] text-slate-500">
              {details.find((d) => d.id === settings.conversionDetail)?.desc}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            {details.map((item) => {
              const selected = settings.conversionDetail === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, conversionDetail: item.id })}
                  className={`py-1.5 px-3 rounded-md font-medium text-xs transition-all ${
                    selected
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Algorithm Strictness */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-slate-900 dark:text-white">Algorithm Strictness</label>
            <span className="text-[11px] text-slate-500">
              {preferences.find((p) => p.id === settings.codePreferences)?.desc}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            {preferences.map((item) => {
              const selected = settings.codePreferences === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onUpdateSettings({ ...settings, codePreferences: item.id })}
                  className={`py-1.5 px-3 rounded-md font-medium text-xs transition-all ${
                    selected
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Inline Comments Switch Row */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
          <div>
            <span className="font-semibold text-slate-900 dark:text-white block">Inline Documentation</span>
            <span className="text-[11px] text-slate-500">Insert helpful comments explaining translation decisions</span>
          </div>
          <button
            type="button"
            onClick={() => onUpdateSettings({ ...settings, addComments: !settings.addComments })}
            className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
              settings.addComments ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                settings.addComments ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Custom Directives */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-900 dark:text-white block">
            Custom Directives <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <textarea
            value={additionalInstructions}
            onChange={(e) => onUpdateInstructions(e.target.value)}
            placeholder="e.g. Use ES6 arrow functions; optimize for memory; preserve original parameter names..."
            rows={2}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="accent" size="sm" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
