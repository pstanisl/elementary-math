from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Badge, User
from app.schemas import BadgeCreate, BadgeResponse

router = APIRouter()


@router.get("/{user_id}", response_model=list[BadgeResponse])
def get_user_badges(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return db.query(Badge).filter(Badge.user_id == user_id).all()


@router.post("", response_model=BadgeResponse)
def award_badge(badge: BadgeCreate, db: Session = Depends(get_db)):
    # Check if badge already exists
    existing = (
        db.query(Badge)
        .filter(Badge.user_id == badge.user_id, Badge.badge_type == badge.badge_type)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="Badge already awarded")

    db_badge = Badge(user_id=badge.user_id, badge_type=badge.badge_type)
    db.add(db_badge)
    db.commit()
    db.refresh(db_badge)
    return db_badge
