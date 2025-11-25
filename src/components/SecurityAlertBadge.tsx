import { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { securityNotificationService } from '../lib/securityNotificationService'
import { motion, AnimatePresence } from 'framer-motion'

export function SecurityAlertBadge() {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const loadUnreadCount = async () => {
      const count = await securityNotificationService.getUnreadCount()
      setUnreadCount(count)
    }

    loadUnreadCount()

    const unsubscribe = securityNotificationService.onAlert(() => {
      loadUnreadCount()
    })

    const interval = setInterval(loadUnreadCount, 10000)

    return () => {
      unsubscribe()
      clearInterval(interval)
    }
  }, [])

  if (unreadCount === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className="absolute -top-1 -right-1"
      >
        <Badge
          variant="destructive"
          className="h-5 min-w-[20px] px-1 flex items-center justify-center text-[10px] font-bold animate-pulse"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      </motion.div>
    </AnimatePresence>
  )
}
