import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { EnvelopeSimple, Lock, User, X, Eye, EyeSlash } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AuthModal({ open, onOpenChange, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (mode === 'signup' && !name) {
      toast.error('Please enter your name')
      return
    }
    
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    toast.success(mode === 'signin' ? 'Welcome back!' : 'Account created successfully!')
    onSuccess()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-gradient-to-br from-card via-card/95 to-card border-primary/30 backdrop-blur-xl">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X size={20} />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            {mode === 'signin' ? 'Welcome Back' : 'Join ApexForge'}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {mode === 'signin' 
              ? 'Sign in to continue building with your AI team' 
              : 'Create your account and start forging apps in seconds'}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.form
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-4 mt-4"
          >
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:border-primary transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <EnvelopeSimple className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary via-accent to-primary hover:opacity-90 transition-all glow-primary h-11"
            >
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="w-full border border-border/50 hover:border-primary/50 transition-all"
            >
              {mode === 'signin' ? 'Create Account' : 'Sign In'}
            </Button>
          </motion.form>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
