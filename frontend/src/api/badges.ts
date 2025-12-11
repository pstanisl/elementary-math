import api from './client';
import { Badge, BadgeType } from '@/types';

export async function getUserBadges(userId: number): Promise<Badge[]> {
  const response = await api.get<Badge[]>(`/badges/${userId}`);
  return response.data;
}

export async function awardBadge(userId: number, badgeType: BadgeType): Promise<Badge> {
  const response = await api.post<Badge>('/badges', {
    user_id: userId,
    badge_type: badgeType,
  });
  return response.data;
}
