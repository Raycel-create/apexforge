import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Clock, ShieldWarning } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

type Page = 'home' | 'dashboard' | 'pricing' | 'generator' | 'auth' | 'figma'

interface SessionTimeoutDialogProps {
  onNavigate?: (page: Page) => void
}

export function SessionTimeoutDialog({ onNavigate }: SessionTimeoutDialogProps) {
  return null
}
