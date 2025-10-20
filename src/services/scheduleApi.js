// src/services/scheduleApi.js - Schedule API service
import { api } from './api';

export const scheduleApi = {
  // Get all schedules
  getSchedules: async (params = {}) => {
    try {
      const response = await api.get('/schedules', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw error;
    }
  },

  // Get my schedules (for trainers)
  getMySchedules: async (params = {}) => {
    try {
      const response = await api.get('/schedules/my', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching my schedules:', error);
      throw error;
    }
  },

  // Get today's schedules
  getMyToday: async () => {
    try {
      const response = await api.get('/schedules/today');
      return response.data;
    } catch (error) {
      console.error('Error fetching today schedules:', error);
      throw error;
    }
  },

  // Get schedule by ID
  getSchedule: async (id) => {
    try {
      const response = await api.get(`/schedules/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching schedule:', error);
      throw error;
    }
  },

  // Create new schedule
  createSchedule: async (data) => {
    try {
      const response = await api.post('/schedules', data);
      return response.data;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  },

  // Update schedule
  updateSchedule: async (id, data) => {
    try {
      const response = await api.put(`/schedules/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  },

  // Delete schedule
  deleteSchedule: async (id) => {
    try {
      const response = await api.delete(`/schedules/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
  },

  // Check-in to schedule
  checkIn: async (id) => {
    try {
      const response = await api.post(`/schedules/${id}/check-in`);
      return response.data;
    } catch (error) {
      console.error('Error checking in:', error);
      throw error;
    }
  },

  // Check-out from schedule
  checkOut: async (id) => {
    try {
      const response = await api.post(`/schedules/${id}/check-out`);
      return response.data;
    } catch (error) {
      console.error('Error checking out:', error);
      throw error;
    }
  },

  // Get weekly schedules
  getWeeklySchedules: async (week) => {
    try {
      const response = await api.get('/schedules/weekly', { params: { week } });
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly schedules:', error);
      throw error;
    }
  },

  // Get my stats
  getMyStats: async (period) => {
    try {
      const response = await api.get('/schedules/stats', { params: { period } });
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }
};