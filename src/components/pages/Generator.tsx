import { useState, useEffect } from 'react'
import { Sparkle, Download, Rocket, CheckCircle, X, Check, Fire, ThumbsUp, ThumbsDown, Lightning, Shield, Palette, TreeStructure, Swap, Globe, Copy, ArrowsClockwise, Brain, Code, Database, CaretDown, Gear, List } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Textarea } from '../ui/textarea'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { ScrollArea } from '../ui/scroll-area'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Input } from '../ui/input'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { CodeGenerationService, GeneratedFile } from '../../lib/codeGenerationService'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { IntegrationsPanel } from '../IntegrationsPanel'
import { INTEGRATIONS } from '../../lib/integrations'
import { PreviewFrame } from '../PreviewFrame'
import { CoinAnimation } from '../CoinAnimation'
import { useBlackForge } from '../../lib/BlackForgeContext'
import { APIKeyAlert } from '../APIKeyAlert'
import { KeysManager } from '../KeysManager'
import { AIModelSelector } from '../AIModelSelector'
import { AI_MODEL_CONFIGS } from '../../lib/aiService'
import { ApexForgeLogo } from '../ApexForgeLogo'
import { Footer } from '../Footer'

type Page = 'home' | 'dashboard' | 'pricing' | 'generator' | 'auth' | 'figma' | 'ceo-login' | 'ceo'

interface GeneratorProps {
  onNavigate: (page: Page) => void
}

interface AIAgent {
  id: string
  name: string
  avatar: string
  color: string
  personality: string
}

interface DebateMessage {
  agent: AIAgent
  message: string
  timestamp: number
  votes: { up: number; down: number }
  userVote: 'up' | 'down' | null
  flames: number
}

interface FusionVersion {
  id: 'fast' | 'secure' | 'beautiful'
  name: string
  icon: any
  color: string
  description: string
  features: string[]
}

const AI_AGENTS: AIAgent[] = [
  { id: 'gpt', name: 'GPT-4o', avatar: '🧠', color: 'text-primary', personality: 'Clean & Organized' },
  { id: 'claude', name: 'Claude 3.5', avatar: '🛡️', color: 'text-accent', personality: 'Security First' },
  { id: 'grok', name: 'Grok-2', avatar: '⚡', color: 'text-primary', personality: 'Fast & Edgy' },
  { id: 'gemini', name: 'Gemini 1.5', avatar: '🎨', color: 'text-accent', personality: 'Beautiful UI' },
  { id: 'llama', name: 'Llama 3.1', avatar: '🦙', color: 'text-primary', personality: 'Open Source' },
]

const FUSION_VERSIONS: FusionVersion[] = [
  {
    id: 'fast',
    name: 'Fastest',
    icon: Lightning,
    color: 'text-accent',
    description: 'Grok-optimized for maximum speed',
    features: ['WebSocket real-time', 'Edge computing', 'Lazy loading', 'Minimal dependencies']
  },
  {
    id: 'secure',
    name: 'Most Secure',
    icon: Shield,
    color: 'text-destructive',
    description: 'Claude-hardened security',
    features: ['Input sanitization', 'Rate limiting', 'CSRF protection', 'SQL injection prevention']
  },
  {
    id: 'beautiful',
    name: 'Most Beautiful',
    icon: Palette,
    color: 'text-primary',
    description: 'Gemini-designed UI/UX',
    features: ['Framer animations', 'Glassmorphism', 'Perfect spacing', 'Mobile-first responsive']
  }
]

