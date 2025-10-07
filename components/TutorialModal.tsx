'use client'

import { useState, useEffect } from 'react'

interface TutorialModalProps {
  isOpen: boolean
  onClose: () => void
  userName: string
  onStepChange?: (step: number) => void
}

interface TutorialStep {
  id: number
  title: string
  description: string
  target: string
  emoji: string
  position: 'top' | 'bottom' | 'left' | 'right' | 'center'
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: 'Track Your Progress! 📊',
    description: 'Here you can see your total score and your current streak. Earn 10 points for each correct answer and build up your streak by getting consecutive correct answers!',
    target: 'score-streak',
    emoji: '🎯',
    position: 'bottom'
  },
  {
    id: 2,
    title: 'Customize Your Practice ⚙️',
    description: 'Choose your difficulty level (Easy, Medium, or Hard) and select the type of problems you want to practice: Mixed, Addition, Subtraction, Multiplication, or Division!',
    target: 'settings',
    emoji: '🎮',
    position: 'bottom'
  },
  {
    id: 3,
    title: 'Generate New Problems ✨',
    description: 'Click this button to get a fresh math problem tailored to your chosen difficulty and problem type. Otto will find the perfect challenge for you!',
    target: 'new-problem',
    emoji: '🆕',
    position: 'bottom'
  },
  {
    id: 4,
    title: 'Enter Your Answer ✍️',
    description: 'Type your answer in this input field. Take your time and think carefully! When you\'re ready, hit the Submit button to check if you\'re correct.',
    target: 'answer-input',
    emoji: '💭',
    position: 'top'
  },
  {
    id: 5,
    title: 'Need a Hint? 💡',
    description: 'Stuck on a problem? Click this button to reveal a helpful hint from Otto! There\'s no shame in getting a little help while learning.',
    target: 'hint-button',
    emoji: '🔍',
    position: 'top'
  },
  {
    id: 6,
    title: 'View the Solution 📖',
    description: 'Want to see how to solve the problem step-by-step? Click here to reveal the complete solution. Learning from examples is a great way to improve!',
    target: 'solution-button',
    emoji: '📚',
    position: 'top'
  },
  {
    id: 7,
    title: 'Review Past Problems 📜',
    description: 'All your recent attempts are saved here! Click on any past problem to review it in detail, including the correct answer and solution steps. Learn from your history!',
    target: 'history',
    emoji: '🕐',
    position: 'top'
  }
]

export default function TutorialModal({ isOpen, onClose, userName, onStepChange }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setCurrentStep(0)
    }
  }, [isOpen])

  // Notify parent when step changes
  useEffect(() => {
    if (isVisible && onStepChange) {
      onStepChange(currentStep)
    }
  }, [currentStep, isVisible, onStepChange])

  if (!isOpen || !isVisible) return null

  const step = tutorialSteps[currentStep]
  const isLastStep = currentStep === tutorialSteps.length - 1
  const isFirstStep = currentStep === 0

  // Determine modal position based on step
  // Steps 5-6 (hint and solution buttons) should show modal on the left
  // Other steps show modal on the right on desktop
  const isHintOrSolutionStep = currentStep === 4 || currentStep === 5
  const modalPositionClass = isHintOrSolutionStep 
    ? 'lg:justify-start lg:ml-8' 
    : 'lg:justify-end lg:mr-8'

  const handleNext = () => {
    if (isLastStep) {
      handleClose()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    onClose()
  }

  const handleSkip = () => {
    handleClose()
  }

  return (
    <>
      {/* Backdrop with highlighting */}
      <div className="fixed inset-0 z-[100] pointer-events-none">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto" onClick={handleClose} />
        
        {/* Spotlight effect on target element */}
        {step.target !== 'center' && (
          <style jsx global>{`
            [data-tutorial="${step.target}"] {
              position: relative;
              z-index: 101 !important;
              box-shadow: 0 0 0 4px rgba(147, 51, 234, 0.6), 0 0 0 9999px rgba(0, 0, 0, 0.7) !important;
              border-radius: 12px;
              pointer-events: auto;
            }
          `}</style>
        )}
      </div>

      {/* Tutorial Modal */}
      <div className={`fixed inset-0 z-[102] flex items-end justify-center lg:items-center p-4 pointer-events-none ${modalPositionClass}`}>
        <div className="relative bg-white rounded-t-2xl lg:rounded-2xl shadow-2xl border-4 border-purple-400 max-w-lg w-full p-6 animate-fade-in pointer-events-auto max-h-[60vh] lg:max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-4xl">{step.emoji}</div>
                <div>
                  <h2 className="text-2xl font-bold text-purple-900">{step.title}</h2>
                  <p className="text-sm text-purple-600">Step {currentStep + 1} of {tutorialSteps.length}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close tutorial"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-600 transition-all duration-300"
                style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed text-base">
              {step.description}
            </p>
          </div>

          {/* Special welcome message on first step */}
          {isFirstStep && (
            <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="text-3xl">🐙</div>
                <div>
                  <p className="text-sm font-semibold text-purple-900 mb-1">Hey {userName}! Welcome aboard! 🎉</p>
                  <p className="text-xs text-purple-700">
                    I'm Otto, your personal AI math tutor! Let me show you around so you can make the most of your learning adventure!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Last step celebration */}
          {isLastStep && (
            <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="text-3xl">🎊</div>
                <div>
                  <p className="text-sm font-semibold text-green-900 mb-1">You're all set!</p>
                  <p className="text-xs text-green-700">
                    You now know everything you need to start your math journey! Click "Get Started" to begin practicing!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              Skip Tutorial
            </button>
            
            <div className="flex gap-2">
              {!isFirstStep && (
                <button
                  onClick={handlePrevious}
                  className="px-5 py-2.5 text-sm font-semibold text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-lg transition-all active:scale-95"
                >
                  ← Previous
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                {isLastStep ? 'Get Started! 🚀' : 'Next →'}
              </button>
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {tutorialSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep 
                    ? 'bg-purple-600 w-6' 
                    : index < currentStep 
                    ? 'bg-purple-400' 
                    : 'bg-gray-300'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
