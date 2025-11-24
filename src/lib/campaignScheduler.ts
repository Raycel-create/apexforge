interface ScheduledJob {
  id: string
  campaignId: string
  customerId: string
  scheduledFor: Date
  status: 'pending' | 'executed' | 'failed' | 'cancelled'
  trigger: 'past_due' | 'failed_payment' | 'churned' | 'expiring_soon'
  attempts: number
  lastAttempt?: Date
  error?: string
}

interface AutomationRule {
  id: string
  name: string
  trigger: 'past_due' | 'failed_payment' | 'churned' | 'expiring_soon'
  conditions: {
    daysAfterEvent: number
    minAmount?: number
    maxAmount?: number
    planTypes?: string[]
    excludeStatuses?: string[]
  }
  campaignId: string
  enabled: boolean
  priority: number
  createdAt: Date
  lastRun?: Date
  totalExecutions: number
}

interface CustomerPaymentEvent {
  customerId: string
  customerName: string
  customerEmail: string
  eventType: 'past_due' | 'failed_payment' | 'churned' | 'expiring_soon'
  eventDate: Date
  amount: number
  plan: string
  status: string
  daysSinceEvent: number
  metadata?: Record<string, any>
}

export class CampaignScheduler {
  private checkInterval: number = 60000
  private intervalId: NodeJS.Timeout | null = null
  private isRunning: boolean = false

  async initialize() {
    this.startScheduler()
  }

  startScheduler() {
    if (this.isRunning) {
      console.log('[CampaignScheduler] Already running')
      return
    }

    console.log('[CampaignScheduler] Starting automated campaign scheduler...')
    this.isRunning = true

    this.intervalId = setInterval(() => {
      this.processScheduledCampaigns()
    }, this.checkInterval)

    this.processScheduledCampaigns()
  }

