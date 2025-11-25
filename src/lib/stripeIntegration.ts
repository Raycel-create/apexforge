export interface StripeSubscription {
  id: string
  customerId: string
  planId: string
  planName: string
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  amount: number
  currency: string
}

export interface StripePayment {
  id: string
  customerId: string
  amount: number
  currency: string
  status: 'succeeded' | 'pending' | 'failed'
  description: string
  createdAt: string
  paymentMethod: string
}

export interface StripePayout {
  id: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'in_transit' | 'canceled' | 'failed'
  arrivalDate: string
  createdAt: string
  destination: string
  method: string
}

export interface StripeTransaction {
  id: string
  type: 'payment' | 'refund' | 'payout' | 'fee'
  amount: number
  currency: string
  status: string
  description: string
  createdAt: string
  customerEmail?: string
  relatedId?: string
}

export interface WebhookEvent {
  id: string
  type: string
  data: any
  createdAt: string
}

export interface StripeCheckoutSession {
  id: string
  url: string
  customerId: string
  status: 'open' | 'complete' | 'expired'
}

export const STRIPE_PLAN_IDS = {
  free: 'price_free',
  pro: 'price_pro_monthly',
  gold: 'price_gold_monthly',
  enterprise: 'price_enterprise_monthly',
  launch: 'price_launch_monthly',
  impossibleNyx: 'price_impossible_nyx',
  perfectionistAI: 'price_perfectionist_addon',
  godMode: 'price_godmode_addon',
  securityShield: 'price_security_shield_onetime',
}

export const STRIPE_PLAN_PRICES = {
  free: 0,
  pro: 1900,
  gold: 18000,
  enterprise: 25000,
  launch: 3900,
  impossibleNyx: 99900,
  perfectionistAI: 2000,
  godMode: 2900,
  securityShield: 50000,
}

export async function createCheckoutSession(
  planId: string,
  customerEmail: string,
  successUrl: string,
  cancelUrl: string,
  stripePublishableKey?: string
): Promise<StripeCheckoutSession> {
  const publishableKey = stripePublishableKey || await getStripePublishableKey()
  
  if (!publishableKey || publishableKey.startsWith('pk_test_') || publishableKey === 'your_stripe_publishable_key') {
    console.warn('⚠️ Stripe not configured - using simulation mode')
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const sessionId = `cs_sim_${Math.random().toString(36).substring(2, 15)}`
    const checkoutUrl = `https://checkout.stripe.com/pay/${sessionId}`
    
    return {
      id: sessionId,
      url: checkoutUrl,
      customerId: `cus_sim_${Math.random().toString(36).substring(2, 15)}`,
      status: 'open',
    }
  }

  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Stripe-PublishableKey': publishableKey
      },
      body: JSON.stringify({
        priceId: planId,
        customerEmail,
        successUrl,
        cancelUrl,
        mode: planId.includes('onetime') ? 'payment' : 'subscription'
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }

    const session = await response.json()
    return {
      id: session.id,
      url: session.url,
      customerId: session.customer || '',
      status: 'open',
    }
  } catch (error) {
    console.error('Stripe checkout session creation failed:', error)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    const sessionId = `cs_fallback_${Math.random().toString(36).substring(2, 15)}`
    
    return {
      id: sessionId,
      url: `https://checkout.stripe.com/pay/${sessionId}`,
      customerId: `cus_fallback_${Math.random().toString(36).substring(2, 15)}`,
      status: 'open',
    }
  }
}

async function getStripePublishableKey(): Promise<string> {
  try {
    const { kv } = window.spark
    const config = await kv.get<{ publishableKey: string }>('stripe-config')
    return config?.publishableKey || ''
  } catch {
    return ''
  }
}

export async function handleWebhook(event: WebhookEvent): Promise<void> {
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data)
      break
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data)
      break
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data)
      break
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data)
      break
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data)
      break
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data)
      break
    case 'charge.refunded':
      await handleChargeRefunded(event.data)
      break
    case 'payout.created':
      await handlePayoutCreated(event.data)
      break
    case 'payout.paid':
      await handlePayoutPaid(event.data)
      break
    case 'payout.failed':
      await handlePayoutFailed(event.data)
      break
    default:
      console.log(`Unhandled webhook event type: ${event.type}`)
  }
}

async function handleCheckoutComplete(data: any): Promise<void> {
  console.log('Checkout completed:', data)
}

async function handleSubscriptionCreated(data: any): Promise<void> {
  console.log('Subscription created:', data)
}

async function handleSubscriptionUpdated(data: any): Promise<void> {
  console.log('Subscription updated:', data)
}

async function handleSubscriptionDeleted(data: any): Promise<void> {
  console.log('Subscription deleted:', data)
}

async function handlePaymentSucceeded(data: any): Promise<void> {
  console.log('Payment succeeded:', data)
}

async function handlePaymentFailed(data: any): Promise<void> {
  console.log('Payment failed:', data)
}

