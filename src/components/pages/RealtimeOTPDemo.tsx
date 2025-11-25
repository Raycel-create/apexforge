import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { RealtimeOTPVerification } from '../RealtimeOTPVerification'
import { 
  ShieldCheck, 
  Lightning, 
  Clock, 
  CheckCircle,
  ArrowLeft,
  Sparkle,
  EnvelopeSimple,
  DeviceMobile
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import { getOTPStats, type OTPCode } from '../../lib/realtimeOTP'

interface RealtimeOTPDemoProps {
  onNavigate: (page: string) => void
}

export function RealtimeOTPDemo({ onNavigate }: RealtimeOTPDemoProps) {
  const [isVerified, setIsVerified] = useState(false)
  const [verifiedIdentifier, setVerifiedIdentifier] = useState('')
  const [verifiedProvider, setVerifiedProvider] = useState<'email' | 'sms' | 'github'>('email')
  const [showDemo, setShowDemo] = useState(true)
  const [otpCodes] = useKV<Record<string, OTPCode>>('realtime-otp-codes', {})

  const handleSuccess = (identifier: string, provider: 'email' | 'sms' | 'github') => {
    setIsVerified(true)
    setVerifiedIdentifier(identifier)
    setVerifiedProvider(provider)
    toast.success('🎉 Welcome!', {
      description: 'Your identity has been verified',
    })
  }

  const handleReset = () => {
    setIsVerified(false)
    setVerifiedIdentifier('')
    setShowDemo(true)
  }

  const stats = getOTPStats(otpCodes || {})

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-6"
          >
            <CheckCircle weight="fill" className="text-accent glow-accent mx-auto" size={80} />
          </motion.div>
          
          <h2 className="text-4xl font-bold mb-4">Verification Complete!</h2>
          <p className="text-lg text-muted-foreground mb-2">
            Successfully verified via <Badge variant="secondary" className="ml-1">{verifiedProvider.toUpperCase()}</Badge>
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            {verifiedIdentifier}
          </p>

          <Card className="p-6 mb-6 bg-card/90 backdrop-blur border-accent/30">
            <div className="flex items-center gap-4 mb-4">
              <ShieldCheck weight="fill" className="text-accent" size={32} />
              <div className="text-left flex-1">
                <p className="font-semibold">Identity Verified</p>
                <p className="text-xs text-muted-foreground">Real-time OTP authentication</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Codes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </Card>

          <div className="flex gap-2">
            <Button
              onClick={handleReset}
              variant="outline"
              className="flex-1"
            >
              Verify Another
            </Button>
            <Button
              onClick={() => onNavigate('home')}
              className="flex-1"
            >
              <ArrowLeft size={18} />
              Back to Home
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <Button
          onClick={() => onNavigate('home')}
          variant="ghost"
          className="mb-8"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <Lightning weight="fill" className="text-accent glow-accent animate-pulse" size={48} />
            <ShieldCheck weight="fill" className="text-primary glow-primary" size={56} />
            <Sparkle weight="fill" className="text-accent glow-accent animate-pulse" size={40} />
          </motion.div>
          
          <h1 className="text-5xl font-bold mb-4">Real-time OTP Verification</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Secure, instant verification with live countdown timers and multi-channel support
          </p>
        </motion.div>

        {showDemo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <Card className="p-6 border-primary/30 bg-card/90 backdrop-blur">
              <EnvelopeSimple weight="fill" className="text-primary mb-4" size={32} />
              <h3 className="font-bold text-lg mb-2">Email Verification</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Instant delivery with Gmail and GitHub support
              </p>
              <div className="flex items-center gap-2 text-xs text-accent">
                <Lightning weight="fill" size={14} />
                <span>~1 second delivery</span>
              </div>
            </Card>

            <Card className="p-6 border-accent/30 bg-card/90 backdrop-blur">
              <DeviceMobile weight="fill" className="text-accent mb-4" size={32} />
              <h3 className="font-bold text-lg mb-2">SMS Verification</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Fast SMS delivery to any phone number
              </p>
              <div className="flex items-center gap-2 text-xs text-accent">
                <Lightning weight="fill" size={14} />
                <span>~2 second delivery</span>
              </div>
            </Card>

            <Card className="p-6 border-primary/30 bg-card/90 backdrop-blur">
              <Clock weight="fill" className="text-primary mb-4" size={32} />
              <h3 className="font-bold text-lg mb-2">Live Countdown</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Real-time expiration tracking with progress bar
              </p>
              <div className="flex items-center gap-2 text-xs text-accent">
                <Lightning weight="fill" size={14} />
                <span>Updates every 100ms</span>
              </div>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <RealtimeOTPVerification
            onSuccess={handleSuccess}
            onCancel={() => setShowDemo(prev => !prev)}
            title="Try Real-time Verification"
            description="Experience instant, secure OTP authentication"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Card className="p-8 bg-card/90 backdrop-blur border-accent/30">
            <h3 className="text-2xl font-bold mb-6 text-center">Features</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <ShieldCheck weight="fill" className="text-primary flex-shrink-0" size={24} />
                <div>
                  <p className="font-semibold mb-1">Secure Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    6-digit codes with 10-minute expiration and automatic cleanup
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Lightning weight="fill" className="text-accent flex-shrink-0" size={24} />
                <div>
                  <p className="font-semibold mb-1">Real-time Updates</p>
                  <p className="text-sm text-muted-foreground">
                    Live countdown timer with visual progress indicator
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Clock weight="fill" className="text-primary flex-shrink-0" size={24} />
                <div>
                  <p className="font-semibold mb-1">Rate Limiting</p>
                  <p className="text-sm text-muted-foreground">
                    3 attempts per session with 15-minute lockout protection
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Sparkle weight="fill" className="text-accent flex-shrink-0" size={24} />
                <div>
                  <p className="font-semibold mb-1">Multi-channel Support</p>
                  <p className="text-sm text-muted-foreground">
                    Email, SMS, and GitHub authentication methods
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle weight="fill" className="text-primary flex-shrink-0" size={24} />
                <div>
                  <p className="font-semibold mb-1">Auto-verification</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically verifies when all 6 digits are entered
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <EnvelopeSimple weight="fill" className="text-accent flex-shrink-0" size={24} />
                <div>
                  <p className="font-semibold mb-1">Paste Support</p>
                  <p className="text-sm text-muted-foreground">
                    Copy-paste codes directly from email or SMS
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
