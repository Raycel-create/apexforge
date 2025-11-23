import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ModelHealthStatus } from '@/components/ModelHealthStatus'
import { FallbackHistory } from '@/components/FallbackHistory'
import { useAIFallback } from '@/hooks/use-ai-fallback'
import { Sparkle, Lightning, TestTube, Info } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface FallbackDemoProps {
  onNavigate: (page: string) => void
}

export function FallbackDemo({ onNavigate }: FallbackDemoProps) {
  const [prompt, setPrompt] = useState('Write a brief welcome message for a new user.')
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o')
  
  const {
    isLoading,
    result,
    providerHealth,
    generate,
    resetProvider,
    resetAll,
    isReady
  } = useAIFallback()

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    toast.loading('Generating with fallback protection...', { id: 'generate' })
    
    const response = await generate(prompt, selectedModel, {
      temperature: 0.7,
      maxTokens: 500
    })

    toast.dismiss('generate')

    if (response?.success) {
      const hadFallback = response.fallbackHistory.length > 1
      if (hadFallback) {
        toast.success(`Generated after ${response.totalAttempts} attempts using ${response.finalModel}`)
      } else {
        toast.success(`Generated successfully with ${response.finalModel}`)
      }
    } else {
      toast.error(response?.error || 'Generation failed')
    }
  }

  const handleSimulateFailure = async () => {
    toast.info('Simulating API failure scenario...')
    await generate('Test prompt that should trigger fallback', 'invalid-model-id', {
      maxAttempts: 3
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Lightning className="w-4 h-4 text-primary" weight="fill" />
            <span className="text-sm font-medium text-primary">Intelligent Fallback System</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            AI Model Fallback Demo
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Test the automatic failover system that ensures 99.9% uptime by intelligently 
            switching between AI models when failures or rate limits occur.
          </p>
        </motion.div>

        <Alert className="mb-8 border-accent/50 bg-accent/5">
          <Info className="w-4 h-4 text-accent" />
          <AlertTitle className="text-accent">How It Works</AlertTitle>
          <AlertDescription>
            When a model fails or hits rate limits, the system automatically tries alternative models 
            with exponential backoff. Providers are tracked for health and rate limits, ensuring 
            requests are routed to the most reliable available model.
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkle className="w-5 h-5 text-primary" weight="fill" />
                  Test Generation
                </CardTitle>
                <CardDescription>
                  Try generating content to see the fallback system in action
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prompt</label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your prompt..."
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Preferred Model</label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                      <SelectItem value="claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
                      <SelectItem value="grok-2">Grok-2</SelectItem>
                      <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                      <SelectItem value="llama-3.1">Llama 3.1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleGenerate}
                    disabled={isLoading || !isReady}
                    className="flex-1 gap-2"
                  >
                    <Lightning className="w-4 h-4" weight="fill" />
                    {isLoading ? 'Generating...' : 'Generate'}
                  </Button>
                  <Button
                    onClick={handleSimulateFailure}
                    variant="outline"
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <TestTube className="w-4 h-4" />
                    Test Fallback
                  </Button>
                </div>

                {result?.content && (
                  <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">Response</Badge>
                      {result.tokensUsed && (
                        <Badge variant="outline" className="text-xs">
                          {result.tokensUsed} tokens
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {result.content}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ModelHealthStatus
              providerHealth={providerHealth}
              onResetProvider={resetProvider}
              onResetAll={resetAll}
            />
          </motion.div>
        </div>

        {result && result.fallbackHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FallbackHistory
              attempts={result.fallbackHistory}
              finalModel={result.finalModel}
              totalAttempts={result.totalAttempts}
            />
          </motion.div>
        )}

        <Card className="mt-6 border-border/50">
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">🎯 Automatic Detection</h4>
                <p className="text-sm text-muted-foreground">
                  Instantly recognizes rate limits (429 errors, quota exceeded) and API failures
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">🔄 Smart Routing</h4>
                <p className="text-sm text-muted-foreground">
                  Prioritizes healthy providers with fewest failures for optimal reliability
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">⏱️ Rate Limit Tracking</h4>
                <p className="text-sm text-muted-foreground">
                  Tracks cooldown periods and automatically retries when providers recover
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">📊 Health Monitoring</h4>
                <p className="text-sm text-muted-foreground">
                  Real-time dashboard showing provider status, failures, and recovery timers
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">📈 Exponential Backoff</h4>
                <p className="text-sm text-muted-foreground">
                  Retry delays increase (500ms, 1s, 1.5s) to prevent cascading failures
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">🔍 Detailed Logging</h4>
                <p className="text-sm text-muted-foreground">
                  Complete attempt history with timestamps, models used, and error details
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={() => onNavigate('dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
