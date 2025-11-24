import { useState, useEffect } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { Separator } from './ui/separator'
import { Badge } from './ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import {
  EnvelopeSimple,
  CheckCircle,
  Warning,
  PaperPlaneTilt,
  Key,
  CloudArrowUp,
  Lightning,
  ShieldCheck,
  Info
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { emailService, type EmailConfig, type EmailProvider } from '../lib/emailService'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { ScrollArea } from './ui/scroll-area'

export function EmailServiceConfig() {
  const [config, setConfig] = useState<EmailConfig>({
    provider: 'development',
    fromEmail: 'noreply@apexforge.ai',
    fromName: 'ApexForge',
  })
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [emailLogs, setEmailLogs] = useState<any[]>([])
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  useEffect(() => {
    loadConfig()
    loadEmailLogs()
  }, [])

  const loadConfig = async () => {
    const savedConfig = await emailService.getConfig()
    if (savedConfig) {
      setConfig(savedConfig)
    }
  }

  const loadEmailLogs = async () => {
    const logs = await emailService.getEmailLogs(20)
    setEmailLogs(logs)
  }

  const handleSaveConfig = async () => {
    setLoading(true)
    setValidationErrors([])

    try {
      const validation = await emailService.validateConfig(config)
      
      if (!validation.valid) {
        setValidationErrors(validation.errors)
        toast.error('Configuration invalid', {
          description: validation.errors[0]
        })
        return
      }

      await emailService.saveConfig(config)
      await loadEmailLogs()

      toast.success('Email service configured!', {
        description: `Using ${config.provider} for email delivery`
      })
    } catch (error) {
      toast.error('Failed to save configuration')
    } finally {
      setLoading(false)
    }
  }

  const handleTestEmail = async () => {
    if (!config.fromEmail) {
      toast.error('Configure email service first')
      return
    }

    setTesting(true)
    try {
      const testRecipient = config.fromEmail

      const result = await emailService.sendEmail({
        to: testRecipient,
        subject: 'ApexForge Email Service Test',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #7c3aed;">✅ Email Service Test Successful!</h1>
            <p>Your ApexForge email service is configured correctly and working.</p>
            <p><strong>Provider:</strong> ${config.provider}</p>
            <p><strong>From:</strong> ${config.fromName} &lt;${config.fromEmail}&gt;</p>
            <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 12px;">
              This is a test email from ApexForge. If you received this, your email service is working correctly.
            </p>
          </div>
        `,
        text: `Email Service Test Successful!\n\nYour ApexForge email service is configured correctly.\nProvider: ${config.provider}\nFrom: ${config.fromName} <${config.fromEmail}>\nSent at: ${new Date().toLocaleString()}`
      }, config)

      if (result.success) {
        await loadEmailLogs()
        toast.success('Test email sent successfully!', {
          description: config.provider === 'development' 
            ? 'Check the browser console for the email content'
            : `Check ${testRecipient} inbox`
        })
      } else {
        toast.error('Test email failed', {
          description: result.error || 'Unknown error'
        })
      }
    } catch (error) {
      toast.error('Failed to send test email')
    } finally {
      setTesting(false)
    }
  }

  const getProviderIcon = (provider: EmailProvider) => {
    switch (provider) {
      case 'sendgrid':
        return <CloudArrowUp size={20} />
      case 'aws-ses':
        return <CloudArrowUp size={20} />
      default:
        return <Lightning size={20} />
    }
  }

  const getProviderBadgeColor = (provider: string) => {
    switch (provider) {
      case 'sendgrid':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50'
      case 'aws-ses':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/50'
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Email Service Configuration</h2>
        <p className="text-muted-foreground">
          Configure SendGrid or AWS SES for production email delivery
        </p>
      </div>

      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="logs">
            Email Logs
            {emailLogs.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {emailLogs.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-6">
          <Card className="p-6 border-primary/30">
            <div className="space-y-6">
              <div>
                <Label htmlFor="provider" className="text-base font-semibold mb-3 flex items-center gap-2">
                  {getProviderIcon(config.provider)}
                  Email Provider
                </Label>
                <Select
                  value={config.provider}
                  onValueChange={(value: EmailProvider) => 
                    setConfig({ ...config, provider: value })
                  }
                >
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">
                      <div className="flex items-center gap-2">
                        <Lightning size={16} />
                        Development (Console Only)
                      </div>
                    </SelectItem>
                    <SelectItem value="sendgrid">
                      <div className="flex items-center gap-2">
                        <CloudArrowUp size={16} />
                        SendGrid
                      </div>
                    </SelectItem>
                    <SelectItem value="aws-ses">
                      <div className="flex items-center gap-2">
                        <CloudArrowUp size={16} />
                        AWS SES
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  {config.provider === 'development' && 'Emails will be logged to console only'}
                  {config.provider === 'sendgrid' && 'Requires SendGrid API key'}
                  {config.provider === 'aws-ses' && 'Requires AWS SES credentials'}
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from-email">From Email Address *</Label>
                  <Input
                    id="from-email"
                    type="email"
                    placeholder="noreply@yourdomain.com"
                    value={config.fromEmail}
                    onChange={(e) => setConfig({ ...config, fromEmail: e.target.value })}
                    className="bg-secondary/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be verified in your email provider
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="from-name">From Name *</Label>
                  <Input
                    id="from-name"
                    type="text"
                    placeholder="Your Company Name"
                    value={config.fromName}
                    onChange={(e) => setConfig({ ...config, fromName: e.target.value })}
                    className="bg-secondary/50"
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {config.provider === 'sendgrid' && (
                  <motion.div
                    key="sendgrid"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <Separator />
                    <Alert className="border-blue-500/30 bg-blue-500/10">
                      <Info className="text-blue-400" size={18} />
                      <AlertDescription className="ml-2 text-sm">
                        <p className="font-semibold text-blue-300 mb-1">SendGrid Setup</p>
                        <ol className="text-xs text-blue-200/80 space-y-1 list-decimal list-inside">
                          <li>Sign up at sendgrid.com</li>
                          <li>Verify your sender email address</li>
                          <li>Create an API key with "Mail Send" permissions</li>
                          <li>Paste your API key below</li>
                        </ol>
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2">
                      <Label htmlFor="sendgrid-key" className="flex items-center gap-2">
                        <Key size={16} />
                        SendGrid API Key *
                      </Label>
                      <div className="relative">
                        <Input
                          id="sendgrid-key"
                          type={showApiKey ? 'text' : 'password'}
                          placeholder="SG.xxxxxxxxxxxxxxxxxxxx"
                          value={config.sendgridApiKey || ''}
                          onChange={(e) => setConfig({ ...config, sendgridApiKey: e.target.value })}
                          className="bg-secondary/50 pr-20"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? 'Hide' : 'Show'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {config.provider === 'aws-ses' && (
                  <motion.div
                    key="aws-ses"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <Separator />
                    <Alert className="border-orange-500/30 bg-orange-500/10">
                      <Info className="text-orange-400" size={18} />
                      <AlertDescription className="ml-2 text-sm">
                        <p className="font-semibold text-orange-300 mb-1">AWS SES Setup</p>
                        <ol className="text-xs text-orange-200/80 space-y-1 list-decimal list-inside">
                          <li>Sign in to AWS Console</li>
                          <li>Navigate to Amazon SES</li>
                          <li>Verify your email address or domain</li>
                          <li>Create IAM credentials with SES permissions</li>
                          <li>Enter your credentials below</li>
                        </ol>
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="aws-access-key">AWS Access Key ID *</Label>
                        <Input
                          id="aws-access-key"
                          type={showApiKey ? 'text' : 'password'}
                          placeholder="AKIA..."
                          value={config.awsSesAccessKeyId || ''}
                          onChange={(e) => setConfig({ ...config, awsSesAccessKeyId: e.target.value })}
                          className="bg-secondary/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="aws-secret-key">AWS Secret Access Key *</Label>
                        <Input
                          id="aws-secret-key"
                          type="password"
                          placeholder="••••••••••••••••••••"
                          value={config.awsSesSecretAccessKey || ''}
                          onChange={(e) => setConfig({ ...config, awsSesSecretAccessKey: e.target.value })}
                          className="bg-secondary/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="aws-region">AWS Region *</Label>
                        <Select
                          value={config.awsSesRegion || 'us-east-1'}
                          onValueChange={(value) => setConfig({ ...config, awsSesRegion: value })}
                        >
                          <SelectTrigger className="bg-secondary/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                            <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                            <SelectItem value="eu-west-1">EU (Ireland)</SelectItem>
                            <SelectItem value="eu-central-1">EU (Frankfurt)</SelectItem>
                            <SelectItem value="ap-south-1">Asia Pacific (Mumbai)</SelectItem>
                            <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {validationErrors.length > 0 && (
                <Alert className="border-destructive/50 bg-destructive/10">
                  <Warning className="text-destructive" size={18} />
                  <AlertDescription className="ml-2">
                    <p className="font-semibold text-destructive mb-1">Configuration Errors:</p>
                    <ul className="text-xs text-destructive/90 space-y-1 list-disc list-inside">
                      {validationErrors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <Separator />

              <div className="flex gap-3">
                <Button
                  onClick={handleSaveConfig}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Save Configuration
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleTestEmail}
                  disabled={testing || loading}
                  variant="outline"
                  className="flex-1"
                >
                  {testing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
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
            </div>
          </Card>

          <Card className="p-6 border-accent/20 bg-accent/5">
            <div className="flex items-start gap-3">
              <ShieldCheck size={24} className="text-accent shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">Secure Email Delivery</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your API keys are stored securely in the browser's encrypted storage and never sent to any third party. 
                  For production use, we recommend SendGrid or AWS SES. Development mode logs emails to the console only.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card className="p-6 border-primary/30">
            {emailLogs.length === 0 ? (
              <div className="text-center py-12">
                <EnvelopeSimple size={48} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No emails sent yet</h3>
                <p className="text-sm text-muted-foreground">
                  Email logs will appear here after you send test or production emails
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Recent Email Activity</h3>
                  <Badge variant="outline">{emailLogs.length} emails</Badge>
                </div>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-3">
                    {emailLogs.map((log, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="p-4 rounded-lg bg-secondary/30 border border-border"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <EnvelopeSimple size={16} className="text-muted-foreground" />
                            <span className="text-sm font-medium">{log.to}</span>
                          </div>
                          <Badge className={getProviderBadgeColor(log.provider)}>
                            {log.provider}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium mb-1">{log.subject}</p>
                        {log.messageId && (
                          <p className="text-xs text-muted-foreground mb-2 font-mono">
                            ID: {log.messageId}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.sentAt || log.timestamp).toLocaleString()}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
