import { useState } from 'react'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import { getGitHubUser, generateOTP, simulateEmailOTPSend } from '../lib/otpAuth'

interface GitHubOTPButtonProps {
  onCodeSent: (email: string) => void
  mode: 'signin' | 'signup'
}

export function GitHubOTPButton({ onCodeSent, mode }: GitHubOTPButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [otpCodes, setOtpCodes] = useKV<Record<string, any>>('apexforge-otp-codes', {})

  const handleGitHubOTP = async () => {
    setIsLoading(true)

    try {
      const user = await getGitHubUser()
      
      if (!user || !user.email) {
        toast.error('GitHub Authentication Failed', {
          description: 'Unable to get your GitHub email address',
        })
        setIsLoading(false)
        return
      }

      const otpData = generateOTP(user.email, 'github')
      const otpKey = `${user.email}-${Date.now()}`

      setOtpCodes((current) => ({
        ...current,
        [otpKey]: otpData,
      }))

      await simulateEmailOTPSend(user.email, otpData.code, 'github')

      toast.success('Verification code sent! 🔐', {
        description: `Check ${user.email} (or console in dev mode)`,
        duration: 5000,
      })

      onCodeSent(user.email)
    } catch (error) {
      console.error('GitHub OTP error:', error)
      toast.error('Authentication Error', {
        description: 'Failed to authenticate with GitHub. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full h-12 border-2"
      onClick={handleGitHubOTP}
      disabled={isLoading}
    >
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
      {isLoading
        ? 'Authenticating...'
        : mode === 'signup'
        ? 'Sign up with GitHub OTP'
        : 'Sign in with GitHub OTP'}
    </Button>
  )
}
