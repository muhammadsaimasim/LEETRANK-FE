import { BASE_URL } from '../Environment/env.js';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
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
  const data = await parseJson(response);
  if (!response.ok) {
    throw new Error(data?.message || 'Request failed');
  }
  return data;
};

export const settingsApi = {
  getLeaderboardColumns: async () => {
    const res = await request('/settings/leaderboard-columns');
    return res.columns;
  },

  updateLeaderboardColumns: async (columns) => {
    const res = await request('/settings/leaderboard-columns', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ columns }),
    });
    return res.columns;
  },
};
