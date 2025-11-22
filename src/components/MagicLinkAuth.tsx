import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { 
  EnvelopeSimple, 
  MagicWand, 
  Check, 
  Clock, 
  Warning,
  Lightning,
  Sparkle 
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { 
  generateMagicLink, 
  isMagicLinkValid, 
  formatMagicLinkUrl,
  simulateEmailSend,
  verifyEmail,
  getTimeRemaining,
  type MagicLink,
  type EmailVerification
} from '../lib/magicLinkAuth'

interface MagicLinkAuthProps {
  onSuccess: (email: string) => void
  onCancel?: () => void
}

export function MagicLinkAuth({ onSuccess, onCancel }: MagicLinkAuthProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [linkSent, setLinkSent] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState('')
  const [magicLinks, setMagicLinks] = useKV<Record<string, MagicLink>>('apexforge-magic-links', {})
  const [verifications, setVerifications] = useKV<Record<string, EmailVerification>>('apexforge-verifications', {})
  const [currentLink, setCurrentLink] = useState<MagicLink | null>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('magic_token')
    
    if (token && magicLinks) {
      handleMagicLinkVerification(token)
    }
  }, [magicLinks])

  useEffect(() => {
    if (currentLink && linkSent) {
      const interval = setInterval(() => {
        const remaining = getTimeRemaining(currentLink.expiresAt)
        setTimeRemaining(remaining)
        
        if (remaining === 'Expired') {
          setLinkSent(false)
          setCurrentLink(null)
          toast.error('Magic link expired', {
            description: 'Please request a new one',
          })
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [currentLink, linkSent])

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleMagicLinkVerification = async (token: string) => {
    const link = magicLinks?.[token]
    
    if (!link) {
      toast.error('Invalid magic link', {
        description: 'This link does not exist',
      })
      return
    }

    if (!isMagicLinkValid(link)) {
      toast.error('Magic link expired or already used', {
        description: 'Please request a new one',
      })
      return
    }

    setMagicLinks((current) => ({
      ...current,
      [token]: { ...link, used: true },
    }))

    const verification = verifyEmail(link.email)
    setVerifications((current) => ({
      ...current,
      [link.email]: verification,
    }))

    toast.success('🎉 Email verified!', {
      description: 'You are now signed in',
      duration: 3000,
    })

    window.history.replaceState({}, document.title, window.location.pathname)

    setTimeout(() => {
      onSuccess(link.email)
    }, 1000)
  }

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      const magicLink = generateMagicLink(email)
      const magicLinkUrl = formatMagicLinkUrl(magicLink.token)

      setMagicLinks((current) => ({
        ...current,
        [magicLink.token]: magicLink,
      }))

      await simulateEmailSend(email, magicLinkUrl)

      setCurrentLink(magicLink)
      setLinkSent(true)

      toast.success('Magic link sent! 🪄', {
        description: 'Check your email (or console in dev mode)',
        duration: 5000,
      })
    } catch (error) {
      toast.error('Failed to send magic link', {
        description: 'Please try again',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendLink = async () => {
    setLinkSent(false)
    setCurrentLink(null)
    await handleSendMagicLink(new Event('submit') as any)
  }

  const copyLinkToClipboard = () => {
    if (currentLink) {
      const url = formatMagicLinkUrl(currentLink.token)
      navigator.clipboard.writeText(url)
      toast.success('Link copied!', {
        description: 'Paste it in a new tab to test',
      })
    }
  }

  return (
    <div className="w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <MagicWand weight="fill" className="text-primary glow-primary" size={40} />
          <Sparkle weight="fill" className="text-accent glow-accent" size={32} />
        </motion.div>
        <h2 className="text-3xl font-bold mb-2">Magic Link Sign In</h2>
        <p className="text-muted-foreground">
          No password needed. We'll send you a secure link.
        </p>
      </motion.div>

      <Card className="p-6 border-primary/30 bg-card/90 backdrop-blur">
        <AnimatePresence mode="wait">
          {!linkSent ? (
            <motion.form
              key="email-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSendMagicLink}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="magic-email" className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <EnvelopeSimple weight="fill" className="text-primary" size={16} />
                  Email Address
                </Label>
                <Input
                  id="magic-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11 bg-background border-primary/30 focus:border-primary"
                  autoComplete="email"
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base glow-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground" />
                    Sending Magic Link...
                  </>
                ) : (
                  <>
                    <MagicWand weight="fill" size={20} />
                    Send Magic Link
                  </>
                )}
              </Button>

              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Use password instead
                </Button>
              )}
            </motion.form>
          ) : (
            <motion.div
              key="link-sent"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <Alert className="border-accent/50 bg-accent/10">
                <Check weight="bold" className="text-accent" size={20} />
                <AlertDescription className="ml-2">
                  <p className="font-semibold text-accent mb-1">
                    Magic link sent to {email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Click the link in your email to sign in
                  </p>
                </AlertDescription>
              </Alert>

              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock weight="fill" className="text-primary" size={18} />
                    <span className="font-semibold">Expires in:</span>
                  </div>
                  <span className="text-lg font-mono font-bold text-primary">
                    {timeRemaining}
                  </span>
                </div>

                <Alert className="border-primary/30 bg-background/50">
                  <Warning weight="fill" className="text-primary" size={18} />
                  <AlertDescription className="ml-2 text-xs">
                    In development mode, check the browser console for the magic link URL
                  </AlertDescription>
                </Alert>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={copyLinkToClipboard}
                  className="w-full"
                >
                  <Lightning weight="fill" size={18} />
                  Copy Link (Dev Mode)
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResendLink}
                  disabled={isLoading}
                  className="w-full"
                >
                  Resend Magic Link
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setLinkSent(false)
                    setCurrentLink(null)
                    setEmail('')
                  }}
                  className="w-full text-xs"
                >
                  Change Email
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-center"
      >
        <Card className="inline-block px-6 py-3 bg-accent/5 border-accent/30">
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <MagicWand weight="fill" className="text-accent" size={14} />
            <span className="font-semibold text-accent">Passwordless & Secure</span> - Magic links expire in 15 minutes
          </p>
        </Card>
      </motion.div>
    </div>
  )
}
