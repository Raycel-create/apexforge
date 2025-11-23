import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useKV } from '@github/spark/hooks'
import * as OTPAuth from 'otpauth'

interface CEOAuthContextType {
  isAuthenticated: boolean
  totpSecret: string | null
  login: (username: string, password: string, token?: string) => Promise<boolean>
  logout: () => void
  initializeTOTP: () => string
  verifyTOTP: (token: string) => boolean
  biometricsEnabled: boolean
  toggleBiometrics: () => void
}

const CEOAuthContext = createContext<CEOAuthContextType | undefined>(undefined)

const CEO_USERNAME = 'papakoEddie@tripzy.international'
const CEO_PASSWORD = '19780111'

export function CEOAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [totpSecret, setTotpSecret] = useKV<string | null>('ceo-totp-secret', null)
  const [sessionActive, setSessionActive] = useKV<boolean>('ceo-session-active', false)
  const [biometricsEnabled, setBiometricsEnabled] = useKV<boolean>('ceo-biometrics-enabled', false)

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

  const login = async (username: string, password: string, token?: string): Promise<boolean> => {
    if (username !== CEO_USERNAME || password !== CEO_PASSWORD) {
      return false
    }

    if (biometricsEnabled && totpSecret && token) {
      const isValidToken = verifyTOTP(token)
      if (!isValidToken) {
        return false
      }
    }

    setIsAuthenticated(true)
    setSessionActive(true)
    return true
  }

  const logout = () => {
    setIsAuthenticated(false)
    setSessionActive(false)
  }

  const toggleBiometrics = () => {
    setBiometricsEnabled((current) => !current)
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
        biometricsEnabled: biometricsEnabled ?? false,
        toggleBiometrics,
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
