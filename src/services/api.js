import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptor for auth token if needed
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: (id) => api.get(`/auth/profile/${id}`)
};

export const academyService = {
  getCourses: () => api.get('/academy'),
  getCourse: (id) => api.get(`/academy/${id}`),
  createCourse: (courseData) => api.post('/academy', courseData),
  updateCourse: (id, courseData) => api.put(`/academy/${id}`, courseData),
  deleteCourse: (id) => api.delete(`/academy/${id}`)
};

export const staffService = {
  getAllStaff: () => api.get('/staff'),
  addStaff: (staffData) => api.post('/staff', staffData),
  updateStaff: (id, staffData) => api.put(`/staff/${id}`, staffData),
  deleteStaff: (id) => api.delete(`/staff/${id}`)
};

export const hubService = {
  getStats: () => api.get('/hub/stats'),
  getServices: () => api.get('/hub/services'),
  bookService: (data) => api.post('/hub/book', data)
};

export default api;
