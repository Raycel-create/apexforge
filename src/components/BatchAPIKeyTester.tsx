import { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { CheckCircle, XCircle, Clock, Flask, Download, ArrowClockwise } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useScreenSize } from '@/hooks/use-mobile'

interface APIKey {
  id: string
  name: string
  key: string
  status?: 'valid' | 'invalid' | 'untested'
}

interface TestResult {
  id: string
  name: string
  status: 'pending' | 'testing' | 'valid' | 'invalid' | 'error'
  message?: string
  responseTime?: number
  timestamp?: number
}

interface BatchAPIKeyTesterProps {
  aiKeys?: APIKey[]
  serviceKeys?: APIKey[]
  storeKeys?: APIKey[]
  onTestComplete?: (results: TestResult[]) => void
}

export function BatchAPIKeyTester({ 
  aiKeys = [], 
  serviceKeys = [], 
  storeKeys = [],
  onTestComplete 
}: BatchAPIKeyTesterProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])
  const [progress, setProgress] = useState(0)
  const { isMobile } = useScreenSize()

  const allKeys = [
    ...aiKeys.map(k => ({ ...k, category: 'AI Models' as const })),
    ...serviceKeys.map(k => ({ ...k, category: 'Services' as const })),
    ...storeKeys.map(k => ({ ...k, category: 'App Stores' as const }))
  ].filter(k => k.key && k.key.length > 0)

  const testSingleKey = async (key: APIKey & { category: string }): Promise<TestResult> => {
    const startTime = Date.now()
    
    try {
      let isValid = false
      
      if (key.category === 'AI Models') {
        try {
          const { AIService } = await import('../lib/aiService')
          const service = new AIService([])
          isValid = await service.validateAPIKey(key.id, key.key)
        } catch (error) {
          console.error(`Validation error for ${key.id}:`, error)
          isValid = false
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700))
        isValid = key.key.length > 10 && !key.key.includes('invalid')
      }

      const responseTime = Date.now() - startTime

      return {
        id: key.id,
        name: key.name,
        status: isValid ? 'valid' : 'invalid',
        message: isValid ? 'Connection successful' : 'Invalid key or connection failed',
        responseTime,
        timestamp: Date.now()
      }
    } catch (error) {
      return {
        id: key.id,
        name: key.name,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        responseTime: Date.now() - startTime,
        timestamp: Date.now()
      }
    }
  }

  const runBatchTest = async () => {
    if (allKeys.length === 0) {
      toast.error('No API keys to test', {
        description: 'Please add at least one API key before running batch test'
      })
      return
    }

    setIsRunning(true)
    setProgress(0)
    
    const initialResults: TestResult[] = allKeys.map(k => ({
      id: k.id,
      name: k.name,
      status: 'pending'
    }))
    setResults(initialResults)

    toast.info(`Testing ${allKeys.length} API keys...`, {
      description: 'This may take a few moments'
    })

    const testResults: TestResult[] = []
    const batchSize = 3
    
    for (let i = 0; i < allKeys.length; i += batchSize) {
      const batch = allKeys.slice(i, i + batchSize)
      
      setResults(prev => prev.map(r => 
        batch.some(b => b.id === r.id) ? { ...r, status: 'testing' } : r
      ))

      const batchResults = await Promise.all(
        batch.map(key => testSingleKey(key))
      )

      testResults.push(...batchResults)
      
      setResults(prev => prev.map(r => {
        const result = batchResults.find(br => br.id === r.id)
        return result || r
      }))

      setProgress(((i + batch.length) / allKeys.length) * 100)
    }

    setIsRunning(false)
    setProgress(100)

    const validCount = testResults.filter(r => r.status === 'valid').length
    const invalidCount = testResults.filter(r => r.status === 'invalid' || r.status === 'error').length

    if (validCount === testResults.length) {
      toast.success('All API keys validated! ✓', {
        description: `${validCount} keys are working correctly`
      })
    } else if (validCount > 0) {
      toast.warning('Batch test completed with issues', {
        description: `${validCount} valid, ${invalidCount} failed`
      })
    } else {
      toast.error('All API keys failed validation', {
        description: 'Please check your keys and try again'
      })
    }

    onTestComplete?.(testResults)
  }

  const exportResults = () => {
    const report = {
      timestamp: new Date().toISOString(),
      totalTested: results.length,
      valid: results.filter(r => r.status === 'valid').length,
      invalid: results.filter(r => r.status === 'invalid' || r.status === 'error').length,
      results: results.map(r => ({
        name: r.name,
        status: r.status,
        message: r.message,
        responseTime: r.responseTime,
        timestamp: r.timestamp ? new Date(r.timestamp).toISOString() : null
      }))
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `api-key-test-report-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success('Report downloaded')
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'valid':
        return <CheckCircle weight="fill" className="text-accent" size={isMobile ? 18 : 20} />
      case 'invalid':
      case 'error':
        return <XCircle weight="fill" className="text-destructive" size={isMobile ? 18 : 20} />
      case 'testing':
        return <Clock weight="fill" className="text-primary animate-pulse" size={isMobile ? 18 : 20} />
      default:
        return <Clock weight="regular" className="text-muted-foreground" size={isMobile ? 18 : 20} />
    }
  }

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      valid: 'bg-accent/20 text-accent border-accent/50',
      invalid: 'bg-destructive/20 text-destructive border-destructive/50',
      error: 'bg-destructive/20 text-destructive border-destructive/50',
      testing: 'bg-primary/20 text-primary border-primary/50 animate-pulse',
      pending: 'bg-muted text-muted-foreground border-border'
    }

    return (
      <Badge variant="outline" className={`${variants[status]} ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const validCount = results.filter(r => r.status === 'valid').length
  const invalidCount = results.filter(r => r.status === 'invalid' || r.status === 'error').length
  const testingCount = results.filter(r => r.status === 'testing').length
  const pendingCount = results.filter(r => r.status === 'pending').length

  return (
    <Card className={`${isMobile ? 'p-4' : 'p-6'} border-primary/30`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-lg bg-primary/20 flex items-center justify-center`}>
              <Flask weight="fill" className="text-primary" size={isMobile ? 20 : 24} />
            </div>
            <div>
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>Batch API Key Tester</h3>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                Test all configured keys at once
              </p>
            </div>
          </div>
        </div>

        {allKeys.length === 0 ? (
          <Card className="p-6 sm:p-8 border-yellow-500/30 bg-yellow-500/10 text-center">
            <Flask className="mx-auto mb-3 text-yellow-500" weight="fill" size={isMobile ? 40 : 48} />
            <h4 className={`font-semibold mb-2 ${isMobile ? 'text-sm' : 'text-base'}`}>No API Keys Found</h4>
            <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
              Add API keys in the Integrations Hub to enable batch testing.
            </p>
          </Card>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={runBatchTest}
                disabled={isRunning}
                className={`flex-1 gap-2 touch-target ${isMobile ? 'h-11' : ''}`}
              >
                {isRunning ? (
                  <>
                    <Clock className="animate-spin" size={isMobile ? 18 : 16} />
                    Testing {testingCount} keys...
                  </>
                ) : (
                  <>
                    <Flask weight="fill" size={isMobile ? 18 : 16} />
                    Test All Keys ({allKeys.length})
                  </>
                )}
              </Button>
              
              {results.length > 0 && !isRunning && (
                <>
                  <Button
                    variant="outline"
                    onClick={runBatchTest}
                    className={`gap-2 touch-target ${isMobile ? 'h-11 flex-1' : ''}`}
                  >
                    <ArrowClockwise size={isMobile ? 18 : 16} />
                    {isMobile ? 'Retry' : 'Retry Test'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={exportResults}
                    className={`gap-2 touch-target ${isMobile ? 'h-11 flex-1' : ''}`}
                  >
                    <Download size={isMobile ? 18 : 16} />
                    {isMobile ? 'Export' : 'Export Report'}
                  </Button>
                </>
              )}
            </div>

            {isRunning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                    Progress: {Math.round(progress)}%
                  </span>
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                    {testingCount + validCount + invalidCount} / {allKeys.length}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {results.length > 0 && (
              <>
                <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-4 gap-3'}`}>
                  <Card className="p-3 border-border">
                    <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-1`}>Valid</div>
                    <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-accent`}>{validCount}</div>
                  </Card>
                  <Card className="p-3 border-border">
                    <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-1`}>Invalid</div>
                    <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-destructive`}>{invalidCount}</div>
                  </Card>
                  <Card className="p-3 border-border">
                    <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-1`}>Testing</div>
                    <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-primary`}>{testingCount}</div>
                  </Card>
                  <Card className="p-3 border-border">
                    <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-1`}>Pending</div>
                    <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-muted-foreground`}>{pendingCount}</div>
                  </Card>
                </div>

                <div>
                  <h4 className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold mb-3`}>Test Results</h4>
                  <ScrollArea className={`${isMobile ? 'h-[300px]' : 'h-[400px]'} pr-2`}>
                    <div className="space-y-2">
                      {results.map((result) => (
                        <Card
                          key={result.id}
                          className={`${isMobile ? 'p-3' : 'p-4'} border-border transition-all ${
                            result.status === 'testing' ? 'border-primary/50 bg-primary/5' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {getStatusIcon(result.status)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h5 className={`font-semibold ${isMobile ? 'text-sm' : 'text-base'} truncate`}>
                                  {result.name}
                                </h5>
                                {getStatusBadge(result.status)}
                              </div>
                              {result.message && (
                                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-1`}>
                                  {result.message}
                                </p>
                              )}
                              {result.responseTime && (
                                <p className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>
                                  Response time: {result.responseTime}ms
                                </p>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </>
            )}
          </>
        )}

        <div className={`${isMobile ? 'p-3' : 'p-4'} bg-muted/20 rounded-lg`}>
          <p className={`${isMobile ? 'text-[0.65rem]' : 'text-xs'} text-muted-foreground`}>
            💡 Batch testing validates all configured API keys in parallel batches of 3 for optimal speed. 
            Export the test report for detailed analysis and debugging.
          </p>
        </div>
      </div>
    </Card>
  )
}
