import { useState, useEffect, useRef } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { 
  DeviceMobile, 
  ShieldCheck,
  Check, 
  Clock, 
  Warning,
  ArrowClockwise
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { 
  generateSMSOTP, 
  isSMSOTPValid, 
  verifySMSOTPCode,
  sendSMSOTP,
  formatPhoneNumber,
  validatePhoneNumber,
  type SMSOTPCode,
  type TwilioConfig
} from '../lib/twilioService'

interface SMSOTPAuthProps {
  onSuccess: (phoneNumber: string) => void
  onCancel?: () => void
}

export function SMSOTPAuth({ onSuccess, onCancel }: SMSOTPAuthProps) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState('')
  const [otpCodes, setOtpCodes] = useKV<Record<string, SMSOTPCode>>('apexforge-sms-otp-codes', {})
  const [twilioConfig] = useKV<TwilioConfig>('apexforge-twilio-config', {
    accountSid: '',
    authToken: '',
    phoneNumber: '',
  })
  const [currentOTP, setCurrentOTP] = useState<SMSOTPCode | null>(null)
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

  const getTimeRemaining = (expiresAt: number): string => {
    const remaining = expiresAt - Date.now()
    if (remaining <= 0) return 'Expired'
    
    const minutes = Math.floor(remaining / 60000)
    const seconds = Math.floor((remaining % 60000) / 1000)
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validatePhoneNumber(phoneNumber)) {
      toast.error('Please enter a valid phone number')
      return
    }

    setIsLoading(true)

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber)
      const otpData = generateSMSOTP(formattedPhone)
      const otpKey = `${formattedPhone}-${Date.now()}`

      setOtpCodes((current) => ({
        ...current,
        [otpKey]: otpData,
      }))

      const result = await sendSMSOTP(formattedPhone, otpData.code, twilioConfig)

      if (result.success) {
        setCurrentOTP(otpData)
        setCodeSent(true)
        setAttempts(0)

        const mode = twilioConfig?.accountSid ? 'SMS' : 'console'
        toast.success(`Verification code sent! 🔐`, {
          description: `Check your phone${mode === 'console' ? ' (or console in dev mode)' : ''}`,
          duration: 5000,
        })

        setTimeout(() => {
          inputRefs.current[0]?.focus()
        }, 100)
      } else {
        throw new Error(result.message || 'Failed to send SMS')
      }
    } catch (error) {
      console.error('SMS send error:', error)
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
      const isValid = verifySMSOTPCode(currentOTP, code)

      if (isValid) {
        const otpKey = Object.keys(otpCodes || {}).find(
          key => otpCodes?.[key].phoneNumber === currentOTP.phoneNumber && !otpCodes[key].used
        )

        if (otpKey) {
          setOtpCodes((current) => ({
            ...current,
            [otpKey]: { ...currentOTP, used: true },
          }))
        }

        toast.success('🎉 Phone verified!', {
          description: 'You are now signed in',
          duration: 3000,
        })

        setTimeout(() => {
          onSuccess(currentOTP.phoneNumber)
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

  const formatPhoneDisplay = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    }
    return phone
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
          <DeviceMobile weight="fill" className="text-primary glow-primary" size={40} />
          <ShieldCheck weight="fill" className="text-accent glow-accent" size={32} />
        </motion.div>
        <h2 className="text-3xl font-bold mb-2">SMS Verification</h2>
        <p className="text-muted-foreground">
          Secure sign-in with SMS verification code
        </p>
      </motion.div>

      <Card className="p-6 border-primary/30 bg-card/90 backdrop-blur">
        <AnimatePresence mode="wait">
          {!codeSent ? (
            <motion.form
              key="phone-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSendOTP}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="sms-phone" className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <DeviceMobile weight="fill" size={20} />
                  Phone Number
                </Label>
                <Input
                  id="sms-phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="h-11 bg-background border-primary/30 focus:border-primary"
                  autoComplete="tel"
                  disabled={isLoading}
                  autoFocus
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Include country code (e.g., +1 for US)
                </p>
              </div>

              {!twilioConfig?.accountSid && (
                <Alert className="border-accent/50 bg-accent/10">
                  <Warning weight="fill" className="text-accent" size={18} />
                  <AlertDescription className="ml-2 text-xs">
                    Twilio not configured. SMS will be simulated (check console). Configure in CEO Dashboard → Integrations.
                  </AlertDescription>
                </Alert>
              )}

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
                    <DeviceMobile weight="fill" size={20} />
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
                    Verification code sent to {formatPhoneDisplay(phoneNumber)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code from your SMS
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

                {!twilioConfig?.accountSid && (
                  <Alert className="border-primary/30 bg-background/50">
                    <Warning weight="fill" className="text-primary" size={18} />
                    <AlertDescription className="ml-2 text-xs">
                      In development mode, check the browser console for the verification code
                    </AlertDescription>
                  </Alert>
                )}
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
                    setPhoneNumber('')
                    setOtp(['', '', '', '', '', ''])
                    setAttempts(0)
                  }}
                  className="w-full text-xs"
                >
                  Change Phone Number
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
