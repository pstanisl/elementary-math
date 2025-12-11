from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class UserRole(str, PyEnum):
    parent = "parent"
    child = "child"


class Topic(str, PyEnum):
    addition = "addition"
    subtraction = "subtraction"
    multiplication = "multiplication"
    division = "division"
    rounding = "rounding"


class BadgeType(str, PyEnum):
    first_steps = "first_steps"
    addition_master = "addition_master"
    subtraction_master = "subtraction_master"
    multiplier = "multiplier"
    divider = "divider"
    rounder = "rounder"
    flawless = "flawless"
    weekly_streak = "weekly_streak"
    century = "century"


class ErrorType(str, PyEnum):
    carry_error = "carry_error"
    borrow_error = "borrow_error"
    place_value_error = "place_value_error"
    calculation_error = "calculation_error"
    rounding_direction_error = "rounding_direction_error"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    avatar_color = Column(String(7), default="#4A90D9")
    created_at = Column(DateTime, default=datetime.utcnow)

    exercises = relationship("Exercise", back_populates="user", cascade="all, delete-orphan")
    badges = relationship("Badge", back_populates="user", cascade="all, delete-orphan")


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    topic = Column(Enum(Topic), nullable=False)
    difficulty = Column(Integer, nullable=False)
    problem = Column(JSON, nullable=False)
    user_answer = Column(String(50), nullable=False)
    correct_answer = Column(String(50), nullable=False)
    is_correct = Column(Boolean, nullable=False)
    error_type = Column(Enum(ErrorType), nullable=True)
    time_spent_seconds = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="exercises")


class Badge(Base):
    __tablename__ = "badges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    badge_type = Column(Enum(BadgeType), nullable=False)
    earned_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="badges")
