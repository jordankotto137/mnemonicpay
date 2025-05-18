from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, current_app, abort
from app.models.models import MnemonicPhrase, Transaction, db
from app.utils.security import rate_limit, validate_phrase, csrf_protect
import stripe
import os

# Initialize blueprint
redemption_bp = Blueprint('redemption', __name__, url_prefix='/redeem')

# Configure Stripe
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')

@redemption_bp.route('/<token>', methods=['GET'])
@rate_limit(max_requests=15, window_minutes=5)
def redeem_form(token):
    """Display the redemption form for a mnemonic phrase"""
    # Find the phrase by share token
    phrase = MnemonicPhrase.query.filter_by(share_token=token).first_or_404()
    
    # Check if already redeemed
    if phrase.status == 'redeemed':
        flash('This phrase has already been redeemed', 'warning')
        return render_template('redemption/already_redeemed.html')
    
    # Show redemption form
    return render_template('redemption/redeem_form.html', 
                          phrase=phrase,
                          stripe_key=os.environ.get('STRIPE_PUBLISHABLE_KEY'))

@redemption_bp.route('/verify', methods=['POST'])
@rate_limit(max_requests=10, window_minutes=5)
@csrf_protect()
def verify_phrase():
    """Verify a mnemonic phrase entered by the recipient"""
    # Get the phrase from the form
    phrase_text = request.form.get('phrase', '').strip().lower()
    
    # Validate phrase format
    is_valid, error_msg = validate_phrase(phrase_text)
    if not is_valid:
        flash(error_msg, 'danger')
        return redirect(url_for('redemption.manual_redeem'))
    
    # Find the phrase in the database
    phrase = MnemonicPhrase.query.filter_by(phrase=phrase_text).first()
    
    if not phrase:
        flash('Invalid phrase. Please check and try again.', 'danger')
        return redirect(url_for('redemption.manual_redeem'))
    
    # Check if already redeemed
    if phrase.status == 'redeemed':
        flash('This phrase has already been redeemed', 'warning')
        return render_template('redemption/already_redeemed.html')
    
    # Redirect to the redemption form with the token
    return redirect(url_for('redemption.redeem_form', token=phrase.share_token))

@redemption_bp.route('/manual', methods=['GET'])
@rate_limit(max_requests=20, window_minutes=10)
def manual_redeem():
    """Display a form for manual phrase entry"""
    return render_template('redemption/manual_redeem.html')

@redemption_bp.route('/process', methods=['POST'])
@rate_limit(max_requests=5, window_minutes=5)
@csrf_protect()
def process_redemption():
    """Process the redemption and initiate payment to debit card"""
    # Get form data
    token = request.form.get('token')
    recipient_name = request.form.get('recipient_name')
    card_token = request.form.get('stripeToken')
    
    # Validate inputs
    if not token or not recipient_name or not card_token:
        flash('Missing required information', 'danger')
        return redirect(url_for('redemption.manual_redeem'))
    
    # Find the phrase by share token
    phrase = MnemonicPhrase.query.filter_by(share_token=token).first_or_404()
    
    # Check if already redeemed
    if phrase.status == 'redeemed':
        flash('This phrase has already been redeemed', 'warning')
        return render_template('redemption/already_redeemed.html')
    
    try:
        # Create a transaction record
        transaction = Transaction(
            mnemonic_id=phrase.id,
            recipient_name=recipient_name,
            amount=phrase.amount,
            status='pending'
        )
        db.session.add(transaction)
        db.session.flush()  # Get transaction ID without committing
        
        # Process payment with Stripe
        payment = stripe.PaymentIntent.create(
            amount=int(phrase.amount * 100),  # Convert to cents
            currency="usd",
            payment_method=card_token,
            confirm=True,
            description=f"Mnemonic phrase redemption: {phrase.phrase}",
            metadata={
                "mnemonic_id": phrase.id,
                "transaction_id": transaction.id
            }
        )
        
        # Update transaction with payment details
        if payment.status == 'succeeded':
            transaction.complete(payment.id)
            if hasattr(payment, 'payment_method_details') and hasattr(payment.payment_method_details, 'card'):
                transaction.recipient_card_last4 = payment.payment_method_details.card.last4
            
            # Mark phrase as redeemed
            phrase.redeem()
            
            db.session.commit()
            
            # Show success page
            return render_template('redemption/success.html', 
                                  transaction=transaction,
                                  phrase=phrase)
        else:
            # Payment is processing or requires action
            transaction.status = payment.status
            db.session.commit()
            
            # Show processing page
            return render_template('redemption/processing.html',
                                  payment_id=payment.id,
                                  phrase=phrase)
            
    except stripe.error.CardError as e:
        # Handle card errors (e.g., declined card)
        db.session.rollback()
        error_msg = e.error.message
        flash(f'Card error: {error_msg}', 'danger')
        return render_template('redemption/error.html', error=error_msg)
        
    except stripe.error.StripeError as e:
        # Handle other Stripe errors
        db.session.rollback()
        error_msg = str(e)
        flash(f'Payment error: {error_msg}', 'danger')
        return render_template('redemption/error.html', error=error_msg)
        
    except Exception as e:
        # Handle other errors
        db.session.rollback()
        flash(f'Error processing redemption: {str(e)}', 'danger')
        return redirect(url_for('redemption.redeem_form', token=token))

@redemption_bp.route('/webhook', methods=['POST'])
def stripe_webhook():
    """Handle Stripe webhook events for payment updates"""
    payload = request.get_data()
    sig_header = request.headers.get('Stripe-Signature')
    endpoint_secret = os.environ.get('STRIPE_WEBHOOK_SECRET')
    
    # Skip signature verification in development if no webhook secret
    if not endpoint_secret:
        event = stripe.Event.construct_from(
            request.get_json(), stripe.api_key
        )
    else:
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except ValueError as e:
            # Invalid payload
            return jsonify({'error': 'Invalid payload'}), 400
        except stripe.error.SignatureVerificationError as e:
            # Invalid signature
            return jsonify({'error': 'Invalid signature'}), 400
    
    # Handle the event
    if event.type == 'payment_intent.succeeded':
        payment_intent = event.data.object
        metadata = payment_intent.metadata
        
        # Update transaction and phrase status
        if 'transaction_id' in metadata:
            transaction_id = int(metadata['transaction_id'])
            transaction = Transaction.query.get(transaction_id)
            
            if transaction and transaction.status != 'completed':
                transaction.complete(payment_intent.id)
                
                # Mark phrase as redeemed if not already
                phrase = transaction.mnemonic
                if phrase.status != 'redeemed':
                    phrase.redeem()
                
                db.session.commit()
    
    return jsonify({'status': 'success'})
