import { useState } from 'react'
import { Key, CheckCircle, ArrowRight, Copy, ArrowSquareOut, Info } from '@phosphor-icons/react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { toast } from 'sonner'

interface Provider {
  id: string
  name: string
  icon: string
  keyFormat: string
  signupUrl: string
  docsUrl: string
  pricing: string
  freeTier: boolean
  steps: string[]
  example: string
}

const PROVIDERS: Provider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    icon: '🧠',
    keyFormat: 'sk-proj-... or sk-...',
    signupUrl: 'https://platform.openai.com/signup',
    docsUrl: 'https://platform.openai.com/docs',
    pricing: '$2.50/1M input tokens, $10/1M output (GPT-4o)',
    freeTier: false,
    steps: [
      'Visit platform.openai.com and sign in',
      'Click your profile → "View API keys"',
      'Click "Create new secret key"',
      'Name your key (e.g., "ApexForge")',
      'Copy the key immediately (shown only once)',
      'Set up billing (prepaid credits required)'
    ],
    example: 'sk-proj-abc123xyz...'
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    icon: '🛡️',
    keyFormat: 'sk-ant-...',
    signupUrl: 'https://console.anthropic.com',
    docsUrl: 'https://docs.anthropic.com',
    pricing: '$3/1M input tokens, $15/1M output',
    freeTier: false,
    steps: [
      'Visit console.anthropic.com',
      'Sign up or log in',
      'Navigate to "API Keys" in settings',
      'Click "Create Key"',
      'Name your key',
      'Copy the key',
      'Add billing information'
    ],
    example: 'sk-ant-api03-xyz...'
  },
  {
    id: 'xai',
    name: 'xAI',
    icon: '⚡',
    keyFormat: 'xai-...',
    signupUrl: 'https://console.x.ai',
    docsUrl: 'https://docs.x.ai',
    pricing: 'Check console for latest',
    freeTier: false,
    steps: [
      'Visit console.x.ai',
      'Sign up (may require waitlist approval)',
      'Navigate to API keys',
      'Generate new key',
      'Copy and save securely'
    ],
    example: 'xai-abc123...'
  },
  {
    id: 'google',
    name: 'Google AI',
    icon: '🎨',
    keyFormat: 'AIza...',
    signupUrl: 'https://aistudio.google.com',
    docsUrl: 'https://ai.google.dev/docs',
    pricing: 'Free tier: 60 RPM',
    freeTier: true,
    steps: [
      'Visit aistudio.google.com',
      'Sign in with Google account',
      'Click "Get API key"',
      'Create API key in new or existing project',
      'Copy the key',
      'No billing required for free tier!'
    ],
    example: 'AIzaSyAbc123...'
  },
  {
    id: 'meta',
    name: 'Meta (via Together AI)',
    icon: '🦙',
    keyFormat: 'Together AI key',
    signupUrl: 'https://api.together.xyz/signup',
    docsUrl: 'https://docs.together.ai',
    pricing: '$0.88/1M tokens (Llama 3.1)',
    freeTier: true,
    steps: [
      'Visit api.together.xyz',
      'Sign up for account',
      'Get $25 free credits',
      'Go to Settings → API Keys',
      'Generate new key',
      'Copy and save'
    ],
    example: 'together_abc123...'
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    icon: '🌪️',
    keyFormat: 'mistral-...',
    signupUrl: 'https://console.mistral.ai',
    docsUrl: 'https://docs.mistral.ai',
    pricing: '$2/1M input, $6/1M output (Large)',
    freeTier: false,
    steps: [
      'Visit console.mistral.ai',
      'Create account or sign in',
      'Navigate to API Keys section',
      'Click "Create new key"',
      'Name your key (e.g., "ApexForge")',
      'Copy the generated key',
      'Add payment method for billing'
    ],
    example: 'mistral-abc123xyz...'
  },
  {
    id: 'cohere',
    name: 'Cohere',
    icon: '🎯',
    keyFormat: 'cohere key',
    signupUrl: 'https://dashboard.cohere.com/welcome/register',
    docsUrl: 'https://docs.cohere.com',
    pricing: 'Free tier: 1000 calls/mo',
    freeTier: true,
    steps: [
      'Visit dashboard.cohere.com',
      'Sign up with email or OAuth',
      'Get free trial credits automatically',
      'Go to API Keys page',
      'Copy your default key or create new',
      'Start using immediately!'
    ],
    example: 'cohere-abc123...'
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    icon: '🤗',
    keyFormat: 'hf_...',
    signupUrl: 'https://huggingface.co/join',
    docsUrl: 'https://huggingface.co/docs/api-inference',
    pricing: 'Free tier: Rate limited access',
    freeTier: true,
    steps: [
      'Visit huggingface.co and sign up',
      'Click your profile → Settings',
      'Navigate to "Access Tokens"',
      'Click "New token"',
      'Select "Read" permission',
      'Copy the token',
      'Free inference API with rate limits'
    ],
    example: 'hf_abc123xyz...'
  }
]

