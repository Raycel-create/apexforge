export interface AIModelConfig {
  id: string
  name: string
  provider: 'openai' | 'anthropic' | 'xai' | 'google' | 'meta' | 'mistral' | 'cohere'
  apiKeyId: string
  endpoint: string
  modelName: string
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
    modelName: 'gpt-4o'
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
    apiKeyId: 'openai',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    modelName: 'gpt-4o-mini'
  },
  {
    id: 'claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    apiKeyId: 'anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    modelName: 'claude-3-5-sonnet-20241022'
  },
  {
    id: 'grok-2',
    name: 'Grok-2',
    provider: 'xai',
    apiKeyId: 'xai',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    modelName: 'grok-2-latest'
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'google',
    apiKeyId: 'google',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
    modelName: 'gemini-1.5-pro'
  },
  {
    id: 'llama-3.1',
    name: 'Llama 3.1',
    provider: 'meta',
    apiKeyId: 'meta',
    endpoint: 'https://api.together.xyz/v1/chat/completions',
    modelName: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo'
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
      const response = await (config.provider === 'openai' || config.provider === 'xai' || config.provider === 'meta'
        ? this.callOpenAI(testRequest)
        : config.provider === 'anthropic'
        ? this.callAnthropic(testRequest)
        : this.callGoogle(testRequest))

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
    'gpt': 'Clean, organized, and focused on best practices. You prefer well-structured code and comprehensive solutions.',
    'claude': 'Security-first mindset. You always think about vulnerabilities, edge cases, and safe coding practices.',
    'grok': 'Fast and edgy. You prioritize performance, speed, and cutting-edge solutions. Sometimes controversial.',
    'gemini': 'Beautiful UI/UX focused. You care deeply about design, user experience, and visual polish.',
    'llama': 'Open source advocate. You prefer free alternatives, community solutions, and transparent approaches.'
  }
  return personalities[modelId] || 'Helpful and collaborative AI assistant.'
}
