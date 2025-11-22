import { Check, Sparkle, Lightning, Shield, TreeStructure, Fire, Lock, Globe } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

type Page = 'home' | 'dashboard' | 'pricing' | 'ceo' | 'generator'

interface PricingProps {
  onNavigate: (page: Page) => void
}

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying The Forge',
    features: [
      '5 generations per month',
      'Watermarked preview only',
      'AI debate panel access',
      'Basic models (GPT, Claude)',
      'Community support',
    ],
    limitations: [
      'No live deployment',
      'No Fusion Mode',
      'No Evolve feature',
    ],
    cta: 'Start Free',
    highlight: false,
    color: 'border-border',
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'per month',
    description: 'Unlimited builds with live deployment',
    features: [
      'Unlimited generations',
      'apexforge.app subdomain',
      'Live HTTPS deployment',
      'All 5 AI models (GPT, Claude, Grok, Gemini, Llama)',
      'Fusion Mode included',
      'Evolve button unlocked',
      'Priority generation queue',
      'Download source code',
    ],
    limitations: [],
    cta: 'Go Pro',
    highlight: true,
    color: 'border-primary/50 bg-primary/5',
  },
  {
    name: 'Launch',
    price: '$39',
    period: 'per month',
    description: 'For serious projects going live',
    features: [
      'Everything in Pro',
      'Custom domain support',
      'Auto SSL certificates',
      'GitHub repo integration',
      'Daily auto-backups',
      'White-label (remove branding)',
      'Instant deploy (&lt;3 sec)',
      'Advanced Evolve features',
      'Priority support',
    ],
    limitations: [],
    cta: 'Upgrade to Launch',
    highlight: false,
    color: 'border-accent/30',
  },
]

