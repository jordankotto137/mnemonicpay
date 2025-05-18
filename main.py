from flask import Blueprint, render_template
from app.utils.security import rate_limit

# Initialize blueprint
main_bp = Blueprint('main', __name__)

@main_bp.route('/')
@rate_limit(max_requests=60, window_minutes=10)
def index():
    """Homepage with options to create or redeem a phrase"""
    return render_template('main/index.html')

@main_bp.route('/about')
@rate_limit(max_requests=60, window_minutes=10)
def about():
    """About page with information about the service"""
    return render_template('main/about.html')

@main_bp.route('/how-it-works')
@rate_limit(max_requests=60, window_minutes=10)
def how_it_works():
    """Page explaining how the mnemonic phrase system works"""
    return render_template('main/how_it_works.html')
