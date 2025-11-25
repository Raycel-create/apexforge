import { useEffect, useState } from 'react'

interface ApexForgeLogoProps {
  className?: string
  variant?: 'default' | 'watermark' | 'navigation' | 'footer' | 'hero' | 'card'
  opacity?: number
}

export function ApexForgeLogo({ className = '', variant = 'default', opacity }: ApexForgeLogoProps) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark')
      setIsDark(isDarkMode)
    }

    checkTheme()

    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  const getOpacity = () => {
    if (opacity !== undefined) return opacity
    
    switch (variant) {
      case 'watermark':
        return 0.03
      case 'navigation':
        return 1
      case 'footer':
        return 0.9
      case 'hero':
        return 0.04
      case 'card':
        return 0.8
      default:
        return 1
    }
  }
  
  const isWatermark = variant === 'watermark' || variant === 'hero'
  
  const lightModeColor = 'oklch(0.85 0.05 345)'
  const darkModeColor = 'oklch(0.55 0.01 0)'
  const strokeColor = isDark ? darkModeColor : lightModeColor
  const fillColor = isDark ? darkModeColor : lightModeColor
  const innerFillColor = isDark ? 'oklch(0.15 0 0)' : 'oklch(0.99 0.004 350)'
  
  return (
    <svg 
      viewBox="0 0 500 500" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        opacity: getOpacity(),
        mixBlendMode: isWatermark ? 'multiply' : 'normal'
      }}
    >
      <g transform="translate(250, 250)">
        <path 
          d="M -150 -20 Q -120 -50 -80 -55 Q -40 -60 0 -60 Q 40 -60 80 -55 Q 120 -50 150 -20" 
          fill="none" 
          stroke={strokeColor}
          strokeWidth="8" 
          strokeLinecap="round"
        />
        
        <path 
          d="M -150 -20 Q -130 30 -100 50 Q -70 70 -40 75 Q -20 78 0 78 Q 20 78 40 75 Q 70 70 100 50 Q 130 30 150 -20" 
          fill="none" 
          stroke={strokeColor}
          strokeWidth="8" 
          strokeLinecap="round"
        />
        
        <path 
          d="M 150 -20 Q 155 -15 158 -8 Q 160 0 158 8 Q 155 15 150 20" 
          fill="none" 
          stroke={strokeColor}
          strokeWidth="6" 
          strokeLinecap="round"
        />
        
        <path 
          d="M -150 -20 Q -155 -15 -158 -8 Q -160 0 -158 8 Q -155 15 -150 20" 
          fill="none" 
          stroke={strokeColor}
          strokeWidth="6" 
          strokeLinecap="round"
        />
        
        <circle cx="0" cy="0" r="40" fill={fillColor}/>
        
        <circle cx="0" cy="0" r="18" fill={innerFillColor}/>
      </g>
    </svg>
  )
}
