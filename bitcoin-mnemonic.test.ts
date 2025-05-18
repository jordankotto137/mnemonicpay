import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BitcoinMnemonicGenerator } from '../src/lib/bitcoin-mnemonic';

// Mock crypto module
vi.mock('crypto', () => ({
  randomBytes: () => Buffer.from('0123456789abcdef0123456789abcdef'),
  randomInt: (min: number, max: number) => Math.floor((max - min) / 2) + min
}));

// Mock CryptoJS
vi.mock('crypto-js', () => ({
  PBKDF2: vi.fn().mockReturnValue({
    toString: () => '0123456789abcdef0123456789abcdef'
  }),
  enc: {
    Hex: {
      parse: () => ({
        words: [0x01234567, 0x89abcdef, 0x01234567, 0x89abcdef],
      })
    }
  },
  SHA256: vi.fn().mockReturnValue({
    toString: () => 'hashedSeedPhrase'
  }),
  AES: {
    encrypt: vi.fn().mockReturnValue({
      toString: () => 'encryptedData'
    }),
    decrypt: vi.fn().mockReturnValue({
      toString: () => 'decryptedData'
    })
  }
}));

describe('BitcoinMnemonicGenerator', () => {
  let generator: BitcoinMnemonicGenerator;

  beforeEach(() => {
    generator = new BitcoinMnemonicGenerator();
  });

  it('should generate a seed phrase with the correct number of words', () => {
    const seedPhrase = generator.generateSeedPhrase(24);
    expect(seedPhrase).toBeInstanceOf(Array);
    expect(seedPhrase.length).toBe(24);
    expect(typeof seedPhrase[0]).toBe('string');
  });

  it('should select words using CSPRNG', () => {
    const seedWords = Array(24).fill('').map((_, i) => `word${i}`);
    const result = generator.selectWordsWithCSPRNG(seedWords, 3);
    
    expect(result).toHaveProperty('selectedWords');
    expect(result).toHaveProperty('salt');
    expect(result.selectedWords).toBeInstanceOf(Array);
    expect(result.selectedWords.length).toBe(3);
    expect(typeof result.salt).toBe('string');
  });

  it('should generate a mnemonic phrase with the correct format', () => {
    const result = generator.generateMnemonicPhrase(3);
    
    expect(result).toHaveProperty('phrase');
    expect(result).toHaveProperty('seedPhraseHash');
    expect(result).toHaveProperty('selectionSalt');
    
    expect(typeof result.phrase).toBe('string');
    expect(typeof result.seedPhraseHash).toBe('string');
    expect(typeof result.selectionSalt).toBe('string');
    
    const words = result.phrase.split(' ');
    expect(words.length).toBe(3);
  });
});
