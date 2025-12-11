from datetime import datetime, timedelta
from collections import Counter
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Exercise, User, Topic, ErrorType
from app.schemas import UserStats, TopicStats, ExerciseResponse

router = APIRouter()


@router.get("/{user_id}", response_model=UserStats)
def get_user_stats(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Total exercises
    total_exercises = db.query(Exercise).filter(Exercise.user_id == user_id).count()
    correct_exercises = (
        db.query(Exercise).filter(Exercise.user_id == user_id, Exercise.is_correct == True).count()
    )
    overall_accuracy = (correct_exercises / total_exercises * 100) if total_exercises > 0 else 0

    # Days practiced this week
    week_ago = datetime.utcnow() - timedelta(days=7)
    days_practiced = (
        db.query(func.date(Exercise.created_at))
        .filter(Exercise.user_id == user_id, Exercise.created_at >= week_ago)
        .distinct()
        .count()
    )

    # Current streak (consecutive days)
    current_streak = calculate_streak(user_id, db)

    # Topic stats
    topic_stats = []
    for topic in Topic:
        topic_exercises = db.query(Exercise).filter(Exercise.user_id == user_id, Exercise.topic == topic)
        topic_total = topic_exercises.count()
        topic_correct = topic_exercises.filter(Exercise.is_correct == True).count()
        topic_accuracy = (topic_correct / topic_total * 100) if topic_total > 0 else 0

        # Common errors for this topic
        error_counts = Counter(
            e.error_type
            for e in topic_exercises.filter(Exercise.error_type != None).all()
            if e.error_type
        )
        common_errors = [err for err, _ in error_counts.most_common(3)]

        topic_stats.append(
            TopicStats(
                topic=topic,
                total_attempts=topic_total,
                correct_count=topic_correct,
                accuracy_percentage=round(topic_accuracy, 1),
                common_errors=common_errors,
            )
        )

    # Recent activity
    recent = (
        db.query(Exercise)
        .filter(Exercise.user_id == user_id)
        .order_by(Exercise.created_at.desc())
        .limit(20)
        .all()
    )

    return UserStats(
        user_id=user_id,
        total_exercises=total_exercises,
        correct_exercises=correct_exercises,
        overall_accuracy=round(overall_accuracy, 1),
        days_practiced_this_week=days_practiced,
        current_streak=current_streak,
        topic_stats=topic_stats,
        recent_activity=[ExerciseResponse.model_validate(e) for e in recent],
    )


def calculate_streak(user_id: int, db: Session) -> int:
    """Calculate consecutive days of practice ending today or yesterday."""
    dates = (
        db.query(func.date(Exercise.created_at).label("date"))
        .filter(Exercise.user_id == user_id)
        .distinct()
        .order_by(func.date(Exercise.created_at).desc())
        .all()
    )

    if not dates:
        return 0

    streak = 0
    today = datetime.utcnow().date()
    expected_date = today

    for (practice_date,) in dates:
        if isinstance(practice_date, str):
            practice_date = datetime.strptime(practice_date, "%Y-%m-%d").date()

        # Allow streak to start from today or yesterday
        if streak == 0 and practice_date == today - timedelta(days=1):
            expected_date = today - timedelta(days=1)

        if practice_date == expected_date:
            streak += 1
            expected_date -= timedelta(days=1)
        elif practice_date < expected_date:
            break

    return streak
