// src/services/importApi.js - Import API service
import { api } from './api';

export const importApi = {
  // Download template
  downloadTemplate: async (type) => {
    try {
      const response = await api.get(`/import/template/${type}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_template.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading template:', error);
      throw error;
    }
  },

  // Preview import data
  previewImport: async (formData) => {
    try {
      const response = await api.post('/import/preview', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error previewing import:', error);
      throw error;
    }
  },

  // Import contracts
  importContracts: async (formData) => {
    try {
      const response = await api.post('/import/contracts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error importing contracts:', error);
      throw error;
    }
  },

  // Import partners
  importPartners: async (formData) => {
    try {
      const response = await api.post('/import/partners', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error importing partners:', error);
      throw error;
    }
  },

  // Import schedules
  importSchedules: async (formData) => {
    try {
      const response = await api.post('/import/schedules', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error importing schedules:', error);
      throw error;
    }
  }
};