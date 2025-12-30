import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import RockPaperScissors from '../components/RockPaperScissors'
import Game2048 from '../components/Game2048'
import Pong from '../components/Pong'

export default function Games() {
  const navigate = useNavigate()
  const [currentGame, setCurrentGame] = useState('menu')
  
  // Snake game state
  const [snake, setSnake] = useState([[5, 5]])
  const [food, setFood] = useState([10, 10])
  const [direction, setDirection] = useState('RIGHT')
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)

  const gridSize = 20

  const generateFood = useCallback(() => {
    const newFood = [
      Math.floor(Math.random() * gridSize),
      Math.floor(Math.random() * gridSize)
    ]
    setFood(newFood)
  }, [])

  const moveSnake = useCallback(() => {
    if (gameOver || !gameStarted) return

    setSnake(prevSnake => {
      const newSnake = [...prevSnake]
      const head = [...newSnake[0]]

      switch (direction) {
        case 'UP': head[0] -= 1; break
        case 'DOWN': head[0] += 1; break
        case 'LEFT': head[1] -= 1; break
        case 'RIGHT': head[1] += 1; break
      }

      // Check wall collision
      if (head[0] < 0 || head[0] >= gridSize || head[1] < 0 || head[1] >= gridSize) {
        setGameOver(true)
        return prevSnake
      }

      // Check self collision
      if (newSnake.some(segment => segment[0] === head[0] && segment[1] === head[1])) {
        setGameOver(true)
        return prevSnake
      }

      newSnake.unshift(head)

      // Check food collision
      if (head[0] === food[0] && head[1] === food[1]) {
        setScore(prev => prev + 10)
        generateFood()
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [direction, food, gameOver, gameStarted, generateFood])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted) {
        if (e.key === ' ') {
          setGameStarted(true)
        }
        return
      }

      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP')
          break
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN')
          break
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT')
          break
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT')
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [direction, gameStarted])

  useEffect(() => {
    const interval = setInterval(moveSnake, 150)
    return () => clearInterval(interval)
  }, [moveSnake])

  const resetGame = () => {
    setSnake([[5, 5]])
    setFood([10, 10])
    setDirection('RIGHT')
    setGameOver(false)
    setScore(0)
    setGameStarted(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 pt-20 px-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => currentGame === 'menu' ? navigate('/') : setCurrentGame('menu')}
          className="mb-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {currentGame === 'menu' ? 'Back to Home' : 'Back to Menu'}
        </button>

        {currentGame === 'menu' && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">🎮 Game Arcade</h1>
              <p className="text-white/70">Choose your game</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button onClick={() => setCurrentGame('snake')} className="bg-gradient-to-br from-green-600 to-emerald-700 p-8 rounded-3xl hover:scale-105 transition-transform border-2 border-green-400">
                <div className="text-6xl mb-4">🐍</div>
                <h3 className="text-2xl font-bold text-white mb-2">Snake</h3>
                <p className="text-white/80">Classic snake game</p>
              </button>
              
              <button onClick={() => setCurrentGame('rps')} className="bg-gradient-to-br from-blue-600 to-cyan-700 p-8 rounded-3xl hover:scale-105 transition-transform border-2 border-blue-400">
                <div className="text-6xl mb-4">✊</div>
                <h3 className="text-2xl font-bold text-white mb-2">Rock Paper Scissors</h3>
                <p className="text-white/80">Beat the computer</p>
              </button>
              
              <button onClick={() => setCurrentGame('2048')} className="bg-gradient-to-br from-orange-600 to-red-700 p-8 rounded-3xl hover:scale-105 transition-transform border-2 border-orange-400">
                <div className="text-6xl mb-4">🔢</div>
                <h3 className="text-2xl font-bold text-white mb-2">2048</h3>
                <p className="text-white/80">Number puzzle game</p>
              </button>
              
              <button onClick={() => setCurrentGame('pong')} className="bg-gradient-to-br from-purple-600 to-pink-700 p-8 rounded-3xl hover:scale-105 transition-transform border-2 border-purple-400">
                <div className="text-6xl mb-4">🏓</div>
                <h3 className="text-2xl font-bold text-white mb-2">Pong</h3>
                <p className="text-white/80">Classic paddle game</p>
              </button>
              
              <button onClick={() => setCurrentGame('tictactoe')} className="bg-gradient-to-br from-yellow-600 to-amber-700 p-8 rounded-3xl hover:scale-105 transition-transform border-2 border-yellow-400">
                <div className="text-6xl mb-4">❌⭕</div>
                <h3 className="text-2xl font-bold text-white mb-2">Tic Tac Toe</h3>
                <p className="text-white/80">Three in a row</p>
              </button>
            </div>
          </div>
        )}

        {currentGame === 'snake' && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">🐍 Snake Game</h1>
              <p className="text-white/70">Use arrow keys to control the snake</p>
              <div className="text-2xl font-bold text-yellow-400 mt-4">Score: {score}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/20">
              {!gameStarted && !gameOver && (
                <div className="text-center mb-4">
                  <p className="text-white text-lg mb-2">Press SPACE to start</p>
                </div>
              )}

              {gameOver && (
                <div className="text-center mb-4">
                  <p className="text-red-400 text-2xl font-bold mb-4">Game Over!</p>
                  <button
                    onClick={resetGame}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition-transform"
                  >
                    🔄 Play Again
                  </button>
                </div>
              )}

              <div className="flex justify-center">
                <div
                  className="grid gap-0 bg-slate-800 p-2 rounded-xl"
                  style={{
                    gridTemplateColumns: `repeat(${gridSize}, 25px)`,
                    gridTemplateRows: `repeat(${gridSize}, 25px)`
                  }}
                >
                  {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
                    const row = Math.floor(idx / gridSize)
                    const col = idx % gridSize
                    const isSnake = snake.some(segment => segment[0] === row && segment[1] === col)
                    const isHead = snake[0][0] === row && snake[0][1] === col
                    const isFood = food[0] === row && food[1] === col

                    return (
                      <div
                        key={idx}
                        className={`w-6 h-6 rounded-sm transition-all ${
                          isHead
                            ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg border border-green-300'
                            : isSnake
                            ? 'bg-gradient-to-br from-green-500 to-green-700 border border-green-600'
                            : isFood
                            ? 'bg-gradient-to-br from-red-500 to-red-700 shadow-lg animate-pulse border border-red-400'
                            : 'bg-slate-700/50'
                        }`}
                      >
                        {isHead && <div className="w-full h-full flex items-center justify-center text-xs">🐍</div>}
                        {isFood && <div className="w-full h-full flex items-center justify-center text-xs">🍎</div>}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-6 text-center text-white/60 text-sm">
                <p>🎮 Use Arrow Keys to move</p>
                <p>🍎 Eat the red food to grow</p>
                <p>⚠️ Don't hit the walls or yourself!</p>
              </div>
            </div>
          </div>
        )}

        {currentGame === 'rps' && <RockPaperScissors onBack={() => setCurrentGame('menu')} />}
        {currentGame === '2048' && <Game2048 onBack={() => setCurrentGame('menu')} />}
        {currentGame === 'pong' && <Pong onBack={() => setCurrentGame('menu')} />}
      </div>
    </div>
  )
}
