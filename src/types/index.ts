export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'moderator' | 'admin';
  leetcodeUsername: string;
  leetcodeProfileURL: string;
  batch: string;
  department?: string;
  stats?: UserStats;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  avatar?: string;
  lastSynced?: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  leetcodeUsername: string;
  leetcodeProfileURL: string;
  batch: string;
  department?: string;
  stats: UserStats;
}

export interface LeaderboardFilters {
  batch?: string;
  department?: string;
  sortBy?: string;
  search?: string;
  limit?: number;
  page?: number;
}

export interface LeaderboardStats {
  totalUsers: number;
  totalProblemsSolved: number;
  averageProblems: number;
  topPerformer?: {
    name: string;
    totalSolved: number;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
