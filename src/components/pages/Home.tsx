import { Sparkle, Lightning, Rocket, Users, Code, Shield, Fire, Swap, TreeStructure } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { motion } from 'framer-motion'
import { useScreenSize } from '../../hooks/use-mobile'

type Page = 'home' | 'dashboard' | 'pricing' | 'ceo' | 'generator'

interface HomeProps {
  onNavigate: (page: Page) => void
}

export function Home({ onNavigate }: HomeProps) {
  const { isMobile, isTablet } = useScreenSize()
  
  return (
    <div className="min-h-screen">
      <section className="container mx-auto px-2 sm:px-4 py-10 sm:py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-5xl mx-auto space-y-4 sm:space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <Badge className={`${isMobile ? 'px-3 py-1.5 text-xs' : 'px-6 py-3 text-base'} bg-primary/20 border-primary/40 text-primary glow-primary`}>
              <Fire weight="fill" size={isMobile ? 14 : 18} className="animate-pulse-glow" />
              <span>{isMobile ? 'Hire an AI dev team' : 'Stop prompting solo AIs. Hire an entire AI dev team.'}</span>
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`${isMobile ? 'text-3xl' : isTablet ? 'text-5xl' : 'text-5xl md:text-7xl lg:text-8xl'} font-bold leading-tight`}
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
            className={`${isMobile ? 'text-sm' : isTablet ? 'text-lg' : 'text-xl md:text-2xl'} text-muted-foreground max-w-3xl mx-auto leading-relaxed`}
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
            className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap"
          >
            <Button
              size={isMobile ? 'default' : 'lg'}
              onClick={() => onNavigate('generator')}
              className={`${isMobile ? 'text-sm px-4 py-2' : 'text-lg px-8 py-6'} glow-primary hover:scale-105 transition-transform`}
            >
              <Sparkle weight="fill" size={isMobile ? 18 : 24} />
              {isMobile ? 'Start Free' : 'Start Building Free'}
            </Button>
            <Button
              size={isMobile ? 'default' : 'lg'}
              variant="outline"
              onClick={() => onNavigate('generator')}
              className={`${isMobile ? 'text-sm px-4 py-2' : 'text-lg px-8 py-6'} border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground hover:scale-105 transition-all`}
            >
              <TreeStructure weight="fill" size={isMobile ? 18 : 24} />
              {isMobile ? 'Incubator' : 'Try FREE Idea Incubator'}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`flex items-center justify-center gap-4 sm:gap-8 ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground pt-4 sm:pt-8 flex-wrap`}
          >
            <div className="flex items-center gap-1 sm:gap-2">
              <Lightning weight="fill" className="text-accent" size={isMobile ? 16 : 24} />
              <span>Live in &lt;10 sec</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Fire weight="fill" className="text-destructive" size={isMobile ? 16 : 24} />
              <span>Real-time AI debates</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Swap weight="fill" className="text-primary" size={isMobile ? 16 : 24} />
              <span>Fusion Mode</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-2 sm:px-4 py-10 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <Badge className={`mb-2 sm:mb-4 ${isMobile ? 'px-2 py-1 text-xs' : 'px-4 py-2'} bg-destructive/20 border-destructive/40 text-destructive`}>
              <Fire weight="fill" size={isMobile ? 12 : 16} />
              What Makes This Different
            </Badge>
            <h2 className={`${isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl md:text-5xl'} font-bold mb-2 sm:mb-4`}>
              This Just Killed{' '}
              <span className="text-destructive line-through opacity-70">emergent.sh</span>
              {' '}Every Other AI Builder
            </h2>
            <p className={`${isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-xl'} text-muted-foreground`}>
              While competitors force you to open tabs, manually deploy, and wait...
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <Card className="p-2 sm:p-3 border-primary/30 bg-card hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all group">
              <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-lg bg-primary/20 flex items-center justify-center mb-1 sm:mb-2 group-hover:scale-110 transition-transform glow-primary`}>
                <Fire weight="fill" className="text-primary" size={isMobile ? 12 : 16} />
              </div>
              <h3 className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-bold mb-0.5 sm:mb-1`}>The Forge</h3>
              <p className={`text-muted-foreground mb-1 sm:mb-2 ${isMobile ? 'text-[8px]' : 'text-[10px]'} leading-tight`}>
                5 AI agents argue LIVE. You vote. Winners auto-apply.
              </p>
              <Badge variant="outline" className={`border-primary/50 text-primary ${isMobile ? 'text-[6px] px-0.5 py-0' : 'text-[8px] px-1 py-0'}`}>
                No competitor
              </Badge>
            </Card>

            <Card className="p-2 sm:p-3 border-accent/30 bg-card hover:border-accent hover:shadow-lg hover:shadow-accent/20 transition-all group">
              <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-lg bg-accent/20 flex items-center justify-center mb-1 sm:mb-2 group-hover:scale-110 transition-transform glow-accent`}>
                <Swap weight="fill" className="text-accent" size={isMobile ? 12 : 16} />
              </div>
              <h3 className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-bold mb-0.5 sm:mb-1`}>Fusion Mode</h3>
              <p className={`text-muted-foreground mb-1 sm:mb-2 ${isMobile ? 'text-[8px]' : 'text-[10px]'} leading-tight`}>
                3 versions. Drag-drop parts. Create hybrid.
              </p>
              <Badge variant="outline" className={`border-accent/50 text-accent ${isMobile ? 'text-[6px] px-0.5 py-0' : 'text-[8px] px-1 py-0'}`}>
                Never done
              </Badge>
            </Card>

            <Card className="p-2 sm:p-3 border-accent/30 bg-card hover:border-accent hover:shadow-lg hover:shadow-accent/20 transition-all group">
              <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-lg bg-accent/20 flex items-center justify-center mb-1 sm:mb-2 group-hover:scale-110 transition-transform glow-accent`}>
                <Rocket weight="fill" className="text-accent" size={isMobile ? 12 : 16} />
              </div>
              <h3 className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-bold mb-0.5 sm:mb-1`}>Live Deploy</h3>
              <p className={`text-muted-foreground mb-1 sm:mb-2 ${isMobile ? 'text-[8px]' : 'text-[10px]'} leading-tight`}>
                Instant HTTPS domain. No manual hosting.
              </p>
              <Badge variant="outline" className={`border-accent/50 text-accent ${isMobile ? 'text-[6px] px-0.5 py-0' : 'text-[8px] px-1 py-0'}`}>
                Breaker
              </Badge>
            </Card>

            <Card className="p-2 sm:p-3 border-primary/30 bg-card hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all group">
              <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-lg bg-primary/20 flex items-center justify-center mb-1 sm:mb-2 group-hover:scale-110 transition-transform glow-primary`}>
                <TreeStructure weight="fill" className="text-primary" size={isMobile ? 12 : 16} />
              </div>
              <h3 className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-bold mb-0.5 sm:mb-1`}>FREE Incubator</h3>
              <p className={`text-muted-foreground mb-1 sm:mb-2 ${isMobile ? 'text-[8px]' : 'text-[10px]'} leading-tight`}>
                5 validated app ideas in 30 sec. Zero credits.
              </p>
              <Badge variant="outline" className={`border-accent/50 text-accent ${isMobile ? 'text-[6px] px-0.5 py-0' : 'text-[8px] px-1 py-0'}`}>
                Hook
              </Badge>
            </Card>

            <Card className="p-2 sm:p-3 border-primary/30 bg-card hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all group">
              <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-lg bg-primary/20 flex items-center justify-center mb-1 sm:mb-2 group-hover:scale-110 transition-transform glow-primary`}>
                <Lightning weight="fill" className="text-primary" size={isMobile ? 12 : 16} />
              </div>
              <h3 className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-bold mb-0.5 sm:mb-1`}>Evolve Button</h3>
              <p className={`text-muted-foreground mb-1 sm:mb-2 ${isMobile ? 'text-[8px]' : 'text-[10px]'} leading-tight`}>
                Upgrades it instantly. ChatGPT for apps.
              </p>
              <Badge variant="outline" className={`border-primary/50 text-primary ${isMobile ? 'text-[6px] px-0.5 py-0' : 'text-[8px] px-1 py-0'}`}>
                Full context
              </Badge>
            </Card>

            <Card className="p-2 sm:p-3 border-destructive/30 bg-card hover:border-destructive hover:shadow-lg hover:shadow-destructive/20 transition-all group">
              <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-lg bg-destructive/20 flex items-center justify-center mb-1 sm:mb-2 group-hover:scale-110 transition-transform glow-destructive`}>
                <Shield weight="fill" className="text-destructive" size={isMobile ? 12 : 16} />
              </div>
              <h3 className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-bold mb-0.5 sm:mb-1`}>$500 Shield</h3>
              <p className={`text-muted-foreground mb-1 sm:mb-2 ${isMobile ? 'text-[8px]' : 'text-[10px]'} leading-tight`}>
                AI security agent. Auto-blocks attacks.
              </p>
              <Badge variant="outline" className={`border-destructive/50 text-destructive ${isMobile ? 'text-[6px] px-0.5 py-0' : 'text-[8px] px-1 py-0'}`}>
                Premium
              </Badge>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-2 sm:px-4 py-10 sm:py-20">
        <div className="max-w-5xl mx-auto">
          <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 via-card to-accent/10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNGgtMnYyaDJ2LTJ6bTAtOGgydi0yaC0ydjJ6bS0yLTJ2Mmgydi0yaC0yem0tMiAydjJoMnYtMmgtMnptMiA0aDJ2LTJoLTJ2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
            
            <div className={`relative ${isMobile ? 'p-6' : 'p-12'} text-center`}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Badge className={`mb-4 sm:mb-6 ${isMobile ? 'px-3 py-1.5 text-sm' : 'px-6 py-3 text-lg'} bg-primary/30 border-primary glow-primary`}>
                  <Sparkle weight="fill" size={isMobile ? 16 : 20} />
                  Ready to Break the Industry?
                </Badge>
                <h2 className={`${isMobile ? 'text-2xl' : isTablet ? 'text-3xl' : 'text-4xl md:text-5xl'} font-bold mb-4 sm:mb-6`}>
                  Start with 5 FREE Generations
                </h2>
                <p className={`${isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-xl'} text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto`}>
                  Or try the FREE Idea Incubator if you're not sure what to build yet.
                  <span className="text-foreground font-semibold block mt-2">
                    No credit card required. Takes 30 seconds.
                  </span>
                </p>
                <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
                  <Button
                    size={isMobile ? 'default' : 'lg'}
                    onClick={() => onNavigate('generator')}
                    className={`${isMobile ? 'text-base px-6 py-5' : 'text-xl px-10 py-7'} glow-primary hover:scale-105 transition-transform`}
                  >
                    <Fire weight="fill" size={isMobile ? 20 : 24} />
                    Launch The Forge
                  </Button>
                  <Button
                    size={isMobile ? 'default' : 'lg'}
                    variant="outline"
                    onClick={() => onNavigate('pricing')}
                    className={`${isMobile ? 'text-base px-6 py-5' : 'text-xl px-10 py-7'} border-accent/50 hover:bg-accent/10`}
                  >
                    See Pricing
                  </Button>
                </div>
              </motion.div>
            </div>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-2 sm:px-4 py-6 sm:py-12 mb-10 sm:mb-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className={`text-muted-foreground ${isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-lg'}`}>
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
