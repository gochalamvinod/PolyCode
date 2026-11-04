import { api } from './api';

export const projectService = {
  async createProject(projectData) {
    return await api.post('/projects', projectData);
  },

  async getProjects(params = {}) {
    return await api.get('/projects', { params });
  },

  async getProjectById(id) {
    return await api.get(`/projects/${id}`);
  },

  async updateProject(id, updates) {
    return await api.put(`/projects/${id}`, updates);
  },

  async deleteProject(id) {
    return await api.delete(`/projects/${id}`);
  }
};
