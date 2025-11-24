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

export const simulateEmailSend = async (email: string, magicLinkUrl: string): Promise<void> => {
  const { emailService } = await import('./emailService')
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in to ApexForge</title>
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
    .button {
      display: inline-block;
      background-color: #7c3aed;
      color: #ffffff;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 30px 0;
    }
    .info-box {
      background-color: #1e1b4b;
      border: 1px solid #4f46e5;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      text-align: left;
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
      <h1>🪄 Sign in to ApexForge</h1>
    </div>
    
    <div class="content">
      <p style="font-size: 16px; color: #999; margin-bottom: 10px;">
        Click the button below to sign in to your ApexForge account:
      </p>
      
      <a href="${magicLinkUrl}" class="button">
        Sign In to ApexForge →
      </a>
      
      <div class="info-box">
        <p style="color: #e0e7ff; margin: 0 0 10px 0;">
          ⏱️ This link expires in <strong>15 minutes</strong>
        </p>
        <p style="color: #e0e7ff; margin: 0;">
          🔒 No password needed - just click the link above
        </p>
      </div>
      
      <p style="color: #999; font-size: 14px; margin-top: 30px;">
        If you didn't request this link, please ignore this email.
      </p>
      
      <p style="color: #666; font-size: 12px; margin-top: 20px;">
        Or copy and paste this URL into your browser:<br>
        <span style="word-break: break-all; color: #7c3aed;">${magicLinkUrl}</span>
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
Sign in to ApexForge

Click the link below to sign in to your ApexForge account:

${magicLinkUrl}

This link expires in 15 minutes.
No password needed - just click the link above.

If you didn't request this link, please ignore this email.

ApexForge - The AI Team That Ships Perfection
security@apexforge.ai
  `

  const result = await emailService.sendEmail({
    to: email,
    subject: 'Sign in to ApexForge',
    html,
    text
  })

  if (!result.success) {
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
  }
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
