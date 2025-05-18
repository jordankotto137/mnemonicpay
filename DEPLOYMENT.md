# MnemonicPay - Next.js Deployment Guide

This document provides instructions for deploying the MnemonicPay application to production.

## Prerequisites

- Vercel account
- Stripe account with API keys
- PostgreSQL database (Vercel Postgres recommended)

## Deployment Steps

### 1. Set up Vercel Postgres

1. Log in to your Vercel account
2. Create a new Postgres database
3. Note the connection string for later use

### 2. Configure Environment Variables

Set the following environment variables in your Vercel project:

```
DATABASE_URL=your_postgres_connection_string
DIRECT_URL=your_postgres_direct_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=your_production_url
ENCRYPTION_KEY=your_encryption_key_for_sensitive_data
```

### 3. Deploy to Vercel

Run the following commands:

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

Alternatively, you can connect your GitHub repository to Vercel for automatic deployments.

### 4. Run Database Migrations

After deployment, run the Prisma migrations:

```bash
npx prisma migrate deploy
```

### 5. Configure Stripe Webhooks

In your Stripe dashboard:
1. Go to Developers > Webhooks
2. Add a new endpoint with your production URL + `/api/webhooks/stripe`
3. Select the following events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payout.created`
   - `payout.paid`

### 6. Test the Production Deployment

Verify that all features work correctly in production:
- Account creation
- Phrase generation
- Phrase redemption
- Payment processing

## Monitoring and Maintenance

- Set up logging with a service like Datadog or Sentry
- Configure alerts for critical errors
- Regularly check for security updates
- Monitor Stripe payment processing for any issues

## Scaling Considerations

- The application is designed to scale horizontally
- Vercel automatically handles scaling of the Next.js application
- For high traffic, consider:
  - Adding a Redis cache for rate limiting
  - Implementing database connection pooling
  - Setting up read replicas for the database
