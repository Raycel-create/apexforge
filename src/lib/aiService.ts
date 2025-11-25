export type AIProvider = 'openai' | 'anthropic' | 'xai' | 'google' | 'meta' | 'mistral' | 'cohere' | 'huggingface'

export interface AIModelConfig {
  id: string
  name: string
  provider: AIProvider
  apiKeyId: string
  endpoint: string
  modelName: string
  category?: 'flagship' | 'mini' | 'fast' | 'instruct' | 'vision' | 'code'
  description?: string
}

export interface AIRequest {
  prompt: string
  model: AIModelConfig
  apiKey: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
}

export interface AIResponse {
  success: boolean
  content?: string
  error?: string
  model: string
  tokensUsed?: number
}

export interface StoredAPIKey {
  id: string
  name: string
  key: string
  status: 'valid' | 'invalid' | 'untested'
  provider?: string
}

export const AI_MODEL_CONFIGS: AIModelConfig[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    apiKeyId: 'openai',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    modelName: 'gpt-4o',
    category: 'flagship',
    description: 'Most capable GPT-4 model with vision'
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    apiKeyId: 'openai',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    modelName: 'gpt-4o-mini',
    category: 'mini',
    description: 'Smaller, faster, and more affordable'
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    apiKeyId: 'openai',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    modelName: 'gpt-4-turbo-preview',
    category: 'fast',
    description: 'Fast GPT-4 with 128k context'
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    apiKeyId: 'openai',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    modelName: 'gpt-3.5-turbo',
    category: 'fast',
    description: 'Fast and efficient for simple tasks'
  },
  {
    id: 'gpt-4-vision',
    name: 'GPT-4 Vision',
    provider: 'openai',
    apiKeyId: 'openai',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    modelName: 'gpt-4-vision-preview',
    category: 'vision',
    description: 'Understands images and text'
  },
  {
    id: 'claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    apiKeyId: 'anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    modelName: 'claude-3-5-sonnet-20241022',
    category: 'flagship',
    description: 'Most intelligent Claude model with extended thinking'
  },
  {
    id: 'claude-3.5-sonnet-20240620',
    name: 'Claude 3.5 Sonnet (June)',
    provider: 'anthropic',
    apiKeyId: 'anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    modelName: 'claude-3-5-sonnet-20240620',
    category: 'flagship',
    description: 'Earlier version of Claude 3.5 Sonnet'
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'anthropic',
    apiKeyId: 'anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    modelName: 'claude-3-opus-20240229',
    category: 'flagship',
    description: 'Top-level performance and intelligence'
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'anthropic',
    apiKeyId: 'anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    modelName: 'claude-3-sonnet-20240229',
    category: 'fast',
    description: 'Balanced speed and capability'
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    apiKeyId: 'anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    modelName: 'claude-3-haiku-20240307',
    category: 'mini',
    description: 'Fastest Claude model for quick tasks'
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'anthropic',
    apiKeyId: 'anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    modelName: 'claude-3-5-haiku-20241022',
    category: 'mini',
    description: 'Latest fast Claude model with improved capabilities'
  },
  {
    id: 'grok-2',
    name: 'Grok-2',
    provider: 'xai',
    apiKeyId: 'xai',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    modelName: 'grok-2-latest',
    category: 'flagship',
    description: 'Latest and most capable Grok'
  },
  {
    id: 'grok-2-mini',
    name: 'Grok-2 Mini',
    provider: 'xai',
    apiKeyId: 'xai',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    modelName: 'grok-2-mini',
    category: 'mini',
    description: 'Compact and efficient'
  },
  {
    id: 'grok-1.5',
    name: 'Grok-1.5',
    provider: 'xai',
    apiKeyId: 'xai',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    modelName: 'grok-1.5',
    category: 'fast',
    description: 'Previous generation, still powerful'
  },
  {
    id: 'grok-vision',
    name: 'Grok Vision',
    provider: 'xai',
    apiKeyId: 'xai',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    modelName: 'grok-vision-beta',
    category: 'vision',
    description: 'Image understanding capabilities'
  },
  {
    id: 'grok-beta',
    name: 'Grok Beta',
    provider: 'xai',
    apiKeyId: 'xai',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    modelName: 'grok-beta',
    category: 'fast',
    description: 'Experimental features'
  },
  {
    id: 'gemini-2.0-flash-exp',
    name: 'Gemini 2.0 Flash Experimental',
    provider: 'google',
    apiKeyId: 'google',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
    modelName: 'gemini-2.0-flash-exp',
    category: 'flagship',
    description: 'Next-gen experimental multimodal model'
  },
  {
    id: 'gemini-1.5-pro-latest',
    name: 'Gemini 1.5 Pro (Latest)',
    provider: 'google',
    apiKeyId: 'google',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent',
    modelName: 'gemini-1.5-pro-latest',
    category: 'flagship',
    description: 'Latest Gemini Pro with 2M token context window'
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'google',
    apiKeyId: 'google',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
    modelName: 'gemini-1.5-pro',
    category: 'flagship',
    description: 'Most capable Gemini with massive context'
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'google',
    apiKeyId: 'google',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    modelName: 'gemini-1.5-flash',
    category: 'fast',
    description: 'Fast and efficient for most tasks'
  },
  {
    id: 'gemini-1.5-flash-8b',
    name: 'Gemini 1.5 Flash-8B',
    provider: 'google',
    apiKeyId: 'google',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent',
    modelName: 'gemini-1.5-flash-8b',
    category: 'mini',
    description: 'Smaller, faster Flash model for high-volume tasks'
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'google',
    apiKeyId: 'google',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    modelName: 'gemini-pro',
    category: 'fast',
    description: 'Stable production model'
  },
  {
    id: 'gemini-pro-vision',
    name: 'Gemini Pro Vision',
    provider: 'google',
    apiKeyId: 'google',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent',
    modelName: 'gemini-pro-vision',
    category: 'vision',
    description: 'Multimodal image and text understanding'
  },
  {
    id: 'llama-3.1-405b',
    name: 'Llama 3.1 405B',
    provider: 'meta',
    apiKeyId: 'meta',
    endpoint: 'https://api.together.xyz/v1/chat/completions',
    modelName: 'meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo',
    category: 'flagship',
    description: 'Largest Llama model'
  },
  {
    id: 'llama-3.1-70b',
    name: 'Llama 3.1 70B',
    provider: 'meta',
    apiKeyId: 'meta',
    endpoint: 'https://api.together.xyz/v1/chat/completions',
    modelName: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
    category: 'fast',
    description: 'Balanced performance'
  },
  {
    id: 'llama-3.1-8b',
    name: 'Llama 3.1 8B',
    provider: 'meta',
    apiKeyId: 'meta',
    endpoint: 'https://api.together.xyz/v1/chat/completions',
    modelName: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
    category: 'mini',
    description: 'Lightweight and fast'
  },
  {
    id: 'llama-3-70b',
    name: 'Llama 3 70B',
    provider: 'meta',
    apiKeyId: 'meta',
    endpoint: 'https://api.together.xyz/v1/chat/completions',
    modelName: 'meta-llama/Llama-3-70b-chat-hf',
    category: 'fast',
    description: 'Previous generation'
  },
  {
    id: 'codellama-70b',
    name: 'Code Llama 70B',
    provider: 'meta',
    apiKeyId: 'meta',
    endpoint: 'https://api.together.xyz/v1/chat/completions',
    modelName: 'codellama/CodeLlama-70b-Instruct-hf',
    category: 'code',
    description: 'Specialized for coding'
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'mistral',
    apiKeyId: 'mistral',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    modelName: 'mistral-large-latest',
    category: 'flagship',
    description: 'Top-tier Mistral model'
  },
  {
    id: 'mistral-medium',
    name: 'Mistral Medium',
    provider: 'mistral',
    apiKeyId: 'mistral',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    modelName: 'mistral-medium-latest',
    category: 'fast',
    description: 'Balanced capabilities'
  },
  {
    id: 'mistral-small',
    name: 'Mistral Small',
    provider: 'mistral',
    apiKeyId: 'mistral',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    modelName: 'mistral-small-latest',
    category: 'mini',
    description: 'Fast and efficient'
  },
  {
    id: 'mixtral-8x7b',
    name: 'Mixtral 8x7B',
    provider: 'mistral',
    apiKeyId: 'mistral',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    modelName: 'open-mixtral-8x7b',
    category: 'fast',
    description: 'Mixture of experts'
  },
  {
    id: 'codestral',
    name: 'Codestral',
    provider: 'mistral',
    apiKeyId: 'mistral',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    modelName: 'codestral-latest',
    category: 'code',
    description: 'Code generation specialist'
  },
  {
    id: 'hf-zephyr-7b',
    name: 'Zephyr 7B Beta',
    provider: 'huggingface',
    apiKeyId: 'huggingface',
    endpoint: 'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
    modelName: 'HuggingFaceH4/zephyr-7b-beta',
    category: 'fast',
    description: 'Fine-tuned Mistral 7B for chat'
  },
  {
    id: 'hf-falcon-180b',
    name: 'Falcon 180B Chat',
    provider: 'huggingface',
    apiKeyId: 'huggingface',
    endpoint: 'https://api-inference.huggingface.co/models/tiiuae/falcon-180B-chat',
    modelName: 'tiiuae/falcon-180B-chat',
    category: 'flagship',
    description: 'UAE powerful open flagship'
  },
  {
    id: 'hf-falcon-40b',
    name: 'Falcon 40B Instruct',
    provider: 'huggingface',
    apiKeyId: 'huggingface',
    endpoint: 'https://api-inference.huggingface.co/models/tiiuae/falcon-40b-instruct',
    modelName: 'tiiuae/falcon-40b-instruct',
    category: 'fast',
    description: 'Mid-size balanced Falcon'
  },
  {
    id: 'hf-falcon-7b',
    name: 'Falcon 7B Instruct',
    provider: 'huggingface',
    apiKeyId: 'huggingface',
    endpoint: 'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct',
    modelName: 'tiiuae/falcon-7b-instruct',
    category: 'mini',
    description: 'Compact efficient Falcon'
  },
  {
    id: 'hf-mistral-7b',
    name: 'Mistral 7B Instruct v0.2',
    provider: 'huggingface',
    apiKeyId: 'huggingface',
    endpoint: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
    modelName: 'mistralai/Mistral-7B-Instruct-v0.2',
    category: 'fast',
    description: 'Open source excellence'
  },
  {
    id: 'hf-mixtral-8x7b',
    name: 'Mixtral 8x7B Instruct',
    provider: 'huggingface',
    apiKeyId: 'huggingface',
    endpoint: 'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
    modelName: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    category: 'flagship',
    description: 'Mixture of experts architecture'
  },
  {
    id: 'hf-starling-7b',
    name: 'Starling LM 7B Alpha',
    provider: 'huggingface',
    apiKeyId: 'huggingface',
    endpoint: 'https://api-inference.huggingface.co/models/berkeley-nest/Starling-LM-7B-alpha',
    modelName: 'berkeley-nest/Starling-LM-7B-alpha',
    category: 'fast',
    description: 'Berkeley RLAIF trained'
  },
  {
    id: 'hf-wizardcoder-34b',
    name: 'WizardCoder Python 34B',
    provider: 'huggingface',
    apiKeyId: 'huggingface',
    endpoint: 'https://api-inference.huggingface.co/models/WizardLM/WizardCoder-Python-34B-V1.0',
    modelName: 'WizardLM/WizardCoder-Python-34B-V1.0',
    category: 'code',
    description: 'Python code specialist'
  },
  {
    id: 'hf-wizardcoder-15b',
    name: 'WizardCoder 15B',
    provider: 'huggingface',
    apiKeyId: 'huggingface',
    endpoint: 'https://api-inference.huggingface.co/models/WizardLM/WizardCoder-15B-V1.0',
    modelName: 'WizardLM/WizardCoder-15B-V1.0',
    category: 'code',
    description: 'Multi-language code generation'
  },
  {
    id: 'hf-codellama-34b',
    name: 'CodeLlama 34B Instruct',
    provider: 'huggingface',
    apiKeyId: 'huggingface',
    endpoint: 'https://api-inference.huggingface.co/models/codellama/CodeLlama-34b-Instruct-hf',
    modelName: 'codellama/CodeLlama-34b-Instruct-hf',
    category: 'code',
    description: 'Meta code-focused Llama'
  },
  {
    id: 'hf-deepseek-coder-33b',
    name: 'DeepSeek Coder 33B',
    provider: 'huggingface',
    apiKeyId: 'huggingface',
    endpoint: 'https://api-inference.huggingface.co/models/deepseek-ai/deepseek-coder-33b-instruct',
    modelName: 'deepseek-ai/deepseek-coder-33b-instruct',
    category: 'code',
    description: 'DeepSeek code specialist'
  },
  {
    id: 'hf-openchat-3.5',
    name: 'OpenChat 3.5',
    provider: 'huggingface',
    apiKeyId: 'huggingface',
    endpoint: 'https://api-inference.huggingface.co/models/openchat/openchat-3.5-0106',
    modelName: 'openchat/openchat-3.5-0106',
    category: 'fast',
    description: 'Fine-tuned Mistral-based chat'
  },
  {
    id: 'hf-yi-34b',
    name: 'Yi 34B Chat',
    provider: 'huggingface',
    apiKeyId: 'huggingface',
    endpoint: 'https://api-inference.huggingface.co/models/01-ai/Yi-34B-Chat',
    modelName: '01-ai/Yi-34B-Chat',
    category: 'fast',
    description: 'Bilingual Chinese-English model'
  },
  {
    id: 'hf-phi-2',
    name: 'Phi-2',
    provider: 'huggingface',
    apiKeyId: 'huggingface',
    endpoint: 'https://api-inference.huggingface.co/models/microsoft/phi-2',
    modelName: 'microsoft/phi-2',
    category: 'mini',
    description: 'Microsoft compact model'
  },
  {
    id: 'hf-nous-hermes-2',
    name: 'Nous Hermes 2 Mixtral',
    provider: 'huggingface',
    apiKeyId: 'huggingface',
    endpoint: 'https://api-inference.huggingface.co/models/NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO',
    modelName: 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO',
    category: 'flagship',
    description: 'Community fine-tuned excellence'
  },
  {
    id: 'cohere-command-r-plus',
    name: 'Command R+',
    provider: 'cohere',
    apiKeyId: 'cohere',
    endpoint: 'https://api.cohere.ai/v1/chat',
    modelName: 'command-r-plus',
    category: 'flagship',
    description: 'Most capable Command model'
  },
  {
    id: 'cohere-command-r',
    name: 'Command R',
    provider: 'cohere',
    apiKeyId: 'cohere',
    endpoint: 'https://api.cohere.ai/v1/chat',
    modelName: 'command-r',
    category: 'fast',
    description: 'Balanced performance'
  },
  {
    id: 'cohere-command',
    name: 'Command',
    provider: 'cohere',
    apiKeyId: 'cohere',
    endpoint: 'https://api.cohere.ai/v1/chat',
    modelName: 'command',
    category: 'fast',
    description: 'Production-ready model'
  },
  {
    id: 'cohere-command-light',
    name: 'Command Light',
    provider: 'cohere',
    apiKeyId: 'cohere',
    endpoint: 'https://api.cohere.ai/v1/chat',
    modelName: 'command-light',
    category: 'mini',
    description: 'Fast and lightweight'
  },
  {
    id: 'cohere-command-nightly',
    name: 'Command Nightly',
    provider: 'cohere',
    apiKeyId: 'cohere',
    endpoint: 'https://api.cohere.ai/v1/chat',
    modelName: 'command-nightly',
    category: 'fast',
    description: 'Latest experimental features'
  }
]

