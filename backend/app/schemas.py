from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.models import UserRole, Topic, BadgeType, ErrorType


# User schemas
class UserCreate(BaseModel):
    name: str
    role: UserRole
    avatar_color: Optional[str] = "#4A90D9"


class UserResponse(BaseModel):
    id: int
    name: str
    role: UserRole
    avatar_color: str
    created_at: datetime

    class Config:
        from_attributes = True


# Exercise schemas
class ExerciseCreate(BaseModel):
    user_id: int
    topic: Topic
    difficulty: int
    problem: dict
    user_answer: str
    correct_answer: str
    is_correct: bool
    error_type: Optional[ErrorType] = None
    time_spent_seconds: Optional[int] = None


class ExerciseResponse(BaseModel):
    id: int
    user_id: int
    topic: Topic
    difficulty: int
    problem: dict
    user_answer: str
    correct_answer: str
    is_correct: bool
    error_type: Optional[ErrorType]
    time_spent_seconds: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


# Badge schemas
class BadgeCreate(BaseModel):
    user_id: int
    badge_type: BadgeType


class BadgeResponse(BaseModel):
    id: int
    user_id: int
    badge_type: BadgeType
    earned_at: datetime

    class Config:
        from_attributes = True


# Stats schemas
class TopicStats(BaseModel):
    topic: Topic
    total_attempts: int
    correct_count: int
    accuracy_percentage: float
    common_errors: list[ErrorType]


class UserStats(BaseModel):
    user_id: int
    total_exercises: int
    correct_exercises: int
    overall_accuracy: float
    days_practiced_this_week: int
    current_streak: int
    topic_stats: list[TopicStats]
    recent_activity: list[ExerciseResponse]
