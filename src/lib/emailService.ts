export type EmailProvider = 'sendgrid' | 'aws-ses' | 'development'

export interface EmailConfig {
  provider: EmailProvider
  sendgridApiKey?: string
  awsSesAccessKeyId?: string
  awsSesSecretAccessKey?: string
  awsSesRegion?: string
  fromEmail: string
  fromName: string
}

export interface EmailPayload {
  to: string
  subject: string
  html: string
  text?: string
}

export interface EmailResponse {
  success: boolean
  messageId?: string
  error?: string
}

class EmailService {
  private readonly CONFIG_KEY = 'email-service-config'

  async getConfig(): Promise<EmailConfig | null> {
    const config = await window.spark.kv.get<EmailConfig>(this.CONFIG_KEY)
    return config || null
  }

  async saveConfig(config: EmailConfig): Promise<void> {
    await window.spark.kv.set(this.CONFIG_KEY, config)
  }

  async validateConfig(config: EmailConfig): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = []

    if (!config.fromEmail) {
      errors.push('From email address is required')
    } else if (!this.isValidEmail(config.fromEmail)) {
      errors.push('From email address is invalid')
    }

    if (!config.fromName) {
      errors.push('From name is required')
    }

    if (config.provider === 'sendgrid') {
      if (!config.sendgridApiKey) {
        errors.push('SendGrid API key is required')
      } else if (!config.sendgridApiKey.startsWith('SG.')) {
        errors.push('SendGrid API key appears to be invalid (should start with "SG.")')
      }
    }

