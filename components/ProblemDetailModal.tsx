'use client'

interface ProblemDetailModalProps {
  isOpen: boolean
  onClose: () => void
  problem: string
  userAnswer: number
  correctAnswer: number
  isCorrect: boolean
  timestamp: string
  hint?: string
  solutionSteps?: string[]
}

export default function ProblemDetailModal({
  isOpen,
  onClose,
  problem,
  userAnswer,
  correctAnswer,
  isCorrect,
  timestamp,
  hint,
  solutionSteps
}: ProblemDetailModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl border-2 border-purple-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-2xl font-bold ${
                isCorrect ? 'text-green-600' : 'text-red-600'
              }`}>
                {isCorrect ? '✓ Correct' : '✗ Incorrect'}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {new Date(timestamp).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Problem Text */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
          <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
            📝 Problem
          </div>
          <p className="text-base text-gray-900 leading-relaxed">{problem}</p>
        </div>

        {/* Answer Comparison */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className={`p-4 rounded-lg border-2 ${
            isCorrect 
              ? 'bg-green-50 border-green-300' 
              : 'bg-red-50 border-red-300'
          }`}>
            <div className="text-xs font-semibold text-gray-600 mb-1">Your Answer</div>
            <div className={`text-2xl font-bold ${
              isCorrect ? 'text-green-700' : 'text-red-700'
            }`}>
              {userAnswer}
            </div>
          </div>
          <div className="bg-green-50 border-2 border-green-300 p-4 rounded-lg">
            <div className="text-xs font-semibold text-gray-600 mb-1">Correct Answer</div>
            <div className="text-2xl font-bold text-green-700">
              {correctAnswer}
            </div>
          </div>
        </div>

        {/* Hint Section */}
        {hint && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mb-4">
            <div className="text-sm font-bold text-amber-900 mb-2">💡 Hint</div>
            <p className="text-sm text-amber-900 leading-relaxed">{hint}</p>
          </div>
        )}

        {/* Solution Steps */}
        {solutionSteps && solutionSteps.length > 0 && (
          <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4 mb-4">
            <div className="text-sm font-bold text-purple-900 mb-2">📖 Step-by-Step Solution</div>
            <ol className="space-y-2 list-decimal list-inside text-sm text-purple-900">
              {solutionSteps.map((step, index) => (
                <li key={index} className="pl-1 leading-relaxed">{step}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-md active:scale-95"
        >
          Close
        </button>
      </div>
    </div>
  )
}
