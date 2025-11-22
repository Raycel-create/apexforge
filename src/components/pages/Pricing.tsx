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
      '15 credits total',
      '2 AI models (slow)',
      'AI debate panel access',
      'Basic features',
      'Community support',
    ],
    limitations: [
      'No live deployment',
      'No Fusion Mode',
      'No Evolve feature',
      'No integrations',
    ],
    cta: 'Start Free',
    highlight: false,
    color: 'border-border',
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'per month',
    description: 'For developers building real apps',
    features: [
      '125 credits/month',
      '2 AI models',
      'Live HTTPS deployment',
      'All AI models',
      'Fusion Mode included',
      'Evolve button unlocked',
      '4 integrations: Extensions, Voice, Backend, SEO',
      'Download source code',
    ],
    limitations: [],
    cta: 'Go Pro',
    highlight: true,
    color: 'border-primary/50 bg-primary/5',
  },
  {
    name: 'Gold',
    price: '$180',
    period: 'per month',
    description: 'For serious projects going native',
    features: [
      '1,500 credits/month',
      '5 AI models',
      'Everything in Pro',
      'Native mobile (iOS/Android builds)',
      'Desktop apps (macOS/Windows/Linux)',
      'User testing & heatmaps',
      'One-click App Store submission',
      'Priority support',
    ],
    limitations: [],
    cta: 'Upgrade to Gold',
    highlight: false,
    color: 'border-accent/30',
  },
  {
    name: 'Enterprise',
    price: '$250',
    period: 'per month',
    description: 'All integrations unlocked',
    features: [
      '3,000 credits/month',
      '7 AI models',
      'Everything in Gold',
      'All 11 integrations',
      'Figma Two-Way sync',
      'White-label (custom domain)',
      'AI PM (ForgeMaster)',
      'Dedicated support',
    ],
    limitations: [],
    cta: 'Go Enterprise',
    highlight: false,
    color: 'border-destructive/30',
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
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-10 lg:mb-12"
        >
          <Badge className="mb-3 sm:mb-4 px-4 sm:px-6 py-2 sm:py-3 bg-destructive/20 text-destructive border-destructive/40 text-xs sm:text-sm lg:text-base">
            <Fire weight="fill" className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px]" />
            This Just Killed Emergent.sh's Pricing Model
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 px-2">
            Simple, Radically{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Better Pricing
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            While competitors charge $50+ just for basic features, we give you live deployment, all AI models, and Fusion Mode starting at $19.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 sm:mb-12 lg:mb-16"
        >
          <Card className="p-4 sm:p-6 lg:p-8 bg-accent/10 border-accent/30 glow-accent">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <TreeStructure weight="fill" className="text-accent w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10" />
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center sm:text-left">Not Sure What to Build?</h2>
            </div>
            <p className="text-center text-sm sm:text-base lg:text-lg text-muted-foreground mb-4 sm:mb-6 max-w-2xl mx-auto px-2">
              Use our <span className="text-accent font-semibold">FREE Idea Incubator</span> (no credits used) to generate 5 validated app ideas with wireframes, tech stack, and revenue models in 30 seconds.
            </p>
            <div className="text-center">
              <Button
                size="lg"
                onClick={() => onNavigate('generator')}
                className="text-base sm:text-lg lg:text-xl px-6 sm:px-7 lg:px-8 py-4 sm:py-5 lg:py-6 glow-accent bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto"
              >
                <TreeStructure weight="fill" className="w-5 h-5 sm:w-6 sm:h-6" />
                Try FREE Idea Incubator Now
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-10 sm:mb-12 lg:mb-16"
        >
          {PLANS.map((plan, idx) => (
            <Card
              key={plan.name}
              className={`p-4 sm:p-6 lg:p-8 relative overflow-hidden ${plan.color} ${
                plan.highlight ? 'sm:transform sm:scale-105 border-2' : ''
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-10 -right-10 w-32 h-32 sm:w-40 sm:h-40 bg-primary/30 rounded-full blur-3xl" />
              )}
              
              <div className="relative z-10">
                {plan.highlight && (
                  <Badge className="mb-3 sm:mb-4 bg-primary text-primary-foreground glow-primary text-xs sm:text-sm">
                    <Fire weight="fill" className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    Most Popular
                  </Badge>
                )}
                
                <h3 className="text-xl sm:text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-3 sm:mb-4">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2 text-xs sm:text-sm">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base min-h-[40px] sm:min-h-[48px]">{plan.description}</p>

                <Button
                  onClick={() => handleUpgrade(plan.name)}
                  className={`w-full mb-4 sm:mb-6 py-4 sm:py-5 lg:py-6 text-base sm:text-lg ${
                    plan.highlight ? 'glow-primary' : ''
                  }`}
                  variant={plan.highlight ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>

                <div className="space-y-2 sm:space-y-3 mb-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check weight="bold" className="text-accent shrink-0 mt-0.5 sm:mt-1 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                      <span className="text-xs sm:text-sm leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.limitations.length > 0 && (
                  <>
                    <Separator className="my-3 sm:my-4" />
                    <div className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-start gap-2 opacity-50">
                          <span className="text-[10px] sm:text-xs leading-tight">✗ {limitation}</span>
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
          transition={{ delay: 0.25 }}
          className="mb-10 sm:mb-12 lg:mb-16"
        >
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Powerful Add-Ons</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Available for all paid plans</p>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <Card className="p-4 sm:p-6 border-primary/30 bg-primary/5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Sparkle weight="fill" className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1">Perfectionist AI</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl sm:text-3xl font-bold text-primary">$20</span>
                    <span className="text-muted-foreground text-xs sm:text-sm">/month</span>
                  </div>
                </div>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                Automatically refines your prompts with smart auto-suggestions to save credits and get better results
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2 text-xs sm:text-sm">
                  <Check weight="bold" className="text-primary shrink-0 mt-0.5" size={16} />
                  Prompt refiner in dropdown
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm">
                  <Check weight="bold" className="text-primary shrink-0 mt-0.5" size={16} />
                  Auto-suggest essentials (DB, Auth, etc.)
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm">
                  <Check weight="bold" className="text-primary shrink-0 mt-0.5" size={16} />
                  Smart completion
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm">
                  <Check weight="bold" className="text-primary shrink-0 mt-0.5" size={16} />
                  Saves credits with better prompts
                </li>
              </ul>
              <Button className="w-full glow-primary" onClick={() => toast.success('Redirecting to Perfectionist AI checkout...')}>
                Add to Plan
              </Button>
            </Card>

            <Card className="p-4 sm:p-6 border-accent/30 bg-accent/5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Lightning weight="fill" className="text-accent" size={20} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1">God Mode</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl sm:text-3xl font-bold text-accent">$29</span>
                    <span className="text-muted-foreground text-xs sm:text-sm">/month</span>
                  </div>
                </div>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                Self-healing apps with vibe detection and quantum optimization for zero-downtime deploys
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2 text-xs sm:text-sm">
                  <Check weight="bold" className="text-accent shrink-0 mt-0.5" size={16} />
                  Auto-fix runtime errors
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm">
                  <Check weight="bold" className="text-accent shrink-0 mt-0.5" size={16} />
                  Vibe-based design adjustments
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm">
                  <Check weight="bold" className="text-accent shrink-0 mt-0.5" size={16} />
                  Quantum optimization
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm">
                  <Check weight="bold" className="text-accent shrink-0 mt-0.5" size={16} />
                  Zero-downtime deploys
                </li>
              </ul>
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground glow-accent" onClick={() => toast.success('Redirecting to God Mode checkout...')}>
                Add to Plan
              </Button>
            </Card>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10 sm:mb-12 lg:mb-16"
        >
          <Card className="relative overflow-hidden border-destructive/40 bg-gradient-to-br from-destructive/10 via-card to-destructive/5">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNGgtMnYyaDJ2LTJ6bTAtOGgydi0yaC0ydjJ6bS0yLTJ2Mmgydi0yaC0yem0tMiAydjJoMnYtMmgtMnptMiA0aDJ2LTJoLTJ2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
            
            <div className="relative p-4 sm:p-6 lg:p-10">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-destructive/20 flex items-center justify-center glow-destructive flex-shrink-0">
                  <Shield weight="fill" className="text-destructive w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                </div>
                <div className="flex-1">
                  <Badge className="mb-2 sm:mb-3 bg-destructive/30 text-destructive border-destructive text-xs sm:text-sm">
                    <Lock weight="fill" className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    Premium One-Time Add-On
                  </Badge>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">Enterprise-Grade Man-in-the-Middle AI Security Shield</h2>
                  <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-destructive">$500</span>
                    <span className="text-muted-foreground text-xs sm:text-sm lg:text-base">one-time payment (not recurring)</span>
                  </div>
                  <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-4 sm:mb-6">
                    Add an always-on AI security agent that sits between your app and the internet, scanning and blocking threats in real-time before they reach your users.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start gap-2">
                    <Check weight="bold" className="text-destructive shrink-0 mt-0.5 sm:mt-1 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    <div>
                      <span className="font-semibold block text-sm sm:text-base">Real-time threat scanning</span>
                      <span className="text-xs sm:text-sm text-muted-foreground">SQLi, XSS, RCE, prompt injection</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check weight="bold" className="text-destructive shrink-0 mt-0.5 sm:mt-1 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    <div>
                      <span className="font-semibold block text-sm sm:text-base">Auto-blocks malicious traffic</span>
                      <span className="text-xs sm:text-sm text-muted-foreground">Before it hits your app</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check weight="bold" className="text-destructive shrink-0 mt-0.5 sm:mt-1 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    <div>
                      <span className="font-semibold block text-sm sm:text-base">Daily AI-generated security reports</span>
                      <span className="text-xs sm:text-sm text-muted-foreground">Emailed to you every morning</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start gap-2">
                    <Check weight="bold" className="text-destructive shrink-0 mt-0.5 sm:mt-1 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    <div>
                      <span className="font-semibold block text-sm sm:text-base">Zero-config deployment</span>
                      <span className="text-xs sm:text-sm text-muted-foreground">We deploy it automatically on your domain</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check weight="bold" className="text-destructive shrink-0 mt-0.5 sm:mt-1 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    <div>
                      <span className="font-semibold block text-sm sm:text-base">Powered by Claude 3.5 + Grok-2</span>
                      <span className="text-xs sm:text-sm text-muted-foreground">Private hybrid AI agent</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check weight="bold" className="text-destructive shrink-0 mt-0.5 sm:mt-1 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                    <div>
                      <span className="font-semibold block text-sm sm:text-base">Glowing shield badge</span>
                      <span className="text-xs sm:text-sm text-muted-foreground">Show users you're protected</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                onClick={handleSecurityUpgrade}
                className="w-full py-5 sm:py-6 lg:py-7 text-base sm:text-lg lg:text-xl glow-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                <Shield weight="fill" className="w-5 h-5 sm:w-6 sm:h-6" />
                Fortify Your App Forever - $500 One-Time
              </Button>

              <p className="text-center text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
                💡 Perfect for apps handling sensitive data, payments, or user authentication
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 sm:mb-10 lg:mb-12"
        >
          <Card className="p-4 sm:p-6 lg:p-8 border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5 text-center">
            <Globe weight="fill" className="mx-auto mb-3 sm:mb-4 text-primary w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Want It LIVE on Your Domain Instantly?</h3>
            <p className="text-muted-foreground mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base px-2">
              <span className="text-accent font-semibold">Upgrade to Launch</span> for custom domain support, auto SSL, GitHub integration, and instant deploy in under 3 seconds.
            </p>
            <Button
              size="lg"
              onClick={() => handleUpgrade('Launch')}
              className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-5 lg:py-6 glow-primary w-full sm:w-auto"
            >
              <Lightning weight="fill" className="w-4 h-4 sm:w-5 sm:h-5" />
              Upgrade to Launch - $39/mo
            </Button>
          </Card>
        </motion.div>

        <div className="text-center mb-6 sm:mb-8">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">Frequently Asked Questions</h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 max-w-5xl mx-auto">
          <Card className="p-2 sm:p-3">
            <h4 className="font-semibold mb-1 text-[10px] sm:text-xs leading-tight">Live deploy speed?</h4>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-tight">
              Under 10 sec. Launch users get &lt;3 sec.
            </p>
          </Card>
          <Card className="p-2 sm:p-3">
            <h4 className="font-semibold mb-1 text-[10px] sm:text-xs leading-tight">Cancel anytime?</h4>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-tight">
              Yes! No contracts. Shield is yours forever.
            </p>
          </Card>
          <Card className="p-2 sm:p-3">
            <h4 className="font-semibold mb-1 text-[10px] sm:text-xs leading-tight">AI Debate Panel?</h4>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-tight">
              5 AIs argue live. You vote. No competitor has this.
            </p>
          </Card>
          <Card className="p-2 sm:p-3">
            <h4 className="font-semibold mb-1 text-[10px] sm:text-xs leading-tight">Own the code?</h4>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-tight">
              100% yours. Download, modify, sell anywhere.
            </p>
          </Card>
          <Card className="p-2 sm:p-3">
            <h4 className="font-semibold mb-1 text-[10px] sm:text-xs leading-tight">Fusion Mode?</h4>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-tight">
              3 versions. Drag-drop parts. Create hybrid.
            </p>
          </Card>
          <Card className="p-2 sm:p-3">
            <h4 className="font-semibold mb-1 text-[10px] sm:text-xs leading-tight">$500 Shield worth it?</h4>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground leading-tight">
              One-time for lifetime AI threat protection.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
