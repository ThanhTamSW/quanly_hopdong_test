import api from './api';

export const contractApi = {
  // Lấy danh sách hợp đồng
  getContracts: async (params) => {
    const response = await api.get('/contracts', { params });
    return response.data;
  },

  // Lấy chi tiết hợp đồng
  getContract: async (id) => {
    const response = await api.get(`/contracts/${id}`);
    return response.data;
  },

  // Tạo hợp đồng mới
  createContract: async (data) => {
    const response = await api.post('/contracts', data);
    return response.data;
  },

  // Cập nhật hợp đồng
  updateContract: async (id, data) => {
    const response = await api.put(`/contracts/${id}`, data);
    return response.data;
  },

  // Xóa hợp đồng
  deleteContract: async (id) => {
    const response = await api.delete(`/contracts/${id}`);
    return response.data;
  },

  // Lấy hợp đồng sắp hết hạn
  getExpiringContracts: async (days = 30) => {
    const response = await api.get('/contracts/expiring', { 
      params: { days } 
    });
    return response.data;
  },

  // Upload file đính kèm
  addAttachment: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/contracts/${id}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Xóa file đính kèm
  removeAttachment: async (contractId, attachmentId) => {
    const response = await api.delete(`/contracts/${contractId}/attachments/${attachmentId}`);
    return response.data;
  },
};