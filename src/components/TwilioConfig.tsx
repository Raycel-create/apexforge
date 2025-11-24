import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Alert, AlertDescription } from './ui/alert'
import { Badge } from './ui/badge'
import { DeviceMobile, CheckCircle, XCircle, Eye, EyeSlash, Copy, Info } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import { motion } from 'framer-motion'
import type { TwilioConfig } from '../lib/twilioService'

export function TwilioConfigPanel() {
  const [config, setConfig] = useKV<TwilioConfig>('apexforge-twilio-config', {
    accountSid: '',
    authToken: '',
    phoneNumber: '',
  })
  
  const [localConfig, setLocalConfig] = useState<TwilioConfig>({
    accountSid: '',
    authToken: '',
    phoneNumber: '',
  })
  
  const [showAuthToken, setShowAuthToken] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (config) {
      setLocalConfig(config)
      if (config.accountSid && config.authToken && config.phoneNumber) {
        setIsValid(true)
      }
    }
  }, [config])

  const handleValidate = async () => {
    if (!localConfig.accountSid || !localConfig.authToken || !localConfig.phoneNumber) {
      toast.error('Please fill in all fields')
      return
    }

    setIsValidating(true)

    try {
      const auth = btoa(`${localConfig.accountSid}:${localConfig.authToken}`)
      const url = `https://api.twilio.com/2010-04-01/Accounts/${localConfig.accountSid}.json`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
        },
      })

      if (response.ok) {
        setIsValid(true)
        toast.success('Twilio credentials validated!', {
          description: 'Your configuration is correct',
        })
      } else {
        setIsValid(false)
        toast.error('Invalid Twilio credentials', {
          description: 'Please check your Account SID and Auth Token',
        })
      }
    } catch (error) {
      console.error('Twilio validation error:', error)
      setIsValid(false)
      toast.error('Failed to validate credentials', {
        description: 'Please check your configuration',
      })
    } finally {
      setIsValidating(false)
    }
  }

  const handleSave = async () => {
    if (!localConfig.accountSid || !localConfig.authToken || !localConfig.phoneNumber) {
      toast.error('Please fill in all fields')
      return
    }

    setIsSaving(true)

    try {
      await setConfig(localConfig)
      
      toast.success('Twilio configuration saved!', {
        description: 'SMS OTP is now available',
      })
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save configuration')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value)
    toast.success(`${label} copied to clipboard`)
  }

  const maskValue = (value: string) => {
    if (!value || value.length < 8) return value
    return `${value.slice(0, 4)}${'•'.repeat(value.length - 8)}${value.slice(-4)}`
  }

  const isConfigured = config?.accountSid && config?.authToken && config?.phoneNumber

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DeviceMobile weight="fill" className="text-primary" size={28} />
            <div>
              <CardTitle>Twilio SMS Configuration</CardTitle>
              <CardDescription>Configure Twilio for SMS OTP authentication</CardDescription>
            </div>
          </div>
          {isConfigured && (
            <Badge variant="default" className="bg-accent text-accent-foreground">
              <CheckCircle weight="fill" size={14} className="mr-1" />
              Configured
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="border-primary/30 bg-primary/5">
          <Info weight="fill" className="text-primary" size={18} />
          <AlertDescription className="ml-2 text-sm">
            Get your Twilio credentials from{' '}
            <a
              href="https://console.twilio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline hover:text-primary/80"
            >
              console.twilio.com
            </a>
            . You'll need an Account SID, Auth Token, and a phone number with SMS capability.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <Label htmlFor="twilio-account-sid" className="text-sm font-semibold mb-2">
              Account SID
            </Label>
            <div className="flex gap-2">
              <Input
                id="twilio-account-sid"
                type="text"
                value={localConfig.accountSid}
                onChange={(e) => setLocalConfig({ ...localConfig, accountSid: e.target.value })}
                placeholder="AC..."
                className="flex-1 bg-background border-primary/30 focus:border-primary"
              />
              {localConfig.accountSid && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(localConfig.accountSid, 'Account SID')}
                >
                  <Copy size={16} />
                </Button>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="twilio-auth-token" className="text-sm font-semibold mb-2">
              Auth Token
            </Label>
            <div className="flex gap-2">
              <Input
                id="twilio-auth-token"
                type={showAuthToken ? 'text' : 'password'}
                value={localConfig.authToken}
                onChange={(e) => setLocalConfig({ ...localConfig, authToken: e.target.value })}
                placeholder="Your Twilio Auth Token"
                className="flex-1 bg-background border-primary/30 focus:border-primary"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowAuthToken(!showAuthToken)}
              >
                {showAuthToken ? <EyeSlash size={16} /> : <Eye size={16} />}
              </Button>
              {localConfig.authToken && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(localConfig.authToken, 'Auth Token')}
                >
                  <Copy size={16} />
                </Button>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="twilio-phone" className="text-sm font-semibold mb-2">
              Twilio Phone Number
            </Label>
            <div className="flex gap-2">
              <Input
                id="twilio-phone"
                type="tel"
                value={localConfig.phoneNumber}
                onChange={(e) => setLocalConfig({ ...localConfig, phoneNumber: e.target.value })}
                placeholder="+1 555 123 4567"
                className="flex-1 bg-background border-primary/30 focus:border-primary"
              />
              {localConfig.phoneNumber && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(localConfig.phoneNumber, 'Phone Number')}
                >
                  <Copy size={16} />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Must include country code (e.g., +1 for US)
            </p>
          </div>
        </div>

        {isValid !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Alert className={isValid ? 'border-accent/50 bg-accent/10' : 'border-destructive/50 bg-destructive/10'}>
              {isValid ? (
                <>
                  <CheckCircle weight="fill" className="text-accent" size={18} />
                  <AlertDescription className="ml-2 text-sm">
                    <span className="font-semibold text-accent">Valid Configuration</span>
                    <br />
                    Your Twilio credentials are correct and ready to use.
                  </AlertDescription>
                </>
              ) : (
                <>
                  <XCircle weight="fill" className="text-destructive" size={18} />
                  <AlertDescription className="ml-2 text-sm">
                    <span className="font-semibold text-destructive">Invalid Configuration</span>
                    <br />
                    Please check your Account SID and Auth Token.
                  </AlertDescription>
                </>
              )}
            </Alert>
          </motion.div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleValidate}
            variant="outline"
            className="flex-1"
            disabled={isValidating || !localConfig.accountSid || !localConfig.authToken}
          >
            {isValidating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                Validating...
              </>
            ) : (
              <>
                <CheckCircle weight="fill" size={18} />
                Test Connection
              </>
            )}
          </Button>
          
          <Button
            onClick={handleSave}
            className="flex-1 glow-primary"
            disabled={isSaving || !localConfig.accountSid || !localConfig.authToken || !localConfig.phoneNumber}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
                Saving...
              </>
            ) : (
              <>
                <DeviceMobile weight="fill" size={18} />
                Save Configuration
              </>
            )}
          </Button>
        </div>

        {isConfigured && (
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Info weight="fill" className="text-primary" size={16} />
              Current Configuration
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Account SID:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">{maskValue(config.accountSid)}</code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Auth Token:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">{maskValue(config.authToken)}</code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Phone:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">{config.phoneNumber}</code>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
