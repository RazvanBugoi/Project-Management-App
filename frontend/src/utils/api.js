import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : null;
};

const createAxiosInstance = () => {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor to add auth token
  instance.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
    },
    (error) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle errors
  instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      console.error('Response error:', error);
      
      if (error.response?.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      throw error;
    }
  );

  return instance;
};

const api = createAxiosInstance();

export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response?.data?.error) {
    return { message: error.response.data.error };
  }
  
  if (error.response?.status === 401) {
    return { message: 'Please log in to continue' };
  }
  
  if (error.response?.status === 403) {
    return { message: 'You do not have permission to perform this action' };
  }
  
  if (error.response?.status === 404) {
    return { message: 'Resource not found' };
  }
  
  return { message: 'An unexpected error occurred' };
};

// Auth endpoints
export const auth = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
};

// Projects endpoints
export const projects = {
  getAll: () => api.get('/projects'),
  getOne: (code) => api.get(`/projects/${code}`),
  create: (data) => api.post('/projects', data),
  update: (code, data) => api.put(`/projects/${code}`, data),
  delete: (code) => api.delete(`/projects/${code}`),
};

// Applications endpoints
export const applications = {
  getAll: () => api.get('/applications'),
  getOne: (id) => api.get(`/applications/${id}`),
  create: (data) => api.post('/applications', data),
  update: (id, data) => api.put(`/applications/${id}`, data),
  delete: (id) => api.delete(`/applications/${id}`),
};

// Consultants endpoints
export const consultants = {
  getAll: () => api.get('/consultants'),
  getOne: (id) => api.get(`/consultants/${id}`),
  create: (data) => api.post('/consultants', data),
  update: (id, data) => api.put(`/consultants/${id}`, data),
  delete: (id) => api.delete(`/consultants/${id}`),
};

// Topic Areas endpoints
export const topicAreas = {
  getAll: () => api.get('/topic-areas'),
  getOne: (id) => api.get(`/topic-areas/${id}`),
  create: (data) => api.post('/topic-areas', data),
  update: (id, data) => api.put(`/topic-areas/${id}`, data),
  delete: (id) => api.delete(`/topic-areas/${id}`),
};

// Quotes endpoints
export const quotes = {
  getAll: () => api.get('/quotes'),
  getOne: (id) => api.get(`/quotes/${id}`),
  create: (data) => api.post('/quotes', data),
  update: (id, data) => api.put(`/quotes/${id}`, data),
  delete: (id) => api.delete(`/quotes/${id}`),
};

// Tasks endpoints
export const tasks = {
  getAll: () => api.get('/tasks'),
  getMyTasks: () => api.get('/tasks/my-tasks'),
  getOne: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  updateStatus: (id, status) => api.patch(`/tasks/${id}`, { status }),
  delete: (id) => api.delete(`/tasks/${id}`),
};

// Reports endpoints
export const reports = {
  getApplications: () => api.get('/reports/applications'),
  getConsultants: () => api.get('/reports/consultants'),
  getTasks: () => api.get('/reports/tasks'),
};