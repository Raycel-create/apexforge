import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import { Progress } from './ui/progress'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { 
  CreditCard, 
  Receipt, 
  Calendar, 
  ArrowRight, 
  CheckCircle, 
  XCircle,
  Clock,
  Trash,
  Download,
  Warning,
  Crown,
  Rocket,
  Building
} from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useScreenSize } from '../hooks/use-mobile'

interface Subscription {
  id: string
  plan: 'free' | 'pro' | 'launch' | 'enterprise'
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  trialEnd?: string
}

interface PaymentMethod {
  id: string
  brand: string
  last4: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
}

interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'open' | 'void' | 'uncollectible'
  invoiceUrl?: string
}

const PLAN_DETAILS = {
  free: {
    name: 'Free',
    price: 0,
    icon: CheckCircle,
    color: 'text-muted-foreground',
    features: ['5 generations/month', 'Watermarked previews', 'Basic support']
  },
  pro: {
    name: 'Pro',
    price: 19,
    icon: Rocket,
    color: 'text-primary',
    features: ['Unlimited generations', 'No watermarks', 'Priority support', 'Custom domains']
  },
  launch: {
    name: 'Launch',
    price: 39,
    icon: Crown,
    color: 'text-accent',
    features: ['Everything in Pro', 'Auto SSL', 'GitHub repo', 'White-label', 'Instant deploy']
  },
  enterprise: {
    name: 'Enterprise',
    price: 180,
    icon: Building,
    color: 'text-destructive',
    features: ['Everything in Launch', 'Custom agents', 'Team collaboration', 'Dedicated support', 'SLA']
  }
}

