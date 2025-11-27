import api from './api';
import { User } from '../types';

export const userService = {
  async getAllUsers(): Promise<User[]> {
    // Note: This endpoint might not exist in the backend, but we can add it if needed
    // For now, we'll use the profile endpoint
    const response = await api.get<{ message: string; data: User[] }>('/users');
    return response.data.data;
  },
};