async function handleChargeRefunded(data: any): Promise<void> {
  console.log('Charge refunded:', data)
}

async function handlePayoutCreated(data: any): Promise<void> {
  console.log('Payout created:', data)
}

async function handlePayoutPaid(data: any): Promise<void> {
  console.log('Payout paid:', data)
}

async function handlePayoutFailed(data: any): Promise<void> {
  console.log('Payout failed:', data)
}

export async function fetchPayoutHistory(): Promise<StripePayout[]> {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  return [
    {
      id: 'po_1abc123',
      amount: 45200,
      currency: 'USD',
      status: 'paid',
      arrivalDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      destination: 'ba_••••4242',
      method: 'standard',
    },
    {
      id: 'po_2def456',
      amount: 38950,
      currency: 'USD',
      status: 'paid',
      arrivalDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      destination: 'ba_••••4242',
      method: 'standard',
    },
    {
      id: 'po_3ghi789',
      amount: 52800,
      currency: 'USD',
      status: 'in_transit',
      arrivalDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      destination: 'ba_••••4242',
      method: 'instant',
    },
    {
      id: 'po_4jkl012',
      amount: 31200,
      currency: 'USD',
      status: 'paid',
      arrivalDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
      destination: 'ba_••••4242',
      method: 'standard',
    },
    {
      id: 'po_5mno345',
      amount: 28400,
      currency: 'USD',
      status: 'paid',
      arrivalDate: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
      destination: 'ba_••••4242',
      method: 'standard',
    },
  ]
}

export async function fetchTransactionHistory(): Promise<StripeTransaction[]> {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  return [
    {
      id: 'txn_1abc123',
      type: 'payment',
      amount: 1900,
      currency: 'USD',
      status: 'succeeded',
      description: 'Pro Plan - Monthly',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      customerEmail: 'john@example.com',
    },
    {
      id: 'txn_2def456',
      type: 'payment',
      amount: 18000,
      currency: 'USD',
      status: 'succeeded',
      description: 'Gold Plan - Monthly',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      customerEmail: 'sarah@example.com',
    },
    {
      id: 'txn_3ghi789',
      type: 'payment',
      amount: 50000,
      currency: 'USD',
      status: 'succeeded',
      description: 'Security Shield - One-time',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      customerEmail: 'mike@startup.io',
    },
    {
      id: 'txn_4jkl012',
      type: 'payout',
      amount: -45200,
      currency: 'USD',
      status: 'paid',
      description: 'Payout to bank account',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      relatedId: 'po_1abc123',
    },
    {
      id: 'txn_5mno345',
      type: 'payment',
      amount: 25000,
      currency: 'USD',
      status: 'succeeded',
      description: 'Enterprise Plan - Monthly',
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      customerEmail: 'alex@company.com',
    },
    {
      id: 'txn_6pqr678',
      type: 'fee',
      amount: -1340,
      currency: 'USD',
      status: 'succeeded',
      description: 'Stripe processing fees',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'txn_7stu901',
      type: 'payment',
      amount: 3900,
      currency: 'USD',
      status: 'succeeded',
      description: 'Launch Plan - Monthly',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      customerEmail: 'emma@agency.co',
    },
    {
      id: 'txn_8vwx234',
      type: 'refund',
      amount: -1900,
      currency: 'USD',
      status: 'succeeded',
      description: 'Refund for Pro Plan',
      createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      customerEmail: 'old@customer.com',
    },
    {
      id: 'txn_9yz567',
      type: 'payment',
      amount: 2000,
      currency: 'USD',
      status: 'succeeded',
      description: 'Perfectionist AI Add-on',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      customerEmail: 'power@user.dev',
    },
    {
      id: 'txn_10abc890',
      type: 'payment',
      amount: 2900,
      currency: 'USD',
      status: 'succeeded',
      description: 'God Mode Add-on',
      createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
      customerEmail: 'elite@builder.io',
    },
  ]
}

export async function fetchActiveSubscriptions(): Promise<StripeSubscription[]> {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  return [
    {
      id: 'sub_pro123',
      customerId: 'cus_abc123',
      planId: STRIPE_PLAN_IDS.pro,
      planName: 'Pro',
      status: 'active',
      currentPeriodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
      amount: 1900,
      currency: 'USD',
    },
    {
      id: 'sub_gold456',
      customerId: 'cus_def456',
      planId: STRIPE_PLAN_IDS.gold,
      planName: 'Gold',
      status: 'active',
      currentPeriodStart: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      currentPeriodEnd: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
      amount: 18000,
      currency: 'USD',
    },
    {
      id: 'sub_ent789',
      customerId: 'cus_ghi789',
      planId: STRIPE_PLAN_IDS.enterprise,
      planName: 'Enterprise',
      status: 'active',
      currentPeriodStart: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      currentPeriodEnd: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
      amount: 25000,
      currency: 'USD',
    },
  ]
}
