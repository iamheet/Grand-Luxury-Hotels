import { useState, useEffect } from 'react'

export default function Game2048({ onBack }: { onBack: () => void }) {
  const [board, setBoard] = useState<number[][]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const initBoard = () => {
    const newBoard = Array(4).fill(0).map(() => Array(4).fill(0))
    addRandomTile(newBoard)
    addRandomTile(newBoard)
    setBoard(newBoard)
    setScore(0)
    setGameOver(false)
  }

  useEffect(() => {
    initBoard()
  }, [])

  const addRandomTile = (board: number[][]) => {
    const empty: [number, number][] = []
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) empty.push([i, j])
      }
    }
    if (empty.length > 0) {
      const [row, col] = empty[Math.floor(Math.random() * empty.length)]
      board[row][col] = Math.random() < 0.9 ? 2 : 4
    }
  }

  const move = (direction: string) => {
    if (gameOver) return
    
    const newBoard = board.map(row => [...row])
    let moved = false

    if (direction === 'left' || direction === 'right') {
      for (let i = 0; i < 4; i++) {
        const row = direction === 'left' ? newBoard[i] : newBoard[i].reverse()
        const filtered = row.filter(x => x !== 0)
        for (let j = 0; j < filtered.length - 1; j++) {
          if (filtered[j] === filtered[j + 1]) {
            filtered[j] *= 2
            setScore(prev => prev + filtered[j])
            filtered.splice(j + 1, 1)
            moved = true
          }
        }
        while (filtered.length < 4) filtered.push(0)
        newBoard[i] = direction === 'left' ? filtered : filtered.reverse()
        if (JSON.stringify(newBoard[i]) !== JSON.stringify(board[i])) moved = true
      }
    } else {
      for (let j = 0; j < 4; j++) {
        const col = newBoard.map(row => row[j])
        const filtered = (direction === 'up' ? col : col.reverse()).filter(x => x !== 0)
        for (let i = 0; i < filtered.length - 1; i++) {
          if (filtered[i] === filtered[i + 1]) {
            filtered[i] *= 2
            setScore(prev => prev + filtered[i])
            filtered.splice(i + 1, 1)
            moved = true
          }
        }
        while (filtered.length < 4) filtered.push(0)
        const finalCol = direction === 'up' ? filtered : filtered.reverse()
        for (let i = 0; i < 4; i++) {
          newBoard[i][j] = finalCol[i]
          if (newBoard[i][j] !== board[i][j]) moved = true
        }
      }
    }

    if (moved) {
      addRandomTile(newBoard)
      setBoard(newBoard)
      
      // Check game over
      let hasEmpty = false
      let canMove = false
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (newBoard[i][j] === 0) hasEmpty = true
          if (i < 3 && newBoard[i][j] === newBoard[i + 1][j]) canMove = true
          if (j < 3 && newBoard[i][j] === newBoard[i][j + 1]) canMove = true
        }
      }
      if (!hasEmpty && !canMove) setGameOver(true)
    }
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') move('up')
      else if (e.key === 'ArrowDown') move('down')
      else if (e.key === 'ArrowLeft') move('left')
      else if (e.key === 'ArrowRight') move('right')
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  })

  const getTileColor = (value: number) => {
    const colors: { [key: number]: string } = {
      2: 'bg-yellow-200',
      4: 'bg-yellow-300',
      8: 'bg-orange-300',
      16: 'bg-orange-400',
      32: 'bg-red-400',
      64: 'bg-red-500',
      128: 'bg-yellow-500',
      256: 'bg-yellow-600',
      512: 'bg-yellow-700',
      1024: 'bg-orange-600',
      2048: 'bg-orange-700'
    }
    return colors[value] || 'bg-purple-600'
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">🔢 2048</h1>
        <p className="text-white/70">Use arrow keys to play</p>
        <div className="text-2xl font-bold text-yellow-400 mt-4">Score: {score}</div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/20">
        {gameOver && (
          <div className="text-center mb-4">
            <p className="text-red-400 text-2xl font-bold mb-4">Game Over!</p>
            <button
              onClick={initBoard}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition-transform"
            >
              🔄 New Game
            </button>
          </div>
        )}

        <div className="flex justify-center">
          <div className="grid grid-cols-4 gap-3 bg-slate-800 p-4 rounded-2xl">
            {board.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`w-20 h-20 flex items-center justify-center text-2xl font-bold rounded-xl ${
                    cell === 0 ? 'bg-slate-700' : getTileColor(cell) + ' text-white'
                  }`}
                >
                  {cell !== 0 && cell}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-white/60 text-sm">
          <p>🎮 Use Arrow Keys to move tiles</p>
          <p>🎯 Combine same numbers to reach 2048!</p>
        </div>
      </div>
    </div>
  )
}