export class AIService {
  private apiKeys: Map<string, string> = new Map()

  constructor(storedKeys: StoredAPIKey[]) {
    storedKeys.forEach(key => {
      if (key.status === 'valid' && key.key) {
        this.apiKeys.set(key.id, key.key)
      }
    })
  }

  getAvailableModels(): AIModelConfig[] {
    return AI_MODEL_CONFIGS.filter(model => 
      this.apiKeys.has(model.apiKeyId)
    )
  }

  hasValidKey(provider: string): boolean {
    return this.apiKeys.has(provider)
  }

  private async callOpenAI(request: AIRequest): Promise<AIResponse> {
    try {
      const response = await fetch(request.model.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${request.apiKey}`
        },
        body: JSON.stringify({
          model: request.model.modelName,
          messages: [
            ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
            { role: 'user', content: request.prompt }
          ],
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? 2000
        })
      })

      if (!response.ok) {
        const error = await response.json()
        return {
          success: false,
          error: error.error?.message || `API error: ${response.status}`,
          model: request.model.name
        }
      }

      const data = await response.json()
      return {
        success: true,
        content: data.choices[0].message.content,
        model: request.model.name,
        tokensUsed: data.usage?.total_tokens
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        model: request.model.name
      }
    }
  }

  private async callAnthropic(request: AIRequest): Promise<AIResponse> {
    try {
      const response = await fetch(request.model.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': request.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: request.model.modelName,
          messages: [
            { role: 'user', content: request.prompt }
          ],
          system: request.systemPrompt,
          max_tokens: request.maxTokens ?? 2000,
          temperature: request.temperature ?? 0.7
        })
      })

      if (!response.ok) {
        const error = await response.json()
        return {
          success: false,
          error: error.error?.message || `API error: ${response.status}`,
          model: request.model.name
        }
      }

      const data = await response.json()
      return {
        success: true,
        content: data.content[0].text,
        model: request.model.name,
        tokensUsed: data.usage?.input_tokens + data.usage?.output_tokens
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        model: request.model.name
      }
    }
  }

  private async callXAI(request: AIRequest): Promise<AIResponse> {
    try {
      const response = await fetch(request.model.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${request.apiKey}`
        },
        body: JSON.stringify({
          model: request.model.modelName,
          messages: [
            ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
            { role: 'user', content: request.prompt }
          ],
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? 2000
        })
      })

