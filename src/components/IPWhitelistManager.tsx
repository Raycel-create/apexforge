import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Trash, Eye, EyeSlash, Shield, Warning, Clock, CheckCircle, XCircle, MapPin } from '@phosphor-icons/react'
import { ipWhitelistService, IPWhitelistEntry, IPAccessLog } from '@/lib/ipWhitelistService'
import { toast } from 'sonner'

export function IPWhitelistManager() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [whitelist, setWhitelist] = useState<IPWhitelistEntry[]>([])
  const [accessLogs, setAccessLogs] = useState<IPAccessLog[]>([])
  const [currentIP, setCurrentIP] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [newIP, setNewIP] = useState('')
  const [newLabel, setNewLabel] = useState('')
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [stats, setStats] = useState({
    totalAttempts: 0,
    allowed: 0,
    blocked: 0,
    uniqueIPs: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [enabled, wl, logs, ip, statsData] = await Promise.all([
        ipWhitelistService.isWhitelistEnabled(),
        ipWhitelistService.getWhitelist(),
        ipWhitelistService.getAccessLogs(50),
        ipWhitelistService.getCurrentIP(),
        ipWhitelistService.getAccessStats(),
      ])

      setIsEnabled(enabled)
      setWhitelist(wl)
      setAccessLogs(logs)
      setCurrentIP(ip)
      setStats({
        totalAttempts: statsData.totalAttempts,
        allowed: statsData.allowed,
        blocked: statsData.blocked,
        uniqueIPs: statsData.uniqueIPs.size,
      })
    } catch (error) {
      toast.error('Failed to load IP whitelist data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleEnabled = async (enabled: boolean) => {
    try {
      await ipWhitelistService.setWhitelistEnabled(enabled)
      setIsEnabled(enabled)
      toast.success(enabled ? 'IP Whitelist enabled' : 'IP Whitelist disabled')
    } catch (error) {
      toast.error('Failed to update whitelist status')
      console.error(error)
    }
  }

  const handleAddIP = async () => {
    if (!newIP.trim() || !newLabel.trim()) {
      toast.error('Please provide both IP address and label')
      return
    }

    if (!ipWhitelistService.isValidIP(newIP.trim())) {
      toast.error('Invalid IP address format')
      return
    }

    try {
      await ipWhitelistService.addIP(newIP.trim(), newLabel.trim())
      toast.success('IP address added to whitelist')
      setNewIP('')
      setNewLabel('')
      setAddDialogOpen(false)
      loadData()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add IP')
      console.error(error)
    }
  }

  const handleAddCurrentIP = async () => {
    if (!currentIP || currentIP === 'unknown') {
      toast.error('Unable to detect current IP')
      return
    }

    setNewIP(currentIP)
    setNewLabel('Current Device')
    setAddDialogOpen(true)
  }

  const handleRemoveIP = async (id: string) => {
    try {
      await ipWhitelistService.removeIP(id)
      toast.success('IP address removed')
      loadData()
    } catch (error) {
      toast.error('Failed to remove IP')
      console.error(error)
    }
  }

  const handleToggleIP = async (id: string) => {
    try {
      await ipWhitelistService.toggleIP(id)
      toast.success('IP status updated')
      loadData()
    } catch (error) {
      toast.error('Failed to update IP status')
      console.error(error)
    }
  }

  const handleClearLogs = async () => {
    try {
      await ipWhitelistService.clearAccessLogs()
      toast.success('Access logs cleared')
      loadData()
    } catch (error) {
      toast.error('Failed to clear logs')
      console.error(error)
    }
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="text-primary" size={24} />
            IP Whitelist Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="text-primary" size={24} />
                IP Whitelist Security
              </CardTitle>
              <CardDescription className="mt-2">
                Control which IP addresses can access the CEO dashboard
              </CardDescription>
            </div>
            <Switch
              checked={isEnabled}
              onCheckedChange={handleToggleEnabled}
              className="ml-auto"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isEnabled && whitelist.length === 0 && (
            <Alert className="mb-4 border-destructive/50 bg-destructive/10">
              <Warning className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive">
                Warning: IP Whitelist is enabled but no IPs are whitelisted. You may lose access!
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border">
              <MapPin className="text-primary" size={20} />
              <div className="flex-1">
                <p className="text-sm font-medium">Your Current IP</p>
                <p className="text-xs text-muted-foreground">{currentIP}</p>
              </div>
              <Button size="sm" onClick={handleAddCurrentIP} variant="outline">
                <Plus size={16} className="mr-1" />
                Add Current
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-card/50">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{stats.totalAttempts}</div>
                  <div className="text-xs text-muted-foreground">Total Attempts (24h)</div>
                </CardContent>
              </Card>
              <Card className="bg-card/50">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-500">{stats.allowed}</div>
                  <div className="text-xs text-muted-foreground">Allowed</div>
                </CardContent>
              </Card>
              <Card className="bg-card/50">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-red-500">{stats.blocked}</div>
                  <div className="text-xs text-muted-foreground">Blocked</div>
                </CardContent>
              </Card>
              <Card className="bg-card/50">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{stats.uniqueIPs}</div>
                  <div className="text-xs text-muted-foreground">Unique IPs</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Whitelisted IPs</CardTitle>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus size={16} className="mr-1" />
                  Add IP
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add IP to Whitelist</DialogTitle>
                  <DialogDescription>
                    Add an IP address that will be allowed to access the CEO dashboard
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="ip">IP Address</Label>
                    <Input
                      id="ip"
                      placeholder="192.168.1.1"
                      value={newIP}
                      onChange={(e) => setNewIP(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="label">Label</Label>
                    <Input
                      id="label"
                      placeholder="Home Office"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddIP}>Add IP</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {whitelist.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No whitelisted IPs yet. Add your first IP to get started.
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {whitelist.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium font-mono text-sm">{entry.ip}</p>
                        <Badge variant={entry.isActive ? 'default' : 'secondary'}>
                          {entry.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{entry.label}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Added {formatRelativeTime(entry.addedAt)}</span>
                        {entry.lastUsed && (
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            Last used {formatRelativeTime(entry.lastUsed)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggleIP(entry.id)}
                      >
                        {entry.isActive ? (
                          <Eye size={16} />
                        ) : (
                          <EyeSlash size={16} />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveIP(entry.id)}
                      >
                        <Trash size={16} className="text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Access Logs</CardTitle>
            <Button size="sm" variant="outline" onClick={handleClearLogs}>
              Clear Logs
            </Button>
          </div>
          <CardDescription>Recent access attempts to the CEO dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          {accessLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No access logs recorded yet
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {accessLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      log.action === 'allowed'
                        ? 'bg-green-500/5 border-green-500/20'
                        : 'bg-red-500/5 border-red-500/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {log.action === 'allowed' ? (
                        <CheckCircle size={20} className="text-green-500" />
                      ) : (
                        <XCircle size={20} className="text-red-500" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-mono text-sm font-medium">{log.ip}</p>
                          <Badge
                            variant={log.action === 'allowed' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {log.action}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{log.endpoint}</p>
                        {log.userAgent && (
                          <p className="text-xs text-muted-foreground truncate max-w-md">
                            {log.userAgent}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatTimestamp(log.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
