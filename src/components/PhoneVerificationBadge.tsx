import { CheckCircle, ShieldCheck, Phone } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface PhoneVerificationBadgeProps {
  verified: boolean
  phoneNumber?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  variant?: 'default' | 'premium' | 'minimal'
  className?: string
}

export function PhoneVerificationBadge({
  verified,
  phoneNumber,
  size = 'md',
  showLabel = true,
  variant = 'default',
  className
}: PhoneVerificationBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1 gap-1',
    md: 'text-sm px-3 py-1.5 gap-1.5',
    lg: 'text-base px-4 py-2 gap-2'
  }

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  }

  if (variant === 'minimal') {
    return (
      <div className={cn('inline-flex items-center gap-1', className)}>
        {verified ? (
          <>
            <CheckCircle size={iconSizes[size]} weight="fill" className="text-accent" />
            {showLabel && (
              <span className="text-xs text-muted-foreground">Verified</span>
            )}
          </>
        ) : (
          <>
            <Phone size={iconSizes[size]} className="text-muted-foreground" />
            {showLabel && (
              <span className="text-xs text-muted-foreground">Not Verified</span>
            )}
          </>
        )}
      </div>
    )
  }

  if (variant === 'premium') {
    return (
      <div
        className={cn(
          'inline-flex items-center rounded-full font-medium',
          sizeClasses[size],
          verified
            ? 'bg-gradient-to-r from-accent/20 to-primary/20 text-accent border border-accent/30'
            : 'bg-muted text-muted-foreground border border-border',
          className
        )}
      >
        {verified ? (
          <>
            <ShieldCheck size={iconSizes[size]} weight="fill" />
            {showLabel && <span>Phone Verified</span>}
            {phoneNumber && <span className="opacity-70">• {phoneNumber}</span>}
          </>
        ) : (
          <>
            <Phone size={iconSizes[size]} />
            {showLabel && <span>Verify Phone</span>}
          </>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md font-medium',
        sizeClasses[size],
        verified
          ? 'bg-accent/10 text-accent border border-accent/20'
          : 'bg-muted/50 text-muted-foreground border border-border',
        className
      )}
    >
      {verified ? (
        <>
          <CheckCircle size={iconSizes[size]} weight="fill" />
          {showLabel && <span>Verified</span>}
          {phoneNumber && <span className="opacity-70 ml-1">({phoneNumber})</span>}
        </>
      ) : (
        <>
          <Phone size={iconSizes[size]} />
          {showLabel && <span>Not Verified</span>}
        </>
      )}
    </div>
  )
}
