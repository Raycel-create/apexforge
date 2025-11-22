import { Check, Sparkle, Lightning } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { toast } from 'sonner'

type Page = 'home' | 'dashboard' | 'pricing' | 'ceo' | 'generator'

interface PricingProps {
  onNavigate: (page: Page) => void
}

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out ApexForge',
    features: [
      '5 generations per month',
      'Watermarked previews',
      'Basic AI models',
      'Community support',
      'Download source code',
    ],
    limitations: [
      'No priority queue',
      'Limited model selection',
    ],
    cta: 'Current Plan',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'per month',
    description: '20% cheaper than competitors - Best for professionals',
    features: [
      'Unlimited generations',
      'No watermarks',
      'All AI models (GPT-4, Claude, Grok)',
      'Priority generation queue',
      'API key storage',
      'Advanced deployment options',
      'Priority email support',
      'Custom templates',
    ],
    limitations: [],
    cta: 'Upgrade to Pro',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: '$49',
    period: 'per month',
    description: 'For teams and agencies',
    features: [
      'Everything in Pro',
      'Custom AI agents',
      'Team collaboration (5 seats)',
      'White-label deployments',
      'Advanced analytics',
      'Dedicated support',
      'Custom integrations',
      'SLA guarantee',
    ],
    limitations: [],
    cta: 'Contact Sales',
    highlight: false,
  },
]

export function Pricing({ onNavigate }: PricingProps) {
  const handleUpgrade = (planName: string) => {
    if (planName === 'Free') return
    toast.success(`Redirecting to checkout for ${planName}...`, {
      description: 'In production, this would integrate with Stripe',
    })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            20% Cheaper Than Emergent.sh
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include collaborative AI generation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`p-8 ${
                plan.highlight
                  ? 'border-primary/50 bg-primary/5 relative overflow-hidden'
                  : 'border-border'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
              )}
              <div className="relative">
                {plan.highlight && (
                  <Badge className="mb-4 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground mb-6">{plan.description}</p>

                <Button
                  onClick={() => handleUpgrade(plan.name)}
                  className={`w-full mb-6 ${
                    plan.highlight ? 'glow-primary' : ''
                  }`}
                  variant={plan.highlight ? 'default' : 'outline'}
                  disabled={plan.name === 'Free'}
                >
                  {plan.cta}
                </Button>

                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check weight="bold" className="text-accent shrink-0 mt-0.5" size={16} />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Lightning weight="fill" className="text-accent" size={24} />
              <h3 className="text-2xl font-bold">Not Sure What to Build?</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Start with our free AI Idea Generator to get inspired. Generate 3 app concepts without consuming your generation credits!
            </p>
            <Button
              size="lg"
              variant="outline"
              onClick={() => toast.success('Idea Generator coming soon!')}
            >
              <Sparkle weight="fill" size={16} />
              Try Idea Generator (Free)
            </Button>
          </div>
        </Card>

        <div className="mt-12 text-center">
          <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
            <Card className="p-6">
              <h4 className="font-semibold mb-2">How do credits work?</h4>
              <p className="text-sm text-muted-foreground">
                Each app generation consumes 1 credit. Free tier gets 5 credits/month. Pro tier has unlimited credits.
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="font-semibold mb-2">Can I cancel anytime?</h4>
              <p className="text-sm text-muted-foreground">
                Yes! Cancel your subscription anytime. You'll keep access until the end of your billing period.
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="font-semibold mb-2">What AI models do you use?</h4>
              <p className="text-sm text-muted-foreground">
                We use GPT-4, Claude, and Grok in parallel for faster, more innovative results. Pro users can select specific models.
              </p>
            </Card>
            <Card className="p-6">
              <h4 className="font-semibold mb-2">Do I own the generated code?</h4>
              <p className="text-sm text-muted-foreground">
                Absolutely! All generated code is 100% yours. Download, modify, and deploy anywhere without restrictions.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
