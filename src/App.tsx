import { useState } from 'react'
import { Home } from './components/pages/Home'
import { Dashboard } from './components/pages/Dashboard'
import { Pricing } from './components/pages/Pricing'
import { Generator } from './components/pages/Generator'
import { AuthLanding } from './components/pages/AuthLanding'
import { FigmaIntegration } from './components/pages/FigmaIntegration'
import { RealtimeOTPDemo } from './components/pages/RealtimeOTPDemo'
import { CEOLogin } from './components/pages/CEOLogin'
import { CEODashboard } from './components/pages/CEODashboard'
import { Navigation } from './components/Navigation'
import { SessionTimeoutDialog } from './components/SessionTimeoutDialog'
import { CursorTrail } from './components/CursorTrail'
import { SparkleClickEffect } from './components/SparkleClickEffect'
import { BlackForgeProvider } from './lib/BlackForgeContext'
import { ResponsiveFontProvider } from './lib/ResponsiveFontProvider'
import { CEOAuthProvider, useCEOAuth } from './lib/CEOAuthContext'

type Page = 'home' | 'dashboard' | 'pricing' | 'generator' | 'auth' | 'figma' | 'otp' | 'ceo-login' | 'ceo'

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const { isAuthenticated } = useCEOAuth()

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page)
  }

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
      default:
        return <Home onNavigate={handleNavigate} />
    }
  }

  const showNavigation = currentPage !== 'auth' && currentPage !== 'otp' && currentPage !== 'ceo-login' && currentPage !== 'ceo'

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <CursorTrail />
      <SparkleClickEffect />
      {showNavigation && <Navigation currentPage={currentPage} onNavigate={handleNavigate} />}
      <main className="flex-1 overflow-x-hidden w-full">
        {renderPage()}
      </main>
      <SessionTimeoutDialog onNavigate={handleNavigate} />
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