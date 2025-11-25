import { useState, useEffect } from 'react'
import { SquaresFour, CreditCard, Fire, List, UserCircle, SignOut, Cube, CheckCircle, Warning } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { useScreenSize } from '../hooks/use-mobile'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { useBlackForge } from '../lib/BlackForgeContext'
import { FigmaAvailabilityIndicator } from './FigmaAvailabilityIndicator'
import { ThemeToggle } from './ThemeToggle'
import { AccessibilitySettings } from './AccessibilitySettings'
import { ApexForgeLogo } from './ApexForgeLogo'

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
        <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-[100vw] mx-auto gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <ApexForgeLogo 
                variant="navigation" 
                className={`${isMobile ? 'w-7 h-7' : 'w-9 h-9'} text-foreground shrink-0`} 
              />
              <span className="text-responsive font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent whitespace-nowrap">
                ApexForge
              </span>
            </div>

            {!isMobile && !isTablet && (
              <div className="hidden lg:flex items-center gap-1">
                <Button
                  variant={currentPage === 'home' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => onNavigate('home')}
                  className="h-10 px-3 text-responsive-sm touch-target"
                >
                  Home
                </Button>
                <Button
                  variant={currentPage === 'dashboard' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => onNavigate('dashboard')}
                  className="h-10 px-3 text-responsive-sm touch-target"
                >
                  <SquaresFour size={18} />
                  Dashboard
                </Button>
                <Button
                  variant={currentPage === 'pricing' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => onNavigate('pricing')}
                  className="h-10 px-3 text-responsive-sm touch-target"
                >
                  <CreditCard size={18} />
                  Pricing
                </Button>
                <Button
                  variant={currentPage === 'figma' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => onNavigate('figma')}
                  className="h-10 px-3 text-responsive-sm touch-target"
                >
                  <Cube size={18} />
                  Figma
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {!isMobile && !isTablet && (
              <FigmaAvailabilityIndicator />
            )}
            {currentUser && currentUserData ? (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-3 py-1.5 text-responsive-sm whitespace-nowrap hidden sm:flex items-center gap-1.5 touch-target">
                  <UserCircle size={18} />
                  {currentUserData.name}
                </Badge>
              </div>
            ) : !isMobile ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('auth')}
                className="whitespace-nowrap h-10 px-4 text-responsive-sm touch-target"
              >
                <UserCircle size={18} />
                Sign In
              </Button>
            ) : null}
            {!isMobile && (
              <Badge 
                className={`${
                  hasValidAIKeys 
                    ? 'bg-accent/20 text-accent border-accent/40' 
                    : 'bg-destructive/20 text-destructive border-destructive/40'
                } px-3 py-1.5 text-responsive-sm whitespace-nowrap hidden sm:flex items-center gap-1.5`}
              >
                {hasValidAIKeys ? (
                  <>
                    <CheckCircle weight="fill" size={16} />
                    AI Ready
                  </>
                ) : (
                  <>
                    <Warning weight="fill" size={16} />
                    Setup Keys
                  </>
                )}
              </Badge>
            )}
            <Badge className={`${isMobile ? 'px-2.5 py-1.5 text-responsive-sm' : 'px-3 py-1.5 text-responsive-sm'} ${
              blackForgeMode 
                ? 'bg-destructive/20 text-destructive border-destructive/40' 
                : 'bg-accent/20 text-accent border-accent/40'
            } transition-all duration-500 whitespace-nowrap touch-target`}>
              {blackForgeMode ? '🔥' : '🔥'} {credits}
            </Badge>
            {!isMobile && <AccessibilitySettings />}
            <ThemeToggle />
            
            {isMobile || isTablet ? (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button size="sm" variant="ghost" className="px-2.5 h-10 touch-target">
                    <List size={22} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64 sm:w-72">
                  <div className="flex flex-col gap-2 mt-6">
                    <div className="flex items-center justify-between mb-4 px-1">
                      <span className="text-responsive font-semibold">Settings</span>
                      <div className="flex items-center gap-2">
                        <AccessibilitySettings />
                        <ThemeToggle />
                      </div>
                    </div>
                    {currentUser && currentUserData ? (
                      <>
                        <div className="px-3 py-2.5 bg-muted rounded-lg mb-2">
                          <p className="text-responsive-sm text-muted-foreground">Signed in as</p>
                          <p className="text-responsive font-semibold truncate mt-0.5">{currentUserData.name}</p>
                          <p className="text-responsive-sm text-muted-foreground truncate mt-0.5">{currentUser}</p>
                        </div>
                        <Button
                          variant="outline"
                          className="justify-start h-11 text-responsive touch-target"
                          onClick={handleLogout}
                        >
                          <SignOut size={20} />
                          Sign Out
                        </Button>
                        <div className="my-2 border-t border-border" />
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          className="justify-start h-11 text-responsive touch-target"
                          onClick={() => handleNavigation('auth')}
                        >
                          <UserCircle size={20} />
                          Sign In
                        </Button>
                        <div className="my-2 border-t border-border" />
                      </>
                    )}
                    <Button
                      variant={currentPage === 'home' ? 'secondary' : 'ghost'}
                      className="justify-start h-11 text-responsive touch-target"
                      onClick={() => handleNavigation('home')}
                    >
                      Home
                    </Button>
                    <Button
                      variant={currentPage === 'dashboard' ? 'secondary' : 'ghost'}
                      className="justify-start h-11 text-responsive touch-target"
                      onClick={() => handleNavigation('dashboard')}
                    >
                      <SquaresFour size={20} />
                      Dashboard
                    </Button>
                    <Button
                      variant={currentPage === 'pricing' ? 'secondary' : 'ghost'}
                      className="justify-start h-11 text-responsive touch-target"
                      onClick={() => handleNavigation('pricing')}
                    >
                      <CreditCard size={20} />
                      Pricing
                    </Button>
                    <Button
                      variant={currentPage === 'figma' ? 'secondary' : 'ghost'}
                      className="justify-start h-11 text-responsive touch-target"
                      onClick={() => handleNavigation('figma')}
                    >
                      <Cube size={20} />
                      Figma
                    </Button>
                    <div className="my-2 border-t border-border" />
                    <Button
                      variant={currentPage === 'generator' ? 'secondary' : 'default'}
                      className="justify-start mt-2 glow-primary h-12 text-responsive font-semibold touch-target"
                      onClick={() => handleNavigation('generator')}
                    >
                      <Fire weight="fill" size={20} />
                      Ignite Forge
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Button
                onClick={() => onNavigate('generator')}
                size="sm"
                className={`${blackForgeMode ? 'glow-destructive bg-destructive hover:bg-destructive/90' : 'glow-primary'} hover:scale-105 transition-all duration-300 whitespace-nowrap h-9 px-4 text-sm`}
              >
                <Fire weight="fill" size={16} />
                {blackForgeMode ? '🔥 Ignite Dark Forge' : 'Ignite Forge'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}