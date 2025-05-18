from app import db
from datetime import datetime
import secrets

class MnemonicPhrase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    phrase = db.Column(db.String(100), unique=True, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='unredeemed')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    redeemed_at = db.Column(db.DateTime, nullable=True)
    created_by = db.Column(db.String(100), nullable=True)  # Optional creator identifier
    share_token = db.Column(db.String(64), unique=True, nullable=False)
    
    def __init__(self, phrase, amount, created_by=None):
        self.phrase = phrase
        self.amount = amount
        self.created_by = created_by
        self.share_token = secrets.token_urlsafe(32)
    
    def redeem(self):
        if self.status == 'unredeemed':
            self.status = 'redeemed'
            self.redeemed_at = datetime.utcnow()
            return True
        return False
    
    def __repr__(self):
        return f'<MnemonicPhrase {self.phrase}>'


class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    mnemonic_id = db.Column(db.Integer, db.ForeignKey('mnemonic_phrase.id'), nullable=False)
    recipient_name = db.Column(db.String(100), nullable=True)
    recipient_card_last4 = db.Column(db.String(4), nullable=True)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')
    payment_provider = db.Column(db.String(20), default='stripe')
    payment_id = db.Column(db.String(100), nullable=True)  # External payment ID
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    mnemonic = db.relationship('MnemonicPhrase', backref=db.backref('transactions', lazy=True))
    
    def complete(self, payment_id):
        self.status = 'completed'
        self.payment_id = payment_id
        self.completed_at = datetime.utcnow()
        
    def fail(self, reason=None):
        self.status = 'failed'
        self.payment_id = reason if reason else 'Unknown error'
        
    def __repr__(self):
        return f'<Transaction {self.id} - {self.status}>'
