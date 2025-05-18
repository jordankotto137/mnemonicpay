import { describe, it, expect, beforeEach, vi } from 'vitest';
import { encryptData, decryptData, validatePhraseFormat, sanitizeInput } from '../src/lib/security';

// Mock CryptoJS
vi.mock('crypto-js', () => ({
  AES: {
    encrypt: vi.fn().mockReturnValue({
      toString: () => 'encryptedData'
    }),
    decrypt: vi.fn().mockReturnValue({
      toString: vi.fn().mockReturnValue('decryptedData')
    })
  },
  enc: {
    Utf8: {
      stringify: vi.fn().mockReturnValue('decryptedData')
    }
  }
}));

describe('Security Utils', () => {
  describe('validatePhraseFormat', () => {
    it('should validate correct phrase format', () => {
      expect(validatePhraseFormat('quantum doctor unknown')).toBe(true);
    });

    it('should reject phrases with wrong number of words', () => {
      expect(validatePhraseFormat('quantum doctor')).toBe(false);
      expect(validatePhraseFormat('quantum doctor unknown extra')).toBe(false);
    });

    it('should reject phrases with non-letter characters', () => {
      expect(validatePhraseFormat('quantum doctor 123')).toBe(false);
      expect(validatePhraseFormat('quantum doctor!')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should sanitize HTML tags', () => {
      expect(sanitizeInput('<script>alert("XSS")</script>')).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    });

    it('should sanitize quotes', () => {
      expect(sanitizeInput("O'Reilly")).toBe('O&#039;Reilly');
      expect(sanitizeInput('Say "Hello"')).toBe('Say &quot;Hello&quot;');
    });
  });

  describe('encryption', () => {
    it('should encrypt data', () => {
      const result = encryptData('sensitive data');
      expect(result).toBe('encryptedData');
    });

    it('should decrypt data', () => {
      const result = decryptData('encryptedData');
      expect(result).toBe('decryptedData');
    });
  });
});
