import { useState, useEffect } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Skull, Key, ShieldCheck, QrCode } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useCEOAuth } from '../../lib/CEOAuthContext'
import QRCode from 'qrcode'
import * as OTPAuth from 'otpauth'

type Page = 'home' | 'dashboard' | 'pricing' | 'ceo' | 'generator' | 'auth'

interface CEOLoginProps {
  onNavigate: (page: Page) => void
}

export function CEOLogin({ onNavigate }: CEOLoginProps) {
  const { login, initializeTOTP, totpSecret } = useCEOAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [totpToken, setTotpToken] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [showSetup, setShowSetup] = useState(false)

  useEffect(() => {
    if (!totpSecret) {
      const secret = initializeTOTP()
      generateQRCode(secret)
      setShowSetup(true)
    } else {
      generateQRCode(totpSecret)
    }
  }, [totpSecret, initializeTOTP])

  const generateQRCode = async (secret: string) => {
    const totp = new OTPAuth.TOTP({
      issuer: 'ApexForge',
      label: 'CEO Dashboard',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(secret),
    })

    const otpAuthUrl = totp.toString()
    
    try {
      const url = await QRCode.toDataURL(otpAuthUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#FFFFFF',
          light: '#1A1A1A',
        },
      })
      setQrCodeUrl(url)
    } catch (err) {
      console.error('Error generating QR code:', err)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || !password || !totpToken) {
      toast.error('Please fill in all fields')
      return
    }

    if (totpToken.length !== 6) {
      toast.error('Authentication code must be 6 digits')
      return
    }

    setIsLoggingIn(true)

    try {
      const success = await login(username, password, totpToken)
      
      if (success) {
        toast.success('🔥 CEO Access Granted', {
          description: 'Welcome to the Shadow Dashboard',
          duration: 2000,
        })
        setTimeout(() => {
          onNavigate('ceo')
        }, 500)
      } else {
        toast.error('Authentication failed', {
          description: 'Invalid credentials or authentication code',
        })
        setTotpToken('')
      }
    } catch (error) {
      toast.error('Login error', {
        description: 'Something went wrong. Please try again.',
      })
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 via-background to-primary/10 pointer-events-none" />
      
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05))] bg-[length:40px_40px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <Skull weight="fill" className="text-destructive animate-pulse" size={48} />
            <ShieldCheck weight="fill" className="text-primary" size={48} />
          </motion.div>
          <h1 className="text-4xl font-bold mb-2">CEO Authentication</h1>
          <p className="text-muted-foreground">Secure access to Shadow Dashboard</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-8 border-primary/30 bg-card/80 backdrop-blur">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="username" className="text-base font-semibold mb-2 flex items-center gap-2">
                  <Key weight="fill" className="text-primary" size={18} />
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter CEO username"
                  className="h-12 bg-background border-primary/30 focus:border-primary text-base"
                  autoComplete="username"
                  disabled={isLoggingIn}
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-base font-semibold mb-2 flex items-center gap-2">
                  <Key weight="fill" className="text-primary" size={18} />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="h-12 bg-background border-primary/30 focus:border-primary text-base"
                  autoComplete="current-password"
                  disabled={isLoggingIn}
                />
              </div>

              <div>
                <Label htmlFor="totp-token" className="text-base font-semibold mb-2 flex items-center gap-2">
                  <ShieldCheck weight="fill" className="text-accent" size={18} />
                  Authentication Code
                </Label>
                <Input
                  id="totp-token"
                  type="text"
                  value={totpToken}
                  onChange={(e) => setTotpToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="h-12 bg-background border-accent/30 focus:border-accent text-base tracking-widest text-center font-mono text-2xl"
                  maxLength={6}
                  autoComplete="one-time-code"
                  disabled={isLoggingIn}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base glow-primary"
                disabled={isLoggingIn || !username || !password || totpToken.length !== 6}
              >
                <ShieldCheck weight="fill" size={20} />
                {isLoggingIn ? 'Authenticating...' : 'Login to CEO Dashboard'}
              </Button>

              <div className="pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => onNavigate('home')}
                >
                  ← Back to Home
                </Button>
              </div>
            </form>
          </Card>

          <Card className="p-8 border-accent/30 bg-card/80 backdrop-blur">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <QrCode weight="fill" className="text-accent" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">TOTP Setup</h3>
                <p className="text-sm text-muted-foreground">
                  {showSetup ? 'Scan to complete setup' : 'Your authenticator'}
                </p>
              </div>
            </div>

            {showSetup && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg"
              >
                <p className="text-sm text-destructive font-semibold mb-2">⚠️ First Time Setup Required</p>
                <p className="text-xs text-muted-foreground">
                  Scan the QR code below with your authenticator app (Google Authenticator, Authy, etc.) to complete setup.
                </p>
              </motion.div>
            )}

            {qrCodeUrl ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center p-6 bg-white rounded-lg">
                  <img src={qrCodeUrl} alt="TOTP QR Code" className="w-64 h-64" />
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2 font-semibold">Manual Entry Key:</p>
                  <code className="text-xs bg-background px-3 py-2 rounded border border-border block break-all font-mono">
                    {totpSecret}
                  </code>
                  <p className="text-xs text-muted-foreground mt-2">
                    If you can't scan the QR code, enter this key manually in your authenticator app.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold">Setup Instructions:</p>
                  <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Open your authenticator app (Google Authenticator, Authy, etc.)</li>
                    <li>Tap "Add" or "+" to add a new account</li>
                    <li>Scan the QR code above or enter the manual key</li>
                    <li>Enter the 6-digit code from the app to login</li>
                  </ol>
                </div>

                {!showSetup && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-accent font-semibold text-center">
                      ✓ Authenticator configured and ready
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
              </div>
            )}
          </Card>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Card className="inline-block px-6 py-3 bg-destructive/5 border-destructive/30">
            <p className="text-xs text-muted-foreground">
              🔒 <span className="font-semibold text-destructive">High Security</span> - TOTP codes expire every 30 seconds and can only be used once
            </p>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
