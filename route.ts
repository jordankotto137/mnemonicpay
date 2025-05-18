import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent, createPaymentMethod, confirmPaymentIntent } from '@/lib/stripe-service';
import { getPhraseByText, redeemPhrase, createTransaction, updateTransactionWithPayment } from '@/lib/phrase-service';
import { logActivity } from '@/lib/phrase-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phrase, cardDetails, email, name } = body;
    
    // Validate input
    if (!phrase || !cardDetails) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Find the phrase in the database
    const phraseRecord = await getPhraseByText(phrase);
    
    // Check if phrase exists and is unredeemed
    if (!phraseRecord) {
      return NextResponse.json(
        { error: 'Phrase not found' },
        { status: 404 }
      );
    }
    
    if (phraseRecord.status !== 'unredeemed') {
      return NextResponse.json(
        { error: 'Phrase has already been redeemed' },
        { status: 400 }
      );
    }
    
    // Create a transaction record
    const transaction = await createTransaction({
      phraseId: phraseRecord.id,
      amount: phraseRecord.amount,
      recipientName: name,
      recipientEmail: email,
    });
    
    // Create a payment method with Stripe
    const paymentMethod = await createPaymentMethod({
      number: cardDetails.cardNumber.replace(/\s/g, ''),
      exp_month: parseInt(cardDetails.expiryDate.split('/')[0], 10),
      exp_year: parseInt(`20${cardDetails.expiryDate.split('/')[1]}`, 10),
      cvc: cardDetails.cvc,
    });
    
    // Create a payment intent with Stripe
    const paymentIntent = await createPaymentIntent(
      phraseRecord.amount,
      {
        phraseId: phraseRecord.id,
        transactionId: transaction.id,
      }
    );
    
    // Confirm the payment intent
    const confirmedPayment = await confirmPaymentIntent(
      paymentIntent.id,
      paymentMethod.id
    );
    
    // Update the transaction with payment details
    await updateTransactionWithPayment(
      transaction.id,
      {
        status: confirmedPayment.status === 'succeeded' ? 'completed' : 'pending',
        paymentId: confirmedPayment.id,
        recipientCardLast4: cardDetails.cardNumber.slice(-4),
        completedAt: confirmedPayment.status === 'succeeded' ? new Date() : undefined,
      }
    );
    
    // If payment succeeded, mark the phrase as redeemed
    if (confirmedPayment.status === 'succeeded') {
      await redeemPhrase(phraseRecord.id);
      
      // Log the activity
      await logActivity('redeem_phrase_success', {
        phraseId: phraseRecord.id,
        transactionId: transaction.id,
        amount: phraseRecord.amount,
      });
    }
    
    return NextResponse.json({
      success: true,
      status: confirmedPayment.status,
      amount: phraseRecord.amount,
      transactionId: transaction.id,
    });
    
  } catch (error: any) {
    console.error('Error processing redemption:', error);
    
    // Log the error
    await logActivity('redeem_phrase_error', {
      error: error.message,
    });
    
    return NextResponse.json(
      { error: error.message || 'An error occurred during redemption' },
      { status: 500 }
    );
  }
}
