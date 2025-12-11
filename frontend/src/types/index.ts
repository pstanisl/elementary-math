export type UserRole = 'parent' | 'child';

export type Topic = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'rounding';

export type BadgeType =
  | 'first_steps'
  | 'addition_master'
  | 'subtraction_master'
  | 'multiplier'
  | 'divider'
  | 'rounder'
  | 'flawless'
  | 'weekly_streak'
  | 'century';

export type ErrorType =
  | 'carry_error'
  | 'borrow_error'
  | 'place_value_error'
  | 'calculation_error'
  | 'rounding_direction_error';

export interface User {
  id: number;
  name: string;
  role: UserRole;
  avatar_color: string;
  created_at: string;
}

export interface ProblemData {
  operand1: number;
  operand2: number;
  operator: string;
  notation: 'inline' | 'column';
  roundingTarget?: number;
}

export interface Exercise {
  id: number;
  user_id: number;
  topic: Topic;
  difficulty: number;
  problem: ProblemData;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  error_type?: ErrorType;
  time_spent_seconds?: number;
  created_at: string;
}

export interface Badge {
  id: number;
  user_id: number;
  badge_type: BadgeType;
  earned_at: string;
}

export interface TopicStats {
  topic: Topic;
  total_attempts: number;
  correct_count: number;
  accuracy_percentage: number;
  common_errors: ErrorType[];
}

export interface UserStats {
  user_id: number;
  total_exercises: number;
  correct_exercises: number;
  overall_accuracy: number;
  days_practiced_this_week: number;
  current_streak: number;
  topic_stats: TopicStats[];
  recent_activity: Exercise[];
}

export interface GeneratedProblem {
  operand1: number;
  operand2: number;
  operator: string;
  correctAnswer: number;
  notation: 'inline' | 'column';
  roundingTarget?: number;
}

// Czech translations
export const topicNames: Record<Topic, string> = {
  addition: 'Sčítání',
  subtraction: 'Odčítání',
  multiplication: 'Násobení',
  division: 'Dělení',
  rounding: 'Zaokrouhlování',
};

export const topicIcons: Record<Topic, string> = {
  addition: '+',
  subtraction: '−',
  multiplication: '×',
  division: '÷',
  rounding: '≈',
};

export const badgeInfo: Record<BadgeType, { name: string; icon: string; description: string }> = {
  first_steps: {
    name: 'První kroky',
    icon: '🎯',
    description: 'Dokončil/a jsi první příklad!',
  },
  addition_master: {
    name: 'Sčítací mistr',
    icon: '➕',
    description: '20 správných příkladů na sčítání',
  },
  subtraction_master: {
    name: 'Odčítací mistr',
    icon: '➖',
    description: '20 správných příkladů na odčítání',
  },
  multiplier: {
    name: 'Násobitel',
    icon: '✖️',
    description: '20 správných příkladů na násobení',
  },
  divider: {
    name: 'Dělitel',
    icon: '➗',
    description: '20 správných příkladů na dělení',
  },
  rounder: {
    name: 'Zaokrouhlovač',
    icon: '🔄',
    description: '20 správných příkladů na zaokrouhlování',
  },
  flawless: {
    name: 'Bez chybičky',
    icon: '⭐',
    description: '10 příkladů v řadě bez chyby',
  },
  weekly_streak: {
    name: 'Týdenní série',
    icon: '🔥',
    description: 'Procvičování 7 dní v řadě',
  },
  century: {
    name: 'Stovka',
    icon: '💯',
    description: '100 vyřešených příkladů',
  },
};

export const errorMessages: Record<ErrorType, string> = {
  carry_error: 'Zkontroluj si přenos - nezapomněl/a jsi přičíst jedničku?',
  borrow_error: 'Zkontroluj si půjčování - nezapomněl/a jsi odečíst jedničku?',
  place_value_error: 'Zkontroluj si jednotlivé sloupce - pozice číslic jsou důležité!',
  calculation_error: 'Zkus si výpočet projít znovu krok po kroku.',
  rounding_direction_error: 'Pamatuj: 0-4 dolů, 5-9 nahoru!',
};
