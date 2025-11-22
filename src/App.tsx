import { useState } from 'react'
import { Home } from './components/pages/Home'
import { Dashboard } from './components/pages/Dashboard'
import { Pricing } from './components/pages/Pricing'
import { CEODashboard } from './components/pages/CEODashboard'
import { Generator } from './components/pages/Generator'
import { Navigation } from './components/Navigation'
import { BlackForgeProvider } from './lib/BlackForgeContext'

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
    <BlackForgeProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="flex-1 overflow-x-hidden">
          {renderPage()}
        </main>
      </div>
    </BlackForgeProvider>
  )
}

export default App