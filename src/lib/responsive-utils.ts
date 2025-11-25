export function getResponsiveSize(
  mobile: number,
  tablet: number,
  desktop: number,
  large: number
): string {
  return `clamp(${mobile}rem, ${((desktop - mobile) / 1440) * 100}vw + ${mobile}rem, ${large}rem)`
}

export function getResponsivePadding(
  mobile: string,
  tablet: string,
  desktop: string,
  large?: string
): string {
  return large
    ? `clamp(${mobile}, ${tablet}, ${desktop}, ${large})`
    : `clamp(${mobile}, ${tablet}, ${desktop})`
}

export const responsiveSpacing = {
  xs: "clamp(0.25rem, 0.5vw, 0.5rem)",
  sm: "clamp(0.5rem, 1vw, 1rem)",
  md: "clamp(1rem, 1.5vw, 1.5rem)",
  lg: "clamp(1.5rem, 2vw, 2rem)",
  xl: "clamp(2rem, 3vw, 3rem)",
  "2xl": "clamp(3rem, 4vw, 4rem)",
}

export const responsiveFontSizes = {
  xs: "clamp(0.75rem, 0.5vw + 0.5rem, 0.875rem)",
  sm: "clamp(0.875rem, 0.75vw + 0.5rem, 1rem)",
  base: "clamp(1rem, 1vw + 0.5rem, 1.125rem)",
  lg: "clamp(1.125rem, 1.5vw + 0.5rem, 1.25rem)",
  xl: "clamp(1.25rem, 2vw + 0.5rem, 1.5rem)",
  "2xl": "clamp(1.5rem, 3vw + 0.5rem, 2rem)",
  "3xl": "clamp(1.875rem, 4vw + 0.5rem, 2.5rem)",
  "4xl": "clamp(2.25rem, 5vw + 1rem, 3rem)",
  "5xl": "clamp(3rem, 6vw + 1rem, 4rem)",
}
