import { useState, useEffect, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import { AIFallbackService, FallbackResult, RateLimitInfo } from '@/lib/aiFallbackService'
import { AIService, StoredAPIKey } from '@/lib/aiService'
import { createAIService } from '@/lib/aiService'
import { createAIFallbackService } from '@/lib/aiFallbackService'

export interface AIFallbackState {
  isLoading: boolean
  result: FallbackResult | null
  error: string | null
  providerHealth: Map<string, { failures: number; healthy: boolean; rateLimit?: RateLimitInfo }>
}

export function useAIFallback() {
  const [apiKeys] = useKV<StoredAPIKey[]>('api-keys', [])
  const [state, setState] = useState<AIFallbackState>({
    isLoading: false,
    result: null,
    error: null,
    providerHealth: new Map()
  })
  const [fallbackService, setFallbackService] = useState<AIFallbackService | null>(null)

  useEffect(() => {
    const initService = async () => {
      const aiService = await createAIService(apiKeys || [])
      const service = await createAIFallbackService(aiService)
      setFallbackService(service)
      
      setState(prev => ({
        ...prev,
        providerHealth: service.getProviderHealth()
      }))
    }

    initService()
  }, [apiKeys])

  const generate = useCallback(async (
    prompt: string,
    preferredModelId?: string,
    options?: {
      temperature?: number
      maxTokens?: number
      systemPrompt?: string
      maxAttempts?: number
    }
  ): Promise<FallbackResult | null> => {
    if (!fallbackService) {
      setState(prev => ({
        ...prev,
        error: 'AI service not initialized'
      }))
      return null
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      result: null
    }))

    try {
      const result = await fallbackService.generateWithFallback(
        prompt,
        preferredModelId,
        options
      )

      setState({
        isLoading: false,
        result,
        error: result.success ? null : result.error || 'Generation failed',
        providerHealth: fallbackService.getProviderHealth()
      })

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        providerHealth: fallbackService?.getProviderHealth() || new Map()
      }))
      return null
    }
  }, [fallbackService])

  const generateDebate = useCallback(async (
    prompt: string,
    preferredModelId: string,
    agentPersonality: string
  ): Promise<FallbackResult | null> => {
    if (!fallbackService) {
      return null
    }

    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const result = await fallbackService.generateDebateResponseWithFallback(
        prompt,
        preferredModelId,
        agentPersonality
      )

      setState(prev => ({
        ...prev,
        isLoading: false,
        providerHealth: fallbackService.getProviderHealth()
      }))

      return result
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        providerHealth: fallbackService?.getProviderHealth() || new Map()
      }))
      return null
    }
  }, [fallbackService])

  const generateCode = useCallback(async (
    prompt: string,
    preferredModelId: string,
    framework: string,
    backend: string
  ): Promise<FallbackResult | null> => {
    if (!fallbackService) {
      return null
    }

    setState(prev => ({ ...prev, isLoading: true }))

    try {
      const result = await fallbackService.generateCodeWithFallback(
        prompt,
        preferredModelId,
        framework,
        backend
      )

      setState(prev => ({
        ...prev,
        isLoading: false,
        providerHealth: fallbackService.getProviderHealth()
      }))

      return result
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        providerHealth: fallbackService?.getProviderHealth() || new Map()
      }))
      return null
    }
  }, [fallbackService])

  const resetProvider = useCallback((provider: string) => {
    if (fallbackService) {
      fallbackService.resetProvider(provider)
      setState(prev => ({
        ...prev,
        providerHealth: fallbackService.getProviderHealth()
      }))
    }
  }, [fallbackService])

  const resetAll = useCallback(() => {
    if (fallbackService) {
      fallbackService.resetAllProviders()
      setState(prev => ({
        ...prev,
        providerHealth: fallbackService.getProviderHealth()
      }))
    }
  }, [fallbackService])

  const getProviderHealth = useCallback(() => {
    return fallbackService?.getProviderHealth() || new Map()
  }, [fallbackService])

  const getRateLimitStatus = useCallback((provider: string): RateLimitInfo | undefined => {
    return fallbackService?.getRateLimitStatus(provider)
  }, [fallbackService])

  return {
    ...state,
    generate,
    generateDebate,
    generateCode,
    resetProvider,
    resetAll,
    getProviderHealth,
    getRateLimitStatus,
    isReady: !!fallbackService
  }
}
