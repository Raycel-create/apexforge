import { Sparkle, Lightning, Rocket, Users, Code, Shield, Fire, Swap, TreeStructure } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { motion } from 'framer-motion'

type Page = 'home' | 'dashboard' | 'pricing' | 'ceo' | 'generator'

interface HomeProps {
  onNavigate: (page: Page) => void
}

export function Home({ onNavigate }: HomeProps) {
  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-4 py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <Badge className="px-6 py-3 bg-primary/20 border-primary/40 text-primary text-base glow-primary">
              <Fire weight="fill" size={18} className="animate-pulse-glow" />
              <span>Stop prompting solo AIs. Hire an entire AI dev team.</span>
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
          >
            Watch an{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse-glow">
              AI Team
            </span>
            <br />
            Argue Until It Ships
            <br />
            <span className="text-accent">Perfection</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          >
            Describe your app → watch 5 AI agents build & deploy it live → it's instantly on the internet with your domain.
            <span className="text-foreground font-semibold block mt-2">
              All in ONE tab. In under 10 seconds.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Button
              size="lg"
              onClick={() => onNavigate('generator')}
              className="text-lg px-8 py-6 glow-primary hover:scale-105 transition-transform"
            >
              <Sparkle weight="fill" size={24} />
              Start Building Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate('generator')}
              className="text-lg px-8 py-6 border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground hover:scale-105 transition-all"
            >
              <TreeStructure weight="fill" size={24} />
              Try FREE Idea Incubator
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center gap-8 text-sm text-muted-foreground pt-8 flex-wrap"
          >
            <div className="flex items-center gap-2">
              <Lightning weight="fill" className="text-accent" size={24} />
              <span>Live in &lt;10 sec</span>
            </div>
            <div className="flex items-center gap-2">
              <Fire weight="fill" className="text-destructive" size={24} />
              <span>Real-time AI debates</span>
            </div>
            <div className="flex items-center gap-2">
              <Swap weight="fill" className="text-primary" size={24} />
              <span>Fusion Mode</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 px-4 py-2 bg-destructive/20 border-destructive/40 text-destructive">
              <Fire weight="fill" size={16} />
              What Makes This Different
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              This Just Killed{' '}
              <span className="text-destructive line-through opacity-70">emergent.sh</span>
              {' '}Every Other AI Builder
            </h2>
            <p className="text-xl text-muted-foreground">
              While competitors force you to open tabs, manually deploy, and wait...
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 border-primary/30 bg-card hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all group">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform glow-primary">
                <Fire weight="fill" className="text-primary" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3">The Forge</h3>
              <p className="text-muted-foreground mb-4">
                5 AI agents (GPT-4o, Claude, Grok, Gemini, Llama) argue LIVE in a sidebar. You vote. Winners auto-apply.
              </p>
              <Badge variant="outline" className="border-primary/50 text-primary">
                No competitor has this
              </Badge>
            </Card>

            <Card className="p-6 border-accent/30 bg-card hover:border-accent hover:shadow-lg hover:shadow-accent/20 transition-all group">
              <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform glow-accent">
                <Swap weight="fill" className="text-accent" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Fusion Mode</h3>
              <p className="text-muted-foreground mb-4">
                Get 3 versions: Fastest | Secure | Beautiful. Drag-drop parts between them. Create your perfect hybrid.
              </p>
              <Badge variant="outline" className="border-accent/50 text-accent">
                Never been done before
              </Badge>
            </Card>

            <Card className="p-6 border-accent/30 bg-card hover:border-accent hover:shadow-lg hover:shadow-accent/20 transition-all group">
              <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform glow-accent">
                <Rocket weight="fill" className="text-accent" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Live Deploy in ONE Tab</h3>
              <p className="text-muted-foreground mb-4">
                Instant HTTPS domain: yourapp-7x9.apexforge.app. Full app running in same tab. No manual hosting.
              </p>
              <Badge variant="outline" className="border-accent/50 text-accent">
                Industry breaker
              </Badge>
            </Card>

            <Card className="p-6 border-primary/30 bg-card hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all group">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform glow-primary">
                <TreeStructure weight="fill" className="text-primary" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3">FREE Idea Incubator</h3>
              <p className="text-muted-foreground mb-4">
                Not sure what to build? Get 5 validated app ideas + wireframes + tech stack in 30 sec. Zero credits used.
              </p>
              <Badge variant="outline" className="border-accent/50 text-accent">
                Massive conversion hook
              </Badge>
            </Card>

            <Card className="p-6 border-primary/30 bg-card hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all group">
              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform glow-primary">
                <Lightning weight="fill" className="text-primary" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Evolve Button</h3>
              <p className="text-muted-foreground mb-4">
                "Add AI chat" or "Make offline-first" → same AI team upgrades it instantly. ChatGPT for full apps.
              </p>
              <Badge variant="outline" className="border-primary/50 text-primary">
                Keeps full context
              </Badge>
            </Card>

            <Card className="p-6 border-destructive/30 bg-card hover:border-destructive hover:shadow-lg hover:shadow-destructive/20 transition-all group">
              <div className="w-14 h-14 rounded-xl bg-destructive/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform glow-destructive">
                <Shield weight="fill" className="text-destructive" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-3">$500 Security Shield</h3>
              <p className="text-muted-foreground mb-4">
                One-time purchase adds AI security agent that sits between your app and threats. Auto-blocks attacks.
              </p>
              <Badge variant="outline" className="border-destructive/50 text-destructive">
                High-margin premium
              </Badge>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 via-card to-accent/10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNGgtMnYyaDJ2LTJ6bTAtOGgydi0yaC0ydjJ6bS0yLTJ2Mmgydi0yaC0yem0tMiAydjJoMnYtMmgtMnptMiA0aDJ2LTJoLTJ2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
            
            <div className="relative p-12 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Badge className="mb-6 px-6 py-3 bg-primary/30 border-primary text-lg glow-primary">
                  <Sparkle weight="fill" size={20} />
                  Ready to Break the Industry?
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Start with 5 FREE Generations
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Or try the FREE Idea Incubator if you're not sure what to build yet.
                  <span className="text-foreground font-semibold block mt-2">
                    No credit card required. Takes 30 seconds.
                  </span>
                </p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <Button
                    size="lg"
                    onClick={() => onNavigate('generator')}
                    className="text-xl px-10 py-7 glow-primary hover:scale-105 transition-transform"
                  >
                    <Fire weight="fill" size={24} />
                    Launch The Forge
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => onNavigate('pricing')}
                    className="text-xl px-10 py-7 border-accent/50 hover:bg-accent/10"
                  >
                    See Pricing
                  </Button>
                </div>
              </motion.div>
            </div>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground text-lg">
            "This is what people screenshot and post on X saying{' '}
            <span className="text-accent font-semibold">
              'this just killed every other AI builder'
            </span>
            "
          </p>
        </div>
      </section>
    </div>
  )
}
