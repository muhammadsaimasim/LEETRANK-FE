import { BASE_URL } from '../Environment/env.js';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleUnauthorized = (response) => {
  if (response.status === 401) {
    localStorage.removeItem('token');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
};

const parseJson = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return null;
};

const request = async (path, options = {}) => {
  const response = await fetch(`${BASE_URL}${path}`, options);
  handleUnauthorized(response);
  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data?.message || 'Request failed');
  }
  return data;
};

const transformUser = (user) => {
  if (!user) return null;
  return {
    id: user._id || user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    rollno: user.rollno,
    programme: user.programme,
    leetcodeUsername: user.leetcodeUsername,
    leetcodeProfileURL: user.leetcodeProfileURL,
    batch: user.batch,
    department: user.department,
    stats: user.stats
      ? {
          totalSolved: user.stats.totalSolved || 0,
          easySolved: user.stats.easy ?? user.stats.easySolved ?? 0,
          mediumSolved: user.stats.medium ?? user.stats.mediumSolved ?? 0,
          hardSolved: user.stats.hard ?? user.stats.hardSolved ?? 0,
          ranking: user.stats.ranking || 0,
          avatar: user.stats.avatar || '',
          lastSynced: user.stats.lastUpdated || user.stats.lastSynced,
        }
      : undefined,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const userApi = {
  getProfile: async () => {
    const res = await request('/user/profile/me', { method: 'GET', headers: { ...getAuthHeaders() } });
    return transformUser(res.user);
  },

  getUserById: async (id) => {
    const res = await request(`/user/${id}`, { method: 'GET', headers: { ...getAuthHeaders() } });
    return transformUser(res.user);
  },

  updateProfile: async (data) => {
    const res = await request('/user/profile/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    });
    return transformUser(res.user);
  },

  updateLeetcode: async (data) => {
    const res = await request('/user/leetcode/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(data),
    });
    return transformUser(res.user);
  },

  syncStats: async () => {
    const res = await request('/user/stats/sync', {
      method: 'POST',
      headers: { ...getAuthHeaders() },
    });
    return res.stats
      ? {
          totalSolved: res.stats.totalSolved || 0,
          easySolved: res.stats.easy ?? res.stats.easySolved ?? 0,
          mediumSolved: res.stats.medium ?? res.stats.mediumSolved ?? 0,
          hardSolved: res.stats.hard ?? res.stats.hardSolved ?? 0,
          ranking: res.stats.ranking || 0,
          lastSynced: res.stats.lastUpdated || res.stats.lastSynced,
        }
      : null;
  },

  deleteAccount: (password) =>
    request('/user/account/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ password }),
    }),

  // Admin endpoints
  getAllUsers: async (params = {}) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      search.set(key, String(value));
    });
    const query = search.toString();
    const res = await request(`/user${query ? `?${query}` : ''}`, {
      method: 'GET',
      headers: { ...getAuthHeaders() },
    });
    return {
      data: (res.users || []).map(transformUser),
      total: res.pagination?.total || 0,
      page: res.pagination?.page || 1,
      limit: res.pagination?.limit || 50,
      totalPages: res.pagination?.pages || 1,
    };
  },

  deleteUser: (id) =>
    request(`/user/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeaders() },
    }),

  updateUserRole: async (id, role) => {
    const res = await request(`/user/${id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ role }),
    });
    return transformUser(res.user);
  },
};