  stopScheduler() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
      this.isRunning = false
      console.log('[CampaignScheduler] Scheduler stopped')
    }
  }

  async processScheduledCampaigns() {
    try {
      const scheduledJobs = await this.getScheduledJobs()
      const now = new Date()

      const dueJobs = scheduledJobs.filter(
        (job) => job.status === 'pending' && new Date(job.scheduledFor) <= now
      )

      console.log(`[CampaignScheduler] Processing ${dueJobs.length} due campaigns`)

      for (const job of dueJobs) {
        await this.executeJob(job)
      }

      await this.detectAndScheduleNewEvents()
    } catch (error) {
      console.error('[CampaignScheduler] Error processing campaigns:', error)
    }
  }

  async detectAndScheduleNewEvents() {
    try {
      const customers = await this.getCustomers()
      const automationRules = await this.getAutomationRules()
      const activeRules = automationRules.filter((rule) => rule.enabled)

      const events = this.detectPaymentEvents(customers)

      for (const event of events) {
        for (const rule of activeRules) {
          if (await this.shouldTriggerRule(event, rule)) {
            await this.scheduleJob(event, rule)
          }
        }
      }
    } catch (error) {
      console.error('[CampaignScheduler] Error detecting events:', error)
    }
  }

  detectPaymentEvents(customers: any[]): CustomerPaymentEvent[] {
    const events: CustomerPaymentEvent[] = []
    const now = new Date()

    for (const customer of customers) {
      if (customer.status === 'past_due') {
        const daysSinceLastPayment = this.calculateDaysSince(customer.lastPaymentAttempt || customer.nextBilling)
        
        events.push({
          customerId: customer.id,
          customerName: customer.name,
          customerEmail: customer.email,
          eventType: 'past_due',
          eventDate: new Date(customer.lastPaymentAttempt || customer.nextBilling),
          amount: customer.amount || customer.mrr || 0,
          plan: customer.plan,
          status: customer.status,
          daysSinceEvent: daysSinceLastPayment,
          metadata: {
            emailsSent: customer.emailsSent || 0,
            daysPastDue: customer.daysPastDue || daysSinceLastPayment,
          }
        })
      }

      if (customer.status === 'cancelled') {
        const daysSinceCancellation = this.calculateDaysSince(customer.cancelledDate || customer.nextBilling)
        
        if (daysSinceCancellation >= 7) {
          events.push({
            customerId: customer.id,
            customerName: customer.name,
            customerEmail: customer.email,
            eventType: 'churned',
            eventDate: new Date(customer.cancelledDate || customer.nextBilling),
            amount: customer.lastAmount || customer.mrr || 0,
            plan: customer.lastPlan || customer.plan,
            status: customer.status,
            daysSinceEvent: daysSinceCancellation,
          })
        }
      }

      if (customer.status === 'active' && customer.nextBilling) {
        const daysUntilBilling = this.calculateDaysUntil(customer.nextBilling)
        
        if (daysUntilBilling >= 0 && daysUntilBilling <= 7) {
          events.push({
            customerId: customer.id,
            customerName: customer.name,
            customerEmail: customer.email,
            eventType: 'expiring_soon',
            eventDate: new Date(customer.nextBilling),
            amount: customer.mrr || 0,
            plan: customer.plan,
            status: customer.status,
            daysSinceEvent: -daysUntilBilling,
          })
        }
      }
    }

    return events
  }

  async shouldTriggerRule(event: CustomerPaymentEvent, rule: AutomationRule): Promise<boolean> {
    if (event.eventType !== rule.trigger) {
      return false
    }

    const daysSinceEvent = Math.abs(event.daysSinceEvent)
    if (daysSinceEvent < rule.conditions.daysAfterEvent) {
      return false
    }

    if (rule.conditions.minAmount && event.amount < rule.conditions.minAmount) {
      return false
    }

    if (rule.conditions.maxAmount && event.amount > rule.conditions.maxAmount) {
      return false
    }

    if (rule.conditions.planTypes && rule.conditions.planTypes.length > 0) {
      if (!rule.conditions.planTypes.includes(event.plan)) {
        return false
      }
    }

    if (rule.conditions.excludeStatuses && rule.conditions.excludeStatuses.length > 0) {
      if (rule.conditions.excludeStatuses.includes(event.status)) {
        return false
      }
    }

    const existingJob = await this.findExistingJob(event.customerId, rule.campaignId, rule.conditions.daysAfterEvent)
    if (existingJob) {
      return false
    }

    return true
  }

  async scheduleJob(event: CustomerPaymentEvent, rule: AutomationRule) {
    const scheduledFor = new Date()
    scheduledFor.setDate(scheduledFor.getDate() + 0)

    const job: ScheduledJob = {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      campaignId: rule.campaignId,
      customerId: event.customerId,
      scheduledFor,
      status: 'pending',
      trigger: event.eventType,
      attempts: 0,
    }

    await this.saveScheduledJob(job)

    console.log(`[CampaignScheduler] Scheduled job ${job.id} for customer ${event.customerEmail} (${event.eventType})`)
  }

  async executeJob(job: ScheduledJob) {
    try {
      console.log(`[CampaignScheduler] Executing job ${job.id}`)

      const campaign = await this.getCampaign(job.campaignId)
      const customer = await this.getCustomer(job.customerId)

      if (!campaign || !customer) {
        await this.updateJobStatus(job.id, 'failed', 'Campaign or customer not found')
        return
      }

      const emailContent = this.personalizeEmail(campaign, customer)

      await this.sendEmail(customer.email, emailContent.subject, emailContent.body)

      await this.updateJobStatus(job.id, 'executed')
      await this.incrementCampaignMetrics(job.campaignId)
      await this.updateCustomerEmailCount(job.customerId)

      console.log(`[CampaignScheduler] Job ${job.id} executed successfully`)
    } catch (error) {
      console.error(`[CampaignScheduler] Error executing job ${job.id}:`, error)
      
      const updatedJob = {
        ...job,
        attempts: job.attempts + 1,
        lastAttempt: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      }

      if (updatedJob.attempts >= 3) {
        await this.updateJobStatus(job.id, 'failed', updatedJob.error)
      } else {
        await this.saveScheduledJob(updatedJob)
      }
    }
  }

  personalizeEmail(campaign: any, customer: any) {
    let subject = campaign.subject
    let body = campaign.body

    const variables: Record<string, string> = {
      '{{name}}': customer.name,
      '{{plan}}': customer.plan,
      '{{amount}}': customer.amount?.toString() || customer.mrr?.toString() || '0',
      '{{payment_link}}': `https://apexforge.app/update-payment/${customer.id}`,
      '{{reactivate_link}}': `https://apexforge.app/reactivate/${customer.id}`,
    }

    Object.entries(variables).forEach(([key, value]) => {
      subject = subject.replace(new RegExp(key, 'g'), value)
      body = body.replace(new RegExp(key, 'g'), value)
    })

    return { subject, body }
  }

  async sendEmail(to: string, subject: string, body: string) {
    console.log(`[CampaignScheduler] Sending email to ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Body preview: ${body.substring(0, 100)}...`)
  }

  calculateDaysSince(dateString: string): number {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  calculateDaysUntil(dateString: string): number {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  async getScheduledJobs(): Promise<ScheduledJob[]> {
    if (typeof window !== 'undefined' && window.spark?.kv) {
      const jobs = await window.spark.kv.get<ScheduledJob[]>('scheduled-jobs') || []
      return jobs
    }
    return []
  }

  async saveScheduledJob(job: ScheduledJob) {
    if (typeof window !== 'undefined' && window.spark?.kv) {
      const jobs = await this.getScheduledJobs()
      const existingIndex = jobs.findIndex(j => j.id === job.id)
      
      if (existingIndex >= 0) {
        jobs[existingIndex] = job
      } else {
        jobs.push(job)
      }
      
      await window.spark.kv.set('scheduled-jobs', jobs)
    }
  }

  async updateJobStatus(jobId: string, status: ScheduledJob['status'], error?: string) {
    if (typeof window !== 'undefined' && window.spark?.kv) {
      const jobs = await this.getScheduledJobs()
      const job = jobs.find(j => j.id === jobId)
      
      if (job) {
        job.status = status
        if (error) job.error = error
        job.lastAttempt = new Date()
        await window.spark.kv.set('scheduled-jobs', jobs)
      }
    }
  }

  async findExistingJob(customerId: string, campaignId: string, daysDelay: number): Promise<ScheduledJob | undefined> {
    const jobs = await this.getScheduledJobs()
    const recentWindow = new Date()
    recentWindow.setDate(recentWindow.getDate() - daysDelay - 1)

    return jobs.find(
      job =>
        job.customerId === customerId &&
        job.campaignId === campaignId &&
        (job.status === 'pending' || job.status === 'executed') &&
        new Date(job.scheduledFor) > recentWindow
    )
  }

  async getCustomers(): Promise<any[]> {
    if (typeof window !== 'undefined' && window.spark?.kv) {
      return await window.spark.kv.get<any[]>('past-due-customers') || []
    }
    return []
  }

  async getCustomer(customerId: string): Promise<any> {
    const customers = await this.getCustomers()
    return customers.find(c => c.id === customerId)
  }

  async updateCustomerEmailCount(customerId: string) {
    if (typeof window !== 'undefined' && window.spark?.kv) {
      const customers = await this.getCustomers()
      const customer = customers.find(c => c.id === customerId)
      
      if (customer) {
        customer.emailsSent = (customer.emailsSent || 0) + 1
        customer.status = 'contacted'
        await window.spark.kv.set('past-due-customers', customers)
      }
    }
  }

  async getAutomationRules(): Promise<AutomationRule[]> {
    if (typeof window !== 'undefined' && window.spark?.kv) {
      return await window.spark.kv.get<AutomationRule[]>('automation-rules') || []
    }
    return []
  }

  async getCampaign(campaignId: string): Promise<any> {
    if (typeof window !== 'undefined' && window.spark?.kv) {
      const campaigns = await window.spark.kv.get<any[]>('email-campaigns') || []
      return campaigns.find(c => c.id === campaignId)
    }
    return null
  }

  async incrementCampaignMetrics(campaignId: string) {
    if (typeof window !== 'undefined' && window.spark?.kv) {
      const campaigns = await window.spark.kv.get<any[]>('email-campaigns') || []
      const campaign = campaigns.find(c => c.id === campaignId)
      
      if (campaign) {
        campaign.sent = (campaign.sent || 0) + 1
        await window.spark.kv.set('email-campaigns', campaigns)
      }
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      checkInterval: this.checkInterval,
      lastCheck: new Date().toISOString(),
    }
  }

  setCheckInterval(minutes: number) {
    this.checkInterval = minutes * 60000
    
    if (this.isRunning) {
      this.stopScheduler()
      this.startScheduler()
    }
  }
}

export const campaignScheduler = new CampaignScheduler()

if (typeof window !== 'undefined') {
  (window as any).campaignScheduler = campaignScheduler
}
