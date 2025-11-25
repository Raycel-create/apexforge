import { useState, useEffect } from 'react'
import { Home } from './components/pages/Home'
import { Dashboard } from './components/pages/Dashboard'
import { Pricing } from './components/pages/Pricing'
import { Generator } from './components/pages/Generator'
import { AuthLanding } from './components/pages/AuthLanding'
import { FigmaIntegration } from './components/pages/FigmaIntegration'
import { RealtimeOTPDemo } from './components/pages/RealtimeOTPDemo'
import { CEOLogin } from './components/pages/CEOLogin'
import { CEODashboard } from './components/pages/CEODashboard'
import { ButtonTestPage } from './components/pages/ButtonTestPage'
import { Navigation } from './components/Navigation'
import { SessionTimeoutDialog } from './components/SessionTimeoutDialog'
import { CursorTrail } from './components/CursorTrail'
import { SparkleClickEffect } from './components/SparkleClickEffect'
import { ButtonTestFloatingButton } from './components/ButtonTestFloatingButton'
import { BlackForgeProvider } from './lib/BlackForgeContext'
import { ResponsiveFontProvider } from './lib/ResponsiveFontProvider'
import { CEOAuthProvider, useCEOAuth } from './lib/CEOAuthContext'
import { ceoAuditService } from './lib/ceoAuditService'
import { securityNotificationService } from './lib/securityNotificationService'
import { toast } from 'sonner'

type Page = 'home' | 'dashboard' | 'pricing' | 'generator' | 'auth' | 'figma' | 'otp' | 'ceo-login' | 'ceo' | 'button-test'

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const { isAuthenticated } = useCEOAuth()

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page)
  }

  useEffect(() => {
    const handleKeyboardShortcut = async (event: KeyboardEvent) => {
      if (event.shiftKey && event.ctrlKey && event.key.toLowerCase() === 'm') {
        event.preventDefault()
        
        const getCurrentIP = async (): Promise<string> => {
          try {
            const response = await fetch('https://api.ipify.org?format=json')
            const data = await response.json()
            return data.ip
          } catch (error) {
            return 'unknown'
          }
        }
        
        const ip = await getCurrentIP()
        
        await ceoAuditService.logAccess(
          'unknown', 
          'keyboard_shortcut_attempt', 
          'Keyboard shortcut Shift+Ctrl+M triggered'
        )
        
        await securityNotificationService.addAlert({
          severity: 'low',
          type: 'unauthorized_access',
          title: 'Keyboard Shortcut Used',
          message: 'Someone used the Shift+Ctrl+M keyboard shortcut to access CEO login',
          ipAddress: ip,
          userAgent: navigator.userAgent,
          actionRequired: false,
        })
        
        toast.info('🔐 CEO Access Shortcut', {
          description: 'Redirecting to secure login...',
          duration: 2000,
        })
        
        setTimeout(() => {
          setCurrentPage('ceo-login')
        }, 500)
      }
    }

    window.addEventListener('keydown', handleKeyboardShortcut)
    
    return () => {
      window.removeEventListener('keydown', handleKeyboardShortcut)
    }
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />
      case 'pricing':
        return <Pricing onNavigate={handleNavigate} />
      case 'generator':
        return <Generator onNavigate={handleNavigate} />
      case 'auth':
        return <AuthLanding onNavigate={handleNavigate} />
      case 'figma':
        return <FigmaIntegration onNavigate={handleNavigate} />
      case 'otp':
        return <RealtimeOTPDemo onNavigate={handleNavigate} />
      case 'ceo-login':
        return <CEOLogin onNavigate={handleNavigate} />
      case 'ceo':
        return isAuthenticated ? <CEODashboard onNavigate={handleNavigate} /> : <CEOLogin onNavigate={handleNavigate} />
      case 'button-test':
        return <ButtonTestPage onNavigate={handleNavigate} />
      default:
        return <Home onNavigate={handleNavigate} />
    }
  }

  const showNavigation = currentPage !== 'auth' && currentPage !== 'otp' && currentPage !== 'ceo-login' && currentPage !== 'ceo' && currentPage !== 'button-test'

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <CursorTrail />
      <SparkleClickEffect />
      {showNavigation && <Navigation currentPage={currentPage} onNavigate={handleNavigate} />}
      <main className="flex-1 overflow-x-hidden w-full">
        {renderPage()}
      </main>
      <SessionTimeoutDialog onNavigate={handleNavigate} />
      <ButtonTestFloatingButton />
    </div>
  );
}

function App() {
  return (
    <ResponsiveFontProvider>
      <BlackForgeProvider>
        <CEOAuthProvider>
          <AppContent />
        </CEOAuthProvider>
      </BlackForgeProvider>
    </ResponsiveFontProvider>
  )
}

export default App