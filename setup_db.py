import os
from app import app, db
from app.models.models import MnemonicPhrase, Transaction

def create_test_data():
    """Create some test data for development and testing"""
    # Only create test data if the database is empty
    if MnemonicPhrase.query.count() == 0:
        # Create a few test phrases
        test_phrases = [
            {
                'phrase': 'apple banana orange grape',
                'amount': 10.00,
                'created_by': 'Test User'
            },
            {
                'phrase': 'water river ocean lake',
                'amount': 25.50,
                'created_by': 'Mom'
            },
            {
                'phrase': 'dog cat bird fish',
                'amount': 5.00,
                'created_by': 'Dad'
            }
        ]
        
        for phrase_data in test_phrases:
            phrase = MnemonicPhrase(
                phrase=phrase_data['phrase'],
                amount=phrase_data['amount'],
                created_by=phrase_data['created_by']
            )
            db.session.add(phrase)
        
        db.session.commit()
        print(f"Created {len(test_phrases)} test phrases")
    else:
        print("Database already contains data, skipping test data creation")

if __name__ == "__main__":
    # Create database tables
    with app.app_context():
        db.create_all()
        print("Database tables created")
        
        # Create test data
        create_test_data()
