import { Sparkle, SquaresFour, CreditCard, ChartBar } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { useKV } from '@github/spark/hooks'

type Page = 'home' | 'dashboard' | 'pricing' | 'ceo' | 'generator'

interface NavigationProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [credits] = useKV<number>('user-credits', 5)

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-xl font-bold"
            >
              <Sparkle weight="fill" className="text-primary" size={28} />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ApexForge
              </span>
            </button>

            <div className="hidden md:flex items-center gap-1">
              <Button
                variant={currentPage === 'home' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('home')}
              >
                Home
              </Button>
              <Button
                variant={currentPage === 'dashboard' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('dashboard')}
              >
                <SquaresFour size={16} />
                Dashboard
              </Button>
              <Button
                variant={currentPage === 'pricing' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('pricing')}
              >
                <CreditCard size={16} />
                Pricing
              </Button>
              <Button
                variant={currentPage === 'ceo' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => onNavigate('ceo')}
              >
                <ChartBar size={16} />
                CEO
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-accent border-accent/50">
              {credits} credits
            </Badge>
            <Button
              onClick={() => onNavigate('generator')}
              className="glow-primary"
            >
              <Sparkle weight="fill" size={16} />
              Generate App
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

