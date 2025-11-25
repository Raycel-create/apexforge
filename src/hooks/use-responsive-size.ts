import { useScreenSize } from './use-mobile'

export function useResponsiveSize() {
  const { isMobile, isTablet, isDesktop } = useScreenSize()

  const getResponsiveValue = <T,>(mobile: T, tablet: T, desktop: T): T => {
    if (isMobile) return mobile
    if (isTablet) return tablet
    return desktop
  }

  const buttonSize = getResponsiveValue('default', 'sm', 'default') as 'sm' | 'default' | 'lg'
  const inputHeight = getResponsiveValue('h-10', 'h-9', 'h-10')
  const iconSize = getResponsiveValue(20, 18, 20)
  const spacing = getResponsiveValue('gap-3', 'gap-2', 'gap-3')
  const padding = getResponsiveValue('p-4', 'p-3', 'p-4')
  const fontSize = getResponsiveValue('text-base', 'text-sm', 'text-base')

  return {
    isMobile,
    isTablet,
    isDesktop,
    getResponsiveValue,
    buttonSize,
    inputHeight,
    iconSize,
    spacing,
    padding,
    fontSize,
  }
}

export function getResponsiveIconSize(screenSize: 'mobile' | 'tablet' | 'desktop', baseSize: number = 20) {
  const multipliers = {
    mobile: 1.1,
    tablet: 0.9,
    desktop: 1,
  }
  return Math.round(baseSize * multipliers[screenSize])
}

export function getResponsiveSpacing(screenSize: 'mobile' | 'tablet' | 'desktop') {
  const spacingMap = {
    mobile: {
      xs: 'gap-1.5',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
      xl: 'gap-5',
    },
    tablet: {
      xs: 'gap-1',
      sm: 'gap-1.5',
      md: 'gap-2',
      lg: 'gap-3',
      xl: 'gap-4',
    },
    desktop: {
      xs: 'gap-1.5',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
      xl: 'gap-6',
    },
  }
  return spacingMap[screenSize]
}
