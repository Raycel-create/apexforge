import { useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { 
  CreditCard, 
  Lock, 
  CheckCircle,
  Lightning,
  ShieldCheck
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { createCheckoutSession, STRIPE_PLAN_PRICES } from '../lib/stripeIntegration'
import { useScreenSize } from '../hooks/use-mobile'

interface StripeCheckoutProps {
  planId: string
  planName: string
  planPrice: number
  onSuccess?: () => void
  onCancel?: () => void
}

export function StripeCheckout({ 
  planId, 
  planName, 
  planPrice, 
  onSuccess,
  onCancel 
}: StripeCheckoutProps) {
  const { isMobile } = useScreenSize()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100)
  }

  const handleCheckout = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }

    setLoading(true)
    toast.info('Creating checkout session...', { duration: 1500 })

    try {
      const session = await createCheckoutSession(
        planId,
        email,
        `${window.location.origin}/dashboard?success=true`,
        `${window.location.origin}/pricing?canceled=true`
      )

      toast.success('Redirecting to Stripe Checkout...', {
        description: 'In production, you would be redirected to the secure payment page',
        duration: 4000,
      })

      setTimeout(() => {
        toast.success('Payment successful! 🎉', {
          description: `You are now subscribed to the ${planName} plan`,
          duration: 5000,
        })
        onSuccess?.()
      }, 2000)
    } catch (error) {
      toast.error('Failed to create checkout session')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className={`${isMobile ? 'p-4' : 'p-6'} border-primary/30 max-w-md mx-auto`}>
        <div className="text-center mb-6">
          <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4`}>
            <Lightning weight="fill" className="text-primary" size={isMobile ? 24 : 32} />
          </div>
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-2`}>
            Upgrade to {planName}
          </h2>
          <div className="flex items-baseline justify-center gap-2">
            <span className={`${isMobile ? 'text-3xl' : 'text-4xl'} font-bold text-primary`}>
              {formatAmount(planPrice)}
            </span>
            <span className="text-muted-foreground">/month</span>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="checkout-email" className={isMobile ? 'text-sm' : ''}>
              Email Address
            </Label>
            <Input
              id="checkout-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 ${isMobile ? 'text-sm' : ''}`}
            />
            <p className={`text-muted-foreground mt-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Receipt will be sent to this email
            </p>
          </div>

          <div className={`${isMobile ? 'p-3' : 'p-4'} bg-accent/5 rounded-lg border border-accent/30`}>
            <div className="flex items-start gap-3">
              <ShieldCheck weight="fill" className="text-accent flex-shrink-0" size={20} />
              <div>
                <p className={`font-medium mb-1 ${isMobile ? 'text-sm' : ''}`}>
                  Secure Payment with Stripe
                </p>
                <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  Your payment information is encrypted and secure. We never see your card details.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className={`flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              <CheckCircle weight="fill" className="text-accent" size={16} />
              <span>Cancel anytime, no contracts</span>
            </div>
            <div className={`flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              <CheckCircle weight="fill" className="text-accent" size={16} />
              <span>Instant access after payment</span>
            </div>
            <div className={`flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              <CheckCircle weight="fill" className="text-accent" size={16} />
              <span>24/7 customer support</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleCheckout}
            disabled={loading || !email}
            className="flex-1 glow-primary"
            size={isMobile ? 'default' : 'lg'}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard weight="fill" size={20} />
                Continue to Stripe
              </>
            )}
          </Button>
          
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              size={isMobile ? 'default' : 'lg'}
            >
              Cancel
            </Button>
          )}
        </div>

        <p className={`text-center text-muted-foreground mt-4 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          <Lock className="inline" size={12} /> Secured by Stripe • PCI DSS Level 1
        </p>
      </Card>
    </motion.div>
  )
}
