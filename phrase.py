from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, current_app, abort
from app.models.models import MnemonicPhrase, db
from app.models.mnemonic_generator import MnemonicGenerator
from app.utils.security import rate_limit, validate_phrase, validate_amount, csrf_protect
import os

# Initialize blueprint
phrase_bp = Blueprint('phrase', __name__, url_prefix='/phrase')

# Initialize mnemonic generator
generator = MnemonicGenerator()

@phrase_bp.route('/create', methods=['GET', 'POST'])
@rate_limit(max_requests=20, window_minutes=10)
@csrf_protect()
def create_phrase():
    """Create a new mnemonic phrase with associated value"""
    if request.method == 'POST':
        try:
            # Get form data
            amount_str = request.form.get('amount', '0')
            creator_id = request.form.get('creator_id', None)
            
            # Validate amount
            is_valid, amount, error_msg = validate_amount(amount_str)
            if not is_valid:
                flash(error_msg, 'danger')
                return render_template('phrase/create.html')
            
            # Get existing phrases to avoid duplicates
            existing_phrases = [p.phrase for p in MnemonicPhrase.query.all()]
            
            # Generate a unique 4-word mnemonic phrase
            phrase_text = generator.generate_phrase(4, existing_phrases)
            
            # Create new mnemonic phrase record
            new_phrase = MnemonicPhrase(
                phrase=phrase_text,
                amount=amount,
                created_by=creator_id
            )
            
            # Save to database
            db.session.add(new_phrase)
            db.session.commit()
            
            # Redirect to share page
            return redirect(url_for('phrase.share_phrase', token=new_phrase.share_token))
            
        except Exception as e:
            db.session.rollback()
            flash(f'Error creating phrase: {str(e)}', 'danger')
            return render_template('phrase/create.html')
    
    # GET request - show the creation form
    return render_template('phrase/create.html')

@phrase_bp.route('/share/<token>')
def share_phrase(token):
    """Display a page with the phrase and sharing options"""
    # Find the phrase by share token
    phrase = MnemonicPhrase.query.filter_by(share_token=token).first_or_404()
    
    # Generate the redemption URL
    redemption_url = url_for('redemption.redeem_form', token=token, _external=True)
    
    return render_template('phrase/share.html', 
                          phrase=phrase, 
                          redemption_url=redemption_url)

@phrase_bp.route('/check/<token>')
@rate_limit(max_requests=30, window_minutes=10)
def check_phrase_status(token):
    """Check the status of a phrase (for the creator to monitor)"""
    # Find the phrase by share token
    phrase = MnemonicPhrase.query.filter_by(share_token=token).first_or_404()
    
    # Get associated transactions
    transactions = phrase.transactions
    
    return render_template('phrase/status.html', 
                          phrase=phrase, 
                          transactions=transactions)
