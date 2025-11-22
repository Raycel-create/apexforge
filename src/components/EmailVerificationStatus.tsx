import { Badge } from './ui/badge'
import { Check, Warning, EnvelopeSimple } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import type { EmailVerification } from '../lib/magicLinkAuth'

interface EmailVerificationStatusProps {
  email: string
  className?: string
}

export function EmailVerificationStatus({ email, className }: EmailVerificationStatusProps) {
  const [verifications] = useKV<Record<string, EmailVerification>>('apexforge-verifications', {})
  
  const verification = verifications?.[email]
  const isVerified = verification?.verified || false

  if (!email) return null

  return (
    <div className={className}>
      {isVerified ? (
        <Badge variant="outline" className="border-accent/50 bg-accent/10 text-accent">
          <Check weight="bold" size={14} className="mr-1" />
          Email Verified
        </Badge>
      ) : (
        <Badge variant="outline" className="border-muted-foreground/30 bg-muted/30">
          <Warning weight="fill" size={14} className="mr-1" />
          Unverified
        </Badge>
      )}
    </div>
  )
}

interface EmailVerificationBannerProps {
  email: string
  onVerifyClick: () => void
}

export function EmailVerificationBanner({ email, onVerifyClick }: EmailVerificationBannerProps) {
  const [verifications] = useKV<Record<string, EmailVerification>>('apexforge-verifications', {})
  
  const verification = verifications?.[email]
  const isVerified = verification?.verified || false

  if (isVerified || !email) return null

  return (
    <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 flex items-start gap-3">
      <EnvelopeSimple weight="fill" className="text-primary flex-shrink-0 mt-0.5" size={20} />
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm mb-1">Verify your email</h4>
        <p className="text-xs text-muted-foreground mb-2">
          Get a magic link sent to <span className="font-semibold text-foreground">{email}</span> to verify your account
        </p>
        <button
          onClick={onVerifyClick}
          className="text-xs font-semibold text-primary hover:underline"
        >
          Send verification link →
        </button>
      </div>
    </div>
  )
}
