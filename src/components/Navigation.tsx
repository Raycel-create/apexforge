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
        <div className="flex h-10 sm:h-12 items-center justify-between px-2 sm:px-3 lg:px-4 max-w-[100vw] mx-auto gap-1 sm:gap-2">
          <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <Sparkle weight="fill" size={isMobile ? 16 : 18} className="text-primary shrink-0" />
              <span className={`font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent whitespace-nowrap ${isMobile ? 'text-xs' : 'text-sm sm:text-base'}`}>
                ApexForge
              </span>
            </div>

            {!isMobile && !isTablet && (
              <div className="hidden lg:flex items-center gap-0.5">
                <Button
                  variant={currentPage === 'home' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => onNavigate('home')}
                  className="h-7 px-2 text-xs"
                >
                  Home
                </Button>
                <Button
                  variant={currentPage === 'dashboard' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => onNavigate('dashboard')}
                  className="h-7 px-2 text-xs"
                >
                  <SquaresFour size={12} />
                  Dashboard
                </Button>
                <Button
                  variant={currentPage === 'pricing' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => onNavigate('pricing')}
                  className="h-7 px-2 text-xs"
                >
                  <CreditCard size={12} />
                  Pricing
                </Button>
                <Button
                  variant={currentPage === 'figma' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => onNavigate('figma')}
                  className="h-7 px-2 text-xs"
                >
                  <Cube size={12} />
                  Figma
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2 shrink-0">
            {!isMobile && !isTablet && (
              <FigmaAvailabilityIndicator />
            )}
            {currentUser && currentUserData ? (
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="px-2 py-0.5 text-xs whitespace-nowrap hidden sm:flex">
                  <UserCircle size={12} className="mr-0.5" />
                  {currentUserData.name}
                </Badge>
              </div>
            ) : !isMobile ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('auth')}
                className="whitespace-nowrap h-7 px-2 text-xs"
              >
                <UserCircle size={12} />
                Sign In
              </Button>
            ) : null}
            {!isMobile && (
              <Badge 
                className={`${
                  hasValidAIKeys 
                    ? 'bg-accent/20 text-accent border-accent/40' 
                    : 'bg-destructive/20 text-destructive border-destructive/40'
                } px-1.5 py-0.5 text-[10px] whitespace-nowrap hidden sm:flex items-center gap-0.5`}
              >
                {hasValidAIKeys ? (
                  <>
                    <CheckCircle weight="fill" size={10} />
                    AI Ready
                  </>
                ) : (
                  <>
                    <Warning weight="fill" size={10} />
                    Setup Keys
                  </>
                )}
              </Badge>
            )}
            <Badge className={`${isMobile ? 'px-1 py-0 text-[9px]' : 'px-1.5 sm:px-2 py-0 sm:py-0.5 text-[10px] sm:text-xs'} ${
              blackForgeMode 
                ? 'bg-destructive/20 text-destructive border-destructive/40' 
                : 'bg-accent/20 text-accent border-accent/40'
            } transition-all duration-500 whitespace-nowrap`}>
              {blackForgeMode ? '🔥' : '🔥'} {credits}
            </Badge>
            
            {isMobile || isTablet ? (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button size="sm" variant="ghost" className="px-1 sm:px-1.5 h-7">
                    <List size={isMobile ? 16 : 18} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[200px] sm:w-56">
                  <div className="flex flex-col gap-1.5 mt-6">
                    {currentUser && currentUserData ? (
                      <>
                        <div className="px-2 py-1.5 bg-muted rounded-lg mb-1.5">
                          <p className="text-[10px] text-muted-foreground">Signed in as</p>
                          <p className="text-xs font-semibold truncate">{currentUserData.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{currentUser}</p>
                        </div>
                        <Button
                          variant="outline"
                          className="justify-start h-8 text-xs"
                          onClick={handleLogout}
                        >
                          <SignOut size={14} />
                          Sign Out
                        </Button>
                        <div className="my-1.5 border-t border-border" />
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          className="justify-start h-8 text-xs"
                          onClick={() => handleNavigation('auth')}
                        >
                          <UserCircle size={14} />
                          Sign In
                        </Button>
                        <div className="my-1.5 border-t border-border" />
                      </>
                    )}
                    <Button
                      variant={currentPage === 'home' ? 'secondary' : 'ghost'}
                      className="justify-start h-8 text-xs"
                      onClick={() => handleNavigation('home')}
                    >
                      Home
                    </Button>
                    <Button
                      variant={currentPage === 'dashboard' ? 'secondary' : 'ghost'}
                      className="justify-start h-8 text-xs"
                      onClick={() => handleNavigation('dashboard')}
                    >
                      <SquaresFour size={14} />
                      Dashboard
                    </Button>
                    <Button
                      variant={currentPage === 'pricing' ? 'secondary' : 'ghost'}
                      className="justify-start h-8 text-xs"
                      onClick={() => handleNavigation('pricing')}
                    >
                      <CreditCard size={14} />
                      Pricing
                    </Button>
                    <Button
                      variant={currentPage === 'figma' ? 'secondary' : 'ghost'}
                      className="justify-start h-8 text-xs"
                      onClick={() => handleNavigation('figma')}
                    >
                      <Cube size={14} />
                      Figma
                    </Button>
                    <div className="my-1.5 border-t border-border" />
                    <Button
                      variant={currentPage === 'generator' ? 'secondary' : 'default'}
                      className="justify-start mt-2 glow-primary h-8 text-xs"
                      onClick={() => handleNavigation('generator')}
                    >
                      <Fire weight="fill" size={14} />
                      Ignite Forge
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Button
                onClick={() => onNavigate('generator')}
                size="sm"
                className={`${blackForgeMode ? 'glow-destructive bg-destructive hover:bg-destructive/90' : 'glow-primary'} hover:scale-105 transition-all duration-300 whitespace-nowrap h-7 px-3 text-xs`}
              >
                <Fire weight="fill" size={14} />
                {blackForgeMode ? '🔥 Ignite Dark Forge' : 'Ignite Forge'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}