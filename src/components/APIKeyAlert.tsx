import { useState, useEffect } from 'react'
import { Key, Warning, ArrowRight, CheckCircle } from '@phosphor-icons/react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'

interface APIKey {
  id: string
  name: string
  key: string
  status: 'valid' | 'invalid' | 'untested'
}

interface APIKeyAlertProps {
  onSetupKeys: () => void
  feature?: string
  variant?: 'compact' | 'full'
}

export function APIKeyAlert({ onSetupKeys, feature = 'AI features', variant = 'full' }: APIKeyAlertProps) {
  const [aiKeys] = useKV<APIKey[]>('ceo-keys-ai', [])
  const [hasValidKeys, setHasValidKeys] = useState(false)
  const [validCount, setValidCount] = useState(0)

  useEffect(() => {
    if (aiKeys && aiKeys.length > 0) {
      const validKeys = aiKeys.filter(k => k.key && k.key.length > 0 && k.status === 'valid')
      setValidCount(validKeys.length)
      setHasValidKeys(validKeys.length > 0)
    } else {
      setValidCount(0)
      setHasValidKeys(false)
    }
  }, [aiKeys])

  if (hasValidKeys) {
    if (variant === 'compact') {
      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <Badge className="bg-accent/20 text-accent border-accent/40 text-xs">
            <CheckCircle weight="fill" size={12} />
            {validCount} AI {validCount === 1 ? 'Model' : 'Models'} Ready
          </Badge>
        </motion.div>
      )
    }
    return null
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={onSetupKeys}
          className="border-destructive/50 text-destructive hover:bg-destructive/10 text-xs"
        >
          <Key size={14} />
          Setup API Keys
        </Button>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-4 sm:p-6 border-destructive/50 bg-destructive/5 shadow-lg shadow-destructive/10">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-destructive/30 flex items-center justify-center ring-2 ring-destructive/50 shrink-0">
              <Warning weight="fill" className="text-destructive" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                  API Keys Required
                  <Badge className="bg-destructive text-destructive-foreground text-xs">
                    Required
                  </Badge>
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                To use {feature}, you need to configure at least one AI model API key. Add your OpenAI, Anthropic, xAI, Google, or Meta API keys to get started.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button
                  onClick={onSetupKeys}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
                  size="sm"
                >
                  <Key size={16} />
                  Setup API Keys Now
                  <ArrowRight size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://platform.openai.com/api-keys', '_blank')}
                  className="w-full sm:w-auto"
                >
                  Get OpenAI Key
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-destructive/30">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <Key weight="fill" className="text-destructive" size={14} />
              💡 Supported: OpenAI (GPT-4o) • Anthropic (Claude) • xAI (Grok) • Google (Gemini) • Meta (Llama)
            </p>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
