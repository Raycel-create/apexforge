import { useState } from 'react'
import { Home } from './components/pages/Home'
import { Dashboard } from './components/pages/Dashboard'
import { Pricing } from './components/pages/Pricing'
import { Generator } from './components/pages/Generator'
import { AuthLanding } from './components/pages/AuthLanding'
import { FigmaIntegration } from './components/pages/FigmaIntegration'
import { RealtimeOTPDemo } from './components/pages/RealtimeOTPDemo'
import { Navigation } from './components/Navigation'
import { CursorTrail } from './components/CursorTrail'
import { SparkleClickEffect } from './components/SparkleClickEffect'
import { BlackForgeProvider } from './lib/BlackForgeContext'
import { ResponsiveFontProvider } from './lib/ResponsiveFontProvider'

type Page = 'home' | 'dashboard' | 'pricing' | 'generator' | 'auth' | 'figma' | 'otp'

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home')

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
      default:
        return <Home onNavigate={handleNavigate} />
    }
  }

  const showNavigation = currentPage !== 'auth' && currentPage !== 'otp'

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <CursorTrail />
      <SparkleClickEffect />
      {showNavigation && <Navigation currentPage={currentPage} onNavigate={handleNavigate} />}
      <main className="flex-1 overflow-x-hidden w-full">
        {renderPage()}
      </main>
    </div>
  );
}

function App() {
  return (
    <ResponsiveFontProvider>
      <BlackForgeProvider>
        <AppContent />
      </BlackForgeProvider>
    </ResponsiveFontProvider>
  )
}

export default App