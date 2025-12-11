from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Exercise, Badge, BadgeType, Topic
from app.schemas import ExerciseCreate, ExerciseResponse

router = APIRouter()


def check_and_award_badges(user_id: int, db: Session) -> list[BadgeType]:
    """Check badge conditions and award new badges. Returns list of newly awarded badges."""
    newly_awarded = []
    existing_badges = {b.badge_type for b in db.query(Badge).filter(Badge.user_id == user_id).all()}

    # First Steps: 1+ exercise
    if BadgeType.first_steps not in existing_badges:
        count = db.query(Exercise).filter(Exercise.user_id == user_id).count()
        if count >= 1:
            db.add(Badge(user_id=user_id, badge_type=BadgeType.first_steps))
            newly_awarded.append(BadgeType.first_steps)

    # Topic masters: 20 correct per topic
    topic_badges = {
        Topic.addition: BadgeType.addition_master,
        Topic.subtraction: BadgeType.subtraction_master,
        Topic.multiplication: BadgeType.multiplier,
        Topic.division: BadgeType.divider,
        Topic.rounding: BadgeType.rounder,
    }
    for topic, badge_type in topic_badges.items():
        if badge_type not in existing_badges:
            correct_count = (
                db.query(Exercise)
                .filter(Exercise.user_id == user_id, Exercise.topic == topic, Exercise.is_correct == True)
                .count()
            )
            if correct_count >= 20:
                db.add(Badge(user_id=user_id, badge_type=badge_type))
                newly_awarded.append(badge_type)

    # Flawless: 10 in a row correct
    if BadgeType.flawless not in existing_badges:
        recent = (
            db.query(Exercise)
            .filter(Exercise.user_id == user_id)
            .order_by(Exercise.created_at.desc())
            .limit(10)
            .all()
        )
        if len(recent) >= 10 and all(e.is_correct for e in recent):
            db.add(Badge(user_id=user_id, badge_type=BadgeType.flawless))
            newly_awarded.append(BadgeType.flawless)

    # Century: 100 correct total
    if BadgeType.century not in existing_badges:
        total_correct = (
            db.query(Exercise).filter(Exercise.user_id == user_id, Exercise.is_correct == True).count()
        )
        if total_correct >= 100:
            db.add(Badge(user_id=user_id, badge_type=BadgeType.century))
            newly_awarded.append(BadgeType.century)

    # Weekly streak: 7 distinct days
    if BadgeType.weekly_streak not in existing_badges:
        from sqlalchemy import func, distinct
        from datetime import datetime, timedelta

        week_ago = datetime.utcnow() - timedelta(days=7)
        distinct_days = (
            db.query(func.date(Exercise.created_at))
            .filter(Exercise.user_id == user_id, Exercise.created_at >= week_ago)
            .distinct()
            .count()
        )
        if distinct_days >= 7:
            db.add(Badge(user_id=user_id, badge_type=BadgeType.weekly_streak))
            newly_awarded.append(BadgeType.weekly_streak)

    if newly_awarded:
        db.commit()

    return newly_awarded


@router.post("", response_model=dict)
def create_exercise(exercise: ExerciseCreate, db: Session = Depends(get_db)):
    db_exercise = Exercise(
        user_id=exercise.user_id,
        topic=exercise.topic,
        difficulty=exercise.difficulty,
        problem=exercise.problem,
        user_answer=exercise.user_answer,
        correct_answer=exercise.correct_answer,
        is_correct=exercise.is_correct,
        error_type=exercise.error_type,
        time_spent_seconds=exercise.time_spent_seconds,
    )
    db.add(db_exercise)
    db.commit()
    db.refresh(db_exercise)

    # Check for new badges
    new_badges = check_and_award_badges(exercise.user_id, db)

    return {
        "exercise": ExerciseResponse.model_validate(db_exercise),
        "new_badges": new_badges,
    }


@router.get("/{user_id}", response_model=list[ExerciseResponse])
def get_user_exercises(user_id: int, limit: int = 50, offset: int = 0, db: Session = Depends(get_db)):
    return (
        db.query(Exercise)
        .filter(Exercise.user_id == user_id)
        .order_by(Exercise.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


@router.get("/{user_id}/recent", response_model=list[ExerciseResponse])
def get_recent_exercises(user_id: int, db: Session = Depends(get_db)):
    return (
        db.query(Exercise)
        .filter(Exercise.user_id == user_id)
        .order_by(Exercise.created_at.desc())
        .limit(10)
        .all()
    )
