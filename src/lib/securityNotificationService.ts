import { toast } from 'sonner'
import { ceoAuditService, AuditLogEntry } from './ceoAuditService'
import { ipWhitelistService } from './ipWhitelistService'

export interface SecurityAlert {
  id: string
  timestamp: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  type: 'failed_login' | 'suspicious_ip' | 'multiple_attempts' | 'unauthorized_access' | 'ip_blocked' | 'session_anomaly'
  title: string
  message: string
  ipAddress: string
  username?: string
  userAgent?: string
  actionRequired?: boolean
  metadata?: Record<string, any>
}

export interface NotificationSettings {
  enabled: boolean
  emailEnabled: boolean
  toastEnabled: boolean
  soundEnabled: boolean
  emailAddress?: string
  thresholds: {
    failedAttempts: number
    timeWindowMinutes: number
    alertCooldownMinutes: number
  }
}

class SecurityNotificationService {
  private static readonly ALERTS_KEY = 'security-alerts'
  private static readonly SETTINGS_KEY = 'security-notification-settings'
  private static readonly LAST_ALERT_KEY = 'security-last-alert-time'
  private static readonly MAX_ALERTS = 1000

  private monitoringInterval?: number
  private listeners: Array<(alert: SecurityAlert) => void> = []

  async getSettings(): Promise<NotificationSettings> {
    const settings = await window.spark.kv.get<NotificationSettings>(
      SecurityNotificationService.SETTINGS_KEY
    )
    return settings || {
      enabled: true,
      emailEnabled: false,
      toastEnabled: true,
      soundEnabled: true,
      thresholds: {
        failedAttempts: 3,
        timeWindowMinutes: 15,
        alertCooldownMinutes: 5,
      },
    }
  }

  async updateSettings(settings: Partial<NotificationSettings>): Promise<void> {
    const current = await this.getSettings()
    await window.spark.kv.set(SecurityNotificationService.SETTINGS_KEY, {
      ...current,
      ...settings,
    })
  }

  async getAlerts(limit?: number): Promise<SecurityAlert[]> {
    const alerts = await window.spark.kv.get<SecurityAlert[]>(
      SecurityNotificationService.ALERTS_KEY
    )
    const allAlerts = alerts || []
    return limit ? allAlerts.slice(0, limit) : allAlerts
  }

  async addAlert(alert: Omit<SecurityAlert, 'id' | 'timestamp'>): Promise<SecurityAlert> {
    const newAlert: SecurityAlert = {
      ...alert,
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    }

    const alerts = await this.getAlerts()
    alerts.unshift(newAlert)

    if (alerts.length > SecurityNotificationService.MAX_ALERTS) {
      alerts.splice(SecurityNotificationService.MAX_ALERTS)
    }

    await window.spark.kv.set(SecurityNotificationService.ALERTS_KEY, alerts)

    this.notifyListeners(newAlert)
    await this.sendNotification(newAlert)

    return newAlert
  }

  async clearAlerts(): Promise<void> {
    await window.spark.kv.set(SecurityNotificationService.ALERTS_KEY, [])
  }

  async markAlertAsRead(alertId: string): Promise<void> {
    const alerts = await this.getAlerts()
    const alert = alerts.find(a => a.id === alertId)
    if (alert) {
      alert.metadata = { ...alert.metadata, read: true }
      await window.spark.kv.set(SecurityNotificationService.ALERTS_KEY, alerts)
    }
  }

  async getUnreadCount(): Promise<number> {
    const alerts = await this.getAlerts()
    return alerts.filter(a => !a.metadata?.read).length
  }

  private async sendNotification(alert: SecurityAlert): Promise<void> {
    const settings = await this.getSettings()

    if (!settings.enabled) return

    if (settings.toastEnabled) {
      this.sendToastNotification(alert)
    }

    if (settings.soundEnabled) {
      this.playAlertSound(alert.severity)
    }

    if (settings.emailEnabled && settings.emailAddress) {
      await this.sendEmailNotification(alert, settings.emailAddress)
    }
  }

