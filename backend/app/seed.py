from app.database import SessionLocal
from app.models import User, UserRole


def seed_database():
    """Create initial users if none exist."""
    db = SessionLocal()
    try:
        if db.query(User).count() == 0:
            # Create parent user
            parent = User(
                name="Rodič",
                role=UserRole.parent,
                avatar_color="#6B7280",
            )
            db.add(parent)

            # Create child user
            child = User(
                name="Ema",
                role=UserRole.child,
                avatar_color="#4A90D9",
            )
            db.add(child)

            db.commit()
            print("Seeded database with initial users")
        else:
            print("Database already has users, skipping seed")
    finally:
        db.close()


if __name__ == "__main__":
    from app.database import init_db

    init_db()
    seed_database()
