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

export const simulateEmailOTPSend = async (email: string, code: string, provider: 'email' | 'github'): Promise<void> => {
  const providerText = provider === 'github' ? 'GitHub' : 'Gmail'
  
  const { emailService } = await import('./emailService')
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ApexForge Verification Code</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      background-color: #0a0a0a;
      color: #f5f5f5;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #1a1a1a;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
    }
    .header {
      background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      color: #ffffff;
    }
    .content {
      padding: 40px 30px;
      text-align: center;
    }
    .code-container {
      background-color: #262626;
      border: 2px solid #7c3aed;
      border-radius: 12px;
      padding: 30px;
      margin: 30px 0;
    }
    .code {
      font-size: 48px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #ffffff;
      font-family: 'Courier New', monospace;
    }
    .info-box {
      background-color: #1e1b4b;
      border: 1px solid #4f46e5;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      text-align: left;
    }
    .info-item {
      display: flex;
      align-items: center;
      margin: 10px 0;
      color: #e0e7ff;
    }
    .footer {
      padding: 30px;
      text-align: center;
      background-color: #0a0a0a;
      border-top: 1px solid #333;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Verification Code</h1>
    </div>
    
    <div class="content">
      <p style="font-size: 16px; color: #999; margin-bottom: 10px;">
        Your ApexForge verification code is:
      </p>
      
      <div class="code-container">
        <div class="code">${code}</div>
      </div>
      
      <div class="info-box">
        <div class="info-item">⏱️ This code expires in <strong>10 minutes</strong></div>
        <div class="info-item">🔢 You have <strong>3 attempts</strong> to enter the correct code</div>
        <div class="info-item">🔒 Sent securely via <strong>${providerText}</strong></div>
      </div>
      
      <p style="color: #999; font-size: 14px; margin-top: 30px;">
        If you didn't request this code, please ignore this email.
      </p>
    </div>

    <div class="footer">
      <p><strong>ApexForge</strong> - The AI Team That Ships Perfection</p>
      <p>security@apexforge.ai</p>
    </div>
  </div>
</body>
</html>
  `

  const text = `
ApexForge Verification Code

Your verification code is: ${code}

This code expires in 10 minutes.
You have 3 attempts to enter the correct code.
Sent securely via ${providerText}

If you didn't request this code, please ignore this email.

ApexForge - The AI Team That Ships Perfection
security@apexforge.ai
  `

  const result = await emailService.sendEmail({
    to: email,
    subject: 'Your ApexForge Verification Code',
    html,
    text
  })

  if (!result.success) {
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
  }
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
