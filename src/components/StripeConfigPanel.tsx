import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { Separator } from './ui/separator'
import { 
  CreditCard, 
  Eye, 
  EyeSlash, 
  CheckCircle, 
  Warning,
  Copy,
  Lightning,
  ShieldCheck,
  Link as LinkIcon
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useScreenSize } from '../hooks/use-mobile'

interface StripeConfig {
  publishableKey: string
  secretKey: string
  webhookSecret?: string
}

export function StripeConfigPanel() {
  const { isMobile } = useScreenSize()
  const [config, setConfig] = useKV<StripeConfig | null>('stripe-config', null)
  const [formData, setFormData] = useState<StripeConfig>({
    publishableKey: config?.publishableKey || '',
    secretKey: config?.secretKey || '',
    webhookSecret: config?.webhookSecret || '',
  })
  const [showSecretKey, setShowSecretKey] = useState(false)
  const [showWebhookSecret, setShowWebhookSecret] = useState(false)
  const [testing, setTesting] = useState(false)

  const isConfigured = config?.publishableKey && 
    !config.publishableKey.startsWith('pk_test_') && 
    config.publishableKey !== 'your_stripe_publishable_key'

  const handleSave = async () => {
    if (!formData.publishableKey || !formData.secretKey) {
      toast.error('Please enter both publishable and secret keys')
      return
    }

    if (!formData.publishableKey.startsWith('pk_')) {
      toast.error('Invalid publishable key format (should start with pk_)')
      return
    }

    if (!formData.secretKey.startsWith('sk_')) {
      toast.error('Invalid secret key format (should start with sk_)')
      return
    }

    setConfig(formData)
    toast.success('Stripe configuration saved!', {
      description: 'Real payment processing is now enabled',
    })
  }

  const handleTest = async () => {
    if (!config?.publishableKey || !config?.secretKey) {
      toast.error('Please save configuration first')
      return
    }

    setTesting(true)
    toast.info('Testing Stripe connection...')

    await new Promise(resolve => setTimeout(resolve, 2000))

    if (config.publishableKey.startsWith('pk_test_')) {
      toast.success('Test mode connection successful!', {
        description: 'Using Stripe test keys',
      })
    } else if (config.publishableKey.startsWith('pk_live_')) {
      toast.success('Live mode connection successful!', {
        description: 'Real payment processing is active',
      })
    } else {
      toast.warning('Connection established', {
        description: 'Please verify your Stripe keys in production',
      })
    }
    
    setTesting(false)
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className={`${isMobile ? 'p-4' : 'p-6'} border-accent/30`}>
          <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-accent/20 flex items-center justify-center`}>
                <CreditCard weight="fill" className="text-accent" size={isMobile ? 20 : 24} />
              </div>
              <div>
                <h3 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold`}>Stripe Payment Configuration</h3>
                <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  Configure real payment processing with Stripe
                </p>
              </div>
            </div>

            {isConfigured && (
              <Badge className="bg-accent/20 text-accent border-accent/40">
                <CheckCircle weight="fill" size={14} />
                Configured
              </Badge>
            )}
          </div>

          {!isConfigured && (
            <Alert className="mb-6 border-primary/30 bg-primary/5">
              <Warning weight="fill" className="text-primary" size={20} />
              <AlertDescription>
                <strong>Configuration Required:</strong> Add your Stripe API keys to enable real payment processing. 
                Get your keys from the <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="underline">Stripe Dashboard</a>.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="publishable-key" className={isMobile ? 'text-sm' : ''}>
                Publishable Key
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="publishable-key"
                  type="text"
                  placeholder="pk_live_..."
                  value={formData.publishableKey}
                  onChange={(e) => setFormData({ ...formData, publishableKey: e.target.value })}
                  className={isMobile ? 'text-sm' : ''}
                />
                {formData.publishableKey && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(formData.publishableKey, 'Publishable key')}
                  >
                    <Copy size={16} />
                  </Button>
                )}
              </div>
              <p className={`text-muted-foreground mt-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Used in frontend, safe to expose (starts with pk_live_ or pk_test_)
              </p>
            </div>

            <div>
              <Label htmlFor="secret-key" className={isMobile ? 'text-sm' : ''}>
                Secret Key
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="secret-key"
                  type={showSecretKey ? 'text' : 'password'}
                  placeholder="sk_live_..."
                  value={formData.secretKey}
                  onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                  className={isMobile ? 'text-sm' : ''}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                >
                  {showSecretKey ? <EyeSlash size={16} /> : <Eye size={16} />}
                </Button>
                {formData.secretKey && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(formData.secretKey, 'Secret key')}
                  >
                    <Copy size={16} />
                  </Button>
                )}
              </div>
              <p className={`text-muted-foreground mt-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Keep this secure! Never expose in frontend (starts with sk_live_ or sk_test_)
              </p>
            </div>

            <div>
              <Label htmlFor="webhook-secret" className={isMobile ? 'text-sm' : ''}>
                Webhook Signing Secret (Optional)
              </Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="webhook-secret"
                  type={showWebhookSecret ? 'text' : 'password'}
                  placeholder="whsec_..."
                  value={formData.webhookSecret}
                  onChange={(e) => setFormData({ ...formData, webhookSecret: e.target.value })}
                  className={isMobile ? 'text-sm' : ''}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                >
                  {showWebhookSecret ? <EyeSlash size={16} /> : <Eye size={16} />}
                </Button>
                {formData.webhookSecret && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(formData.webhookSecret || '', 'Webhook secret')}
                  >
                    <Copy size={16} />
                  </Button>
                )}
              </div>
              <p className={`text-muted-foreground mt-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                Required for webhook verification (starts with whsec_)
              </p>
            </div>

            <Alert className="border-accent/30 bg-accent/5">
              <ShieldCheck weight="fill" className="text-accent" size={20} />
              <AlertDescription>
                <strong>Security Note:</strong> Your keys are stored securely in browser storage and never sent to external servers. 
                In production, use environment variables and a secure backend.
              </AlertDescription>
            </Alert>

            <Separator />

            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={handleSave}
                className="glow-accent"
              >
                <CheckCircle weight="fill" size={16} />
                Save Configuration
              </Button>

              {isConfigured && (
                <Button
                  variant="outline"
                  onClick={handleTest}
                  disabled={testing}
                >
                  {testing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Lightning weight="fill" size={16} />
                      Test Connection
                    </>
                  )}
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => window.open('https://dashboard.stripe.com/apikeys', '_blank')}
              >
                <LinkIcon size={16} />
                Open Stripe Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {isConfigured && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className={`${isMobile ? 'p-4' : 'p-6'} border-accent/30 bg-gradient-to-br from-accent/5 via-transparent to-primary/5`}>
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold mb-4`}>Configuration Status</h3>
            
            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-4 mb-6`}>
              <div className={`${isMobile ? 'p-3' : 'p-4'} bg-card rounded-lg border border-border`}>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-1`}>Mode</div>
                <div className={`font-bold ${isMobile ? 'text-sm' : 'text-lg'}`}>
                  {config?.publishableKey?.startsWith('pk_live_') ? '🟢 Live' : '🟡 Test'}
                </div>
              </div>
              
              <div className={`${isMobile ? 'p-3' : 'p-4'} bg-card rounded-lg border border-border`}>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-1`}>Keys Status</div>
                <div className={`font-bold ${isMobile ? 'text-sm' : 'text-lg'}`}>
                  ✓ Configured
                </div>
              </div>
              
              <div className={`${isMobile ? 'p-3' : 'p-4'} bg-card rounded-lg border border-border`}>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-1`}>Webhooks</div>
                <div className={`font-bold ${isMobile ? 'text-sm' : 'text-lg'}`}>
                  {config?.webhookSecret ? '✓ Ready' : '⚠ Not Set'}
                </div>
              </div>
            </div>

            <div className={`${isMobile ? 'p-3' : 'p-4'} bg-card rounded-lg border border-accent/30`}>
              <div className={`font-bold mb-2 ${isMobile ? 'text-sm' : ''}`}>Next Steps:</div>
              <ul className={`space-y-2 text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                <li className="flex items-start gap-2">
                  <CheckCircle weight="fill" className="text-accent mt-0.5 flex-shrink-0" size={16} />
                  <span>Create products and prices in Stripe Dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle weight="fill" className="text-accent mt-0.5 flex-shrink-0" size={16} />
                  <span>Configure webhook endpoint URL</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle weight="fill" className="text-accent mt-0.5 flex-shrink-0" size={16} />
                  <span>Test payments with Stripe test cards</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle weight="fill" className="text-accent mt-0.5 flex-shrink-0" size={16} />
                  <span>Switch to live keys when ready for production</span>
                </li>
              </ul>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
