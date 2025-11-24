import { Sparkle, Lightning, Rocket, Users, Code, Shield, Fire, Swap, TreeStructure } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { motion } from 'framer-motion'
import { useScreenSize } from '../../hooks/use-mobile'
import { useBlackForge } from '../../lib/BlackForgeContext'
import { LiveChatbot } from '../LiveChatbot'
import { TrustBanner } from '../TrustIndicators'
import { ProductDemoShowcase } from '../ProductDemoShowcase'

type Page = 'home' | 'dashboard' | 'pricing' | 'generator' | 'auth' | 'figma'

interface HomeProps {
  onNavigate: (page: Page) => void
}

export function Home({ onNavigate }: HomeProps) {
  const { isMobile, isTablet } = useScreenSize()
  const { blackForgeMode } = useBlackForge()
  
  return (
    <div className={`min-h-screen w-full overflow-x-hidden ${blackForgeMode ? 'bg-gradient-to-b from-destructive/10 to-background' : ''} transition-all duration-1000`}>
      <LiveChatbot />
      <section className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12 lg:py-20 text-center relative max-w-[1400px]">
        <div className={`absolute inset-0 ${
          blackForgeMode 
            ? 'bg-gradient-to-b from-destructive/20 via-transparent to-transparent' 
            : 'bg-gradient-to-b from-primary/10 via-transparent to-transparent'
        } pointer-events-none transition-all duration-1000`} />
        
        <div className="max-w-5xl mx-auto space-y-4 sm:space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <Badge className={`${isMobile ? 'px-3 py-1.5 text-xs' : 'px-6 py-3 text-base'} ${
              blackForgeMode
                ? 'bg-destructive/20 border-destructive/40 text-destructive glow-destructive'
                : 'bg-primary/20 border-primary/40 text-primary glow-primary'
            } transition-all duration-500`}>
              <Fire weight="fill" size={isMobile ? 14 : 18} className="animate-pulse-glow" />
              <span>{blackForgeMode 
                ? (isMobile ? '🔥 Dark AI team' : '🔥 Unleash the Dark AI Team') 
                : (isMobile ? 'Hire an AI dev team' : 'Stop prompting solo AIs. Hire an entire AI dev team.')
              }</span>
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`${isMobile ? 'text-3xl' : isTablet ? 'text-5xl' : 'text-5xl md:text-7xl lg:text-8xl'} font-bold leading-tight`}
          >
            {blackForgeMode ? (
              <>
                Watch a{' '}
                <span className="bg-gradient-to-r from-destructive via-destructive/70 to-destructive bg-clip-text text-transparent animate-pulse-glow">
                  Dark AI Team
                </span>
                <br />
                Forge Until It Burns
                <br />
                <span className="text-destructive">Hell Fire</span>
              </>
            ) : (
              <>
                Watch an{' '}
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse-glow">
                  AI Team
                </span>
                <br />
                Argue Until It Ships
                <br />
                <span className="text-accent">Perfection</span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${isMobile ? 'text-sm' : isTablet ? 'text-lg' : 'text-xl md:text-2xl'} text-muted-foreground max-w-3xl mx-auto leading-relaxed`}
          >
            {blackForgeMode ? (
              <>
                Summon your app → watch 5 demonic AI agents forge it in flames → it materializes on the dark web with your domain.
                <span className="text-foreground font-semibold block mt-2">
                  All in ONE infernal tab. In under 10 seconds. 🔥
                </span>
              </>
            ) : (
              <>
                Describe your app → watch 5 AI agents build & deploy it live → it's instantly on the internet with your domain.
                <span className="text-foreground font-semibold block mt-2">
                  All in ONE tab. In under 10 seconds.
                </span>
              </>
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap"
          >
            <Button
              size={isMobile ? 'default' : 'lg'}
              onClick={() => onNavigate('auth')}
              className={`${isMobile ? 'text-sm px-4 py-2' : 'text-lg px-8 py-6'} ${
                blackForgeMode 
                  ? 'glow-destructive bg-destructive hover:bg-destructive/90' 
                  : 'glow-primary'
              } hover:scale-105 transition-all duration-300`}
            >
              <Sparkle weight="fill" size={isMobile ? 18 : 24} />
              {blackForgeMode 
                ? (isMobile ? '🔥 Join Now' : '🔥 Join Dark Forge') 
                : (isMobile ? 'Get Started' : 'Get Started Free')
              }
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
            className="pt-6"
          >
            <TrustBanner />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className={`flex items-center justify-center gap-4 sm:gap-8 ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground pt-2 flex-wrap`}
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

      <ProductDemoShowcase />

      <section className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12 lg:py-20 max-w-[1400px]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/5 via-card to-accent/5 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 transition-all group">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNGgtMnYyaDJ2LTJ6bTAtOGgydi0yaC0ydjJ6bS0yLTJ2Mmgydi0yaC0yem0tMiAydjJoMnYtMmgtMnptMiA0aDJ2LTJoLTJ2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
              
              <div className={`relative ${isMobile ? 'p-6' : 'p-8 md:p-12'}`}>
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ opacity: 0.4 }}>
                  <defs>
                    <linearGradient id="line-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="oklch(0.60 0.30 285)" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="oklch(0.80 0.18 195)" stopOpacity="0.7" />
                    </linearGradient>
                    <linearGradient id="line-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="oklch(0.80 0.18 195)" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="oklch(0.80 0.18 195)" stopOpacity="0.6" />
                    </linearGradient>
                    <linearGradient id="line-gradient-3" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="oklch(0.60 0.30 285)" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="oklch(0.60 0.30 285)" stopOpacity="0.6" />
                    </linearGradient>
                    <linearGradient id="line-gradient-4" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="oklch(0.60 0.30 285)" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="oklch(0.60 0.28 340)" stopOpacity="0.7" />
                    </linearGradient>
                    <linearGradient id="line-gradient-5" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="oklch(0.80 0.18 195)" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="oklch(0.60 0.30 285)" stopOpacity="0.6" />
                    </linearGradient>
                    <linearGradient id="line-gradient-6" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="oklch(0.60 0.28 340)" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="oklch(0.80 0.18 195)" stopOpacity="0.5" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {!isMobile && (
                    <>
                      <motion.line
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        viewport={{ once: true }}
                        x1="16%" y1="28%" x2="38%" y2="28%"
                        stroke="url(#line-gradient-1)"
                        strokeWidth="2.5"
                        strokeDasharray="6 3"
                        filter="url(#glow)"
                      />
                      
                      <motion.line
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                        x1="52%" y1="28%" x2="72%" y2="28%"
                        stroke="url(#line-gradient-2)"
                        strokeWidth="2.5"
                        strokeDasharray="6 3"
                        filter="url(#glow)"
                      />
                      
                      <motion.line
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        viewport={{ once: true }}
                        x1="16%" y1="42%" x2="16%" y2="64%"
                        stroke="url(#line-gradient-3)"
                        strokeWidth="2.5"
                        strokeDasharray="6 3"
                        filter="url(#glow)"
                      />
                      
                      <motion.line
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        viewport={{ once: true }}
                        x1="28%" y1="68%" x2="60%" y2="68%"
                        stroke="url(#line-gradient-4)"
                        strokeWidth="2.5"
                        strokeDasharray="6 3"
                        filter="url(#glow)"
                      />
                      
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.7 }}
                        viewport={{ once: true }}
                        d="M 50% 42% Q 55% 50%, 50% 64%"
                        stroke="url(#line-gradient-5)"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="4 4"
                        filter="url(#glow)"
                      />
                      
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        viewport={{ once: true }}
                        d="M 84% 42% Q 80% 55%, 72% 64%"
                        stroke="url(#line-gradient-6)"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="4 4"
                        filter="url(#glow)"
                      />
                      
                      <motion.line
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.7, delay: 0.9 }}
                        viewport={{ once: true }}
                        x1="52%" y1="42%" x2="72%" y2="64%"
                        stroke="url(#line-gradient-2)"
                        strokeWidth="1.5"
                        strokeDasharray="2 4"
                        opacity="0.4"
                      />
                      
                      <motion.circle
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 1.0 }}
                        viewport={{ once: true }}
                        cx="16%" cy="28%" r="5"
                        fill="oklch(0.60 0.30 285)"
                        opacity="0.7"
                        filter="url(#glow)"
                      />
                      <motion.circle
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 1.1 }}
                        viewport={{ once: true }}
                        cx="16%" cy="28%" r="2.5"
                        fill="oklch(1 0 0)"
                        opacity="0.9"
                      />
                      
                      <motion.circle
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 1.0 }}
                        viewport={{ once: true }}
                        cx="50%" cy="28%" r="5"
                        fill="oklch(0.80 0.18 195)"
                        opacity="0.8"
                        filter="url(#glow)"
                      />
                      <motion.circle
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 1.1 }}
                        viewport={{ once: true }}
                        cx="50%" cy="28%" r="2.5"
                        fill="oklch(1 0 0)"
                        opacity="0.9"
                      />
                      
                      <motion.circle
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 1.0 }}
                        viewport={{ once: true }}
                        cx="84%" cy="28%" r="5"
                        fill="oklch(0.80 0.18 195)"
                        opacity="0.8"
                        filter="url(#glow)"
                      />
                      <motion.circle
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 1.1 }}
                        viewport={{ once: true }}
                        cx="84%" cy="28%" r="2.5"
                        fill="oklch(1 0 0)"
                        opacity="0.9"
                      />
                      
                      <motion.circle
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 1.0 }}
                        viewport={{ once: true }}
                        cx="16%" cy="68%" r="5"
                        fill="oklch(0.60 0.30 285)"
                        opacity="0.7"
                        filter="url(#glow)"
                      />
                      <motion.circle
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 1.1 }}
                        viewport={{ once: true }}
                        cx="16%" cy="68%" r="2.5"
                        fill="oklch(1 0 0)"
                        opacity="0.9"
                      />
                      
                      <motion.circle
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 1.0 }}
                        viewport={{ once: true }}
                        cx="50%" cy="68%" r="5"
                        fill="oklch(0.60 0.30 285)"
                        opacity="0.7"
                        filter="url(#glow)"
                      />
                      <motion.circle
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 1.1 }}
                        viewport={{ once: true }}
                        cx="50%" cy="68%" r="2.5"
                        fill="oklch(1 0 0)"
                        opacity="0.9"
                      />
                      
                      <motion.circle
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 1.0 }}
                        viewport={{ once: true }}
                        cx="84%" cy="68%" r="5"
                        fill="oklch(0.60 0.28 340)"
                        opacity="0.8"
                        filter="url(#glow)"
                      />
                      <motion.circle
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 1.1 }}
                        viewport={{ once: true }}
                        cx="84%" cy="68%" r="2.5"
                        fill="oklch(1 0 0)"
                        opacity="0.9"
                      />
                    </>
                  )}
                </svg>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 relative z-10">
                  <div className="flex flex-col items-start space-y-2">
                    <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform glow-primary`}>
                      <Fire weight="fill" className="text-primary" size={isMobile ? 20 : 24} />
                    </div>
                    <div>
                      <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-bold text-foreground`}>The Forge</h3>
                      <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground leading-relaxed`}>
                        5 AI agents argue LIVE. You vote. Winners auto-apply.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start space-y-2">
                    <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform glow-accent`}>
                      <Swap weight="fill" className="text-accent" size={isMobile ? 20 : 24} />
                    </div>
                    <div>
                      <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-bold text-foreground`}>Fusion Mode</h3>
                      <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground leading-relaxed`}>
                        3 versions. Drag-drop parts. Create hybrid.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start space-y-2">
                    <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform glow-accent`}>
                      <Rocket weight="fill" className="text-accent" size={isMobile ? 20 : 24} />
                    </div>
                    <div>
                      <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-bold text-foreground`}>Live Deploy</h3>
                      <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground leading-relaxed`}>
                        Instant HTTPS domain. No manual hosting.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start space-y-2">
                    <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform glow-primary`}>
                      <TreeStructure weight="fill" className="text-primary" size={isMobile ? 20 : 24} />
                    </div>
                    <div>
                      <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-bold text-foreground`}>FREE Incubator</h3>
                      <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground leading-relaxed`}>
                        5 validated app ideas in 30 sec. Zero credits.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start space-y-2">
                    <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform glow-primary`}>
                      <Lightning weight="fill" className="text-primary" size={isMobile ? 20 : 24} />
                    </div>
                    <div>
                      <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-bold text-foreground`}>Evolve Button</h3>
                      <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground leading-relaxed`}>
                        Upgrades it instantly. ChatGPT for apps.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start space-y-2">
                    <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl bg-destructive/20 flex items-center justify-center group-hover:scale-110 transition-transform glow-destructive`}>
                      <Shield weight="fill" className="text-destructive" size={isMobile ? 20 : 24} />
                    </div>
                    <div>
                      <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-bold text-foreground`}>$500 Shield</h3>
                      <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground leading-relaxed`}>
                        AI security agent. Auto-blocks attacks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12 lg:py-20 max-w-[1400px]">
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

    </div>
  )
}