      if (!response.ok) {
        const error = await response.json()
        return {
          success: false,
          error: error.error?.message || `API error: ${response.status}`,
          model: request.model.name
        }
      }

      const data = await response.json()
      return {
        success: true,
        content: data.choices[0].message.content,
        model: request.model.name,
        tokensUsed: data.usage?.total_tokens
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        model: request.model.name
      }
    }
  }

  private async callGoogle(request: AIRequest): Promise<AIResponse> {
    try {
      const url = `${request.model.endpoint}?key=${request.apiKey}`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: request.systemPrompt 
                ? `${request.systemPrompt}\n\n${request.prompt}` 
                : request.prompt
            }]
          }],
          generationConfig: {
            temperature: request.temperature ?? 0.7,
            maxOutputTokens: request.maxTokens ?? 2000
          }
        })
      })

      if (!response.ok) {
        const error = await response.json()
        return {
          success: false,
          error: error.error?.message || `API error: ${response.status}`,
          model: request.model.name
        }
      }

      const data = await response.json()
      return {
        success: true,
        content: data.candidates[0].content.parts[0].text,
        model: request.model.name,
        tokensUsed: data.usageMetadata?.totalTokenCount
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        model: request.model.name
      }
    }
  }

  private async callMeta(request: AIRequest): Promise<AIResponse> {
    try {
      const response = await fetch(request.model.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${request.apiKey}`
        },
        body: JSON.stringify({
          model: request.model.modelName,
          messages: [
            ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
            { role: 'user', content: request.prompt }
          ],
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? 2000
        })
      })

      if (!response.ok) {
        const error = await response.json()
        return {
          success: false,
          error: error.error?.message || `API error: ${response.status}`,
          model: request.model.name
        }
      }

      const data = await response.json()
      return {
        success: true,
        content: data.choices[0].message.content,
        model: request.model.name,
        tokensUsed: data.usage?.total_tokens
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        model: request.model.name
      }
    }
  }

  private async callMistral(request: AIRequest): Promise<AIResponse> {
    try {
      const response = await fetch(request.model.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${request.apiKey}`
        },
        body: JSON.stringify({
          model: request.model.modelName,
          messages: [
            ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
            { role: 'user', content: request.prompt }
          ],
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? 2000
        })
      })

      if (!response.ok) {
        const error = await response.json()
        return {
          success: false,
          error: error.error?.message || `API error: ${response.status}`,
          model: request.model.name
        }
      }

      const data = await response.json()
      return {
        success: true,
        content: data.choices[0].message.content,
        model: request.model.name,
        tokensUsed: data.usage?.total_tokens
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        model: request.model.name
      }
    }
  }

  private async callCohere(request: AIRequest): Promise<AIResponse> {
    try {
      const response = await fetch(request.model.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${request.apiKey}`
        },
        body: JSON.stringify({
          model: request.model.modelName,
          message: request.prompt,
          preamble: request.systemPrompt,
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? 2000
        })
      })

      if (!response.ok) {
        const error = await response.json()
        return {
          success: false,
          error: error.message || `API error: ${response.status}`,
          model: request.model.name
        }
      }

      const data = await response.json()
      return {
        success: true,
        content: data.text,
        model: request.model.name,
        tokensUsed: data.meta?.tokens?.total_tokens
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        model: request.model.name
      }
    }
  }

  private async callHuggingFace(request: AIRequest): Promise<AIResponse> {
    try {
      const response = await fetch(request.model.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${request.apiKey}`
        },
        body: JSON.stringify({
          inputs: request.systemPrompt 
            ? `${request.systemPrompt}\n\n${request.prompt}` 
            : request.prompt,
          parameters: {
            temperature: request.temperature ?? 0.7,
            max_new_tokens: request.maxTokens ?? 2000,
            return_full_text: false
          }
        })
      })

      if (!response.ok) {
        const error = await response.json()
        return {
          success: false,
          error: error.error || `API error: ${response.status}`,
          model: request.model.name
        }
      }

      const data = await response.json()
      const content = Array.isArray(data) ? data[0]?.generated_text : data.generated_text
      
      return {
        success: true,
        content: content || '',
        model: request.model.name,
        tokensUsed: undefined
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        model: request.model.name
      }
    }
  }

  async generateResponse(
    prompt: string,
    modelConfig: AIModelConfig,
    options?: {
      temperature?: number
      maxTokens?: number
      systemPrompt?: string
    }
  ): Promise<AIResponse> {
    const apiKey = this.apiKeys.get(modelConfig.apiKeyId)
    
    if (!apiKey) {
      return {
        success: false,
        error: `No valid API key found for ${modelConfig.provider}`,
        model: modelConfig.name
      }
    }

    const request: AIRequest = {
      prompt,
      model: modelConfig,
      apiKey,
      temperature: options?.temperature,
      maxTokens: options?.maxTokens,
      systemPrompt: options?.systemPrompt
    }

    switch (modelConfig.provider) {
      case 'openai':
        return this.callOpenAI(request)
      case 'anthropic':
        return this.callAnthropic(request)
      case 'xai':
        return this.callXAI(request)
      case 'google':
        return this.callGoogle(request)
      case 'meta':
        return this.callMeta(request)
      case 'mistral':
        return this.callMistral(request)
      case 'cohere':
        return this.callCohere(request)
      case 'huggingface':
        return this.callHuggingFace(request)
      default:
        return {
          success: false,
          error: `Unsupported provider: ${modelConfig.provider}`,
          model: modelConfig.name
        }
    }
  }

  async generateDebateResponse(
    prompt: string,
    modelConfig: AIModelConfig,
    agentPersonality: string
  ): Promise<AIResponse> {
    const systemPrompt = `You are an AI agent in a collaborative team building an application. Your personality is: ${agentPersonality}. 
    
Your role is to provide brief, opinionated feedback on the implementation. Be specific, technical, and sometimes disagree with other approaches. Keep responses under 100 words. Focus on one specific aspect like security, performance, UX, or code quality.

Format your response as a short, conversational message that would appear in a team chat.`

    return this.generateResponse(prompt, modelConfig, {
      systemPrompt,
      temperature: 0.8,
      maxTokens: 150
    })
  }

  async generateCode(
    prompt: string,
    modelConfig: AIModelConfig,
    framework: string,
    backend: string
  ): Promise<AIResponse> {
    const systemPrompt = `You are an expert full-stack developer. Generate production-ready code based on the user's requirements.

Framework: ${framework}
Backend: ${backend}

Provide clean, modern, well-structured code with best practices. Include necessary imports, error handling, and comments where helpful.`

    return this.generateResponse(prompt, modelConfig, {
      systemPrompt,
      temperature: 0.3,
      maxTokens: 4000
    })
  }

  async validateAPIKey(provider: string, apiKey: string): Promise<boolean> {
    const config = AI_MODEL_CONFIGS.find(m => m.apiKeyId === provider)
    if (!config) return false

    const testRequest: AIRequest = {
      prompt: 'Say "OK" if you can read this.',
      model: config,
      apiKey,
      maxTokens: 10
    }

    try {
      let response: AIResponse
      
      switch (config.provider) {
        case 'openai':
        case 'xai':
        case 'meta':
        case 'mistral':
          response = await this.callOpenAI(testRequest)
          break
        case 'anthropic':
          response = await this.callAnthropic(testRequest)
          break
        case 'google':
          response = await this.callGoogle(testRequest)
          break
        case 'cohere':
          response = await this.callCohere(testRequest)
          break
        case 'huggingface':
          response = await this.callHuggingFace(testRequest)
          break
        default:
          return false
      }

      return response.success
    } catch {
      return false
    }
  }
}

