import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useBlackForge } from '../lib/BlackForgeContext'

interface ConfettiPiece {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  size: number
}

export function ConfettiEffect() {
  const { blackForgeMode } = useBlackForge()
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    const colors = blackForgeMode 
      ? ['#DC2626', '#991B1B', '#7C2D12', '#450A0A', '#EF4444', '#B91C1C']
      : ['#FBCFE8', '#FCE7F3', '#F9A8D4', '#FDF2F8', '#FBE2F2', '#FCE7F3']
    const pieces: ConfettiPiece[] = []
    
    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5,
      })
    }
    
    setConfetti(pieces)

    const timer = setTimeout(() => {
      setConfetti([])
    }, 4000)

    return () => clearTimeout(timer)
  }, [blackForgeMode])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute"
          initial={{
            x: piece.x,
            y: piece.y,
            rotate: piece.rotation,
            opacity: 1,
          }}
          animate={{
            y: window.innerHeight + 50,
            rotate: piece.rotation + 720,
            opacity: 0,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            ease: 'easeIn',
          }}
          style={{
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
          }}
        />
      ))}
    </div>
  )
}
