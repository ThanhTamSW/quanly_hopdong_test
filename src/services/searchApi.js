// src/services/searchApi.js - API service cho advanced search
import { api } from '@/services/api';

export const searchApi = {
  // Search schedules
  searchSchedules: async (params) => {
    try {
      const response = await api.get('/search/schedules', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search contracts
  searchContracts: async (params) => {
    try {
      const response = await api.get('/search/contracts', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search trainers
  searchTrainers: async (params) => {
    try {
      const response = await api.get('/search/trainers', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Global search
  globalSearch: async (searchTerm, limit = 10) => {
    try {
      const response = await api.get('/search/global', {
        params: { search: searchTerm, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Advanced search with filters
  advancedSearch: async (searchType, filters) => {
    try {
      const params = {
        search: filters.search || '',
        filters: filters.filters ? JSON.stringify(filters.filters) : undefined,
        groupBy: filters.groupBy || undefined,
        aggregations: filters.aggregations || undefined,
        page: filters.page || 1,
        limit: filters.limit || 20
      };

      // Remove undefined values
      Object.keys(params).forEach(key => {
        if (params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await api.get(`/search/${searchType}`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

