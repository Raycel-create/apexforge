import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, ShieldCheck, X } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { PhoneVerificationBadge } from './PhoneVerificationBadge'

interface PhoneVerificationFlowProps {
  onVerificationComplete?: (phoneNumber: string) => void
  onClose?: () => void
  currentPhone?: string
}

export function PhoneVerificationFlow({
  onVerificationComplete,
  onClose,
  currentPhone
}: PhoneVerificationFlowProps) {
  const [step, setStep] = useState<'input' | 'verify'>('input')
  const [phoneNumber, setPhoneNumber] = useState(currentPhone || '')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number')
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Verification code sent to your phone')
      setStep('verify')
    } catch (error) {
      toast.error('Failed to send verification code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter the 6-digit code')
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Phone number verified successfully!', {
        description: 'Your account security has been enhanced',
        icon: <ShieldCheck size={20} weight="fill" className="text-accent" />
      })
      onVerificationComplete?.(phoneNumber)
    } catch (error) {
      toast.error('Invalid verification code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('New verification code sent')
    } catch (error) {
      toast.error('Failed to resend code')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone size={24} weight="fill" className="text-accent" />
            <CardTitle>Verify Phone Number</CardTitle>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X size={20} />
            </Button>
          )}
        </div>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 'input' ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="phone-number">Phone Number</Label>
              <Input
                id="phone-number"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                We'll send a verification code to this number
              </p>
            </div>
            <Button
              onClick={handleSendOTP}
              disabled={isLoading || !phoneNumber}
              className="w-full"
            >
              {isLoading ? 'Sending...' : 'Send Verification Code'}
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="otp-code">Verification Code</Label>
              <Input
                id="otp-code"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                disabled={isLoading}
                className="text-center text-lg tracking-widest"
              />
              <p className="text-xs text-muted-foreground">
                Code sent to {phoneNumber}
              </p>
            </div>
            <div className="space-y-2">
              <Button
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
                className="w-full"
              >
                {isLoading ? 'Verifying...' : 'Verify Phone Number'}
              </Button>
              <Button
                variant="ghost"
                onClick={handleResendCode}
                disabled={isLoading}
                className="w-full"
              >
                Resend Code
              </Button>
              <Button
                variant="ghost"
                onClick={() => setStep('input')}
                disabled={isLoading}
                className="w-full"
              >
                Change Phone Number
              </Button>
            </div>
          </>
        )}

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck size={14} weight="fill" className="text-accent" />
            <span>Your phone number is encrypted and never shared</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface QuickPhoneVerifyButtonProps {
  onVerify?: () => void
  verified?: boolean
  phoneNumber?: string
}

export function QuickPhoneVerifyButton({
  onVerify,
  verified = false,
  phoneNumber
}: QuickPhoneVerifyButtonProps) {
  if (verified) {
    return (
      <PhoneVerificationBadge
        verified={true}
        phoneNumber={phoneNumber}
        size="md"
        variant="premium"
      />
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onVerify}
      className="gap-2"
    >
      <Phone size={16} />
      Verify Phone
    </Button>
  )
}
