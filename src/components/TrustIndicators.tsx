import { Shield, Lock, CheckCircle, Phone, Certificate, ClockCounterClockwise } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface TrustIndicatorProps {
  type: 'security' | 'verified' | 'encrypted' | 'phone' | 'certified' | 'uptime'
  label?: string
  value?: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
  variant?: 'default' | 'compact' | 'detailed'
  className?: string
}

export function TrustIndicator({
  type,
  label,
  value,
  size = 'md',
  showIcon = true,
  variant = 'default',
  className
}: TrustIndicatorProps) {
  const icons = {
    security: Shield,
    verified: CheckCircle,
    encrypted: Lock,
    phone: Phone,
    certified: Certificate,
    uptime: ClockCounterClockwise
  }

  const labels = {
    security: 'Secure',
    verified: 'Verified',
    encrypted: 'Encrypted',
    phone: 'Phone Verified',
    certified: 'Certified',
    uptime: '99.9% Uptime'
  }

  const Icon = icons[type]
  const displayLabel = label || labels[type]

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  }

  if (variant === 'compact') {
    return (
      <div className={cn('inline-flex items-center gap-1.5', sizeClasses[size], className)}>
        {showIcon && <Icon size={iconSizes[size]} weight="fill" className="text-accent" />}
        <span className="text-foreground/80">{displayLabel}</span>
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <div className={cn('flex items-start gap-3 p-3 rounded-lg bg-card border border-border', className)}>
        {showIcon && (
          <div className="mt-0.5">
            <Icon size={iconSizes[size]} weight="fill" className="text-accent" />
          </div>
        )}
        <div className="flex-1">
          <div className={cn('font-medium text-foreground', sizeClasses[size])}>{displayLabel}</div>
          {value && (
            <div className="text-xs text-muted-foreground mt-0.5">{value}</div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-accent/10 border border-accent/20', className)}>
      {showIcon && <Icon size={iconSizes[size]} weight="fill" className="text-accent" />}
      <span className={cn('text-accent font-medium', sizeClasses[size])}>{displayLabel}</span>
      {value && (
        <span className={cn('text-muted-foreground', sizeClasses[size])}>• {value}</span>
      )}
    </div>
  )
}

interface TrustBannerProps {
  className?: string
}

export function TrustBanner({ className }: TrustBannerProps) {
  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-4 py-4 px-6', className)}>
      <TrustIndicator type="security" variant="compact" size="sm" />
      <TrustIndicator type="encrypted" variant="compact" size="sm" />
      <TrustIndicator type="uptime" variant="compact" size="sm" />
      <TrustIndicator type="certified" label="ISO Certified" variant="compact" size="sm" />
    </div>
  )
}

interface SecurityBadgeProps {
  className?: string
}

export function SecurityBadge({ className }: SecurityBadgeProps) {
  return (
    <div className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30', className)}>
      <Shield size={20} weight="fill" className="text-accent" />
      <div>
        <div className="text-sm font-semibold text-accent">Enterprise Security</div>
        <div className="text-xs text-muted-foreground">Bank-level encryption</div>
      </div>
    </div>
  )
}

interface VerificationStatusProps {
  phoneVerified: boolean
  emailVerified: boolean
  twoFactorEnabled: boolean
  className?: string
}

export function VerificationStatus({
  phoneVerified,
  emailVerified,
  twoFactorEnabled,
  className
}: VerificationStatusProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Phone size={16} weight={phoneVerified ? 'fill' : 'regular'} className={phoneVerified ? 'text-accent' : 'text-muted-foreground'} />
          <span className="text-sm">Phone Number</span>
        </div>
        {phoneVerified ? (
          <CheckCircle size={18} weight="fill" className="text-accent" />
        ) : (
          <span className="text-xs text-muted-foreground">Not verified</span>
        )}
      </div>
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Certificate size={16} weight={emailVerified ? 'fill' : 'regular'} className={emailVerified ? 'text-accent' : 'text-muted-foreground'} />
          <span className="text-sm">Email Address</span>
        </div>
        {emailVerified ? (
          <CheckCircle size={18} weight="fill" className="text-accent" />
        ) : (
          <span className="text-xs text-muted-foreground">Not verified</span>
        )}
      </div>
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Shield size={16} weight={twoFactorEnabled ? 'fill' : 'regular'} className={twoFactorEnabled ? 'text-accent' : 'text-muted-foreground'} />
          <span className="text-sm">Two-Factor Auth</span>
        </div>
        {twoFactorEnabled ? (
          <CheckCircle size={18} weight="fill" className="text-accent" />
        ) : (
          <span className="text-xs text-muted-foreground">Not enabled</span>
        )}
      </div>
    </div>
  )
}
