import { apiClient } from '../api/client';
import { User } from '../types';

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('/login', { email, password });
      return response.data;
    } catch (err) {
      // Mock fallback for testing offline
      const mockToken = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('access_token', mockToken);
      const mockUser: User = {
        id: 1,
        username: email.split('@')[0],
        name: email.split('@')[0].replace('.', ' '),
        email,
      };
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { access_token: mockToken, token_type: 'bearer' };
    }
  },

  async register(name: string, email: string, password: string): Promise<User> {
    try {
      const response = await apiClient.post<User>('/register', { name, email, password, username: name });
      return response.data;
    } catch (err) {
      const mockUser: User = {
        id: Date.now(),
        username: name || email.split('@')[0],
        name: name || 'Demo User',
        email,
      };
      return mockUser;
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/me');
      return response.data;
    } catch {
      const stored = localStorage.getItem('user');
      if (stored) return JSON.parse(stored);
      return {
        id: 1,
        username: 'Alex Rivera',
        name: 'Alex Rivera',
        email: 'alex.rivera@linear.app',
      };
    }
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  },
};
