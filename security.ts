import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';
import * as CryptoJS from 'crypto-js';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const MAX_REQUESTS_PER_WINDOW = 10;

// Store for rate limiting (in a real app, use Redis or similar)
const rateLimitStore: Record<string, { count: number, timestamp: number }> = {};

// CSRF token store (in a real app, use a database or Redis)
const csrfTokens: Record<string, { timestamp: number }> = {};

/**
 * Generate a CSRF token
 * @returns The generated token
 */
export function generateCsrfToken(): string {
  const token = crypto.randomBytes(32).toString('hex');
  csrfTokens[token] = { timestamp: Date.now() };
  
  // Clean up old tokens
  Object.keys(csrfTokens).forEach(key => {
    if (Date.now() - csrfTokens[key].timestamp > 24 * 60 * 60 * 1000) { // 24 hours
      delete csrfTokens[key];
    }
  });
  
  return token;
}

/**
 * Validate a CSRF token
 * @param token The token to validate
 * @returns Whether the token is valid
 */
export function validateCsrfToken(token: string): boolean {
  if (!csrfTokens[token]) return false;
  
  // Token is valid, remove it to prevent reuse
  delete csrfTokens[token];
  return true;
}

/**
 * Middleware to check CSRF token
 * @param request The incoming request
 * @returns Response if CSRF check fails, otherwise null
 */
export function csrfCheck(request: NextRequest): NextResponse | null {
  // Skip for GET requests
  if (request.method === 'GET') return null;
  
  const csrfToken = request.headers.get('X-CSRF-Token');
  
  if (!csrfToken || !validateCsrfToken(csrfToken)) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    );
  }
  
  return null;
}

/**
 * Apply rate limiting based on IP address
 * @param request The incoming request
 * @returns Response if rate limit is exceeded, otherwise null
 */
export function rateLimit(request: NextRequest): NextResponse | null {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  
  // Initialize or update rate limit entry
  if (!rateLimitStore[ip] || now - rateLimitStore[ip].timestamp > RATE_LIMIT_WINDOW) {
    rateLimitStore[ip] = { count: 1, timestamp: now };
  } else {
    rateLimitStore[ip].count++;
  }
  
  // Check if rate limit is exceeded
  if (rateLimitStore[ip].count > MAX_REQUESTS_PER_WINDOW) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    );
  }
  
  return null;
}

/**
 * Encrypt sensitive data
 * @param data Data to encrypt
 * @returns Encrypted data
 */
export function encryptData(data: string): string {
  const encryptionKey = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
  return CryptoJS.AES.encrypt(data, encryptionKey).toString();
}

/**
 * Decrypt sensitive data
 * @param encryptedData Encrypted data
 * @returns Decrypted data
 */
export function decryptData(encryptedData: string): string {
  const encryptionKey = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
  const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * Validate a mnemonic phrase format
 * @param phrase The phrase to validate
 * @returns Whether the phrase is valid
 */
export function validatePhraseFormat(phrase: string): boolean {
  // Check if phrase has exactly 3 words
  const words = phrase.trim().split(/\s+/);
  if (words.length !== 3) return false;
  
  // Check if each word contains only letters
  return words.every(word => /^[a-zA-Z]+$/.test(word));
}

/**
 * Sanitize user input to prevent XSS
 * @param input User input
 * @returns Sanitized input
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default {
  generateCsrfToken,
  validateCsrfToken,
  csrfCheck,
  rateLimit,
  encryptData,
  decryptData,
  validatePhraseFormat,
  sanitizeInput,
};
