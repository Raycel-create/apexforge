import { useState } from 'react'
import { Home } from './components/pages/Home'
import { Dashboard } from './components/pages/Dashboard'
import { Pricing } from './components/pages/Pricing'
import { CEODashboard } from './components/pages/CEODashboard'
import { CEOLogin } from './components/pages/CEOLogin'
import { Generator } from './components/pages/Generator'
import { AuthLanding } from './components/pages/AuthLanding'
import { FigmaIntegration } from './components/pages/FigmaIntegration'
import { Navigation } from './components/Navigation'
import { SessionTimeoutDialog } from './components/SessionTimeoutDialog'
import { BlackForgeProvider } from './lib/BlackForgeContext'
import { CEOAuthProvider, useCEOAuth } from './lib/CEOAuthContext'

type Page = 'home' | 'dashboard' | 'pricing' | 'ceo' | 'generator' | 'auth' | 'figma'

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const { isAuthenticated } = useCEOAuth()

  const renderPage = () => {
    if (currentPage === 'ceo' && !isAuthenticated) {
      return <CEOLogin onNavigate={setCurrentPage} />
    }

    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />
      case 'pricing':
        return <Pricing onNavigate={setCurrentPage} />
      case 'ceo':
        return <CEODashboard onNavigate={setCurrentPage} />
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

  const showNavigation = currentPage !== 'auth' && !(currentPage === 'ceo' && !isAuthenticated)

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-sky-100">
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
    <CEOAuthProvider>
      <BlackForgeProvider>
        <AppContent />
      </BlackForgeProvider>
    </CEOAuthProvider>
  )
}

export default App