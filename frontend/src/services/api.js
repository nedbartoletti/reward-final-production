import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/token/`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.detail || 'Invalid credentials');
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/users/', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/profile/');
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

export const getUserDashboard = async () => {
  const response = await api.get('/users/dashboard/');
  return response.data;
};

export const getApps = async () => {
  const response = await api.get('/apps/');
  return response.data;
};

export const submitTaskCompletion = async (appId, screenshot) => {
  const formData = new FormData();
  formData.append('screenshot', screenshot);
  const response = await api.post(`/apps/${appId}/submit_completion/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getUserTasks = async () => {
  const response = await api.get('/tasks/');
  return response.data;
};

// Admin endpoints
export const adminGetApps = async () => {
  try {
    const response = await api.get('/admin/apps/');
    return response;
  } catch (error) {
    console.error('Get apps error:', error);
    throw error;
  }
};

export const adminCreateApp = async (formData) => {
  try {
    const response = await api.post('/admin/apps/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Create app error:', error);
    throw error;
  }
};

export const adminGetTasks = async () => {
  try {
    const response = await api.get('/admin/tasks/');
    return response;
  } catch (error) {
    console.error('Get tasks error:', error);
    throw error;
  }
};

export const adminReviewTask = async (taskId, status) => {
  try {
    const response = await api.post(`/admin/tasks/${taskId}/review/`, {
      status,
    });
    return response;
  } catch (error) {
    console.error('Review task error:', error);
    throw error;
  }
};
