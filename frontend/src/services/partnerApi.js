import api from './api';

export const partnerApi = {
  getPartners: async (params) => {
    const response = await api.get('/partners', { params });
    return response.data;
  },

  getPartner: async (id) => {
    const response = await api.get(`/partners/${id}`);
    return response.data;
  },

  createPartner: async (data) => {
    const response = await api.post('/partners', data);
    return response.data;
  },

  updatePartner: async (id, data) => {
    const response = await api.put(`/partners/${id}`, data);
    return response.data;
  },

  deletePartner: async (id) => {
    const response = await api.delete(`/partners/${id}`);
    return response.data;
  },
};