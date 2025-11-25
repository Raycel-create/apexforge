export interface OTPCode {
  code: string
  email: string
  phoneNumber?: string
  createdAt: number
  expiresAt: number
  used: boolean
  attempts: number
  provider: 'email' | 'sms' | 'github'
  sessionId: string
}

export interface OTPVerification {
  email?: string
  phoneNumber?: string
  verifiedAt: number
  provider: 'email' | 'sms' | 'github'
  sessionId: string
  isActive: boolean
}

export interface OTPAttempt {
  code: string
  timestamp: number
  success: boolean
  ipAddress?: string
}

export interface OTPSession {
  sessionId: string
  identifier: string
  provider: 'email' | 'sms' | 'github'
  attempts: OTPAttempt[]
  createdAt: number
  lastAttemptAt: number
  locked: boolean
  lockExpiresAt?: number
}

const OTP_EXPIRY_TIME = 10 * 60 * 1000
const MAX_ATTEMPTS = 3
const LOCKOUT_TIME = 15 * 60 * 1000
const OTP_LENGTH = 6

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

export function generateOTPCode(
  identifier: string,
  provider: 'email' | 'sms' | 'github' = 'email'
): OTPCode {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const now = Date.now()
  
  return {
    code,
    email: provider === 'email' || provider === 'github' ? identifier : '',
    phoneNumber: provider === 'sms' ? identifier : undefined,
    createdAt: now,
    expiresAt: now + OTP_EXPIRY_TIME,
    used: false,
    attempts: 0,
    provider,
    sessionId: generateSessionId(),
  }
}

export function isOTPExpired(otp: OTPCode): boolean {
  return Date.now() > otp.expiresAt
}

export function isOTPValid(otp: OTPCode): boolean {
  return !otp.used && !isOTPExpired(otp) && otp.attempts < MAX_ATTEMPTS
}

export function verifyOTPCode(otp: OTPCode, inputCode: string): boolean {
  if (!isOTPValid(otp)) {
    return false
  }
  
  return otp.code === inputCode.trim()
}

export function getTimeRemaining(expiresAt: number): string {
  const remaining = expiresAt - Date.now()
  
  if (remaining <= 0) {
    return 'Expired'
  }
  
  const minutes = Math.floor(remaining / 60000)
  const seconds = Math.floor((remaining % 60000) / 1000)
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function getTimeRemainingMs(expiresAt: number): number {
  return Math.max(0, expiresAt - Date.now())
}

export function formatOTPForDisplay(code: string): string {
  return code.split('').join(' ')
}

export async function sendOTPEmail(
  email: string,
  code: string,
  provider: 'email' | 'github' = 'email'
): Promise<{ success: boolean; message: string }> {
  const providerName = provider === 'github' ? 'GitHub' : 'Email'
  
  console.group(`📧 ${providerName} OTP Verification`)
  console.log(`To: ${email}`)
  console.log(`Code: ${code}`)
  console.log(`Formatted: ${formatOTPForDisplay(code)}`)
  console.log(`Expires in: 10 minutes`)
  console.groupEnd()

  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    success: true,
    message: `OTP sent to ${email} via ${providerName}`,
  }
}

export async function sendOTPSMS(
  phoneNumber: string,
  code: string
): Promise<{ success: boolean; message: string }> {
  console.group('📱 SMS OTP Verification')
  console.log(`To: ${phoneNumber}`)
  console.log(`Code: ${code}`)
  console.log(`Formatted: ${formatOTPForDisplay(code)}`)
  console.log(`Expires in: 10 minutes`)
  console.groupEnd()

  await new Promise(resolve => setTimeout(resolve, 1500))
  
  return {
    success: true,
    message: `OTP sent to ${phoneNumber} via SMS`,
  }
}

