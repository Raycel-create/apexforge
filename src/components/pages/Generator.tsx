import { useState, useEffect } from 'react'
import { Sparkle, Download, Rocket, CheckCircle, X, Check, Fire, ThumbsUp, ThumbsDown, Lightning, Shield, Palette, TreeStructure, Swap, Globe, Copy, ArrowsClockwise, Brain, Code, Database } from '@phosphor-icons/react'
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

type Page = 'home' | 'dashboard' | 'pricing' | 'ceo' | 'generator'

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
  { id: 'gpt', name: 'GPT-4o', avatar: '🧠', color: 'text-green-400', personality: 'Clean & Organized' },
  { id: 'claude', name: 'Claude 3.5', avatar: '🛡️', color: 'text-orange-400', personality: 'Security First' },
  { id: 'grok', name: 'Grok-2', avatar: '⚡', color: 'text-cyan-400', personality: 'Fast & Edgy' },
  { id: 'gemini', name: 'Gemini 1.5', avatar: '🎨', color: 'text-purple-400', personality: 'Beautiful UI' },
  { id: 'llama', name: 'Llama 3.1', avatar: '🦙', color: 'text-yellow-400', personality: 'Open Source' },
]

const FUSION_VERSIONS: FusionVersion[] = [
  {
    id: 'fast',
    name: 'Fastest',
    icon: Lightning,
    color: 'text-cyan-400',
    description: 'Grok-optimized for maximum speed',
    features: ['WebSocket real-time', 'Edge computing', 'Lazy loading', 'Minimal dependencies']
  },
  {
    id: 'secure',
    name: 'Most Secure',
    icon: Shield,
    color: 'text-orange-400',
    description: 'Claude-hardened security',
    features: ['Input sanitization', 'Rate limiting', 'CSRF protection', 'SQL injection prevention']
  },
  {
    id: 'beautiful',
    name: 'Most Beautiful',
    icon: Palette,
    color: 'text-purple-400',
    description: 'Gemini-designed UI/UX',
    features: ['Framer animations', 'Glassmorphism', 'Perfect spacing', 'Mobile-first responsive']
  }
]

