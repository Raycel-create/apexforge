export async function seedSubscriptionData() {
  const subscription = {
    id: `sub_${Math.random().toString(36).substring(7)}`,
    plan: 'pro' as const,
    status: 'active' as const,
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    cancelAtPeriodEnd: false
  }

  const paymentMethods = [
    {
      id: `pm_${Math.random().toString(36).substring(7)}`,
      brand: 'visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    }
  ]

  const invoices = [
    {
      id: `in_${Math.random().toString(36).substring(7)}`,
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      amount: 19.00,
      status: 'paid' as const,
      invoiceUrl: 'https://invoice.stripe.com/example'
    },
    {
      id: `in_${Math.random().toString(36).substring(7)}`,
      date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      amount: 19.00,
      status: 'paid' as const,
      invoiceUrl: 'https://invoice.stripe.com/example'
    },
    {
      id: `in_${Math.random().toString(36).substring(7)}`,
      date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      amount: 19.00,
      status: 'paid' as const,
      invoiceUrl: 'https://invoice.stripe.com/example'
    }
  ]

  return { subscription, paymentMethods, invoices }
}
