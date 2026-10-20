import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';
import { User, RoleName, AuthTokens } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  registerCustomer: (payload: { email: string; password: string; full_name: string; phone?: string }) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  hasRole: (role: RoleName) => boolean;
  hasAnyRole: (roles: RoleName[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('restaurantiq_token');
    const savedUser = localStorage.getItem('restaurantiq_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('restaurantiq_token');
        localStorage.removeItem('restaurantiq_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<AuthTokens>('/auth/login', { email, password });
      const { access_token, user: loggedUser } = response.data;

      localStorage.setItem('restaurantiq_token', access_token);
      localStorage.setItem('restaurantiq_user', JSON.stringify(loggedUser));

      setToken(access_token);
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const registerCustomer = async (payload: { email: string; password: string; full_name: string; phone?: string }): Promise<User> => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<AuthTokens>('/auth/customer/register', payload);
      const { access_token, user: loggedUser } = response.data;

      localStorage.setItem('restaurantiq_token', access_token);
      localStorage.setItem('restaurantiq_user', JSON.stringify(loggedUser));

      setToken(access_token);
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('restaurantiq_token');
    localStorage.removeItem('restaurantiq_user');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  const refreshUser = async () => {
    try {
      const response = await apiClient.get<User>('/auth/me');
      setUser(response.data);
      localStorage.setItem('restaurantiq_user', JSON.stringify(response.data));
    } catch (e) {
      console.error('Failed to refresh user profile:', e);
    }
  };

  const hasRole = (role: RoleName): boolean => {
    if (!user) return false;
    if (user.is_superuser) return true;
    return user.role?.name === role;
  };

  const hasAnyRole = (roles: RoleName[]): boolean => {
    if (!user) return false;
    if (user.is_superuser) return true;
    return roles.includes(user.role?.name as RoleName);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        registerCustomer,
        logout,
        refreshUser,
        hasRole,
        hasAnyRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
