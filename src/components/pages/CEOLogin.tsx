import { useState, useEffect } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Skull, Key, ShieldCheck, QrCode, User } from '@phosphor-icons/react'
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
  const { login, initializeTOTP, totpSecret, biometricsEnabled } = useCEOAuth()
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [totpToken, setTotpToken] = useState<string>('')
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [showSetup, setShowSetup] = useState<boolean>(false)
  const [passwordVerified, setPasswordVerified] = useState<boolean>(false)

  useEffect(() => {
    if (totpSecret) {
      generateQRCode(totpSecret)
    }
  }, [totpSecret])

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

  const verifyPassword = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || !password) {
      toast.error('Please fill in username and password')
      return
    }

    const CEO_USERNAME = 'papakoEddie@tripzy.international'
    const CEO_PASSWORD = '19780111'

    if (username === CEO_USERNAME && password === CEO_PASSWORD) {
      setPasswordVerified(true)
      if (!totpSecret) {
        const secret = initializeTOTP()
        toast.success('Password verified!', {
          description: 'TOTP has been generated. Scan the QR code with your authenticator app.',
          duration: 4000,
        })
      } else {
        toast.success('Password verified!', {
          description: 'Enter your 6-digit authentication code to continue.',
          duration: 3000,
        })
      }
    } else {
      toast.error('Invalid credentials', {
        description: 'Username or password is incorrect',
      })
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!totpToken || totpToken.length !== 6) {
      toast.error('Authentication code required (6 digits)')
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
          description: 'Invalid authentication code',
        })
      }
    } catch {
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
            {!passwordVerified ? (
              <form onSubmit={verifyPassword} className="space-y-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      1
                    </div>
                    <h3 className="text-xl font-bold">Password Authentication</h3>
                  </div>
                  <p className="text-sm text-muted-foreground ml-10">
                    Enter your CEO credentials
                  </p>
                </div>

                <div>
                  <Label htmlFor="username" className="text-base font-semibold mb-2 flex items-center gap-2">
                    <User weight="fill" className="text-primary" size={18} />
                    Email / Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="papakoEddie@tripzy.international"
                    className="h-12 bg-background border-primary/30 focus:border-primary text-base"
                    autoComplete="username"
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
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-base glow-primary"
                  disabled={!username || !password}
                >
                  <Key weight="fill" size={20} />
                  Verify Password
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
            ) : (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                      2
                    </div>
                    <h3 className="text-xl font-bold">TOTP Verification</h3>
                  </div>
                  <p className="text-sm text-muted-foreground ml-10">
                    Enter your 6-digit authentication code
                  </p>
                </div>

                <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <ShieldCheck weight="fill" className="text-primary" size={16} />
                    <span className="text-primary font-semibold">Password Verified ✓</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 ml-6">
                    User: {username}
                  </p>
                </div>

                <div>
                  <Label htmlFor="totp-token" className="text-base font-semibold mb-2 flex items-center gap-2">
                    <ShieldCheck weight="fill" className="text-accent" size={18} />
                    Authentication Code (Required)
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
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-12 text-base glow-accent"
                  disabled={isLoggingIn || !totpToken || totpToken.length !== 6}
                >
                  <ShieldCheck weight="fill" size={20} />
                  {isLoggingIn ? 'Authenticating...' : 'Complete Login'}
                </Button>

                <div className="pt-4 border-t border-border">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setPasswordVerified(false)
                      setTotpToken('')
                    }}
                  >
                    ← Back to Password
                  </Button>
                </div>
              </form>
            )}
          </Card>

          <Card className="p-8 border-accent/30 bg-card/80 backdrop-blur">
            {!passwordVerified ? (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <ShieldCheck weight="fill" className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground">
                      Enhanced security for CEO access
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">1</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-1">Password Authentication</p>
                        <p className="text-xs text-muted-foreground">
                          Enter your CEO username and password to verify your identity
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-accent">2</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-1">TOTP Verification (Required)</p>
                        <p className="text-xs text-muted-foreground">
                          Enter a 6-digit code from your authenticator app
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-3">
                      📱 Supported Authenticator Apps:
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                      <li>• Google Authenticator</li>
                      <li>• Microsoft Authenticator</li>
                      <li>• Authy</li>
                      <li>• 1Password</li>
                      <li>• Any TOTP-compatible app</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                    <QrCode weight="fill" className="text-accent" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">TOTP Setup</h3>
                    <p className="text-sm text-muted-foreground">
                      {totpSecret ? 'Scan QR code' : 'Generate your TOTP'}
                    </p>
                  </div>
                </div>

                {totpSecret ? (
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
                        <li>Open your authenticator app</li>
                        <li>Tap "Add" or "+" to add a new account</li>
                        <li>Scan the QR code above</li>
                        <li>Enter the 6-digit code to complete login</li>
                      </ol>
                    </div>

                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-accent font-semibold text-center">
                        ✓ TOTP is now REQUIRED for CEO login
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 border border-dashed border-border rounded-lg text-center">
                      <ShieldCheck size={32} className="mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-1">
                        TOTP not configured yet
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Click below to generate your TOTP secret
                      </p>
                    </div>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => {
                        const secret = initializeTOTP()
                        setShowSetup(true)
                        toast.info('TOTP Secret Generated', {
                          description: 'Scan the QR code with your authenticator app',
                        })
                      }}
                    >
                      <QrCode weight="fill" size={20} />
                      Generate TOTP Secret
                    </Button>
                  </div>
                )}
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
          <Card className="inline-block px-6 py-3 bg-primary/5 border-primary/30">
            <p className="text-sm font-mono">
              <span className="text-muted-foreground">Username:</span> <span className="text-foreground font-semibold">papakoEddie@tripzy.international</span>
            </p>
            <p className="text-sm font-mono mt-1">
              <span className="text-muted-foreground">Password:</span> <span className="text-foreground font-semibold">19780111</span>
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              🔒 Biometric authentication is optional (enable in Settings after login)
            </p>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
