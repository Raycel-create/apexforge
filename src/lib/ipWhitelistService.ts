export interface IPWhitelistEntry {
  id: string
  ip: string
  label: string
  addedAt: number
  lastUsed?: number
  isActive: boolean
}

export interface IPAccessLog {
  id: string
  ip: string
  timestamp: number
  action: 'allowed' | 'blocked'
  endpoint: string
  userAgent?: string
}

class IPWhitelistService {
  private static readonly WHITELIST_KEY = 'ceo-ip-whitelist'
  private static readonly ACCESS_LOG_KEY = 'ceo-ip-access-log'
  private static readonly WHITELIST_ENABLED_KEY = 'ceo-ip-whitelist-enabled'
  private static readonly MAX_LOG_ENTRIES = 500

  async getCurrentIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch (error) {
      console.error('Failed to fetch current IP:', error)
      return 'unknown'
    }
  }

  async getWhitelist(): Promise<IPWhitelistEntry[]> {
    const whitelist = await window.spark.kv.get<IPWhitelistEntry[]>(IPWhitelistService.WHITELIST_KEY)
    return whitelist || []
  }

  async addIP(ip: string, label: string): Promise<void> {
    const whitelist = await this.getWhitelist()
    
    const exists = whitelist.find(entry => entry.ip === ip)
    if (exists) {
      throw new Error('IP address already whitelisted')
    }

    const newEntry: IPWhitelistEntry = {
      id: `ip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ip,
      label,
      addedAt: Date.now(),
      isActive: true,
    }

    whitelist.push(newEntry)
    await window.spark.kv.set(IPWhitelistService.WHITELIST_KEY, whitelist)
  }

  async removeIP(id: string): Promise<void> {
    const whitelist = await this.getWhitelist()
    const filtered = whitelist.filter(entry => entry.id !== id)
    await window.spark.kv.set(IPWhitelistService.WHITELIST_KEY, filtered)
  }

  async toggleIP(id: string): Promise<void> {
    const whitelist = await this.getWhitelist()
    const entry = whitelist.find(e => e.id === id)
    
    if (entry) {
      entry.isActive = !entry.isActive
      await window.spark.kv.set(IPWhitelistService.WHITELIST_KEY, whitelist)
    }
  }

  async updateLastUsed(ip: string): Promise<void> {
    const whitelist = await this.getWhitelist()
    const entry = whitelist.find(e => e.ip === ip)
    
    if (entry) {
      entry.lastUsed = Date.now()
      await window.spark.kv.set(IPWhitelistService.WHITELIST_KEY, whitelist)
    }
  }

  async isIPWhitelisted(ip: string): Promise<boolean> {
    const enabled = await this.isWhitelistEnabled()
    if (!enabled) return true

    const whitelist = await this.getWhitelist()
    const entry = whitelist.find(e => e.ip === ip && e.isActive)
    
    if (entry) {
      await this.updateLastUsed(ip)
      return true
    }
    
    return false
  }

  async logAccess(ip: string, action: 'allowed' | 'blocked', endpoint: string, userAgent?: string): Promise<void> {
    const logs = await this.getAccessLogs()
    
    const newLog: IPAccessLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ip,
      timestamp: Date.now(),
      action,
      endpoint,
      userAgent,
    }

    logs.unshift(newLog)

    if (logs.length > IPWhitelistService.MAX_LOG_ENTRIES) {
      logs.splice(IPWhitelistService.MAX_LOG_ENTRIES)
    }

    await window.spark.kv.set(IPWhitelistService.ACCESS_LOG_KEY, logs)
  }

  async getAccessLogs(limit?: number): Promise<IPAccessLog[]> {
    const logs = await window.spark.kv.get<IPAccessLog[]>(IPWhitelistService.ACCESS_LOG_KEY)
    const allLogs = logs || []
    return limit ? allLogs.slice(0, limit) : allLogs
  }

  async clearAccessLogs(): Promise<void> {
    await window.spark.kv.set(IPWhitelistService.ACCESS_LOG_KEY, [])
  }

  async isWhitelistEnabled(): Promise<boolean> {
    const enabled = await window.spark.kv.get<boolean>(IPWhitelistService.WHITELIST_ENABLED_KEY)
    return enabled ?? false
  }

  async setWhitelistEnabled(enabled: boolean): Promise<void> {
    await window.spark.kv.set(IPWhitelistService.WHITELIST_ENABLED_KEY, enabled)
  }

  isValidIP(ip: string): boolean {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
    const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/
    
    if (ipv4Regex.test(ip)) {
      const parts = ip.split('.')
      return parts.every(part => {
        const num = parseInt(part, 10)
        return num >= 0 && num <= 255
      })
    }
    
    return ipv6Regex.test(ip)
  }

  async getBlockedAttempts(since?: number): Promise<IPAccessLog[]> {
    const logs = await this.getAccessLogs()
    const cutoff = since || Date.now() - 24 * 60 * 60 * 1000
    
    return logs.filter(log => 
      log.action === 'blocked' && 
      log.timestamp >= cutoff
    )
  }

  async getAccessStats(): Promise<{
    totalAttempts: number
    allowed: number
    blocked: number
    uniqueIPs: Set<string>
    topBlockedIPs: Array<{ ip: string; count: number }>
  }> {
    const logs = await this.getAccessLogs()
    const last24h = Date.now() - 24 * 60 * 60 * 1000
    const recentLogs = logs.filter(log => log.timestamp >= last24h)

    const uniqueIPs = new Set(recentLogs.map(log => log.ip))
    const allowed = recentLogs.filter(log => log.action === 'allowed').length
    const blocked = recentLogs.filter(log => log.action === 'blocked').length

    const ipCounts = new Map<string, number>()
    recentLogs
      .filter(log => log.action === 'blocked')
      .forEach(log => {
        ipCounts.set(log.ip, (ipCounts.get(log.ip) || 0) + 1)
      })

    const topBlockedIPs = Array.from(ipCounts.entries())
      .map(([ip, count]) => ({ ip, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      totalAttempts: recentLogs.length,
      allowed,
      blocked,
      uniqueIPs,
      topBlockedIPs,
    }
  }
}

export const ipWhitelistService = new IPWhitelistService()
