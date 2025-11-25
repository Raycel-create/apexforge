import { GithubLogo, TwitterLogo, LinkedinLogo, DiscordLogo, ShieldCheck } from '@phosphor-icons/react'
import { Separator } from './ui/separator'
import { ApexForgeLogo } from './ApexForgeLogo'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { motion } from 'framer-motion'

interface FooterProps {
  onNavigate?: (page: 'home' | 'dashboard' | 'pricing' | 'generator' | 'auth' | 'figma' | 'ceo-login') => void
}

export function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const handleNavClick = (page: 'home' | 'dashboard' | 'pricing' | 'generator' | 'auth' | 'figma' | 'ceo-login') => {
    if (onNavigate) {
      onNavigate(page)
    }
  }

  return (
    <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ApexForgeLogo variant="footer" className="w-8 h-8 text-foreground" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ApexForge
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The AI app builder that feels like you hired a world-class dev team. Watch AI agents argue, build, and deploy in real-time.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-background/50 hover:bg-primary/20 border border-border/50 hover:border-primary/50 flex items-center justify-center transition-all group"
              >
                <GithubLogo size={18} className="group-hover:text-primary transition-colors" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-background/50 hover:bg-primary/20 border border-border/50 hover:border-primary/50 flex items-center justify-center transition-all group"
              >
                <TwitterLogo size={18} className="group-hover:text-primary transition-colors" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-background/50 hover:bg-primary/20 border border-border/50 hover:border-primary/50 flex items-center justify-center transition-all group"
              >
                <LinkedinLogo size={18} className="group-hover:text-primary transition-colors" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-background/50 hover:bg-primary/20 border border-border/50 hover:border-primary/50 flex items-center justify-center transition-all group"
              >
                <DiscordLogo size={18} className="group-hover:text-primary transition-colors" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Product</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavClick('generator')}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  The Forge
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('pricing')}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('figma')}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Figma Integration
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Features</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">AI Debate Panel</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Fusion Mode</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Live Deploy</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Idea Incubator</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Security Shield</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-border/50" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} ApexForge. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Cookie Policy
            </a>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={() => handleNavClick('ceo-login')}
                    className="w-4 h-4 rounded-sm bg-transparent hover:bg-destructive/10 border-0 hover:border hover:border-destructive/30 flex items-center justify-center transition-all duration-500 group opacity-[0.01] hover:opacity-100"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ShieldCheck 
                      weight="duotone" 
                      size={10} 
                      className="text-muted-foreground/5 group-hover:text-destructive transition-colors duration-300" 
                    />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-destructive/90 text-destructive-foreground border-destructive/50">
                  <p className="text-xs font-medium">CEO Dashboard</p>
                  <p className="text-[10px] opacity-80">Shift + Ctrl + M</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </footer>
  )
}
