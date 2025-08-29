from faker import Faker
from extensions import db
from models.models import User
from app import create_app

fake = Faker()

def run_seed():
    app = create_app()
    with app.app_context():
        # idempotent small seed
        if not User.query.filter_by(username="demo").first():
            u = User(username="demo")
            u.password = "password123"  # uses write-only setter
            db.session.add(u)
        for i in range(3):
            uname = f"user{i+1}"
            if not User.query.filter_by(username=uname).first():
                u = User(username=uname)
                u.password = "secret123"
                db.session.add(u)
        db.session.commit()
        print("Seed complete.")

if __name__ == "__main__":
    run_seed()
