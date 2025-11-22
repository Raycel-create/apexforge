import { useState, useEffect } from 'react'
import { Sparkle, SquaresFour, CreditCard, ChartBar, Fire, List, X, Key, CheckCircle, Warning } from '@phosphor-icons/react'
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
  const [aiKeys] = useKV<any[]>('ceo-keys-ai', [])
  const [hasValidAIKeys, setHasValidAIKeys] = useState(false)

  useEffect(() => {
    if (aiKeys && aiKeys.length > 0) {
      const validKeys = aiKeys.filter(k => k.key && k.key.length > 0 && k.status === 'valid')
      setHasValidAIKeys(validKeys.length > 0)
    } else {
      setHasValidAIKeys(false)
    }
  }, [aiKeys])

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
    <nav className={`border-b ${blackForgeMode ? 'border-destructive/30 bg-destructive/5' : 'border-border bg-card/80'} backdrop-blur-lg sticky top-0 z-50 transition-all duration-500 w-full`}>
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 max-w-[1400px]">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-8 min-w-0">
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-1 sm:gap-2 text-base sm:text-lg lg:text-2xl font-bold hover:opacity-80 transition-opacity cursor-pointer shrink-0"
            >
              <Fire weight="fill" className={`${blackForgeMode ? 'text-destructive' : 'text-destructive'} animate-pulse-glow`} size={isMobile ? 20 : 28} />
              <span className={`bg-gradient-to-r ${blackForgeMode ? 'from-destructive via-destructive/70 to-destructive' : 'from-primary via-accent to-primary'} bg-clip-text text-transparent transition-all duration-500 whitespace-nowrap`}>
                {isMobile ? 'Apex' : (isTablet ? 'ApexForge' : (blackForgeMode ? '🔥 ApexForge' : 'ApexForge'))}
              </span>
            </button>

            {!isMobile && !isTablet && (
              <div className="hidden lg:flex items-center gap-1">
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

          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0">
            {!isMobile && (
              <Badge 
                className={`${
                  hasValidAIKeys 
                    ? 'bg-accent/20 text-accent border-accent/40' 
                    : 'bg-destructive/20 text-destructive border-destructive/40'
                } px-2 py-1 text-xs whitespace-nowrap hidden sm:flex items-center gap-1`}
              >
                {hasValidAIKeys ? (
                  <>
                    <CheckCircle weight="fill" size={12} />
                    AI Ready
                  </>
                ) : (
                  <>
                    <Warning weight="fill" size={12} />
                    Setup Keys
                  </>
                )}
              </Badge>
            )}
            <Badge className={`${isMobile ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm'} ${
              blackForgeMode 
                ? 'bg-destructive/20 text-destructive border-destructive/40' 
                : 'bg-accent/20 text-accent border-accent/40'
            } transition-all duration-500 whitespace-nowrap`}>
              {blackForgeMode ? '🔥' : '🔥'} {credits}
            </Badge>
            
            {isMobile || isTablet ? (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button size="sm" variant="ghost" className="px-1.5 sm:px-2">
                    <List size={isMobile ? 18 : 20} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[240px] sm:w-64">
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
                size="lg"
                className={`${blackForgeMode ? 'glow-destructive bg-destructive hover:bg-destructive/90' : 'glow-primary'} hover:scale-105 transition-all duration-300 whitespace-nowrap`}
              >
                <Fire weight="fill" size={18} />
                {blackForgeMode ? '🔥 Ignite Dark Forge' : 'Ignite Forge'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

