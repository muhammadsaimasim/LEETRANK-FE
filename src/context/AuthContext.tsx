import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi, userApi } from '@/services/api';
import type { User } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    leetcodeUsername: string;
    leetcodeProfileURL: string;
    batch: string;
    department?: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  const verifyToken = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = await authApi.verify();
      setUser(userData);
    } catch (error) {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    localStorage.setItem('token', response.token);
    setToken(response.token);
    setUser(response.user);
    toast.success('Welcome back!');
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    leetcodeUsername: string;
    leetcodeProfileURL: string;
    batch: string;
    department?: string;
  }) => {
    const response = await authApi.register(data);
    localStorage.setItem('token', response.token);
    setToken(response.token);
    setUser(response.user);
    toast.success('Account created successfully!');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const refreshUser = async () => {
    try {
      const userData = await userApi.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user data');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
