import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import * as OTPAuth from 'otpauth'
import { validateCEOCredentials } from './ceoCredentials'
import { ipWhitelistService } from './ipWhitelistService'
import { ceoAuditService } from './ceoAuditService'

interface CEOAuthContextType {
  isAuthenticated: boolean
  totpSecret: string | null
  login: (username: string, password: string, token?: string) => Promise<boolean>
  logout: () => void
  initializeTOTP: () => string
  verifyTOTP: (token: string) => boolean
  biometricsEnabled: boolean
  toggleBiometrics: () => void
  timeUntilExpiry: number | null
  showTimeoutWarning: boolean
  extendSession: () => void
  dismissWarning: () => void
}

const CEOAuthContext = createContext<CEOAuthContextType | undefined>(undefined)

const SESSION_TIMEOUT = 30 * 60 * 1000
const WARNING_TIME = 2 * 60 * 1000

export function CEOAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [totpSecret, setTotpSecret] = useKV<string | null>('ceo-totp-secret', null)
  const [sessionActive, setSessionActive] = useKV<boolean>('ceo-session-active', false)
  const [biometricsEnabled, setBiometricsEnabled] = useKV<boolean>('ceo-biometrics-enabled', false)
  const [lastActivity, setLastActivity] = useKV<number>('ceo-last-activity', Date.now())
  
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number | null>(null)
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false)
  
  const timeoutCheckInterval = useRef<NodeJS.Timeout | null>(null)
  const activityListenersAttached = useRef(false)

  const updateActivity = useCallback(() => {
    if (isAuthenticated) {
      setLastActivity(Date.now())
      setShowTimeoutWarning(false)
    }
  }, [isAuthenticated, setLastActivity])

  const checkSessionTimeout = useCallback(() => {
    if (!isAuthenticated || !lastActivity) return

    const timeSinceActivity = Date.now() - lastActivity
    const timeRemaining = SESSION_TIMEOUT - timeSinceActivity

    setTimeUntilExpiry(Math.max(0, timeRemaining))

    if (timeRemaining <= 0) {
      ceoAuditService.logAccess('CEO', 'session_timeout', 'Session expired due to inactivity')
      logout()
    } else if (timeRemaining <= WARNING_TIME && !showTimeoutWarning) {
      setShowTimeoutWarning(true)
    }
  }, [isAuthenticated, lastActivity, showTimeoutWarning])

  useEffect(() => {
    if (sessionActive) {
      setIsAuthenticated(true)
      updateActivity()
    }
  }, [sessionActive, updateActivity])

  useEffect(() => {
    if (isAuthenticated && !activityListenersAttached.current) {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
      
      const throttledUpdate = (() => {
        let lastCall = 0
        return () => {
          const now = Date.now()
          if (now - lastCall >= 5000) {
            lastCall = now
            updateActivity()
          }
        }
      })()

      events.forEach(event => {
        window.addEventListener(event, throttledUpdate)
      })

      activityListenersAttached.current = true

      return () => {
        events.forEach(event => {
          window.removeEventListener(event, throttledUpdate)
        })
        activityListenersAttached.current = false
      }
    }
  }, [isAuthenticated, updateActivity])

  useEffect(() => {
    if (isAuthenticated) {
      timeoutCheckInterval.current = setInterval(checkSessionTimeout, 1000)
      return () => {
        if (timeoutCheckInterval.current) {
          clearInterval(timeoutCheckInterval.current)
        }
      }
    } else {
      if (timeoutCheckInterval.current) {
        clearInterval(timeoutCheckInterval.current)
      }
      setTimeUntilExpiry(null)
      setShowTimeoutWarning(false)
    }
  }, [isAuthenticated, checkSessionTimeout])

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
    const currentIP = await ipWhitelistService.getCurrentIP()
    
    await ceoAuditService.logAccess(username, 'login_attempt', `Attempting login from IP: ${currentIP}`)
    
    const isWhitelistEnabled = await ipWhitelistService.isWhitelistEnabled()
    const isIPAllowed = await ipWhitelistService.isIPWhitelisted(currentIP)
    
    if (isWhitelistEnabled && !isIPAllowed) {
      await ipWhitelistService.logAccess(currentIP, 'blocked', '/ceo-dashboard', navigator.userAgent)
      await ceoAuditService.logAccess(username, 'login_failed', `IP not whitelisted: ${currentIP}`)
      return false
    }

    if (!validateCEOCredentials(username, password)) {
      await ipWhitelistService.logAccess(currentIP, 'blocked', '/ceo-dashboard', navigator.userAgent)
      await ceoAuditService.logAccess(username, 'login_failed', 'Invalid credentials')
      return false
    }

    if (!totpSecret) {
      initializeTOTP()
    }

    if (!token) {
      await ceoAuditService.logAccess(username, 'login_failed', 'TOTP token not provided')
      return false
    }
    
    const isValidToken = verifyTOTP(token)
    if (!isValidToken) {
      await ipWhitelistService.logAccess(currentIP, 'blocked', '/ceo-dashboard', navigator.userAgent)
      await ceoAuditService.logAccess(username, 'login_failed', 'Invalid TOTP token')
      return false
    }

    await ipWhitelistService.logAccess(currentIP, 'allowed', '/ceo-dashboard', navigator.userAgent)
    await ceoAuditService.logAccess(username, 'login_success', `Successful login from IP: ${currentIP}`)
    setIsAuthenticated(true)
    setSessionActive(true)
    setLastActivity(Date.now())
    setShowTimeoutWarning(false)
    return true
  }

  const logout = () => {
    ceoAuditService.logAccess('CEO', 'logout', 'User logged out')
    setIsAuthenticated(false)
    setSessionActive(false)
    setShowTimeoutWarning(false)
    setTimeUntilExpiry(null)
    if (timeoutCheckInterval.current) {
      clearInterval(timeoutCheckInterval.current)
    }
  }

  const extendSession = () => {
    updateActivity()
    setShowTimeoutWarning(false)
  }

  const dismissWarning = () => {
    setShowTimeoutWarning(false)
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
        timeUntilExpiry,
        showTimeoutWarning,
        extendSession,
        dismissWarning,
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
