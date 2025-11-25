import { Moon, Sun } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useKV } from '@github/spark/hooks'
import { useEffect } from 'react'

export function ThemeToggle() {
  const [theme, setTheme] = useKV<'light' | 'dark'>('theme', 'light')

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
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="touch-target"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <Sun className="transition-transform duration-200" />
      ) : (
        <Moon className="transition-transform duration-200" />
      )}
    </Button>
  )
}
