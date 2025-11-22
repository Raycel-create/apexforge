import { motion, AnimatePresence } from 'framer-motion'
import { Wrench, Hammer, PaintBrush, Rocket, Shield, Fire, Skull } from '@phosphor-icons/react'
import { useState, useEffect } from 'react'

interface AIRobotProps {
  agent: {
    id: string
    name: string
    avatar: string
    color: string
  }
  position: { x: number; y: number }
  tool: 'hammer' | 'wrench' | 'paintbrush' | 'rocket' | 'shield'
  isWorking: boolean
  message?: string
  consensusLevel?: number
  onComplete?: () => void
  blackForgeMode?: boolean
}

const TOOL_ICONS = {
  hammer: Hammer,
  wrench: Wrench,
  paintbrush: PaintBrush,
  rocket: Rocket,
  shield: Shield,
}

export function AIRobot({ agent, position, tool, isWorking, message, consensusLevel = 0, onComplete, blackForgeMode = false }: AIRobotProps) {
  const [showMessage, setShowMessage] = useState(false)
  const [emotion, setEmotion] = useState<'normal' | 'happy' | 'thinking' | 'frustrated'>('normal')
  const ToolIcon = TOOL_ICONS[tool]

  const demonicEmojis: Record<string, string> = {
    '🧠': '👹',
    '🛡️': '💀',
    '⚡': '⚡',
    '🎨': '🔥',
    '🦙': '😈',
  }

  const displayAvatar = blackForgeMode ? demonicEmojis[agent.avatar] || '😈' : agent.avatar

  useEffect(() => {
    if (message && isWorking) {
      setShowMessage(true)
      setEmotion('thinking')
      const timer = setTimeout(() => {
        setShowMessage(false)
        setEmotion('normal')
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [message, isWorking])

  useEffect(() => {
    if (consensusLevel >= 100) {
      setEmotion('happy')
      setTimeout(() => setEmotion('normal'), 3000)
    } else if (consensusLevel > 0 && consensusLevel < 40) {
      setEmotion('frustrated')
    } else if (consensusLevel >= 40 && consensusLevel < 80) {
      setEmotion('thinking')
    } else if (consensusLevel >= 80 && consensusLevel < 100) {
      setEmotion('normal')
    }
  }, [consensusLevel])

  const getEmotionAnimation = () => {
    switch (emotion) {
      case 'happy':
        return {
          rotate: [0, -10, 10, -10, 10, 0],
          y: [0, -10, -5, -10, -5, 0],
          scale: [1, 1.15, 1.1, 1.15, 1.1, 1],
        }
      case 'thinking':
        return {
          rotate: [-5, 5, -5],
          y: [0, -3, 0],
        }
      case 'frustrated':
        return {
          rotate: [0, -15, 15, -15, 15, 0],
          x: [0, -2, 2, -2, 2, 0],
        }
      default:
        return {}
    }
  }

  return (
    <motion.div
      className="absolute z-20 pointer-events-none"
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 15,
      }}
    >
      <div className="relative">
        <AnimatePresence>
          {showMessage && message && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 sm:w-64"
            >
              <div className={`${
                blackForgeMode 
                  ? 'bg-destructive/20 border-destructive/70 shadow-destructive/30' 
                  : 'bg-card border-primary/50'
              } border-2 rounded-xl p-2 sm:p-3 shadow-xl relative`}>
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 ${
                  blackForgeMode 
                    ? 'bg-destructive/20 border-destructive/70' 
                    : 'bg-card border-primary/50'
                } border-r-2 border-b-2 rotate-45`} />
                <p className={`text-[10px] sm:text-xs ${
                  blackForgeMode ? 'text-destructive font-bold' : 'text-foreground'
                } font-medium relative z-10`}>
                  {message}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="relative"
          animate={
            isWorking || emotion !== 'normal'
              ? getEmotionAnimation()
              : blackForgeMode
              ? {
                  y: [0, -5, 0],
                  rotate: [0, 3, -3, 0],
                }
              : {}
          }
          transition={{
            duration: emotion === 'happy' ? 1 : blackForgeMode ? 2 : 0.8,
            repeat: isWorking && emotion === 'normal' ? Infinity : emotion !== 'normal' ? 2 : blackForgeMode ? Infinity : 0,
            repeatDelay: 0.2,
          }}
        >
          <div className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${
            blackForgeMode
              ? 'bg-gradient-to-br from-destructive/30 to-destructive/10 border-destructive/70'
              : 'bg-gradient-to-br from-card to-card/50 border-primary/30'
          } border-2 ${
            emotion === 'happy' ? 'border-accent' : ''
          } shadow-xl flex items-center justify-center`}>
            <motion.div
              animate={
                isWorking || emotion === 'happy' 
                  ? { scale: [1, 1.2, 1] } 
                  : blackForgeMode
                  ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }
                  : {}
              }
              transition={{ 
                duration: 0.6, 
                repeat: (isWorking || emotion === 'happy' || blackForgeMode) ? Infinity : 0 
              }}
              className="text-2xl sm:text-3xl"
            >
              {displayAvatar}
            </motion.div>

            <motion.div
              className={`absolute -bottom-1 -right-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full ${
                blackForgeMode
                  ? 'bg-destructive/40 border-destructive'
                  : emotion === 'happy' 
                  ? 'bg-accent/30 border-accent' 
                  : 'bg-primary/20 border-primary'
              } border-2 flex items-center justify-center`}
              animate={
                isWorking
                  ? {
                      rotate: [0, 360],
                    }
                  : emotion === 'happy'
                  ? {
                      scale: [1, 1.3, 1],
                      rotate: [0, 15, -15, 0],
                    }
                  : {}
              }
              transition={{
                duration: emotion === 'happy' ? 0.5 : 2,
                repeat: (isWorking || emotion === 'happy') ? Infinity : 0,
                ease: emotion === 'happy' ? 'easeInOut' : 'linear',
              }}
            >
              <ToolIcon className={`${blackForgeMode ? 'text-destructive' : agent.color} w-3 h-3 sm:w-4 sm:h-4`} weight="fill" />
            </motion.div>
          </div>

          {(isWorking || emotion !== 'normal' || blackForgeMode) && (
            <motion.div
              className={`absolute -inset-2 rounded-2xl ${
                blackForgeMode
                  ? 'bg-destructive/30'
                  : emotion === 'happy' 
                  ? 'bg-accent/30' 
                  : 'bg-primary/20'
              } -z-10`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.2, 0.5],
              }}
              transition={{
                duration: blackForgeMode ? 1 : 1.5,
                repeat: Infinity,
              }}
            />
          )}

          {blackForgeMode && (
            <>
              <motion.div
                className="absolute -inset-4 rounded-full bg-destructive/20 -z-20 blur-md"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.1, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              <Fire 
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-destructive w-4 h-4 sm:w-6 sm:h-6" 
                weight="fill" 
              />
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
