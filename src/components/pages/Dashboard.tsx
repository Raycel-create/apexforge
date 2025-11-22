import { Download, Rocket, Trash, Sparkle } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

type Page = 'home' | 'dashboard' | 'pricing' | 'ceo' | 'generator'

interface DashboardProps {
  onNavigate: (page: Page) => void
}

interface Project {
  id: number
  name: string
  prompt: string
  models: string[]
  createdAt: string
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [projects, setProjects] = useKV<Project[]>('user-projects', [])
  const [credits] = useKV<number>('user-credits', 5)

  const deleteProject = (id: number) => {
    setProjects((current) => (current ?? []).filter((p) => p.id !== id))
    toast.success('Project deleted')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Manage your generated applications</p>
          </div>
          <Button onClick={() => onNavigate('generator')} className="glow-primary">
            <Sparkle weight="fill" size={16} />
            New Project
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-primary/50">
            <div className="text-3xl font-bold mb-1">{(projects ?? []).length}</div>
            <div className="text-muted-foreground">Total Projects</div>
          </Card>
          <Card className="p-6 border-accent/50">
            <div className="text-3xl font-bold mb-1">{credits ?? 0}</div>
            <div className="text-muted-foreground">Credits Remaining</div>
          </Card>
          <Card className="p-6">
            <div className="text-3xl font-bold mb-1 text-accent">Free Tier</div>
            <div className="text-muted-foreground">
              <Button
                variant="link"
                className="p-0 h-auto text-primary"
                onClick={() => onNavigate('pricing')}
              >
                Upgrade to Pro →
              </Button>
            </div>
          </Card>
        </div>

        {(!projects || projects.length === 0) ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <Sparkle weight="thin" size={40} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6">
                Generate your first AI-powered application to get started
              </p>
              <Button onClick={() => onNavigate('generator')} className="glow-primary">
                <Sparkle weight="fill" size={16} />
                Create First Project
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Your Projects</h2>
            <div className="grid gap-4">
              {projects.map((project) => (
                <Card key={project.id} className="p-6 hover:border-primary/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {project.prompt}
                      </p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {formatDate(project.createdAt)}
                        </Badge>
                        {project.models.map((model) => (
                          <Badge key={model} variant="secondary" className="text-xs">
                            {model === 'gpt' ? '🧠 GPT-4' : model === 'claude' ? '🎯 Claude' : '⚡ Grok'}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.success('Downloading project...')}
                      >
                        <Download size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.success('Deploying...')}
                      >
                        <Rocket size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteProject(project.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
