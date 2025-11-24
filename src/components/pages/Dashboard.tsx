import { Download, Rocket, Trash, Sparkle, ArrowsClockwise, Shield, Globe, Fire, Copy, Share, ShieldCheck } from '@phosphor-icons/react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useScreenSize } from '../../hooks/use-mobile'
import { INTEGRATIONS } from '../../lib/integrations'
import { useBlackForge } from '../../lib/BlackForgeContext'
import { APIKeyAlert } from '../APIKeyAlert'
import { KeysManager } from '../KeysManager'
import { EmailVerificationBanner } from '../EmailVerificationStatus'
import { OTPAuth } from '../OTPAuth'
import { StripeConnect } from '../StripeConnect'
import { PhoneVerificationFlow, QuickPhoneVerifyButton } from '../PhoneVerificationFlow'
import { VerificationStatus, SecurityBadge } from '../TrustIndicators'
import { useState } from 'react'

type Page = 'home' | 'dashboard' | 'pricing' | 'generator' | 'auth' | 'figma'

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
  const { blackForgeMode } = useBlackForge()
  const [projects, setProjects] = useKV<Project[]>('user-projects', [])
  const [credits] = useKV<number>('user-credits', 15)
  const [currentUser] = useKV<string | null>('apexforge-current-user', null)
  const { isMobile, isTablet } = useScreenSize()
  const [showKeysManager, setShowKeysManager] = useState(false)
  const [showVerificationDialog, setShowVerificationDialog] = useState(false)
  const [showPhoneVerification, setShowPhoneVerification] = useState(false)
  const [phoneVerified, setPhoneVerified] = useKV<boolean>('user-phone-verified', false)
  const [verifiedPhone, setVerifiedPhone] = useKV<string | null>('user-phone-number', null)
  const [emailVerified] = useKV<boolean>('user-email-verified', false)
  const [twoFactorEnabled] = useKV<boolean>('user-2fa-enabled', false)

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

  const handleVerificationSuccess = (email: string, provider: 'email' | 'github') => {
    setShowVerificationDialog(false)
    toast.success('Email verified! 🎉', {
      description: 'Your account is now verified',
    })
  }

  const handlePhoneVerificationComplete = (phone: string) => {
    setPhoneVerified(true)
    setVerifiedPhone(phone)
    setShowPhoneVerification(false)
  }

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6 sm:mb-10 flex-wrap gap-4"
        >
          <div>
            <h1 className="heading-responsive-sm font-bold mb-2 sm:mb-3 flex items-center gap-3">
              <Fire weight="fill" className="text-destructive" size={isMobile ? 32 : 40} />
              Your Forge
            </h1>
            <p className="text-responsive text-muted-foreground">Manage and evolve your generated apps</p>
          </div>
          <Button onClick={() => onNavigate('generator')} size={isMobile ? 'default' : 'lg'} className="glow-primary touch-target">
            <Sparkle weight="fill" size={isMobile ? 20 : 22} />
            {isMobile ? 'New Project' : 'Ignite New Project'}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6 sm:mb-10 space-y-4"
        >
          <Card className="p-5 border-yellow-500/30 bg-yellow-500/10">
            <div className="flex items-center gap-3">
              <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/40">
                ⚠️ Testing Mode Active
              </Badge>
              <p className="text-sm text-muted-foreground">
                All features unlocked for testing. Payment requirements disabled.
              </p>
            </div>
          </Card>
          
          {currentUser && (
            <EmailVerificationBanner 
              email={currentUser}
              onVerifyClick={() => setShowVerificationDialog(true)}
            />
          )}
        </motion.div>

        {showKeysManager && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 sm:mb-8"
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-4 sm:mb-8"
        >
          <Card className="p-4 sm:p-6 border-accent/30">
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Shield size={20} weight="fill" className="text-accent" />
                    Account Security
                  </h3>
                  <QuickPhoneVerifyButton 
                    verified={phoneVerified ?? false}
                    phoneNumber={verifiedPhone ?? undefined}
                    onVerify={() => setShowPhoneVerification(true)}
                  />
                </div>
                <VerificationStatus 
                  phoneVerified={phoneVerified ?? false}
                  emailVerified={emailVerified ?? false}
                  twoFactorEnabled={twoFactorEnabled ?? false}
                />
              </div>
              {!isMobile && (
                <div className="lg:w-64">
                  <SecurityBadge />
                </div>
              )}
            </div>
          </Card>
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
            <div className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold mb-1 text-accent`}>∞</div>
            <div className={`text-muted-foreground flex items-center justify-between ${isMobile ? 'text-xs' : ''}`}>
              <span>Unlimited (Testing)</span>
            </div>
          </Card>
          <Card className={`${isMobile ? 'p-3' : 'p-6'} border-border`}>
            <div className={`${isMobile ? 'text-base' : 'text-2xl'} font-bold mb-1`}>Testing Mode</div>
            <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/40 text-xs">
              All features unlocked
            </Badge>
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
                  <Card className={`${isMobile ? 'p-2' : 'p-3 sm:p-4 lg:p-6'} border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/10`}>
                    <div className={`flex flex-col sm:flex-row items-start justify-between ${isMobile ? 'gap-2' : 'gap-3 sm:gap-4 lg:gap-6'} mb-2 sm:mb-3 lg:mb-4`}>
                      <div className="flex-1 w-full min-w-0">
                        <h3 className={`${isMobile ? 'text-sm' : 'text-base sm:text-lg lg:text-2xl'} font-bold mb-1 sm:mb-2 truncate`}>{project.name}</h3>
                        <p className={`text-muted-foreground ${isMobile ? 'text-[10px]' : 'text-xs sm:text-sm'} mb-1 sm:mb-2 lg:mb-3 line-clamp-2`}>
                          {project.prompt}
                        </p>
                        {project.url && (
                          <div className={`flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 lg:mb-3 bg-card border border-border rounded-lg ${isMobile ? 'px-1.5 py-0.5' : 'px-2 sm:px-3 py-1 sm:py-2'} overflow-hidden`}>
                            <Globe weight="fill" className="text-accent shrink-0" size={isMobile ? 10 : 14} />
                            <code className={`${isMobile ? 'text-[8px]' : 'text-[10px] sm:text-xs'} text-accent font-mono flex-1 truncate`}>{project.url}</code>
                            <Button size="sm" variant="ghost" className={isMobile ? 'h-4 w-4 p-0' : 'h-6 w-6 p-0'} onClick={() => copyLink(project.url!)}>
                              <Copy size={isMobile ? 10 : 12} />
                            </Button>
                          </div>
                        )}
                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                          <Badge variant="outline" className={isMobile ? 'text-[8px] px-1 py-0' : 'text-[10px] sm:text-xs px-1.5 py-0.5'}>
                            {formatDate(project.createdAt)}
                          </Badge>
                          {project.integrations && project.integrations.length > 0 && (
                            <>
                              {project.integrations.slice(0, isMobile ? 2 : 3).map(intId => {
                                const integration = INTEGRATIONS.find(int => int.id === intId)
                                if (!integration) return null
                                const Icon = integration.icon
                                return (
                                  <Badge key={intId} variant="outline" className={`text-[8px] sm:text-[10px] border-primary/30 ${isMobile ? 'px-1 py-0' : 'px-1.5 py-0.5'}`}>
                                    <Icon className={`${integration.color} ${isMobile ? 'w-2 h-2' : 'w-2.5 h-2.5 sm:w-3 sm:h-3'}`} />
                                    <span className="hidden sm:inline truncate">{integration.name.split(' ')[0]}</span>
                                  </Badge>
                                )
                              })}
                              {project.integrations.length > (isMobile ? 2 : 3) && (
                                <Badge variant="outline" className="text-[8px] px-1 py-0">
                                  +{project.integrations.length - (isMobile ? 2 : 3)}
                                </Badge>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator className="my-2 sm:my-3 lg:my-4" />

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        className={`glow-primary ${isMobile ? 'text-[8px] px-1 py-1' : 'text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-1 sm:py-1.5'} h-auto whitespace-nowrap`}
                        onClick={() => {
                          toast.info('Coming Soon', {
                            description: 'Evolve mode is under development',
                            duration: 2000,
                          })
                        }}
                      >
                        <ArrowsClockwise weight="fill" size={isMobile ? 8 : 10} />
                        <span className="hidden sm:inline ml-1">Evolve</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`border-destructive/50 text-destructive hover:bg-destructive/10 ${isMobile ? 'text-[8px] px-1 py-1' : 'text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-1 sm:py-1.5'} h-auto whitespace-nowrap`}
                        onClick={() => onNavigate('pricing')}
                      >
                        <Shield weight="fill" size={isMobile ? 8 : 10} />
                        <span className="hidden sm:inline ml-1">Shield</span>
                      </Button>
                      {project.url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className={`${isMobile ? 'text-[8px] px-1 py-1' : 'text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-1 sm:py-1.5'} h-auto whitespace-nowrap`}
                          onClick={() => window.open(project.url, '_blank')}
                        >
                          <Globe size={isMobile ? 8 : 10} />
                          <span className="hidden sm:inline ml-1">Open</span>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${isMobile ? 'text-[8px] px-1 py-1' : 'text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-1 sm:py-1.5'} h-auto whitespace-nowrap`}
                        onClick={() => {
                          const shareUrl = project.url || 'https://apexforge.app'
                          navigator.clipboard.writeText(shareUrl)
                          toast.success('Link copied!', {
                            description: 'Share your app with others',
                            duration: 2000,
                          })
                        }}
                      >
                        <Share size={isMobile ? 8 : 10} />
                        <span className="hidden sm:inline ml-1">Share</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${isMobile ? 'text-[8px] px-1 py-1' : 'text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-1 sm:py-1.5'} h-auto whitespace-nowrap`}
                        onClick={() => {
                          toast.info('Coming Soon', {
                            description: 'Code export feature is under development',
                            duration: 2000,
                          })
                        }}
                      >
                        <Download size={isMobile ? 8 : 10} />
                        <span className="hidden sm:inline ml-1">Code</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${isMobile ? 'text-[8px] px-1 py-1' : 'text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-1 sm:py-1.5'} h-auto whitespace-nowrap`}
                        onClick={() => {
                          if (project.url) {
                            toast.success('App is already live! 🚀', {
                              description: project.url,
                              duration: 3000,
                            })
                          } else {
                            toast.info('Coming Soon', {
                              description: 'Deployment feature is under development',
                              duration: 2000,
                            })
                          }
                        }}
                      >
                        <Rocket size={isMobile ? 8 : 10} />
                        <span className="hidden sm:inline ml-1">Deploy</span>
                      </Button>
                    </div>

                    <div className="mt-2 sm:mt-3 lg:mt-4 flex justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`text-muted-foreground hover:text-destructive ${isMobile ? 'text-[10px] px-1' : 'text-xs sm:text-sm px-2'}`}
                        onClick={() => deleteProject(project.id)}
                      >
                        <Trash size={isMobile ? 10 : 14} />
                        {!isMobile && <span className="ml-1">Delete</span>}
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
          <StripeConnect />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 sm:mt-12"
        >
          <Card className={`${isMobile ? 'p-4' : 'p-8'} border-accent/30 bg-accent/5 text-center`}>
            <h3 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold mb-2`}>Ready to Build Something New?</h3>
            <p className={`text-muted-foreground mb-4 sm:mb-6 ${isMobile ? 'text-xs' : ''}`}>
              Testing mode active - unlimited generations available!
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
            </div>
          </Card>
        </motion.div>
      </div>

      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck weight="fill" className="text-primary" size={24} />
              Verify Your Email
            </DialogTitle>
          </DialogHeader>
          {currentUser && (
            <OTPAuth 
              onSuccess={handleVerificationSuccess}
              provider="email"
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showPhoneVerification} onOpenChange={setShowPhoneVerification}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <PhoneVerificationFlow 
            onVerificationComplete={handlePhoneVerificationComplete}
            onClose={() => setShowPhoneVerification(false)}
            currentPhone={verifiedPhone ?? undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
