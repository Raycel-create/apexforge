import { useState } from 'react'
import { Home } from './components/pages/Home'
import { Dashboard } from './components/pages/Dashboard'
import { Pricing } from './components/pages/Pricing'
import { CEODashboard } from './components/pages/CEODashboard'
import { CEOLogin } from './components/pages/CEOLogin'
import { Generator } from './components/pages/Generator'
import { AuthLanding } from './components/pages/AuthLanding'
import { Navigation } from './components/Navigation'
import { BlackForgeProvider } from './lib/BlackForgeContext'
import { CEOAuthProvider, useCEOAuth } from './lib/CEOAuthContext'

type Page = 'home' | 'dashboard' | 'pricing' | 'ceo' | 'generator' | 'auth'

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const { isAuthenticated } = useCEOAuth()

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />
      case 'pricing':
        return <Pricing onNavigate={setCurrentPage} />
      case 'ceo':
        if (!isAuthenticated) {
          return <CEOLogin onNavigate={setCurrentPage} />
        }
        return <CEODashboard onNavigate={setCurrentPage} />
      case 'generator':
        return <Generator onNavigate={setCurrentPage} />
      case 'auth':
        return <AuthLanding onNavigate={setCurrentPage} />
      default:
        return <Home onNavigate={setCurrentPage} />
    }
  }

  const showNavigation = (currentPage !== 'ceo' && currentPage !== 'auth') || (currentPage === 'ceo' && isAuthenticated)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {showNavigation && <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />}
      <main className="flex-1 overflow-x-hidden">
        {renderPage()}
      </main>
    </div>
  )
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