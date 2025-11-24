import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Separator } from './ui/separator'
import { Badge } from './ui/badge'
import { 
  EnvelopeSimple, 
  Clock, 
  CheckCircle, 
  Warning, 
  PaperPlaneTilt,
  ChartLine,
  Users,
  ChatCircle,
  Robot,
  TrendUp,
  ListChecks
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  emailNotificationService, 
  type EmailNotificationSettings 
} from '../lib/emailNotificationService'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { ScrollArea } from './ui/scroll-area'

export function EmailNotificationSettings() {
  const [settings, setSettings] = useState<EmailNotificationSettings>({
    enabled: false,
    recipientEmail: 'papakoEddie@tripzy.international',
    reportTime: '12:00',
    includeRevenue: true,
    includeUserGrowth: true,
    includeComplaints: true,
    includeAIAnalysis: true,
    includeCustomerSupport: true,
    includeForecast: true,
    frequency: 'daily',
    timezone: 'Asia/Manila'
  })
  
  const [loading, setLoading] = useState(false)
  const [testingSending, setTestingSending] = useState(false)
  const [emailHistory, setEmailHistory] = useState<any[]>([])
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    loadSettings()
    loadEmailHistory()
  }, [])

  const loadSettings = async () => {
    const savedSettings = await emailNotificationService.getSettings()
    if (savedSettings) {
      setSettings(savedSettings)
    }
  }

  const loadEmailHistory = async () => {
    const history = await emailNotificationService.getEmailHistory()
    setEmailHistory(history)
  }

  const handleSaveSettings = async () => {
    if (!settings.recipientEmail || !settings.reportTime) {
      toast.error('Missing required fields', {
        description: 'Please enter recipient email and report time'
      })
      return
    }

    setLoading(true)
    try {
      await emailNotificationService.saveSettings(settings)
      await loadEmailHistory()
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  const handleTestEmail = async () => {
    if (!settings.recipientEmail) {
      toast.error('Enter recipient email first')
      return
    }

    setTestingSending(true)
    try {
      const success = await emailNotificationService.testEmail(settings)
      if (success) {
        await loadEmailHistory()
      }
    } finally {
      setTestingSending(false)
    }
  }

  const handleToggleEnabled = async () => {
    const newSettings = { ...settings, enabled: !settings.enabled }
    setSettings(newSettings)
    
    if (!settings.enabled) {
      await emailNotificationService.saveSettings(newSettings)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Email Notification System</h2>
        <p className="text-muted-foreground">
          Automated daily CEO reports sent directly to your inbox
        </p>
      </div>

      <Card className="p-6 border-primary/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <EnvelopeSimple weight="fill" className="text-primary" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Daily CEO Reports</h3>
              <p className="text-sm text-muted-foreground">
                Automated email notifications at 12:00 PM daily
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Label htmlFor="email-enabled" className="text-sm cursor-pointer">
              {settings.enabled ? 'Enabled' : 'Disabled'}
            </Label>
            <Switch
              id="email-enabled"
              checked={settings.enabled}
              onCheckedChange={handleToggleEnabled}
            />
          </div>
        </div>

        <AnimatePresence>
          {settings.enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient-email">Recipient Email</Label>
                  <Input
                    id="recipient-email"
                    type="email"
                    placeholder="your.email@company.com"
                    value={settings.recipientEmail}
                    onChange={(e) => setSettings({ ...settings, recipientEmail: e.target.value })}
                    className="bg-secondary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report-time">Report Time (24h format)</Label>
                  <Input
                    id="report-time"
                    type="time"
                    value={settings.reportTime}
                    onChange={(e) => setSettings({ ...settings, reportTime: e.target.value })}
                    className="bg-secondary/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={settings.frequency}
                    onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                      setSettings({ ...settings, frequency: value })
                    }
                  >
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                  >
                    <SelectTrigger className="bg-secondary/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Manila">Asia/Manila (UTC+8)</SelectItem>
                      <SelectItem value="America/New_York">America/New York (UTC-5)</SelectItem>
                      <SelectItem value="America/Los_Angeles">America/Los Angeles (UTC-8)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (UTC+0)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo (UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <ListChecks size={18} />
                  Report Sections
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                    <div className="flex items-center gap-3">
                      <ChartLine size={20} className="text-primary" />
                      <Label htmlFor="include-revenue" className="cursor-pointer">
                        Revenue Metrics
                      </Label>
                    </div>
                    <Switch
                      id="include-revenue"
                      checked={settings.includeRevenue}
                      onCheckedChange={(checked) => 
                        setSettings({ ...settings, includeRevenue: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                    <div className="flex items-center gap-3">
                      <Users size={20} className="text-accent" />
                      <Label htmlFor="include-users" className="cursor-pointer">
                        User Growth
                      </Label>
                    </div>
                    <Switch
                      id="include-users"
                      checked={settings.includeUserGrowth}
                      onCheckedChange={(checked) => 
                        setSettings({ ...settings, includeUserGrowth: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                    <div className="flex items-center gap-3">
                      <Warning size={20} className="text-destructive" />
                      <Label htmlFor="include-complaints" className="cursor-pointer">
                        Customer Complaints
                      </Label>
                    </div>
                    <Switch
                      id="include-complaints"
                      checked={settings.includeComplaints}
                      onCheckedChange={(checked) => 
                        setSettings({ ...settings, includeComplaints: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                    <div className="flex items-center gap-3">
                      <ChatCircle size={20} className="text-accent" />
                      <Label htmlFor="include-support" className="cursor-pointer">
                        Customer Support
                      </Label>
                    </div>
                    <Switch
                      id="include-support"
                      checked={settings.includeCustomerSupport}
                      onCheckedChange={(checked) => 
                        setSettings({ ...settings, includeCustomerSupport: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                    <div className="flex items-center gap-3">
                      <Robot size={20} className="text-primary" />
                      <Label htmlFor="include-ai" className="cursor-pointer">
                        AI-Powered Insights
                      </Label>
                    </div>
                    <Switch
                      id="include-ai"
                      checked={settings.includeAIAnalysis}
                      onCheckedChange={(checked) => 
                        setSettings({ ...settings, includeAIAnalysis: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                    <div className="flex items-center gap-3">
                      <TrendUp size={20} className="text-accent" />
                      <Label htmlFor="include-forecast" className="cursor-pointer">
                        Revenue Forecast
                      </Label>
                    </div>
                    <Switch
                      id="include-forecast"
                      checked={settings.includeForecast}
                      onCheckedChange={(checked) => 
                        setSettings({ ...settings, includeForecast: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex gap-3">
                <Button
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Clock className="animate-spin" size={18} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Save Settings
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleTestEmail}
                  disabled={testingSending || !settings.recipientEmail}
                  variant="outline"
                  className="flex-1"
                >
                  {testingSending ? (
                    <>
                      <Clock className="animate-spin" size={18} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <PaperPlaneTilt size={18} />
                      Send Test Email
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {emailHistory.length > 0 && (
        <Card className="p-6 border-accent/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Email History</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? 'Hide' : 'Show'} ({emailHistory.length})
            </Button>
          </div>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-3">
                    {emailHistory.map((email, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-lg bg-secondary/30 border border-border"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <EnvelopeSimple size={16} className="text-muted-foreground" />
                            <span className="text-sm font-medium">{email.to}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {email.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {email.subject}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock size={12} />
                          {new Date(email.sentAt).toLocaleString()}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      )}

      <Card className="p-6 border-accent/20 bg-accent/5">
        <div className="flex items-start gap-3">
          <Robot size={24} className="text-accent shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold mb-2">AI-Powered Report Generation</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your daily CEO reports include AI-generated insights from your configured AI models. 
              The system analyzes revenue trends, user growth, customer complaints, and support metrics 
              to provide actionable recommendations. Reports are automatically generated and sent at your 
              specified time (12:00 PM Philippine time by default).
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
