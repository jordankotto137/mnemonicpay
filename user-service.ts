import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { logActivity } from './phrase-service';

// Initialize Prisma client
const prisma = new PrismaClient();

/**
 * Create a new user account
 * @param data User data including email, name, and password
 * @returns The created user object (without password)
 */
export async function createUser(data: {
  email: string;
  name?: string;
  password: string;
}) {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    // Create the user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        hashedPassword
      }
    });
    
    // Log the activity
    await logActivity('create_user', {
      userId: user.id
    });
    
    // Return user without password
    const { hashedPassword: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Authenticate a user with email and password
 * @param email User's email
 * @param password User's password
 * @returns The authenticated user object (without password) or null if authentication fails
 */
export async function authenticateUser(email: string, password: string) {
  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    // If user not found or password doesn't match, return null
    if (!user || !user.hashedPassword) return null;
    
    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordMatch) return null;
    
    // Log the activity
    await logActivity('user_login', {
      userId: user.id
    });
    
    // Return user without password
    const { hashedPassword: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error authenticating user:', error);
    throw error;
  }
}

/**
 * Get a user by ID
 * @param userId The user ID
 * @returns The user object (without password) or null if not found
 */
export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) return null;
    
    // Return user without password
    const { hashedPassword: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
}

/**
 * Update a user's account balance
 * @param userId The user ID
 * @param amount The amount to add (positive) or subtract (negative)
 * @returns The updated user object (without password)
 */
export async function updateUserBalance(userId: string, amount: number) {
  try {
    // Get current user to check balance
    const currentUser = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!currentUser) {
      throw new Error('User not found');
    }
    
    // Check if there's enough balance for withdrawal
    if (amount < 0 && currentUser.balance + amount < 0) {
      throw new Error('Insufficient balance');
    }
    
    // Update the balance
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        balance: {
          increment: amount
        }
      }
    });
    
    // Log the activity
    await logActivity('update_balance', {
      userId,
      amount,
      newBalance: user.balance
    });
    
    // Return user without password
    const { hashedPassword: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error updating user balance:', error);
    throw error;
  }
}

/**
 * Get a user's transaction history
 * @param userId The user ID
 * @returns Array of transactions associated with the user
 */
export async function getUserTransactions(userId: string) {
  try {
    return await prisma.transaction.findMany({
      where: { userId },
      include: {
        phrase: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error) {
    console.error('Error getting user transactions:', error);
    throw error;
  }
}

/**
 * Get a user's created phrases
 * @param userId The user ID
 * @returns Array of phrases created by the user
 */
export async function getUserPhrases(userId: string) {
  try {
    return await prisma.phrase.findMany({
      where: { createdBy: userId },
      include: {
        transactions: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error) {
    console.error('Error getting user phrases:', error);
    throw error;
  }
}

export default {
  createUser,
  authenticateUser,
  getUserById,
  updateUserBalance,
  getUserTransactions,
  getUserPhrases
};
