import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Backend running on port 8001
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post('/auth/login/refresh/', {
            refresh: refreshToken,
          });

          const { access, refresh } = response.data;
          localStorage.setItem('access_token', access);
          localStorage.setItem('refresh_token', refresh);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.put('/auth/profile/update/', data),
};

// Documents API calls
export const documentsAPI = {
  getDocuments: () => api.get('/documents/'),
  uploadDocument: (formData) => api.post('/documents/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getDocument: (id) => api.get(`/documents/${id}/`),
  deleteDocument: (id) => api.delete(`/documents/${id}/`),
  getChunks: (id) => api.get(`/documents/${id}/chunks/`),
  updateProgress: (id, data) => api.post(`/documents/${id}/progress/`, data),
  getBookmarks: (id) => api.get(`/documents/${id}/bookmarks/`),
  addBookmark: (id, data) => api.post(`/documents/${id}/bookmarks/`, data),
  removeBookmark: (id, chunkId) => api.delete(`/documents/${id}/bookmarks/`, { data: { chunk_id: chunkId } }),
  getAnalytics: (id) => api.get(`/documents/${id}/analytics/`),
  reprocessDocument: (id, data) => api.post(`/documents/${id}/reprocess/`, data),
  getRecommendations: () => api.get('/documents/recommendations/'),
};

// Analytics API calls
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard/'),
  getDiscover: () => api.get('/analytics/discover/'),
};

export default api;
