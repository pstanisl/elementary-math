import api from './client';
import { Exercise, Topic, ErrorType, BadgeType } from '@/types';

export interface ExerciseCreate {
  user_id: number;
  topic: Topic;
  difficulty: number;
  problem: {
    operand1: number;
    operand2: number;
    operator: string;
    notation: 'inline' | 'column';
    roundingTarget?: number;
  };
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  error_type?: ErrorType;
  time_spent_seconds?: number;
}

export interface ExerciseResponse {
  exercise: Exercise;
  new_badges: BadgeType[];
}

export async function saveExercise(data: ExerciseCreate): Promise<ExerciseResponse> {
  const response = await api.post<ExerciseResponse>('/exercises', data);
  return response.data;
}

export async function getUserExercises(userId: number, limit = 50, offset = 0): Promise<Exercise[]> {
  const response = await api.get<Exercise[]>(`/exercises/${userId}`, {
    params: { limit, offset },
  });
  return response.data;
}

export async function getRecentExercises(userId: number): Promise<Exercise[]> {
  const response = await api.get<Exercise[]>(`/exercises/${userId}/recent`);
  return response.data;
}
