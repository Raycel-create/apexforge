import { useState } from 'react'
import { Home } from './components/pages/Home'
import { Dashboard } from './components/pages/Dashboard'
import { Pricing } from './components/pages/Pricing'
import { CEODashboard } from './components/pages/CEODashboard'
import { Generator } from './components/pages/Generator'
import { Navigation } from './components/Navigation'
import { Toaster } from './components/ui/sonner'

type Page = 'home' | 'dashboard' | 'pricing' | 'ceo' | 'generator'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')

  const renderPage = () => {
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
      default:
        return <Home onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
      <Toaster position="top-right" />
    </div>
  )
}

export default App