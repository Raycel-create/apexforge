import { useScreenSize } from './use-mobile'

type ButtonSize = 'default' | 'sm' | 'lg'
type IconSize = 16 | 18 | 20 | 22 | 24
type Spacing = 'gap-2' | 'gap-3' | 'gap-4'
type Padding = 'p-3' | 'p-4' | 'p-5' | 'p-6'

export function useResponsiveSize() {
  const { isMobile, isTablet, isDesktop } = useScreenSize()

  const buttonSize: ButtonSize = isMobile ? 'default' : isTablet ? 'sm' : 'default'
  
  const iconSize: IconSize = isMobile ? 20 : isTablet ? 18 : 20
  
  const spacing: Spacing = isMobile ? 'gap-3' : isTablet ? 'gap-2' : 'gap-3'
  
  const padding: Padding = isMobile ? 'p-4' : isTablet ? 'p-3' : 'p-4'

  const getResponsiveValue = <T,>(mobileValue: T, tabletValue: T, desktopValue: T): T => {
    if (isMobile) return mobileValue
    if (isTablet) return tabletValue
    return desktopValue
  }

  const getIconSizeByVariant = (variant: 'sm' | 'default' | 'lg'): IconSize => {
    if (variant === 'sm') return isMobile ? 18 : isTablet ? 16 : 18
    if (variant === 'lg') return isMobile ? 24 : isTablet ? 22 : 24
    return iconSize
  }

  const getSpacingByDensity = (density: 'tight' | 'normal' | 'loose'): Spacing => {
    if (density === 'tight') return isMobile ? 'gap-2' : isTablet ? 'gap-2' : 'gap-2'
    if (density === 'loose') return isMobile ? 'gap-4' : isTablet ? 'gap-3' : 'gap-4'
    return spacing
  }

  const getPaddingByDensity = (density: 'tight' | 'normal' | 'loose'): Padding => {
    if (density === 'tight') return isMobile ? 'p-3' : isTablet ? 'p-3' : 'p-3'
    if (density === 'loose') return isMobile ? 'p-6' : isTablet ? 'p-5' : 'p-6'
    return padding
  }

  return {
    isMobile,
    isTablet,
    isDesktop,
    buttonSize,
    iconSize,
    spacing,
    padding,
    getResponsiveValue,
    getIconSizeByVariant,
    getSpacingByDensity,
    getPaddingByDensity,
  }
}
