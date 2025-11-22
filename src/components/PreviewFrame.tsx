import { motion, AnimatePresence } from 'framer-motion'
import { DeviceRotate, Confetti } from '@phosphor-icons/react'
import { useState, useEffect } from 'react'
import { AIRobot } from './AIRobot'
import { Card } from './ui/card'
import { Progress } from './ui/progress'
import { useIsMobile } from '../hooks/use-mobile'
import { ConfettiEffect } from './ConfettiEffect'

interface PreviewFrameProps {
  url: string
  debates: Array<{
    agent: {
      id: string
      name: string
      avatar: string
      color: string
    }
    message: string
  }>
  isGenerating: boolean
}

const ROBOT_DATA = [
  { id: 'grok', name: 'Grok-2', avatar: '🚀', color: 'text-cyan-400', tool: 'wrench' as const },
  { id: 'claude', name: 'Claude 3.5', avatar: '🦉', color: 'text-purple-400', tool: 'shield' as const },
  { id: 'gemini', name: 'Gemini 1.5', avatar: '🌈', color: 'text-orange-400', tool: 'paintbrush' as const },
  { id: 'gpt', name: 'GPT-4o', avatar: '🧠', color: 'text-green-400', tool: 'hammer' as const },
  { id: 'llama', name: 'Llama 3.1', avatar: '🦙', color: 'text-yellow-400', tool: 'rocket' as const },
]

