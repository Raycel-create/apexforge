import { useState } from 'react'
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
import { AuthModal } from '../AuthModal'
import { TeamShowcase } from '../TeamShowcase'
import { Footer } from '../Footer'
import { Hero3DAnimation } from '../Hero3DAnimation'

type Page = 'home' | 'dashboard' | 'pricing' | 'generator' | 'auth' | 'figma'

interface HomeProps {
  onNavigate: (page: Page) => void
}

export function Home({ onNavigate }: HomeProps) {
  const { isMobile, isTablet } = useScreenSize()
  const { blackForgeMode } = useBlackForge()
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  const handleAuthSuccess = () => {
    onNavigate('dashboard')
  }
  
  return (
    <div className={`min-h-screen w-full overflow-x-hidden ${blackForgeMode ? 'bg-gradient-to-b from-destructive/10 to-background' : ''} transition-all duration-1000`}>
      <LiveChatbot />
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} onSuccess={handleAuthSuccess} />
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 text-center relative max-w-[1400px] min-h-[85vh] flex items-center">
        <div className={`absolute inset-0 ${
          blackForgeMode 
            ? 'bg-gradient-to-br from-destructive/20 via-transparent to-transparent' 
            : 'bg-gradient-to-br from-pink-50/40 via-pink-50/20 to-transparent'
        } pointer-events-none transition-all duration-1000`} />
        
        {!isMobile && <Hero3DAnimation />}
        
        <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <Badge className={`${isMobile ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'} ${
              blackForgeMode
                ? 'bg-destructive/20 border-destructive/40 text-destructive glow-destructive'
                : 'bg-pink-50/60 border-pink-200/50 text-pink-400'
            } transition-all duration-500`}>
              <Fire weight="fill" size={isMobile ? 14 : 16} className="animate-pulse-glow" />
              <span>{blackForgeMode 
                ? (isMobile ? '🔥 Dark AI Team' : '🔥 Unleash the Dark AI Team') 
                : (isMobile ? 'Hire an AI Dev Team' : 'Stop prompting solo AIs. Hire an entire AI dev team.')
              }</span>
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="heading-responsive font-bold"
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
                <span className="bg-gradient-to-r from-pink-200 via-pink-100 to-pink-200 bg-clip-text text-transparent animate-pulse-glow">
                  AI Team
                </span>
                <br />
                Argue Until It Ships
                <br />
                <span className="bg-gradient-to-r from-pink-300 to-pink-200 bg-clip-text text-transparent">Perfection</span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-responsive-lg text-muted-foreground max-w-3xl mx-auto"
          >
            {blackForgeMode ? (
              <>
                Summon your app → watch 5 demonic AI agents forge it in flames → it materializes on the dark web with your domain.
                <span className="text-foreground font-semibold block mt-1">
                  All in ONE infernal tab. In under 10 seconds. 🔥
                </span>
              </>
            ) : (
              <>
                Describe your app → watch 5 AI agents build & deploy it live → it's instantly on the internet with your domain.
                <span className="text-foreground font-semibold block mt-1">
                  All in ONE tab. In under 10 seconds.
                </span>
              </>
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap"
          >
            <Button
              size={isMobile ? 'default' : 'lg'}
              onClick={() => setShowAuthModal(true)}
              className={`touch-target ${isMobile ? 'text-base px-6' : 'text-base px-8 h-12'} ${
                blackForgeMode 
                  ? 'glow-destructive bg-destructive hover:bg-destructive/90' 
                  : 'bg-gradient-to-r from-pink-200 via-pink-100 to-pink-200 hover:from-pink-300 hover:via-pink-200 hover:to-pink-300 text-pink-700'
              } hover:scale-105 transition-all duration-300 font-semibold shadow-lg`}
            >
              <Sparkle weight="fill" size={isMobile ? 18 : 20} />
              {blackForgeMode 
                ? (isMobile ? '🔥 Join Dark Forge' : '🔥 Join Dark Forge Now') 
                : (isMobile ? 'Get Started Free' : 'Get Started Free')
              }
            </Button>
            <Button
              size={isMobile ? 'default' : 'lg'}
              variant="outline"
              onClick={() => onNavigate('generator')}
              className={`touch-target ${isMobile ? 'text-base px-6' : 'text-base px-8 h-12'} border-pink-200/50 text-pink-400 hover:bg-pink-50/20 hover:text-pink-300 hover:scale-105 transition-all font-semibold`}
            >
              <TreeStructure weight="fill" size={isMobile ? 18 : 20} />
              {isMobile ? 'Free Incubator' : 'Try FREE Idea Incubator'}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-3"
          >
            <TrustBanner />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex items-center justify-center gap-3 sm:gap-4 text-responsive-sm text-muted-foreground pt-2 flex-wrap"
          >
            <div className="flex items-center gap-1.5">
              <Lightning weight="fill" className="text-pink-300" size={isMobile ? 16 : 18} />
              <span>Live in &lt;10 sec</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fire weight="fill" className="text-pink-200" size={isMobile ? 16 : 18} />
              <span>Real-time AI debates</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Swap weight="fill" className="text-pink-300" size={isMobile ? 16 : 18} />
              <span>Fusion Mode</span>
            </div>
          </motion.div>
        </div>
      </section>

      <ProductDemoShowcase />

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-[1400px]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="relative overflow-hidden border-pink-200/30 bg-gradient-to-br from-pink-50/25 via-card to-pink-100/25 hover:border-pink-200 hover:shadow-2xl hover:shadow-pink-200/15 transition-all group">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNGgtMnYyaDJ2LTJ6bTAtOGgydi0yaC0ydjJ6bS0yLTJ2Mmgydi0yaC0yem0tMiAydjJoMnYtMmgtMnptMiA0aDJ2LTJoLTJ2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
              
              <div className={`relative ${isMobile ? 'p-5' : 'p-6 md:p-8'}`}>
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ opacity: 0.4 }}>
                  <defs>
                    <linearGradient id="line-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgb(252, 231, 243)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="rgb(253, 242, 248)" stopOpacity="0.5" />
                    </linearGradient>
                    <linearGradient id="line-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgb(253, 242, 248)" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="rgb(251, 207, 232)" stopOpacity="0.4" />
                    </linearGradient>
                    <linearGradient id="line-gradient-3" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgb(252, 231, 243)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="rgb(252, 231, 243)" stopOpacity="0.4" />
                    </linearGradient>
                    <linearGradient id="line-gradient-4" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgb(252, 231, 243)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="rgb(251, 207, 232)" stopOpacity="0.5" />
                    </linearGradient>
                    <linearGradient id="line-gradient-5" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgb(253, 242, 248)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="rgb(252, 231, 243)" stopOpacity="0.4" />
                    </linearGradient>
                    <linearGradient id="line-gradient-6" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgb(251, 207, 232)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="rgb(253, 242, 248)" stopOpacity="0.3" />
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
                        fill="rgb(251, 207, 232)"
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
                        fill="rgb(252, 231, 243)"
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
                        fill="rgb(252, 231, 243)"
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
                        fill="rgb(251, 207, 232)"
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
                        fill="rgb(251, 207, 232)"
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
                        fill="rgb(249, 168, 212)"
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

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 relative z-10">
                  <div className="flex flex-col items-start space-y-2">
                    <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-lg bg-gradient-to-br from-pink-200/30 to-pink-300/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-pink-300/20`}>
                      <Fire weight="fill" className="text-pink-400" size={isMobile ? 16 : 20} />
                    </div>
                    <div>
                      <h3 className="text-responsive-sm font-bold text-foreground">The Forge</h3>
                      <p className="text-responsive-sm text-muted-foreground leading-relaxed">
                        5 AI agents argue LIVE. You vote. Winners auto-apply.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start space-y-2">
                    <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-lg bg-gradient-to-br from-pink-200/30 to-pink-300/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-pink-300/20`}>
                      <Swap weight="fill" className="text-pink-400" size={isMobile ? 16 : 20} />
                    </div>
                    <div>
                      <h3 className="text-responsive-sm font-bold text-foreground">Fusion Mode</h3>
                      <p className="text-responsive-sm text-muted-foreground leading-relaxed">
                        3 versions. Drag-drop parts. Create hybrid.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start space-y-2">
                    <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-lg bg-gradient-to-br from-pink-200/30 to-pink-300/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-pink-300/20`}>
                      <Rocket weight="fill" className="text-pink-400" size={isMobile ? 16 : 20} />
                    </div>
                    <div>
                      <h3 className="text-responsive-sm font-bold text-foreground">Live Deploy</h3>
                      <p className="text-responsive-sm text-muted-foreground leading-relaxed">
                        Instant HTTPS domain. No manual hosting.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start space-y-2">
                    <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-lg bg-gradient-to-br from-pink-200/30 to-pink-300/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-pink-300/20`}>
                      <TreeStructure weight="fill" className="text-pink-400" size={isMobile ? 16 : 20} />
                    </div>
                    <div>
                      <h3 className="text-responsive-sm font-bold text-foreground">FREE Incubator</h3>
                      <p className="text-responsive-sm text-muted-foreground leading-relaxed">
                        5 validated app ideas in 30 sec. Zero credits.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start space-y-2">
                    <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-lg bg-gradient-to-br from-pink-200/30 to-pink-300/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-pink-300/20`}>
                      <Lightning weight="fill" className="text-pink-400" size={isMobile ? 16 : 20} />
                    </div>
                    <div>
                      <h3 className="text-responsive-sm font-bold text-foreground">Evolve Button</h3>
                      <p className="text-responsive-sm text-muted-foreground leading-relaxed">
                        Upgrades it instantly. ChatGPT for apps.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start space-y-2">
                    <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-lg bg-gradient-to-br from-pink-200/30 to-pink-300/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-pink-300/20`}>
                      <Shield weight="fill" className="text-pink-400" size={isMobile ? 16 : 20} />
                    </div>
                    <div>
                      <h3 className="text-responsive-sm font-bold text-foreground">$500 Shield</h3>
                      <p className="text-responsive-sm text-muted-foreground leading-relaxed">
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

      <TeamShowcase />

      <section className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12 lg:py-20 max-w-[1400px]">
        <div className="max-w-5xl mx-auto">
          <Card className="relative overflow-hidden border-pink-300/30 bg-gradient-to-br from-pink-100/15 via-card to-pink-200/15">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNGgtMnYyaDJ2LTJ6bTAtOGgydi0yaC0ydjJ6bS0yLTJ2Mmgydi0yaC0yem0tMiAydjJoMnYtMmgtMnptMiA0aDJ2LTJoLTJ2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
            
            <div className={`relative ${isMobile ? 'p-6' : 'p-12'} text-center`}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Badge className={`mb-4 sm:mb-6 ${isMobile ? 'px-3 py-1.5 text-sm' : 'px-6 py-3 text-lg'} bg-gradient-to-r from-pink-200/40 to-pink-300/40 border-pink-300 shadow-lg shadow-pink-300/20`}>
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
                    className={`${isMobile ? 'text-base px-6 py-5' : 'text-xl px-10 py-7'} bg-gradient-to-r from-pink-300 via-pink-200 to-pink-300 hover:from-pink-400 hover:via-pink-300 hover:to-pink-400 text-pink-900 shadow-lg shadow-pink-300/30 hover:scale-105 transition-transform`}
                  >
                    <Fire weight="fill" size={isMobile ? 20 : 24} />
                    Launch The Forge
                  </Button>
                  <Button
                    size={isMobile ? 'default' : 'lg'}
                    variant="outline"
                    onClick={() => onNavigate('pricing')}
                    className={`${isMobile ? 'text-base px-6 py-5' : 'text-xl px-10 py-7'} border-pink-300/50 hover:bg-pink-100/10`}
                  >
                    See Pricing
                  </Button>
                </div>
              </motion.div>
            </div>
          </Card>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
