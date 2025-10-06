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
    } catch (error) {
      console.error('Error submitting answer:', error)
      alert('Failed to submit answer. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">Math Practice</h1>
          <p className="text-lg text-blue-700">Primary 5 • Singapore Syllabus</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border-2 border-blue-200 p-5 text-center">
            <div className="text-sm font-medium text-blue-600 mb-1">Your Score</div>
            <div className="text-3xl font-bold text-blue-900">{score}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border-2 border-blue-200 p-5 text-center">
            <div className="text-sm font-medium text-blue-600 mb-1">Streak</div>
            <div className="text-3xl font-bold text-blue-900">{streak}</div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl shadow-sm border-2 border-blue-200 p-6 mb-6">
          <div className="mb-5">
            <label className="block text-base font-semibold text-gray-800 mb-3">Difficulty Level</label>
            <div className="flex gap-3">
              {(['easy', 'medium', 'hard'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  disabled={isLoading}
                  className={`flex-1 py-3 px-4 rounded-lg text-base font-semibold transition-all ${
                    difficulty === level
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-base font-semibold text-gray-800 mb-3">Problem Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {([
                { value: 'mixed', label: 'Mixed' },
                { value: 'addition', label: 'Addition' },
                { value: 'subtraction', label: 'Subtraction' },
                { value: 'multiplication', label: 'Multiply' },
                { value: 'division', label: 'Division' }
              ] as const).map((type) => (
                <button
                  key={type.value}
                  onClick={() => setProblemType(type.value)}
                  disabled={isLoading}
                  className={`py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                    problemType === type.value
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
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
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold text-lg py-4 px-4 rounded-xl shadow-md transition-all"
          >
            {isLoading ? 'Loading...' : 'Get New Problem'}
          </button>
        </div>

        {/* Problem */}
        {problem && (
          <div className="bg-white rounded-xl shadow-sm border-2 border-blue-200 p-6 mb-6">
            <div className="mb-6">
              <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3">Your Problem</div>
              <p className="text-xl text-gray-900 leading-relaxed">{problem.problem_text}</p>
            </div>

            <form onSubmit={submitAnswer} className="space-y-4">
              <div>
                <label htmlFor="answer" className="block text-base font-semibold text-gray-800 mb-2">
                  Your Answer
                </label>
                <input
                  type="number"
                  step="any"
                  id="answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type your answer here"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!userAnswer || isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold text-lg py-4 px-4 rounded-xl shadow-md transition-all"
              >
                {isLoading ? 'Checking...' : 'Submit Answer'}
              </button>
            </form>

            {!feedback && (
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="py-3 px-4 text-base font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 rounded-lg transition-all"
                >
                  {showHint ? 'Hide Hint' : 'Need a Hint?'}
                </button>
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="py-3 px-4 text-base font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border-2 border-purple-300 rounded-lg transition-all"
                >
                  {showSolution ? 'Hide Solution' : 'Show Solution'}
                </button>
              </div>
            )}

            {showHint && problem.hint && (
              <div className="mt-4 p-5 bg-amber-50 border-2 border-amber-300 rounded-xl">
                <div className="text-base font-bold text-amber-900 mb-2">💡 Hint</div>
                <p className="text-base text-amber-900 leading-relaxed">{problem.hint}</p>
              </div>
            )}

            {showSolution && problem.solution_steps && (
              <div className="mt-4 p-5 bg-purple-50 border-2 border-purple-300 rounded-xl">
                <div className="text-base font-bold text-purple-900 mb-3">📝 Step-by-Step Solution</div>
                <ol className="space-y-2 list-decimal list-inside">
                  {problem.solution_steps.map((step, index) => (
                    <li key={index} className="text-base text-purple-900 leading-relaxed">{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className={`rounded-xl border-2 p-6 ${
            isCorrect
              ? 'bg-green-50 border-green-300'
              : 'bg-orange-50 border-orange-300'
          }`}>
            <div className={`text-xl font-bold mb-3 ${
              isCorrect ? 'text-green-900' : 'text-orange-900'
            }`}>
              {isCorrect ? '✓ Correct! Well done!' : '✗ Not quite right'}
            </div>
            <p className={`text-base leading-relaxed ${
              isCorrect ? 'text-green-900' : 'text-orange-900'
            }`}>
              {feedback}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!problem && !isLoading && (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-blue-200 shadow-sm">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-xl text-gray-700 font-medium">Ready to practice?</p>
            <p className="text-base text-gray-600 mt-2">Click "Get New Problem" to start</p>
          </div>
        )}
      </div>
    </div>
  )
}
