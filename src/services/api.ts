import axios, { AxiosError, AxiosInstance } from 'axios';
import { API_BASE_URL } from '@/lib/constants';
import type {
  User,
  AuthResponse,
  LeaderboardEntry,
  LeaderboardFilters,
  LeaderboardStats,
  PaginatedResponse,
} from '@/types';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    leetcodeUsername: string;
    leetcodeProfileURL: string;
    batch: string;
    department?: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  verify: async (): Promise<User> => {
    const response = await api.get('/auth/verify');
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.post('/auth/change-password', { currentPassword, newPassword });
  },
};

// User endpoints
export const userApi = {
  getProfile: async (): Promise<User> => {
    const response = await api.get('/users/profile/me');
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateProfile: async (data: { name?: string; batch?: string; department?: string }): Promise<User> => {
    const response = await api.put('/users/profile/update', data);
    return response.data;
  },

  updateLeetcode: async (data: { leetcodeUsername?: string; leetcodeProfileURL?: string }): Promise<User> => {
    const response = await api.put('/users/leetcode/update', data);
    return response.data;
  },

  syncStats: async (): Promise<User> => {
    const response = await api.post('/users/stats/sync');
    return response.data;
  },

  deleteAccount: async (password: string): Promise<void> => {
    await api.delete('/users/account/delete', { data: { password } });
  },

  // Admin endpoints
  getAllUsers: async (params?: {
    page?: number;
    limit?: number;
    batch?: string;
    department?: string;
    role?: string;
  }): Promise<PaginatedResponse<User>> => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  updateUserRole: async (id: string, role: string): Promise<User> => {
    const response = await api.put(`/users/${id}/role`, { role });
    return response.data;
  },
};

// Leaderboard endpoints
export const leaderboardApi = {
  getLeaderboard: async (filters?: LeaderboardFilters): Promise<LeaderboardEntry[]> => {
    const response = await api.get('/leaderboard', { params: filters });
    return response.data;
  },

  getTopPerformers: async (limit = 10): Promise<LeaderboardEntry[]> => {
    const response = await api.get('/leaderboard/top', { params: { limit } });
    return response.data;
  },

  getStats: async (): Promise<LeaderboardStats> => {
    const response = await api.get('/leaderboard/stats/overview');
    return response.data;
  },

  updateAllStats: async (): Promise<void> => {
    await api.post('/leaderboard/update-all');
  },
};

export default api;
