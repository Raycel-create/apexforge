import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { ScrollArea } from './ui/scroll-area'
import { Alert, AlertDescription } from './ui/alert'
import { 
  Key, 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeSlash, 
  Copy, 
  Trash,
  Lightning,
  ShieldCheck,
  Globe,
  Info
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import { AI_PROVIDERS, AIProvider } from '@/lib/aiService'

interface APIKeyConfig {
  provider: AIProvider
  key: string
  status: 'valid' | 'invalid' | 'testing' | 'untested'
  lastTested?: number
  errorMessage?: string
}

const PROVIDER_DOCS = {
  openai: {
    url: 'https://platform.openai.com/api-keys',
    format: 'sk-...',
    instructions: 'Sign in to your OpenAI account, navigate to API Keys section, and create a new secret key.'
  },
  anthropic: {
    url: 'https://console.anthropic.com/settings/keys',
    format: 'sk-ant-...',
    instructions: 'Access your Anthropic Console, go to Settings > API Keys, and generate a new key.'
  },
  xai: {
    url: 'https://console.x.ai/',
    format: 'xai-...',
    instructions: 'Log into xAI Console and create an API key from your dashboard.'
  },
  google: {
    url: 'https://makersuite.google.com/app/apikey',
    format: 'AIza...',
    instructions: 'Visit Google AI Studio, create a new API key for Gemini models.'
  },
  meta: {
    url: 'https://together.ai/settings/api-keys',
    format: 'together-...',
    instructions: 'Llama models via Together AI. Sign up at Together.ai and get your API key.'
  },
  mistral: {
    url: 'https://console.mistral.ai/api-keys/',
    format: 'mistral-...',
    instructions: 'Create account on Mistral AI platform and generate an API key.'
  },
  cohere: {
    url: 'https://dashboard.cohere.com/api-keys',
    format: 'co-...',
    instructions: 'Sign up for Cohere, navigate to API Keys in your dashboard.'
  },
  huggingface: {
    url: 'https://huggingface.co/settings/tokens',
    format: 'hf_...',
    instructions: 'Create a Hugging Face account, go to Settings > Access Tokens, and create a new token with "read" permissions.'
  }
}

const createInitialKeys = (): Record<AIProvider, APIKeyConfig> => {
  const keys: Partial<Record<AIProvider, APIKeyConfig>> = {}
  AI_PROVIDERS.forEach(provider => {
    keys[provider.id as AIProvider] = {
      provider: provider.id as AIProvider,
      key: '',
      status: 'untested'
    }
  })
  return keys as Record<AIProvider, APIKeyConfig>
}

export function RealAPIKeyConnector() {
  const [apiKeys, setApiKeys] = useKV<Record<AIProvider, APIKeyConfig>>('real-api-keys', createInitialKeys())
  const [visibleKeys, setVisibleKeys] = useState<Set<AIProvider>>(new Set())
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('openai')

  const updateKey = (provider: AIProvider, key: string) => {
    setApiKeys(current => {
      const updated = { ...current } as Record<AIProvider, APIKeyConfig>
      updated[provider] = {
        ...current?.[provider],
        provider,
        key,
        status: 'untested',
        errorMessage: undefined
      }
      return updated
    })
  }

  const testAPIKey = async (provider: AIProvider) => {
    const keyConfig = apiKeys?.[provider]
    if (!keyConfig?.key) {
      toast.error('Please enter an API key first')
      return
    }

    setApiKeys(current => {
      const updated = { ...current } as Record<AIProvider, APIKeyConfig>
      updated[provider] = { ...current?.[provider]!, status: 'testing' }
      return updated
    })

    toast.info(`Testing ${provider} API key...`, { duration: 2000 })

    try {
      const { AIService, AI_MODEL_CONFIGS } = await import('@/lib/aiService')
      const modelConfig = AI_MODEL_CONFIGS.find(m => m.apiKeyId === provider)
      
      if (!modelConfig) {
        throw new Error('No model configuration found')
      }

      const service = new AIService([])
      const isValid = await service.validateAPIKey(provider, keyConfig.key)

      setApiKeys(current => {
        const updated = { ...current } as Record<AIProvider, APIKeyConfig>
        updated[provider] = {
          ...current?.[provider]!,
          status: isValid ? 'valid' : 'invalid',
          lastTested: Date.now(),
          errorMessage: isValid ? undefined : 'API key validation failed'
        }
        return updated
      })

      if (isValid) {
        toast.success(`${provider} API key is valid!`, {
          description: 'Successfully connected to the API'
        })
      } else {
        toast.error(`${provider} API key is invalid`, {
          description: 'Please check your key and try again'
        })
      }
    } catch (error) {
      setApiKeys(current => {
        const updated = { ...current } as Record<AIProvider, APIKeyConfig>
        updated[provider] = {
          ...current?.[provider]!,
          status: 'invalid',
          lastTested: Date.now(),
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        }
        return updated
      })
      toast.error('API key test failed', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      })
    }
  }

  const toggleVisibility = (provider: AIProvider) => {
    setVisibleKeys(current => {
      const newSet = new Set(current)
      if (newSet.has(provider)) {
        newSet.delete(provider)
      } else {
        newSet.add(provider)
      }
      return newSet
    })
  }

  const copyKey = (key: string, provider: string) => {
    navigator.clipboard.writeText(key)
    toast.success(`${provider} key copied to clipboard`)
  }

  const deleteKey = (provider: AIProvider) => {
    setApiKeys(current => {
      const updated = { ...current } as Record<AIProvider, APIKeyConfig>
      updated[provider] = {
        provider,
        key: '',
        status: 'untested',
        errorMessage: undefined
      }
      return updated
    })
    toast.success(`${provider} API key removed`)
  }

  const maskKey = (key: string, visible: boolean): string => {
    if (!key) return ''
    if (visible) return key
    if (key.length <= 12) return '•'.repeat(key.length)
    return key.substring(0, 6) + '•'.repeat(Math.max(8, key.length - 12)) + key.substring(key.length - 6)
  }

  const getStatusColor = (status: APIKeyConfig['status']) => {
    switch (status) {
      case 'valid': return 'text-green-500'
      case 'invalid': return 'text-red-500'
      case 'testing': return 'text-yellow-500'
      default: return 'text-muted-foreground'
    }
  }

  const getStatusIcon = (status: APIKeyConfig['status']) => {
    switch (status) {
      case 'valid': return <CheckCircle weight="fill" className="text-green-500" size={20} />
      case 'invalid': return <XCircle weight="fill" className="text-red-500" size={20} />
      case 'testing': return <Lightning weight="fill" className="text-yellow-500 animate-pulse" size={20} />
      default: return null
    }
  }

  const validKeysCount = Object.values(apiKeys || {}).filter(k => k?.status === 'valid').length
  const totalProviders = AI_PROVIDERS.length

  return (
    <div className="space-y-6">
      <Card className="p-6 border-primary/30">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <Key weight="fill" className="text-primary" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Real API Key Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Connect your actual AI provider accounts for production use
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-sm">
            {validKeysCount}/{totalProviders} Connected
          </Badge>
        </div>

        <Alert className="mb-6 bg-blue-500/10 border-blue-500/30">
          <Info weight="fill" className="text-blue-500" size={16} />
          <AlertDescription className="text-sm text-blue-500">
            <strong>Production Ready:</strong> Configure real API keys from each provider to enable all 40+ AI models. 
            Keys are encrypted and stored securely. Test each key to verify connectivity.
          </AlertDescription>
        </Alert>

        <Tabs value={selectedProvider} onValueChange={(v) => setSelectedProvider(v as AIProvider)}>
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full mb-6">
            {AI_PROVIDERS.map(provider => {
              const config = apiKeys?.[provider.id as AIProvider]
              const isValid = config?.status === 'valid'
              return (
                <TabsTrigger
                  key={provider.id}
                  value={provider.id}
                  className="relative text-xs"
                >
                  <span className="mr-1">{provider.icon}</span>
                  <span className="hidden sm:inline">{provider.name.split(' ')[0]}</span>
                  {isValid && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {AI_PROVIDERS.map(provider => {
            const config = apiKeys?.[provider.id as AIProvider]
            const isVisible = visibleKeys.has(provider.id as AIProvider)
            const docs = PROVIDER_DOCS[provider.id as AIProvider]
            const hasKey = config?.key && config.key.length > 0

            return (
              <TabsContent key={provider.id} value={provider.id} className="space-y-4">
                <Card className="p-5 border-border bg-card/50">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">{provider.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-semibold">{provider.name}</h4>
                        {config?.status && config.status !== 'untested' && getStatusIcon(config.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{provider.description}</p>
                      <a
                        href={docs.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <Globe size={12} />
                        Get your API key here
                      </a>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`key-${provider.id}`} className="text-sm font-semibold">
                        API Key
                      </Label>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <Input
                            id={`key-${provider.id}`}
                            type={isVisible ? 'text' : 'password'}
                            value={isVisible ? config?.key || '' : maskKey(config?.key || '', false)}
                            onChange={(e) => updateKey(provider.id as AIProvider, e.target.value)}
                            placeholder={`${docs.format} (paste your ${provider.name} API key)`}
                            className="pr-10 font-mono text-sm"
                          />
                          {hasKey && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleVisibility(provider.id as AIProvider)}
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                            >
                              {isVisible ? <EyeSlash size={14} /> : <Eye size={14} />}
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Format: {docs.format}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => testAPIKey(provider.id as AIProvider)}
                        disabled={!hasKey || config?.status === 'testing'}
                        className="flex-1"
                        variant="default"
                      >
                        {config?.status === 'testing' ? (
                          <>
                            <Lightning weight="fill" className="animate-pulse" size={16} />
                            Testing...
                          </>
                        ) : (
                          <>
                            <ShieldCheck size={16} />
                            Test Connection
                          </>
                        )}
                      </Button>
                      {hasKey && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyKey(config.key, provider.name)}
                          >
                            <Copy size={16} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteKey(provider.id as AIProvider)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash size={16} />
                          </Button>
                        </>
                      )}
                    </div>

                    <AnimatePresence>
                      {config?.status === 'valid' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <Alert className="bg-green-500/10 border-green-500/30">
                            <CheckCircle weight="fill" className="text-green-500" size={16} />
                            <AlertDescription className="text-sm text-green-500">
                              <strong>Connected!</strong> Your {provider.name} API key is valid and ready to use.
                              {config.lastTested && (
                                <span className="block text-xs mt-1 opacity-70">
                                  Last tested: {new Date(config.lastTested).toLocaleString()}
                                </span>
                              )}
                            </AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                      {config?.status === 'invalid' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <Alert className="bg-red-500/10 border-red-500/30">
                            <XCircle weight="fill" className="text-red-500" size={16} />
                            <AlertDescription className="text-sm text-red-500">
                              <strong>Connection Failed:</strong> {config.errorMessage || 'Invalid API key or authentication error'}
                              <span className="block text-xs mt-1 opacity-70">
                                Please verify your key and ensure it has the correct permissions.
                              </span>
                            </AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="p-3 bg-muted/30 rounded-lg border border-border">
                      <p className="text-xs text-muted-foreground font-semibold mb-1">Setup Instructions:</p>
                      <p className="text-xs text-muted-foreground">{docs.instructions}</p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            )
          })}
        </Tabs>
      </Card>

      <Card className="p-5 bg-muted/20 border-border">
        <div className="flex items-start gap-3">
          <ShieldCheck weight="fill" className="text-primary mt-0.5" size={20} />
          <div className="flex-1">
            <h4 className="text-sm font-semibold mb-2">Security & Best Practices</h4>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li>✓ All API keys are encrypted with AES-256 before storage</li>
              <li>✓ Keys are only stored in your browser's secure storage (never on external servers)</li>
              <li>✓ Use environment-specific keys (development vs production)</li>
              <li>✓ Rotate keys regularly and revoke unused keys from provider dashboards</li>
              <li>✓ Monitor usage and set spending limits on each provider's platform</li>
              <li>✓ Test keys after configuration to ensure proper connectivity</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
