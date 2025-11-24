import { useState, useEffect } from 'react'
import { Sparkle, SquaresFour, CreditCard, Fire, List, UserCircle, SignOut, Cube, CheckCircle, Warning } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { useScreenSize } from '../hooks/use-mobile'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { useBlackForge } from '../lib/BlackForgeContext'
import { FigmaAvailabilityIndicator } from './FigmaAvailabilityIndicator'

type Page = 'home' | 'dashboard' | 'pricing' | 'generator' | 'auth' | 'figma'

interface NavigationProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const { blackForgeMode } = useBlackForge()
  const { isMobile, isTablet } = useScreenSize()
  const [currentUser] = useKV<string | null>('apexforge-current-user', null)
  const [users] = useKV<Record<string, { name: string; email: string }>>('apexforge-users', {})
  const [, setCurrentUserState] = useKV<string | null>('apexforge-current-user', null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hasValidAIKeys, setHasValidAIKeys] = useState(false)
  const [aiKeys] = useKV<Array<{ key: string; status: string }>>('ceo-keys-ai', [])
  const [credits] = useKV<number>('user-credits', 15)

  const currentUserData = currentUser && users ? users[currentUser] : null

  useEffect(() => {
    if (aiKeys && aiKeys.length > 0) {
      const validKeys = aiKeys.filter(k => k.key && k.key.length > 0 && k.status === 'valid')
      setHasValidAIKeys(validKeys.length > 0)
    } else {
      setHasValidAIKeys(false)
    }
  }, [aiKeys])

  const handleNavigation = (page: Page) => {
    onNavigate(page)
    setMobileMenuOpen(false)
  }

  const handleLogout = () => {
    setCurrentUserState(null)
    toast.success('Signed out successfully')
    setMobileMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur-md bg-background/80">
      <div className="w-full">
        <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 lg:px-6 max-w-[100vw] mx-auto gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Sparkle weight="fill" size={isMobile ? 20 : 24} className="text-primary shrink-0" />
              <span className={`font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent whitespace-nowrap ${isMobile ? 'text-base' : 'text-lg sm:text-xl'}`}>
                ApexForge
              </span>
            </div>

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
                <Button
                  variant={currentPage === 'figma' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => onNavigate('figma')}
                >
                  <Cube size={16} />
                  Figma
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0">
            {!isMobile && !isTablet && (
              <FigmaAvailabilityIndicator />
            )}
            {currentUser && currentUserData ? (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1.5 text-sm whitespace-nowrap hidden sm:flex">
                  <UserCircle size={14} className="mr-1" />
                  {currentUserData.name}
                </Badge>
              </div>
            ) : !isMobile ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('auth')}
                className="whitespace-nowrap"
              >
                <UserCircle size={16} />
                Sign In
              </Button>
            ) : null}
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
                    {currentUser && currentUserData ? (
                      <>
                        <div className="px-3 py-2 bg-muted rounded-lg mb-2">
                          <p className="text-xs text-muted-foreground">Signed in as</p>
                          <p className="text-sm font-semibold truncate">{currentUserData.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{currentUser}</p>
                        </div>
                        <Button
                          variant="outline"
                          className="justify-start"
                          onClick={handleLogout}
                        >
                          <SignOut size={16} />
                          Sign Out
                        </Button>
                        <div className="my-2 border-t border-border" />
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          className="justify-start"
                          onClick={() => handleNavigation('auth')}
                        >
                          <UserCircle size={16} />
                          Sign In
                        </Button>
                        <div className="my-2 border-t border-border" />
                      </>
                    )}
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
                      variant={currentPage === 'figma' ? 'secondary' : 'ghost'}
                      className="justify-start"
                      onClick={() => handleNavigation('figma')}
                    >
                      <Cube size={16} />
                      Figma
                    </Button>
                    <div className="my-2 border-t border-border" />
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