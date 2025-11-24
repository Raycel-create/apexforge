import { motion } from 'framer-motion'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Play, ArrowRight, Sparkle, CheckCircle } from '@phosphor-icons/react'
import { useScreenSize } from '../hooks/use-mobile'
import { useState } from 'react'

export function ProductDemoShowcase() {
  const { isMobile } = useScreenSize()
  const [isPlaying, setIsPlaying] = useState(false)

  const demoSteps = [
    { time: '0:02', label: 'Describe your app idea', color: 'text-primary' },
    { time: '0:04', label: '5 AI agents debate live', color: 'text-accent' },
    { time: '0:07', label: 'Vote on best solutions', color: 'text-primary' },
    { time: '0:09', label: 'App deployed with domain', color: 'text-accent' },
  ]

  return (
    <section className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12 lg:py-16 max-w-[1400px]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <Badge className={`${isMobile ? 'px-3 py-1.5 text-xs' : 'px-5 py-2 text-sm'} bg-accent/20 border-accent/40 text-accent mb-4`}>
            <Sparkle weight="fill" size={isMobile ? 14 : 16} />
            See It In Action
          </Badge>
          <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl md:text-5xl'} font-bold mb-3 sm:mb-4`}>
            Watch an App Get Built in{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              10 Seconds
            </span>
          </h2>
          <p className={`${isMobile ? 'text-sm' : 'text-lg md:text-xl'} text-muted-foreground max-w-3xl mx-auto`}>
            From idea to live deployment—witness the entire AI team collaboration process
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/5 via-card to-accent/5 group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className={`relative ${isMobile ? 'p-4' : 'p-6 md:p-8'}`}>
              <div className="relative aspect-video bg-gradient-to-br from-background/50 to-muted/20 rounded-lg overflow-hidden border border-primary/20 group-hover:border-primary/40 transition-all">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTIwIDIwaDJ2Mmgtdi0yem0tMiAyaC0ydjJoMnYtMnptMi0ydjJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
                
                {!isPlaying ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 flex items-center justify-center group/play cursor-pointer"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                      <div className={`relative ${isMobile ? 'w-16 h-16' : 'w-20 h-20 md:w-24 md:h-24'} rounded-full bg-primary flex items-center justify-center glow-primary group-hover/play:scale-110 transition-transform`}>
                        <Play weight="fill" className="text-primary-foreground" size={isMobile ? 24 : 32} />
                      </div>
                    </div>
                  </motion.button>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="relative">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.2, 1] }}
                          transition={{ duration: 0.5 }}
                          className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} mx-auto rounded-full bg-accent/20 flex items-center justify-center glow-accent`}
                        >
                          <CheckCircle weight="fill" className="text-accent" size={isMobile ? 32 : 40} />
                        </motion.div>
                      </div>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`${isMobile ? 'text-sm' : 'text-lg'} font-semibold text-foreground`}
                      >
                        Demo video coming soon!
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}
                      >
                        Try the live generator to see it in action
                      </motion.p>
                    </div>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-background via-background/90 to-transparent">
                  <div className={`flex items-center justify-center ${isMobile ? 'gap-1 text-xs' : 'gap-2 text-sm'} text-muted-foreground`}>
                    <span className="font-mono font-semibold">⚡ 10 seconds</span>
                    <span className="opacity-50">•</span>
                    <span>5 AI agents</span>
                    <span className="opacity-50">•</span>
                    <span>Live deployment</span>
                  </div>
                </div>
              </div>

              <div className={`mt-6 sm:mt-8 grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 md:grid-cols-4 gap-4'}`}>
                {demoSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 group/step"
                  >
                    <div className={`flex-shrink-0 ${isMobile ? 'w-8 h-8' : 'w-10 h-10'} rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover/step:border-primary/50 transition-colors`}>
                      <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-mono font-bold ${step.color}`}>
                        {step.time}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-foreground leading-tight`}>
                        {step.label}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                viewport={{ once: true }}
                className={`${isMobile ? 'mt-6' : 'mt-8'} flex items-center justify-center gap-2 text-accent ${isMobile ? 'text-sm' : 'text-base'} font-semibold group/link cursor-pointer hover:gap-3 transition-all`}
              >
                <span>Want to see more examples?</span>
                <ArrowRight weight="bold" size={isMobile ? 18 : 20} className="group-hover/link:translate-x-1 transition-transform" />
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
