import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle, 
  XCircle, 
  Warning,
  WifiHigh,
  WifiSlash,
  Clock,
  ArrowsClockwise,
  Pulse
} from '@phosphor-icons/react'
import { figmaSyncService } from '@/lib/figmaSyncService'
import { cn } from '@/lib/utils'

interface AvailabilityStatus {
  figmaApi: 'online' | 'offline' | 'degraded' | 'checking'
  credentials: 'valid' | 'invalid' | 'missing' | 'checking'
  ipWhitelist: 'allowed' | 'blocked' | 'checking'
  lastCheck: number
  responseTime?: number
  nextCheck?: number
}

export function FigmaAvailabilityMonitor() {
  const [status, setStatus] = useState<AvailabilityStatus>({
    figmaApi: 'checking',
    credentials: 'checking',
    ipWhitelist: 'checking',
    lastCheck: Date.now(),
  })
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [countdown, setCountdown] = useState(30)

  const checkAvailability = useCallback(async () => {
    const startTime = Date.now()
    
    setStatus(prev => ({
      ...prev,
      figmaApi: 'checking',
      credentials: 'checking',
      ipWhitelist: 'checking',
    }))

    let apiStatus: 'online' | 'offline' | 'degraded' = 'offline'
    let credStatus: 'valid' | 'invalid' | 'missing' = 'missing'
    let ipStatus: 'allowed' | 'blocked' = 'blocked'
    let responseTime: number | undefined

    try {
      const response = await fetch('https://api.figma.com/v1/me', {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000),
      })
      
      responseTime = Date.now() - startTime
      
      if (response.status === 401 || response.status === 403) {
        apiStatus = 'online'
      } else if (response.ok) {
        apiStatus = 'online'
      } else if (response.status >= 500) {
        apiStatus = 'degraded'
      }
    } catch (error) {
      apiStatus = 'offline'
      responseTime = Date.now() - startTime
    }

    try {
      const credentials = await figmaSyncService.getCredentials()
      
      if (credentials && credentials.accessToken) {
        if (credentials.isValid) {
          credStatus = 'valid'
        } else {
          credStatus = 'invalid'
        }
        ipStatus = 'allowed'
      } else {
        credStatus = 'missing'
        ipStatus = 'allowed'
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('Access denied')) {
        ipStatus = 'blocked'
        credStatus = 'missing'
      }
    }

    setStatus({
      figmaApi: apiStatus,
      credentials: credStatus,
      ipWhitelist: ipStatus,
      lastCheck: Date.now(),
      responseTime,
      nextCheck: Date.now() + 30000,
    })
  }, [])

  useEffect(() => {
    checkAvailability()
  }, [checkAvailability])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      checkAvailability()
    }, 30000)

    return () => clearInterval(interval)
  }, [autoRefresh, checkAvailability])

  useEffect(() => {
    if (!autoRefresh || !status.nextCheck) return

    const countdownInterval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((status.nextCheck! - Date.now()) / 1000))
      setCountdown(remaining)
    }, 1000)

    return () => clearInterval(countdownInterval)
  }, [autoRefresh, status.nextCheck])

  const getStatusColor = (type: string, value: string) => {
    if (value === 'checking') return 'text-muted-foreground'
    
    if (type === 'api') {
      if (value === 'online') return 'text-green-500'
      if (value === 'degraded') return 'text-yellow-500'
      return 'text-red-500'
    }
    
    if (type === 'credentials') {
      if (value === 'valid') return 'text-green-500'
      if (value === 'invalid') return 'text-yellow-500'
      return 'text-red-500'
    }
    
    if (type === 'ip') {
      return value === 'allowed' ? 'text-green-500' : 'text-red-500'
    }
    
    return 'text-muted-foreground'
  }

  const getStatusIcon = (type: string, value: string) => {
    if (value === 'checking') {
      return <Clock className="animate-spin" size={20} />
    }
    
    if (type === 'api') {
      if (value === 'online') return <CheckCircle size={20} />
      if (value === 'degraded') return <Warning size={20} />
      return <XCircle size={20} />
    }
    
    if (type === 'credentials') {
      if (value === 'valid') return <CheckCircle size={20} />
      if (value === 'invalid') return <Warning size={20} />
      return <XCircle size={20} />
    }
    
    if (type === 'ip') {
      return value === 'allowed' ? <WifiHigh size={20} /> : <WifiSlash size={20} />
    }
    
    return <Clock size={20} />
  }

  const getStatusText = (type: string, value: string) => {
    if (value === 'checking') return 'Checking...'
    
    if (type === 'api') {
      if (value === 'online') return 'Online'
      if (value === 'degraded') return 'Degraded'
      return 'Offline'
    }
    
    if (type === 'credentials') {
      if (value === 'valid') return 'Valid'
      if (value === 'invalid') return 'Invalid'
      return 'Missing'
    }
    
    if (type === 'ip') {
      return value === 'allowed' ? 'Allowed' : 'Blocked'
    }
    
    return 'Unknown'
  }

  const getOverallStatus = () => {
    if (status.figmaApi === 'checking' || status.credentials === 'checking') {
      return { status: 'checking', text: 'Checking availability...', color: 'text-muted-foreground' }
    }
    
    if (status.ipWhitelist === 'blocked') {
      return { status: 'blocked', text: 'IP not whitelisted', color: 'text-red-500' }
    }
    
    if (status.figmaApi === 'offline') {
      return { status: 'offline', text: 'Figma API offline', color: 'text-red-500' }
    }
    
    if (status.credentials === 'missing') {
      return { status: 'missing', text: 'Credentials not configured', color: 'text-yellow-500' }
    }
    
    if (status.credentials === 'invalid') {
      return { status: 'invalid', text: 'Invalid credentials', color: 'text-yellow-500' }
    }
    
    if (status.figmaApi === 'degraded') {
      return { status: 'degraded', text: 'Service degraded', color: 'text-yellow-500' }
    }
    
    return { status: 'operational', text: 'All systems operational', color: 'text-green-500' }
  }

  const overallStatus = getOverallStatus()
  const isOperational = overallStatus.status === 'operational'

  return (
    <Card className={cn(
      'border-2 transition-colors',
      isOperational && 'border-green-500/20 bg-green-500/5',
      overallStatus.status === 'degraded' && 'border-yellow-500/20 bg-yellow-500/5',
      (overallStatus.status === 'offline' || overallStatus.status === 'blocked') && 'border-red-500/20 bg-red-500/5'
    )}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Pulse 
                size={32} 
                weight="fill"
                className={cn(
                  overallStatus.color,
                  'transition-colors',
                  isOperational && 'animate-pulse'
                )}
              />
              {isOperational && (
                <div className="absolute inset-0 animate-ping">
                  <Pulse size={32} weight="fill" className="text-green-500 opacity-75" />
                </div>
              )}
            </div>
            <div>
              <CardTitle className="text-lg">Figma Service Status</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <span className={overallStatus.color}>{overallStatus.text}</span>
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant={isOperational ? 'default' : 'secondary'}
              className={cn(
                'px-3 py-1',
                isOperational && 'bg-green-500 hover:bg-green-600',
                overallStatus.status === 'degraded' && 'bg-yellow-500 hover:bg-yellow-600',
                (overallStatus.status === 'offline' || overallStatus.status === 'blocked') && 'bg-red-500 hover:bg-red-600'
              )}
            >
              {status.figmaApi === 'checking' ? 'Checking' : overallStatus.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-card rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Figma API</span>
              <div className={getStatusColor('api', status.figmaApi)}>
                {getStatusIcon('api', status.figmaApi)}
              </div>
            </div>
            <div className={cn('text-lg font-semibold', getStatusColor('api', status.figmaApi))}>
              {getStatusText('api', status.figmaApi)}
            </div>
            {status.responseTime && (
              <div className="text-xs text-muted-foreground mt-1">
                Response: {status.responseTime}ms
              </div>
            )}
          </div>

          <div className="p-4 bg-card rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Credentials</span>
              <div className={getStatusColor('credentials', status.credentials)}>
                {getStatusIcon('credentials', status.credentials)}
              </div>
            </div>
            <div className={cn('text-lg font-semibold', getStatusColor('credentials', status.credentials))}>
              {getStatusText('credentials', status.credentials)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {status.credentials === 'valid' ? 'Token verified' : 'Check setup'}
            </div>
          </div>

          <div className="p-4 bg-card rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">IP Whitelist</span>
              <div className={getStatusColor('ip', status.ipWhitelist)}>
                {getStatusIcon('ip', status.ipWhitelist)}
              </div>
            </div>
            <div className={cn('text-lg font-semibold', getStatusColor('ip', status.ipWhitelist))}>
              {getStatusText('ip', status.ipWhitelist)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {status.ipWhitelist === 'allowed' ? 'Access granted' : 'Access denied'}
            </div>
          </div>
        </div>

        {status.ipWhitelist === 'blocked' && (
          <Alert className="border-red-500/20 bg-red-500/5">
            <XCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-sm">
              Your IP address is not whitelisted. Configure IP whitelist access to use Figma integration features.
            </AlertDescription>
          </Alert>
        )}

        {status.credentials === 'missing' && status.ipWhitelist === 'allowed' && (
          <Alert className="border-yellow-500/20 bg-yellow-500/5">
            <Warning className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-sm">
              Figma credentials not configured. Set up your access token to enable design sync.
            </AlertDescription>
          </Alert>
        )}

        {status.figmaApi === 'degraded' && (
          <Alert className="border-yellow-500/20 bg-yellow-500/5">
            <Warning className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-sm">
              Figma API is experiencing issues. Some features may be unavailable.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Last check: {new Date(status.lastCheck).toLocaleTimeString()}</span>
            {autoRefresh && status.nextCheck && (
              <span className="flex items-center gap-1">
                <Clock size={12} />
                Next check in {countdown}s
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={checkAvailability}
              disabled={status.figmaApi === 'checking'}
              className="text-xs text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            >
              <ArrowsClockwise size={14} className={status.figmaApi === 'checking' ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {autoRefresh && status.nextCheck && (
          <div className="space-y-1">
            <Progress value={(countdown / 30) * 100} className="h-1" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