export function PreviewFrame({ url, debates, isGenerating }: PreviewFrameProps) {
  const [consensus, setConsensus] = useState(0)
  const [isShipped, setIsShipped] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [activeRobot, setActiveRobot] = useState(0)
  const [robotPositions, setRobotPositions] = useState<Array<{ x: number; y: number }>>([])
  const [showWelcome, setShowWelcome] = useState(true)
  const isMobile = useIsMobile()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setConsensus((prev) => {
          const next = Math.min(100, prev + Math.random() * 15)
          if (next >= 100 && !isShipped) {
            setIsShipped(true)
            setShowConfetti(true)
            setTimeout(() => {
              setIsShipped(false)
              setShowConfetti(false)
            }, 3000)
          }
          return next
        })
      }, 500)
      return () => clearInterval(interval)
    } else if (!isGenerating && consensus < 100) {
      setConsensus(100)
      setIsShipped(true)
      setShowConfetti(true)
      setTimeout(() => {
        setIsShipped(false)
        setShowConfetti(false)
      }, 3000)
    }
  }, [isGenerating, consensus, isShipped])

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setActiveRobot((prev) => (prev + 1) % ROBOT_DATA.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isGenerating])

  useEffect(() => {
    const updatePositions = () => {
      if (isMobile) {
        setRobotPositions([
          { x: 10, y: -60 },
          { x: -50, y: 20 },
          { x: 10, y: 100 },
          { x: -50, y: 180 },
          { x: 10, y: 260 },
        ])
      } else {
        const centerX = 640
        const centerY = 360
        const radius = 420
        const positions = ROBOT_DATA.map((_, i) => {
          const angle = (i / ROBOT_DATA.length) * Math.PI * 2 - Math.PI / 2
          return {
            x: centerX + Math.cos(angle) * radius - 32,
            y: centerY + Math.sin(angle) * radius - 32,
          }
        })
        setRobotPositions(positions)
      }
    }

    updatePositions()
    window.addEventListener('resize', updatePositions)
    return () => window.removeEventListener('resize', updatePositions)
  }, [isMobile])

  const currentDebate = debates[Math.min(activeRobot, debates.length - 1)]

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-8 sm:mt-12 lg:mt-16"
    >
      {showConfetti && <ConfettiEffect />}
      
      <Card className="p-4 sm:p-6 lg:p-8 border-primary/30 glow-primary overflow-hidden">
        <div className="text-center mb-6 sm:mb-8">
          <motion.h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 flex items-center justify-center gap-3"
            animate={isShipped ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            {isMobile && <DeviceRotate className="text-accent w-6 h-6 sm:w-8 sm:h-8" weight="fill" />}
            Your App — Live {isMobile ? 'Preview' : 'in Landscape'}
            {isShipped && <Confetti className="text-accent w-6 h-6 sm:w-8 sm:h-8 animate-pulse-glow" weight="fill" />}
          </motion.h2>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {isMobile ? 'Full-width responsive view' : '1280 × 720px landscape preview'}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm sm:text-base font-semibold">Consensus Meter</span>
            <span className="text-sm sm:text-base font-bold text-primary">{Math.round(consensus)}%</span>
          </div>
          <Progress value={consensus} className="h-3 sm:h-4" />
          {consensus >= 100 && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-accent font-bold text-sm sm:text-base mt-2"
            >
              ✓ 100% Consensus Reached — SHIPPED! 🚀
            </motion.p>
          )}
        </div>

        <div className="relative mx-auto" style={{ maxWidth: isMobile ? '100%' : '1280px' }}>
          <div
            className={`relative bg-background rounded-xl sm:rounded-2xl shadow-2xl border-2 border-primary/30 overflow-hidden`}
            style={
              isMobile
                ? { aspectRatio: '9/16', width: '100%' }
                : { width: '1280px', height: '720px', margin: '0 auto' }
            }
          >
            {url ? (
              <iframe
                src={url}
                className="w-full h-full"
                title="App Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-card">
                <div className="text-center p-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full border-4 border-primary border-t-transparent"
                  />
                  <p className="text-muted-foreground text-sm sm:text-base">Building your app...</p>
                </div>
              </div>
            )}

            {!isMobile && ROBOT_DATA.map((robot, index) => (
              <AIRobot
                key={robot.id}
                agent={robot}
                position={robotPositions[index] || { x: 0, y: 0 }}
                tool={robot.tool}
                isWorking={isGenerating && activeRobot === index}
                consensusLevel={consensus}
                message={
                  showWelcome
                    ? index === 0
                      ? "Ready to build your dream! 👋"
                      : undefined
                    : isGenerating && activeRobot === index && currentDebate?.agent.id === robot.id
                    ? currentDebate.message
                    : undefined
                }
              />
            ))}
          </div>

          {isMobile && isGenerating && (
            <div className="mt-6 space-y-3">
              {ROBOT_DATA.map((robot, index) => (
                <motion.div
                  key={robot.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 ${
                    activeRobot === index ? 'border-primary bg-primary/10' : 'border-border bg-card/50'
                  }`}
                >
                  <div className="text-2xl">{robot.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${robot.color}`}>{robot.name}</p>
                    {activeRobot === index && currentDebate?.agent.id === robot.id && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">{currentDebate.message}</p>
                    )}
                  </div>
                  {activeRobot === index && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      {TOOL_ICONS[robot.tool] && <div className={`${robot.color}`}>{TOOL_ICONS[robot.tool]({ weight: 'fill', size: 20 })}</div>}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <AnimatePresence>
          {isShipped && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className="mt-6 sm:mt-8 text-center"
            >
              <div className="inline-flex items-center gap-3 bg-accent/20 border-2 border-accent rounded-2xl px-6 py-4 sm:px-8 sm:py-6 shadow-xl">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 15, 0], y: [0, -5, 0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: 2 }}
                  className="text-4xl sm:text-5xl"
                >
                  🎉
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-accent">SHIPPED!</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">All robots celebrate together!</p>
                </motion.div>
                <motion.div
                  animate={{ rotate: [0, -15, 15, -15, 0], y: [0, -5, 0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: 2 }}
                  className="text-4xl sm:text-5xl"
                >
                  🚀
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isGenerating && consensus >= 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-xs sm:text-sm text-muted-foreground italic">
              💡 This is the most screenshot-able, lovable AI builder interface in history.
            </p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}

const TOOL_ICONS = {
  hammer: (props: any) => <span {...props}>🔨</span>,
  wrench: (props: any) => <span {...props}>🔧</span>,
  paintbrush: (props: any) => <span {...props}>🖌️</span>,
  rocket: (props: any) => <span {...props}>🚀</span>,
  shield: (props: any) => <span {...props}>🛡️</span>,
}
