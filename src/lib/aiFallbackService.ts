import { AIService, AIModelConfig, AIResponse, AI_MODEL_CONFIGS } from './aiService'

export interface FallbackAttempt {
  model: string
  success: boolean
  error?: string
  tokensUsed?: number
  attemptNumber: number
  timestamp: Date
}

export interface FallbackResult extends AIResponse {
  fallbackHistory: FallbackAttempt[]
  totalAttempts: number
  finalModel: string
}

export interface RateLimitInfo {
  provider: string
  resetTime?: Date
  retryAfter?: number
  limitReached: boolean
}

export class AIFallbackService {
  private aiService: AIService
  private rateLimits: Map<string, RateLimitInfo> = new Map()
  private failureCounts: Map<string, number> = new Map()
  private readonly MAX_RETRIES = 3
  private readonly FAILURE_THRESHOLD = 3
  private readonly RATE_LIMIT_PATTERNS = [
    'rate limit',
    'rate_limit',
    'too many requests',
    'quota exceeded',
    'exceeded quota',
    '429',
    'insufficient_quota'
  ]

  constructor(aiService: AIService) {
    this.aiService = aiService
  }

  private isRateLimitError(error: string): boolean {
    const errorLower = error.toLowerCase()
    return this.RATE_LIMIT_PATTERNS.some(pattern => 
      errorLower.includes(pattern.toLowerCase())
    )
  }

  private extractRetryAfter(error: string): number | undefined {
    const match = error.match(/retry after (\d+)/i) || 
                  error.match(/try again in (\d+)/i)
    if (match) {
      return parseInt(match[1])
    }
    return undefined
  }

  private markRateLimit(provider: string, error: string): void {
    const retryAfter = this.extractRetryAfter(error)
    const resetTime = retryAfter 
      ? new Date(Date.now() + retryAfter * 1000)
      : new Date(Date.now() + 60000)

    this.rateLimits.set(provider, {
      provider,
      resetTime,
      retryAfter,
      limitReached: true
    })

    setTimeout(() => {
      const info = this.rateLimits.get(provider)
      if (info) {
        this.rateLimits.set(provider, { ...info, limitReached: false })
      }
    }, retryAfter ? retryAfter * 1000 : 60000)
  }

  private incrementFailureCount(provider: string): void {
    const current = this.failureCounts.get(provider) || 0
    this.failureCounts.set(provider, current + 1)
  }

  private resetFailureCount(provider: string): void {
    this.failureCounts.set(provider, 0)
  }

  private isProviderHealthy(provider: string): boolean {
    const rateLimit = this.rateLimits.get(provider)
    if (rateLimit?.limitReached) {
      if (rateLimit.resetTime && rateLimit.resetTime > new Date()) {
        return false
      }
    }

    const failures = this.failureCounts.get(provider) || 0
    return failures < this.FAILURE_THRESHOLD
  }

  private getHealthyModels(preferredModel?: AIModelConfig): AIModelConfig[] {
    const availableModels = this.aiService.getAvailableModels()
    
    const healthyModels = availableModels.filter(model => 
      this.isProviderHealthy(model.apiKeyId)
    )

    if (healthyModels.length === 0) {
      return availableModels
    }

    if (preferredModel && healthyModels.some(m => m.id === preferredModel.id)) {
      return [
        preferredModel,
        ...healthyModels.filter(m => m.id !== preferredModel.id)
      ]
    }

    healthyModels.sort((a, b) => {
      const aFailures = this.failureCounts.get(a.apiKeyId) || 0
      const bFailures = this.failureCounts.get(b.apiKeyId) || 0
      return aFailures - bFailures
    })

    return healthyModels
  }

