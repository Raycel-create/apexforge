import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Clock, ShieldWarning } from '@phosphor-icons/react'
import { useCEOAuth } from '../lib/CEOAuthContext'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

type Page = 'home' | 'dashboard' | 'pricing' | 'ceo' | 'generator' | 'auth'

interface SessionTimeoutDialogProps {
  onNavigate?: (page: Page) => void
}

export function SessionTimeoutDialog({ onNavigate }: SessionTimeoutDialogProps) {
  const { showTimeoutWarning, timeUntilExpiry, extendSession, logout } = useCEOAuth()
  const [countdown, setCountdown] = useState<string>('')

  useEffect(() => {
    if (timeUntilExpiry !== null) {
      const minutes = Math.floor(timeUntilExpiry / 60000)
      const seconds = Math.floor((timeUntilExpiry % 60000) / 1000)
      setCountdown(`${minutes}:${seconds.toString().padStart(2, '0')}`)

      if (timeUntilExpiry <= 0 && showTimeoutWarning) {
        toast.error('Session expired', {
          description: 'Your session has expired due to inactivity. Please log in again.',
          duration: 5000,
        })
        if (onNavigate) {
          onNavigate('ceo')
        }
      }
    }
  }, [timeUntilExpiry, showTimeoutWarning, onNavigate])

  const handleExtend = () => {
    extendSession()
    toast.success('Session extended', {
      description: 'Your session has been extended for another 30 minutes.',
    })
  }

  const handleLogout = () => {
    logout()
    toast.info('Logged out', {
      description: 'You have been logged out successfully.',
    })
    if (onNavigate) {
      onNavigate('ceo')
    }
  }

  if (!showTimeoutWarning) return null

  return (
    <Dialog open={showTimeoutWarning} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md border-destructive/50">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <ShieldWarning className="text-destructive" size={32} weight="fill" />
            </motion.div>
            <DialogTitle className="text-xl">Session Expiring Soon</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            Your session will expire due to inactivity. Would you like to extend your session?
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center gap-3 py-6 bg-destructive/10 rounded-lg border border-destructive/20">
          <Clock size={24} className="text-destructive" weight="bold" />
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Time Remaining</div>
            <motion.div
              key={countdown}
              initial={{ scale: 1.2, color: 'rgb(239 68 68)' }}
              animate={{ scale: 1, color: 'inherit' }}
              className="text-3xl font-bold font-mono text-destructive"
            >
              {countdown}
            </motion.div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full sm:w-auto"
          >
            Logout Now
          </Button>
          <Button
            onClick={handleExtend}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90"
          >
            Extend Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
