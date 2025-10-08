'use client'

import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import OttoTutor from '@/components/OttoTutor'
import ConfirmModal from '@/components/ConfirmModal'
import ProblemDetailModal from '@/components/ProblemDetailModal'
import TutorialModal from '@/components/TutorialModal'
import { getOttoEncouragement } from '@/lib/ottoPersonality'

interface MathProblem {
  problem_text: string
  final_answer: number
  hint?: string
  solution_steps?: string[]
}

interface HistoryItem {
  problem: string
  userAnswer: number
  correctAnswer: number
  isCorrect: boolean
  timestamp: string // Changed to string for localStorage
  hint?: string
  solution_steps?: string[]
}

export default function Home() {
  const [userName, setUserName] = useState('')
  const [tempName, setTempName] = useState('')
  const [showNameModal, setShowNameModal] = useState(true)
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
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [activeTab, setActiveTab] = useState<'problem' | 'settings' | 'history'>('problem')
  const [lastResult, setLastResult] = useState<'correct' | 'incorrect' | null>(null)
  const [showResetModal, setShowResetModal] = useState(false)
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null)
  const [showProblemDetailModal, setShowProblemDetailModal] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [tutorialMode, setTutorialMode] = useState(false)

  // Mock data for tutorial
  const mockProblem: MathProblem = {
    problem_text: "Sarah has 48 cookies. She wants to pack them equally into 6 boxes. How many cookies will be in each box?",
    final_answer: 8,
    hint: "Think about division! You need to split the total number of cookies equally among the boxes.",
    solution_steps: [
      "We need to divide 48 cookies by 6 boxes",
      "48 ÷ 6 = 8",
      "Each box will have 8 cookies"
    ]
  }

  const mockHistory: HistoryItem[] = [
    {
      problem: "If John has 25 marbles and gives 8 to his friend, how many marbles does he have left?",
      userAnswer: 17,
      correctAnswer: 17,
      isCorrect: true,
      timestamp: new Date(Date.now() - 300000).toISOString(),
      hint: "Subtract the marbles he gave away from his total.",
      solution_steps: ["25 - 8 = 17"]
    },
    {
      problem: "A baker made 36 cupcakes. If he sells them in boxes of 4, how many boxes can he make?",
      userAnswer: 8,
      correctAnswer: 9,
      isCorrect: false,
      timestamp: new Date(Date.now() - 600000).toISOString(),
      hint: "Divide the total cupcakes by the number per box.",
      solution_steps: ["36 ÷ 4 = 9", "So the baker can make 9 boxes"]
    }
  ]

  // Use mock data when in tutorial mode, otherwise use real data
  const displayProblem = tutorialMode ? mockProblem : problem
  const displayHistory = tutorialMode ? mockHistory : history

  // Load data from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem('mathPractice_userName')
    const savedScore = localStorage.getItem('mathPractice_score')
    const savedStreak = localStorage.getItem('mathPractice_streak')
    const savedHistory = localStorage.getItem('mathPractice_history')
    const savedDifficulty = localStorage.getItem('mathPractice_difficulty')
    const savedProblemType = localStorage.getItem('mathPractice_problemType')
    const hasSeenTutorial = localStorage.getItem('mathPractice_hasSeenTutorial')

    if (savedName) {
      setUserName(savedName)
      setShowNameModal(false)
      
      // Show tutorial if first time user (after name is set)
      if (!hasSeenTutorial) {
        setTimeout(() => {
          setShowTutorial(true)
          setTutorialMode(true)
        }, 500)
      }
    }
    if (savedScore) setScore(parseInt(savedScore))
    if (savedStreak) setStreak(parseInt(savedStreak))
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error('Failed to parse history:', e)
      }
    }
    if (savedDifficulty && ['easy', 'medium', 'hard'].includes(savedDifficulty)) {
      setDifficulty(savedDifficulty as 'easy' | 'medium' | 'hard')
    }
    if (savedProblemType && ['mixed', 'addition', 'subtraction', 'multiplication', 'division'].includes(savedProblemType)) {
      setProblemType(savedProblemType as 'mixed' | 'addition' | 'subtraction' | 'multiplication' | 'division')
    }
    
    setIsInitialized(true)
  }, [])

  // Save data to localStorage whenever it changes (but not on initial mount)
  useEffect(() => {
    if (!isInitialized) return
    if (userName) {
      localStorage.setItem('mathPractice_userName', userName)
    }
  }, [userName, isInitialized])

  useEffect(() => {
    if (!isInitialized) return
    localStorage.setItem('mathPractice_score', score.toString())
  }, [score, isInitialized])

  useEffect(() => {
    if (!isInitialized) return
    localStorage.setItem('mathPractice_streak', streak.toString())
  }, [streak, isInitialized])

  useEffect(() => {
    if (!isInitialized) return
    localStorage.setItem('mathPractice_history', JSON.stringify(history))
  }, [history, isInitialized])

  useEffect(() => {
    if (!isInitialized) return
    localStorage.setItem('mathPractice_difficulty', difficulty)
  }, [difficulty, isInitialized])

  useEffect(() => {
    if (!isInitialized) return
    localStorage.setItem('mathPractice_problemType', problemType)
  }, [problemType, isInitialized])

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tempName.trim()) {
      setUserName(tempName.trim())
      setShowNameModal(false)
      toast.success(`Welcome to Otto's Math Adventure, ${tempName.trim()}! 🐙`)
    }
  }

  const generateProblem = async () => {
    setIsLoading(true)
    setFeedback('')
    setUserAnswer('')
    setIsCorrect(null)
    setShowHint(false)
    setShowSolution(false)
    setLastResult(null)

    const toastId = toast.loading('Otto is finding a perfect problem for you...')

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
      toast.success('New problem ready! 📝', { id: toastId })
    } catch (error) {
      console.error('Error generating problem:', error)
      toast.error('Failed to generate problem. Please try again.', { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!sessionId) {
      toast.error('No problem session found!')
      return
    }

    setIsLoading(true)
    const toastId = toast.loading('Otto is checking your answer...')

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

      // Get Otto's encouragement
      const ottoMessage = getOttoEncouragement(data.is_correct, streak)

      if (data.is_correct) {
        setScore(prev => prev + 10)
        setStreak(prev => prev + 1)
        setLastResult('correct')
        toast.success(ottoMessage, { id: toastId, duration: 4000 })
      } else {
        setStreak(0)
        setLastResult('incorrect')
        toast.error(ottoMessage, { id: toastId, duration: 4000 })
      }

      // Add to history
      if (problem) {
        setHistory(prev => [{
          problem: problem.problem_text,
          userAnswer: Number(userAnswer),
          correctAnswer: data.correct_answer,
          isCorrect: data.is_correct,
          timestamp: new Date().toISOString(),
          hint: problem.hint,
          solution_steps: problem.solution_steps
        }, ...prev].slice(0, 10))
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      toast.error('Failed to submit answer. Please try again.', { id: toastId })
    } finally {
      setIsLoading(false)
    }
  }

  const resetProgress = () => {
    setScore(0)
    setStreak(0)
    setHistory([])
    localStorage.removeItem('mathPractice_score')
    localStorage.removeItem('mathPractice_streak')
    localStorage.removeItem('mathPractice_history')
    toast.success('Progress reset successfully! 🔄')
  }

  const changeName = () => {
    setTempName(userName)
    setShowNameModal(true)
  }

  const handleDifficultyChange = (level: 'easy' | 'medium' | 'hard') => {
    setDifficulty(level)
    toast.success(`Difficulty set to ${level}`, { duration: 2000 })
  }

  const handleProblemTypeChange = (type: 'mixed' | 'addition' | 'subtraction' | 'multiplication' | 'division') => {
    setProblemType(type)
    const typeLabels = {
      mixed: 'Mixed',
      addition: 'Addition',
      subtraction: 'Subtraction',
      multiplication: 'Multiplication',
      division: 'Division'
    }
    toast.success(`Problem type: ${typeLabels[type]}`, { duration: 2000 })
  }

  // Name Modal
  if (showNameModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border-2 border-purple-300 shadow-2xl p-6 sm:p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-6xl sm:text-7xl mb-4 animate-bounce">🐙</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-purple-900 mb-2">Hi! I'm Otto!</h2>
            <p className="text-base sm:text-lg text-gray-700 mb-2">Your friendly AI Math Tutor</p>
            <p className="text-sm text-gray-600">What should I call you?</p>
          </div>
          <form onSubmit={handleNameSubmit}>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full px-4 py-3 text-base sm:text-lg border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mb-4"
              placeholder="Enter your name"
              required
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 active:scale-95 text-white font-bold py-3 rounded-lg transition-all text-base sm:text-lg shadow-lg"
            >
              Let's Learn Math! 🚀
            </button>
          </form>
          <p className="text-xs text-center text-gray-500 mt-4">
            🐙 With 8 tentacles and lots of personality, we'll make math fun!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Otto Tutor Component */}
      <OttoTutor 
        userName={userName}
        score={score}
        streak={streak}
        hasActiveProblem={!!problem}
        lastResult={lastResult}
      />

      {/* Mobile Header with Stats - Hidden on Desktop */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b-2 border-purple-200 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Otto's Math Lab 🐙</h1>
              <p className="text-xs text-purple-700">Primary 5 • Singapore</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowTutorial(true)
                  setTutorialMode(true)
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-full transition-all active:scale-95"
                aria-label="Show Tutorial"
              >
                <span>📚</span>
                <span>Tutorial</span>
              </button>
              <button
                onClick={changeName}
                className="text-xs text-purple-600 hover:text-purple-800 underline"
              >
                {userName}
              </button>
            </div>
          </div>
          
          {/* Compact Stats Bar */}
          <div className="flex items-center gap-2" data-tutorial="score-streak">
            <div className="flex-1 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg px-3 py-2 text-center border border-yellow-300">
              <div className="text-xs text-yellow-800 font-medium">Score</div>
              <div className="text-lg font-bold text-yellow-900">{score}</div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg px-3 py-2 text-center border border-orange-300">
              <div className="text-xs text-orange-800 font-medium">Streak</div>
              <div className="text-lg font-bold text-orange-900">{streak}🔥</div>
            </div>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="flex border-t border-blue-100">
          <button
            onClick={() => setActiveTab('problem')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'problem'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 bg-white'
            }`}
          >
            📝 Problem
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'settings'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 bg-white'
            }`}
          >
            ⚙️ Settings
          </button>
          {history.length > 0 && (
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'history'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 bg-white'
              }`}
            >
              📊 History
            </button>
          )}
        </div>
      </div>

      {/* Mobile Tab Content */}
      <div className="lg:hidden">
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="px-4 py-4 space-y-4 bg-white min-h-[calc(100vh-180px)]">
            <div data-tutorial="settings">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Difficulty</label>
              <div className="flex gap-2">
                {(['easy', 'medium', 'hard'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => handleDifficultyChange(level)}
                    disabled={isLoading}
                    className={`flex-1 py-3 px-2 rounded-lg text-sm font-semibold transition-all ${
                      difficulty === level
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Problem Type</label>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { value: 'mixed', label: 'Mixed', emoji: '🔀' },
                  { value: 'addition', label: 'Add', emoji: '➕' },
                  { value: 'subtraction', label: 'Sub', emoji: '➖' },
                  { value: 'multiplication', label: 'Mul', emoji: '✖️' },
                  { value: 'division', label: 'Div', emoji: '➗' }
                ] as const).map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleProblemTypeChange(type.value)}
                    disabled={isLoading}
                    className={`py-3 px-2 rounded-lg text-xs font-semibold transition-all ${
                      problemType === type.value
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                    }`}
                  >
                    <div className="text-xl mb-1">{type.emoji}</div>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                generateProblem()
                setActiveTab('problem')
              }}
              disabled={isLoading}
              data-tutorial="new-problem"
              className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-300 text-white font-bold py-4 rounded-lg transition-all shadow-md"
            >
              {isLoading ? '⏳ Generating...' : '✨ Generate New Problem'}
            </button>

            {(score > 0 || history.length > 0) && (
              <button
                onClick={() => setShowResetModal(true)}
                className="w-full text-sm text-red-600 hover:text-red-800 active:text-red-900 underline py-2"
              >
                Reset All Progress
              </button>
            )}
          </div>
        )}

        {/* Problem Tab */}
        {activeTab === 'problem' && (
          <div className="px-4 py-4 space-y-4 min-h-[calc(100vh-180px)]">
            {(displayProblem || tutorialMode) ? (
              <>
                {/* Problem Card */}
                <div className="bg-white rounded-lg border-2 border-blue-200 p-5 shadow-sm" data-tutorial="answer-input">
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-3">
                      Your Problem
                    </div>
                    <p className="text-base text-gray-900 leading-relaxed">{displayProblem.problem_text}</p>
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
                        disabled={!!feedback || isLoading || tutorialMode}
                        className="w-full px-4 py-3.5 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
                        placeholder="Type your answer"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!userAnswer || isLoading || !!feedback || tutorialMode}
                      className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-lg py-3.5 rounded-lg transition-all shadow-md"
                    >
                      {isLoading ? '⏳ Checking...' : '✓ Submit Answer'}
                    </button>
                  </form>

                  {!feedback && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setShowHint(!showHint)}
                        disabled={tutorialMode}
                        className="py-2.5 px-3 text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 border-2 border-amber-300 rounded-lg transition-all disabled:opacity-50"
                        data-tutorial="hint-button"
                      >
                        💡 {showHint ? 'Hide Hint' : 'Show Hint'}
                      </button>
                      <button
                        onClick={() => setShowSolution(!showSolution)}
                        disabled={tutorialMode}
                        className="py-2.5 px-3 text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 active:bg-purple-200 border-2 border-purple-300 rounded-lg transition-all disabled:opacity-50"
                        data-tutorial="solution-button"
                      >
                        📖 {showSolution ? 'Hide Solution' : 'Show Solution'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Hint */}
                {showHint && displayProblem.hint && (
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 shadow-sm animate-fade-in">
                    <div className="text-sm font-bold text-amber-900 mb-2">💡 Hint</div>
                    <p className="text-sm text-amber-900 leading-relaxed">{displayProblem.hint}</p>
                  </div>
                )}

                {/* Solution */}
                {showSolution && displayProblem.solution_steps && (
                  <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4 shadow-sm animate-fade-in">
                    <div className="text-sm font-bold text-purple-900 mb-2">📝 Solution Steps</div>
                    <ol className="space-y-1.5 list-decimal list-inside text-sm text-purple-900">
                      {displayProblem.solution_steps.map((step, index) => (
                        <li key={index} className="pl-1">{step}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Feedback */}
                {feedback && (
                  <div className={`rounded-lg border-2 p-5 shadow-md animate-fade-in ${
                    isCorrect
                      ? 'bg-green-50 border-green-300'
                      : 'bg-orange-50 border-orange-300'
                  }`}>
                    <div className={`text-lg font-bold mb-2 ${
                      isCorrect
                        ? 'text-green-900'
                        : 'text-orange-900'
                    }`}>
                      {isCorrect ? `✓ Great job, ${userName}!` : `✗ Not quite, ${userName}`}
                    </div>
                    <p className={`text-sm leading-relaxed ${
                      isCorrect
                        ? 'text-green-900'
                        : 'text-orange-900'
                    }`}>
                      {feedback}
                    </p>
                  </div>
                )}

                {/* Next Problem Button - Shows after feedback */}
                {feedback && (
                  <button
                    onClick={generateProblem}
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-300 text-white font-bold py-4 rounded-lg transition-all shadow-md"
                  >
                    {isLoading ? '⏳ Generating...' : '➡️ Next Problem'}
                  </button>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg border-2 border-blue-200 p-12 text-center shadow-sm">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-xl text-gray-700 font-medium mb-2">Ready, {userName}?</p>
                <p className="text-sm text-gray-600 mb-4">Generate your first problem to get started!</p>
                <button
                  onClick={generateProblem}
                  disabled={isLoading}
                  className="inline-block bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md"
                >
                  {isLoading ? '⏳ Generating...' : '✨ Generate Problem'}
                </button>
                <p className="text-xs text-gray-500 mt-3">
                  Need to change difficulty? Go to <button onClick={() => setActiveTab('settings')} className="text-blue-600 underline">Settings</button>
                </p>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (displayHistory.length > 0 || tutorialMode) && (
          <div className="px-4 py-4 min-h-[calc(100vh-180px)] bg-white" data-tutorial="history">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Recent Problems ({displayHistory.length})</h3>
            <div className="space-y-3">
              {displayHistory.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 cursor-pointer ${
                    item.isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
                  }`}
                  onClick={() => {
                    if (!tutorialMode) {
                      setSelectedHistoryItem(item)
                      setShowProblemDetailModal(true)
                    }
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-sm font-bold ${
                      item.isCorrect ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {item.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2 leading-relaxed">{item.problem}</p>
                  <div className="text-sm text-gray-600">
                    Your answer: <span className="font-semibold">{item.userAnswer}</span>
                    {!item.isCorrect && (
                      <> • Correct: <span className="font-semibold text-green-700">{item.correctAnswer}</span></>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout - Original Sidebar Design */}
      <div className="hidden lg:block max-w-7xl mx-auto p-4">
        {/* Desktop Header */}
        <div className="flex mb-6 justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Otto's Math Adventure 🐙</h1>
            <div className="flex items-center gap-3">
              <p className="text-purple-700">Primary 5 Math • Powered by AI Tutoring</p>
              <button
                onClick={() => {
                  setShowTutorial(true)
                  setTutorialMode(true)
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-full transition-all shadow-sm hover:shadow-md active:scale-95"
              >
                <span>📚</span>
                <span>Show Tutorial</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Desktop Sidebar */}
          <div className="space-y-4">
            {/* User Info & Stats */}
            <div className="bg-white rounded-lg border-2 border-purple-200 p-4 shadow-md">
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-purple-900 mb-2">Hey there, {userName}! 🌟</div>
                <button
                  onClick={changeName}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-full transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                  <span>✏️</span>
                  <span>Change Name</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3" data-tutorial="score-streak">
                <div className="text-center p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg border border-yellow-300">
                  <div className="text-xs font-medium text-yellow-800 mb-1">Total Score</div>
                  <div className="text-2xl font-bold text-yellow-900">{score}</div>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg border border-orange-300">
                  <div className="text-xs font-medium text-orange-800 mb-1">Streak 🔥</div>
                  <div className="text-2xl font-bold text-orange-900">{streak}</div>
                </div>
              </div>
              {(score > 0 || history.length > 0) && (
                <button
                  onClick={() => setShowResetModal(true)}
                  className="w-full mt-3 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                  <span>🔄</span>
                  <span>Reset Progress</span>
                </button>
              )}
            </div>

            {/* Settings */}
            <div className="bg-white rounded-lg border-2 border-purple-200 p-4 shadow-md" data-tutorial="settings">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-purple-800 mb-2">🎯 Difficulty Level</label>
                <div className="flex gap-2">
                  {(['easy', 'medium', 'hard'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => handleDifficultyChange(level)}
                      disabled={isLoading}
                      className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                        difficulty === level
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-purple-800 mb-2">🧮 Problem Type</label>
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
                      onClick={() => handleProblemTypeChange(type.value)}
                      disabled={isLoading}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                        problemType === type.value
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
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
                data-tutorial="new-problem"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition-all shadow-md"
              >
                {isLoading ? '⏳ Loading...' : '✨ New Problem'}
              </button>
            </div>

            {/* History */}
            {(displayHistory.length > 0 || tutorialMode) && (
              <div className="bg-white rounded-lg border-2 border-purple-200 p-4 shadow-md">
                <h3 className="text-sm font-bold text-purple-800 mb-3">📚 Recent Problems ({displayHistory.length})</h3>
                <div className="space-y-2 max-h-[400px] overflow-y-auto" data-tutorial="history">
                  {displayHistory.map((item, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded border-l-4 cursor-pointer ${
                        item.isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
                      }`}
                      onClick={() => {
                        if (!tutorialMode) {
                          setSelectedHistoryItem(item)
                          setShowProblemDetailModal(true)
                        }
                      }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-xs font-bold ${
                          item.isCorrect ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {item.isCorrect ? '✓' : '✗'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(item.timestamp).toLocaleTimeString()}
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

          {/* Main Content - Desktop */}
          <div className="col-span-2 space-y-4">
            {(displayProblem || tutorialMode) ? (
              <>
                {/* Problem Card */}
                <div className="bg-white rounded-lg border-2 border-purple-200 p-6 shadow-md" data-tutorial="answer-input">
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-3">🎯 Your Challenge</div>
                    <p className="text-lg text-gray-900 leading-relaxed">{displayProblem.problem_text}</p>
                  </div>

                  <form onSubmit={submitAnswer} className="space-y-3">
                    <div>
                      <label htmlFor="answer" className="block text-sm font-semibold text-gray-800 mb-2">
                        Your Answer 💡
                      </label>
                      <input
                        type="number"
                        step="any"
                        id="answer"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        disabled={!!feedback || isLoading || tutorialMode}
                        className="w-full px-4 py-3 text-lg border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
                        placeholder="Type your answer here..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!userAnswer || isLoading || !!feedback || tutorialMode}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-lg py-3 rounded-lg transition-all shadow-md"
                    >
                      {isLoading ? '⏳ Checking...' : '✓ Submit Answer'}
                    </button>
                  </form>

                  {!feedback && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setShowHint(!showHint)}
                        disabled={tutorialMode}
                        className="py-2 px-3 text-sm font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 rounded-lg transition-all"
                        data-tutorial="hint-button"
                      >
                        💡 {showHint ? 'Hide Hint' : 'Need a Hint?'}
                      </button>
                      <button
                        onClick={() => setShowSolution(!showSolution)}
                        disabled={tutorialMode}
                        className="py-2 px-3 text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border-2 border-purple-300 rounded-lg transition-all"
                        data-tutorial="solution-button"
                      >
                        📖 {showSolution ? 'Hide Solution' : 'Show Solution'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Hint */}
                {showHint && displayProblem.hint && (
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 animate-fade-in shadow-sm">
                    <div className="text-sm font-bold text-amber-900 mb-2">💡 Otto's Hint</div>
                    <p className="text-sm text-amber-900 leading-relaxed">{displayProblem.hint}</p>
                  </div>
                )}

                {/* Solution */}
                {showSolution && displayProblem.solution_steps && (
                  <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4 animate-fade-in shadow-sm">
                    <div className="text-sm font-bold text-purple-900 mb-2">📝 Step-by-Step Solution</div>
                    <ol className="space-y-1.5 list-decimal list-inside text-sm text-purple-900">
                      {displayProblem.solution_steps.map((step, index) => (
                        <li key={index} className="pl-1">{step}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Feedback */}
                {feedback && (
                  <div className={`rounded-lg border-2 p-5 animate-fade-in shadow-md ${
                    isCorrect
                      ? 'bg-green-50 border-green-300'
                      : 'bg-orange-50 border-orange-300'
                  }`}>
                    <div className={`text-lg font-bold mb-2 ${
                      isCorrect ? 'text-green-900' : 'text-orange-900'
                    }`}>
                      {isCorrect ? `🎉 Awesome work, ${userName}!` : `💪 Nice try, ${userName}!`}
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
              <div className="bg-white rounded-lg border-2 border-purple-200 p-12 text-center shadow-md">
                <div className="text-6xl mb-4">🐙</div>
                <p className="text-2xl text-purple-900 font-bold mb-2">Ready to dive in, {userName}?</p>
                <p className="text-gray-600 mb-4">Otto's got some awesome math problems waiting for you!</p>
                <p className="text-sm text-gray-500">Click "✨ New Problem" on the left to start your adventure!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={resetProgress}
        title="Reset Progress"
        message="Are you sure you want to reset all your progress? This will clear your score, streak, and history. This action cannot be undone!"
        confirmText="Yes, Reset Everything"
        cancelText="No, Keep My Progress"
        type="danger"
      />

      {/* Problem Detail Modal */}
      {selectedHistoryItem && (
        <ProblemDetailModal
          isOpen={showProblemDetailModal}
          onClose={() => setShowProblemDetailModal(false)}
          problem={selectedHistoryItem.problem}
          userAnswer={selectedHistoryItem.userAnswer}
          correctAnswer={selectedHistoryItem.correctAnswer}
          isCorrect={selectedHistoryItem.isCorrect}
          timestamp={selectedHistoryItem.timestamp}
          hint={selectedHistoryItem.hint}
          solutionSteps={selectedHistoryItem.solution_steps}
        />
      )}

      {/* Tutorial Modal */}
      <TutorialModal
        isOpen={showTutorial}
        onClose={() => {
          setShowTutorial(false)
          setTutorialMode(false)
          localStorage.setItem('mathPractice_hasSeenTutorial', 'true')
        }}
        userName={userName}
        onStepChange={(step) => {
          // Automatically switch to the correct tab based on tutorial step (for mobile)
          if (step === 0) {
            // Step 1: Score/Streak - visible in mobile header
            setActiveTab('problem')
          } else if (step === 1 || step === 2) {
            // Step 2-3: Settings and New Problem button
            setActiveTab('settings')
          } else if (step >= 3 && step <= 5) {
            // Step 4-6: Answer input, Hint, Solution
            setActiveTab('problem')
          } else if (step === 6) {
            // Step 7: History
            setActiveTab('history')
          }
        }}
      />
    </div>
  )
}
