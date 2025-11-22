import { createContext, useContext, ReactNode } from 'react'
import { useKV } from '@github/spark/hooks'

interface BlackForgeContextType {
  blackForgeMode: boolean
  setBlackForgeMode: (value: boolean) => void
}

const BlackForgeContext = createContext<BlackForgeContextType | undefined>(undefined)

export function BlackForgeProvider({ children }: { children: ReactNode }) {
  const [blackForgeMode, setBlackForgeMode] = useKV<boolean>('black-forge-mode', false)

  return (
    <BlackForgeContext.Provider value={{ blackForgeMode: blackForgeMode || false, setBlackForgeMode }}>
      {children}
    </BlackForgeContext.Provider>
  )
}

export function useBlackForge() {
  const context = useContext(BlackForgeContext)
  if (context === undefined) {
    throw new Error('useBlackForge must be used within a BlackForgeProvider')
  }
  return context
}
