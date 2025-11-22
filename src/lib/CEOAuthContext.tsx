import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useKV } from '@github/spark/hooks'
import * as OTPAuth from 'otpauth'

interface CEOAuthContextType {
  isAuthenticated: boolean
  totpSecret: string | null
  login: (username: string, password: string, token: string) => Promise<boolean>
  logout: () => void
  initializeTOTP: () => string
  verifyTOTP: (token: string) => boolean
}

const CEOAuthContext = createContext<CEOAuthContextType | undefined>(undefined)

const CEO_USERNAME = 'adminadminadmin'
const CEO_PASSWORD = '197801111'

export function CEOAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [totpSecret, setTotpSecret] = useKV<string | null>('ceo-totp-secret', null)
  const [sessionActive, setSessionActive] = useKV<boolean>('ceo-session-active', false)

  useEffect(() => {
    if (sessionActive) {
      setIsAuthenticated(true)
    }
  }, [sessionActive])

  const initializeTOTP = () => {
    if (!totpSecret) {
      const totp = new OTPAuth.TOTP({
        issuer: 'ApexForge',
        label: 'CEO Dashboard',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
      })
      setTotpSecret(totp.secret.base32)
      return totp.secret.base32
    }
    return totpSecret
  }

  const verifyTOTP = (token: string): boolean => {
    if (!totpSecret) return false
    
    const totp = new OTPAuth.TOTP({
      issuer: 'ApexForge',
      label: 'CEO Dashboard',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(totpSecret),
    })

    const delta = totp.validate({ token, window: 1 })
    return delta !== null
  }

  const login = async (username: string, password: string, token: string): Promise<boolean> => {
    if (username !== CEO_USERNAME || password !== CEO_PASSWORD) {
      return false
    }

    if (!totpSecret) {
      return false
    }

    const isValidToken = verifyTOTP(token)
    if (!isValidToken) {
      return false
    }

    setIsAuthenticated(true)
    setSessionActive(true)
    return true
  }

  const logout = () => {
    setIsAuthenticated(false)
    setSessionActive(false)
  }

  return (
    <CEOAuthContext.Provider
      value={{
        isAuthenticated,
        totpSecret: totpSecret ?? null,
        login,
        logout,
        initializeTOTP,
        verifyTOTP,
      }}
    >
      {children}
    </CEOAuthContext.Provider>
  )
}

export function useCEOAuth() {
  const context = useContext(CEOAuthContext)
  if (context === undefined) {
    throw new Error('useCEOAuth must be used within CEOAuthProvider')
  }
  return context
}
