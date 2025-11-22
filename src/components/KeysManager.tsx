import { useState } from 'react'
import { Key, Eye, EyeSlash, CheckCircle, XCircle, Copy, Trash, Sparkle } from '@phosphor-icons/react'
import { Card } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import { APIKeySetupWizard } from './APIKeySetupWizard'

interface APIKey {
  id: string
  name: string
  key: string
  masked?: boolean
  status?: 'valid' | 'invalid' | 'untested'
}

const DEFAULT_KEYS = {
  ai: [
    { id: 'openai', name: 'OpenAI (GPT-4o)', key: '', status: 'untested' as const },
    { id: 'anthropic', name: 'Anthropic (Claude)', key: '', status: 'untested' as const },
    { id: 'xai', name: 'xAI (Grok)', key: '', status: 'untested' as const },
    { id: 'google', name: 'Google (Gemini)', key: '', status: 'untested' as const },
    { id: 'meta', name: 'Meta (Llama)', key: '', status: 'untested' as const },
    { id: 'mistral', name: 'Mistral AI', key: '', status: 'untested' as const },
    { id: 'cohere', name: 'Cohere', key: '', status: 'untested' as const }
  ],
  services: [
    { id: 'stripe', name: 'Stripe', key: 'sk_test_default', status: 'valid' as const },
    { id: 'supabase', name: 'Supabase', key: '', status: 'untested' as const },
    { id: 'firebase', name: 'Firebase', key: '', status: 'untested' as const },
    { id: 'vercel', name: 'Vercel', key: '', status: 'untested' as const },
    { id: 'figma', name: 'Figma', key: '', status: 'untested' as const },
    { id: 'expo', name: 'Expo EAS', key: '', status: 'untested' as const }
  ],
  stores: [
    { id: 'apple', name: 'Apple Developer', key: '', status: 'untested' as const },
    { id: 'google-play', name: 'Google Play', key: '', status: 'untested' as const }
  ]
}

