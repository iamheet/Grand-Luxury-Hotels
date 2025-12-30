import { useState, useEffect, useRef } from 'react'

export default function Pong({ onBack }: { onBack: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState({ player: 0, computer: 0 })
  const [gameStarted, setGameStarted] = useState(false)

  useEffect(() => {
    if (!gameStarted) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const ball = { x: 300, y: 200, dx: 3, dy: 3, radius: 8 }
    const player = { x: 10, y: 150, width: 10, height: 80, dy: 0 }
    const computer = { x: 580, y: 150, width: 10, height: 80 }

    const draw = () => {
      ctx.fillStyle = '#1e293b'
      ctx.fillRect(0, 0, 600, 400)

      // Ball
      ctx.fillStyle = '#fbbf24'
      ctx.beginPath()
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
      ctx.fill()

      // Paddles
      ctx.fillStyle = '#3b82f6'
      ctx.fillRect(player.x, player.y, player.width, player.height)
      ctx.fillStyle = '#ef4444'
      ctx.fillRect(computer.x, computer.y, computer.width, computer.height)

      // Center line
      ctx.strokeStyle = '#475569'
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(300, 0)
      ctx.lineTo(300, 400)
      ctx.stroke()
    }

    const update = () => {
      // Move ball
      ball.x += ball.dx
      ball.y += ball.dy

      // Ball collision with top/bottom
      if (ball.y + ball.radius > 400 || ball.y - ball.radius < 0) {
        ball.dy *= -1
      }

      // Ball collision with paddles
      if (
        ball.x - ball.radius < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height
      ) {
        ball.dx *= -1
      }

      if (
        ball.x + ball.radius > computer.x &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height
      ) {
        ball.dx *= -1
      }

      // Score
      if (ball.x < 0) {
        setScore(prev => ({ ...prev, computer: prev.computer + 1 }))
        ball.x = 300
        ball.y = 200
      }
      if (ball.x > 600) {
        setScore(prev => ({ ...prev, player: prev.player + 1 }))
        ball.x = 300
        ball.y = 200
      }

      // Move player
      player.y += player.dy
      if (player.y < 0) player.y = 0
      if (player.y + player.height > 400) player.y = 400 - player.height

      // AI computer
      if (ball.y < computer.y + computer.height / 2) {
        computer.y -= 2
      } else {
        computer.y += 2
      }
      if (computer.y < 0) computer.y = 0
      if (computer.y + computer.height > 400) computer.y = 400 - computer.height
    }

    const gameLoop = () => {
      update()
      draw()
    }

    const interval = setInterval(gameLoop, 1000 / 60)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') player.dy = -4
      if (e.key === 'ArrowDown') player.dy = 4
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') player.dy = 0
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      clearInterval(interval)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [gameStarted])

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">🏓 Pong</h1>
        <p className="text-white/70">Classic paddle game</p>
        <div className="text-2xl font-bold text-yellow-400 mt-4">
          You: {score.player} | Computer: {score.computer}
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/20">
        {!gameStarted ? (
          <div className="text-center">
            <button
              onClick={() => setGameStarted(true)}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-xl hover:scale-105 transition-transform"
            >
              Start Game
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="border-4 border-white/20 rounded-xl"
            />
          </div>
        )}

        <div className="mt-6 text-center text-white/60 text-sm">
          <p>🎮 Use Arrow Up/Down to move your paddle</p>
          <p>🎯 Don't let the ball pass you!</p>
        </div>
      </div>
    </div>
  )
}
