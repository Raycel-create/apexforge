import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { 
  ShieldCheck, 
  ShieldSlash, 
  SignOut, 
  Clock, 
  Keyboard,
  Trash,
  Download,
  FunnelSimple,
  X
} from '@phosphor-icons/react'
import { useAuditLogs, AuditLogEntry } from '../lib/ceoAuditService'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

type FilterType = 'all' | 'success' | 'failed' | 'logout' | 'timeout' | 'keyboard'

export function CEOAuditLog() {
  const { logs, refreshLogs, clearLogs } = useAuditLogs()
  const [filter, setFilter] = useState<FilterType>('all')
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    refreshLogs()
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshLogs()
    setTimeout(() => setIsRefreshing(false), 500)
    toast.success('Audit logs refreshed')
  }

  const handleClearLogs = async () => {
    if (confirm('Are you sure you want to clear all audit logs? This action cannot be undone.')) {
      await clearLogs()
      toast.success('Audit logs cleared')
    }
  }

  const handleExportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ceo-audit-logs-${new Date().toISOString()}.json`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Audit logs exported')
  }

  const filteredLogs = (logs || []).filter(log => {
    if (filter === 'all') return true
    if (filter === 'success') return log.action === 'login_success'
    if (filter === 'failed') return log.action === 'login_failed'
    if (filter === 'logout') return log.action === 'logout'
    if (filter === 'timeout') return log.action === 'session_timeout'
    if (filter === 'keyboard') return log.action === 'keyboard_shortcut_attempt'
    return true
  })

  const getActionIcon = (action: AuditLogEntry['action']) => {
    switch (action) {
      case 'login_success':
        return <ShieldCheck weight="fill" className="text-green-500" size={18} />
      case 'login_failed':
      case 'login_attempt':
        return <ShieldSlash weight="fill" className="text-red-500" size={18} />
      case 'logout':
        return <SignOut weight="fill" className="text-blue-500" size={18} />
      case 'session_timeout':
        return <Clock weight="fill" className="text-orange-500" size={18} />
      case 'keyboard_shortcut_attempt':
        return <Keyboard weight="fill" className="text-purple-500" size={18} />
      default:
        return <ShieldCheck weight="fill" className="text-muted-foreground" size={18} />
    }
  }

  const getActionLabel = (action: AuditLogEntry['action']) => {
    switch (action) {
      case 'login_success':
        return 'Login Success'
      case 'login_failed':
        return 'Login Failed'
      case 'login_attempt':
        return 'Login Attempt'
      case 'logout':
        return 'Logout'
      case 'session_timeout':
        return 'Session Timeout'
      case 'keyboard_shortcut_attempt':
        return 'Keyboard Shortcut'
      default:
        return action
    }
  }

  const getActionBadgeVariant = (action: AuditLogEntry['action']) => {
    switch (action) {
      case 'login_success':
        return 'default'
      case 'login_failed':
      case 'login_attempt':
        return 'destructive'
      case 'logout':
        return 'secondary'
      case 'session_timeout':
        return 'outline'
      case 'keyboard_shortcut_attempt':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
    }
  }

  const stats = {
    total: (logs || []).length,
    success: (logs || []).filter(l => l.action === 'login_success').length,
    failed: (logs || []).filter(l => l.action === 'login_failed').length,
    keyboard: (logs || []).filter(l => l.action === 'keyboard_shortcut_attempt').length,
  }

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <ShieldCheck weight="duotone" className="text-primary" size={28} />
            Session Audit Log
          </h3>
          <p className="text-sm text-muted-foreground">
            All CEO dashboard access attempts and security events
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isRefreshing}
            className="gap-2"
          >
            <motion.div
              animate={{ rotate: isRefreshing ? 360 : 0 }}
              transition={{ duration: 0.5, repeat: isRefreshing ? Infinity : 0 }}
            >
              <Clock size={16} />
            </motion.div>
            Refresh
          </Button>
          <Button
            onClick={handleExportLogs}
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={!logs || logs.length === 0}
          >
            <Download size={16} />
            Export
          </Button>
          <Button
            onClick={handleClearLogs}
            variant="outline"
            size="sm"
            className="gap-2 text-destructive hover:bg-destructive/10"
            disabled={!logs || logs.length === 0}
          >
            <Trash size={16} />
            Clear
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-background/50 border-border/50">
          <div className="text-2xl font-bold text-foreground">{stats.total}</div>
          <div className="text-xs text-muted-foreground">Total Events</div>
        </Card>
        <Card className="p-4 bg-background/50 border-green-500/30">
          <div className="text-2xl font-bold text-green-500">{stats.success}</div>
          <div className="text-xs text-muted-foreground">Successful Logins</div>
        </Card>
        <Card className="p-4 bg-background/50 border-red-500/30">
          <div className="text-2xl font-bold text-red-500">{stats.failed}</div>
          <div className="text-xs text-muted-foreground">Failed Attempts</div>
        </Card>
        <Card className="p-4 bg-background/50 border-purple-500/30">
          <div className="text-2xl font-bold text-purple-500">{stats.keyboard}</div>
          <div className="text-xs text-muted-foreground">Keyboard Shortcuts</div>
        </Card>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <FunnelSimple size={16} className="text-muted-foreground" />
        <span className="text-sm font-semibold text-muted-foreground">Filter:</span>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            className="h-7 text-xs"
          >
            All ({(logs || []).length})
          </Button>
          <Button
            onClick={() => setFilter('success')}
            variant={filter === 'success' ? 'default' : 'outline'}
            size="sm"
            className="h-7 text-xs"
          >
            Success ({stats.success})
          </Button>
          <Button
            onClick={() => setFilter('failed')}
            variant={filter === 'failed' ? 'default' : 'outline'}
            size="sm"
            className="h-7 text-xs"
          >
            Failed ({stats.failed})
          </Button>
          <Button
            onClick={() => setFilter('keyboard')}
            variant={filter === 'keyboard' ? 'default' : 'outline'}
            size="sm"
            className="h-7 text-xs"
          >
            Keyboard ({stats.keyboard})
          </Button>
          {filter !== 'all' && (
            <Button
              onClick={() => setFilter('all')}
              variant="ghost"
              size="sm"
              className="h-7 text-xs gap-1"
            >
              <X size={12} />
              Clear
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <AnimatePresence mode="popLayout">
          {filteredLogs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <ShieldCheck size={48} className="text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No audit logs found</p>
              <p className="text-xs text-muted-foreground mt-2">
                {filter !== 'all' ? 'Try changing the filter' : 'Logs will appear here as events occur'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {filteredLogs.map((log, index) => {
                const { date, time } = formatTimestamp(log.timestamp)
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: Math.min(index * 0.02, 0.3) }}
                  >
                    <Card className="p-4 bg-background/30 hover:bg-background/50 transition-colors border-border/50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-0.5">
                            {getActionIcon(log.action)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={getActionBadgeVariant(log.action)} className="text-xs">
                                {getActionLabel(log.action)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {date} at {time}
                              </span>
                            </div>
                            <div className="text-sm font-medium text-foreground mb-1">
                              User: {log.username}
                            </div>
                            {log.details && (
                              <div className="text-xs text-muted-foreground mb-2">
                                {log.details}
                              </div>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="font-mono">IP: {log.ipAddress}</span>
                            </div>
                            <div className="text-xs text-muted-foreground/70 mt-1 truncate">
                              {log.userAgent}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </AnimatePresence>
      </ScrollArea>

      <Separator className="my-4" />

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing {filteredLogs.length} of {(logs || []).length} events
        </span>
        <span>
          Last updated: {new Date().toLocaleTimeString()}
        </span>
      </div>
    </Card>
  )
}