export function Pricing({ onNavigate }: PricingProps) {
  const handleUpgrade = (planName: string) => {
    if (planName === 'Free') {
      onNavigate('generator')
      return
    }
    toast.success(`Redirecting to Stripe checkout for ${planName}...`, {
      description: 'In production, this integrates with Stripe',
    })
  }

  const handleSecurityUpgrade = () => {
    toast.success('Redirecting to $500 Security Shield checkout...', {
      description: 'One-time payment via Stripe',
      duration: 3000,
    })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 px-6 py-3 bg-destructive/20 text-destructive border-destructive/40 text-base">
            <Fire weight="fill" size={18} />
            This Just Killed Emergent.sh's Pricing Model
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Simple, Radically{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Better Pricing
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            While competitors charge $50+ just for basic features, we give you live deployment, all AI models, and Fusion Mode starting at $19.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <Card className="p-8 bg-accent/10 border-accent/30 glow-accent">
            <div className="flex items-center justify-center gap-3 mb-6">
              <TreeStructure weight="fill" className="text-accent" size={40} />
              <h2 className="text-3xl font-bold">Not Sure What to Build?</h2>
            </div>
            <p className="text-center text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Use our <span className="text-accent font-semibold">FREE Idea Incubator</span> (no credits used) to generate 5 validated app ideas with wireframes, tech stack, and revenue models in 30 seconds.
            </p>
            <div className="text-center">
              <Button
                size="lg"
                onClick={() => onNavigate('generator')}
                className="text-xl px-8 py-6 glow-accent bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <TreeStructure weight="fill" size={24} />
                Try FREE Idea Incubator Now
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {PLANS.map((plan, idx) => (
            <Card
              key={plan.name}
              className={`p-8 relative overflow-hidden ${plan.color} ${
                plan.highlight ? 'transform scale-105' : ''
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/30 rounded-full blur-3xl" />
              )}
              
              <div className="relative z-10">
                {plan.highlight && (
                  <Badge className="mb-4 bg-primary text-primary-foreground glow-primary">
                    <Fire weight="fill" size={14} />
                    Most Popular
                  </Badge>
                )}
                
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground mb-6 min-h-[48px]">{plan.description}</p>

                <Button
                  onClick={() => handleUpgrade(plan.name)}
                  className={`w-full mb-6 py-6 text-lg ${
                    plan.highlight ? 'glow-primary' : ''
                  }`}
                  variant={plan.highlight ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>

                <div className="space-y-3 mb-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check weight="bold" className="text-accent shrink-0 mt-1" size={18} />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.limitations.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-start gap-2 opacity-50">
                          <span className="text-xs">✗ {limitation}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Card>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <Card className="relative overflow-hidden border-destructive/40 bg-gradient-to-br from-destructive/10 via-card to-destructive/5">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNGgtMnYyaDJ2LTJ6bTAtOGgydi0yaC0ydjJ6bS0yLTJ2Mmgydi0yaC0yem0tMiAydjJoMnYtMmgtMnptMiA0aDJ2LTJoLTJ2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
            
            <div className="relative p-10">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-destructive/20 flex items-center justify-center glow-destructive flex-shrink-0">
                  <Shield weight="fill" className="text-destructive" size={32} />
                </div>
                <div className="flex-1">
                  <Badge className="mb-3 bg-destructive/30 text-destructive border-destructive">
                    <Lock weight="fill" size={14} />
                    Premium One-Time Add-On
                  </Badge>
                  <h2 className="text-3xl font-bold mb-2">Enterprise-Grade Man-in-the-Middle AI Security Shield</h2>
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-5xl font-bold text-destructive">$500</span>
                    <span className="text-muted-foreground">one-time payment (not recurring)</span>
                  </div>
                  <p className="text-lg text-muted-foreground mb-6">
                    Add an always-on AI security agent that sits between your app and the internet, scanning and blocking threats in real-time before they reach your users.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Check weight="bold" className="text-destructive shrink-0 mt-1" size={18} />
                    <div>
                      <span className="font-semibold block">Real-time threat scanning</span>
                      <span className="text-sm text-muted-foreground">SQLi, XSS, RCE, prompt injection</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check weight="bold" className="text-destructive shrink-0 mt-1" size={18} />
                    <div>
                      <span className="font-semibold block">Auto-blocks malicious traffic</span>
                      <span className="text-sm text-muted-foreground">Before it hits your app</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check weight="bold" className="text-destructive shrink-0 mt-1" size={18} />
                    <div>
                      <span className="font-semibold block">Daily AI-generated security reports</span>
                      <span className="text-sm text-muted-foreground">Emailed to you every morning</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Check weight="bold" className="text-destructive shrink-0 mt-1" size={18} />
                    <div>
                      <span className="font-semibold block">Zero-config deployment</span>
                      <span className="text-sm text-muted-foreground">We deploy it automatically on your domain</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check weight="bold" className="text-destructive shrink-0 mt-1" size={18} />
                    <div>
                      <span className="font-semibold block">Powered by Claude 3.5 + Grok-2</span>
                      <span className="text-sm text-muted-foreground">Private hybrid AI agent</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check weight="bold" className="text-destructive shrink-0 mt-1" size={18} />
                    <div>
                      <span className="font-semibold block">Glowing shield badge</span>
                      <span className="text-sm text-muted-foreground">Show users you're protected</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                onClick={handleSecurityUpgrade}
                className="w-full py-7 text-xl glow-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                <Shield weight="fill" size={24} />
                Fortify Your App Forever - $500 One-Time
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                💡 Perfect for apps handling sensitive data, payments, or user authentication
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <Card className="p-8 border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5 text-center">
            <Globe weight="fill" className="mx-auto mb-4 text-primary" size={48} />
            <h3 className="text-2xl font-bold mb-2">Want It LIVE on Your Domain Instantly?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              <span className="text-accent font-semibold">Upgrade to Launch</span> for custom domain support, auto SSL, GitHub integration, and instant deploy in under 3 seconds.
            </p>
            <Button
              size="lg"
              onClick={() => handleUpgrade('Launch')}
              className="text-lg px-8 py-6 glow-primary"
            >
              <Lightning weight="fill" size={20} />
              Upgrade to Launch - $39/mo
            </Button>
          </Card>
        </motion.div>

        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold mb-8">Frequently Asked Questions</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-3 max-w-5xl mx-auto">
          <Card className="p-3">
            <h4 className="font-semibold mb-1 text-xs">Live deploy speed?</h4>
            <p className="text-[10px] text-muted-foreground leading-tight">
              Under 10 sec. Launch users get &lt;3 sec.
            </p>
          </Card>
          <Card className="p-3">
            <h4 className="font-semibold mb-1 text-xs">Cancel anytime?</h4>
            <p className="text-[10px] text-muted-foreground leading-tight">
              Yes! No contracts. Shield is yours forever.
            </p>
          </Card>
          <Card className="p-3">
            <h4 className="font-semibold mb-1 text-xs">AI Debate Panel?</h4>
            <p className="text-[10px] text-muted-foreground leading-tight">
              5 AIs argue live. You vote. No competitor has this.
            </p>
          </Card>
          <Card className="p-3">
            <h4 className="font-semibold mb-1 text-xs">Own the code?</h4>
            <p className="text-[10px] text-muted-foreground leading-tight">
              100% yours. Download, modify, sell anywhere.
            </p>
          </Card>
          <Card className="p-3">
            <h4 className="font-semibold mb-1 text-xs">Fusion Mode?</h4>
            <p className="text-[10px] text-muted-foreground leading-tight">
              3 versions. Drag-drop parts. Create hybrid.
            </p>
          </Card>
          <Card className="p-3">
            <h4 className="font-semibold mb-1 text-xs">$500 Shield worth it?</h4>
            <p className="text-[10px] text-muted-foreground leading-tight">
              One-time for lifetime AI threat protection.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