export async function createAIService(storedKeys: StoredAPIKey[]): Promise<AIService> {
  return new AIService(storedKeys)
}

export function getModelPersonality(modelId: string): string {
  const personalities: Record<string, string> = {
    'gpt': 'Clean, organized, and focused on best practices. You prefer well-structured code and comprehensive solutions. You emphasize clarity and maintainability.',
    'claude': 'Security-first mindset with strong reasoning. You always think about vulnerabilities, edge cases, and safe coding practices. You excel at thoughtful analysis and detailed explanations.',
    'grok': 'Fast and edgy. You prioritize performance, speed, and cutting-edge solutions. Sometimes controversial but always innovative.',
    'gemini': 'Beautiful UI/UX focused with multimodal understanding. You care deeply about design, user experience, and visual polish. You excel at context-aware responses.',
    'llama': 'Open source advocate. You prefer free alternatives, community solutions, and transparent approaches. You value accessibility and democratization.',
    'mistral': 'Efficient and precise. You value optimization, clean architecture, and European engineering standards. You balance performance with elegance.',
    'cohere': 'Enterprise-focused. You prioritize scalability, reliability, and production-grade solutions. You think about real-world deployment scenarios.',
    'huggingface': 'Community-driven. You embrace open source, transparency, and collaborative development. You value experimentation and innovation.'
  }
  
  const baseId = modelId.split('-')[0]
  return personalities[baseId] || 'Helpful and collaborative AI assistant focused on delivering quality results.'
}

export function getModelsByProvider(provider: AIProvider): AIModelConfig[] {
  return AI_MODEL_CONFIGS.filter(m => m.provider === provider)
}

export function getModelsByCategory(category: string): AIModelConfig[] {
  return AI_MODEL_CONFIGS.filter(m => m.category === category)
}

export const AI_PROVIDERS = [
  { id: 'openai', name: 'OpenAI', description: 'GPT-4o and GPT-3.5 models', icon: '🧠' },
  { id: 'anthropic', name: 'Anthropic', description: 'Claude 3 family', icon: '🛡️' },
  { id: 'xai', name: 'xAI', description: 'Grok models', icon: '⚡' },
  { id: 'google', name: 'Google', description: 'Gemini family', icon: '🎨' },
  { id: 'meta', name: 'Meta', description: 'Llama models', icon: '🦙' },
  { id: 'mistral', name: 'Mistral AI', description: 'Mistral and Mixtral', icon: '🌪️' },
  { id: 'cohere', name: 'Cohere', description: 'Command models', icon: '🎯' },
  { id: 'huggingface', name: 'Hugging Face', description: 'Open source models', icon: '🤗' }
] as const
