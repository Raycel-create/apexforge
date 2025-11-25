import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  glitter: number
}

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const lastMouseRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const handleMouseMove = (e: MouseEvent) => {
      lastMouseRef.current = { x: mouseRef.current.x, y: mouseRef.current.y }
      mouseRef.current = { x: e.clientX, y: e.clientY }

      const dx = mouseRef.current.x - lastMouseRef.current.x
      const dy = mouseRef.current.y - lastMouseRef.current.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance > 5) {
        const numParticles = Math.min(Math.floor(distance / 20), 2)
        
        const colors = [
          'rgba(251, 207, 232, ', 
          'rgba(252, 231, 243, ', 
          'rgba(249, 168, 212, ', 
          'rgba(252, 231, 243, ', 
          'rgba(251, 207, 232, '  
        ]
        
        for (let i = 0; i < numParticles; i++) {
          const t = i / numParticles
          const x = lastMouseRef.current.x + dx * t
          const y = lastMouseRef.current.y + dy * t
          
          particlesRef.current.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            life: 1,
            maxLife: 1,
            size: Math.random() * 2 + 1.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            glitter: Math.random()
          })
        }
      }

      if (particlesRef.current.length > 100) {
        particlesRef.current = particlesRef.current.slice(-100)
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current = particlesRef.current.filter(particle => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy += 0.05
        particle.life -= 0.025
        
        if (particle.life <= 0) return false

        const opacity = particle.life
        const size = particle.size * particle.life
        
        const glitterIntensity = particle.glitter > 0.7 ? 1 : 0.6
        
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          size * 2
        )
        
        gradient.addColorStop(0, `${particle.color}${opacity * 0.9 * glitterIntensity})`)
        gradient.addColorStop(0.5, `${particle.color}${opacity * 0.5 * glitterIntensity})`)
        gradient.addColorStop(1, `${particle.color}0)`)
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, size * 2, 0, Math.PI * 2)
        ctx.fill()
        
        if (particle.glitter > 0.85) {
          ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, size * 0.5, 0, Math.PI * 2)
          ctx.fill()
        }

        return true
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
