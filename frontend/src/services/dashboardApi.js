import api from './api';

export const dashboardApi = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  getChartData: async (period = '6months') => {
    const response = await api.get('/dashboard/charts', {
      params: { period }
    });
    return response.data;
  },

  getRecentContracts: async (limit = 5) => {
    const response = await api.get('/dashboard/recent-contracts', {
      params: { limit }
    });
    return response.data;
  },
};