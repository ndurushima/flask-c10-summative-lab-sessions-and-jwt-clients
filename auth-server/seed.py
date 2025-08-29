from faker import Faker
from extensions import db
from models.models import User, Note
from app import create_app

fake = Faker()

def run_seed():
    app = create_app()
    with app.app_context():
        # Seed users
        users = []
        if not User.query.filter_by(username="demo").first():
            u = User(username="demo")
            u.password = "password123"
            db.session.add(u)
            users.append(u)
        for i in range(1, 3 + 1):
            uname = f"user{i}"
            existing = User.query.filter_by(username=uname).first()
            if not existing:
                u = User(username=uname)
                u.password = "secret123"
                db.session.add(u)
                users.append(u)
            else:
                users.append(existing)
        db.session.commit()

        # Seed notes for each user
        for u in users:
            # 3 notes each
            for _ in range(3):
                n = Note(
                    title=fake.sentence(nb_words=5),
                    content=fake.paragraph(nb_sentences=3),
                    user_id=u.id,
                )
                db.session.add(n)
        db.session.commit()
        print("Seed complete.")

if __name__ == "__main__":
    run_seed()
