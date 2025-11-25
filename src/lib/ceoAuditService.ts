import { useKV } from '@github/spark/hooks'

export interface AuditLogEntry {
  id: string
  timestamp: number
  username: string
  action: 'login_attempt' | 'login_success' | 'login_failed' | 'logout' | 'session_timeout' | 'keyboard_shortcut_attempt'
  ipAddress: string
  userAgent: string
  details?: string
}

class CEOAuditService {
  private async getCurrentIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch (error) {
      return 'unknown'
    }
  }

  async logAccess(
    username: string,
    action: AuditLogEntry['action'],
    details?: string
  ): Promise<void> {
    const ipAddress = await this.getCurrentIP()
    const userAgent = navigator.userAgent

    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      username,
      action,
      ipAddress,
      userAgent,
      details,
    }

    const existingLogs = await window.spark.kv.get<AuditLogEntry[]>('ceo-audit-logs') || []
    const updatedLogs = [entry, ...existingLogs].slice(0, 1000)
    
    await window.spark.kv.set('ceo-audit-logs', updatedLogs)
  }

  async getLogs(): Promise<AuditLogEntry[]> {
    return await window.spark.kv.get<AuditLogEntry[]>('ceo-audit-logs') || []
  }

  async clearLogs(): Promise<void> {
    await window.spark.kv.set('ceo-audit-logs', [])
  }

  async getRecentAttempts(minutesAgo: number = 60): Promise<AuditLogEntry[]> {
    const logs = await this.getLogs()
    const cutoffTime = Date.now() - (minutesAgo * 60 * 1000)
    return logs.filter(log => log.timestamp >= cutoffTime)
  }

  async getFailedAttempts(minutesAgo: number = 60): Promise<AuditLogEntry[]> {
    const recentLogs = await this.getRecentAttempts(minutesAgo)
    return recentLogs.filter(log => 
      log.action === 'login_failed' || 
      log.action === 'keyboard_shortcut_attempt'
    )
  }

  async getSuccessfulLogins(minutesAgo: number = 60): Promise<AuditLogEntry[]> {
    const recentLogs = await this.getRecentAttempts(minutesAgo)
    return recentLogs.filter(log => log.action === 'login_success')
  }
}

export const ceoAuditService = new CEOAuditService()

export function useAuditLogs() {
  const [logs, setLogs] = useKV<AuditLogEntry[]>('ceo-audit-logs', [])

  const refreshLogs = async () => {
    const latestLogs = await ceoAuditService.getLogs()
    setLogs(latestLogs)
  }

  return {
    logs,
    refreshLogs,
    clearLogs: async () => {
      await ceoAuditService.clearLogs()
      setLogs([])
    },
  }
}
