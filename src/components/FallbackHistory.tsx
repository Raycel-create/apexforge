import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Clock } from '@phosphor-icons/react'
import { FallbackAttempt } from '@/lib/aiFallbackService'
import { motion } from 'framer-motion'

interface FallbackHistoryProps {
  attempts: FallbackAttempt[]
  finalModel: string
  totalAttempts: number
}

export function FallbackHistory({ attempts, finalModel, totalAttempts }: FallbackHistoryProps) {
  if (attempts.length === 0) {
    return null
  }

  const successfulAttempt = attempts.find(a => a.success)
  const hadFallback = attempts.length > 1

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Generation Details</CardTitle>
            <CardDescription className="mt-1">
              {hadFallback 
                ? `Succeeded after ${totalAttempts} attempt${totalAttempts > 1 ? 's' : ''} using ${finalModel}`
                : `Generated successfully with ${finalModel}`
              }
            </CardDescription>
          </div>
          {successfulAttempt && (
            <Badge variant="secondary" className="bg-accent/20 text-accent">
              Success
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {attempts.map((attempt, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start gap-3 p-3 rounded-lg border ${
                attempt.success 
                  ? 'border-accent/30 bg-accent/5' 
                  : 'border-destructive/30 bg-destructive/5'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {attempt.success ? (
                  <CheckCircle className="w-5 h-5 text-accent" weight="fill" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive" weight="fill" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">
                    Attempt {attempt.attemptNumber}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {attempt.model}
                  </Badge>
                  {attempt.success && attempt.tokensUsed && (
                    <Badge variant="outline" className="text-xs">
                      {attempt.tokensUsed.toLocaleString()} tokens
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>
                    {new Date(attempt.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                {attempt.error && !attempt.success && (
                  <div className="mt-2 text-xs text-destructive bg-destructive/10 p-2 rounded">
                    {attempt.error}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {hadFallback && (
          <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm">
            <p className="text-muted-foreground">
              💡 <strong>Automatic Fallback:</strong> When a model fails or hits rate limits, 
              we automatically try the next available model to ensure your request succeeds.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
