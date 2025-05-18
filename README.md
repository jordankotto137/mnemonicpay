# Mnemonic Pay - Family Cash Transfer System

A simple Flask application that allows users to send monetary value through unique 4-word mnemonic phrases (e.g., 'apple banana orange grape'), which recipients can redeem instantly for cash to their debit card.

## Features

- **Phrase Generation**: Generate unique 4-word phrases using a predefined wordlist
- **Value Assignment**: Enable the sender to specify a monetary value (e.g., $10) to associate with the phrase
- **Data Storage**: Store each phrase, its associated value, and redemption status in an SQLite database
- **Secure Sharing**: Generate a unique link for the sender to share the phrase securely with the recipient
- **Redemption Interface**: Simple web form where recipients can enter the phrase and their debit card details to claim the value
- **Payment Integration**: Integration with Stripe to transfer the specified value to the recipient's debit card
- **Single-Use Security**: Each phrase is unique and can only be redeemed once
- **No Account Required**: Recipients can redeem the value without creating an account

## Setup Instructions

### Prerequisites

- Python 3.6+
- Flask
- SQLAlchemy
- Stripe account with API keys

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/mnemonic-pay.git
cd mnemonic-pay
```

2. Install dependencies:
```
pip install flask flask-sqlalchemy flask-wtf stripe python-dotenv
```

3. Create a `.env` file in the root directory with your Stripe API keys:
```
SECRET_KEY=your_secret_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_key
```

4. Initialize the database:
```
python setup_db.py
```

5. Run the application:
```
python run.py
```

6. Access the application at `http://localhost:5000`

## Usage

### For Senders:

1. Click "Create Phrase" on the homepage
2. Enter the amount you want to send (minimum $1.00)
3. Optionally enter your name so the recipient knows who sent it
4. Click "Generate Phrase" to create your unique 4-word phrase
5. Write down the phrase on a piece of paper
6. Give the paper to your family member

### For Recipients:

1. Click "Redeem Phrase" on the homepage
2. Enter the 4-word phrase exactly as written
3. Enter your name and debit card information
4. Click "Redeem" to receive the money on your debit card
5. The money will be transferred instantly to your card

## Security Features

- Rate limiting to prevent brute force attacks
- CSRF protection for all forms
- Phrase validation to ensure proper format
- Amount validation with minimum and maximum limits
- Secure storage of sensitive information
- Single-use phrases that can only be redeemed once

## Production Deployment

For production deployment:

1. Update the `.env` file with production Stripe API keys
2. Set a strong SECRET_KEY in the `.env` file
3. Configure a production-ready web server (e.g., Gunicorn, uWSGI)
4. Set up HTTPS with a valid SSL certificate
5. Configure Stripe webhooks for your production domain

## License

This project is licensed under the MIT License - see the LICENSE file for details.
