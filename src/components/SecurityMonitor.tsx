import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { Switch } from './ui/switch'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import {
  Shield,
  ShieldWarning,
  Bell,
  BellRinging,
  X,
  Eye,
  Trash,
  Download,
  GearSix,
  EnvelopeSimple,
  SpeakerHigh,
  Clock,
  FunnelSimple,
  CheckCircle,
} from '@phosphor-icons/react'
import {
  securityNotificationService,
  SecurityAlert,
  NotificationSettings,
} from '../lib/securityNotificationService'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'

export function SecurityMonitor() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([])
  const [settings, setSettings] = useState<NotificationSettings | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread' | SecurityAlert['severity']>('all')
  const [isMonitoring, setIsMonitoring] = useState(false)

  useEffect(() => {
    loadData()
    
    const unsubscribe = securityNotificationService.onAlert((alert) => {
      loadData()
    })

    return () => {
      unsubscribe()
      securityNotificationService.stopMonitoring()
    }
  }, [])

  useEffect(() => {
    if (isMonitoring) {
      securityNotificationService.startMonitoring(30)
    } else {
      securityNotificationService.stopMonitoring()
    }
  }, [isMonitoring])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [alertsData, settingsData, statsData] = await Promise.all([
        securityNotificationService.getAlerts(),
        securityNotificationService.getSettings(),
        securityNotificationService.getAlertStats(),
      ])
      setAlerts(alertsData)
      setSettings(settingsData)
      setStats(statsData)
      
      if (settingsData.enabled && !isMonitoring) {
        setIsMonitoring(true)
      }
    } catch (error) {
      console.error('Failed to load security data:', error)
      toast.error('Failed to load security monitoring data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearAlerts = async () => {
    if (confirm('Are you sure you want to clear all security alerts?')) {
      await securityNotificationService.clearAlerts()
      await loadData()
      toast.success('All security alerts cleared')
    }
  }

  const handleMarkAsRead = async (alertId: string) => {
    await securityNotificationService.markAlertAsRead(alertId)
    await loadData()
  }

  const handleExportAlerts = () => {
    const dataStr = JSON.stringify(filteredAlerts, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `security-alerts-${new Date().toISOString()}.json`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Security alerts exported')
  }

  const handleToggleMonitoring = async () => {
    const newState = !isMonitoring
    setIsMonitoring(newState)
    
    if (settings) {
      await securityNotificationService.updateSettings({ enabled: newState })
      setSettings({ ...settings, enabled: newState })
    }
    
    toast.success(newState ? 'Real-time monitoring enabled' : 'Real-time monitoring disabled')
  }

  const handleManualCheck = async () => {
    toast.info('Checking for suspicious activity...')
    const newAlerts = await securityNotificationService.checkForSuspiciousActivity()
    await loadData()
    
    if (newAlerts.length > 0) {
      toast.warning(`Found ${newAlerts.length} new security alert${newAlerts.length > 1 ? 's' : ''}`)
    } else {
      toast.success('No suspicious activity detected')
    }
  }

  const handleUpdateSettings = async (updates: Partial<NotificationSettings>) => {
    if (!settings) return
    
    const newSettings = { ...settings, ...updates }
    await securityNotificationService.updateSettings(updates)
    setSettings(newSettings)
    toast.success('Settings updated')
  }

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true
    if (filter === 'unread') return !alert.metadata?.read
    return alert.severity === filter
  })

  const getSeverityColor = (severity: SecurityAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-500'
      case 'high': return 'text-orange-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-blue-500'
      default: return 'text-muted-foreground'
    }
  }

  const getSeverityIcon = (severity: SecurityAlert['severity']) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <ShieldWarning weight="fill" className={getSeverityColor(severity)} size={20} />
      default:
        return <Shield weight="fill" className={getSeverityColor(severity)} size={20} />
    }
  }

  const getTypeLabel = (type: SecurityAlert['type']) => {
    const labels: Record<SecurityAlert['type'], string> = {
      failed_login: 'Failed Login',
      suspicious_ip: 'Suspicious IP',
      multiple_attempts: 'Multiple Attempts',
      unauthorized_access: 'Unauthorized Access',
      ip_blocked: 'IP Blocked',
      session_anomaly: 'Session Anomaly',
    }
    return labels[type] || type
  }

  if (isLoading) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
        <div className="flex items-center justify-center py-12">
          <Clock size={32} className="animate-spin text-primary" />
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <motion.div
                animate={{ scale: isMonitoring ? [1, 1.2, 1] : 1 }}
                transition={{ repeat: isMonitoring ? Infinity : 0, duration: 2 }}
              >
                {isMonitoring ? (
                  <BellRinging weight="fill" className="text-primary" size={28} />
                ) : (
                  <Bell weight="fill" className="text-muted-foreground" size={28} />
                )}
              </motion.div>
              Real-Time Security Monitor
            </h3>
            <p className="text-sm text-muted-foreground">
              {isMonitoring ? (
                <span className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Active monitoring for suspicious access attempts
                </span>
              ) : (
                'Monitoring is currently disabled'
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleToggleMonitoring}
              variant={isMonitoring ? 'default' : 'outline'}
              size="sm"
              className="gap-2"
            >
              {isMonitoring ? 'Disable' : 'Enable'} Monitoring
            </Button>
            <Button
              onClick={handleManualCheck}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Shield size={16} />
              Check Now
            </Button>
            <Button
              onClick={() => setShowSettings(true)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <GearSix size={16} />
              Settings
            </Button>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
            <Card className="p-3 bg-background/50 border-border/50">
              <div className="text-xl font-bold text-foreground">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </Card>
            <Card className="p-3 bg-background/50 border-red-500/30">
              <div className="text-xl font-bold text-red-500">{stats.critical}</div>
              <div className="text-xs text-muted-foreground">Critical</div>
            </Card>
            <Card className="p-3 bg-background/50 border-orange-500/30">
              <div className="text-xl font-bold text-orange-500">{stats.high}</div>
              <div className="text-xs text-muted-foreground">High</div>
            </Card>
            <Card className="p-3 bg-background/50 border-yellow-500/30">
              <div className="text-xl font-bold text-yellow-500">{stats.medium}</div>
              <div className="text-xs text-muted-foreground">Medium</div>
            </Card>
            <Card className="p-3 bg-background/50 border-blue-500/30">
              <div className="text-xl font-bold text-blue-500">{stats.low}</div>
              <div className="text-xs text-muted-foreground">Low</div>
            </Card>
            <Card className="p-3 bg-background/50 border-purple-500/30">
              <div className="text-xl font-bold text-purple-500">{stats.unread}</div>
              <div className="text-xs text-muted-foreground">Unread</div>
            </Card>
            <Card className="p-3 bg-background/50 border-primary/30">
              <div className="text-xl font-bold text-primary">{stats.last24h}</div>
              <div className="text-xs text-muted-foreground">Last 24h</div>
            </Card>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <FunnelSimple size={16} className="text-muted-foreground" />
            <span className="text-sm font-semibold text-muted-foreground">Filter:</span>
            <Button
              onClick={() => setFilter('all')}
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              className="h-7 text-xs"
            >
              All
            </Button>
            <Button
              onClick={() => setFilter('unread')}
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              className="h-7 text-xs"
            >
              Unread ({stats?.unread || 0})
            </Button>
            <Button
              onClick={() => setFilter('critical')}
              variant={filter === 'critical' ? 'default' : 'outline'}
              size="sm"
              className="h-7 text-xs"
            >
              Critical
            </Button>
            <Button
              onClick={() => setFilter('high')}
              variant={filter === 'high' ? 'default' : 'outline'}
              size="sm"
              className="h-7 text-xs"
            >
              High
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
          <div className="flex items-center gap-2">
            <Button
              onClick={handleExportAlerts}
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={alerts.length === 0}
            >
              <Download size={14} />
              Export
            </Button>
            <Button
              onClick={handleClearAlerts}
              variant="outline"
              size="sm"
              className="gap-2 text-destructive hover:bg-destructive/10"
              disabled={alerts.length === 0}
            >
              <Trash size={14} />
              Clear All
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[500px] pr-4">
          <AnimatePresence mode="popLayout">
            {filteredAlerts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <Shield size={48} className="text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">No security alerts</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {filter !== 'all' ? 'Try changing the filter' : 'All systems secure'}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-2">
                {filteredAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: Math.min(index * 0.02, 0.3) }}
                  >
                    <Card
                      className={`p-4 transition-all ${
                        alert.metadata?.read
                          ? 'bg-background/20 border-border/30'
                          : 'bg-background/50 border-primary/30'
                      } hover:bg-background/70`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-0.5">
                            {getSeverityIcon(alert.severity)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <Badge
                                variant={
                                  alert.severity === 'critical' || alert.severity === 'high'
                                    ? 'destructive'
                                    : 'secondary'
                                }
                                className="text-xs"
                              >
                                {alert.severity.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {getTypeLabel(alert.type)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(alert.timestamp).toLocaleString()}
                              </span>
                              {!alert.metadata?.read && (
                                <Badge variant="default" className="text-xs">
                                  NEW
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm font-semibold text-foreground mb-1">
                              {alert.title}
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              {alert.message}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                              <span className="font-mono">IP: {alert.ipAddress}</span>
                              {alert.username && <span>User: {alert.username}</span>}
                            </div>
                            {alert.actionRequired && (
                              <div className="mt-2 text-xs font-semibold text-orange-500 flex items-center gap-1">
                                <ShieldWarning size={14} />
                                Action Required
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {!alert.metadata?.read && (
                            <Button
                              onClick={() => handleMarkAsRead(alert.id)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <CheckCircle size={16} />
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>

        <Separator className="my-4" />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing {filteredAlerts.length} of {alerts.length} alerts
          </span>
          <span>
            Last check: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </Card>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GearSix size={24} />
              Security Notification Settings
            </DialogTitle>
            <DialogDescription>
              Configure how you want to be notified about security events
            </DialogDescription>
          </DialogHeader>

          {settings && (
            <div className="space-y-6 mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Real-time Monitoring</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically check for suspicious activity
                    </p>
                  </div>
                  <Switch
                    checked={settings.enabled}
                    onCheckedChange={(checked) =>
                      handleUpdateSettings({ enabled: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2">
                      <Bell size={18} />
                      Toast Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Show on-screen notifications for alerts
                    </p>
                  </div>
                  <Switch
                    checked={settings.toastEnabled}
                    onCheckedChange={(checked) =>
                      handleUpdateSettings({ toastEnabled: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2">
                      <SpeakerHigh size={18} />
                      Alert Sounds
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Play sound when alerts are detected
                    </p>
                  </div>
                  <Switch
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) =>
                      handleUpdateSettings({ soundEnabled: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base flex items-center gap-2">
                      <EnvelopeSimple size={18} />
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Send email alerts for critical events
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailEnabled}
                    onCheckedChange={(checked) =>
                      handleUpdateSettings({ emailEnabled: checked })
                    }
                  />
                </div>

                {settings.emailEnabled && (
                  <div className="space-y-2 pl-8">
                    <Label htmlFor="email-address">Email Address</Label>
                    <Input
                      id="email-address"
                      type="email"
                      placeholder="ceo@example.com"
                      value={settings.emailAddress || ''}
                      onChange={(e) =>
                        handleUpdateSettings({ emailAddress: e.target.value })
                      }
                    />
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Alert Thresholds</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="failed-attempts">
                    Failed Attempts Threshold: {settings.thresholds.failedAttempts}
                  </Label>
                  <Input
                    id="failed-attempts"
                    type="number"
                    min="1"
                    max="20"
                    value={settings.thresholds.failedAttempts}
                    onChange={(e) =>
                      handleUpdateSettings({
                        thresholds: {
                          ...settings.thresholds,
                          failedAttempts: parseInt(e.target.value) || 3,
                        },
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Alert when this many failed attempts occur
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time-window">
                    Time Window: {settings.thresholds.timeWindowMinutes} minutes
                  </Label>
                  <Input
                    id="time-window"
                    type="number"
                    min="1"
                    max="120"
                    value={settings.thresholds.timeWindowMinutes}
                    onChange={(e) =>
                      handleUpdateSettings({
                        thresholds: {
                          ...settings.thresholds,
                          timeWindowMinutes: parseInt(e.target.value) || 15,
                        },
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Monitor activity within this time period
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cooldown">
                    Alert Cooldown: {settings.thresholds.alertCooldownMinutes} minutes
                  </Label>
                  <Input
                    id="cooldown"
                    type="number"
                    min="1"
                    max="60"
                    value={settings.thresholds.alertCooldownMinutes}
                    onChange={(e) =>
                      handleUpdateSettings({
                        thresholds: {
                          ...settings.thresholds,
                          alertCooldownMinutes: parseInt(e.target.value) || 5,
                        },
                      })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimum time between duplicate alerts
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
