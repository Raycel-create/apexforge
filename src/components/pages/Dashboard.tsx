import { Download, Rocket, Trash, Sparkle, ArrowsClockwise, Shield, Globe, Fire, Copy, Share } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

type Page = 'home' | 'dashboard' | 'pricing' | 'ceo' | 'generator'

interface DashboardProps {
  onNavigate: (page: Page) => void
}

interface Project {
  id: number
  name: string
  prompt: string
  url?: string
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
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('Link copied! 🔗')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 flex-wrap gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Fire weight="fill" className="text-destructive" size={36} />
              Your Forge
            </h1>
            <p className="text-muted-foreground">Manage and evolve your generated apps</p>
          </div>
          <Button onClick={() => onNavigate('generator')} size="lg" className="glow-primary">
            <Sparkle weight="fill" size={20} />
            Ignite New Project
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="p-6 border-primary/30 hover:border-primary/50 transition-colors">
            <div className="text-4xl font-bold mb-1 text-primary">{(projects ?? []).length}</div>
            <div className="text-muted-foreground">Apps Forged</div>
          </Card>
          <Card className="p-6 border-accent/30 hover:border-accent/50 transition-colors">
            <div className="text-4xl font-bold mb-1 text-accent">{credits ?? 0}</div>
            <div className="text-muted-foreground flex items-center justify-between">
              <span>Credits Left</span>
              {(credits ?? 0) === 0 && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto text-primary"
                  onClick={() => onNavigate('pricing')}
                >
                  Get More →
                </Button>
              )}
            </div>
          </Card>
          <Card className="p-6 border-border">
            <div className="text-2xl font-bold mb-1">Free Tier</div>
            <Button
              variant="link"
              className="p-0 h-auto text-primary text-base"
              onClick={() => onNavigate('pricing')}
            >
              Upgrade to Pro for unlimited →
            </Button>
          </Card>
        </motion.div>

        {(!projects || projects.length === 0) ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-12 text-center border-primary/30">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
                  <Sparkle weight="thin" size={48} className="text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-6 text-lg">
                  Watch 5 AI agents argue and build your first app in under 10 seconds
                </p>
                <Button onClick={() => onNavigate('generator')} size="lg" className="glow-primary text-lg px-8 py-6">
                  <Fire weight="fill" size={24} />
                  Ignite The Forge
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Your Projects</h2>
              <Badge className="bg-accent/20 text-accent border-accent/40">
                {projects.length} total
              </Badge>
            </div>
            
            <div className="grid gap-6">
              {projects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="p-6 border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/10">
                    <div className="flex items-start justify-between gap-6 mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2">{project.name}</h3>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {project.prompt}
                        </p>
                        {project.url && (
                          <div className="flex items-center gap-2 mb-3 bg-card border border-border rounded-lg px-3 py-2">
                            <Globe weight="fill" className="text-accent" size={16} />
                            <code className="text-xs text-accent font-mono flex-1">{project.url}</code>
                            <Button size="sm" variant="ghost" onClick={() => copyLink(project.url!)}>
                              <Copy size={14} />
                            </Button>
                          </div>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {formatDate(project.createdAt)}
                        </Badge>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="glow-primary text-[10px] px-2 py-1 h-auto"
                        onClick={() => toast.success('Opening Evolve mode...')}
                      >
                        <ArrowsClockwise weight="fill" size={12} />
                        Evolve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-destructive/50 text-destructive hover:bg-destructive/10 text-[10px] px-2 py-1 h-auto"
                        onClick={() => toast.success('Opening Security Shield checkout...')}
                      >
                        <Shield weight="fill" size={12} />
                        Shield
                      </Button>
                      {project.url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[10px] px-2 py-1 h-auto"
                          onClick={() => window.open(project.url, '_blank')}
                        >
                          <Globe size={12} />
                          Open
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[10px] px-2 py-1 h-auto"
                        onClick={() => toast.success('Creating Forge Card...')}
                      >
                        <Share size={12} />
                        Share
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[10px] px-2 py-1 h-auto"
                        onClick={() => toast.success('Downloading ZIP...')}
                      >
                        <Download size={12} />
                        Code
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[10px] px-2 py-1 h-auto"
                        onClick={() => toast.success('Deploying to production...')}
                      >
                        <Rocket size={12} />
                        Deploy
                      </Button>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => deleteProject(project.id)}
                      >
                        <Trash size={16} />
                        Delete
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Card className="p-8 border-accent/30 bg-accent/5 text-center">
            <h3 className="text-2xl font-bold mb-2">Ready to Build Something New?</h3>
            <p className="text-muted-foreground mb-6">
              {(credits ?? 0) > 0 
                ? `You have ${credits} credits remaining. Start your next project now!`
                : 'Upgrade to Pro for unlimited generations and live deployment.'
              }
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => onNavigate('generator')}
                className="glow-primary"
              >
                <Fire weight="fill" size={20} />
                New Project
              </Button>
              {(credits ?? 0) === 0 && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate('pricing')}
                  className="border-primary/50"
                >
                  View Pricing
                </Button>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
