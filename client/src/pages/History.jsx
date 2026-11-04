import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { conversionService } from '../services/conversionService';
import { SUPPORTED_LANGUAGES } from '../config/languages';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Loader } from '../components/common/Loader';
import {
  History as HistoryIcon,
  Search,
  Filter,
  ArrowRight,
  Copy,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Code2
} from 'lucide-react';

export const History = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [conversions, setConversions] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceLangFilter, setSourceLangFilter] = useState('');
  const [targetLangFilter, setTargetLangFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  // Preview Modal
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchHistory = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const params = {
        page,
        limit: 8,
        sort: sortOrder,
        ...(searchTerm && { search: searchTerm }),
        ...(sourceLangFilter && { sourceLanguage: sourceLangFilter }),
        ...(targetLangFilter && { targetLanguage: targetLangFilter })
      };

      const res = await conversionService.getConversions(params);
      if (res?.data) {
        setConversions(res.data.conversions || []);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      error(err.message || 'Failed to load conversion history');
    } finally {
      setIsLoading(false);
    }
  }, [sortOrder, searchTerm, sourceLangFilter, targetLangFilter, error]);

  useEffect(() => {
    fetchHistory(1);
  }, [fetchHistory]);

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this conversion record?')) return;

    try {
      await conversionService.deleteConversion(id);
      success('Conversion record deleted');
      if (selectedItem?._id === id) setSelectedItem(null);
      fetchHistory(pagination.currentPage);
    } catch (err) {
      error(err.message || 'Failed to delete record');
    }
  };

  const handleCopyCode = async (code, e) => {
    if (e) e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      success('Copied to clipboard');
    } catch (err) {
      error('Failed to copy');
    }
  };

  const handleReuseInEditor = (item) => {
    navigate('/', {
      state: {
        reuse: {
          srcLang: item.sourceLanguage,
          tgtLang: item.targetLanguage,
          srcCode: item.sourceCode,
          tgtCode: item.convertedCode,
          result: {
            sourceLanguage: item.sourceLanguage,
            targetLanguage: item.targetLanguage,
            sourceCode: item.sourceCode,
            convertedCode: item.convertedCode,
            summary: item.summary,
            explanation: item.explanation,
            warnings: item.warnings,
            assumptions: item.assumptions,
            confidence: item.confidence
          }
        }
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-indigo-400" />
            Conversion History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse, inspect, reuse, or delete your previous AI code conversions.
          </p>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Total Records: <strong className="text-indigo-400">{pagination.totalCount}</strong>
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search code or summary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Source Language */}
        <select
          value={sourceLangFilter}
          onChange={(e) => setSourceLangFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="">All Source Languages</option>
          {SUPPORTED_LANGUAGES.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>

        {/* Target Language */}
        <select
          value={targetLangFilter}
          onChange={(e) => setTargetLangFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="">All Target Languages</option>
          {SUPPORTED_LANGUAGES.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {/* History List */}
      {isLoading ? (
        <Loader size="lg" text="Loading conversion history..." />
      ) : conversions.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/40 space-y-3">
          <Code2 className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No conversions found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm || sourceLangFilter || targetLangFilter
              ? 'Try modifying your search or filter options.'
              : 'Convert some code in the workspace and your history will be preserved here automatically.'}
          </p>
          <Button variant="primary" size="sm" onClick={() => navigate('/')}>
            Go to Converter
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {conversions.map((item) => (
            <div
              key={item._id}
              onClick={() => setSelectedItem(item)}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between space-y-3"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {item.sourceLanguage.toUpperCase()}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {item.targetLanguage.toUpperCase()}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">
                  {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Summary or Snippet Preview */}
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {item.summary || item.sourceCode.substring(0, 120)}
              </p>

              {/* Code Previews mini */}
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-850 font-mono text-[11px] text-slate-400 line-clamp-3">
                {item.convertedCode}
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-850 text-xs">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider">
                  Confidence: {item.confidence || 'high'}
                </span>
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => handleCopyCode(item.convertedCode, e)}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                    title="Copy converted code"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleReuseInEditor(item)}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-indigo-400 transition-colors"
                    title="Reuse in Editor"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(item._id, e)}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={!pagination.hasPrev}
              onClick={() => fetchHistory(pagination.currentPage - 1)}
              leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={!pagination.hasNext}
              onClick={() => fetchHistory(pagination.currentPage + 1)}
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Detail Preview Modal */}
      {selectedItem && (
        <Modal
          isOpen={Boolean(selectedItem)}
          onClose={() => setSelectedItem(null)}
          title={`Conversion: ${selectedItem.sourceLanguage.toUpperCase()} → ${selectedItem.targetLanguage.toUpperCase()}`}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-4 text-xs">
            {selectedItem.summary && (
              <p className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                {selectedItem.summary}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="font-semibold text-slate-400 block mb-1">
                  Source ({selectedItem.sourceLanguage})
                </span>
                <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] overflow-auto max-h-64 text-slate-200">
                  {selectedItem.sourceCode}
                </pre>
              </div>

              <div>
                <span className="font-semibold text-slate-400 block mb-1">
                  Converted ({selectedItem.targetLanguage})
                </span>
                <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] overflow-auto max-h-64 text-emerald-300">
                  {selectedItem.convertedCode}
                </pre>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleCopyCode(selectedItem.convertedCode)}
                leftIcon={<Copy className="w-3.5 h-3.5" />}
              >
                Copy Converted
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleReuseInEditor(selectedItem)}
                leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                Open in Editor
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
