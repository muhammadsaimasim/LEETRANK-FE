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

const withParams = (path, params = {}) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    search.set(key, String(value));
  });
  const query = search.toString();
  return `${path}${query ? `?${query}` : ''}`;
};

const transformLeaderboardUser = (user) => {
  if (!user) return null;
  return {
    id: user._id || user.id,
    rank: 0,
    name: user.name,
    rollno: user.rollno,
    programme: user.programme,
    leetcodeUsername: user.leetcodeUsername,
    leetcodeProfileURL: user.leetcodeProfileURL,
    batch: user.batch,
    department: user.department,
    stats: {
      totalSolved: user.stats?.totalSolved || 0,
      easySolved: user.stats?.easy ?? user.stats?.easySolved ?? 0,
      mediumSolved: user.stats?.medium ?? user.stats?.mediumSolved ?? 0,
      hardSolved: user.stats?.hard ?? user.stats?.hardSolved ?? 0,
      ranking: user.stats?.ranking || 0,
      avatar: user.stats?.avatar || '',
      lastSynced: user.stats?.lastUpdated || user.stats?.lastSynced,
    },
  };
};

export const leaderboardApi = {
  getLeaderboard: async (filters = {}) => {
    const res = await request(withParams('/leaderboard', filters), {
      method: 'GET',
      headers: { ...getAuthHeaders() },
    });
    const users = res.leaderboard || [];
    return users.map((u, i) => ({ ...transformLeaderboardUser(u), rank: i + 1 }));
  },

  getTopPerformers: async (limit = 10) => {
    const res = await request(withParams('/leaderboard/top', { limit }), {
      method: 'GET',
      headers: { ...getAuthHeaders() },
    });
    const users = res.topPerformers || [];
    return users.map((u, i) => ({ ...transformLeaderboardUser(u), rank: i + 1 }));
  },

  getStats: async () => {
    const res = await request('/leaderboard/stats/overview', {
      method: 'GET',
      headers: { ...getAuthHeaders() },
    });
    return {
      totalUsers: res.totalUsers || 0,
      totalProblemsSolved: res.averageStats?.avgTotal
        ? Math.round(res.averageStats.avgTotal * (res.totalUsers || 0))
        : 0,
      averageProblems: Math.round(res.averageStats?.avgTotal || 0),
      topPerformer: res.topUser
        ? {
            id: res.topUser._id || res.topUser.id,
            name: res.topUser.name,
            totalSolved: res.topUser.stats?.totalSolved || 0,
          }
        : undefined,
    };
  },

  updateAllStats: () =>
    request('/leaderboard/update-all', {
      method: 'POST',
      headers: { ...getAuthHeaders() },
    }),
};
