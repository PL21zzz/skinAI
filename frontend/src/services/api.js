import axios from 'axios';

const API_URL = 'https://skinbe.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Tự động gắn Token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor: Tự động đá ra ngoài nếu Token hết hạn (401)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'; // Chuyển hướng về trang login
    }
    return Promise.reject(error);
  }
);

// API User (Đăng nhập/Đăng ký)
export const userAPI = {
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  }
};

// API AI (Phân tích ảnh)
export const predictionAPI = {
  predictImage: async (file) => {
    const formData = new FormData();
    // QUAN TRỌNG: Backend của bạn bắt buộc key là 'image'
    formData.append('image', file);

    const response = await api.post('/predictions/predict', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  getHistory: async (limit = 10) => {
    const response = await api.get(`/predictions/history?limit=${limit}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/predictions/${id}`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/predictions/${id}`);
    return response.data;
  }
};

export default api;
