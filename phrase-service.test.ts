import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { createPhrase, getPhraseByText, redeemPhrase } from '../src/lib/phrase-service';

// Mock PrismaClient
vi.mock('@prisma/client', () => {
  const mockPrisma = {
    phrase: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn()
    },
    activityLog: {
      create: vi.fn()
    }
  };
  
  return {
    PrismaClient: vi.fn(() => mockPrisma)
  };
});

// Mock BitcoinMnemonicGenerator
vi.mock('../src/lib/bitcoin-mnemonic', () => {
  return {
    BitcoinMnemonicGenerator: vi.fn().mockImplementation(() => {
      return {
        generateMnemonicPhrase: vi.fn().mockReturnValue({
          phrase: 'quantum doctor unknown',
          seedPhraseHash: 'hashedSeedPhrase',
          selectionSalt: 'salt123'
        })
      };
    })
  };
});

describe('Phrase Service', () => {
  let prisma: any;
  
  beforeEach(() => {
    // Get the mocked PrismaClient instance
    prisma = (await import('@prisma/client')).PrismaClient();
    
    // Reset mock implementations
    prisma.phrase.create.mockReset();
    prisma.phrase.findUnique.mockReset();
    prisma.phrase.update.mockReset();
    prisma.activityLog.create.mockReset();
  });
  
  describe('createPhrase', () => {
    it('should create a new phrase with the specified amount', async () => {
      // Setup mock implementation
      prisma.phrase.create.mockResolvedValue({
        id: 'phrase123',
        phrase: 'quantum doctor unknown',
        amount: 50,
        status: 'unredeemed',
        shareToken: 'token123',
        seedPhraseHash: 'hashedSeedPhrase',
        selectionSalt: 'salt123',
        createdAt: new Date(),
        createdBy: 'user123'
      });
      
      // Call the function
      const result = await createPhrase(50, 'user123');
      
      // Assertions
      expect(prisma.phrase.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          phrase: 'quantum doctor unknown',
          amount: 50,
          seedPhraseHash: 'hashedSeedPhrase',
          selectionSalt: 'salt123',
          createdBy: 'user123'
        })
      });
      
      expect(result).toEqual(expect.objectContaining({
        id: 'phrase123',
        phrase: 'quantum doctor unknown',
        amount: 50,
        status: 'unredeemed'
      }));
    });
  });
  
  describe('getPhraseByText', () => {
    it('should find a phrase by its text', async () => {
      // Setup mock implementation
      prisma.phrase.findUnique.mockResolvedValue({
        id: 'phrase123',
        phrase: 'quantum doctor unknown',
        amount: 50,
        status: 'unredeemed'
      });
      
      // Call the function
      const result = await getPhraseByText('quantum doctor unknown');
      
      // Assertions
      expect(prisma.phrase.findUnique).toHaveBeenCalledWith({
        where: { phrase: 'quantum doctor unknown' },
        include: {
          creator: true,
          transactions: true
        }
      });
      
      expect(result).toEqual(expect.objectContaining({
        id: 'phrase123',
        phrase: 'quantum doctor unknown',
        amount: 50,
        status: 'unredeemed'
      }));
    });
    
    it('should return null if phrase not found', async () => {
      // Setup mock implementation
      prisma.phrase.findUnique.mockResolvedValue(null);
      
      // Call the function
      const result = await getPhraseByText('nonexistent phrase');
      
      // Assertions
      expect(result).toBeNull();
    });
  });
  
  describe('redeemPhrase', () => {
    it('should mark a phrase as redeemed', async () => {
      // Setup mock implementation
      const now = new Date();
      prisma.phrase.update.mockResolvedValue({
        id: 'phrase123',
        phrase: 'quantum doctor unknown',
        amount: 50,
        status: 'redeemed',
        redeemedAt: now
      });
      
      // Call the function
      const result = await redeemPhrase('phrase123');
      
      // Assertions
      expect(prisma.phrase.update).toHaveBeenCalledWith({
        where: { id: 'phrase123' },
        data: {
          status: 'redeemed',
          redeemedAt: expect.any(Date)
        }
      });
      
      expect(result).toEqual(expect.objectContaining({
        id: 'phrase123',
        phrase: 'quantum doctor unknown',
        amount: 50,
        status: 'redeemed',
        redeemedAt: now
      }));
    });
  });
});
