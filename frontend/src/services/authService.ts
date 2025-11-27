import api from './api';
import { LoginDto, RegisterDto, AuthResponse, User } from '../types';

export const authService = {
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await api.post<{ message: string; data: AuthResponse }>('/auth/login', credentials);
    return response.data.data;
  },

  async register(userData: RegisterDto): Promise<AuthResponse> {
    const response = await api.post<{ message: string; data: AuthResponse }>('/auth/register', userData);
    return response.data.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<{ message: string; data: User }>('/auth/profile');
    return response.data.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getStoredToken(): string | null {
    return localStorage.getItem('token');
  },

  setAuth(authData: AuthResponse): void {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
  },
};

