import { useEffect, useState } from 'react'
import { Clock, ShieldCheck } from '@phosphor-icons/react'
import { Badge } from './ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { useCEOAuth } from '../lib/CEOAuthContext'
import { motion } from 'framer-motion'

export function SessionIndicator() {
  const { isAuthenticated, timeUntilExpiry } = useCEOAuth()
  const [displayTime, setDisplayTime] = useState<string>('')
  const [isWarning, setIsWarning] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || timeUntilExpiry === null) {
      setDisplayTime('')
      return
    }

    const minutes = Math.floor(timeUntilExpiry / 60000)
    const seconds = Math.floor((timeUntilExpiry % 60000) / 1000)
    setDisplayTime(`${minutes}:${seconds.toString().padStart(2, '0')}`)
    setIsWarning(timeUntilExpiry <= 2 * 60 * 1000)
  }, [isAuthenticated, timeUntilExpiry])

  if (!isAuthenticated) return null

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            animate={isWarning ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1, repeat: isWarning ? Infinity : 0 }}
          >
            <Badge 
              variant="outline" 
              className={`flex items-center gap-2 px-3 py-1.5 ${
                isWarning 
                  ? 'border-destructive/50 bg-destructive/10 text-destructive' 
                  : 'border-primary/50 bg-primary/10 text-primary'
              }`}
            >
              {isWarning ? (
                <Clock size={14} weight="bold" className="animate-pulse" />
              ) : (
                <ShieldCheck size={14} weight="fill" />
              )}
              <span className="font-mono text-xs font-semibold">{displayTime}</span>
            </Badge>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="text-xs">
            {isWarning ? 'Session expiring soon!' : 'Session time remaining'}
          </p>
          <p className="text-xs text-muted-foreground">Auto-logout after 30 min inactivity</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
