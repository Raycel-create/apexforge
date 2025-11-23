import { AIService, AIModelConfig, AI_MODEL_CONFIGS } from './aiService'
import { StoredAPIKey } from './aiService'

export interface GenerationRequest {
  prompt: string
  frontend: string
  backend: string
  integrations: string[]
  selectedModelIds: string[]
}

export interface GenerationResult {
  success: boolean
  files: GeneratedFile[]
  deploymentUrl?: string
  error?: string
  debates: DebateMessage[]
}

export interface GeneratedFile {
  path: string
  content: string
  language: string
  description: string
}

export interface DebateMessage {
  agentName: string
  agentAvatar: string
  agentColor: string
  message: string
  timestamp: number
  modelUsed: string
}

export class CodeGenerationService {
  private aiService: AIService

  constructor(apiKeys: StoredAPIKey[]) {
    this.aiService = new AIService(apiKeys)
  }

  async generateApplication(request: GenerationRequest): Promise<GenerationResult> {
    const debates: DebateMessage[] = []
    const files: GeneratedFile[] = []

    try {
      const selectedModels = AI_MODEL_CONFIGS.filter(m => 
        request.selectedModelIds.includes(m.id)
      )

      if (selectedModels.length === 0) {
        return {
          success: false,
          files: [],
          debates: [],
          error: 'No valid AI models selected'
        }
      }

      const primaryModel = selectedModels[0]
      const architectPrompt = this.buildArchitecturePrompt(request)
      
      const architectResponse = await this.aiService.generateResponse(
        architectPrompt,
        primaryModel,
        {
          temperature: 0.3,
          maxTokens: 3000,
          systemPrompt: 'You are an expert software architect. Design a complete application architecture based on requirements.'
        }
      )

      if (!architectResponse.success) {
        return {
          success: false,
          files: [],
          debates: [],
          error: architectResponse.error
        }
      }

      debates.push({
        agentName: primaryModel.name,
        agentAvatar: this.getProviderEmoji(primaryModel.provider),
        agentColor: this.getProviderColor(primaryModel.provider),
        message: `I've designed the architecture. Let me generate the core components...`,
        timestamp: Date.now(),
        modelUsed: primaryModel.name
      })

      const frontendFile = await this.generateFrontendCode(request, primaryModel)
      if (frontendFile) files.push(frontendFile)

      if (selectedModels.length > 1) {
        const securityModel = selectedModels[1]
        debates.push({
          agentName: securityModel.name,
          agentAvatar: this.getProviderEmoji(securityModel.provider),
          agentColor: this.getProviderColor(securityModel.provider),
          message: `⚠️ Need to add input validation and security headers. Reviewing the code now...`,
          timestamp: Date.now(),
          modelUsed: securityModel.name
        })

        const securityFile = await this.generateSecurityLayer(request, securityModel)
        if (securityFile) files.push(securityFile)
      }

      const backendFile = await this.generateBackendCode(request, primaryModel)
      if (backendFile) files.push(backendFile)

      if (selectedModels.length > 2) {
        const uiModel = selectedModels[2]
        debates.push({
          agentName: uiModel.name,
          agentAvatar: this.getProviderEmoji(uiModel.provider),
          agentColor: this.getProviderColor(uiModel.provider),
          message: `The UI needs better responsive design and animations. Let me enhance it...`,
          timestamp: Date.now(),
          modelUsed: uiModel.name
        })
      }

      const deploymentUrl = this.generateDeploymentUrl(request.prompt)

      return {
        success: true,
        files,
        deploymentUrl,
        debates
      }

    } catch (error) {
      return {
        success: false,
        files: [],
        debates,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  private buildArchitecturePrompt(request: GenerationRequest): string {
    return `Design a ${request.frontend} frontend application with ${request.backend} backend for the following requirement:

${request.prompt}

Integrations needed: ${request.integrations.join(', ') || 'None'}

Provide a high-level architecture overview including:
1. Component structure
2. State management approach
3. API endpoints needed
4. Database schema (if applicable)
5. Key features to implement

Keep it concise and focused on implementation details.`
  }

  private async generateFrontendCode(
    request: GenerationRequest,
    model: AIModelConfig
  ): Promise<GeneratedFile | null> {
    const prompt = `Generate a production-ready ${request.frontend} component for: ${request.prompt}

Requirements:
- Modern, clean code with TypeScript
- Responsive design with Tailwind CSS
- Proper error handling
- Component-based architecture

Provide ONLY the main App component code, no explanations.`

    const response = await this.aiService.generateResponse(prompt, model, {
      temperature: 0.3,
      maxTokens: 2000,
      systemPrompt: 'You are an expert frontend developer. Generate clean, production-ready code.'
    })

    if (!response.success || !response.content) return null

    return {
      path: 'src/App.tsx',
      content: this.extractCodeFromResponse(response.content),
      language: 'typescript',
      description: 'Main application component'
    }
  }

  private async generateBackendCode(
    request: GenerationRequest,
    model: AIModelConfig
  ): Promise<GeneratedFile | null> {
    const prompt = `Generate a ${request.backend} backend API for: ${request.prompt}

Requirements:
- RESTful API design
- Proper error handling
- Input validation
- Modern best practices

Provide ONLY the main server/API code, no explanations.`

    const response = await this.aiService.generateResponse(prompt, model, {
      temperature: 0.3,
      maxTokens: 2000,
      systemPrompt: 'You are an expert backend developer. Generate clean, production-ready code.'
    })

    if (!response.success || !response.content) return null

    const extension = this.getBackendExtension(request.backend)

    return {
      path: `server/index.${extension}`,
      content: this.extractCodeFromResponse(response.content),
      language: request.backend,
      description: 'Main backend server'
    }
  }

  private async generateSecurityLayer(
    request: GenerationRequest,
    model: AIModelConfig
  ): Promise<GeneratedFile | null> {
    const prompt = `Generate security middleware for a ${request.backend} application:

Requirements:
- Input sanitization
- Rate limiting
- CORS configuration
- Authentication helpers
- Security headers

Provide ONLY the security middleware code.`

    const response = await this.aiService.generateResponse(prompt, model, {
      temperature: 0.2,
      maxTokens: 1500,
      systemPrompt: 'You are a security expert. Generate robust security middleware.'
    })

    if (!response.success || !response.content) return null

    const extension = this.getBackendExtension(request.backend)

    return {
      path: `server/middleware/security.${extension}`,
      content: this.extractCodeFromResponse(response.content),
      language: request.backend,
      description: 'Security middleware'
    }
  }

  private extractCodeFromResponse(response: string): string {
    const codeBlockRegex = /```(?:\w+)?\n([\s\S]*?)```/
    const match = response.match(codeBlockRegex)
    return match ? match[1].trim() : response.trim()
  }

  private getBackendExtension(backend: string): string {
    const extensions: Record<string, string> = {
      'node': 'js',
      'python': 'py',
      'go': 'go',
      'java': 'java',
      'rust': 'rs'
    }
    return extensions[backend] || 'js'
  }

  private generateDeploymentUrl(prompt: string): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    const random = Array.from({ length: 4 }, () => 
      chars[Math.floor(Math.random() * chars.length)]
    ).join('')
    const appName = prompt
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 12) || 'app'
    return `https://${appName}-${random}.apexforge.app`
  }

  private getProviderEmoji(provider: string): string {
    const emojis: Record<string, string> = {
      'openai': '🧠',
      'anthropic': '🛡️',
      'xai': '⚡',
      'google': '🎨',
      'meta': '🦙',
      'mistral': '🌪️',
      'cohere': '🎯',
      'huggingface': '🤗'
    }
    return emojis[provider] || '🤖'
  }

  private getProviderColor(provider: string): string {
    const colors: Record<string, string> = {
      'openai': 'text-green-400',
      'anthropic': 'text-orange-400',
      'xai': 'text-cyan-400',
      'google': 'text-purple-400',
      'meta': 'text-yellow-400',
      'mistral': 'text-blue-400',
      'cohere': 'text-pink-400',
      'huggingface': 'text-amber-400'
    }
    return colors[provider] || 'text-gray-400'
  }

  async generateDebates(
    request: GenerationRequest,
    selectedModels: AIModelConfig[]
  ): Promise<DebateMessage[]> {
    const debates: DebateMessage[] = []
    const debatePrompt = `Review this application idea and provide ONE specific technical concern or suggestion (max 100 words):

"${request.prompt}"

Tech stack: ${request.frontend} + ${request.backend}

Be opinionated and technical. Focus on ONE aspect: performance, security, UX, or architecture.`

    for (const model of selectedModels.slice(0, 5)) {
      try {
        const response = await this.aiService.generateDebateResponse(
          debatePrompt,
          model,
          this.getModelPersonality(model.provider)
        )

        if (response.success && response.content) {
          debates.push({
            agentName: model.name,
            agentAvatar: this.getProviderEmoji(model.provider),
            agentColor: this.getProviderColor(model.provider),
            message: response.content,
            timestamp: Date.now() + debates.length * 1000,
            modelUsed: model.name
          })
        }
      } catch (error) {
        console.error(`Failed to generate debate from ${model.name}:`, error)
      }

      await new Promise(resolve => setTimeout(resolve, 500))
    }

    return debates
  }

  private getModelPersonality(provider: string): string {
    const personalities: Record<string, string> = {
      'openai': 'Clean, organized, focused on best practices',
      'anthropic': 'Security-first, always thinking about vulnerabilities',
      'xai': 'Fast and edgy, prioritizes performance',
      'google': 'Beautiful UI/UX focused',
      'meta': 'Open source advocate',
      'mistral': 'Efficient and precise, European engineering',
      'cohere': 'Enterprise-focused, scalability minded',
      'huggingface': 'Community-driven, transparent'
    }
    return personalities[provider] || 'Helpful AI assistant'
  }
}

export async function createCodeGenerationService(
  apiKeys: StoredAPIKey[]
): Promise<CodeGenerationService> {
  return new CodeGenerationService(apiKeys)
}
