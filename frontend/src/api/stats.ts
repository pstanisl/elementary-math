import api from './client';
import { UserStats } from '@/types';

export async function getUserStats(userId: number): Promise<UserStats> {
  const response = await api.get<UserStats>(`/stats/${userId}`);
  return response.data;
}
