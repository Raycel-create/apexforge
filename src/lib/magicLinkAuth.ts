import { ulid } from 'ulid'

export interface MagicLink {
  token: string
  email: string
  createdAt: number
  expiresAt: number
  used: boolean
  userId?: string
}

export interface EmailVerification {
  email: string
  verified: boolean
  verifiedAt?: number
}

const MAGIC_LINK_EXPIRY = 15 * 60 * 1000

export const generateMagicLink = (email: string): MagicLink => {
  const token = ulid()
  const now = Date.now()
  
  return {
    token,
    email,
    createdAt: now,
    expiresAt: now + MAGIC_LINK_EXPIRY,
    used: false,
  }
}

export const isMagicLinkValid = (link: MagicLink): boolean => {
  if (link.used) return false
  if (Date.now() > link.expiresAt) return false
  return true
}

export const formatMagicLinkUrl = (token: string): string => {
  const baseUrl = window.location.origin
  return `${baseUrl}/?magic_token=${token}`
}

export const simulateEmailSend = (email: string, magicLinkUrl: string): Promise<void> => {
  return new Promise((resolve) => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                   ✉️  MAGIC LINK EMAIL SENT                    ║
╠════════════════════════════════════════════════════════════════╣
║ To: ${email.padEnd(58)}║
║                                                                ║
║ Subject: Sign in to ApexForge                                  ║
║                                                                ║
║ Click the link below to sign in:                              ║
║                                                                ║
║ ${magicLinkUrl.substring(0, 62)}║
${magicLinkUrl.length > 62 ? `║ ${magicLinkUrl.substring(62).padEnd(62)}║` : ''}
║                                                                ║
║ This link expires in 15 minutes.                              ║
║                                                                ║
║ If you didn't request this, please ignore this email.         ║
╚════════════════════════════════════════════════════════════════╝
    `)
    
    setTimeout(resolve, 500)
  })
}

export const verifyEmail = (email: string): EmailVerification => {
  return {
    email,
    verified: true,
    verifiedAt: Date.now(),
  }
}

export const getTimeRemaining = (expiresAt: number): string => {
  const remaining = expiresAt - Date.now()
  if (remaining <= 0) return 'Expired'
  
  const minutes = Math.floor(remaining / 60000)
  const seconds = Math.floor((remaining % 60000) / 1000)
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