export function CustomerPortal() {
  const { isMobile, isTablet } = useScreenSize()
  const [subscription, setSubscription] = useKV<Subscription | null>('user-subscription', null)
  const [paymentMethods, setPaymentMethods] = useKV<PaymentMethod[]>('user-payment-methods', [])
  const [invoices, setInvoices] = useKV<Invoice[]>('user-invoices', [])
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'launch' | 'enterprise' | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const currentPlan = subscription?.plan || 'free'
  const PlanIcon = PLAN_DETAILS[currentPlan].icon

  const handleCancelSubscription = async () => {
    setIsProcessing(true)
    
    setTimeout(() => {
      if (subscription) {
        setSubscription((current) => 
          current ? { ...current, cancelAtPeriodEnd: true, status: 'canceled' } : null
        )
        toast.success('Subscription canceled', {
          description: 'Your subscription will end at the current period'
        })
      }
      setShowCancelDialog(false)
      setIsProcessing(false)
    }, 1500)
  }

  const handleReactivateSubscription = async () => {
    setIsProcessing(true)
    
    setTimeout(() => {
      if (subscription) {
        setSubscription((current) => 
          current ? { ...current, cancelAtPeriodEnd: false, status: 'active' } : null
        )
        toast.success('Subscription reactivated!', {
          description: 'Your subscription will continue after the current period'
        })
      }
      setIsProcessing(false)
    }, 1500)
  }

  const handleUpgrade = async (plan: 'pro' | 'launch' | 'enterprise') => {
    setIsProcessing(true)
    
    setTimeout(() => {
      const newSubscription: Subscription = {
        id: `sub_${Math.random().toString(36).substring(7)}`,
        plan,
        status: 'active',
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false
      }
      
      setSubscription(newSubscription)
      toast.success(`Upgraded to ${PLAN_DETAILS[plan].name}!`, {
        description: 'Your new plan is now active'
      })
      setShowUpgradeDialog(false)
      setSelectedPlan(null)
      setIsProcessing(false)
    }, 2000)
  }

  const handleDownloadInvoice = (invoice: Invoice) => {
    toast.success('Invoice downloaded', {
      description: `Invoice #${invoice.id} has been downloaded`
    })
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      active: { variant: 'default', label: 'Active' },
      canceled: { variant: 'destructive', label: 'Canceled' },
      past_due: { variant: 'destructive', label: 'Past Due' },
      trialing: { variant: 'secondary', label: 'Trial' },
      paid: { variant: 'default', label: 'Paid' },
      open: { variant: 'secondary', label: 'Open' },
      void: { variant: 'outline', label: 'Void' },
      uncollectible: { variant: 'destructive', label: 'Uncollectible' }
    }
    
    const config = variants[status] || { variant: 'outline', label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const daysUntilRenewal = subscription 
    ? Math.ceil((new Date(subscription.currentPeriodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className={`space-y-${isMobile ? '4' : '6'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 className={`text-${isMobile ? '2xl' : '3xl'} font-bold tracking-tight`}>Subscription</h2>
          <p className="text-muted-foreground mt-1">Manage your plan and billing</p>
        </div>
        
        {subscription && currentPlan !== 'enterprise' && (
          <Button
            size={isMobile ? 'sm' : 'default'}
            onClick={() => setShowUpgradeDialog(true)}
            className="gap-2"
          >
            <Crown className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
            Upgrade Plan
          </Button>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-lg bg-primary/10 flex items-center justify-center`}>
                  <PlanIcon className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} ${PLAN_DETAILS[currentPlan].color}`} />
                </div>
                <div>
                  <CardTitle className={`text-${isMobile ? 'lg' : 'xl'}`}>{PLAN_DETAILS[currentPlan].name} Plan</CardTitle>
                  <CardDescription className="mt-1">
                    ${PLAN_DETAILS[currentPlan].price}/month
                  </CardDescription>
                </div>
              </div>
              
              {subscription && getStatusBadge(subscription.status)}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {subscription && subscription.status === 'active' && (
              <div className={`space-y-${isMobile ? '2' : '3'}`}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Current billing period</span>
                  <span className="font-medium">{daysUntilRenewal} days remaining</span>
                </div>
                <Progress value={(30 - daysUntilRenewal) / 30 * 100} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(subscription.currentPeriodStart).toLocaleDateString()}</span>
                  <span>{new Date(subscription.currentPeriodEnd).toLocaleDateString()}</span>
                </div>
              </div>
            )}

            {subscription?.cancelAtPeriodEnd && (
              <div className="flex items-start gap-3 p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <Warning className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-destructive flex-shrink-0 mt-0.5`} />
                <div className="flex-1 space-y-2">
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
                    Your subscription will be canceled on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                  <Button
                    variant="outline"
                    size={isMobile ? 'sm' : 'default'}
                    onClick={handleReactivateSubscription}
                    disabled={isProcessing}
                    className="h-8"
                  >
                    Reactivate Subscription
                  </Button>
                </div>
              </div>
            )}

            <div>
              <h4 className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold mb-${isMobile ? '2' : '3'}`}>Plan Features</h4>
              <ul className={`space-y-${isMobile ? '1.5' : '2'}`}>
                {PLAN_DETAILS[currentPlan].features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-primary flex-shrink-0`} />
                    <span className={isMobile ? 'text-xs' : 'text-sm'}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {subscription && subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
              <div className="pt-4 border-t">
                <Button
                  variant="ghost"
                  size={isMobile ? 'sm' : 'default'}
                  onClick={() => setShowCancelDialog(true)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
                >
                  <XCircle className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                  Cancel Subscription
                </Button>
              </div>
            )}

            {!subscription && (
              <div className="pt-4 border-t">
                <Button
                  className="w-full gap-2"
                  size={isMobile ? 'sm' : 'default'}
                  onClick={() => setShowUpgradeDialog(true)}
                >
                  <Rocket className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                  Upgrade to Pro
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className={`text-${isMobile ? 'lg' : 'xl'}`}>Payment Methods</CardTitle>
            <CardDescription>Manage your payment methods</CardDescription>
          </CardHeader>
          <CardContent>
            {(paymentMethods ?? []).length === 0 ? (
              <div className={`text-center py-${isMobile ? '6' : '8'} text-muted-foreground`}>
                <CreditCard className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} mx-auto mb-3 opacity-50`} />
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} mb-4`}>No payment methods added</p>
                <Button variant="outline" size={isMobile ? 'sm' : 'default'}>
                  Add Payment Method
                </Button>
              </div>
            ) : (
              <div className={`space-y-${isMobile ? '2' : '3'}`}>
                {(paymentMethods ?? []).map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center justify-between p-${isMobile ? '3' : '4'} border rounded-lg hover:bg-accent/50 transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-muted-foreground`} />
                      <div>
                        <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
                          {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)} •••• {method.last4}
                        </p>
                        <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                          Expires {method.expiryMonth}/{method.expiryYear}
                        </p>
                      </div>
                    </div>
                    {method.isDefault && (
                      <Badge variant="secondary" className={isMobile ? 'text-xs' : ''}>Default</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className={`text-${isMobile ? 'lg' : 'xl'}`}>Billing History</CardTitle>
            <CardDescription>View and download your invoices</CardDescription>
          </CardHeader>
          <CardContent>
            {(invoices ?? []).length === 0 ? (
              <div className={`text-center py-${isMobile ? '6' : '8'} text-muted-foreground`}>
                <Receipt className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} mx-auto mb-3 opacity-50`} />
                <p className={isMobile ? 'text-xs' : 'text-sm'}>No invoices yet</p>
              </div>
            ) : (
              <div className={`space-y-${isMobile ? '2' : '3'}`}>
                {(invoices ?? []).map((invoice) => (
                  <div
                    key={invoice.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-${isMobile ? '2' : '3'} p-${isMobile ? '3' : '4'} border rounded-lg hover:bg-accent/50 transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      <Receipt className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-muted-foreground flex-shrink-0`} />
                      <div>
                        <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
                          ${invoice.amount.toFixed(2)}
                        </p>
                        <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                          {new Date(invoice.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(invoice.status)}
                      {invoice.status === 'paid' && (
                        <Button
                          variant="ghost"
                          size={isMobile ? 'sm' : 'default'}
                          onClick={() => handleDownloadInvoice(invoice)}
                          className="gap-1.5"
                        >
                          <Download className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
                          {!isMobile && 'Download'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className={isMobile ? 'max-w-[90vw]' : ''}>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? You'll continue to have access until the end of your current billing period.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className={`gap-2 ${isMobile ? 'flex-col' : ''}`}>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={isProcessing}
              className={isMobile ? 'w-full' : ''}
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={isProcessing}
              className={isMobile ? 'w-full' : ''}
            >
              {isProcessing ? 'Canceling...' : 'Cancel Subscription'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className={`${isMobile ? 'max-w-[95vw] max-h-[90vh] overflow-y-auto' : 'max-w-3xl'}`}>
          <DialogHeader>
            <DialogTitle>Upgrade Your Plan</DialogTitle>
            <DialogDescription>
              Choose a plan that fits your needs
            </DialogDescription>
          </DialogHeader>
          
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-${isMobile ? '3' : '4'} py-4`}>
            {(['pro', 'launch', 'enterprise'] as const).map((plan) => {
              const details = PLAN_DETAILS[plan]
              const Icon = details.icon
              const isCurrentPlan = currentPlan === plan
              
              return (
                <Card 
                  key={plan}
                  className={`relative ${selectedPlan === plan ? 'border-primary shadow-lg' : ''} ${isCurrentPlan ? 'opacity-50' : 'cursor-pointer hover:shadow-md transition-shadow'}`}
                  onClick={() => !isCurrentPlan && setSelectedPlan(plan)}
                >
                  <CardHeader className={`pb-${isMobile ? '3' : '4'}`}>
                    <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-lg bg-primary/10 flex items-center justify-center mb-2`}>
                      <Icon className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} ${details.color}`} />
                    </div>
                    <CardTitle className={isMobile ? 'text-base' : ''}>{details.name}</CardTitle>
                    <div className="text-2xl font-bold">
                      ${details.price}
                      <span className="text-sm text-muted-foreground font-normal">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className={`space-y-${isMobile ? '1.5' : '2'}`}>
                      {details.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-primary flex-shrink-0 mt-0.5`} />
                          <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    {isCurrentPlan && (
                      <Badge variant="secondary" className={`mt-${isMobile ? '3' : '4'} w-full justify-center`}>
                        Current Plan
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <DialogFooter className={`gap-2 ${isMobile ? 'flex-col' : ''}`}>
            <Button
              variant="outline"
              onClick={() => {
                setShowUpgradeDialog(false)
                setSelectedPlan(null)
              }}
              disabled={isProcessing}
              className={isMobile ? 'w-full' : ''}
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedPlan && handleUpgrade(selectedPlan)}
              disabled={!selectedPlan || isProcessing}
              className={`gap-2 ${isMobile ? 'w-full' : ''}`}
            >
              {isProcessing ? 'Processing...' : (
                <>
                  <ArrowRight className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                  {selectedPlan ? `Upgrade to ${PLAN_DETAILS[selectedPlan].name}` : 'Select a plan'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
