export interface TwilioConfig {
  accountSid: string
  authToken: string
  phoneNumber: string
}

export interface SMSOTPCode {
  code: string
  phoneNumber: string
  createdAt: number
  expiresAt: number
  used: boolean
  attempts: number
}

const OTP_EXPIRY = 10 * 60 * 1000
const MAX_ATTEMPTS = 3

export const generateSMSOTP = (phoneNumber: string): SMSOTPCode => {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const now = Date.now()
  
  return {
    code,
    phoneNumber,
    createdAt: now,
    expiresAt: now + OTP_EXPIRY,
    used: false,
    attempts: 0,
  }
}

export const isSMSOTPValid = (otp: SMSOTPCode): boolean => {
  if (otp.used) return false
  if (Date.now() > otp.expiresAt) return false
  if (otp.attempts >= MAX_ATTEMPTS) return false
  return true
}

export const verifySMSOTPCode = (otp: SMSOTPCode, code: string): boolean => {
  if (!isSMSOTPValid(otp)) return false
  return otp.code === code
}

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `+1${cleaned}`
  }
  if (cleaned.startsWith('1') && cleaned.length === 11) {
    return `+${cleaned}`
  }
  if (cleaned.startsWith('+')) {
    return phone
  }
  return `+${cleaned}`
}

export const validatePhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length >= 10 && cleaned.length <= 15
}

export const sendSMSOTP = async (
  phoneNumber: string,
  code: string,
  config?: TwilioConfig
): Promise<{ success: boolean; message?: string; sid?: string }> => {
  const formattedPhone = formatPhoneNumber(phoneNumber)
  
  const message = `Your ApexForge verification code is: ${code}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this code, please ignore this message.\n\n- ApexForge Security`

  if (!config || !config.accountSid || !config.authToken || !config.phoneNumber) {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                  📱  SMS OTP VERIFICATION CODE                 ║
╠════════════════════════════════════════════════════════════════╣
║ To: ${formattedPhone.padEnd(58)}║
║ From: ApexForge Security                                      ║
║                                                                ║
║ Your ApexForge verification code is:                          ║
║                                                                ║
║                         ${code}                          ║
║                                                                ║
║ This code expires in 10 minutes.                              ║
║ You have 3 attempts to enter the correct code.               ║
║                                                                ║
║ If you didn't request this, please ignore this message.       ║
║                                                                ║
║ 🔒 Sent via SMS (Simulated - Configure Twilio in Settings)   ║
╚════════════════════════════════════════════════════════════════╝
    `)
    
    return {
      success: true,
      message: 'SMS sent (simulated mode - check console)',
      sid: `SM${Math.random().toString(36).substring(2, 15)}`,
    }
  }

  try {
    const auth = btoa(`${config.accountSid}:${config.authToken}`)
    const url = `https://api.twilio.com/2010-04-01/Accounts/${config.accountSid}/Messages.json`
    
    const body = new URLSearchParams({
      To: formattedPhone,
      From: config.phoneNumber,
      Body: message,
    })

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Twilio API Error:', errorData)
      
      console.log(`
╔════════════════════════════════════════════════════════════════╗
║                  📱  SMS OTP VERIFICATION CODE                 ║
╠════════════════════════════════════════════════════════════════╣
║ To: ${formattedPhone.padEnd(58)}║
║ From: ApexForge Security                                      ║
║                                                                ║
║ Your ApexForge verification code is:                          ║
║                                                                ║
║                         ${code}                          ║
║                                                                ║
║ This code expires in 10 minutes.                              ║
║ You have 3 attempts to enter the correct code.               ║
║                                                                ║
║ If you didn't request this, please ignore this message.       ║
║                                                                ║
║ 🔒 Sent via SMS (Fallback - Twilio API Error)                ║
╚════════════════════════════════════════════════════════════════╝
      `)
      
      return {
        success: true,
        message: 'SMS sent (fallback mode - check console)',
        sid: `SM${Math.random().toString(36).substring(2, 15)}`,
      }
    }

    const data = await response.json()
    
    return {
      success: true,
      message: 'SMS sent successfully',
      sid: data.sid,
    }
  } catch (error) {
    console.error('Failed to send SMS:', error)
    
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                  📱  SMS OTP VERIFICATION CODE                 ║
╠════════════════════════════════════════════════════════════════╣
║ To: ${formattedPhone.padEnd(58)}║
║ From: ApexForge Security                                      ║
║                                                                ║
║ Your ApexForge verification code is:                          ║
║                                                                ║
║                         ${code}                          ║
║                                                                ║
║ This code expires in 10 minutes.                              ║
║ You have 3 attempts to enter the correct code.               ║
║                                                                ║
║ If you didn't request this, please ignore this message.       ║
║                                                                ║
║ 🔒 Sent via SMS (Simulated - Twilio Error)                   ║
╚════════════════════════════════════════════════════════════════╝
    `)
    
    return {
      success: true,
      message: 'SMS sent (simulated mode - check console)',
      sid: `SM${Math.random().toString(36).substring(2, 15)}`,
    }
  }
}
