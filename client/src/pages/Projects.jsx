import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Loader } from '../components/common/Loader';
import {
  FolderGit2,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Tag,
  ArrowRight,
  Code2
} from 'lucide-react';

export const Projects = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalCount: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Edit Modal State
  const [editingProject, setEditingProject] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTags, setEditTags] = useState('');

  const fetchProjects = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const res = await projectService.getProjects({
        page,
        limit: 9,
        ...(searchTerm && { search: searchTerm })
      });
      if (res?.data) {
        setProjects(res.data.projects || []);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      error(err.message || 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, error]);

  useEffect(() => {
    fetchProjects(1);
  }, [fetchProjects]);

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this saved project?')) return;

    try {
      await projectService.deleteProject(id);
      success('Project deleted');
      fetchProjects(pagination.currentPage);
    } catch (err) {
      error(err.message || 'Failed to delete project');
    }
  };

  const handleOpenEdit = (project, e) => {
    if (e) e.stopPropagation();
    setEditingProject(project);
    setEditTitle(project.title);
    setEditDescription(project.description || '');
    setEditTags(project.tags?.join(', ') || '');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      error('Project title is required');
      return;
    }

    try {
      const tags = editTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await projectService.updateProject(editingProject._id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        tags
      });

      success('Project updated successfully');
      setEditingProject(null);
      fetchProjects(pagination.currentPage);
    } catch (err) {
      error(err.message || 'Failed to update project');
    }
  };

  const handleOpenInEditor = (project) => {
    navigate('/', {
      state: {
        reuse: {
          srcLang: project.sourceLanguage,
          tgtLang: project.targetLanguage,
          srcCode: project.sourceCode,
          tgtCode: project.convertedCode,
          result: {
            sourceLanguage: project.sourceLanguage,
            targetLanguage: project.targetLanguage,
            sourceCode: project.sourceCode,
            convertedCode: project.convertedCode,
            summary: project.summary || project.title
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
            <FolderGit2 className="w-5 h-5 text-indigo-400" />
            Saved Projects
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize, document, and revisit your important code conversion projects.
          </p>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Saved Projects: <strong className="text-indigo-400">{pagination.totalCount}</strong>
        </span>
      </div>

      {/* Search */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 max-w-md">
        <div className="relative text-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects by title, description or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <Loader size="lg" text="Loading saved projects..." />
      ) : projects.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-950/40 space-y-3">
          <Code2 className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No saved projects yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Convert code in the main workspace and click "Save Project" in the target editor toolbar to store it here.
          </p>
          <Button variant="primary" size="sm" onClick={() => navigate('/')}>
            Open Converter
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <div
              key={proj._id}
              className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm text-slate-100 line-clamp-1">{proj.title}</h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleOpenEdit(proj, e)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                      title="Edit project"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(proj._id, e)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {proj.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                )}

                <div className="flex items-center gap-2 pt-1 text-xs">
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {proj.sourceLanguage.toUpperCase()}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {proj.targetLanguage.toUpperCase()}
                  </span>
                </div>

                {proj.tags && proj.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {proj.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                      >
                        <Tag className="w-2.5 h-2.5 text-indigo-400" />
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">
                  {new Date(proj.updatedAt).toLocaleDateString()}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenInEditor(proj)}
                  rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                >
                  Open in Editor
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingProject && (
        <Modal
          isOpen={Boolean(editingProject)}
          onClose={() => setEditingProject(null)}
          title="Edit Project Details"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleUpdate} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Project Title *</label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Tags (Comma-separated)</label>
              <input
                type="text"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <Button variant="ghost" size="sm" type="button" onClick={() => setEditingProject(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