export function createVerification(
  identifier: string,
  provider: 'email' | 'sms' | 'github',
  sessionId: string
): OTPVerification {
  return {
    email: provider === 'email' || provider === 'github' ? identifier : undefined,
    phoneNumber: provider === 'sms' ? identifier : undefined,
    verifiedAt: Date.now(),
    provider,
    sessionId,
    isActive: true,
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length >= 10 && cleaned.length <= 15
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 10) {
    return `+1${cleaned}`
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`
  } else if (cleaned.startsWith('+')) {
    return phone
  } else {
    return `+${cleaned}`
  }
}

export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@')
  if (!localPart || !domain) return email
  
  const visibleChars = Math.min(3, Math.floor(localPart.length / 2))
  const masked = localPart.substring(0, visibleChars) + '***'
  
  return `${masked}@${domain}`
}

export function maskPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length < 4) return phone
  
  const lastFour = cleaned.slice(-4)
  const masked = '*'.repeat(cleaned.length - 4)
  
  return `+${masked}${lastFour}`
}

export function isSessionLocked(session: OTPSession): boolean {
  if (!session.locked) return false
  
  if (session.lockExpiresAt && Date.now() > session.lockExpiresAt) {
    return false
  }
  
  return true
}

export function shouldLockSession(session: OTPSession): boolean {
  const failedAttempts = session.attempts.filter(a => !a.success).length
  return failedAttempts >= MAX_ATTEMPTS
}

export function createSession(
  identifier: string,
  provider: 'email' | 'sms' | 'github'
): OTPSession {
  return {
    sessionId: generateSessionId(),
    identifier,
    provider,
    attempts: [],
    createdAt: Date.now(),
    lastAttemptAt: Date.now(),
    locked: false,
  }
}

export function addAttemptToSession(
  session: OTPSession,
  code: string,
  success: boolean
): OTPSession {
  const attempt: OTPAttempt = {
    code,
    timestamp: Date.now(),
    success,
  }
  
  const updatedSession: OTPSession = {
    ...session,
    attempts: [...session.attempts, attempt],
    lastAttemptAt: Date.now(),
  }
  
  if (shouldLockSession(updatedSession)) {
    updatedSession.locked = true
    updatedSession.lockExpiresAt = Date.now() + LOCKOUT_TIME
  }
  
  return updatedSession
}

export function getRemainingAttempts(session: OTPSession): number {
  const failedAttempts = session.attempts.filter(a => !a.success).length
  return Math.max(0, MAX_ATTEMPTS - failedAttempts)
}

export function getLockoutTimeRemaining(session: OTPSession): string {
  if (!session.locked || !session.lockExpiresAt) {
    return '0:00'
  }
  
  return getTimeRemaining(session.lockExpiresAt)
}

export interface RateLimitConfig {
  maxAttempts: number
  windowMs: number
}

export function checkRateLimit(
  attempts: OTPAttempt[],
  config: RateLimitConfig = { maxAttempts: 5, windowMs: 60000 }
): { allowed: boolean; remainingAttempts: number; resetAt: number } {
  const now = Date.now()
  const windowStart = now - config.windowMs
  
  const recentAttempts = attempts.filter(a => a.timestamp > windowStart)
  const remainingAttempts = Math.max(0, config.maxAttempts - recentAttempts.length)
  const allowed = remainingAttempts > 0
  
  const resetAt = recentAttempts.length > 0 
    ? recentAttempts[0].timestamp + config.windowMs 
    : now
  
  return {
    allowed,
    remainingAttempts,
    resetAt,
  }
}

export async function resendOTP(
  oldOTP: OTPCode,
  identifier: string
): Promise<OTPCode> {
  const newOTP = generateOTPCode(identifier, oldOTP.provider)
  
  if (oldOTP.provider === 'sms') {
    await sendOTPSMS(identifier, newOTP.code)
  } else {
    await sendOTPEmail(identifier, newOTP.code, oldOTP.provider)
  }
  
  return newOTP
}

export function getOTPStats(otpCodes: Record<string, OTPCode>) {
  const codes = Object.values(otpCodes)
  
  return {
    total: codes.length,
    active: codes.filter(c => isOTPValid(c)).length,
    expired: codes.filter(c => isOTPExpired(c)).length,
    used: codes.filter(c => c.used).length,
    byProvider: {
      email: codes.filter(c => c.provider === 'email').length,
      sms: codes.filter(c => c.provider === 'sms').length,
      github: codes.filter(c => c.provider === 'github').length,
    },
  }
}

export function cleanupExpiredOTPs(
  otpCodes: Record<string, OTPCode>
): Record<string, OTPCode> {
  const now = Date.now()
  const cleanupThreshold = 24 * 60 * 60 * 1000
  
  return Object.fromEntries(
    Object.entries(otpCodes).filter(([_, otp]) => {
      return now - otp.createdAt < cleanupThreshold
    })
  )
}
