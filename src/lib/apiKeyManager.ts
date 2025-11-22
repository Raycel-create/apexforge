export interface APIKey {
  id: string
  name: string
  key: string
  status: 'valid' | 'invalid' | 'untested'
  required?: boolean
}

export interface APIKeyRequirement {
  category: 'ai' | 'services' | 'stores'
  keyId: string
  keyName: string
}

export const AI_KEY_REQUIREMENTS: APIKeyRequirement[] = [
  { category: 'ai', keyId: 'openai', keyName: 'OpenAI (GPT-4o)' },
  { category: 'ai', keyId: 'anthropic', keyName: 'Anthropic (Claude)' },
  { category: 'ai', keyId: 'xai', keyName: 'xAI (Grok)' },
  { category: 'ai', keyId: 'google', keyName: 'Google (Gemini)' },
  { category: 'ai', keyId: 'meta', keyName: 'Meta (Llama)' },
]
