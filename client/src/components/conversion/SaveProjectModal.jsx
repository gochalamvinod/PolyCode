import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { projectService } from '../../services/projectService';
import { useToast } from '../../context/ToastContext';

export const SaveProjectModal = ({
  isOpen,
  onClose,
  sourceLanguage,
  targetLanguage,
  sourceCode,
  convertedCode,
  summary
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      error('Please enter a project title');
      return;
    }

    try {
      setIsSubmitting(true);
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await projectService.createProject({
        title: title.trim(),
        description: description.trim(),
        sourceLanguage,
        targetLanguage,
        sourceCode,
        convertedCode,
        summary,
        tags
      });

      success('Project saved successfully!');
      setTitle('');
      setDescription('');
      setTagsInput('');
      onClose();
    } catch (err) {
      error(err.message || 'Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Save Conversion as Project" maxWidth="max-w-lg">
      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-300 mb-1.5">Project Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Fibonacci Algorithm in Java"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-300 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief notes about this code conversion..."
            rows={2}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-300 mb-1.5">Tags (Comma-separated)</label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="algorithms, math, performance"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-slate-400">
          <span>Pair: {sourceLanguage} → {targetLanguage}</span>
          <span>{convertedCode ? convertedCode.length : 0} characters</span>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <Button variant="ghost" size="sm" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
            Save Project
          </Button>
        </div>
      </form>
    </Modal>
  );
};
