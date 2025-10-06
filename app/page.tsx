'use client'

import { useState } from 'react'

interface MathProblem {
  problem_text: string
  final_answer: number
  hint?: string
  solution_steps?: string[]
}

export default function Home() {
  const [problem, setProblem] = useState<MathProblem | null>(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [problemType, setProblemType] = useState<'mixed' | 'addition' | 'subtraction' | 'multiplication' | 'division'>('mixed')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [history, setHistory] = useState<Array<{
    problem: string
    userAnswer: number
    correctAnswer: number
    isCorrect: boolean
    timestamp: Date
  }>>([])

  const generateProblem = async () => {
    setIsLoading(true)
    setFeedback('')
    setUserAnswer('')
    setIsCorrect(null)
    setShowHint(false)
    setShowSolution(false)

    try {
      const response = await fetch('/api/math-problem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ difficulty, problemType }),
      })

      if (!response.ok) throw new Error('Failed to generate problem')

      const data = await response.json()
      setProblem({
        problem_text: data.problem_text,
        final_answer: 0,
        hint: data.hint,
        solution_steps: data.solution_steps
      })
      setSessionId(data.session_id)
    } catch (error) {
      console.error('Error generating problem:', error)
      alert('Failed to generate problem. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!sessionId) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/math-problem/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          user_answer: Number(userAnswer),
        }),
      })

      if (!response.ok) throw new Error('Failed to submit answer')

      const data = await response.json()
      setIsCorrect(data.is_correct)
      setFeedback(data.feedback_text)

      if (data.is_correct) {
        setScore(prev => prev + 10)
        setStreak(prev => prev + 1)
      } else {
        setStreak(0)
      }

      // Add to history
      if (problem) {
        setHistory(prev => [{
          problem: problem.problem_text,
          userAnswer: Number(userAnswer),
          correctAnswer: data.correct_answer,
          isCorrect: data.is_correct,
          timestamp: new Date()
        }, ...prev].slice(0, 10))
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      alert('Failed to submit answer. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900">Math Practice</h1>
          <p className="text-blue-700">Primary 5 • Singapore Syllabus</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Controls & Stats */}
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg border-2 border-blue-200 p-4 text-center">
                <div className="text-xs font-medium text-blue-600 mb-1">Score</div>
                <div className="text-2xl font-bold text-blue-900">{score}</div>
              </div>
              <div className="bg-white rounded-lg border-2 border-blue-200 p-4 text-center">
                <div className="text-xs font-medium text-blue-600 mb-1">Streak</div>
                <div className="text-2xl font-bold text-blue-900">{streak}</div>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-lg border-2 border-blue-200 p-4">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-800 mb-2">Difficulty</label>
                <div className="flex gap-2">
                  {(['easy', 'medium', 'hard'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      disabled={isLoading}
                      className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                        difficulty === level
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-800 mb-2">Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { value: 'mixed', label: 'Mixed' },
                    { value: 'addition', label: 'Add' },
                    { value: 'subtraction', label: 'Subtract' },
                    { value: 'multiplication', label: 'Multiply' },
                    { value: 'division', label: 'Divide' }
                  ] as const).map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setProblemType(type.value)}
                      disabled={isLoading}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                        problemType === type.value
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generateProblem}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition-all"
              >
                {isLoading ? 'Loading...' : 'New Problem'}
              </button>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="bg-white rounded-lg border-2 border-blue-200 p-4">
                <h3 className="text-sm font-bold text-gray-800 mb-3">Recent ({history.length})</h3>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {history.map((item, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded border-l-4 ${
                        item.isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-xs font-bold ${
                          item.isCorrect ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {item.isCorrect ? '✓' : '✗'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-1">{item.problem}</p>
                      <div className="text-xs text-gray-500">
                        You: {item.userAnswer}
                        {!item.isCorrect && ` • Correct: ${item.correctAnswer}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Middle Column - Problem & Answer */}
          <div className="lg:col-span-2 space-y-4">
            {problem ? (
              <>
                {/* Problem */}
                <div className="bg-white rounded-lg border-2 border-blue-200 p-6">
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-3">Your Problem</div>
                    <p className="text-lg text-gray-900 leading-relaxed">{problem.problem_text}</p>
                  </div>

                  <form onSubmit={submitAnswer} className="space-y-3">
                    <div>
                      <label htmlFor="answer" className="block text-sm font-semibold text-gray-800 mb-2">
                        Your Answer
                      </label>
                      <input
                        type="number"
                        step="any"
                        id="answer"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Type your answer"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!userAnswer || isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold text-lg py-3 rounded-lg transition-all"
                    >
                      {isLoading ? 'Checking...' : 'Submit'}
                    </button>
                  </form>

                  {!feedback && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className="py-2 px-3 text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 rounded-lg"
                      >
                        {showHint ? 'Hide' : 'Hint'}
                      </button>
                      <button
                        onClick={() => setShowSolution(!showSolution)}
                        className="py-2 px-3 text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border-2 border-purple-300 rounded-lg"
                      >
                        {showSolution ? 'Hide' : 'Solution'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Hint */}
                {showHint && problem.hint && (
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
                    <div className="text-sm font-bold text-amber-900 mb-2">💡 Hint</div>
                    <p className="text-sm text-amber-900 leading-relaxed">{problem.hint}</p>
                  </div>
                )}

                {/* Solution */}
                {showSolution && problem.solution_steps && (
                  <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
                    <div className="text-sm font-bold text-purple-900 mb-2">📝 Solution</div>
                    <ol className="space-y-1 list-decimal list-inside text-sm text-purple-900">
                      {problem.solution_steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Feedback */}
                {feedback && (
                  <div className={`rounded-lg border-2 p-5 ${
                    isCorrect
                      ? 'bg-green-50 border-green-300'
                      : 'bg-orange-50 border-orange-300'
                  }`}>
                    <div className={`text-lg font-bold mb-2 ${
                      isCorrect ? 'text-green-900' : 'text-orange-900'
                    }`}>
                      {isCorrect ? '✓ Correct!' : '✗ Not quite'}
                    </div>
                    <p className={`text-sm leading-relaxed ${
                      isCorrect ? 'text-green-900' : 'text-orange-900'
                    }`}>
                      {feedback}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg border-2 border-blue-200 p-12 text-center">
                <div className="text-5xl mb-4">📚</div>
                <p className="text-xl text-gray-700 font-medium mb-2">Ready to practice?</p>
                <p className="text-gray-600">Click "New Problem" to start</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
