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
}

export default function CursorFollower() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const lastSpawnRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = ['rgba(147,51,234,', 'rgba(168,85,247,', 'rgba(126,34,206,', 'rgba(139,92,246,']

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticle = () => {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 0.4 + 0.2
      particlesRef.current.push({
        x: mouseRef.current.x + (Math.random() - 0.5) * 25,
        y: mouseRef.current.y + (Math.random() - 0.5) * 25,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.6,
        life: 1,
        maxLife: Math.random() * 100 + 100,
        size: Math.random() * 50 + 40,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (time - lastSpawnRef.current > 25) {
        for (let i = 0; i < 3; i++) createParticle()
        lastSpawnRef.current = time
      }

      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx
        p.y += p.vy
        p.life -= 1 / p.maxLife

        if (p.life <= 0) return false

        const opacity = p.life * 0.6
        const currentSize = p.size * (1 + (1 - p.life) * 1.2)
        ctx.save()
        ctx.filter = `blur(${12 + (1 - p.life) * 20}px)`
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentSize)
        gradient.addColorStop(0, `${p.color}${opacity})`)
        gradient.addColorStop(0.3, `${p.color}${opacity * 0.7})`)
        gradient.addColorStop(0.7, `${p.color}${opacity * 0.3})`)
        gradient.addColorStop(1, `${p.color}0)`)
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        return true
      })

      ctx.save()
      ctx.fillStyle = '#A855F7'
      ctx.beginPath()
      ctx.arc(mouseRef.current.x, mouseRef.current.y, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)
    requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[9999]" />
}
