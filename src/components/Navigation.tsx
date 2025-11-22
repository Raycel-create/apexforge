import { useState, useEffect } from 'react'
import { Sparkle, SquaresFour, CreditCard, ChartBar, Fire } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

type Page = 'home' | 'dashboard' | 'pricing' | 'ceo' | 'generator'

interface NavigationProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [credits] = useKV<number>('user-credits', 5)
  const [clickCount, setClickCount] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)

  useEffect(() => {
    if (clickCount >= 5) {
      toast.success('🎭 CEO Dashboard Unlocked', {
        description: 'Welcome to the shadow realm...',
        duration: 3000,
      })
      onNavigate('ceo')
      setClickCount(0)
    }
  }, [clickCount, onNavigate])

  const handleLogoClick = () => {
    const now = Date.now()
    if (now - lastClickTime > 2000) {
      setClickCount(1)
    } else {
      setClickCount(prev => prev + 1)
      if (clickCount === 3) {
        toast.info('Keep going...', { duration: 1000 })
      }
    }
    setLastClickTime(now)
  }

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Fire weight="fill" className="text-destructive animate-pulse-glow" size={32} />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                ApexForge
              </span>
            </button>

            <div className="hidden md:flex items-center gap-1">
              <Button
                variant={currentPage === 'home' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('home')}
              >
                Home
              </Button>
              <Button
                variant={currentPage === 'dashboard' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('dashboard')}
              >
                <SquaresFour size={16} />
                Dashboard
              </Button>
              <Button
                variant={currentPage === 'pricing' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('pricing')}
              >
                <CreditCard size={16} />
                Pricing
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge className="px-3 py-1 bg-accent/20 text-accent border-accent/40">
              🔥 {credits} credits
            </Badge>
            <Button
              onClick={() => onNavigate('generator')}
              size="lg"
              className="glow-primary hover:scale-105 transition-transform"
            >
              <Fire weight="fill" size={18} />
              Ignite Forge
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

