import { Download, Rocket, Trash, Sparkle, ArrowsClockwise, Shield, Globe, Fire, Copy, Share } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useScreenSize } from '../../hooks/use-mobile'
import { INTEGRATIONS } from '../../lib/integrations'

type Page = 'home' | 'dashboard' | 'pricing' | 'ceo' | 'generator'

interface DashboardProps {
  onNavigate: (page: Page) => void
}

interface Project {
  id: number
  name: string
  prompt: string
  url?: string
  integrations?: string[]
  createdAt: string
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [projects, setProjects] = useKV<Project[]>('user-projects', [])
  const [credits] = useKV<number>('user-credits', 15)
  const { isMobile, isTablet } = useScreenSize()

  const deleteProject = (id: number) => {
    setProjects((current) => (current ?? []).filter((p) => p.id !== id))
    toast.success('Project deleted')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: isMobile ? undefined : 'numeric',
      hour: isMobile ? undefined : '2-digit',
      minute: isMobile ? undefined : '2-digit',
    })
  }

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('Link copied! 🔗')
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-4 sm:mb-8 flex-wrap gap-2 sm:gap-4"
        >
          <div>
            <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3`}>
              <Fire weight="fill" className="text-destructive" size={isMobile ? 24 : 36} />
              Your Forge
            </h1>
            <p className={`text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>Manage and evolve your generated apps</p>
          </div>
          <Button onClick={() => onNavigate('generator')} size={isMobile ? 'sm' : 'lg'} className="glow-primary">
            <Sparkle weight="fill" size={isMobile ? 16 : 20} />
            {isMobile ? 'New' : 'Ignite New Project'}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-8"
        >
          <Card className={`${isMobile ? 'p-3' : 'p-6'} border-primary/30 hover:border-primary/50 transition-colors`}>
            <div className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold mb-1 text-primary`}>{(projects ?? []).length}</div>
            <div className={`text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>Apps Forged</div>
          </Card>
          <Card className={`${isMobile ? 'p-3' : 'p-6'} border-accent/30 hover:border-accent/50 transition-colors`}>
            <div className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold mb-1 text-accent`}>{credits ?? 0}</div>
            <div className={`text-muted-foreground flex items-center justify-between ${isMobile ? 'text-xs' : ''}`}>
              <span>Credits Left</span>
              {(credits ?? 0) === 0 && (
                <Button
                  variant="link"
                  size="sm"
                  className={`p-0 h-auto text-primary ${isMobile ? 'text-xs' : ''}`}
                  onClick={() => onNavigate('pricing')}
                >
                  Get More →
                </Button>
              )}
            </div>
          </Card>
          <Card className={`${isMobile ? 'p-3' : 'p-6'} border-border`}>
            <div className={`${isMobile ? 'text-base' : 'text-2xl'} font-bold mb-1`}>Free Tier</div>
            <Button
              variant="link"
              className={`p-0 h-auto text-primary ${isMobile ? 'text-xs' : 'text-base'}`}
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
            <Card className={`${isMobile ? 'p-6' : 'p-12'} text-center border-primary/30`}>
              <div className="max-w-md mx-auto">
                <div className={`${isMobile ? 'w-16 h-16' : 'w-24 h-24'} rounded-full bg-muted mx-auto mb-4 sm:mb-6 flex items-center justify-center`}>
                  <Sparkle weight="thin" size={isMobile ? 32 : 48} className="text-muted-foreground" />
                </div>
                <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-2`}>No projects yet</h3>
                <p className={`text-muted-foreground mb-4 sm:mb-6 ${isMobile ? 'text-sm' : 'text-lg'}`}>
                  Watch 5 AI agents argue and build your first app in under 10 seconds
                </p>
                <Button onClick={() => onNavigate('generator')} size={isMobile ? 'default' : 'lg'} className={`glow-primary ${isMobile ? 'text-base px-6 py-5' : 'text-lg px-8 py-6'}`}>
                  <Fire weight="fill" size={isMobile ? 20 : 24} />
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
            className="space-y-3 sm:space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold`}>Your Projects</h2>
              <Badge className={`bg-accent/20 text-accent border-accent/40 ${isMobile ? 'text-xs px-2 py-0.5' : ''}`}>
                {projects.length} total
              </Badge>
            </div>
            
            <div className="grid gap-3 sm:gap-6">
              {projects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className={`${isMobile ? 'p-3' : 'p-6'} border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/10`}>
                    <div className={`flex items-start justify-between ${isMobile ? 'gap-2' : 'gap-6'} mb-2 sm:mb-4`}>
                      <div className="flex-1">
                        <h3 className={`${isMobile ? 'text-base' : 'text-2xl'} font-bold mb-1 sm:mb-2`}>{project.name}</h3>
                        <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'} mb-2 sm:mb-3 line-clamp-2`}>
                          {project.prompt}
                        </p>
                        {project.url && (
                          <div className={`flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3 bg-card border border-border rounded-lg ${isMobile ? 'px-2 py-1' : 'px-3 py-2'}`}>
                            <Globe weight="fill" className="text-accent" size={isMobile ? 12 : 16} />
                            <code className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-accent font-mono flex-1 overflow-hidden text-ellipsis`}>{project.url}</code>
                            <Button size="sm" variant="ghost" className={isMobile ? 'h-auto p-0.5' : ''} onClick={() => copyLink(project.url!)}>
                              <Copy size={isMobile ? 12 : 14} />
                            </Button>
                          </div>
                        )}
                        <Badge variant="outline" className={isMobile ? 'text-[10px] px-1 py-0' : 'text-xs'}>
                          {formatDate(project.createdAt)}
                        </Badge>
                        {project.integrations && project.integrations.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {project.integrations.slice(0, 3).map(intId => {
                              const integration = INTEGRATIONS.find(int => int.id === intId)
                              if (!integration) return null
                              const Icon = integration.icon
                              return (
                                <Badge key={intId} variant="outline" className={`text-[10px] border-primary/30 ${isMobile ? 'px-1 py-0' : 'px-2 py-0.5'}`}>
                                  <Icon className={`${integration.color} ${isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'}`} />
                                  <span className="hidden sm:inline">{integration.name.split(' ')[0]}</span>
                                </Badge>
                              )
                            })}
                            {project.integrations.length > 3 && (
                              <Badge variant="outline" className="text-[10px]">
                                +{project.integrations.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator className="my-2 sm:my-4" />

                    <div className="grid grid-cols-3 gap-1 sm:gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        className={`glow-primary ${isMobile ? 'text-[8px] px-1 py-0.5' : 'text-[10px] px-2 py-1'} h-auto`}
                        onClick={() => toast.success('Opening Evolve mode...')}
                      >
                        <ArrowsClockwise weight="fill" size={isMobile ? 10 : 12} />
                        Evolve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`border-destructive/50 text-destructive hover:bg-destructive/10 ${isMobile ? 'text-[8px] px-1 py-0.5' : 'text-[10px] px-2 py-1'} h-auto`}
                        onClick={() => toast.success('Opening Security Shield checkout...')}
                      >
                        <Shield weight="fill" size={isMobile ? 10 : 12} />
                        Shield
                      </Button>
                      {project.url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className={`${isMobile ? 'text-[8px] px-1 py-0.5' : 'text-[10px] px-2 py-1'} h-auto`}
                          onClick={() => window.open(project.url, '_blank')}
                        >
                          <Globe size={isMobile ? 10 : 12} />
                          Open
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${isMobile ? 'text-[8px] px-1 py-0.5' : 'text-[10px] px-2 py-1'} h-auto`}
                        onClick={() => toast.success('Creating Forge Card...')}
                      >
                        <Share size={isMobile ? 10 : 12} />
                        Share
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${isMobile ? 'text-[8px] px-1 py-0.5' : 'text-[10px] px-2 py-1'} h-auto`}
                        onClick={() => toast.success('Downloading ZIP...')}
                      >
                        <Download size={isMobile ? 10 : 12} />
                        Code
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${isMobile ? 'text-[8px] px-1 py-0.5' : 'text-[10px] px-2 py-1'} h-auto`}
                        onClick={() => toast.success('Deploying to production...')}
                      >
                        <Rocket size={isMobile ? 10 : 12} />
                        Deploy
                      </Button>
                    </div>

                    <div className="mt-2 sm:mt-4 flex justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`text-muted-foreground hover:text-destructive ${isMobile ? 'text-xs' : ''}`}
                        onClick={() => deleteProject(project.id)}
                      >
                        <Trash size={isMobile ? 12 : 16} />
                        {!isMobile && 'Delete'}
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
          className="mt-6 sm:mt-12"
        >
          <Card className={`${isMobile ? 'p-4' : 'p-8'} border-accent/30 bg-accent/5 text-center`}>
            <h3 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold mb-2`}>Ready to Build Something New?</h3>
            <p className={`text-muted-foreground mb-4 sm:mb-6 ${isMobile ? 'text-xs' : ''}`}>
              {(credits ?? 0) > 0 
                ? `You have ${credits} credits remaining. Start your next project now!`
                : 'Upgrade to Pro for unlimited generations and live deployment.'
              }
            </p>
            <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
              <Button
                size={isMobile ? 'default' : 'lg'}
                onClick={() => onNavigate('generator')}
                className="glow-primary"
              >
                <Fire weight="fill" size={isMobile ? 16 : 20} />
                New Project
              </Button>
              {(credits ?? 0) === 0 && (
                <Button
                  size={isMobile ? 'default' : 'lg'}
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