    if (config.provider === 'aws-ses') {
      if (!config.awsSesAccessKeyId) {
        errors.push('AWS Access Key ID is required')
      }
      if (!config.awsSesSecretAccessKey) {
        errors.push('AWS Secret Access Key is required')
      }
      if (!config.awsSesRegion) {
        errors.push('AWS Region is required')
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  async sendEmail(payload: EmailPayload, config?: EmailConfig): Promise<EmailResponse> {
    const emailConfig = config || await this.getConfig()

    if (!emailConfig) {
      return {
        success: false,
        error: 'Email service is not configured. Please set up SendGrid or AWS SES.'
      }
    }

    const validation = await this.validateConfig(emailConfig)
    if (!validation.valid) {
      return {
        success: false,
        error: `Configuration error: ${validation.errors.join(', ')}`
      }
    }

    if (!this.isValidEmail(payload.to)) {
      return {
        success: false,
        error: 'Recipient email address is invalid'
      }
    }

    try {
      switch (emailConfig.provider) {
        case 'sendgrid':
          return await this.sendViaSendGrid(payload, emailConfig)
        case 'aws-ses':
          return await this.sendViaAwsSes(payload, emailConfig)
        case 'development':
          return this.sendViaDevelopment(payload, emailConfig)
        default:
          return {
            success: false,
            error: 'Invalid email provider'
          }
      }
    } catch (error) {
      console.error('Email send error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email'
      }
    }
  }

  private async sendViaSendGrid(payload: EmailPayload, config: EmailConfig): Promise<EmailResponse> {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.sendgridApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: payload.to }],
            subject: payload.subject
          }],
          from: {
            email: config.fromEmail,
            name: config.fromName
          },
          content: [
            {
              type: 'text/html',
              value: payload.html
            },
            ...(payload.text ? [{
              type: 'text/plain',
              value: payload.text
            }] : [])
          ]
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.errors?.[0]?.message || `SendGrid API error: ${response.status}`)
      }

      const messageId = response.headers.get('x-message-id') || undefined

      await this.logEmailSent({
        ...payload,
        provider: 'sendgrid',
        messageId,
        sentAt: new Date().toISOString()
      })

      return {
        success: true,
        messageId
      }
    } catch (error) {
      console.error('SendGrid error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'SendGrid send failed'
      }
    }
  }

  private async sendViaAwsSes(payload: EmailPayload, config: EmailConfig): Promise<EmailResponse> {
    try {
      const timestamp = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '')
      const date = timestamp.slice(0, 8)
      
      const credentials = {
        accessKeyId: config.awsSesAccessKeyId!,
        secretAccessKey: config.awsSesSecretAccessKey!,
        region: config.awsSesRegion!
      }

      const params = new URLSearchParams({
        Action: 'SendEmail',
        'Source': `${config.fromName} <${config.fromEmail}>`,
        'Destination.ToAddresses.member.1': payload.to,
        'Message.Subject.Data': payload.subject,
        'Message.Body.Html.Data': payload.html,
        ...(payload.text && { 'Message.Body.Text.Data': payload.text })
      })

      const endpoint = `https://email.${credentials.region}.amazonaws.com/`
      const canonicalRequest = this.createCanonicalRequest('POST', '/', params.toString())
      const signature = await this.signAwsRequest(
        canonicalRequest,
        credentials,
        timestamp,
        date
      )

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': signature,
          'X-Amz-Date': timestamp
        },
        body: params.toString()
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`AWS SES error: ${response.status} - ${errorText}`)
      }

      const responseText = await response.text()
      const messageIdMatch = responseText.match(/<MessageId>(.*?)<\/MessageId>/)
      const messageId = messageIdMatch ? messageIdMatch[1] : undefined

      await this.logEmailSent({
        ...payload,
        provider: 'aws-ses',
        messageId,
        sentAt: new Date().toISOString()
      })

      return {
        success: true,
        messageId
      }
    } catch (error) {
      console.error('AWS SES error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'AWS SES send failed'
      }
    }
  }

  private sendViaDevelopment(payload: EmailPayload, config: EmailConfig): EmailResponse {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                   📧 DEVELOPMENT EMAIL                         ║
╠════════════════════════════════════════════════════════════════╣
║ From: ${config.fromName} <${config.fromEmail}>
║ To: ${payload.to}
║ Subject: ${payload.subject}
║                                                                ║
║ HTML Content:                                                  ║
║ ${payload.html.substring(0, 200)}...
║                                                                ║
║ ✓ Email logged (not actually sent in development mode)        ║
╚════════════════════════════════════════════════════════════════╝
    `)

    const messageId = `dev-${Date.now()}`

    this.logEmailSent({
      ...payload,
      provider: 'development',
      messageId,
      sentAt: new Date().toISOString()
    })

    return {
      success: true,
      messageId
    }
  }

  private createCanonicalRequest(method: string, path: string, body: string): string {
    const hashedPayload = this.sha256(body)
    return `${method}\n${path}\n\nhost\n\n${hashedPayload}`
  }

  private async signAwsRequest(
    canonicalRequest: string,
    credentials: { accessKeyId: string; secretAccessKey: string; region: string },
    timestamp: string,
    date: string
  ): Promise<string> {
    const algorithm = 'AWS4-HMAC-SHA256'
    const credentialScope = `${date}/${credentials.region}/ses/aws4_request`
    const stringToSign = `${algorithm}\n${timestamp}\n${credentialScope}\n${this.sha256(canonicalRequest)}`

    const signingKey = await this.getSignatureKey(
      credentials.secretAccessKey,
      date,
      credentials.region,
      'ses'
    )

    const signature = await this.hmacSha256(signingKey, stringToSign)

    return `${algorithm} Credential=${credentials.accessKeyId}/${credentialScope}, SignedHeaders=host, Signature=${signature}`
  }

  private async getSignatureKey(
    key: string,
    dateStamp: string,
    regionName: string,
    serviceName: string
  ): Promise<string> {
    const kDate = await this.hmacSha256('AWS4' + key, dateStamp)
    const kRegion = await this.hmacSha256(kDate, regionName)
    const kService = await this.hmacSha256(kRegion, serviceName)
    const kSigning = await this.hmacSha256(kService, 'aws4_request')
    return kSigning
  }

  private async hmacSha256(key: string, data: string): Promise<string> {
    const encoder = new TextEncoder()
    const keyData = typeof key === 'string' ? encoder.encode(key) : key
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData as BufferSource,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(data))
    return Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  private sha256(data: string): string {
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(16)
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  private async logEmailSent(logEntry: any): Promise<void> {
    const logs = await window.spark.kv.get<any[]>('email-send-log') || []
    logs.unshift({
      ...logEntry,
      timestamp: new Date().toISOString()
    })
    await window.spark.kv.set('email-send-log', logs.slice(0, 100))
  }

  async getEmailLogs(limit: number = 50): Promise<any[]> {
    const logs = await window.spark.kv.get<any[]>('email-send-log') || []
    return logs.slice(0, limit)
  }

  async clearLogs(): Promise<void> {
    await window.spark.kv.delete('email-send-log')
  }
}

export const emailService = new EmailService()
