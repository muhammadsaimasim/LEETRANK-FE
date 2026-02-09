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

export const authApi = {
  register: async (data) => {
    const res = await request('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return { token: res.token, user: transformUser(res.user) };
  },

  login: async (email, password) => {
    const res = await request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return { token: res.token, user: transformUser(res.user) };
  },

  verify: async () => {
    const res = await request('/auth/verify', {
      method: 'GET',
      headers: { ...getAuthHeaders() },
    });
    return transformUser(res.user);
  },

  changePassword: (currentPassword, newPassword) =>
    request('/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  // OTP endpoints (all under /auth now)
  sendSignupOTP: (data) =>
    request('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  verifySignupOTP: async (email, otp) => {
    const res = await request('/auth/signup-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    return { token: res.token, user: transformUser(res.user) };
  },

  sendForgotPasswordOTP: (email) =>
    request('/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }),

  resetPassword: (email, otp, newPassword) =>
    request('/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword }),
    }),

  resendOTP: (email, type) =>
    request('/auth/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, type }),
    }),
};
