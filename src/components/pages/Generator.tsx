import { useState } from 'react'
import { Sparkle, Download, Rocket, CheckCircle, X, Check } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Textarea } from '../ui/textarea'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { ScrollArea } from '../ui/scroll-area'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

type Page = 'home' | 'dashboard' | 'pricing' | 'ceo' | 'generator'

interface GeneratorProps {
  onNavigate: (page: Page) => void
}

interface AIModel {
  id: string
  name: string
  color: string
  icon: string
}

interface DebateProposal {
  agent: string
  proposal: string
  reasoning: string
  approved: boolean | null
}

const AI_MODELS: AIModel[] = [
  { id: 'gpt', name: 'GPT-4', color: 'text-green-400', icon: '🧠' },
  { id: 'claude', name: 'Claude', color: 'text-orange-400', icon: '🎯' },
  { id: 'grok', name: 'Grok', color: 'text-cyan-400', icon: '⚡' },
]

export function Generator({ onNavigate }: GeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [selectedModels, setSelectedModels] = useState<string[]>(['gpt', 'claude', 'grok'])
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState('')
  const [debates, setDebates] = useState<DebateProposal[]>([])
  const [generated, setGenerated] = useState(false)
  const [credits, setCredits] = useKV<number>('user-credits', 5)
  const [projects, setProjects] = useKV<any[]>('user-projects', [])

  const toggleModel = (modelId: string) => {
    setSelectedModels((prev) =>
      prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId]
    )
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

    const stages = [
      'Analyzing prompt...',
      'GPT-4 generating structure...',
      'Claude reviewing security...',
      'Grok optimizing performance...',
      'AI agents debating approach...',
      'Merging best solutions...',
      'Finalizing code...',
    ]

    for (let i = 0; i < stages.length; i++) {
      setCurrentStage(stages[i])
      setProgress(((i + 1) / stages.length) * 100)

      if (i === 4) {
        await new Promise((resolve) => setTimeout(resolve, 800))
        setDebates([
          {
            agent: 'Grok ⚡',
            proposal: 'Add WebSocket support for real-time features',
            reasoning: 'Users expect instant updates. WebSockets provide better UX than polling.',
            approved: null,
          },
        ])
        await new Promise((resolve) => setTimeout(resolve, 2000))
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    setCredits((current) => Math.max(0, (current ?? 5) - 1))
    setProjects((current) => [
      ...(current ?? []),
      {
        id: Date.now(),
        name: prompt.substring(0, 50),
        prompt,
        models: selectedModels,
        createdAt: new Date().toISOString(),
      },
    ])

    setGenerated(true)
    setGenerating(false)
    toast.success('App generated successfully!')
  }

  const handleApprove = (index: number, approved: boolean) => {
    setDebates((current) =>
      current.map((d, i) => (i === index ? { ...d, approved } : d))
    )
    toast.success(approved ? 'Proposal approved!' : 'Proposal rejected')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">AI App Generator</h1>
          <p className="text-muted-foreground">
            Describe your app in natural language. Our AI agents will collaborate to build it.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <Label className="text-lg font-semibold mb-4 block">Your App Idea</Label>
              <Textarea
                placeholder="E.g., Build a todo app with user authentication, real-time sync, and dark mode..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
                className="mb-4 bg-background"
                disabled={generating}
              />

              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block">Select AI Models</Label>
                <div className="flex gap-4 flex-wrap">
                  {AI_MODELS.map((model) => (
                    <div key={model.id} className="flex items-center gap-2">
                      <Switch
                        id={model.id}
                        checked={selectedModels.includes(model.id)}
                        onCheckedChange={() => toggleModel(model.id)}
                        disabled={generating}
                      />
                      <Label htmlFor={model.id} className="flex items-center gap-2 cursor-pointer">
                        <span>{model.icon}</span>
                        <span className={model.color}>{model.name}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                size="lg"
                onClick={simulateGeneration}
                disabled={generating || selectedModels.length === 0}
                className="w-full glow-primary"
              >
                <Sparkle weight="fill" size={20} />
                {generating ? 'Generating...' : `Generate App (${credits} credits)`}
              </Button>
            </Card>

            {generating && (
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{currentStage}</span>
                    <span className="text-muted-foreground">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </Card>
            )}

            {generated && (
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle weight="fill" className="text-accent" size={32} />
                  <div>
                    <h3 className="text-xl font-semibold">Generation Complete!</h3>
                    <p className="text-muted-foreground">Your app is ready to download and deploy</p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Frontend:</span>
                      <span className="ml-2 font-medium">React + Tailwind CSS</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Backend:</span>
                      <span className="ml-2 font-medium">Node.js + Express</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Database:</span>
                      <span className="ml-2 font-medium">PostgreSQL</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Auth:</span>
                      <span className="ml-2 font-medium">NextAuth.js</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1" onClick={() => toast.success('Downloading ZIP...')}>
                    <Download size={16} />
                    Download ZIP
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => toast.success('Deploying to Vercel...')}>
                    <Rocket size={16} />
                    Deploy to Vercel
                  </Button>
                </div>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">AI Debate Panel</h3>
                <Badge variant="outline" className="text-accent border-accent/50">
                  Live
                </Badge>
              </div>

              {!generating && debates.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="mx-auto mb-3" size={48} weight="thin" />
                  <p className="text-sm">AI agents will appear here during generation</p>
                </div>
              )}

              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {debates.map((debate, index) => (
                    <Card key={index} className="p-4 border-primary/20 bg-card/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">{debate.agent}</span>
                        {debate.approved !== null && (
                          <Badge variant={debate.approved ? 'default' : 'secondary'}>
                            {debate.approved ? 'Approved' : 'Rejected'}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium mb-2">{debate.proposal}</p>
                      <p className="text-xs text-muted-foreground mb-3">{debate.reasoning}</p>
                      {debate.approved === null && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(index, true)}
                            className="flex-1"
                          >
                            <Check size={14} />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(index, false)}
                            className="flex-1"
                          >
                            <X size={14} />
                            Reject
                          </Button>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function Users(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 256 256"
      fill="currentColor"
      {...props}
    >
      <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z" />
    </svg>
  )
}
