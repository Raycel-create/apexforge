import { useEffect, useState } from 'react'

interface Sparkle {
  id: number
  x: number
  y: number
  angle: number
  velocity: number
  life: number
  size: number
  color: string
}

const colors = [
  'oklch(96% 0.018 345)',
  'oklch(95.5% 0.020 345)',
  'oklch(97% 0.016 345)',
]

export function SparkleClickEffect() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newSparkles: Sparkle[] = []
      const sparkleCount = 12

      for (let i = 0; i < sparkleCount; i++) {
        newSparkles.push({
          id: Date.now() + i,
          x: e.clientX,
          y: e.clientY,
          angle: (Math.PI * 2 * i) / sparkleCount,
          velocity: 2 + Math.random() * 2,
          life: 1,
          size: 3 + Math.random() * 4,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }

      setSparkles(prev => [...prev, ...newSparkles])
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  useEffect(() => {
    if (sparkles.length === 0) return

    const interval = setInterval(() => {
      setSparkles(prev => {
        const updated = prev
          .map(sparkle => ({
            ...sparkle,
            x: sparkle.x + Math.cos(sparkle.angle) * sparkle.velocity * 2,
            y: sparkle.y + Math.sin(sparkle.angle) * sparkle.velocity * 2,
            life: sparkle.life - 0.02,
            velocity: sparkle.velocity * 0.98,
          }))
          .filter(sparkle => sparkle.life > 0)

        return updated
      })
    }, 16)

    return () => clearInterval(interval)
  }, [sparkles.length])

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="absolute rounded-full"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            width: sparkle.size,
            height: sparkle.size,
            backgroundColor: sparkle.color,
            opacity: sparkle.life,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 ${sparkle.size * 2}px ${sparkle.color}`,
          }}
        />
      ))}
    </div>
  )
}
