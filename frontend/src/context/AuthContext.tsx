import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthState } from '../types';
import { authService } from '../services/authService';
import { toast } from 'sonner';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('access_token'),
    isAuthenticated: !!localStorage.getItem('access_token'),
    isLoading: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const user = await authService.getCurrentUser();
          setState({ user, token, isAuthenticated: true, isLoading: false });
        } catch {
          setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await authService.login(email, password);
      localStorage.setItem('access_token', res.access_token);
      const user = await authService.getCurrentUser();
      setState({ user, token: res.access_token, isAuthenticated: true, isLoading: false });
      toast.success('Welcome back to TaskFlow!');
      return true;
    } catch {
      toast.error('Invalid email or password');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      await authService.register(name, email, password);
      toast.success('Account created successfully! Please sign in.');
      return true;
    } catch {
      toast.error('Registration failed. Please check details.');
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
    toast.info('Logged out');
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
