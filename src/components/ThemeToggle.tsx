import { Moon, Sun } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useKV } from '@github/spark/hooks'
import { useEffect } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'

export function ThemeToggle() {
  const [theme, setTheme] = useKV<'light' | 'dark'>('theme', 'light')
  const isMobile = useIsMobile()

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="touch-target shrink-0 border-border/50 hover:bg-accent hover:border-accent/40 transition-all duration-300 hover:scale-105"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <Sun 
          weight="fill" 
          size={isMobile ? 20 : 18}
          className="transition-transform duration-300 hover:rotate-180" 
        />
      ) : (
        <Moon 
          weight="fill"
          size={isMobile ? 20 : 18}
          className="transition-transform duration-300 hover:-rotate-12" 
        />
      )}
    </Button>
  )
}
