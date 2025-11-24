import { useState, useEffect, useCallback } from 'react'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  XCircle, 
  Warning,
  Clock,
  Pulse
} from '@phosphor-icons/react'
import { figmaSyncService } from '@/lib/figmaSyncService'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface CompactStatus {
  status: 'operational' | 'degraded' | 'offline' | 'checking'
  details: {
    api: string
    credentials: string
    ip: string
  }
  lastCheck: number
}

export function FigmaAvailabilityIndicator() {
  const [status, setStatus] = useState<CompactStatus>({
    status: 'checking',
    details: {
      api: 'checking',
      credentials: 'checking',
      ip: 'checking'
    },
    lastCheck: Date.now(),
  })

  const checkStatus = useCallback(async () => {
    let apiStatus = 'offline'
    let credStatus = 'missing'
    let ipStatus = 'blocked'

    try {
      const response = await fetch('https://api.figma.com/v1/me', {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000),
      })
      
      if (response.status === 401 || response.status === 403 || response.ok) {
        apiStatus = 'online'
      } else if (response.status >= 500) {
        apiStatus = 'degraded'
      }
    } catch {
      apiStatus = 'offline'
    }

    try {
      const credentials = await figmaSyncService.getCredentials()
      
      if (credentials && credentials.accessToken) {
        credStatus = credentials.isValid ? 'valid' : 'invalid'
        ipStatus = 'allowed'
      } else {
        credStatus = 'missing'
        ipStatus = 'allowed'
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('Access denied')) {
        ipStatus = 'blocked'
      }
    }

    let overallStatus: 'operational' | 'degraded' | 'offline' | 'checking' = 'operational'
    
    if (ipStatus === 'blocked' || apiStatus === 'offline') {
      overallStatus = 'offline'
    } else if (credStatus === 'missing' || credStatus === 'invalid' || apiStatus === 'degraded') {
      overallStatus = 'degraded'
    }

    setStatus({
      status: overallStatus,
      details: {
        api: apiStatus,
        credentials: credStatus,
        ip: ipStatus
      },
      lastCheck: Date.now(),
    })
  }, [])

  useEffect(() => {
    checkStatus()
    
    const interval = setInterval(() => {
      checkStatus()
    }, 30000)

    return () => clearInterval(interval)
  }, [checkStatus])

  const getStatusIcon = () => {
    switch (status.status) {
      case 'operational':
        return <CheckCircle size={14} weight="fill" />
      case 'degraded':
        return <Warning size={14} weight="fill" />
      case 'offline':
        return <XCircle size={14} weight="fill" />
      case 'checking':
        return <Clock size={14} className="animate-spin" />
    }
  }

  const getStatusText = () => {
    switch (status.status) {
      case 'operational':
        return 'Operational'
      case 'degraded':
        return 'Degraded'
      case 'offline':
        return 'Offline'
      case 'checking':
        return 'Checking...'
    }
  }

  const getStatusColor = () => {
    switch (status.status) {
      case 'operational':
        return 'bg-green-500 hover:bg-green-600 text-white border-green-600'
      case 'degraded':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-600'
      case 'offline':
        return 'bg-red-500 hover:bg-red-600 text-white border-red-600'
      case 'checking':
        return 'bg-muted hover:bg-muted text-muted-foreground border-border'
    }
  }

  const getPulseColor = () => {
    switch (status.status) {
      case 'operational':
        return 'text-green-500'
      case 'degraded':
        return 'text-yellow-500'
      case 'offline':
        return 'text-red-500'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            className={cn(
              'flex items-center gap-1.5 cursor-pointer transition-all',
              getStatusColor()
            )}
          >
            <div className="relative flex items-center justify-center">
              {status.status === 'operational' ? (
                <>
                  <Pulse size={14} weight="fill" className={cn(getPulseColor(), 'animate-pulse')} />
                  <div className="absolute inset-0 animate-ping opacity-75">
                    <Pulse size={14} weight="fill" className={getPulseColor()} />
                  </div>
                </>
              ) : (
                getStatusIcon()
              )}
            </div>
            <span className="text-xs font-medium">Figma: {getStatusText()}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold text-sm">Figma Service Status</p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">API:</span>
                <span className={cn(
                  'font-medium',
                  status.details.api === 'online' && 'text-green-500',
                  status.details.api === 'degraded' && 'text-yellow-500',
                  status.details.api === 'offline' && 'text-red-500'
                )}>
                  {status.details.api}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Credentials:</span>
                <span className={cn(
                  'font-medium',
                  status.details.credentials === 'valid' && 'text-green-500',
                  status.details.credentials === 'invalid' && 'text-yellow-500',
                  status.details.credentials === 'missing' && 'text-red-500'
                )}>
                  {status.details.credentials}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">IP Access:</span>
                <span className={cn(
                  'font-medium',
                  status.details.ip === 'allowed' && 'text-green-500',
                  status.details.ip === 'blocked' && 'text-red-500'
                )}>
                  {status.details.ip}
                </span>
              </div>
            </div>
            <div className="pt-2 border-t border-border text-xs text-muted-foreground">
              Last check: {new Date(status.lastCheck).toLocaleTimeString()}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