export function Generator({ onNavigate }: GeneratorProps) {
  const { blackForgeMode } = useBlackForge()
  const [prompt, setPrompt] = useState('')
  const [userPrompt, setUserPrompt] = useState('')
  const [selectedAIs, setSelectedAIs] = useState<string[]>(['gpt', 'claude', 'grok'])
  const [selectedFrontend, setSelectedFrontend] = useState<string>('react')
  const [selectedBackend, setSelectedBackend] = useState<string>('node')
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState('')
  const [debates, setDebates] = useState<DebateMessage[]>([])
  const [generated, setGenerated] = useState(false)
  const [showFusion, setShowFusion] = useState(false)
  const [showIncubator, setShowIncubator] = useState(false)
  const [liveUrl, setLiveUrl] = useState('')
  const [credits, setCredits] = useKV<number>('user-credits', 15)
  const [projects, setProjects] = useKV<any[]>('user-projects', [])
  const [selectedFusion, setSelectedFusion] = useState<'fast' | 'secure' | 'beautiful'>('fast')
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
  const [userTier] = useKV<'free' | 'pro' | 'gold' | 'enterprise'>('user-tier', 'free')
  const [showIntegrations, setShowIntegrations] = useState(false)
  const [showCoinAnimation, setShowCoinAnimation] = useState(false)
  const [showKeysManager, setShowKeysManager] = useState(false)
  const [aiKeys] = useKV<any[]>('ceo-keys-ai', [])
  const [hasValidAIKeys, setHasValidAIKeys] = useState(false)
  const [availableProviders, setAvailableProviders] = useState<string[]>([])
  const [showModelSelector, setShowModelSelector] = useState(false)
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>(['gpt-4o', 'claude-3.5-sonnet', 'grok-2'])
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([])
  const [useRealGeneration, setUseRealGeneration] = useState(false)

  useEffect(() => {
    if (aiKeys && aiKeys.length > 0) {
      const validKeys = aiKeys.filter(k => k.key && k.key.length > 0 && k.status === 'valid')
      setHasValidAIKeys(validKeys.length > 0)
      setAvailableProviders(validKeys.map(k => k.id))
    } else {
      setHasValidAIKeys(false)
      setAvailableProviders([])
    }
  }, [aiKeys])

  const generateRandomUrl = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    const random = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    const appName = prompt.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10) || 'app'
    return `https://${appName}-${random}.apexforge.app`
  }

  const addDebateMessage = (agent: AIAgent, message: string, flames: number = 1) => {
    setDebates((current) => [
      ...current,
      {
        agent,
        message,
        timestamp: Date.now(),
        votes: { up: Math.floor(Math.random() * 5), down: Math.floor(Math.random() * 2) },
        userVote: null,
        flames
      }
    ])
  }

  const handleVote = (index: number, vote: 'up' | 'down') => {
    setDebates((current) =>
      current.map((d, i) => {
        if (i === index) {
          const newVotes = { ...d.votes }
          if (d.userVote === vote) {
            d.userVote === 'up' ? newVotes.up-- : newVotes.down--
            return { ...d, userVote: null, votes: newVotes }
          } else {
            if (d.userVote) {
              d.userVote === 'up' ? newVotes.up-- : newVotes.down--
            }
            vote === 'up' ? newVotes.up++ : newVotes.down++
            return { ...d, userVote: vote, votes: newVotes }
          }
        }
        return d
      })
    )
    toast.success(vote === 'up' ? 'Upvoted! 🔥' : 'Downvoted')
  }

  const simulateGeneration = async () => {
    if (!userPrompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    const fullPrompt = `${userPrompt.trim()} using ${frontendOptions.find(f => f.id === selectedFrontend)?.name} frontend and ${backendOptions.find(b => b.id === selectedBackend)?.name} backend`
    
    if (selectedIntegrations.length > 0) {
      const integrationNames = INTEGRATIONS
        .filter(int => selectedIntegrations.includes(int.id))
        .map(int => int.name)
        .join(', ')
      toast.info(`Building with integrations: ${integrationNames}`, { duration: 3000 })
    }
    
    setPrompt(fullPrompt)
    setGenerating(true)
    setProgress(0)
    setDebates([])
    setGenerated(false)
    setShowFusion(false)
    setLiveUrl('')
    setGeneratedFiles([])

    if (useRealGeneration && hasValidAIKeys && aiKeys && aiKeys.length > 0) {
      await performRealGeneration(fullPrompt)
    } else {
      await performSimulatedGeneration()
    }
  }

  const performRealGeneration = async (fullPrompt: string) => {
    try {
      const stages = [
        { text: 'Initializing AI models...', duration: 800 },
        { text: 'AI agents analyzing requirements...', duration: 1000 },
        { text: 'Live debate & code generation...', duration: 0 },
        { text: 'Generating frontend components...', duration: 0 },
        { text: 'Building backend services...', duration: 0 },
        { text: 'Optimizing & deploying...', duration: 1200 },
        { text: 'LIVE! ✨', duration: 500 },
      ]

      setCurrentStage(stages[0].text)
      setProgress(10)
      await new Promise((resolve) => setTimeout(resolve, stages[0].duration))

      setCurrentStage(stages[1].text)
      setProgress(20)
      await new Promise((resolve) => setTimeout(resolve, stages[1].duration))

      const { CodeGenerationService } = await import('../../lib/codeGenerationService')
      const codeGenService = new CodeGenerationService(aiKeys || [])

      setCurrentStage(stages[2].text)
      setProgress(30)

      const selectedModels = AI_MODEL_CONFIGS.filter(m => 
        selectedModelIds.includes(m.id)
      )

      const realDebates = await codeGenService.generateDebates(
        {
          prompt: fullPrompt,
          frontend: selectedFrontend,
          backend: selectedBackend,
          integrations: selectedIntegrations,
          selectedModelIds
        },
        selectedModels
      )

      for (const debate of realDebates) {
        setDebates((current) => [...current, {
          agent: {
            id: debate.modelUsed,
            name: debate.agentName,
            avatar: debate.agentAvatar,
            color: debate.agentColor,
            personality: debate.agentName
          },
          message: debate.message,
          timestamp: debate.timestamp,
          votes: { up: Math.floor(Math.random() * 3), down: Math.floor(Math.random() * 2) },
          userVote: null,
          flames: 2
        }])
        await new Promise((resolve) => setTimeout(resolve, 1500))
      }

      setCurrentStage(stages[3].text)
      setProgress(60)

      const result = await codeGenService.generateApplication({
        prompt: fullPrompt,
        frontend: selectedFrontend,
        backend: selectedBackend,
        integrations: selectedIntegrations,
        selectedModelIds
      })

      if (result.success) {
        setGeneratedFiles(result.files)
        
        setCurrentStage(stages[4].text)
        setProgress(80)
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setCurrentStage(stages[5].text)
        setProgress(90)
        await new Promise((resolve) => setTimeout(resolve, stages[5].duration))

        const url = result.deploymentUrl || generateRandomUrl()
        setLiveUrl(url)
        
        setProjects((current) => [
          {
            id: Date.now(),
            name: fullPrompt.substring(0, 50),
            prompt: fullPrompt,
            url,
            integrations: selectedIntegrations,
            files: result.files,
            createdAt: new Date().toISOString(),
          },
          ...(current ?? []),
        ])

        setCurrentStage(stages[6].text)
        setProgress(100)
        
        setGenerated(true)
        setShowFusion(true)
        toast.success('App generated with real AI! 🚀')
      } else {
        throw new Error(result.error || 'Generation failed')
      }
    } catch (error) {
      console.error('Real generation error:', error)
      toast.error('Real generation failed, using simulated mode')
      await performSimulatedGeneration()
    } finally {
      setGenerating(false)
    }
  }

  const performSimulatedGeneration = async () => {
    const stages = [
      { text: 'Analyzing prompt...', duration: 800 },
      { text: 'AI agents joining The Forge...', duration: 1000 },
      { text: 'Live debate starting...', duration: 4000 },
      { text: 'Generating code...', duration: 1500 },
      { text: 'Deploying to production...', duration: 1200 },
      { text: 'Securing domain...', duration: 800 },
      { text: 'LIVE! ✨', duration: 500 },
    ]

    for (let i = 0; i < stages.length; i++) {
      setCurrentStage(stages[i].text)
      setProgress(((i + 1) / stages.length) * 100)

      if (i === 2) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        addDebateMessage(AI_AGENTS[2], "This auth flow is over-engineered. Use NextAuth + Clerk instead.", 2)
        
        await new Promise((resolve) => setTimeout(resolve, 1200))
        addDebateMessage(AI_AGENTS[1], "⚠️ Security risk: add rate limiting + input sanitization.", 3)
        
        await new Promise((resolve) => setTimeout(resolve, 1000))
        addDebateMessage(AI_AGENTS[3], "Mobile UX is weak. Switch to React Native elements for touch.", 2)
        
        await new Promise((resolve) => setTimeout(resolve, 800))
        addDebateMessage(AI_AGENTS[0], "Let's use TypeScript strict mode and add proper error boundaries.", 1)
        
        await new Promise((resolve) => setTimeout(resolve, 700))
        addDebateMessage(AI_AGENTS[4], "Open source alternative: Replace with Supabase Auth (free tier).", 2)
        
        await new Promise((resolve) => setTimeout(resolve, 800))
      } else {
        await new Promise((resolve) => setTimeout(resolve, stages[i].duration))
      }
    }

    const url = generateRandomUrl()
    setLiveUrl(url)
    setProjects((current) => [
      {
        id: Date.now(),
        name: prompt.substring(0, 50),
        prompt,
        url,
        integrations: selectedIntegrations,
        createdAt: new Date().toISOString(),
      },
      ...(current ?? []),
    ])

    setGenerated(true)
    setGenerating(false)
    setShowFusion(true)
    toast.success('App is LIVE! 🚀')
  }

  const startIncubator = () => {
    setShowIncubator(true)
    toast.success('Generating 5 FREE app ideas...', { duration: 2000 })
  }

  const copyLink = () => {
    navigator.clipboard.writeText(liveUrl)
    toast.success('Link copied! Share it on X 🔥')
  }

  const toggleAI = (aiId: string) => {
    setSelectedAIs((current) => {
      if (current.includes(aiId)) {
        if (current.length === 1) {
          toast.error('Select at least one AI')
          return current
        }
        return current.filter(id => id !== aiId)
      } else {
        return [...current, aiId]
      }
    })
  }

  const toggleModel = (modelId: string) => {
    setSelectedModelIds((current) => {
      if (current.includes(modelId)) {
        if (current.length === 1) {
          toast.error('Select at least one model')
          return current
        }
        return current.filter(id => id !== modelId)
      } else {
        return [...current, modelId]
      }
    })
  }

  const getSelectedModelsDisplay = () => {
    if (selectedModelIds.length === 0) return 'No models selected'
    if (selectedModelIds.length <= 2) {
      return selectedModelIds
        .map(id => AI_MODEL_CONFIGS.find(m => m.id === id)?.name)
        .filter(Boolean)
        .join(', ')
    }
    return `${selectedModelIds.length} models selected`
  }

  const toggleIntegration = (integrationId: string) => {
    setSelectedIntegrations((current) => {
      if (current.includes(integrationId)) {
        return current.filter(id => id !== integrationId)
      } else {
        return [...current, integrationId]
      }
    })
  }

  const calculateTotalCredits = (): number => {
    const baseCredits = 2
    const integrationCredits = INTEGRATIONS
      .filter(int => selectedIntegrations.includes(int.id))
      .reduce((sum, int) => sum + int.credits, 0)
    return baseCredits + integrationCredits
  }

  const frontendOptions = [
    { id: 'react', name: 'React', icon: '⚛️' },
    { id: 'vue', name: 'Vue', icon: '💚' },
    { id: 'angular', name: 'Angular', icon: '🅰️' },
    { id: 'svelte', name: 'Svelte', icon: '🧡' },
    { id: 'next', name: 'Next.js', icon: '▲' },
  ]

  const backendOptions = [
    { id: 'node', name: 'Node.js', icon: '🟢' },
    { id: 'python', name: 'Python', icon: '🐍' },
    { id: 'go', name: 'Go', icon: '🔷' },
    { id: 'java', name: 'Java', icon: '☕' },
    { id: 'rust', name: 'Rust', icon: '🦀' },
  ]

  return (
    <div className="w-full min-h-screen px-3 sm:px-4 py-4 sm:py-6 lg:py-8 max-w-[1800px] mx-auto relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-30">
        <ApexForgeLogo 
          opacity={0.015}
          className={`w-[900px] h-[900px] ${
            blackForgeMode ? 'text-foreground' : 'text-foreground'
          }`}
        />
      </div>
      
      {showCoinAnimation && <CoinAnimation />}
      
      <div className="mb-4 sm:mb-6 lg:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 relative z-10">
        <div>
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3 ${
            blackForgeMode ? 'text-destructive' : ''
          } transition-colors duration-500`}>
            <Fire weight="fill" className="text-destructive animate-pulse-glow w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9" />
            {blackForgeMode ? '🔥 Dark Forge' : 'The Forge'}
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm lg:text-base">
            {blackForgeMode 
              ? 'Watch demonic AI agents forge your app in shadows' 
              : 'Watch 5 AI agents argue, debate, and ship your app live in <10 seconds'
            }
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Badge className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm lg:text-base bg-accent/20 border-accent text-accent">
            {credits ?? 15} credits
          </Badge>
          <Button
            variant="outline"
            size="lg"
            onClick={startIncubator}
            className="border-accent/50 text-accent hover:bg-accent/10 glow-accent text-xs sm:text-sm flex-1 sm:flex-none h-9 sm:h-10 lg:h-11"
          >
            <TreeStructure weight="fill" className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">FREE Idea Incubator</span>
            <span className="sm:hidden">Ideas</span>
          </Button>
        </div>
      </div>



      {showKeysManager && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6"
        >
          <KeysManager />
          <div className="mt-3 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowKeysManager(false)}
            >
              Close Keys Manager
            </Button>
          </div>
        </motion.div>
      )}

      {hasValidAIKeys && (
        <div className="mb-4">
          <APIKeyAlert 
            onSetupKeys={() => setShowKeysManager(true)} 
            feature="AI generation"
            variant="compact"
          />
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_400px] gap-4 sm:gap-6">
        <div className="space-y-4 sm:space-y-6">
          <Card className={`p-4 sm:p-5 lg:p-6 ${
            blackForgeMode 
              ? 'border-destructive/30 glow-destructive bg-destructive/5' 
              : 'border-primary/30 glow-primary'
          } transition-all duration-500`}>
            <Label className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 block flex items-center gap-2">
              <Brain weight="fill" className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
              Quick Prompt
            </Label>
            <Input
              placeholder="Type your app idea here (e.g., 'fitness tracker with AI coaching')..."
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="mb-3 sm:mb-4 bg-background text-sm sm:text-base lg:text-lg border-border focus:border-primary h-12 sm:h-13 lg:h-14"
              disabled={generating}
            />

            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div>
                <Label className="text-[10px] sm:text-xs font-medium mb-1.5 sm:mb-2 flex items-center gap-1 sm:gap-2">
                  <Sparkle weight="fill" className="text-primary w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="truncate">AI Models</span>
                </Label>
                <Button
                  variant="outline"
                  className="w-full justify-between h-8 sm:h-9 lg:h-10 text-[10px] sm:text-xs px-2 sm:px-3"
                  disabled={generating}
                  onClick={() => setShowModelSelector(!showModelSelector)}
                >
                  <span className="truncate">
                    {selectedModelIds.length} selected
                  </span>
                  <List className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                </Button>
              </div>

              <div>
                <Label className="text-[10px] sm:text-xs font-medium mb-1.5 sm:mb-2 flex items-center gap-1 sm:gap-2">
                  <Code weight="fill" className="text-primary w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="truncate">Frontend</span>
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between h-8 sm:h-9 lg:h-10 text-[10px] sm:text-xs px-2 sm:px-3"
                      disabled={generating}
                    >
                      <span className="flex items-center gap-1 truncate">
                        <span>{frontendOptions.find(f => f.id === selectedFrontend)?.icon}</span>
                        <span className="hidden sm:inline">{frontendOptions.find(f => f.id === selectedFrontend)?.name}</span>
                      </span>
                      <CaretDown className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuLabel>Select Frontend</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {frontendOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.id}
                        onClick={() => setSelectedFrontend(option.id)}
                      >
                        <span className="mr-2">{option.icon}</span>
                        {option.name}
                        {selectedFrontend === option.id && (
                          <Check size={16} className="ml-auto text-primary" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <Label className="text-[10px] sm:text-xs font-medium mb-1.5 sm:mb-2 flex items-center gap-1 sm:gap-2">
                  <Database weight="fill" className="text-accent w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="truncate">Backend</span>
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between h-8 sm:h-9 lg:h-10 text-[10px] sm:text-xs px-2 sm:px-3"
                      disabled={generating}
                    >
                      <span className="flex items-center gap-1 truncate">
                        <span>{backendOptions.find(b => b.id === selectedBackend)?.icon}</span>
                        <span className="hidden sm:inline">{backendOptions.find(b => b.id === selectedBackend)?.name}</span>
                      </span>
                      <CaretDown className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuLabel>Select Backend</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {backendOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.id}
                        onClick={() => setSelectedBackend(option.id)}
                      >
                        <span className="mr-2">{option.icon}</span>
                        {option.name}
                        {selectedBackend === option.id && (
                          <Check size={16} className="ml-auto text-primary" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <Separator className="my-4 sm:my-6" />

            {showModelSelector && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4"
              >
                <AIModelSelector
                  selectedModels={selectedModelIds}
                  onToggleModel={toggleModel}
                  availableProviders={availableProviders}
                />
              </motion.div>
            )}

            {selectedModelIds.length > 0 && (
              <div className="mb-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                <p className="text-xs sm:text-sm font-medium mb-2">Selected Models:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedModelIds.slice(0, 5).map(id => {
                    const model = AI_MODEL_CONFIGS.find(m => m.id === id)
                    if (!model) return null
                    return (
                      <Badge key={id} variant="outline" className="border-primary/50 text-xs">
                        {model.name}
                      </Badge>
                    )
                  })}
                  {selectedModelIds.length > 5 && (
                    <Badge variant="outline" className="border-primary/50 text-xs">
                      +{selectedModelIds.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <Separator className="my-4 sm:my-6" />

            <div className="flex items-center justify-between mb-4">
              <Label className="text-sm sm:text-base font-semibold flex items-center gap-2">
                <Gear weight="fill" className="text-primary w-4 h-4 sm:w-5 sm:h-5" />
                Integrations ({selectedIntegrations.length}/11)
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowIntegrations(!showIntegrations)}
                className="text-xs sm:text-sm"
              >
                <Gear size={14} />
                {showIntegrations ? 'Hide' : 'Configure'}
              </Button>
            </div>

            {showIntegrations && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4"
              >
                <IntegrationsPanel
                  selectedIntegrations={selectedIntegrations}
                  onToggleIntegration={toggleIntegration}
                  userTier={userTier ?? 'free'}
                  onUpgrade={() => onNavigate('pricing')}
                />
              </motion.div>
            )}

            {selectedIntegrations.length > 0 && (
              <div className="mb-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                <p className="text-xs sm:text-sm font-medium mb-2">Active Integrations:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedIntegrations.map(id => {
                    const integration = INTEGRATIONS.find(int => int.id === id)
                    if (!integration) return null
                    const Icon = integration.icon
                    return (
                      <Badge key={id} variant="outline" className="border-primary/50 text-xs">
                        <Icon className={integration.color} size={12} />
                        {integration.name}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}

            {hasValidAIKeys && (
              <div className="mb-4 p-3 bg-accent/10 border border-accent/30 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-accent">🤖 Real AI Generation</p>
                  <p className="text-xs text-muted-foreground">Use your API keys for actual code generation</p>
                </div>
                <Button
                  variant={useRealGeneration ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUseRealGeneration(!useRealGeneration)}
                  className="flex-shrink-0"
                >
                  {useRealGeneration ? '✓ Enabled' : 'Enable'}
                </Button>
              </div>
            )}

            <Button
              size="lg"
              onClick={simulateGeneration}
              disabled={generating || !userPrompt.trim()}
              className="w-full text-base sm:text-lg lg:text-xl py-4 sm:py-5 lg:py-6 glow-primary hover:scale-[1.02] transition-transform"
            >
              {generating ? (
                <>
                  <Fire weight="fill" className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse-glow" />
                  <span className="hidden sm:inline">Forging... {Math.round(progress)}%</span>
                  <span className="sm:hidden">{Math.round(progress)}%</span>
                </>
              ) : (
                <>
                  <Fire weight="fill" className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="hidden sm:inline">Ignite The Forge ({calculateTotalCredits()} credits)</span>
                  <span className="sm:hidden">Forge ({calculateTotalCredits()})</span>
                </>
              )}
            </Button>
          </Card>

          {generating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-4 sm:p-5 lg:p-6 border-accent/30">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm sm:text-base lg:text-lg flex items-center gap-2">
                      <Lightning weight="fill" className="text-accent animate-pulse-glow w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="truncate">{currentStage}</span>
                    </span>
                    <span className="text-accent font-bold text-sm sm:text-base lg:text-lg">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2 sm:h-3" />
                </div>
              </Card>
            </motion.div>
          )}

          {generated && liveUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-4 sm:p-5 lg:p-6 border-accent/30 glow-accent">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <CheckCircle weight="fill" className="text-accent w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold">It's LIVE! 🚀</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">Your app is deployed and running</p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto">
                    <Globe weight="fill" className="text-accent w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <code className="text-accent font-mono text-xs sm:text-sm truncate">{liveUrl}</code>
                  </div>
                  <Button size="sm" variant="outline" onClick={copyLink} className="w-full sm:w-auto">
                    <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Copy
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <Button className="flex-1 py-4 sm:py-5 lg:py-6 text-sm sm:text-base lg:text-lg" onClick={() => window.open(liveUrl, '_blank')}>
                    <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
                    Open Live App
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 py-4 sm:py-5 lg:py-6 text-sm sm:text-base lg:text-lg"
                    onClick={() => {
                      if (generatedFiles.length > 0) {
                        const filesJson = JSON.stringify(generatedFiles, null, 2)
                        const blob = new Blob([filesJson], { type: 'application/json' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = 'generated-code.json'
                        a.click()
                        URL.revokeObjectURL(url)
                        toast.success('Code files downloaded!')
                      } else {
                        toast.info('Coming Soon', {
                          description: 'Code export feature is under development',
                          duration: 2000,
                        })
                      }
                    }}
                  >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                    Download Code
                  </Button>
                </div>

                {generatedFiles.length > 0 && (
                  <div className="mb-4 sm:mb-6">
                    <h4 className="font-semibold text-base sm:text-lg mb-3">Generated Files ({generatedFiles.length})</h4>
                    <ScrollArea className="h-[300px] border border-border rounded-lg">
                      <div className="p-3 space-y-2">
                        {generatedFiles.map((file, idx) => (
                          <Card key={idx} className="p-3 bg-card/50">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <code className="text-xs sm:text-sm font-mono text-accent">{file.path}</code>
                                <p className="text-xs text-muted-foreground mt-1">{file.description}</p>
                              </div>
                              <Badge variant="outline" className="text-xs">{file.language}</Badge>
                            </div>
                            <div className="bg-background rounded p-2 overflow-x-auto">
                              <pre className="text-[10px] sm:text-xs font-mono text-foreground/80 whitespace-pre-wrap break-words">
                                {file.content.substring(0, 300)}
                                {file.content.length > 300 && '...'}
                              </pre>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                <Separator className="my-4 sm:my-6" />

                <div className="space-y-2 sm:space-y-3">
                  <h4 className="font-semibold text-base sm:text-lg">Want to upgrade this app?</h4>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 border-primary/50 text-primary hover:bg-primary/10 text-xs sm:text-sm py-3 sm:py-4"
                      onClick={() => {
                        toast.info('Coming Soon', {
                          description: 'Evolve feature is under development',
                          duration: 2000,
                        })
                      }}
                    >
                      <ArrowsClockwise weight="fill" className="w-4 h-4" />
                      Evolve This App
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10 text-xs sm:text-sm py-3 sm:py-4"
                      onClick={() => onNavigate('pricing')}
                    >
                      <Shield weight="fill" className="w-4 h-4" />
                      <span className="hidden sm:inline">Add $500 Security Shield</span>
                      <span className="sm:hidden">Security $500</span>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {showFusion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-4 sm:p-5 lg:p-6 border-primary/30">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <Swap weight="fill" className="text-primary w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold">Fusion Mode</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">Pick your favorite version or mix & match</p>
                  </div>
                </div>

                <Tabs value={selectedFusion} onValueChange={(v) => setSelectedFusion(v as any)}>
                  <TabsList className="grid grid-cols-3 w-full mb-4 sm:mb-6">
                    {FUSION_VERSIONS.map((version) => (
                      <TabsTrigger key={version.id} value={version.id} className="text-xs sm:text-sm lg:text-base gap-1 sm:gap-2">
                        <version.icon weight="fill" className={`${version.color} w-3.5 h-3.5 sm:w-4 sm:h-4`} />
                        <span className="hidden sm:inline">{version.name}</span>
                        <span className="sm:hidden">{version.name.split(' ')[1]}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {FUSION_VERSIONS.map((version) => (
                    <TabsContent key={version.id} value={version.id} className="space-y-3 sm:space-y-4">
                      <div className="bg-card border border-border rounded-lg p-3 sm:p-4">
                        <h4 className="font-semibold mb-2 text-sm sm:text-base">{version.description}</h4>
                        <ul className="space-y-1.5 sm:space-y-2">
                          {version.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                              <Check className={`${version.color} w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0`} />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        className="w-full py-4 sm:py-5 lg:py-6 text-sm sm:text-base lg:text-lg glow-primary"
                        onClick={() => {
                          toast.success('Applied!', {
                            description: `Switched to ${version.name} version`,
                            duration: 2000,
                          })
                        }}
                      >
                        <Swap weight="fill" className="w-4 h-4 sm:w-5 sm:h-5" />
                        Use This Version
                      </Button>
                    </TabsContent>
                  ))}
                </Tabs>

                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-border">
                  <p className="text-xs sm:text-sm text-muted-foreground text-center">
                    💡 Pro tip: Click the flame icons to see what AIs argued about →
                  </p>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card className="p-4 sm:p-5 lg:p-6 border-destructive/30 glow-destructive">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold flex items-center gap-2">
                <Fire weight="fill" className="text-destructive animate-pulse-glow w-5 h-5 sm:w-6 sm:h-6" />
                Live Debate
              </h3>
              {generating && (
                <Badge className="bg-destructive/20 border-destructive text-destructive text-xs sm:text-sm">
                  🔴 LIVE
                </Badge>
              )}
            </div>

            {!generating && debates.length === 0 && (
              <div className="text-center py-8 sm:py-12 text-muted-foreground">
                <Fire className="mx-auto mb-2 sm:mb-3 opacity-30 w-10 h-10 sm:w-12 sm:h-12" weight="thin" />
                <p className="text-xs sm:text-sm">AI agents will appear here during generation</p>
                <p className="text-[10px] sm:text-xs mt-2 opacity-70">Watch them argue in real-time 🍿</p>
              </div>
            )}

            <ScrollArea className="h-[400px] sm:h-[500px] lg:h-[600px] pr-2 sm:pr-4">
              <AnimatePresence>
                <div className="space-y-2 sm:space-y-3">
                  {debates.map((debate, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="p-3 sm:p-4 border-border bg-card/50 hover:border-primary/30 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="text-base sm:text-lg lg:text-xl">{debate.agent.avatar}</span>
                            <div>
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <span className={`font-semibold text-xs sm:text-sm ${debate.agent.color}`}>
                                  {debate.agent.name}
                                </span>
                                {debate.flames > 1 && (
                                  <div className="flex">
                                    {Array.from({ length: debate.flames }).map((_, i) => (
                                      <Fire key={i} weight="fill" className="text-destructive w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                    ))}
                                  </div>
                                )}
                              </div>
                              <span className="text-[10px] sm:text-xs text-muted-foreground">{debate.agent.personality}</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-xs sm:text-sm mb-2 sm:mb-3 leading-relaxed">{debate.message}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1.5 sm:gap-2">
                            <Button
                              size="sm"
                              variant={debate.userVote === 'up' ? 'default' : 'outline'}
                              onClick={() => handleVote(index, 'up')}
                              className="h-6 sm:h-7 px-2 sm:px-3"
                            >
                              <ThumbsUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" weight={debate.userVote === 'up' ? 'fill' : 'regular'} />
                              <span className="text-[10px] sm:text-xs">{debate.votes.up}</span>
                            </Button>
                            <Button
                              size="sm"
                              variant={debate.userVote === 'down' ? 'secondary' : 'outline'}
                              onClick={() => handleVote(index, 'down')}
                              className="h-6 sm:h-7 px-2 sm:px-3"
                            >
                              <ThumbsDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" weight={debate.userVote === 'down' ? 'fill' : 'regular'} />
                              <span className="text-[10px] sm:text-xs">{debate.votes.down}</span>
                            </Button>
                          </div>
                          {debate.votes.up > debate.votes.down && (
                            <Badge className="bg-accent/20 text-accent border-accent/40 text-[10px] sm:text-xs">
                              ✓ Applied
                            </Badge>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            </ScrollArea>
          </Card>
        </div>
      </div>

      {showIncubator && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 sm:mt-6 lg:mt-8"
        >
          <Card className="p-4 sm:p-6 lg:p-8 border-accent/30 glow-accent">
            <div className="text-center mb-6 sm:mb-8">
              <TreeStructure weight="fill" className="mx-auto mb-3 sm:mb-4 text-accent w-10 h-10 sm:w-12 sm:h-12" />
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">Idea Incubator</h2>
              <p className="text-muted-foreground text-sm sm:text-base">5 AI-validated app ideas generated for FREE</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {['Social Fitness Tracker', 'AI Recipe Generator', 'Local Event Finder', 'Habit Streak Gamifier', 'Micro SaaS Dashboard'].map((idea, idx) => (
                <Card key={idx} className="p-3 sm:p-4 border-primary/20 hover:border-primary/50 cursor-pointer transition-colors">
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">{idea}</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                    Click to auto-fill generator with full tech stack & features
                  </p>
                  <Button size="sm" variant="outline" className="w-full text-xs sm:text-sm" onClick={() => {
                    setUserPrompt(`Build a ${idea} with user auth, real-time features, and mobile-first design`)
                    setShowIncubator(false)
                    toast.success('Prompt filled! Ready to forge 🔥')
                  }}>
                    Use This Idea
                  </Button>
                </Card>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {(generated || generating) && (
        <PreviewFrame
          url={liveUrl || 'https://example.com'}
          debates={debates}
          isGenerating={generating}
        />
      )}

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
