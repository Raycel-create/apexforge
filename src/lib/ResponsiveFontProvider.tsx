import { ReactNode, useEffect } from "react"
import { useResponsiveFont } from "@/hooks/use-responsive-font"

interface ResponsiveFontProviderProps {
  children: ReactNode
}

export function ResponsiveFontProvider({ children }: ResponsiveFontProviderProps) {
  const { baseFontSize, scaleFactor, screenSize } = useResponsiveFont()

  useEffect(() => {
    document.documentElement.style.fontSize = `${baseFontSize}px`
    document.documentElement.setAttribute("data-screen-size", screenSize)
  }, [baseFontSize, scaleFactor, screenSize])

  return <>{children}</>
}
