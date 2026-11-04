import React, { useState } from 'react';
import { SUPPORTED_LANGUAGES } from '../config/languages';
import {
  BookOpen,
  Sparkles,
  ArrowRightLeft,
  Keyboard,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  Copy,
  Download,
  FolderKanban,
  History,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const Documentation = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: "Does PolyCode execute my code on the server?",
      a: "No. PolyCode performs static semantic code translation and structural analysis. Your code is never compiled or executed, ensuring total sandbox security."
    },
    {
      q: "How does PolyCode handle memory management differences between languages?",
      a: "When converting from garbage-collected languages (like Python or Java) to C or C++, PolyCode introduces proper dynamic allocations (malloc/free or modern smart pointers like std::unique_ptr) and flags potential memory management considerations in the Warning panel."
    },
    {
      q: "Can I convert complete multi-function scripts and classes?",
      a: "Yes. PolyCode translates entire classes, helper functions, imports, and entry points, ensuring target language conventions (e.g., standard public static void main in Java, or if __name__ == '__main__': in Python) are correctly structured."
    },
    {
      q: "What should I do if the target language produces a compiler warning?",
      a: "Check the Explanation and Warning panels beneath the editor. PolyCode highlights potential type discrepancies, precision loss (e.g. 64-bit float to 32-bit int), or missing library headers so you can review them before compiling."
    },
    {
      q: "How do I save and organize my converted snippets?",
      a: "Click 'Save Project' on the toolbar to store your snippet into your personal Projects library. You can revisit, rename, or re-convert any past snippet at any time from the Projects and History tabs."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-slate-300">
      {/* Header */}
      <div className="space-y-3 pb-8 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          User Guide & Documentation
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          How to Use PolyCode
        </h1>
        <p className="text-base text-slate-400 max-w-3xl">
          Everything you need to know about converting source code across programming languages, navigating the editor, and getting idiomatic, production-ready results.
        </p>
      </div>

      {/* 1. Quick Start Workflow */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">1. Quick Start Workflow</h2>
        </div>
        <p className="text-sm text-slate-400">
          Converting code in PolyCode is straightforward. Follow these four simple steps:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 relative overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-sm border border-indigo-500/30">
              1
            </div>
            <h3 className="font-semibold text-white text-sm">Select Source</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Choose your input language in the left panel. Paste your existing code or click "Load Sample" to test an example.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 relative overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-sm border border-purple-500/30">
              2
            </div>
            <h3 className="font-semibold text-white text-sm">Choose Target</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select the language you want to convert into from the dropdown in the right-hand panel.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 relative overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm border border-emerald-500/30">
              3
            </div>
            <h3 className="font-semibold text-white text-sm">Convert Code</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click the <strong className="text-emerald-400">Convert Code</strong> button or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 font-mono text-[10px]">Ctrl + Enter</kbd>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 relative overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-sm border border-amber-500/30">
              4
            </div>
            <h3 className="font-semibold text-white text-sm">Export & Save</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Copy the result to your clipboard, download the source file, or save it to your Projects library for later.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Key Features */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">2. Core Platform Capabilities</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-1">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-white text-sm">Idiomatic Transpilation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              PolyCode translates concepts, not just words. For example, Python list comprehensions are naturally mapped to Java Streams or C++ STL algorithms.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-1">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-white text-sm">Safety & Pitfall Warnings</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The engine automatically flags potential language pitfalls, such as manual memory cleanup in C, type overflows, or asynchronous promise handling.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-1">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-white text-sm">Step-by-Step Explanation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inspect the logic breakdown panel to understand architectural differences between languages, complexity notes, and equivalent library methods.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Supported Languages */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">3. Supported Language Matrix</h2>
        </div>
        <p className="text-sm text-slate-400">
          PolyCode currently provides bidirectional conversion between the following five major programming languages:
        </p>

        <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/60">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900 text-slate-400">
                <th className="p-3">Language</th>
                <th className="p-3">Extension</th>
                <th className="p-3">Style / Standard</th>
                <th className="p-3">Supported Features & Paradigms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {SUPPORTED_LANGUAGES.map((l) => (
                <tr key={l.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="p-3 font-semibold text-slate-200 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                    {l.name}
                  </td>
                  <td className="p-3 font-mono text-indigo-400">{l.extension}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] uppercase font-mono text-slate-300">
                      {l.tag}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{l.capabilities.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Keyboard Shortcuts */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Keyboard className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white">4. Keyboard Shortcuts & Editor Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-300">Run Conversion</span>
            <kbd className="px-2 py-1 rounded bg-slate-950 border border-slate-700 font-mono text-[11px] text-indigo-300">
              Ctrl + Enter
            </kbd>
          </div>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-300">Find in Editor</span>
            <kbd className="px-2 py-1 rounded bg-slate-950 border border-slate-700 font-mono text-[11px] text-indigo-300">
              Ctrl + F
            </kbd>
          </div>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-300">Replace in Editor</span>
            <kbd className="px-2 py-1 rounded bg-slate-950 border border-slate-700 font-mono text-[11px] text-indigo-300">
              Ctrl + H
            </kbd>
          </div>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-300">Format Code</span>
            <kbd className="px-2 py-1 rounded bg-slate-950 border border-slate-700 font-mono text-[11px] text-indigo-300">
              Shift + Alt + F
            </kbd>
          </div>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-300">Toggle Fullscreen</span>
            <kbd className="px-2 py-1 rounded bg-slate-950 border border-slate-700 font-mono text-[11px] text-indigo-300">
              F11
            </kbd>
          </div>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-300">Command Palette</span>
            <kbd className="px-2 py-1 rounded bg-slate-950 border border-slate-700 font-mono text-[11px] text-indigo-300">
              F1
            </kbd>
          </div>
        </div>
      </section>

      {/* 5. Best Practices */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">5. Best Practices for Accurate Conversions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-emerald-400 text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Recommended Practices
            </h3>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
              <li>Provide complete functions or classes with explicit inputs and return values.</li>
              <li>Include comments explaining any tricky algorithms or domain-specific assumptions.</li>
              <li>Check the Warning panel for pointers, memory leaks, or type narrowing notices.</li>
              <li>Use the "Copy" or "Download" buttons on the top right toolbar to export results easily.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h3 className="font-semibold text-amber-400 text-sm flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Things to Avoid
            </h3>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
              <li>Avoid passing partial code snippets missing closing brackets or declarations.</li>
              <li>Don't assume dynamically typed arrays in Python/JS can always resize without limits in C.</li>
              <li>Avoid proprietary frameworks not part of the standard language SDKs.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">6. Frequently Asked Questions</h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-800 rounded-xl bg-slate-900 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-800/40 transition-colors"
                >
                  <span className="text-xs font-semibold text-slate-200">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-indigo-400 shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-400 border-t border-slate-800/60 leading-relaxed bg-slate-950/40">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