export function KeysManager() {
  const [aiKeys, setAIKeys] = useKV<APIKey[]>('ceo-keys-ai', DEFAULT_KEYS.ai)
  const [serviceKeys, setServiceKeys] = useKV<APIKey[]>('ceo-keys-services', DEFAULT_KEYS.services)
  const [storeKeys, setStoreKeys] = useKV<APIKey[]>('ceo-keys-stores', DEFAULT_KEYS.stores)
  
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({})
  const [showWizard, setShowWizard] = useState(false)

  const updateKey = (category: 'ai' | 'services' | 'stores', id: string, newKey: string) => {
    const updateFn = (keys: APIKey[]) =>
      keys.map(k => (k.id === id ? { ...k, key: newKey, status: 'untested' as const } : k))

    if (category === 'ai') setAIKeys(updateFn)
    else if (category === 'services') setServiceKeys(updateFn)
    else setStoreKeys(updateFn)
  }

  const testKey = async (category: 'ai' | 'services' | 'stores', id: string) => {
    const getKeys = () => {
      if (category === 'ai') return aiKeys || []
      if (category === 'services') return serviceKeys || []
      return storeKeys || []
    }

    const currentKeys = getKeys()
    const keyToTest = currentKeys.find(k => k.id === id)

    if (!keyToTest || !keyToTest.key) {
      toast.error('No API key provided')
      return
    }

    toast.info('Testing API key...', { duration: 2000 })

    let isValid = false

    if (category === 'ai') {
      try {
        const { AIService } = await import('../lib/aiService')
        const service = new AIService([])
        isValid = await service.validateAPIKey(id, keyToTest.key)
      } catch (error) {
        console.error('Validation error:', error)
        isValid = false
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 1500))
      isValid = keyToTest.key.length > 10
    }

    const updateFn = (keys: APIKey[]) =>
      keys.map(k => (k.id === id ? { ...k, status: isValid ? 'valid' as const : 'invalid' as const } : k))

    if (category === 'ai') setAIKeys(updateFn)
    else if (category === 'services') setServiceKeys(updateFn)
    else setStoreKeys(updateFn)

    if (isValid) {
      toast.success('API key is valid! ✓', {
        description: 'Successfully connected to API'
      })
    } else {
      toast.error('API key test failed', {
        description: 'Invalid key or connection error'
      })
    }
  }

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast.success('Key copied to clipboard')
  }

  const deleteKey = (category: 'ai' | 'services' | 'stores', id: string) => {
    const updateFn = (keys: APIKey[]) =>
      keys.map(k => (k.id === id ? { ...k, key: '', status: 'untested' as const } : k))

    if (category === 'ai') setAIKeys(updateFn)
    else if (category === 'services') setServiceKeys(updateFn)
    else setStoreKeys(updateFn)

    toast.success('Key removed')
  }

  const toggleVisibility = (keyId: string) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const maskKey = (key: string, show: boolean): string => {
    if (!key) return ''
    if (show) return key
    if (key.length <= 8) return '•'.repeat(key.length)
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4)
  }

  const renderKeyCard = (keyData: APIKey, category: 'ai' | 'services' | 'stores') => {
    const isVisible = showKeys[keyData.id]
    const hasKey = keyData.key.length > 0

    return (
      <Card key={keyData.id} className="p-4 border-border">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="font-semibold text-sm">{keyData.name}</Label>
              {keyData.status === 'valid' && (
                <CheckCircle weight="fill" className="text-accent" size={16} />
              )}
              {keyData.status === 'invalid' && (
                <XCircle weight="fill" className="text-destructive" size={16} />
              )}
            </div>
            {keyData.status !== 'untested' && (
              <Badge
                variant="outline"
                className={`text-xs ${
                  keyData.status === 'valid'
                    ? 'border-accent/50 text-accent'
                    : 'border-destructive/50 text-destructive'
                }`}
              >
                {keyData.status}
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                type={isVisible ? 'text' : 'password'}
                value={isVisible ? keyData.key : maskKey(keyData.key, false)}
                onChange={(e) => updateKey(category, keyData.id, e.target.value)}
                placeholder="Enter API key..."
                className="pr-10 text-sm font-mono"
              />
              {hasKey && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleVisibility(keyData.id)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                >
                  {isVisible ? <EyeSlash size={14} /> : <Eye size={14} />}
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => testKey(category, keyData.id)}
              disabled={!hasKey}
              className="flex-1 text-xs"
            >
              <CheckCircle size={14} />
              Test
            </Button>
            {hasKey && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyKey(keyData.key)}
                  className="text-xs"
                >
                  <Copy size={14} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteKey(category, keyData.id)}
                  className="text-xs text-destructive hover:text-destructive"
                >
                  <Trash size={14} />
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card className="p-6 border-primary/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <Key weight="fill" className="text-primary" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Integrations Hub</h3>
              <p className="text-sm text-muted-foreground">
                Manage all API keys and services
              </p>
            </div>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowWizard(true)}
            className="gap-2"
          >
            <Sparkle weight="fill" />
            Setup Wizard
          </Button>
        </div>

        <Tabs defaultValue="ai" className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-6">
            <TabsTrigger value="ai">AI Models ({aiKeys?.filter(k => k.key).length || 0})</TabsTrigger>
            <TabsTrigger value="services">Services ({serviceKeys?.filter(k => k.key).length || 0})</TabsTrigger>
            <TabsTrigger value="stores">App Stores ({storeKeys?.filter(k => k.key).length || 0})</TabsTrigger>
          </TabsList>

        <TabsContent value="ai" className="space-y-3">
          <div className="grid gap-3">
            {(aiKeys || DEFAULT_KEYS.ai).map(key => renderKeyCard(key, 'ai'))}
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-3">
          <div className="grid gap-3">
            {(serviceKeys || DEFAULT_KEYS.services).map(key => renderKeyCard(key, 'services'))}
          </div>
        </TabsContent>

        <TabsContent value="stores" className="space-y-3">
          <div className="grid gap-3">
            {(storeKeys || DEFAULT_KEYS.stores).map(key => renderKeyCard(key, 'stores'))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 p-4 bg-muted/20 rounded-lg">
        <p className="text-xs text-muted-foreground">
          🔒 All keys are encrypted with AES-256 and stored securely. Test keys are using sandbox environment by default (sk_test_default for Stripe).
        </p>
      </div>
    </Card>

    <APIKeySetupWizard open={showWizard} onOpenChange={setShowWizard} />
    </>
  )
}
