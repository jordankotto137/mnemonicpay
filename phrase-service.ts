import { PrismaClient } from '@prisma/client';
import BitcoinMnemonicGenerator from './bitcoin-mnemonic';

// Initialize Prisma client
const prisma = new PrismaClient();

// Initialize Bitcoin mnemonic generator
const mnemonicGenerator = new BitcoinMnemonicGenerator();

/**
 * Create a new mnemonic phrase with associated value
 * @param amount The monetary amount to associate with the phrase
 * @param createdBy Optional user ID of the creator
 * @returns The created phrase object
 */
export async function createPhrase(amount: number, createdBy?: string) {
  try {
    // Generate a mnemonic phrase using the two-phase process
    const { phrase, seedPhraseHash, selectionSalt } = mnemonicGenerator.generateMnemonicPhrase(3);
    
    // Create the phrase record in the database
    const newPhrase = await prisma.phrase.create({
      data: {
        phrase,
        amount,
        seedPhraseHash,
        selectionSalt,
        createdBy,
      }
    });
    
    // Log the activity
    await logActivity('create_phrase', {
      phraseId: newPhrase.id,
      userId: createdBy,
      amount
    });
    
    return newPhrase;
  } catch (error) {
    console.error('Error creating phrase:', error);
    throw error;
  }
}

/**
 * Find a phrase by its share token
 * @param shareToken The unique share token
 * @returns The phrase object or null if not found
 */
export async function getPhraseByShareToken(shareToken: string) {
  try {
    return await prisma.phrase.findUnique({
      where: { shareToken },
      include: {
        creator: true,
        transactions: true
      }
    });
  } catch (error) {
    console.error('Error finding phrase by share token:', error);
    throw error;
  }
}

/**
 * Find a phrase by the actual phrase text
 * @param phraseText The 3-word phrase text
 * @returns The phrase object or null if not found
 */
export async function getPhraseByText(phraseText: string) {
  try {
    return await prisma.phrase.findUnique({
      where: { phrase: phraseText.toLowerCase().trim() },
      include: {
        creator: true,
        transactions: true
      }
    });
  } catch (error) {
    console.error('Error finding phrase by text:', error);
    throw error;
  }
}

/**
 * Redeem a phrase and mark it as used
 * @param phraseId The ID of the phrase to redeem
 * @returns The updated phrase object
 */
export async function redeemPhrase(phraseId: string) {
  try {
    const phrase = await prisma.phrase.update({
      where: { id: phraseId },
      data: {
        status: 'redeemed',
        redeemedAt: new Date()
      }
    });
    
    // Log the activity
    await logActivity('redeem_phrase', {
      phraseId: phrase.id
    });
    
    return phrase;
  } catch (error) {
    console.error('Error redeeming phrase:', error);
    throw error;
  }
}

/**
 * Create a transaction record for a phrase redemption
 * @param data Transaction data
 * @returns The created transaction object
 */
export async function createTransaction(data: {
  phraseId: string;
  amount: number;
  recipientName?: string;
  recipientEmail?: string;
  userId?: string;
}) {
  try {
    const transaction = await prisma.transaction.create({
      data
    });
    
    // Log the activity
    await logActivity('create_transaction', {
      transactionId: transaction.id,
      phraseId: data.phraseId,
      userId: data.userId
    });
    
    return transaction;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
}

/**
 * Update a transaction with payment details
 * @param transactionId The ID of the transaction to update
 * @param data The payment details
 * @returns The updated transaction object
 */
export async function updateTransactionWithPayment(
  transactionId: string,
  data: {
    status: string;
    paymentId?: string;
    recipientCardLast4?: string;
    completedAt?: Date;
  }
) {
  try {
    return await prisma.transaction.update({
      where: { id: transactionId },
      data
    });
  } catch (error) {
    console.error('Error updating transaction with payment:', error);
    throw error;
  }
}

/**
 * Log an activity for audit and tracking purposes
 * @param action The action performed
 * @param details Additional details about the action
 * @param ipAddress Optional IP address of the user
 * @param userAgent Optional user agent of the user
 * @returns The created activity log object
 */
export async function logActivity(
  action: string,
  details: any,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    return await prisma.activityLog.create({
      data: {
        action,
        details: JSON.stringify(details),
        ipAddress,
        userAgent,
        userId: details.userId,
        phraseId: details.phraseId,
        transactionId: details.transactionId
      }
    });
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw here to prevent disrupting the main flow
    return null;
  }
}

export default {
  createPhrase,
  getPhraseByShareToken,
  getPhraseByText,
  redeemPhrase,
  createTransaction,
  updateTransactionWithPayment,
  logActivity
};
