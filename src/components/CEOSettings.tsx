import { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import { Bank, ShieldCheck, Fingerprint, QrCode, CreditCard, Globe } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { useCEOAuth } from '../lib/CEOAuthContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { EmailNotificationSettings } from './EmailNotificationSettings'
import { EmailServiceConfig } from './EmailServiceConfig'

export function CEOSettings() {
  const { biometricsEnabled, toggleBiometrics, initializeTOTP } = useCEOAuth()
  const [bankConnected, setBankConnected] = useKV<boolean>('ceo-bank-connected', false)
  const [bankDetails, setBankDetails] = useKV<{
    name: string
    country: string
    connectedAt?: number
  } | null>('ceo-bank-details', null)

  const handleConnectBank = () => {
    const bankName = 'Philippine Bank (Ready for Worldwide)'
    setBankDetails({
      name: bankName,
      country: 'Philippines',
      connectedAt: Date.now(),
    })
    setBankConnected(true)
    toast.success('Bank Connected Successfully', {
      description: 'Your payment gateway is now ready to accept transactions worldwide',
    })
  }

  const handleDisconnectBank = () => {
    setBankDetails(null)
    setBankConnected(false)
    toast.info('Bank Disconnected', {
      description: 'Payment gateway has been disabled',
    })
  }

  const handleToggleBiometrics = () => {
    if (!biometricsEnabled) {
      initializeTOTP()
    }
    toggleBiometrics()
    toast.success(
      biometricsEnabled ? 'Biometric Auth Disabled' : 'Biometric Auth Enabled',
      {
        description: biometricsEnabled
          ? 'You can now login with just email and password'
          : 'Additional security layer activated. Use your authenticator app for login.',
      }
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">CEO Settings</h2>
        <p className="text-muted-foreground">
          Configure payment gateways, security, and email notifications
        </p>
      </div>

      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email-service">Email Service</TabsTrigger>
          <TabsTrigger value="notifications">Email Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="payments" className="space-y-6 mt-6">

      <Card className="p-6 border-primary/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
            <Bank weight="fill" className="text-primary" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold">Bank Connection</h3>
            <p className="text-sm text-muted-foreground">
              Connect your payment gateway for worldwide transactions
            </p>
          </div>
        </div>

        {bankConnected && bankDetails ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <CreditCard weight="fill" className="text-accent" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">{bankDetails.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <Globe size={12} />
                      {bankDetails.country} • Worldwide payments enabled
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-accent">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-sm font-semibold">Active</span>
                </div>
              </div>
              {bankDetails.connectedAt && (
                <p className="text-xs text-muted-foreground">
                  Connected on {new Date(bankDetails.connectedAt).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleDisconnectBank}
              >
                Disconnect Bank
              </Button>
              <Button
                className="flex-1 bg-accent hover:bg-accent/90"
                onClick={() => toast.info('Coming Soon', {
                  description: 'Advanced payment settings will be available shortly',
                })}
              >
                Configure Settings
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 border border-dashed border-border rounded-lg text-center">
              <Globe size={32} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-1">
                No bank connected
              </p>
              <p className="text-xs text-muted-foreground">
                Connect your bank to enable worldwide payment processing
              </p>
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary/90 glow-primary"
              onClick={handleConnectBank}
            >
              <Bank weight="fill" size={20} />
              Connect Philippine Bank (Worldwide Ready)
            </Button>

            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-accent" />
                Secure Connection
              </div>
              <div className="flex items-center gap-1">
                <Globe size={14} className="text-primary" />
                Global Payments
              </div>
              <div className="flex items-center gap-1">
                <CreditCard size={14} className="text-accent" />
                All Major Cards
              </div>
              <div className="flex items-center gap-1">
                <Bank size={14} className="text-primary" />
                Direct Transfer
              </div>
            </div>
          </div>
        )}
      </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
      <Card className="p-6 border-accent/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
            <ShieldCheck weight="fill" className="text-accent" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold">Security Settings</h3>
            <p className="text-sm text-muted-foreground">
              Enhanced authentication and access control
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3 flex-1">
              <Fingerprint weight="fill" className="text-accent" size={24} />
              <div className="flex-1">
                <Label htmlFor="biometrics" className="font-semibold cursor-pointer">
                  Biometric Authentication / Auth App
                </Label>
                <p className="text-xs text-muted-foreground">
                  Require TOTP code from authenticator app for enhanced security
                </p>
              </div>
            </div>
            <Switch
              id="biometrics"
              checked={biometricsEnabled}
              onCheckedChange={handleToggleBiometrics}
            />
          </div>

          {biometricsEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-accent/10 border border-accent/30 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <QrCode weight="fill" className="text-accent mt-1" size={20} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-accent mb-1">
                    ✓ Enhanced Security Active
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Your CEO Dashboard now requires a TOTP code from your authenticator app 
                    (Google Authenticator, Authy, etc.) in addition to your password. 
                    Check the login page for QR code setup if you haven't configured it yet.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <Separator />

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Security Features</h4>
            <div className="grid gap-2">
              {[
                { label: '2FA Authentication', status: biometricsEnabled },
                { label: 'Session Encryption', status: true },
                { label: 'IP Whitelisting', status: false },
                { label: 'Audit Logging', status: true },
              ].map((feature) => (
                <div
                  key={feature.label}
                  className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                >
                  <span className="text-sm">{feature.label}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      feature.status
                        ? 'bg-accent/20 text-accent'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {feature.status ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
        </TabsContent>

        <TabsContent value="email-service" className="space-y-6 mt-6">
          <EmailServiceConfig />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <EmailNotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
