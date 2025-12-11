import api from './client';
import { User, UserRole } from '@/types';

export interface UserCreate {
  name: string;
  role: UserRole;
  avatar_color?: string;
}

export async function getUsers(): Promise<User[]> {
  const response = await api.get<User[]>('/users');
  return response.data;
}

export async function createUser(data: UserCreate): Promise<User> {
  const response = await api.post<User>('/users', data);
  return response.data;
}

export async function getUser(id: number): Promise<User> {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`);
}
