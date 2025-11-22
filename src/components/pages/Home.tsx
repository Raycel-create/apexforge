import { Sparkle, Lightning, Rocket, Users, Code, Shield } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'

type Page = 'home' | 'dashboard' | 'pricing' | 'ceo' | 'generator'

interface HomeProps {
  onNavigate: (page: Page) => void
}

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-block">
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary">
              <Sparkle weight="fill" size={16} />
              <span>Collaborative AI • 2x Faster Than Traditional Builders</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Build Apps{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              2x Faster
            </span>
            <br />
            with Collaborative AI
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch multiple AI models debate, collaborate, and build your full-stack applications in minutes.
            Deploy anywhere with one click.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              size="lg"
              onClick={() => onNavigate('generator')}
              className="text-lg glow-primary"
            >
              <Sparkle weight="fill" size={20} />
              Start Building Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate('pricing')}
            >
              View Pricing
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground pt-8">
            <div className="flex items-center gap-2">
              <Lightning weight="fill" className="text-accent" size={20} />
              <span>2-3 min generation</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield weight="fill" className="text-accent" size={20} />
              <span>Production ready</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket weight="fill" className="text-accent" size={20} />
              <span>One-click deploy</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Why ApexForge is{' '}
            <span className="text-accent">Different</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Multi-model AI collaboration delivers faster, more innovative results
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 border-border bg-card hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users weight="fill" className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Debate Panel</h3>
              <p className="text-muted-foreground">
                Watch GPT-4, Claude, and Grok collaborate in real-time. Vote on their proposals for better results.
              </p>
            </Card>

            <Card className="p-6 border-border bg-card hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Lightning weight="fill" className="text-accent" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Parallel Processing</h3>
              <p className="text-muted-foreground">
                Multiple AI models work simultaneously, cutting generation time from 10+ minutes to 2-3 minutes.
              </p>
            </Card>

            <Card className="p-6 border-border bg-card hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Code weight="fill" className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Fusion Mode</h3>
              <p className="text-muted-foreground">
                Merge the best parts from each AI model - GPT's clean UI, Claude's security, Grok's performance.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Start with 5 free generations. No credit card required.
          </p>
          <Button
            size="lg"
            onClick={() => onNavigate('generator')}
            className="text-lg glow-primary"
          >
            <Sparkle weight="fill" size={20} />
            Generate Your First App
          </Button>
        </div>
      </section>
    </div>
  )
}
