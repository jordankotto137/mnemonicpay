from app import db
from app.models.models import MnemonicPhrase, Transaction

def init_db():
    """Initialize the database by creating all tables"""
    db.create_all()
    print("Database initialized successfully.")

if __name__ == "__main__":
    init_db()
