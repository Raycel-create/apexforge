import { useState, useEffect, useRef } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { Progress } from './ui/progress'
import { 
  EnvelopeSimple, 
  DeviceMobile,
  ShieldCheck,
  Check, 
  Clock, 
  Warning,
  ArrowClockwise,
  Sparkle,
  Lightning,
  LockKey,
  X
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { 
  generateOTPCode,
  sendOTPEmail,
  sendOTPSMS,
  verifyOTPCode,
  isOTPValid,
  getTimeRemaining,
  getTimeRemainingMs,
  formatOTPForDisplay,
  validateEmail,
  validatePhoneNumber,
  formatPhoneNumber,
  maskEmail,
  maskPhoneNumber,
  createVerification,
  createSession,
  addAttemptToSession,
  getRemainingAttempts,
  isSessionLocked,
  getLockoutTimeRemaining,
  cleanupExpiredOTPs,
  type OTPCode,
  type OTPVerification,
  type OTPSession
} from '../lib/realtimeOTP'

interface RealtimeOTPVerificationProps {
  onSuccess: (identifier: string, provider: 'email' | 'sms' | 'github') => void
  onCancel?: () => void
  defaultProvider?: 'email' | 'sms' | 'github'
  title?: string
  description?: string
}

export function RealtimeOTPVerification({ 
  onSuccess, 
  onCancel,
  defaultProvider = 'email',
  title = 'Verify Your Identity',
  description = 'Secure verification with real-time OTP'
}: RealtimeOTPVerificationProps) {
  const [provider, setProvider] = useState<'email' | 'sms' | 'github'>(defaultProvider)
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState('')
  const [timeProgress, setTimeProgress] = useState(100)
  
  const [otpCodes, setOtpCodes] = useKV<Record<string, OTPCode>>('realtime-otp-codes', {})
  const [sessions, setSessions] = useKV<Record<string, OTPSession>>('realtime-otp-sessions', {})
  const [verifications, setVerifications] = useKV<Record<string, OTPVerification>>('realtime-otp-verifications', {})
  
  const [currentOTP, setCurrentOTP] = useState<OTPCode | null>(null)
  const [currentSession, setCurrentSession] = useState<OTPSession | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setOtpCodes((current) => cleanupExpiredOTPs(current || {}))
    }, 5 * 60 * 1000)

    return () => clearInterval(cleanupInterval)
  }, [setOtpCodes])

  useEffect(() => {
    if (currentOTP && codeSent) {
      const interval = setInterval(() => {
        const remaining = getTimeRemaining(currentOTP.expiresAt)
        const remainingMs = getTimeRemainingMs(currentOTP.expiresAt)
        const progress = (remainingMs / (10 * 60 * 1000)) * 100
        
        setTimeRemaining(remaining)
        setTimeProgress(Math.max(0, progress))
        
        if (remaining === 'Expired') {
          handleExpiration()
        }
      }, 100)

      return () => clearInterval(interval)
    }
  }, [currentOTP, codeSent])

  const handleExpiration = () => {
    setCodeSent(false)
    setCurrentOTP(null)
    setOtp(['', '', '', '', '', ''])
    toast.error('Verification code expired', {
      description: 'Please request a new code',
      icon: <Clock weight="fill" />,
    })
  }

  const validateIdentifier = (value: string): boolean => {
    if (provider === 'sms') {
      return validatePhoneNumber(value)
    }
    return validateEmail(value)
  }

  const getIdentifierLabel = (): string => {
    switch (provider) {
      case 'sms':
        return 'Phone Number'
      case 'github':
        return 'GitHub Email'
      default:
        return 'Email Address'
    }
  }

  const getIdentifierPlaceholder = (): string => {
    switch (provider) {
      case 'sms':
        return '+1 (555) 123-4567'
      case 'github':
        return 'your-github@email.com'
      default:
        return 'you@example.com'
    }
  }

  const getProviderIcon = () => {
    switch (provider) {
      case 'sms':
        return <DeviceMobile weight="fill" size={24} />
      case 'github':
        return (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        )
      default:
        return <EnvelopeSimple weight="fill" size={24} />
    }
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateIdentifier(identifier)) {
      toast.error(`Please enter a valid ${getIdentifierLabel().toLowerCase()}`)
      return
    }

    const sessionKey = `${provider}-${identifier}`
    const existingSession = sessions?.[sessionKey]

    if (existingSession && isSessionLocked(existingSession)) {
      const lockRemaining = getLockoutTimeRemaining(existingSession)
      toast.error('Account temporarily locked', {
        description: `Too many failed attempts. Try again in ${lockRemaining}`,
        icon: <LockKey weight="fill" />,
      })
      return
    }

    setIsLoading(true)

    try {
      const formattedIdentifier = provider === 'sms' 
        ? formatPhoneNumber(identifier) 
        : identifier

      const otpData = generateOTPCode(formattedIdentifier, provider)
      const otpKey = `${provider}-${formattedIdentifier}-${Date.now()}`

      let session = existingSession || createSession(formattedIdentifier, provider)
      
      setOtpCodes((current) => ({
        ...current,
        [otpKey]: otpData,
      }))

      setSessions((current) => ({
        ...current,
        [sessionKey]: session,
      }))

      if (provider === 'sms') {
        await sendOTPSMS(formattedIdentifier, otpData.code)
      } else {
        await sendOTPEmail(formattedIdentifier, otpData.code, provider)
      }

      setCurrentOTP(otpData)
      setCurrentSession(session)
      setCodeSent(true)

      const providerName = provider === 'sms' ? 'SMS' : provider === 'github' ? 'GitHub' : 'Email'
      const maskedIdentifier = provider === 'sms' 
        ? maskPhoneNumber(formattedIdentifier)
        : maskEmail(formattedIdentifier)

      toast.success(`Code sent! 🔐`, {
        description: `Sent to ${maskedIdentifier} via ${providerName}`,
        duration: 5000,
      })

      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    } catch (error) {
      console.error('OTP send error:', error)
      toast.error('Failed to send verification code', {
        description: 'Please try again',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[value.length - 1]
    }

    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newOtp.every(digit => digit !== '') && currentOTP && currentSession) {
      handleVerifyOTP(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\s/g, '').slice(0, 6)
    
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }
    setOtp(newOtp)

    if (pastedData.length === 6 && currentOTP && currentSession) {
      handleVerifyOTP(pastedData)
    } else if (pastedData.length > 0) {
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus()
    }
  }

  const handleVerifyOTP = async (code: string) => {
    if (!currentOTP || !currentSession || isVerifying) return

    setIsVerifying(true)
    setIsLoading(true)

    try {
      const isValid = verifyOTPCode(currentOTP, code) && isOTPValid(currentOTP)

      const sessionKey = `${provider}-${identifier}`
      const updatedSession = addAttemptToSession(currentSession, code, isValid)

      setSessions((current) => ({
        ...current,
        [sessionKey]: updatedSession,
      }))

      if (isValid) {
        const otpKey = Object.keys(otpCodes || {}).find(
          key => otpCodes?.[key].sessionId === currentOTP.sessionId && !otpCodes[key].used
        )

        if (otpKey) {
          setOtpCodes((current) => ({
            ...current,
            [otpKey]: { ...currentOTP, used: true },
          }))
        }

        const verification = createVerification(identifier, provider, currentOTP.sessionId)
        setVerifications((current) => ({
          ...current,
          [identifier]: verification,
        }))

        toast.success('🎉 Verification successful!', {
          description: 'Identity verified',
          duration: 3000,
        })

        setTimeout(() => {
          onSuccess(identifier, provider)
        }, 1000)
      } else {
        const remaining = getRemainingAttempts(updatedSession)

        if (remaining === 0 || isSessionLocked(updatedSession)) {
          setCodeSent(false)
          setCurrentOTP(null)
          setOtp(['', '', '', '', '', ''])
          
          toast.error('Too many failed attempts', {
            description: 'Session locked for 15 minutes',
            icon: <LockKey weight="fill" />,
          })
        } else {
          setOtp(['', '', '', '', '', ''])
          inputRefs.current[0]?.focus()
          
          toast.error('Invalid verification code', {
            description: `${remaining} attempt${remaining !== 1 ? 's' : ''} remaining`,
            icon: <Warning weight="fill" />,
          })
        }
      }
    } catch (error) {
      console.error('Verification error:', error)
      toast.error('Verification failed', {
        description: 'Please try again',
      })
    } finally {
      setIsLoading(false)
      setIsVerifying(false)
    }
  }

  const handleResendCode = async () => {
    setCodeSent(false)
    setCurrentOTP(null)
    setOtp(['', '', '', '', '', ''])
    await handleSendOTP(new Event('submit') as any)
  }

  const handleReset = () => {
    setCodeSent(false)
    setCurrentOTP(null)
    setCurrentSession(null)
    setIdentifier('')
    setOtp(['', '', '', '', '', ''])
  }

  const remainingAttempts = currentSession ? getRemainingAttempts(currentSession) : 3
  const progressColor = timeProgress > 50 ? 'bg-primary' : timeProgress > 25 ? 'bg-accent' : 'bg-destructive'

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
          <ShieldCheck weight="fill" className="text-primary glow-primary" size={48} />
          <Lightning weight="fill" className="text-accent glow-accent animate-pulse" size={32} />
        </motion.div>
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </motion.div>

      <Card className="p-6 border-primary/30 bg-card/90 backdrop-blur">
        <AnimatePresence mode="wait">
          {!codeSent ? (
            <motion.form
              key="identifier-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSendOTP}
              className="space-y-4"
            >
              <div className="flex gap-2 mb-4">
                <Button
                  type="button"
                  variant={provider === 'email' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setProvider('email')}
                  className="flex-1"
                >
                  <EnvelopeSimple weight="fill" size={16} />
                  Email
                </Button>
                <Button
                  type="button"
                  variant={provider === 'sms' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setProvider('sms')}
                  className="flex-1"
                >
                  <DeviceMobile weight="fill" size={16} />
                  SMS
                </Button>
                <Button
                  type="button"
                  variant={provider === 'github' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setProvider('github')}
                  className="flex-1"
                >
                  GitHub
                </Button>
              </div>

              <div>
                <Label htmlFor="identifier" className="text-sm font-semibold mb-2 flex items-center gap-2">
                  {getProviderIcon()}
                  {getIdentifierLabel()}
                </Label>
                <Input
                  id="identifier"
                  type={provider === 'sms' ? 'tel' : 'email'}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={getIdentifierPlaceholder()}
                  className="h-11 bg-background border-primary/30 focus:border-primary"
                  disabled={isLoading}
                  autoFocus
                />
                {provider === 'sms' && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Include country code (e.g., +1 for US)
                  </p>
                )}
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
                    Sending...
                  </>
                ) : (
                  <>
                    <Lightning weight="fill" size={20} />
                    Send Verification Code
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
                  Cancel
                </Button>
              )}
            </motion.form>
          ) : (
            <motion.div
              key="otp-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <Alert className="border-accent/50 bg-accent/10">
                <Check weight="bold" className="text-accent" size={20} />
                <AlertDescription className="ml-2">
                  <p className="font-semibold text-accent mb-1">
                    Code sent successfully!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code sent to your {provider === 'sms' ? 'phone' : 'email'}
                  </p>
                </AlertDescription>
              </Alert>

              <div>
                <Label className="text-sm font-semibold mb-3 flex items-center justify-center gap-2">
                  <ShieldCheck weight="fill" className="text-primary" size={18} />
                  Enter 6-Digit Code
                </Label>
                <div className="flex gap-2 justify-center mb-4" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Input
                        ref={(el) => {
                          inputRefs.current[index] = el
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOTPChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-14 text-center text-2xl font-bold bg-background border-primary/30 focus:border-primary transition-all"
                        disabled={isLoading}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock weight="fill" className="text-primary" size={18} />
                      <span className="font-semibold">Expires in:</span>
                    </div>
                    <span className="text-lg font-mono font-bold text-primary">
                      {timeRemaining}
                    </span>
                  </div>
                  <div className="relative">
                    <Progress value={timeProgress} className="h-2" />
                    <div 
                      className={`absolute top-0 left-0 h-2 rounded-full transition-all ${progressColor}`}
                      style={{ width: `${timeProgress}%` }}
                    />
                  </div>
                </div>

                {remainingAttempts < 3 && (
                  <Alert className={remainingAttempts === 0 ? 'border-destructive/50 bg-destructive/10' : 'border-accent/50 bg-accent/10'}>
                    <Warning weight="fill" className={remainingAttempts === 0 ? 'text-destructive' : 'text-accent'} size={18} />
                    <AlertDescription className="ml-2 text-xs">
                      {remainingAttempts === 0 ? 'No attempts remaining' : `${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining`}
                    </AlertDescription>
                  </Alert>
                )}

                <Alert className="border-primary/30 bg-background/50">
                  <Sparkle weight="fill" className="text-primary" size={18} />
                  <AlertDescription className="ml-2 text-xs">
                    Check console for the code in development mode
                  </AlertDescription>
                </Alert>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="w-full"
                >
                  <ArrowClockwise weight="fill" size={18} />
                  Resend Code
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="w-full text-xs"
                >
                  <X weight="bold" size={14} />
                  Change {provider === 'sms' ? 'Phone Number' : 'Email'}
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
            <Lightning weight="fill" className="text-accent" size={14} />
            <span className="font-semibold text-accent">Real-time Verification</span> - Secure & Instant
          </p>
        </Card>
      </motion.div>
    </div>
  )
}