  private sendToastNotification(alert: SecurityAlert): void {
    const severityIcons = {
      low: '🔵',
      medium: '🟡',
      high: '🟠',
      critical: '🔴',
    }

    const icon = severityIcons[alert.severity]

    switch (alert.severity) {
      case 'critical':
        toast.error(`${icon} ${alert.title}`, {
          description: alert.message,
          duration: 10000,
          action: alert.actionRequired
            ? {
                label: 'Review',
                onClick: () => {
                  window.dispatchEvent(
                    new CustomEvent('open-security-panel', { detail: alert })
                  )
                },
              }
            : undefined,
        })
        break
      case 'high':
        toast.warning(`${icon} ${alert.title}`, {
          description: alert.message,
          duration: 8000,
        })
        break
      case 'medium':
        toast.info(`${icon} ${alert.title}`, {
          description: alert.message,
          duration: 6000,
        })
        break
      case 'low':
        toast(`${icon} ${alert.title}`, {
          description: alert.message,
          duration: 4000,
        })
        break
    }
  }

  private playAlertSound(severity: SecurityAlert['severity']): void {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      const frequencies = {
        low: 400,
        medium: 600,
        high: 800,
        critical: 1000,
      }

      oscillator.frequency.value = frequencies[severity]
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.warn('Failed to play alert sound:', error)
    }
  }

  private async sendEmailNotification(alert: SecurityAlert, email: string): Promise<void> {
    try {
      const subject = `🚨 Security Alert: ${alert.title}`
      const body = `
Security Alert Detected

Severity: ${alert.severity.toUpperCase()}
Time: ${new Date(alert.timestamp).toLocaleString()}
Type: ${alert.type}

${alert.message}

IP Address: ${alert.ipAddress}
${alert.username ? `Username: ${alert.username}` : ''}
${alert.userAgent ? `User Agent: ${alert.userAgent}` : ''}

${alert.actionRequired ? '⚠️ ACTION REQUIRED: Please review this alert immediately.' : ''}

This is an automated security notification from ApexForge CEO Dashboard.
      `.trim()

      console.log(`Email notification would be sent to ${email}:`, { subject, body })
    } catch (error) {
      console.error('Failed to send email notification:', error)
    }
  }

  async checkForSuspiciousActivity(): Promise<SecurityAlert[]> {
    const settings = await this.getSettings()
    const newAlerts: SecurityAlert[] = []

    const recentLogs = await ceoAuditService.getRecentAttempts(
      settings.thresholds.timeWindowMinutes
    )
    const failedAttempts = recentLogs.filter(log => log.action === 'login_failed')

    const ipAttempts = new Map<string, AuditLogEntry[]>()
    failedAttempts.forEach(log => {
      const attempts = ipAttempts.get(log.ipAddress) || []
      attempts.push(log)
      ipAttempts.set(log.ipAddress, attempts)
    })

    for (const [ip, attempts] of ipAttempts.entries()) {
      if (attempts.length >= settings.thresholds.failedAttempts) {
        const lastAlert = await this.getLastAlertTime(`multiple_attempts_${ip}`)
        const cooldown = settings.thresholds.alertCooldownMinutes * 60 * 1000

        if (Date.now() - lastAlert > cooldown) {
          const alert = await this.addAlert({
            severity: attempts.length >= 10 ? 'critical' : attempts.length >= 5 ? 'high' : 'medium',
            type: 'multiple_attempts',
            title: 'Multiple Failed Login Attempts Detected',
            message: `${attempts.length} failed login attempts detected from IP ${ip} in the last ${settings.thresholds.timeWindowMinutes} minutes.`,
            ipAddress: ip,
            username: attempts[0]?.username,
            userAgent: attempts[0]?.userAgent,
            actionRequired: attempts.length >= 5,
            metadata: {
              attemptCount: attempts.length,
              timeWindow: settings.thresholds.timeWindowMinutes,
            },
          })
          newAlerts.push(alert)
          await this.setLastAlertTime(`multiple_attempts_${ip}`, Date.now())
        }
      }
    }

    const blockedIPs = await ipWhitelistService.getBlockedAttempts(
      Date.now() - settings.thresholds.timeWindowMinutes * 60 * 1000
    )

    const uniqueBlockedIPs = new Set(blockedIPs.map(log => log.ip))
    for (const ip of uniqueBlockedIPs) {
      const ipLogs = blockedIPs.filter(log => log.ip === ip)
      if (ipLogs.length >= 3) {
        const lastAlert = await this.getLastAlertTime(`ip_blocked_${ip}`)
        const cooldown = settings.thresholds.alertCooldownMinutes * 60 * 1000

        if (Date.now() - lastAlert > cooldown) {
          const alert = await this.addAlert({
            severity: 'high',
            type: 'ip_blocked',
            title: 'Blocked IP Attempting Access',
            message: `IP ${ip} has been blocked ${ipLogs.length} times in the last ${settings.thresholds.timeWindowMinutes} minutes. This IP is not on the whitelist.`,
            ipAddress: ip,
            userAgent: ipLogs[0]?.userAgent,
            actionRequired: true,
            metadata: {
              blockCount: ipLogs.length,
              timeWindow: settings.thresholds.timeWindowMinutes,
            },
          })
          newAlerts.push(alert)
          await this.setLastAlertTime(`ip_blocked_${ip}`, Date.now())
        }
      }
    }

    return newAlerts
  }

  private async getLastAlertTime(key: string): Promise<number> {
    const times = await window.spark.kv.get<Record<string, number>>(
      SecurityNotificationService.LAST_ALERT_KEY
    ) || {}
    return times[key] || 0
  }

  private async setLastAlertTime(key: string, time: number): Promise<void> {
    const times = await window.spark.kv.get<Record<string, number>>(
      SecurityNotificationService.LAST_ALERT_KEY
    ) || {}
    times[key] = time
    await window.spark.kv.set(SecurityNotificationService.LAST_ALERT_KEY, times)
  }

  startMonitoring(intervalSeconds: number = 30): void {
    if (this.monitoringInterval) {
      this.stopMonitoring()
    }

    this.checkForSuspiciousActivity()

    this.monitoringInterval = window.setInterval(() => {
      this.checkForSuspiciousActivity()
    }, intervalSeconds * 1000)
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      window.clearInterval(this.monitoringInterval)
      this.monitoringInterval = undefined
    }
  }

  onAlert(callback: (alert: SecurityAlert) => void): () => void {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback)
    }
  }

  private notifyListeners(alert: SecurityAlert): void {
    this.listeners.forEach(callback => {
      try {
        callback(alert)
      } catch (error) {
        console.error('Error in alert listener:', error)
      }
    })
  }

  async getAlertStats(): Promise<{
    total: number
    critical: number
    high: number
    medium: number
    low: number
    unread: number
    last24h: number
    byType: Record<string, number>
  }> {
    const alerts = await this.getAlerts()
    const last24h = Date.now() - 24 * 60 * 60 * 1000
    
    const stats = {
      total: alerts.length,
      critical: alerts.filter(a => a.severity === 'critical').length,
      high: alerts.filter(a => a.severity === 'high').length,
      medium: alerts.filter(a => a.severity === 'medium').length,
      low: alerts.filter(a => a.severity === 'low').length,
      unread: alerts.filter(a => !a.metadata?.read).length,
      last24h: alerts.filter(a => a.timestamp >= last24h).length,
      byType: {} as Record<string, number>,
    }

    alerts.forEach(alert => {
      stats.byType[alert.type] = (stats.byType[alert.type] || 0) + 1
    })

    return stats
  }
}

export const securityNotificationService = new SecurityNotificationService()
