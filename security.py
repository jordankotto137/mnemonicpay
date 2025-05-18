import os
import functools
from flask import request, abort, flash, redirect, url_for, session
from datetime import datetime, timedelta

# Dictionary to store IP-based rate limiting information
# Format: {ip_address: {'count': int, 'reset_time': datetime}}
rate_limit_data = {}

def rate_limit(max_requests=10, window_minutes=5):
    """
    Decorator to implement rate limiting for routes
    
    Args:
        max_requests: Maximum number of requests allowed in the time window
        window_minutes: Time window in minutes
    """
    def decorator(f):
        @functools.wraps(f)
        def wrapped_view(*args, **kwargs):
            # Get client IP
            ip = request.remote_addr
            
            # Get current time
            now = datetime.utcnow()
            
            # Initialize or get rate limit data for this IP
            if ip not in rate_limit_data:
                rate_limit_data[ip] = {
                    'count': 0,
                    'reset_time': now + timedelta(minutes=window_minutes)
                }
            
            # Check if we need to reset the counter
            if now > rate_limit_data[ip]['reset_time']:
                rate_limit_data[ip] = {
                    'count': 0,
                    'reset_time': now + timedelta(minutes=window_minutes)
                }
            
            # Increment request count
            rate_limit_data[ip]['count'] += 1
            
            # Check if rate limit exceeded
            if rate_limit_data[ip]['count'] > max_requests:
                # Clean up old entries (optional)
                clean_rate_limit_data()
                
                # Return 429 Too Many Requests
                abort(429, description="Rate limit exceeded. Please try again later.")
            
            # Call the original route function
            return f(*args, **kwargs)
        return wrapped_view
    return decorator

def clean_rate_limit_data():
    """Clean up expired rate limit data"""
    now = datetime.utcnow()
    for ip in list(rate_limit_data.keys()):
        if now > rate_limit_data[ip]['reset_time']:
            del rate_limit_data[ip]

def validate_phrase(phrase_text):
    """
    Validate a mnemonic phrase format
    
    Args:
        phrase_text: The phrase to validate
        
    Returns:
        (bool, str): (is_valid, error_message)
    """
    if not phrase_text:
        return False, "Phrase cannot be empty"
    
    # Convert to lowercase and strip whitespace
    phrase_text = phrase_text.lower().strip()
    
    # Split into words
    words = phrase_text.split()
    
    # Check word count
    if len(words) != 4:
        return False, "Phrase must contain exactly 4 words"
    
    # Check for minimum word length (to prevent very short words)
    for word in words:
        if len(word) < 3:
            return False, "Each word must be at least 3 characters long"
    
    # Check for alphanumeric words (allowing only letters)
    for word in words:
        if not word.isalpha():
            return False, "Words must contain only letters"
    
    return True, ""

def validate_amount(amount_str):
    """
    Validate a monetary amount
    
    Args:
        amount_str: The amount as a string
        
    Returns:
        (bool, float, str): (is_valid, amount_float, error_message)
    """
    try:
        # Convert to float
        amount = float(amount_str)
        
        # Check minimum amount
        if amount < 1.0:
            return False, 0, "Amount must be at least $1.00"
        
        # Check maximum amount (optional, adjust as needed)
        if amount > 1000.0:
            return False, 0, "Amount cannot exceed $1,000.00"
        
        # Round to 2 decimal places
        amount = round(amount, 2)
        
        return True, amount, ""
        
    except ValueError:
        return False, 0, "Invalid amount format"

def csrf_protect():
    """
    Decorator to protect against CSRF attacks
    """
    def decorator(f):
        @functools.wraps(f)
        def wrapped_view(*args, **kwargs):
            # Only apply to POST/PUT/DELETE requests
            if request.method in ['POST', 'PUT', 'DELETE']:
                # Check for CSRF token
                token = session.get('csrf_token')
                if not token or token != request.form.get('csrf_token'):
                    abort(403, description="CSRF token validation failed")
            
            # Call the original route function
            return f(*args, **kwargs)
        return wrapped_view
    return decorator
