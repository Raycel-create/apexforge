import { useEffect, useState } from "react"

export type ScreenSize = "mobile" | "tablet" | "desktop" | "large"

interface ResponsiveFontConfig {
  screenSize: ScreenSize
  baseFontSize: number
  scaleFactor: number
}

const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
  desktop: 1440,
  large: 1920,
}

function getScreenSize(width: number): ScreenSize {
  if (width < BREAKPOINTS.mobile) return "mobile"
  if (width < BREAKPOINTS.tablet) return "tablet"
  if (width < BREAKPOINTS.desktop) return "desktop"
  return "large"
}

function getBaseFontSize(screenSize: ScreenSize): number {
  switch (screenSize) {
    case "mobile":
      return 14
    case "tablet":
      return 15
    case "desktop":
      return 16
    case "large":
      return 17
  }
}

function getScaleFactor(screenSize: ScreenSize): number {
  switch (screenSize) {
    case "mobile":
      return 0.875
    case "tablet":
      return 0.9375
    case "desktop":
      return 1
    case "large":
      return 1.0625
  }
}

export function useResponsiveFont(): ResponsiveFontConfig {
  const [config, setConfig] = useState<ResponsiveFontConfig>(() => {
    const width = typeof window !== "undefined" ? window.innerWidth : 1024
    const screenSize = getScreenSize(width)
    return {
      screenSize,
      baseFontSize: getBaseFontSize(screenSize),
      scaleFactor: getScaleFactor(screenSize),
    }
  })

  useEffect(() => {
    const updateFontConfig = () => {
      const width = window.innerWidth
      const screenSize = getScreenSize(width)
      const baseFontSize = getBaseFontSize(screenSize)
      const scaleFactor = getScaleFactor(screenSize)

      setConfig({ screenSize, baseFontSize, scaleFactor })

      document.documentElement.style.setProperty(
        "--base-font-size",
        `${baseFontSize}px`
      )
      document.documentElement.style.setProperty(
        "--scale-factor",
        `${scaleFactor}`
      )
    }

    updateFontConfig()

    const debouncedUpdate = debounce(updateFontConfig, 150)
    window.addEventListener("resize", debouncedUpdate)

    return () => {
      window.removeEventListener("resize", debouncedUpdate)
    }
  }, [])

  return config
}

function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function getFontSize(base: number, screenSize?: ScreenSize): string {
  const factor = screenSize ? getScaleFactor(screenSize) : 1
  return `${base * factor}px`
}
