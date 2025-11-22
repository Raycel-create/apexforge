import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Clock, Warning, ArrowsClockwise } from '@phosphor-icons/react'
import { RateLimitInfo } from '@/lib/aiFallbackService'

interface ModelHealthStatusProps {
  providerHealth: Map<string, { 
    failures: number
    healthy: boolean
    rateLimit?: RateLimitInfo 
  }>
  onResetProvider?: (provider: string) => void
  onResetAll?: () => void
}

const PROVIDER_NAMES: Record<string, string> = {
  'openai': 'OpenAI',
  'anthropic': 'Anthropic',
  'xai': 'xAI',
  'google': 'Google',
  'meta': 'Meta',
  'mistral': 'Mistral',
  'cohere': 'Cohere'
}

export function ModelHealthStatus({ providerHealth, onResetProvider, onResetAll }: ModelHealthStatusProps) {
  const providers = Array.from(providerHealth.entries())

  const healthyCount = providers.filter(([_, health]) => health.healthy).length
  const totalCount = providers.length
  const healthPercentage = totalCount > 0 ? (healthyCount / totalCount) * 100 : 0

  const hasRateLimits = providers.some(([_, health]) => health.rateLimit?.limitReached)
  const hasFailures = providers.some(([_, health]) => health.failures > 0)

  const formatTimeRemaining = (resetTime?: Date): string => {
    if (!resetTime) return 'Unknown'
    const now = new Date()
    const diff = resetTime.getTime() - now.getTime()
    
    if (diff <= 0) return 'Ready'
    
    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`
    }
    return `${seconds}s`
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">AI Model Health</CardTitle>
            <CardDescription className="mt-1">
              Real-time status of AI providers with automatic fallback
            </CardDescription>
          </div>
          {(hasRateLimits || hasFailures) && onResetAll && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onResetAll}
              className="gap-2"
            >
              <ArrowsClockwise className="w-4 h-4" />
              Reset All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Health</span>
            <span className="font-medium">
              {healthyCount} / {totalCount} Healthy
            </span>
          </div>
          <Progress value={healthPercentage} className="h-2" />
        </div>

        {hasRateLimits && (
          <Alert variant="destructive">
            <Warning className="w-4 h-4" />
            <AlertDescription>
              Some providers are rate limited. Requests will automatically fallback to other models.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {providers.map(([provider, health]) => {
            const isRateLimited = health.rateLimit?.limitReached
            const hasError = health.failures > 0

            return (
              <div 
                key={provider}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div>
                    {health.healthy && !isRateLimited ? (
                      <CheckCircle className="w-5 h-5 text-accent" weight="fill" />
                    ) : isRateLimited ? (
                      <Clock className="w-5 h-5 text-destructive" weight="fill" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive" weight="fill" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {PROVIDER_NAMES[provider] || provider}
                      </span>
                      {health.healthy && !isRateLimited && (
                        <Badge variant="secondary" className="bg-accent/20 text-accent">
                          Healthy
                        </Badge>
                      )}
                      {isRateLimited && (
                        <Badge variant="destructive">
                          Rate Limited
                        </Badge>
                      )}
                      {!health.healthy && !isRateLimited && (
                        <Badge variant="destructive">
                          Unhealthy
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      {health.failures > 0 && (
                        <span>Failures: {health.failures}</span>
                      )}
                      {isRateLimited && health.rateLimit?.resetTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Reset in {formatTimeRemaining(health.rateLimit.resetTime)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {hasError && onResetProvider && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onResetProvider(provider)}
                    className="ml-2"
                  >
                    <ArrowsClockwise className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )
          })}
        </div>

        {totalCount === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No AI providers configured yet.</p>
            <p className="text-sm mt-1">Add API keys to enable AI generation.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
