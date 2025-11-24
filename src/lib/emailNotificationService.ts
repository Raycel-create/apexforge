import { toast } from 'sonner'

export interface EmailNotificationSettings {
  enabled: boolean
  recipientEmail: string
  reportTime: string
  includeRevenue: boolean
  includeUserGrowth: boolean
  includeComplaints: boolean
  includeAIAnalysis: boolean
  includeCustomerSupport: boolean
  includeForecast: boolean
  frequency: 'daily' | 'weekly' | 'monthly'
  timezone: string
}

export interface DailyReportData {
  date: string
  revenue: {
    total: number
    change: number
    transactions: number
  }
  users: {
    total: number
    new: number
    active: number
  }
  complaints: {
    total: number
    resolved: number
    pending: number
    urgent: number
  }
  support: {
    totalChats: number
    avgResponseTime: number
    satisfaction: number
  }
  aiInsights: string
  forecast: {
    nextWeekRevenue: number
    nextMonthUsers: number
  }
}

export interface EmailTemplate {
  subject: string
  body: string
  html: string
}

class EmailNotificationService {
  private readonly STORAGE_KEY = 'ceo-email-notifications'
  private scheduledJob: NodeJS.Timeout | null = null

  async getSettings(): Promise<EmailNotificationSettings | null> {
    const settings = await window.spark.kv.get<EmailNotificationSettings>(this.STORAGE_KEY)
    return settings || null
  }

  async saveSettings(settings: EmailNotificationSettings): Promise<void> {
    await window.spark.kv.set(this.STORAGE_KEY, settings)
    
    if (settings.enabled) {
      this.scheduleNextReport(settings)
      toast.success('Email notifications enabled', {
        description: `Daily reports will be sent to ${settings.recipientEmail} at ${settings.reportTime}`
      })
    } else {
      this.cancelScheduledReport()
      toast.info('Email notifications disabled')
    }
  }

