import { useState } from 'react'
import { Home } from './components/pages/Home'
import { Dashboard } from './components/pages/Dashboard'
import { Pricing } from './components/pages/Pricing'
import { Generator } from './components/pages/Generator'
import { AuthLanding } from './components/pages/AuthLanding'
import { FigmaIntegration } from './components/pages/FigmaIntegration'
import { Navigation } from './components/Navigation'
import { SessionTimeoutDialog } from './components/SessionTimeoutDialog'
import { BlackForgeProvider } from './lib/BlackForgeContext'

type Page = 'home' | 'dashboard' | 'pricing' | 'generator' | 'auth' | 'figma'

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />
      case 'pricing':
        return <Pricing onNavigate={setCurrentPage} />
      case 'generator':
        return <Generator onNavigate={setCurrentPage} />
      case 'auth':
        return <AuthLanding onNavigate={setCurrentPage} />
      case 'figma':
        return <FigmaIntegration onNavigate={setCurrentPage} />
      default:
        return <Home onNavigate={setCurrentPage} />
    }
  }

  const showNavigation = currentPage !== 'auth'

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {showNavigation && <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />}
      <main className="flex-1 overflow-x-hidden w-full">
        {renderPage()}
      </main>
      <SessionTimeoutDialog onNavigate={setCurrentPage} />
    </div>
  );
}

function App() {
  return (
    <BlackForgeProvider>
      <AppContent />
    </BlackForgeProvider>
  )
}

export default App