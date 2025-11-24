import { useState, useEffect, useRef } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { 
  EnvelopeSimple, 
  ShieldCheck,
  Check, 
  Clock, 
  Warning,
  Lightning,
  Sparkle,
  ArrowClockwise
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { 
  generateOTP, 
  isOTPValid, 
  verifyOTPCode,
  simulateEmailOTPSend,
  verifyEmail,
  getTimeRemaining,
  formatOTPForDisplay,
  type OTPCode,
  type OTPVerification
} from '../lib/otpAuth'

interface OTPAuthProps {
  onSuccess: (email: string, provider: 'email' | 'github') => void
  onCancel?: () => void
  provider?: 'email' | 'github'
}

export function OTPAuth({ onSuccess, onCancel, provider = 'email' }: OTPAuthProps) {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState('')
  const [otpCodes, setOtpCodes] = useKV<Record<string, OTPCode>>('apexforge-otp-codes', {})
  const [verifications, setVerifications] = useKV<Record<string, OTPVerification>>('apexforge-otp-verifications', {})
  const [currentOTP, setCurrentOTP] = useState<OTPCode | null>(null)
  const [attempts, setAttempts] = useState(0)
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (currentOTP && codeSent) {
      const interval = setInterval(() => {
        const remaining = getTimeRemaining(currentOTP.expiresAt)
        setTimeRemaining(remaining)
        
        if (remaining === 'Expired') {
          setCodeSent(false)
          setCurrentOTP(null)
          toast.error('Verification code expired', {
            description: 'Please request a new one',
          })
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [currentOTP, codeSent])

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      const otpData = generateOTP(email, provider)
      const otpKey = `${email}-${Date.now()}`

      setOtpCodes((current) => ({
        ...current,
        [otpKey]: otpData,
      }))

      await simulateEmailOTPSend(email, otpData.code, provider)

      setCurrentOTP(otpData)
      setCodeSent(true)
      setAttempts(0)

      const providerName = provider === 'github' ? 'GitHub' : 'Gmail'
      toast.success(`Verification code sent! 🔐`, {
        description: `Check your ${providerName} inbox (or console in dev mode)`,
        duration: 5000,
      })

      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    } catch (error) {
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

    if (newOtp.every(digit => digit !== '') && currentOTP) {
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

    if (pastedData.length === 6 && currentOTP) {
      handleVerifyOTP(pastedData)
    } else if (pastedData.length > 0) {
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus()
    }
  }

  const handleVerifyOTP = async (code: string) => {
    if (!currentOTP) return

    setIsLoading(true)

    try {
      const isValid = verifyOTPCode(currentOTP, code)

      if (isValid) {
        const otpKey = Object.keys(otpCodes || {}).find(
          key => otpCodes?.[key].email === email && !otpCodes[key].used
        )

        if (otpKey) {
          setOtpCodes((current) => ({
            ...current,
            [otpKey]: { ...currentOTP, used: true },
          }))
        }

        const verification = verifyEmail(email, provider)
        setVerifications((current) => ({
          ...current,
          [email]: verification,
        }))

        toast.success('🎉 Email verified!', {
          description: 'You are now signed in',
          duration: 3000,
        })

        setTimeout(() => {
          onSuccess(email, provider)
        }, 1000)
      } else {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)

        if (newAttempts >= 3) {
          setCodeSent(false)
          setCurrentOTP(null)
          setOtp(['', '', '', '', '', ''])
          toast.error('Too many failed attempts', {
            description: 'Please request a new verification code',
          })
        } else {
          setOtp(['', '', '', '', '', ''])
          inputRefs.current[0]?.focus()
          toast.error('Invalid verification code', {
            description: `${3 - newAttempts} attempt${3 - newAttempts !== 1 ? 's' : ''} remaining`,
          })
        }
      }
    } catch (error) {
      toast.error('Verification failed', {
        description: 'Please try again',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setCodeSent(false)
    setCurrentOTP(null)
    setOtp(['', '', '', '', '', ''])
    setAttempts(0)
    await handleSendOTP(new Event('submit') as any)
  }

  const providerName = provider === 'github' ? 'GitHub' : 'Gmail'
  const providerIcon = provider === 'github' ? (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  ) : (
    <EnvelopeSimple weight="fill" size={24} />
  )

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
          <ShieldCheck weight="fill" className="text-primary glow-primary" size={40} />
          <Sparkle weight="fill" className="text-accent glow-accent" size={32} />
        </motion.div>
        <h2 className="text-3xl font-bold mb-2">OTP Verification</h2>
        <p className="text-muted-foreground">
          Secure sign-in with {providerName} verification code
        </p>
      </motion.div>

      <Card className="p-6 border-primary/30 bg-card/90 backdrop-blur">
        <AnimatePresence mode="wait">
          {!codeSent ? (
            <motion.form
              key="email-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSendOTP}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="otp-email" className="text-sm font-semibold mb-2 flex items-center gap-2">
                  {providerIcon}
                  Email Address
                </Label>
                <Input
                  id="otp-email"
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
                    Sending Code...
                  </>
                ) : (
                  <>
                    <ShieldCheck weight="fill" size={20} />
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
                  Use different method
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
                    Verification code sent to {email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code from your {providerName} inbox
                  </p>
                </AlertDescription>
              </Alert>

              <div>
                <Label className="text-sm font-semibold mb-3 flex items-center justify-center gap-2">
                  <ShieldCheck weight="fill" className="text-primary" size={18} />
                  Enter 6-Digit Code
                </Label>
                <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 text-center text-2xl font-bold bg-background border-primary/30 focus:border-primary"
                      disabled={isLoading}
                    />
                  ))}
                </div>
              </div>

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

                {attempts > 0 && (
                  <Alert className="border-destructive/50 bg-destructive/10">
                    <Warning weight="fill" className="text-destructive" size={18} />
                    <AlertDescription className="ml-2 text-xs">
                      Invalid code. {3 - attempts} attempt{3 - attempts !== 1 ? 's' : ''} remaining
                    </AlertDescription>
                  </Alert>
                )}

                <Alert className="border-primary/30 bg-background/50">
                  <Warning weight="fill" className="text-primary" size={18} />
                  <AlertDescription className="ml-2 text-xs">
                    In development mode, check the browser console for the verification code
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
                  onClick={() => {
                    setCodeSent(false)
                    setCurrentOTP(null)
                    setEmail('')
                    setOtp(['', '', '', '', '', ''])
                    setAttempts(0)
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
            <ShieldCheck weight="fill" className="text-accent" size={14} />
            <span className="font-semibold text-accent">Secure & Fast</span> - Code expires in 10 minutes
          </p>
        </Card>
      </motion.div>
    </div>
  )
}
