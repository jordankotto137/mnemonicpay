from app.models.models import MnemonicPhrase, db
from app.models.bitcoin_mnemonic import BitcoinMnemonicGenerator
import os

def update_mnemonic_generator():
    """Update the mnemonic generator to use Bitcoin seed phrases and TRNG"""
    # Initialize the new Bitcoin mnemonic generator
    generator = BitcoinMnemonicGenerator()
    
    # Test the generator
    try:
        # Generate a test phrase
        phrase = generator.generate_mnemonic_phrase(3)
        print(f"Successfully generated test phrase: {phrase}")
        return True
    except Exception as e:
        print(f"Error testing Bitcoin mnemonic generator: {e}")
        return False

if __name__ == "__main__":
    update_mnemonic_generator()