export function Generator({ onNavigate }: GeneratorProps) {
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
  const [credits, setCredits] = useKV<number>('user-credits', 5)
  const [projects, setProjects] = useKV<any[]>('user-projects', [])
  const [selectedFusion, setSelectedFusion] = useState<'fast' | 'secure' | 'beautiful'>('fast')

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
    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    if ((credits ?? 0) <= 0) {
      toast.error('Out of credits! Upgrade to continue.')
      onNavigate('pricing')
      return
    }

    setGenerating(true)
    setProgress(0)
    setDebates([])
    setGenerated(false)
    setShowFusion(false)
    setLiveUrl('')

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
    setCredits((current) => Math.max(0, (current ?? 5) - 1))
    setProjects((current) => [
      {
        id: Date.now(),
        name: prompt.substring(0, 50),
        prompt,
        url,
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
    <div className="container mx-auto px-4 py-8 max-w-[1800px]">
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Fire weight="fill" className="text-destructive animate-pulse-glow" size={36} />
            The Forge
          </h1>
          <p className="text-muted-foreground">
            Watch 5 AI agents argue, debate, and ship your app live in &lt;10 seconds
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="px-4 py-2 text-base bg-accent/20 border-accent text-accent">
            {credits} credits left
          </Badge>
          <Button
            variant="outline"
            size="lg"
            onClick={startIncubator}
            className="border-accent/50 text-accent hover:bg-accent/10 glow-accent"
          >
            <TreeStructure weight="fill" size={20} />
            FREE Idea Incubator
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        <div className="space-y-6">
          <Card className="p-6 border-accent/30 bg-card/50">
            <Label className="text-lg font-semibold mb-3 block flex items-center gap-2">
              <Brain weight="fill" className="text-accent" size={20} />
              Quick Prompt
            </Label>
            <Input
              placeholder="Type your app idea here (e.g., 'fitness tracker with AI coaching')..."
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="mb-4 bg-background text-base border-border focus:border-accent h-12"
              disabled={generating}
            />

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Sparkle weight="fill" className="text-primary" size={16} />
                  Select AI Models
                </Label>
                <div className="flex flex-wrap gap-2">
                  {AI_AGENTS.map((agent) => (
                    <Button
                      key={agent.id}
                      size="sm"
                      variant={selectedAIs.includes(agent.id) ? 'default' : 'outline'}
                      onClick={() => toggleAI(agent.id)}
                      disabled={generating}
                      className="h-8 text-xs"
                    >
                      <span className="mr-1">{agent.avatar}</span>
                      {agent.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Code weight="fill" className="text-cyan-400" size={16} />
                  Frontend
                </Label>
                <div className="flex flex-wrap gap-2">
                  {frontendOptions.map((option) => (
                    <Button
                      key={option.id}
                      size="sm"
                      variant={selectedFrontend === option.id ? 'default' : 'outline'}
                      onClick={() => setSelectedFrontend(option.id)}
                      disabled={generating}
                      className="h-8 text-xs"
                    >
                      <span className="mr-1">{option.icon}</span>
                      {option.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Database weight="fill" className="text-green-400" size={16} />
                  Backend
                </Label>
                <div className="flex flex-wrap gap-2">
                  {backendOptions.map((option) => (
                    <Button
                      key={option.id}
                      size="sm"
                      variant={selectedBackend === option.id ? 'default' : 'outline'}
                      onClick={() => setSelectedBackend(option.id)}
                      disabled={generating}
                      className="h-8 text-xs"
                    >
                      <span className="mr-1">{option.icon}</span>
                      {option.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              className="w-full mt-4 border-accent/50 text-accent hover:bg-accent/10"
              onClick={() => {
                if (userPrompt.trim()) {
                  const fullPrompt = `${userPrompt.trim()} using ${frontendOptions.find(f => f.id === selectedFrontend)?.name} frontend and ${backendOptions.find(b => b.id === selectedBackend)?.name} backend, with AI models: ${selectedAIs.map(id => AI_AGENTS.find(a => a.id === id)?.name).join(', ')}`
                  setPrompt(fullPrompt)
                  toast.success('Configuration applied to prompt!')
                } else {
                  toast.error('Please enter a prompt first')
                }
              }}
              disabled={generating}
            >
              Apply Configuration →
            </Button>
          </Card>

          <Card className="p-6 border-primary/30 glow-primary">
            <Label className="text-xl font-bold mb-4 block flex items-center gap-2">
              <Sparkle weight="fill" className="text-primary" size={24} />
              Describe Your App
            </Label>
            <Textarea
              placeholder="E.g., Build a social fitness app where users can challenge friends to workout competitions with AI-powered form checking..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              className="mb-4 bg-background text-lg border-border focus:border-primary"
              disabled={generating}
            />

            <Button
              size="lg"
              onClick={simulateGeneration}
              disabled={generating || !prompt.trim()}
              className="w-full text-xl py-6 glow-primary hover:scale-[1.02] transition-transform"
            >
              {generating ? (
                <>
                  <Fire weight="fill" size={24} className="animate-pulse-glow" />
                  Forging... {Math.round(progress)}%
                </>
              ) : (
                <>
                  <Fire weight="fill" size={24} />
                  Ignite The Forge ({credits} credits)
                </>
              )}
            </Button>
          </Card>

          {generating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 border-accent/30">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg flex items-center gap-2">
                      <Lightning weight="fill" className="text-accent animate-pulse-glow" size={20} />
                      {currentStage}
                    </span>
                    <span className="text-accent font-bold text-lg">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
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
              <Card className="p-6 border-accent/30 glow-accent">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle weight="fill" className="text-accent" size={40} />
                  <div>
                    <h3 className="text-2xl font-bold">It's LIVE! 🚀</h3>
                    <p className="text-muted-foreground">Your app is deployed and running</p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-4 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe weight="fill" className="text-accent" size={20} />
                    <code className="text-accent font-mono">{liveUrl}</code>
                  </div>
                  <Button size="sm" variant="outline" onClick={copyLink}>
                    <Copy size={16} />
                    Copy
                  </Button>
                </div>

                <div className="flex gap-3 mb-6">
                  <Button className="flex-1 py-6 text-lg" onClick={() => window.open(liveUrl, '_blank')}>
                    <Rocket size={20} />
                    Open Live App
                  </Button>
                  <Button variant="outline" className="flex-1 py-6 text-lg" onClick={() => toast.success('Downloading ZIP...')}>
                    <Download size={20} />
                    Download Code
                  </Button>
                </div>

                <Separator className="my-6" />

                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Want to upgrade this app?</h4>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 border-primary/50 text-primary hover:bg-primary/10">
                      <ArrowsClockwise weight="fill" size={18} />
                      Evolve This App
                    </Button>
                    <Button variant="outline" className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10">
                      <Shield weight="fill" size={18} />
                      Add $500 Security Shield
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
              <Card className="p-6 border-primary/30">
                <div className="flex items-center gap-3 mb-6">
                  <Swap weight="fill" className="text-primary" size={32} />
                  <div>
                    <h3 className="text-2xl font-bold">Fusion Mode</h3>
                    <p className="text-muted-foreground">Pick your favorite version or mix & match</p>
                  </div>
                </div>

                <Tabs value={selectedFusion} onValueChange={(v) => setSelectedFusion(v as any)}>
                  <TabsList className="grid grid-cols-3 w-full mb-6">
                    {FUSION_VERSIONS.map((version) => (
                      <TabsTrigger key={version.id} value={version.id} className="text-base">
                        <version.icon weight="fill" size={18} className={version.color} />
                        {version.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {FUSION_VERSIONS.map((version) => (
                    <TabsContent key={version.id} value={version.id} className="space-y-4">
                      <div className="bg-card border border-border rounded-lg p-4">
                        <h4 className="font-semibold mb-2">{version.description}</h4>
                        <ul className="space-y-2">
                          {version.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Check size={16} className={version.color} />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button className="w-full py-6 text-lg glow-primary">
                        <Swap weight="fill" size={20} />
                        Use This Version
                      </Button>
                    </TabsContent>
                  ))}
                </Tabs>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground text-center">
                    💡 Pro tip: Click the flame icons to see what AIs argued about →
                  </p>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card className="p-6 border-destructive/30 glow-destructive">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Fire weight="fill" className="text-destructive animate-pulse-glow" size={24} />
                Live Debate
              </h3>
              {generating && (
                <Badge className="bg-destructive/20 border-destructive text-destructive">
                  🔴 LIVE
                </Badge>
              )}
            </div>

            {!generating && debates.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Fire className="mx-auto mb-3 opacity-30" size={48} weight="thin" />
                <p className="text-sm">AI agents will appear here during generation</p>
                <p className="text-xs mt-2 opacity-70">Watch them argue in real-time 🍿</p>
              </div>
            )}

            <ScrollArea className="h-[600px] pr-4">
              <AnimatePresence>
                <div className="space-y-3">
                  {debates.map((debate, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="p-4 border-border bg-card/50 hover:border-primary/30 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{debate.agent.avatar}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`font-semibold text-sm ${debate.agent.color}`}>
                                  {debate.agent.name}
                                </span>
                                {debate.flames > 1 && (
                                  <div className="flex">
                                    {Array.from({ length: debate.flames }).map((_, i) => (
                                      <Fire key={i} weight="fill" className="text-destructive" size={12} />
                                    ))}
                                  </div>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">{debate.agent.personality}</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-sm mb-3 leading-relaxed">{debate.message}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant={debate.userVote === 'up' ? 'default' : 'outline'}
                              onClick={() => handleVote(index, 'up')}
                              className="h-7"
                            >
                              <ThumbsUp size={14} weight={debate.userVote === 'up' ? 'fill' : 'regular'} />
                              <span className="text-xs">{debate.votes.up}</span>
                            </Button>
                            <Button
                              size="sm"
                              variant={debate.userVote === 'down' ? 'secondary' : 'outline'}
                              onClick={() => handleVote(index, 'down')}
                              className="h-7"
                            >
                              <ThumbsDown size={14} weight={debate.userVote === 'down' ? 'fill' : 'regular'} />
                              <span className="text-xs">{debate.votes.down}</span>
                            </Button>
                          </div>
                          {debate.votes.up > debate.votes.down && (
                            <Badge className="bg-accent/20 text-accent border-accent/40 text-xs">
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
          className="mt-8"
        >
          <Card className="p-8 border-accent/30 glow-accent">
            <div className="text-center mb-8">
              <TreeStructure weight="fill" className="mx-auto mb-4 text-accent" size={48} />
              <h2 className="text-3xl font-bold mb-2">Idea Incubator</h2>
              <p className="text-muted-foreground">5 AI-validated app ideas generated for FREE</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Social Fitness Tracker', 'AI Recipe Generator', 'Local Event Finder', 'Habit Streak Gamifier', 'Micro SaaS Dashboard'].map((idea, idx) => (
                <Card key={idx} className="p-4 border-primary/20 hover:border-primary/50 cursor-pointer transition-colors">
                  <h4 className="font-semibold mb-2">{idea}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Click to auto-fill generator with full tech stack & features
                  </p>
                  <Button size="sm" variant="outline" className="w-full" onClick={() => {
                    setPrompt(`Build a ${idea} with user auth, real-time features, and mobile-first design`)
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
    </div>
  )
}
