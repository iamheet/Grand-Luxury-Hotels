import { useState } from 'react'

export default function RockPaperScissors({ onBack }: { onBack: () => void }) {
  const [playerChoice, setPlayerChoice] = useState('')
  const [computerChoice, setComputerChoice] = useState('')
  const [result, setResult] = useState('')
  const [score, setScore] = useState({ player: 0, computer: 0 })

  const choices = ['🪨 Rock', '📄 Paper', '✂️ Scissors']

  const play = (choice: string) => {
    const computerPick = choices[Math.floor(Math.random() * 3)]
    setPlayerChoice(choice)
    setComputerChoice(computerPick)

    if (choice === computerPick) {
      setResult("It's a tie!")
    } else if (
      (choice === '🪨 Rock' && computerPick === '✂️ Scissors') ||
      (choice === '📄 Paper' && computerPick === '🪨 Rock') ||
      (choice === '✂️ Scissors' && computerPick === '📄 Paper')
    ) {
      setResult('You win! 🎉')
      setScore(prev => ({ ...prev, player: prev.player + 1 }))
    } else {
      setResult('Computer wins! 😊')
      setScore(prev => ({ ...prev, computer: prev.computer + 1 }))
    }
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">✊ Rock Paper Scissors</h1>
        <p className="text-white/70">Choose your weapon!</p>
        <div className="text-2xl font-bold text-yellow-400 mt-4">
          You: {score.player} | Computer: {score.computer}
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border-2 border-white/20">
        <div className="grid grid-cols-3 gap-4 mb-8">
          {choices.map(choice => (
            <button
              key={choice}
              onClick={() => play(choice)}
              className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-2xl text-4xl hover:scale-110 transition-transform border-2 border-blue-300"
            >
              {choice}
            </button>
          ))}
        </div>

        {result && (
          <div className="text-center space-y-4">
            <div className="flex justify-center gap-8 text-6xl">
              <div>{playerChoice}</div>
              <div className="text-white">vs</div>
              <div>{computerChoice}</div>
            </div>
            <div className="text-3xl font-bold text-white">{result}</div>
            <button
              onClick={() => setScore({ player: 0, computer: 0 })}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-bold hover:scale-105 transition-transform"
            >
              Reset Score
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
