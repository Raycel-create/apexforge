# Stripe Integration Guide

This document provides instructions for integrating real Stripe payments and webhooks in production.

## Overview

The ApexForge application includes a complete Stripe integration with:
- Subscription checkout for all pricing tiers
- One-time payments for add-ons (Security Shield)
- Webhook handlers for payment events
- Payout history tracking
- Transaction tracking dashboard
- Bank account connection via Stripe Connect

## Components

### 1. Stripe Checkout (`StripeCheckout.tsx`)
Handles the checkout flow for subscriptions and one-time payments.

**Usage:**
```tsx
<StripeCheckout
  planId="price_pro_monthly"
  planName="Pro"
  planPrice={1900}
  onSuccess={() => console.log('Payment successful')}
  onCancel={() => console.log('Payment canceled')}
/>
```

### 2. Payout History (`PayoutHistory.tsx`)
Displays all payouts to connected bank accounts with filtering and export capabilities.

### 3. Transaction Tracking (`TransactionTracking.tsx`)
Real-time transaction monitoring with search, filtering, and analytics.

### 4. Stripe Connect (`StripeConnect.tsx`)
Allows users to connect bank accounts worldwide for receiving payments.

## Setup Instructions

### Step 1: Get Stripe API Keys

1. Create a Stripe account at https://stripe.com
2. Navigate to Developers > API Keys
3. Copy your **Publishable Key** and **Secret Key**
4. Store them securely as environment variables:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Step 2: Create Products and Prices

In your Stripe Dashboard, create the following products:

#### Subscription Plans
- **Pro**: $19/month → `price_pro_monthly`
- **Gold**: $180/month → `price_gold_monthly`
- **Enterprise**: $250/month → `price_enterprise_monthly`
- **Launch**: $39/month → `price_launch_monthly`
- **Impossible Nyx**: Custom pricing → `price_impossible_nyx`

#### Add-ons
- **Perfectionist AI**: $20/month → `price_perfectionist_addon`
- **God Mode**: $29/month → `price_godmode_addon`
- **Security Shield**: $500 one-time → `price_security_shield_onetime`

Update the price IDs in `src/lib/stripeIntegration.ts`:

```typescript
export const STRIPE_PLAN_IDS = {
  free: 'price_free',
  pro: 'price_pro_monthly',    // Replace with actual Stripe price ID
  gold: 'price_gold_monthly',  // Replace with actual Stripe price ID
  // ... etc
}
```

### Step 3: Implement Backend Webhook Endpoint

The current implementation uses mock data. For production, you need a backend endpoint to handle Stripe webhooks.

#### Example Node.js/Express Endpoint:

```javascript
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

// Webhook endpoint - MUST be raw body
app.post('/api/webhooks/stripe', 
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        // Activate subscription, grant access
        await handleCheckoutComplete(session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      case 'charge.refunded':
        await handleRefund(event.data.object);
        break;

      case 'payout.paid':
        await handlePayoutPaid(event.data.object);
        break;

      case 'payout.failed':
        await handlePayoutFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  }
);
```

### Step 4: Configure Webhooks in Stripe Dashboard

1. Go to Stripe Dashboard > Developers > Webhooks
2. Click "Add endpoint"
3. Enter your webhook URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `charge.refunded`
   - `payout.created`
   - `payout.paid`
   - `payout.failed`
5. Copy the webhook signing secret and add to your environment variables

### Step 5: Update Frontend Checkout Flow

In `src/lib/stripeIntegration.ts`, update the `createCheckoutSession` function to call your backend:

```typescript
export async function createCheckoutSession(
  planId: string,
  customerEmail: string,
  successUrl: string,
  cancelUrl: string
): Promise<StripeCheckoutSession> {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      priceId: planId,
      customerEmail,
      successUrl,
      cancelUrl,
    }),
  });

  const session = await response.json();
  
  // Redirect to Stripe Checkout
  window.location.href = session.url;
  
  return session;
}
```

#### Backend Checkout Session Creation:

```javascript
app.post('/api/create-checkout-session', async (req, res) => {
  const { priceId, customerEmail, successUrl, cancelUrl } = req.body;

  const session = await stripe.checkout.sessions.create({
    mode: priceId.includes('onetime') ? 'payment' : 'subscription',
    customer_email: customerEmail,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  res.json({ url: session.url, id: session.id });
});
```

### Step 6: Implement Data Persistence

Update the webhook handlers to store data in your database:

```typescript
async function handleCheckoutComplete(session: any): Promise<void> {
  // Store subscription in database
  await db.subscriptions.create({
    customerId: session.customer,
    subscriptionId: session.subscription,
    status: 'active',
    planId: session.metadata.planId,
    // ... other fields
  });

  // Grant user access to features
  await db.users.update({
    where: { email: session.customer_email },
    data: { plan: session.metadata.planId }
  });
}
```

### Step 7: Fetch Real Data

Update the fetch functions in `src/lib/stripeIntegration.ts`:

```typescript
export async function fetchPayoutHistory(): Promise<StripePayout[]> {
  const response = await fetch('/api/stripe/payouts', {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });
  return response.json();
}

export async function fetchTransactionHistory(): Promise<StripeTransaction[]> {
  const response = await fetch('/api/stripe/transactions', {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });
  return response.json();
}
```

#### Backend Endpoints:

```javascript
// Get payouts
app.get('/api/stripe/payouts', authenticateUser, async (req, res) => {
  const payouts = await stripe.payouts.list({
    limit: 100,
  });
  res.json(payouts.data);
});

// Get transactions (balance transactions)
app.get('/api/stripe/transactions', authenticateUser, async (req, res) => {
  const transactions = await stripe.balanceTransactions.list({
    limit: 100,
  });
  res.json(transactions.data);
});
```

## Testing

### Test Mode

Use Stripe's test mode with test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

### Test Webhooks Locally

Use Stripe CLI to forward webhooks to localhost:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Security Best Practices

1. **Never expose secret keys** in frontend code
2. **Always verify webhook signatures** to prevent spoofing
3. **Use HTTPS** for all webhook endpoints
4. **Validate amounts** server-side before granting access
5. **Log all webhook events** for audit trails
6. **Handle idempotency** - webhooks may be sent multiple times
7. **Rate limit** your webhook endpoint

## CEO Dashboard Integration

The CEO dashboard now includes three tabs:
1. **API Keys**: Manage all integration keys
2. **Payouts**: View payout history with filtering
3. **Transactions**: Real-time transaction tracking

Access these features after logging in with CEO credentials:
- Username: `adminadminadmin`
- Password: `19780111`
- 2FA: Use authenticator app

## Support

For issues with Stripe integration:
- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- Stripe Dashboard: https://dashboard.stripe.com

## Production Checklist

- [ ] Stripe account verified and activated
- [ ] Products and prices created in Stripe
- [ ] Environment variables configured
- [ ] Backend webhook endpoint deployed
- [ ] Webhook endpoint registered in Stripe Dashboard
- [ ] Webhook signature verification working
- [ ] Test payments completed successfully
- [ ] Database schema includes subscription tables
- [ ] User access control implemented
- [ ] Error handling and logging configured
- [ ] Payment confirmation emails set up
- [ ] Refund policy implemented
- [ ] Terms of service and privacy policy linked
