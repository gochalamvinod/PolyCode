import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { SourceEditor } from '../components/editor/SourceEditor';
import { TargetEditor } from '../components/editor/TargetEditor';
import { ConversionControls } from '../components/conversion/ConversionControls';
import { ConversionResult } from '../components/conversion/ConversionResult';
import { ConversionSettingsModal } from '../components/conversion/ConversionSettingsModal';
import { SaveProjectModal } from '../components/conversion/SaveProjectModal';
import { SUPPORTED_LANGUAGES, getLanguageById } from '../config/languages';
import { conversionService } from '../services/conversionService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../components/common/Button';

export const Dashboard = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { success, error, warning } = useToast();

  // Primary Workspace State
  const [sourceLanguage, setSourceLanguage] = useState(
    user?.preferredSourceLanguage || 'python'
  );
  const [targetLanguage, setTargetLanguage] = useState(
    user?.preferredTargetLanguage || 'javascript'
  );
  const [sourceCode, setSourceCode] = useState('');
  const [convertedCode, setConvertedCode] = useState('');
  const [conversionResult, setConversionResult] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Settings & Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [settings, setSettings] = useState({
    conversionStyle: 'idiomatic',
    conversionDetail: 'detailed',
    codePreferences: 'preserve_algorithm',
    addComments: true
  });
  const [additionalInstructions, setAdditionalInstructions] = useState('');

  // Initialize with starter code or location state (from History / Projects)
  useEffect(() => {
    if (location.state?.reuse) {
      const { srcLang, tgtLang, srcCode, tgtCode, result } = location.state.reuse;
      if (srcLang) setSourceLanguage(srcLang);
      if (tgtLang) setTargetLanguage(tgtLang);
      if (srcCode) setSourceCode(srcCode);
      if (tgtCode) setConvertedCode(tgtCode);
      if (result) setConversionResult(result);
    } else if (!sourceCode) {
      const initialLang = getLanguageById('python');
      setSourceCode(initialLang.sampleCode);
    }
  }, [location.state]);

  // Load sample code for currently selected source language
  const handleLoadSample = () => {
    const langObj = getLanguageById(sourceLanguage);
    if (langObj && langObj.sampleCode) {
      setSourceCode(langObj.sampleCode);
      success(`Loaded ${langObj.name} sample`);
    }
  };

  // Swap Languages cleanly without losing code
  const handleSwapLanguages = () => {
    const oldSource = sourceLanguage;
    const oldTarget = targetLanguage;
    const oldSourceCode = sourceCode;
    const oldConvertedCode = convertedCode;

    setSourceLanguage(oldTarget);
    setTargetLanguage(oldSource);

    if (convertedCode) {
      setSourceCode(oldConvertedCode);
      setConvertedCode(oldSourceCode);
    }
    setConversionResult(null);
    setApiError(null);
  };

  // Clear workspace
  const handleClearAll = () => {
    setSourceCode('');
    setConvertedCode('');
    setConversionResult(null);
    setApiError(null);
  };

  // Main Conversion Action
  const handleConvert = useCallback(async () => {
    if (!sourceCode.trim()) {
      warning('Please provide source code to convert.');
      return;
    }

    if (sourceLanguage === targetLanguage) {
      warning('Source and target languages cannot be identical.');
      return;
    }

    if (isConverting) return;

    try {
      setIsConverting(true);
      setApiError(null);

      const response = await conversionService.convertCode({
        sourceLanguage,
        targetLanguage,
        sourceCode,
        settings,
        additionalInstructions
      });

      if (response?.data) {
        setConvertedCode(response.data.convertedCode);
        setConversionResult(response.data);
        success(`Transpiled to ${response.data.targetName}`);
      }
    } catch (err) {
      setApiError(err);
      error(err.message || 'Conversion failed.');
    } finally {
      setIsConverting(false);
    }
  }, [sourceCode, sourceLanguage, targetLanguage, settings, additionalInstructions, isConverting, success, error, warning]);

  // Keyboard shortcut listener (Ctrl + Enter to convert)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleConvert();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleConvert]);

  const sourceObj = getLanguageById(sourceLanguage);
  const targetObj = getLanguageById(targetLanguage);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 space-y-4">
      {/* Workbench Toolbar */}
      <ConversionControls
        sourceLanguage={sourceLanguage}
        targetLanguage={targetLanguage}
        onSourceLanguageChange={(newLang) => {
          if (newLang === targetLanguage) setTargetLanguage(sourceLanguage);
          setSourceLanguage(newLang);
        }}
        onTargetLanguageChange={(newLang) => {
          if (newLang === sourceLanguage) setSourceLanguage(targetLanguage);
          setTargetLanguage(newLang);
        }}
        onSwapLanguages={handleSwapLanguages}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onClearAll={handleClearAll}
        onLoadSample={handleLoadSample}
        onConvert={handleConvert}
        isConverting={isConverting}
        hasSourceCode={Boolean(sourceCode.trim())}
      />

      {/* Error Notice */}
      {apiError && (
        <div className="p-3.5 rounded-lg border border-rose-800/60 bg-rose-950/30 text-rose-200 text-xs flex flex-col sm:flex-row items-start justify-between gap-3 animate-fade-in">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="font-semibold text-rose-100">Conversion Discrepancy</h4>
              <p className="text-zinc-300">
                {apiError.message || 'An error occurred during conversion.'}
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleConvert}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Responsive Two-Panel Code Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Left: Source Editor */}
        <SourceEditor
          code={sourceCode}
          onChange={setSourceCode}
          language={sourceLanguage}
        />

        {/* Right: Target Editor */}
        <TargetEditor
          code={convertedCode}
          language={targetLanguage}
          isConverting={isConverting}
          confidence={conversionResult?.confidence}
          onSaveProject={user ? () => setIsSaveModalOpen(true) : null}
        />
      </div>

      {/* Developer Inspection Dock (Summary, Explanations, Warnings) */}
      {conversionResult && <ConversionResult result={conversionResult} />}

      {/* IDE Status Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[11px] font-mono text-slate-500 dark:text-slate-400 shadow-xs transition-colors">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-700 dark:text-slate-300 font-semibold">Engine Active</span>
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-slate-800 dark:text-slate-200">{sourceObj?.name} ➔ {targetObj?.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span>UTF-8</span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span>Spaces: 4</span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold">Gemini 3.1 Flash Lite</span>
        </div>
      </div>

      {/* Modals */}
      <ConversionSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        additionalInstructions={additionalInstructions}
        onUpdateInstructions={setAdditionalInstructions}
      />

      {user && (
        <SaveProjectModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          sourceLanguage={sourceLanguage}
          targetLanguage={targetLanguage}
          sourceCode={sourceCode}
          convertedCode={convertedCode}
          summary={conversionResult?.summary || ''}
        />
      )}
    </div>
  );
};
