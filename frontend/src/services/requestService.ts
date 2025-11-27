import api from './api';
import { Request, CreateRequestDto, UpdateRequestDto } from '../types';

export const requestService = {
  async createRequest(data: CreateRequestDto): Promise<Request> {
    const response = await api.post<{ message: string; data: Request }>('/requests', data);
    return response.data.data;
  },

  async getRequest(id: number): Promise<Request> {
    const response = await api.get<{ message: string; data: Request }>(`/requests/${id}`);
    return response.data.data;
  },

  async getAllRequests(): Promise<Request[]> {
    const response = await api.get<{ message: string; data: Request[] }>('/requests');
    return response.data.data;
  },

  async getMyRequests(): Promise<Request[]> {
    const response = await api.get<{ message: string; data: Request[] }>('/requests/my-requests');
    return response.data.data;
  },

  async getAssignedRequests(): Promise<Request[]> {
    const response = await api.get<{ message: string; data: Request[] }>('/requests/assigned');
    return response.data.data;
  },

  async approveRequest(id: number): Promise<Request> {
    const response = await api.post<{ message: string; data: Request }>(`/requests/${id}/approve`);
    return response.data.data;
  },

  async rejectRequest(id: number): Promise<Request> {
    const response = await api.post<{ message: string; data: Request }>(`/requests/${id}/reject`);
    return response.data.data;
  },

  async updateRequest(id: number, data: UpdateRequestDto): Promise<Request> {
    const response = await api.put<{ message: string; data: Request }>(`/requests/${id}`, data);
    return response.data.data;
  },
};

