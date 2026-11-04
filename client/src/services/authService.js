import { api } from './api';

export const authService = {
  async register(userData) {
    return await api.post('/auth/register', userData);
  },

  async login(credentials) {
    return await api.post('/auth/login', credentials);
  },

  async logout() {
    return await api.post('/auth/logout');
  },

  async getMe() {
    return await api.get('/auth/me');
  },

  async updateProfile(updates) {
    return await api.put('/auth/me', updates);
  }
};
