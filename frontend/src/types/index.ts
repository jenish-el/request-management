export enum UserRole {
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
}

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_PROGRESS = 'in_progress',
  CLOSED = 'closed',
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  manager_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface Request {
  id: number;
  title: string;
  description: string;
  created_by: number;
  assigned_to: number;
  status: RequestStatus;
  manager_approval: boolean | null;
  manager_id: number | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  manager_id?: number | null;
}

export interface CreateRequestDto {
  title: string;
  description: string;
  assigned_to: number;
}

export interface UpdateRequestDto {
  title?: string;
  description?: string;
  status?: RequestStatus;
}

export interface AuthResponse {
  user: User;
  token: string;
}

