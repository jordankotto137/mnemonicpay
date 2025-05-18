import Stripe from 'stripe';

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16', // Use the latest API version
});

/**
 * Create a payment intent for redeeming a phrase
 * @param amount Amount in dollars (will be converted to cents for Stripe)
 * @param metadata Additional metadata to attach to the payment
 * @returns The created payment intent
 */
export async function createPaymentIntent(amount: number, metadata: Record<string, string> = {}) {
  try {
    // Convert dollars to cents for Stripe
    const amountInCents = Math.round(amount * 100);
    
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      metadata,
      payment_method_types: ['card'],
      capture_method: 'automatic',
    });
    
    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

/**
 * Create a payment method for a debit card
 * @param cardDetails Card details including number, exp_month, exp_year, and cvc
 * @returns The created payment method
 */
export async function createPaymentMethod(cardDetails: {
  number: string;
  exp_month: number;
  exp_year: number;
  cvc: string;
}) {
  try {
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: cardDetails,
    });
    
    return paymentMethod;
  } catch (error) {
    console.error('Error creating payment method:', error);
    throw error;
  }
}

/**
 * Confirm a payment intent with a payment method
 * @param paymentIntentId The ID of the payment intent to confirm
 * @param paymentMethodId The ID of the payment method to use
 * @returns The confirmed payment intent
 */
export async function confirmPaymentIntent(paymentIntentId: string, paymentMethodId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(
      paymentIntentId,
      {
        payment_method: paymentMethodId,
      }
    );
    
    return paymentIntent;
  } catch (error) {
    console.error('Error confirming payment intent:', error);
    throw error;
  }
}

/**
 * Create a transfer to a connected account (for sending money to recipients)
 * @param amount Amount in dollars (will be converted to cents for Stripe)
 * @param destination Stripe account ID of the recipient
 * @param metadata Additional metadata to attach to the transfer
 * @returns The created transfer
 */
export async function createTransfer(
  amount: number,
  destination: string,
  metadata: Record<string, string> = {}
) {
  try {
    // Convert dollars to cents for Stripe
    const amountInCents = Math.round(amount * 100);
    
    const transfer = await stripe.transfers.create({
      amount: amountInCents,
      currency: 'usd',
      destination,
      metadata,
    });
    
    return transfer;
  } catch (error) {
    console.error('Error creating transfer:', error);
    throw error;
  }
}

/**
 * Create a payout to a debit card (for instant cashout)
 * @param amount Amount in dollars (will be converted to cents for Stripe)
 * @param destination Payment method ID or card ID
 * @param metadata Additional metadata to attach to the payout
 * @returns The created payout
 */
export async function createPayout(
  amount: number,
  destination: string,
  metadata: Record<string, string> = {}
) {
  try {
    // Convert dollars to cents for Stripe
    const amountInCents = Math.round(amount * 100);
    
    const payout = await stripe.payouts.create({
      amount: amountInCents,
      currency: 'usd',
      method: 'instant', // Use instant payout for immediate availability
      destination,
      metadata,
    });
    
    return payout;
  } catch (error) {
    console.error('Error creating payout:', error);
    throw error;
  }
}

/**
 * Create a customer in Stripe (for users who create accounts)
 * @param email Customer's email
 * @param name Customer's name
 * @param metadata Additional metadata to attach to the customer
 * @returns The created customer
 */
export async function createCustomer(
  email: string,
  name?: string,
  metadata: Record<string, string> = {}
) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata,
    });
    
    return customer;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}

/**
 * Add a payment method to a customer
 * @param customerId Stripe customer ID
 * @param paymentMethodId Stripe payment method ID
 * @returns The attached payment method
 */
export async function attachPaymentMethodToCustomer(
  customerId: string,
  paymentMethodId: string
) {
  try {
    const paymentMethod = await stripe.paymentMethods.attach(
      paymentMethodId,
      { customer: customerId }
    );
    
    return paymentMethod;
  } catch (error) {
    console.error('Error attaching payment method to customer:', error);
    throw error;
  }
}

export default {
  createPaymentIntent,
  createPaymentMethod,
  confirmPaymentIntent,
  createTransfer,
  createPayout,
  createCustomer,
  attachPaymentMethodToCustomer,
};
