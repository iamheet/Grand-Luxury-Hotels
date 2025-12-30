import { useState } from 'react'

export default function TicTacToe({ onBack }: { onBack: () => void }) {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const winner = calculateWinner(board)

  const handleClick = (i: number) => {
    if (board[i] || winner) return
    const newBoard = [...board]
    newBoard[i] = isXNext ? 'X' : 'O'
    setBoard(newBoard)
    setIsXNext(!isXNext)
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
  }

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-white mb-8">❌⭕ Tic Tac Toe</h1>
      
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/20 inline-block">
        {winner ? (
          <div className="mb-6">
            <p className="text-3xl font-bold text-yellow-400 mb-4">
              {winner === 'Draw' ? "It's a Draw!" : `${winner} Wins!`}
            </p>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-xl font-bold hover:scale-105 transition-transform"
            >
              🔄 Play Again
            </button>
          </div>
        ) : (
          <p className="text-2xl font-bold text-white mb-6">
            Next: {isXNext ? '❌' : '⭕'}
          </p>
        )}

        <div className="grid grid-cols-3 gap-3 mb-6">
          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              className="w-24 h-24 bg-slate-800 hover:bg-slate-700 rounded-xl text-5xl font-bold transition-all border-2 border-slate-600 hover:border-yellow-400"
            >
              {cell === 'X' ? '❌' : cell === 'O' ? '⭕' : ''}
            </button>
          ))}
        </div>

        <button
          onClick={resetGame}
          className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
        >
          Reset Game
        </button>
      </div>
    </div>
  )
}

function calculateWinner(board: (string | null)[]) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ]
  
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]
    }
  }
  
  return board.every(cell => cell) ? 'Draw' : null
}