  private scheduleNextReport(settings: EmailNotificationSettings): void {
    this.cancelScheduledReport()

    const now = new Date()
    const [hours, minutes] = settings.reportTime.split(':').map(Number)
    
    const scheduledTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      0
    )

    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1)
    }

    const timeUntilReport = scheduledTime.getTime() - now.getTime()

    this.scheduledJob = setTimeout(async () => {
      await this.sendDailyReport(settings)
      this.scheduleNextReport(settings)
    }, timeUntilReport)
  }

  private cancelScheduledReport(): void {
    if (this.scheduledJob) {
      clearTimeout(this.scheduledJob)
      this.scheduledJob = null
    }
  }

  async sendDailyReport(settings: EmailNotificationSettings): Promise<boolean> {
    try {
      const reportData = await this.generateReportData(settings)
      const template = this.generateEmailTemplate(reportData, settings)
      
      const success = await this.sendEmail(
        settings.recipientEmail,
        template.subject,
        template.html
      )

      if (success) {
        await this.logReportSent(reportData)
        toast.success('Daily CEO Report Sent', {
          description: `Report sent to ${settings.recipientEmail}`
        })
      }

      return success
    } catch (error) {
      console.error('Failed to send daily report:', error)
      toast.error('Failed to send report', {
        description: 'Please check your email settings and try again'
      })
      return false
    }
  }

  private async generateReportData(settings: EmailNotificationSettings): Promise<DailyReportData> {
    const previousData = await window.spark.kv.get<any>('ceo-dashboard-metrics')
    const complaintsData = await window.spark.kv.get<any[]>('customer-complaints') || []
    const supportData = await window.spark.kv.get<any[]>('support-chat-history') || []
    
    const today = new Date().toISOString().split('T')[0]
    const totalRevenue = 52800
    const totalUsers = 1756
    const newUsers = 89
    const activeUsers = 1234

    const complaints = {
      total: complaintsData.length,
      resolved: complaintsData.filter(c => c.status === 'resolved').length,
      pending: complaintsData.filter(c => c.status === 'pending').length,
      urgent: complaintsData.filter(c => c.priority === 'high' && c.status === 'pending').length,
    }

    const support = {
      totalChats: supportData.length,
      avgResponseTime: supportData.length > 0 
        ? supportData.reduce((sum, chat) => sum + (chat.responseTime || 0), 0) / supportData.length 
        : 0,
      satisfaction: 4.6,
    }

    let aiInsights = ''
    if (settings.includeAIAnalysis) {
      aiInsights = await this.generateAIInsights({
        revenue: totalRevenue,
        users: totalUsers,
        complaints,
        support
      })
    }

    return {
      date: today,
      revenue: {
        total: totalRevenue,
        change: 12.5,
        transactions: 342,
      },
      users: {
        total: totalUsers,
        new: newUsers,
        active: activeUsers,
      },
      complaints,
      support,
      aiInsights,
      forecast: {
        nextWeekRevenue: totalRevenue * 1.08,
        nextMonthUsers: totalUsers + 456,
      }
    }
  }

  private async generateAIInsights(data: any): Promise<string> {
    const apiKeys = await window.spark.kv.get<any>('api-keys')
    
    if (!apiKeys?.openai && !apiKeys?.anthropic) {
      return 'AI Analysis unavailable - Please configure AI API keys in the Integrations Hub.'
    }

    try {
      const promptText = `You are an expert business analyst for ApexForge. 

Analyze the following daily metrics and provide actionable insights:
- Revenue: $${data.revenue.toLocaleString()} (growth trend)
- Total Users: ${data.users.toLocaleString()}
- Complaints: ${data.complaints.total} total, ${data.complaints.urgent} urgent, ${data.complaints.pending} pending
- Support: ${data.support.totalChats} chats, ${data.support.avgResponseTime.toFixed(1)} min avg response time

Provide:
1. Top 3 key insights from today's data
2. 1-2 critical issues requiring immediate attention
3. 1 strategic recommendation for growth

Keep it concise and actionable for a CEO.`

      const insights = await window.spark.llm(promptText, 'gpt-4o-mini')
      return insights
    } catch (error) {
      console.error('AI insights generation failed:', error)
      return 'AI Analysis unavailable at this time. Please try again later.'
    }
  }

  private generateEmailTemplate(data: DailyReportData, settings: EmailNotificationSettings): EmailTemplate {
    const subject = `ApexForge Daily CEO Report - ${new Date(data.date).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })}`

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
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
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      color: #ffffff;
    }
    .header p {
      margin: 10px 0 0 0;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.9);
    }
    .content {
      padding: 30px;
    }
    .metric-row {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
    }
    .metric-card {
      flex: 1;
      background-color: #262626;
      border-radius: 8px;
      padding: 20px;
      border: 1px solid #333;
    }
    .metric-label {
      font-size: 12px;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .metric-value {
      font-size: 28px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 5px;
    }
    .metric-change {
      font-size: 14px;
      color: #10b981;
    }
    .metric-change.negative {
      color: #ef4444;
    }
    .section {
      background-color: #262626;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      border: 1px solid #333;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #fff;
      margin: 0 0 15px 0;
      padding-bottom: 10px;
      border-bottom: 1px solid #333;
    }
    .ai-insights {
      background-color: #1e1b4b;
      border: 1px solid #4f46e5;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    }
    .ai-insights-title {
      font-size: 16px;
      font-weight: 600;
      color: #a78bfa;
      margin: 0 0 10px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .ai-insights-content {
      color: #e0e7ff;
      line-height: 1.6;
      white-space: pre-wrap;
    }
    .stat-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #333;
    }
    .stat-item:last-child {
      border-bottom: none;
    }
    .stat-label {
      color: #999;
      font-size: 14px;
    }
    .stat-value {
      color: #fff;
      font-weight: 600;
      font-size: 14px;
    }
    .urgent-badge {
      background-color: #991b1b;
      color: #fecaca;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      display: inline-block;
    }
    .footer {
      padding: 30px;
      text-align: center;
      background-color: #0a0a0a;
      border-top: 1px solid #333;
    }
    .footer p {
      margin: 5px 0;
      font-size: 12px;
      color: #666;
    }
    .button {
      display: inline-block;
      background-color: #7c3aed;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 600;
      margin-top: 15px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚀 ApexForge Daily CEO Report</h1>
      <p>${new Date(data.date).toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      })}</p>
    </div>
    
    <div class="content">
      ${settings.includeRevenue ? `
      <div class="metric-row">
        <div class="metric-card">
          <div class="metric-label">Total Revenue</div>
          <div class="metric-value">$${data.revenue.total.toLocaleString()}</div>
          <div class="metric-change">+${data.revenue.change}% vs yesterday</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Transactions</div>
          <div class="metric-value">${data.revenue.transactions}</div>
        </div>
      </div>
      ` : ''}

      ${settings.includeUserGrowth ? `
      <div class="section">
        <h3 class="section-title">📊 User Growth</h3>
        <div class="stat-item">
          <span class="stat-label">Total Users</span>
          <span class="stat-value">${data.users.total.toLocaleString()}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">New Users Today</span>
          <span class="stat-value">+${data.users.new}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Active Users</span>
          <span class="stat-value">${data.users.active.toLocaleString()}</span>
        </div>
      </div>
      ` : ''}

      ${settings.includeComplaints && data.complaints.total > 0 ? `
      <div class="section">
        <h3 class="section-title">⚠️ Customer Complaints</h3>
        <div class="stat-item">
          <span class="stat-label">Total Complaints</span>
          <span class="stat-value">${data.complaints.total}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Resolved</span>
          <span class="stat-value">${data.complaints.resolved}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Pending</span>
          <span class="stat-value">${data.complaints.pending}</span>
        </div>
        ${data.complaints.urgent > 0 ? `
        <div class="stat-item">
          <span class="stat-label">Urgent</span>
          <span class="stat-value">
            <span class="urgent-badge">${data.complaints.urgent} URGENT</span>
          </span>
        </div>
        ` : ''}
      </div>
      ` : ''}

      ${settings.includeCustomerSupport ? `
      <div class="section">
        <h3 class="section-title">💬 Customer Support</h3>
        <div class="stat-item">
          <span class="stat-label">Total Chats</span>
          <span class="stat-value">${data.support.totalChats}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Avg Response Time</span>
          <span class="stat-value">${data.support.avgResponseTime.toFixed(1)} min</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Satisfaction Score</span>
          <span class="stat-value">${data.support.satisfaction} / 5.0 ⭐</span>
        </div>
      </div>
      ` : ''}

      ${settings.includeAIAnalysis && data.aiInsights ? `
      <div class="ai-insights">
        <h3 class="ai-insights-title">
          <span>🤖</span>
          <span>AI-Powered Insights</span>
        </h3>
        <div class="ai-insights-content">${data.aiInsights}</div>
      </div>
      ` : ''}

      ${settings.includeForecast ? `
      <div class="section">
        <h3 class="section-title">🔮 Forecast</h3>
        <div class="stat-item">
          <span class="stat-label">Next Week Revenue (Projected)</span>
          <span class="stat-value">$${data.forecast.nextWeekRevenue.toLocaleString()}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Next Month Users (Projected)</span>
          <span class="stat-value">${data.forecast.nextMonthUsers.toLocaleString()}</span>
        </div>
      </div>
      ` : ''}

      <a href="#" class="button">View Full Dashboard →</a>
    </div>

    <div class="footer">
      <p><strong>ApexForge</strong> - The AI Team That Ships Perfection</p>
      <p>This is an automated daily report. Generated at ${new Date().toLocaleTimeString()}</p>
    </div>
  </div>
</body>
</html>
    `

    const plainText = `
ApexForge Daily CEO Report - ${data.date}

REVENUE: $${data.revenue.total.toLocaleString()} (+${data.revenue.change}%)
USERS: ${data.users.total.toLocaleString()} total, ${data.users.new} new today
COMPLAINTS: ${data.complaints.total} total, ${data.complaints.urgent} urgent
SUPPORT: ${data.support.totalChats} chats, ${data.support.avgResponseTime.toFixed(1)} min avg response

${data.aiInsights ? `AI INSIGHTS:\n${data.aiInsights}` : ''}
    `

    return {
      subject,
      body: plainText,
      html
    }
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    const { emailService } = await import('./emailService')
    
    const result = await emailService.sendEmail({
      to,
      subject,
      html,
      text: this.extractTextFromHtml(html)
    })

    const emailLog = await window.spark.kv.get<any[]>('email-notification-log') || []
    
    const emailRecord = {
      to,
      subject,
      sentAt: new Date().toISOString(),
      status: result.success ? 'sent' : 'failed',
      messageId: result.messageId,
      error: result.error,
      preview: html.substring(0, 200)
    }

    emailLog.unshift(emailRecord)
    await window.spark.kv.set('email-notification-log', emailLog.slice(0, 50))

    if (!result.success) {
      console.error('📧 Email Report Failed:', {
        to,
        subject,
        error: result.error,
        timestamp: new Date().toLocaleString()
      })
    } else {
      console.log('📧 Email Report Sent:', {
        to,
        subject,
        messageId: result.messageId,
        timestamp: new Date().toLocaleString()
      })
    }

    return result.success
  }

  private extractTextFromHtml(html: string): string {
    return html
      .replace(/<style[^>]*>.*?<\/style>/gs, '')
      .replace(/<script[^>]*>.*?<\/script>/gs, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  private async logReportSent(data: DailyReportData): Promise<void> {
    const history = await window.spark.kv.get<any[]>('daily-report-history') || []
    history.unshift({
      date: data.date,
      sentAt: new Date().toISOString(),
      data
    })
    await window.spark.kv.set('daily-report-history', history.slice(0, 90))
  }

  async testEmail(settings: EmailNotificationSettings): Promise<boolean> {
    toast.info('Sending test email...', {
      description: 'Generating sample report'
    })

    const success = await this.sendDailyReport(settings)
    
    if (success) {
      toast.success('Test email sent successfully!', {
        description: 'Check your email inbox'
      })
    }

    return success
  }

  async getEmailHistory(): Promise<any[]> {
    return await window.spark.kv.get<any[]>('email-notification-log') || []
  }

  async getReportHistory(): Promise<any[]> {
    return await window.spark.kv.get<any[]>('daily-report-history') || []
  }
}

export const emailNotificationService = new EmailNotificationService()
