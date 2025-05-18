from app import db
from app.models.models import MnemonicPhrase, Transaction

def init_db():
    """Initialize the database and create tables"""
    db.create_all()
    print("Database tables created successfully.")

def reset_db():
    """Drop all tables and recreate them"""
    db.drop_all()
    db.create_all()
    print("Database reset successfully.")

if __name__ == "__main__":
    init_db()
