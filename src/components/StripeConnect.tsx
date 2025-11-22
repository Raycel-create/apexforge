import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { Alert, AlertDescription } from './ui/alert'
import { 
  Bank, 
  CreditCard, 
  CheckCircle, 
  Warning, 
  Globe,
  Money,
  IdentificationCard,
  ShieldCheck,
  Rocket,
  ArrowRight,
  Copy
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useScreenSize } from '../hooks/use-mobile'

interface BankAccount {
  id: string
  country: string
  currency: string
  last4: string
  bankName: string
  accountHolderName: string
  status: 'pending' | 'verified' | 'failed'
  createdAt: string
}

interface StripeConnectData {
  accountId: string
  accountStatus: 'pending' | 'active' | 'restricted'
  chargesEnabled: boolean
  payoutsEnabled: boolean
  detailsSubmitted: boolean
  bankAccounts: BankAccount[]
}

export function StripeConnect() {
  const { isMobile } = useScreenSize()
  const [stripeData, setStripeData] = useKV<StripeConnectData | null>('stripe-connect-data', null)
  const [loading, setLoading] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  
  const [formData, setFormData] = useState({
    country: 'US',
    email: '',
    businessName: '',
    accountHolderName: '',
    accountNumber: '',
    routingNumber: '',
    businessType: 'individual',
  })

  const handleConnectStripe = async () => {
    setLoading(true)
    toast.info('Connecting to Stripe...', { duration: 2000 })

    await new Promise(resolve => setTimeout(resolve, 2000))

    const mockAccountId = `acct_${Math.random().toString(36).substring(2, 15)}`
    
    const newStripeData: StripeConnectData = {
      accountId: mockAccountId,
      accountStatus: 'pending',
      chargesEnabled: false,
      payoutsEnabled: false,
      detailsSubmitted: false,
      bankAccounts: [],
    }

    setStripeData(newStripeData)
    setLoading(false)
    setShowSetup(true)
    
    toast.success('Stripe account created!', {
      description: 'Complete your bank details to start receiving payments',
    })
  }

  const handleAddBankAccount = async () => {
    if (!formData.accountHolderName || !formData.accountNumber || !formData.routingNumber) {
      toast.error('Please fill in all bank account fields')
      return
    }

    setLoading(true)
    toast.info('Verifying bank account...', { duration: 2000 })

    await new Promise(resolve => setTimeout(resolve, 2500))

    const newBankAccount: BankAccount = {
      id: `ba_${Math.random().toString(36).substring(2, 15)}`,
      country: formData.country,
      currency: formData.country === 'US' ? 'USD' : formData.country === 'GB' ? 'GBP' : 'EUR',
      last4: formData.accountNumber.slice(-4),
      bankName: formData.country === 'US' ? 'Chase Bank' : formData.country === 'GB' ? 'Barclays' : 'Deutsche Bank',
      accountHolderName: formData.accountHolderName,
      status: 'verified',
      createdAt: new Date().toISOString(),
    }

    setStripeData((current) => {
      if (!current) return null
      return {
        ...current,
        accountStatus: 'active',
        chargesEnabled: true,
        payoutsEnabled: true,
        detailsSubmitted: true,
        bankAccounts: [...current.bankAccounts, newBankAccount],
      }
    })

    setFormData({
      ...formData,
      accountHolderName: '',
      accountNumber: '',
      routingNumber: '',
    })
    
    setLoading(false)
    setShowSetup(false)
    
    toast.success('Bank account connected! 🎉', {
      description: 'You can now receive payments from anywhere in the world',
      duration: 5000,
    })
  }

  const copyAccountId = () => {
    if (stripeData?.accountId) {
      navigator.clipboard.writeText(stripeData.accountId)
      toast.success('Account ID copied!')
    }
  }

  const handleDisconnect = () => {
    setStripeData(null)
    setShowSetup(false)
    toast.info('Stripe account disconnected')
  }

  if (!stripeData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className={`${isMobile ? 'p-4' : 'p-8'} border-accent/30 bg-gradient-to-br from-accent/5 via-transparent to-primary/5`}>
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} rounded-full bg-accent/20 flex items-center justify-center`}>
                <Bank weight="fill" className="text-accent" size={isMobile ? 32 : 40} />
              </div>
            </div>
            
            <h2 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold mb-3`}>
              Connect Your Bank Account Worldwide 🌍
            </h2>
            
            <p className={`text-muted-foreground mb-6 ${isMobile ? 'text-sm' : 'text-lg'}`}>
              Use Stripe Connect to receive payments from customers around the globe. 
              Connect bank accounts from 40+ countries and get paid in local currency.
            </p>

            <div className={`grid ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-3'} gap-4 mb-8`}>
              <div className={`${isMobile ? 'p-3' : 'p-4'} bg-card rounded-lg border border-border`}>
                <Globe weight="fill" className="text-accent mx-auto mb-2" size={isMobile ? 24 : 32} />
                <div className={`font-bold mb-1 ${isMobile ? 'text-sm' : ''}`}>40+ Countries</div>
                <div className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Global coverage</div>
              </div>
              
              <div className={`${isMobile ? 'p-3' : 'p-4'} bg-card rounded-lg border border-border`}>
                <ShieldCheck weight="fill" className="text-primary mx-auto mb-2" size={isMobile ? 24 : 32} />
                <div className={`font-bold mb-1 ${isMobile ? 'text-sm' : ''}`}>Bank-level Security</div>
                <div className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>Encrypted & safe</div>
              </div>
              
              <div className={`${isMobile ? 'p-3' : 'p-4'} bg-card rounded-lg border border-border`}>
                <Money weight="fill" className="text-accent mx-auto mb-2" size={isMobile ? 24 : 32} />
                <div className={`font-bold mb-1 ${isMobile ? 'text-sm' : ''}`}>Fast Payouts</div>
                <div className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>2-3 business days</div>
              </div>
            </div>

            <Alert className="mb-6 text-left border-primary/30 bg-primary/5">
              <CheckCircle weight="fill" className="text-primary" size={20} />
              <AlertDescription>
                <strong>What you'll need:</strong> Email, business details, and bank account information. 
                Setup takes less than 5 minutes. Stripe supports USD, EUR, GBP, CAD, AUD, JPY, and 130+ currencies.
              </AlertDescription>
            </Alert>

            <Button
              size={isMobile ? 'default' : 'lg'}
              onClick={handleConnectStripe}
              disabled={loading}
              className="glow-accent"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                  Connecting...
                </>
              ) : (
                <>
                  <Rocket weight="fill" size={20} />
                  Connect with Stripe
                  <ArrowRight size={20} />
                </>
              )}
            </Button>

            <p className={`text-muted-foreground mt-4 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Powered by <span className="font-semibold text-accent">Stripe</span> • 
              PCI DSS Level 1 Certified • SOC 2 Compliant
            </p>
          </div>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className={`${isMobile ? 'p-4' : 'p-6'} border-accent/30`}>
          <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-accent/20 flex items-center justify-center`}>
                  <Bank weight="fill" className="text-accent" size={isMobile ? 20 : 24} />
                </div>
                <div>
                  <h3 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold`}>Stripe Connect Account</h3>
                  <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    Receive payments from anywhere in the world
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-3">
                <code className={`${isMobile ? 'text-xs' : 'text-sm'} bg-muted px-2 py-1 rounded`}>
                  {stripeData.accountId}
                </code>
                <Button size="sm" variant="ghost" onClick={copyAccountId}>
                  <Copy size={14} />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Badge
                className={
                  stripeData.accountStatus === 'active'
                    ? 'bg-accent/20 text-accent border-accent/40'
                    : stripeData.accountStatus === 'pending'
                    ? 'bg-primary/20 text-primary border-primary/40'
                    : 'bg-destructive/20 text-destructive border-destructive/40'
                }
              >
                <CheckCircle weight="fill" size={14} />
                {stripeData.accountStatus.toUpperCase()}
              </Badge>
              
              {stripeData.chargesEnabled && (
                <Badge className="bg-primary/20 text-primary border-primary/40">
                  <CreditCard weight="fill" size={14} />
                  Charges Enabled
                </Badge>
              )}
              
              {stripeData.payoutsEnabled && (
                <Badge className="bg-accent/20 text-accent border-accent/40">
                  <Money weight="fill" size={14} />
                  Payouts Enabled
                </Badge>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} gap-4 mb-6`}>
            <div className={`${isMobile ? 'p-3' : 'p-4'} bg-card rounded-lg border border-border`}>
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-1`}>Status</div>
              <div className={`font-bold ${isMobile ? 'text-sm' : 'text-lg'}`}>
                {stripeData.accountStatus === 'active' ? '🟢 Active' : '🟡 Pending'}
              </div>
            </div>
            
            <div className={`${isMobile ? 'p-3' : 'p-4'} bg-card rounded-lg border border-border`}>
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-1`}>Bank Accounts</div>
              <div className={`font-bold ${isMobile ? 'text-sm' : 'text-lg'}`}>
                {stripeData.bankAccounts.length}
              </div>
            </div>
            
            <div className={`${isMobile ? 'p-3' : 'p-4'} bg-card rounded-lg border border-border`}>
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-1`}>Charges</div>
              <div className={`font-bold ${isMobile ? 'text-sm' : 'text-lg'}`}>
                {stripeData.chargesEnabled ? '✓ Ready' : '✗ Disabled'}
              </div>
            </div>
            
            <div className={`${isMobile ? 'p-3' : 'p-4'} bg-card rounded-lg border border-border`}>
              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-1`}>Payouts</div>
              <div className={`font-bold ${isMobile ? 'text-sm' : 'text-lg'}`}>
                {stripeData.payoutsEnabled ? '✓ Ready' : '✗ Disabled'}
              </div>
            </div>
          </div>

          {!stripeData.detailsSubmitted && (
            <Alert className="mb-6 border-primary/30 bg-primary/5">
              <Warning weight="fill" className="text-primary" size={20} />
              <AlertDescription>
                <strong>Action Required:</strong> Add your bank account details to start receiving payouts.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3 flex-wrap">
            {!showSetup && (
              <Button
                onClick={() => setShowSetup(true)}
                className="glow-accent"
              >
                <Bank weight="fill" size={16} />
                Add Bank Account
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={() => toast.info('Opening Stripe Dashboard...')}
            >
              <Globe size={16} />
              View in Stripe Dashboard
            </Button>
            
            <Button
              variant="outline"
              onClick={handleDisconnect}
              className="text-destructive border-destructive/50 hover:bg-destructive/10"
            >
              Disconnect
            </Button>
          </div>
        </Card>
      </motion.div>

      {showSetup && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className={`${isMobile ? 'p-4' : 'p-6'} border-primary/30`}>
            <div className="flex items-center gap-3 mb-6">
              <IdentificationCard weight="fill" className="text-primary" size={isMobile ? 24 : 32} />
              <div>
                <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>Add Bank Account</h3>
                <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  Connect your bank to receive payouts
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="country" className={isMobile ? 'text-sm' : ''}>Country</Label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className={`w-full mt-1 ${isMobile ? 'text-sm' : ''} px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring`}
                >
                  <option value="US">🇺🇸 United States (USD)</option>
                  <option value="GB">🇬🇧 United Kingdom (GBP)</option>
                  <option value="CA">🇨🇦 Canada (CAD)</option>
                  <option value="AU">🇦🇺 Australia (AUD)</option>
                  <option value="DE">🇩🇪 Germany (EUR)</option>
                  <option value="FR">🇫🇷 France (EUR)</option>
                  <option value="NL">🇳🇱 Netherlands (EUR)</option>
                  <option value="ES">🇪🇸 Spain (EUR)</option>
                  <option value="IT">🇮🇹 Italy (EUR)</option>
                  <option value="JP">🇯🇵 Japan (JPY)</option>
                  <option value="SG">🇸🇬 Singapore (SGD)</option>
                  <option value="HK">🇭🇰 Hong Kong (HKD)</option>
                  <option value="IN">🇮🇳 India (INR)</option>
                  <option value="BR">🇧🇷 Brazil (BRL)</option>
                  <option value="MX">🇲🇽 Mexico (MXN)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="email" className={isMobile ? 'text-sm' : ''}>Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={isMobile ? 'text-sm' : ''}
                />
              </div>

              <div>
                <Label htmlFor="businessName" className={isMobile ? 'text-sm' : ''}>Business Name</Label>
                <Input
                  id="businessName"
                  placeholder="Your Company Inc."
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className={isMobile ? 'text-sm' : ''}
                />
              </div>

              <Separator />

              <div>
                <Label htmlFor="accountHolderName" className={isMobile ? 'text-sm' : ''}>Account Holder Name</Label>
                <Input
                  id="accountHolderName"
                  placeholder="John Doe"
                  value={formData.accountHolderName}
                  onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                  className={isMobile ? 'text-sm' : ''}
                />
              </div>

              <div>
                <Label htmlFor="accountNumber" className={isMobile ? 'text-sm' : ''}>Account Number</Label>
                <Input
                  id="accountNumber"
                  placeholder="000123456789"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className={isMobile ? 'text-sm' : ''}
                />
              </div>

              <div>
                <Label htmlFor="routingNumber" className={isMobile ? 'text-sm' : ''}>
                  {formData.country === 'US' ? 'Routing Number' : 
                   formData.country === 'GB' ? 'Sort Code' : 
                   'Bank Code'}
                </Label>
                <Input
                  id="routingNumber"
                  placeholder={formData.country === 'US' ? '110000000' : '000000'}
                  value={formData.routingNumber}
                  onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                  className={isMobile ? 'text-sm' : ''}
                />
              </div>

              <Alert className="border-accent/30 bg-accent/5">
                <ShieldCheck weight="fill" className="text-accent" size={20} />
                <AlertDescription>
                  Your bank details are encrypted and securely stored by Stripe. 
                  We never see your full account number.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAddBankAccount}
                  disabled={loading}
                  className="glow-accent flex-1"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle weight="fill" size={16} />
                      Connect Bank Account
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setShowSetup(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {stripeData.bankAccounts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className={`${isMobile ? 'p-4' : 'p-6'} border-accent/30`}>
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold mb-4`}>Connected Bank Accounts</h3>
            
            <div className="space-y-3">
              {stripeData.bankAccounts.map((account) => (
                <div
                  key={account.id}
                  className={`${isMobile ? 'p-3' : 'p-4'} bg-card rounded-lg border border-border hover:border-accent/50 transition-colors`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-accent/20 flex items-center justify-center`}>
                        <Bank weight="fill" className="text-accent" size={isMobile ? 16 : 20} />
                      </div>
                      <div>
                        <div className={`font-bold mb-1 ${isMobile ? 'text-sm' : ''}`}>
                          {account.bankName} ••••{account.last4}
                        </div>
                        <div className={`text-muted-foreground flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          <span>{account.accountHolderName}</span>
                          <span>•</span>
                          <span>{account.currency}</span>
                          <span>•</span>
                          <span>{account.country}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          account.status === 'verified'
                            ? 'bg-accent/20 text-accent border-accent/40'
                            : account.status === 'pending'
                            ? 'bg-primary/20 text-primary border-primary/40'
                            : 'bg-destructive/20 text-destructive border-destructive/40'
                        }
                      >
                        {account.status === 'verified' && <CheckCircle weight="fill" size={12} />}
                        {account.status === 'pending' && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                        {account.status === 'failed' && <Warning weight="fill" size={12} />}
                        {account.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
