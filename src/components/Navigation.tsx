import { useState, useEffect } from 'react'
import { Sparkle, SquaresFour, CreditCard, ChartBar, Fire, List, X } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { useScreenSize } from '../hooks/use-mobile'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { useBlackForge } from '../lib/BlackForgeContext'

type Page = 'home' | 'dashboard' | 'pricing' | 'ceo' | 'generator'

interface NavigationProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const { blackForgeMode } = useBlackForge()
  const [credits] = useKV<number>('user-credits', 5)
  const [clickCount, setClickCount] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isMobile, isTablet } = useScreenSize()

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

  const handleNavigation = (page: Page) => {
    onNavigate(page)
    setMobileMenuOpen(false)
  }

  return (
    <nav className={`border-b ${blackForgeMode ? 'border-destructive/30 bg-destructive/5' : 'border-border bg-card/80'} backdrop-blur-lg sticky top-0 z-50 transition-all duration-500`}>
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-8">
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-1 sm:gap-2 text-lg sm:text-2xl font-bold hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Fire weight="fill" className={`${blackForgeMode ? 'text-destructive' : 'text-destructive'} animate-pulse-glow`} size={isMobile ? 24 : 32} />
              <span className={`bg-gradient-to-r ${blackForgeMode ? 'from-destructive via-destructive/70 to-destructive' : 'from-primary via-accent to-primary'} bg-clip-text text-transparent transition-all duration-500`}>
                {isMobile ? (blackForgeMode ? '🔥Apex' : 'Apex') : (blackForgeMode ? '🔥 ApexForge' : 'ApexForge')}
              </span>
            </button>

            {!isMobile && (
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
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Badge className={`${isMobile ? 'px-2 py-0.5 text-xs' : 'px-3 py-1'} ${
              blackForgeMode 
                ? 'bg-destructive/20 text-destructive border-destructive/40' 
                : 'bg-accent/20 text-accent border-accent/40'
            } transition-all duration-500`}>
              {blackForgeMode ? '🔥' : '🔥'} {credits}
            </Badge>
            
            {isMobile ? (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button size="sm" variant="ghost" className="px-2">
                    <List size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <div className="flex flex-col gap-2 mt-8">
                    <Button
                      variant={currentPage === 'home' ? 'secondary' : 'ghost'}
                      className="justify-start"
                      onClick={() => handleNavigation('home')}
                    >
                      Home
                    </Button>
                    <Button
                      variant={currentPage === 'dashboard' ? 'secondary' : 'ghost'}
                      className="justify-start"
                      onClick={() => handleNavigation('dashboard')}
                    >
                      <SquaresFour size={16} />
                      Dashboard
                    </Button>
                    <Button
                      variant={currentPage === 'pricing' ? 'secondary' : 'ghost'}
                      className="justify-start"
                      onClick={() => handleNavigation('pricing')}
                    >
                      <CreditCard size={16} />
                      Pricing
                    </Button>
                    <Button
                      variant={currentPage === 'generator' ? 'secondary' : 'default'}
                      className="justify-start mt-4 glow-primary"
                      onClick={() => handleNavigation('generator')}
                    >
                      <Fire weight="fill" size={18} />
                      Ignite Forge
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Button
                onClick={() => onNavigate('generator')}
                size={isTablet ? 'default' : 'lg'}
                className={`${blackForgeMode ? 'glow-destructive bg-destructive hover:bg-destructive/90' : 'glow-primary'} hover:scale-105 transition-all duration-300`}
              >
                <Fire weight="fill" size={18} />
                {isTablet ? (blackForgeMode ? '🔥 Forge' : 'Forge') : (blackForgeMode ? '🔥 Ignite Dark Forge' : 'Ignite Forge')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

