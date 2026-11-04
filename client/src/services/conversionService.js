import { api } from './api';

export const conversionService = {
  async convertCode({ sourceLanguage, targetLanguage, sourceCode, settings, additionalInstructions }) {
    return await api.post('/conversions', {
      sourceLanguage,
      targetLanguage,
      sourceCode,
      settings,
      additionalInstructions
    });
  },

  async getConversions(params = {}) {
    return await api.get('/conversions', { params });
  },

  async getConversionById(id) {
    return await api.get(`/conversions/${id}`);
  },

  async deleteConversion(id) {
    return await api.delete(`/conversions/${id}`);
  }
};
