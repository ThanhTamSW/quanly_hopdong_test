import api from './api';

export const authApi = {
  // Đăng ký
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // Đăng nhập
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Đăng xuất
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return response.data;
  },

  // Lấy thông tin user hiện tại
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Cập nhật profile
  updateProfile: async (data) => {
    const response = await api.put('/auth/update-profile', data);
    return response.data;
  },

  // Đổi mật khẩu
  changePassword: async (data) => {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  },
};