interface APIKeySetupWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function APIKeySetupWizard({ open, onOpenChange }: APIKeySetupWizardProps) {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)

  const copyExample = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const openUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Key weight="fill" className="text-primary" />
            AI Model Setup Wizard
          </DialogTitle>
          <DialogDescription>
            Choose a provider and follow the steps to get your API key. We recommend starting with Google (free tier) or Together AI ($25 free credits).
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[600px] pr-4">
          {!selectedProvider ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {PROVIDERS.map((provider) => (
                <Card
                  key={provider.id}
                  className="p-4 cursor-pointer hover:border-primary transition-all"
                  onClick={() => setSelectedProvider(provider)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{provider.icon}</span>
                      <div>
                        <h3 className="font-semibold">{provider.name}</h3>
                        <p className="text-xs text-muted-foreground">{provider.keyFormat}</p>
                      </div>
                    </div>
                    {provider.freeTier && (
                      <Badge className="bg-green-500/20 text-green-500 border-green-500">
                        Free Tier
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Pricing: </span>
                      <span>{provider.pricing}</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4"
                  >
                    View Setup Guide
                    <ArrowRight weight="bold" />
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-6 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedProvider.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold">{selectedProvider.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedProvider.pricing}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProvider(null)}
                >
                  ← Back to providers
                </Button>
              </div>

              <Separator />

              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info weight="fill" className="text-accent mt-0.5" />
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">Key Format</p>
                    <p className="text-muted-foreground">{selectedProvider.keyFormat}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <code className="bg-muted px-2 py-1 rounded text-xs">
                        {selectedProvider.example}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyExample(selectedProvider.example)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle weight="fill" className="text-green-500" />
                  Step-by-Step Guide
                </h4>
                <ol className="space-y-3">
                  {selectedProvider.steps.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm mt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-semibold">Quick Links</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    variant="default"
                    className="justify-start"
                    onClick={() => openUrl(selectedProvider.signupUrl)}
                  >
                    <ArrowSquareOut weight="bold" />
                    Get API Key
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => openUrl(selectedProvider.docsUrl)}
                  >
                    <ArrowSquareOut weight="bold" />
                    Documentation
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold text-sm">💡 Pro Tips</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Save your API key immediately - some providers only show it once</li>
                  <li>• Set spending limits in your provider dashboard</li>
                  <li>• Use the "Test" button in ApexForge to validate your key</li>
                  <li>• Start with Google (free) or Together AI ($25 credits) to test</li>
                  {!selectedProvider.freeTier && (
                    <li>• ⚠️ This provider requires billing setup to use their API</li>
                  )}
                </ul>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedProvider(null)}
                >
                  Choose Different Provider
                </Button>
                <Button
                  onClick={() => {
                    openUrl(selectedProvider.signupUrl)
                    onOpenChange(false)
                  }}
                >
                  Get {selectedProvider.name} Key
                  <ArrowSquareOut weight="bold" />
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
