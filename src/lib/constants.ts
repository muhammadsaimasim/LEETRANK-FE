export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const BATCHES = ['2020', '2021', '2022', '2023', '2024', '2025', '2026'];

export const SORT_OPTIONS = [
  { value: 'totalSolved', label: 'Total Solved' },
  { value: 'easySolved', label: 'Easy Problems' },
  { value: 'mediumSolved', label: 'Medium Problems' },
  { value: 'hardSolved', label: 'Hard Problems' },
  { value: 'ranking', label: 'LeetCode Ranking' },
];

export const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
} as const;

export const ROUTES = {
  HOME: '/',
  LEADERBOARD: '/leaderboard',
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_OTP: '/verify-otp',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  ADMIN: '/admin',
} as const;
