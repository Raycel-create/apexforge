import { useState } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Sparkle, Lightning, UserCircle, EnvelopeSimple, Lock, Eye, EyeSlash, Check, MagicWand, ShieldCheck, DeviceMobile } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useKV } from '@github/spark/hooks'
import { MagicLinkAuth } from '../MagicLinkAuth'
import { GoogleAuthButton } from '../GoogleAuthButton'
import { OTPAuth } from '../OTPAuth'
import { SMSOTPAuth } from '../SMSOTPAuth'
import { GitHubOTPButton } from '../GitHubOTPButton'

type Page = 'home' | 'dashboard' | 'pricing' | 'ceo' | 'generator' | 'auth'

interface AuthLandingProps {
  onNavigate: (page: Page) => void
}

interface User {
  email: string
  password: string
  name: string
  createdAt: number
}

export function AuthLanding({ onNavigate }: AuthLandingProps) {
  const [authMode, setAuthMode] = useState<'password' | 'magic' | 'otp' | 'sms'>('otp')
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useKV<Record<string, User>>('apexforge-users', {})
  const [, setCurrentUser] = useKV<string | null>('apexforge-current-user', null)

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast.error('Name is required')
      return
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    if (!validatePassword(password)) {
      toast.error('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      if (users && users[email]) {
        toast.error('Account already exists', {
          description: 'Please sign in instead',
        })
        setIsLoading(false)
        return
      }

      const newUser: User = {
        email,
        password,
        name,
        createdAt: Date.now(),
      }

      setUsers((current) => ({
        ...current,
        [email]: newUser,
      }))

      setCurrentUser(email)

      toast.success('🎉 Welcome to ApexForge!', {
        description: 'Your account has been created successfully',
        duration: 3000,
      })

      setTimeout(() => {
        onNavigate('dashboard')
      }, 1000)
    } catch (error) {
      toast.error('Sign up failed', {
        description: 'Something went wrong. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLinkSuccess = async (email: string) => {
    setCurrentUser(email)
    
    if (!users?.[email]) {
      const newUser: User = {
        email,
        password: '',
        name: email.split('@')[0],
        createdAt: Date.now(),
      }
      
      setUsers((current) => ({
        ...current,
        [email]: newUser,
      }))
    }
    
    const user = users?.[email]
    const userName = user?.name || email.split('@')[0]
    
    toast.success(`Welcome${user ? ' back' : ''}, ${userName}! 🚀`, {
      description: 'Signed in successfully with magic link',
      duration: 2000,
    })

    setTimeout(() => {
      onNavigate('dashboard')
    }, 1000)
  }

  const handleOTPSuccess = async (email: string, provider: 'email' | 'github') => {
    setCurrentUser(email)
    
    if (!users?.[email]) {
      const newUser: User = {
        email,
        password: '',
        name: email.split('@')[0],
        createdAt: Date.now(),
      }
      
      setUsers((current) => ({
        ...current,
        [email]: newUser,
      }))
    }
    
    const user = users?.[email]
    const userName = user?.name || email.split('@')[0]
    const providerName = provider === 'github' ? 'GitHub' : 'email'
    
    toast.success(`Welcome${user ? ' back' : ''}, ${userName}! 🚀`, {
      description: `Signed in successfully with ${providerName} OTP`,
      duration: 2000,
    })

    setTimeout(() => {
      onNavigate('dashboard')
    }, 1000)
  }

  const handleSMSOTPSuccess = async (phoneNumber: string) => {
    const email = `${phoneNumber.replace(/\D/g, '')}@sms.apexforge.app`
    setCurrentUser(email)
    
    if (!users?.[email]) {
      const newUser: User = {
        email,
        password: '',
        name: phoneNumber,
        createdAt: Date.now(),
      }
      
      setUsers((current) => ({
        ...current,
        [email]: newUser,
      }))
    }
    
    const user = users?.[email]
    const userName = user?.name || phoneNumber
    
    toast.success(`Welcome${user ? ' back' : ''}, ${userName}! 🚀`, {
      description: 'Signed in successfully with SMS OTP',
      duration: 2000,
    })

    setTimeout(() => {
      onNavigate('dashboard')
    }, 1000)
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    if (!password) {
      toast.error('Password is required')
      return
    }

    setIsLoading(true)

    try {
      const user = users?.[email]

      if (!user) {
        toast.error('Account not found', {
          description: 'Please sign up first',
        })
        setIsLoading(false)
        return
      }

      if (user.password !== password) {
        toast.error('Invalid password', {
          description: 'Please check your password and try again',
        })
        setIsLoading(false)
        return
      }

      setCurrentUser(email)

      toast.success(`Welcome back, ${user.name}! 🚀`, {
        description: 'Signed in successfully',
        duration: 2000,
      })

      setTimeout(() => {
        onNavigate('dashboard')
      }, 1000)
    } catch (error) {
      toast.error('Sign in failed', {
        description: 'Something went wrong. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' }
    if (password.length < 8) return { strength: 33, label: 'Weak', color: 'bg-destructive' }
    if (password.length < 12) return { strength: 66, label: 'Good', color: 'bg-accent' }
    return { strength: 100, label: 'Strong', color: 'bg-primary' }
  }

  const currentStrength = passwordStrength(password)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 pointer-events-none" />
      
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05))] bg-[length:40px_40px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Lightning weight="fill" className="text-primary glow-primary" size={40} />
            <Sparkle weight="fill" className="text-accent glow-accent" size={32} />
          </motion.div>
          <h1 className="text-4xl font-bold mb-2">
            {isSignUp ? 'Join ApexForge' : 'Welcome Back'}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp 
              ? 'Create your account and start building with AI' 
              : 'Sign in to continue building amazing apps'}
          </p>
        </div>

        <Card className="p-8 border-primary/30 bg-card/90 backdrop-blur">
          <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as 'password' | 'magic' | 'otp' | 'sms')} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="otp" className="flex items-center gap-2">
                <ShieldCheck weight="fill" size={16} />
                Email OTP
              </TabsTrigger>
              <TabsTrigger value="sms" className="flex items-center gap-2">
                <DeviceMobile weight="fill" size={16} />
                SMS OTP
              </TabsTrigger>
              <TabsTrigger value="magic" className="flex items-center gap-2">
                <MagicWand weight="fill" size={16} />
                Magic Link
              </TabsTrigger>
              <TabsTrigger value="password" className="flex items-center gap-2">
                <Lock weight="fill" size={16} />
                Password
              </TabsTrigger>
            </TabsList>

            <TabsContent value="otp">
              <OTPAuth 
                onSuccess={handleOTPSuccess}
                onCancel={() => setAuthMode('password')}
                provider="email"
              />
            </TabsContent>

            <TabsContent value="sms">
              <SMSOTPAuth 
                onSuccess={handleSMSOTPSuccess}
                onCancel={() => setAuthMode('password')}
              />
            </TabsContent>

            <TabsContent value="magic">
              <MagicLinkAuth 
                onSuccess={handleMagicLinkSuccess}
                onCancel={() => setAuthMode('password')}
              />
            </TabsContent>

            <TabsContent value="password">
              <AnimatePresence mode="wait">
                <motion.form
                  key={isSignUp ? 'signup' : 'signin'}
                  initial={{ opacity: 0, x: isSignUp ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isSignUp ? -20 : 20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={isSignUp ? handleSignUp : handleSignIn}
                  className="space-y-5"
                >
                  {isSignUp && (
                    <div>
                      <Label htmlFor="name" className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <UserCircle weight="fill" className="text-primary" size={16} />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="h-11 bg-background border-primary/30 focus:border-primary"
                        autoComplete="name"
                        disabled={isLoading}
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <EnvelopeSimple weight="fill" className="text-primary" size={16} />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-11 bg-background border-primary/30 focus:border-primary"
                      autoComplete="email"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Lock weight="fill" className="text-primary" size={16} />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="h-11 bg-background border-primary/30 focus:border-primary pr-10"
                        autoComplete={isSignUp ? 'new-password' : 'current-password'}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {isSignUp && password && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Password strength</span>
                          <span className={`text-xs font-semibold ${
                            currentStrength.strength === 100 ? 'text-primary' : 
                            currentStrength.strength === 66 ? 'text-accent' : 
                            'text-destructive'
                          }`}>
                            {currentStrength.label}
                          </span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${currentStrength.strength}%` }}
                            className={`h-full ${currentStrength.color} transition-all duration-300`}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {isSignUp && (
                    <div>
                      <Label htmlFor="confirm-password" className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Check weight="bold" className="text-accent" size={16} />
                        Confirm Password
                      </Label>
                      <Input
                        id="confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        className="h-11 bg-background border-accent/30 focus:border-accent"
                        autoComplete="new-password"
                        disabled={isLoading}
                      />
                      {confirmPassword && (
                        <p className={`text-xs mt-1.5 ${
                          password === confirmPassword ? 'text-accent' : 'text-destructive'
                        }`}>
                          {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                        </p>
                      )}
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 text-base glow-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground" />
                        {isSignUp ? 'Creating Account...' : 'Signing In...'}
                      </>
                    ) : (
                      <>
                        <Lightning weight="fill" size={20} />
                        {isSignUp ? 'Create Account' : 'Sign In'}
                      </>
                    )}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>

                  <GoogleAuthButton 
                    onSuccess={() => handleMagicLinkSuccess('')}
                    mode={isSignUp ? 'signup' : 'signin'}
                  />

                  <div className="mt-3">
                    <GitHubOTPButton
                      onCodeSent={(email) => {
                        setEmail(email)
                        setAuthMode('otp')
                      }}
                      mode={isSignUp ? 'signup' : 'signin'}
                    />
                  </div>
                </motion.form>
              </AnimatePresence>

              <div className="mt-6">
                <Separator className="my-6" />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setIsSignUp(!isSignUp)
                      setEmail('')
                      setPassword('')
                      setConfirmPassword('')
                      setName('')
                      setShowPassword(false)
                    }}
                    disabled={isLoading}
                    className="font-semibold"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => onNavigate('home')}
              disabled={isLoading}
            >
              ← Back to Home
            </Button>
          </div>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Card className="inline-block px-6 py-3 bg-primary/5 border-primary/30">
            <p className="text-xs text-muted-foreground">
              🔒 <span className="font-semibold text-primary">Secure</span> - Your credentials are safely stored locally
            </p>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
