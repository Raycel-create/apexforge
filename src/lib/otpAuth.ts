import { ulid } from 'ulid'

export interface OTPCode {
  code: string
  email: string
  createdAt: number
  expiresAt: number
  used: boolean
  attempts: number
  provider: 'email' | 'github'
}

export interface OTPVerification {
  email: string
  verified: boolean
  verifiedAt?: number
  provider: 'email' | 'github'
}

const OTP_EXPIRY = 10 * 60 * 1000
const MAX_ATTEMPTS = 3

export const generateOTP = (email: string, provider: 'email' | 'github' = 'email'): OTPCode => {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const now = Date.now()
  
  return {
    code,
    email,
    createdAt: now,
    expiresAt: now + OTP_EXPIRY,
    used: false,
    attempts: 0,
    provider,
  }
}

export const isOTPValid = (otp: OTPCode): boolean => {
  if (otp.used) return false
  if (Date.now() > otp.expiresAt) return false
  if (otp.attempts >= MAX_ATTEMPTS) return false
  return true
}

export const verifyOTPCode = (otp: OTPCode, code: string): boolean => {
  if (!isOTPValid(otp)) return false
  return otp.code === code
}

export const simulateEmailOTPSend = (email: string, code: string, provider: 'email' | 'github'): Promise<void> => {
  return new Promise((resolve) => {
    const providerText = provider === 'github' ? 'GitHub' : 'Gmail'
    
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║              🔐  ${providerText.toUpperCase()} OTP VERIFICATION CODE               ║
╠════════════════════════════════════════════════════════════════╣
║ To: ${email.padEnd(58)}║
║ From: ApexForge Security <security@apexforge.ai>              ║
║                                                                ║
║ Subject: Your ApexForge Verification Code                     ║
║                                                                ║
║ Your verification code is:                                    ║
║                                                                ║
║                         ${code}                          ║
║                                                                ║
║ This code expires in 10 minutes.                              ║
║ You have 3 attempts to enter the correct code.               ║
║                                                                ║
║ If you didn't request this, please ignore this email.         ║
║                                                                ║
║ 🔒 Sent securely via ${providerText.padEnd(44)}║
╚════════════════════════════════════════════════════════════════╝
    `)
    
    setTimeout(resolve, 500)
  })
}

export const verifyEmail = (email: string, provider: 'email' | 'github'): OTPVerification => {
  return {
    email,
    verified: true,
    verifiedAt: Date.now(),
    provider,
  }
}

export const getTimeRemaining = (expiresAt: number): string => {
  const remaining = expiresAt - Date.now()
  if (remaining <= 0) return 'Expired'
  
  const minutes = Math.floor(remaining / 60000)
  const seconds = Math.floor((remaining % 60000) / 1000)
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export const formatOTPForDisplay = (code: string): string => {
  return code.replace(/(\d{3})(\d{3})/, '$1 $2')
}

export const simulateGitHubOAuth = async (): Promise<{ email: string; name: string; avatar: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockUser = {
        email: `user${Math.floor(Math.random() * 10000)}@github.com`,
        name: `GitHub User ${Math.floor(Math.random() * 1000)}`,
        avatar: `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 100000)}`,
      }
      resolve(mockUser)
    }, 1000)
  })
}

export const getGitHubUser = async (): Promise<{ email: string; name: string; avatar: string } | null> => {
  try {
    const user = await window.spark.user()
    
    if (!user || !user.email) {
      return null
    }

    return {
      email: user.email,
      name: user.login || user.email.split('@')[0],
      avatar: user.avatarUrl || '',
    }
  } catch (error) {
    console.error('GitHub user fetch error:', error)
    return null
  }
}