  async generateWithFallback(
    prompt: string,
    preferredModelId?: string,
    options?: {
      temperature?: number
      maxTokens?: number
      systemPrompt?: string
      maxAttempts?: number
    }
  ): Promise<FallbackResult> {
    const maxAttempts = options?.maxAttempts || this.MAX_RETRIES
    const fallbackHistory: FallbackAttempt[] = []
    
    let preferredModel: AIModelConfig | undefined
    if (preferredModelId) {
      preferredModel = AI_MODEL_CONFIGS.find(m => m.id === preferredModelId)
    }

    const modelsToTry = this.getHealthyModels(preferredModel)

    if (modelsToTry.length === 0) {
      return {
        success: false,
        error: 'No valid API keys configured. Please add at least one AI model API key.',
        model: 'None',
        fallbackHistory: [],
        totalAttempts: 0,
        finalModel: 'None'
      }
    }

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const modelIndex = Math.min(attempt, modelsToTry.length - 1)
      const currentModel = modelsToTry[modelIndex]

      try {
        const response = await this.aiService.generateResponse(
          prompt,
          currentModel,
          options
        )

        const attemptRecord: FallbackAttempt = {
          model: currentModel.name,
          success: response.success,
          error: response.error,
          tokensUsed: response.tokensUsed,
          attemptNumber: attempt + 1,
          timestamp: new Date()
        }

        fallbackHistory.push(attemptRecord)

        if (response.success) {
          this.resetFailureCount(currentModel.apiKeyId)
          
          return {
            ...response,
            fallbackHistory,
            totalAttempts: attempt + 1,
            finalModel: currentModel.name
          }
        }

        if (response.error && this.isRateLimitError(response.error)) {
          this.markRateLimit(currentModel.apiKeyId, response.error)
        } else {
          this.incrementFailureCount(currentModel.apiKeyId)
        }

        if (attempt < maxAttempts - 1 && modelIndex < modelsToTry.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)))
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        
        fallbackHistory.push({
          model: currentModel.name,
          success: false,
          error: errorMessage,
          attemptNumber: attempt + 1,
          timestamp: new Date()
        })

        this.incrementFailureCount(currentModel.apiKeyId)

        if (attempt < maxAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)))
        }
      }
    }

    return {
      success: false,
      error: `All ${fallbackHistory.length} attempts failed. Last error: ${fallbackHistory[fallbackHistory.length - 1]?.error || 'Unknown'}`,
      model: fallbackHistory[fallbackHistory.length - 1]?.model || 'Unknown',
      fallbackHistory,
      totalAttempts: fallbackHistory.length,
      finalModel: 'Failed'
    }
  }

  async generateDebateResponseWithFallback(
    prompt: string,
    preferredModelId: string,
    agentPersonality: string
  ): Promise<FallbackResult> {
    const preferredModel = AI_MODEL_CONFIGS.find(m => m.id === preferredModelId)
    
    if (!preferredModel) {
      const fallbackModels = this.getHealthyModels()
      if (fallbackModels.length === 0) {
        return {
          success: false,
          error: 'No models available',
          model: 'None',
          fallbackHistory: [],
          totalAttempts: 0,
          finalModel: 'None'
        }
      }
    }

    const systemPrompt = `You are an AI agent in a collaborative team building an application. Your personality is: ${agentPersonality}. 
    
Your role is to provide brief, opinionated feedback on the implementation. Be specific, technical, and sometimes disagree with other approaches. Keep responses under 100 words. Focus on one specific aspect like security, performance, UX, or code quality.

Format your response as a short, conversational message that would appear in a team chat.`

    return this.generateWithFallback(prompt, preferredModelId, {
      systemPrompt,
      temperature: 0.8,
      maxTokens: 150,
      maxAttempts: 2
    })
  }

  async generateCodeWithFallback(
    prompt: string,
    preferredModelId: string,
    framework: string,
    backend: string
  ): Promise<FallbackResult> {
    const systemPrompt = `You are an expert full-stack developer. Generate production-ready code based on the user's requirements.

Framework: ${framework}
Backend: ${backend}

Provide clean, modern, well-structured code with best practices. Include necessary imports, error handling, and comments where helpful.`

    return this.generateWithFallback(prompt, preferredModelId, {
      systemPrompt,
      temperature: 0.3,
      maxTokens: 4000,
      maxAttempts: 3
    })
  }

  getRateLimitStatus(provider: string): RateLimitInfo | undefined {
    return this.rateLimits.get(provider)
  }

  getProviderHealth(): Map<string, { failures: number; healthy: boolean; rateLimit?: RateLimitInfo }> {
    const health = new Map()
    
    const allProviders = [...new Set(AI_MODEL_CONFIGS.map(m => m.apiKeyId))]
    
    for (const provider of allProviders) {
      health.set(provider, {
        failures: this.failureCounts.get(provider) || 0,
        healthy: this.isProviderHealthy(provider),
        rateLimit: this.rateLimits.get(provider)
      })
    }

    return health
  }

  resetProvider(provider: string): void {
    this.resetFailureCount(provider)
    this.rateLimits.delete(provider)
  }

  resetAllProviders(): void {
    this.failureCounts.clear()
    this.rateLimits.clear()
  }
}

export async function createAIFallbackService(aiService: AIService): Promise<AIFallbackService> {
  return new AIFallbackService(aiService)
}
