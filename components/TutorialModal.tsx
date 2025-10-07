'use client'

import { useState, useEffect, useRef } from 'react'

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
  mobileTab?: 'problem' | 'settings' | 'history'
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: 'Track Your Progress!',
    description: 'Earn 10 points per correct answer and build your streak!',
    target: 'score-streak',
    emoji: '🎯',
    position: 'bottom',
    mobileTab: 'problem'
  },
  {
    id: 2,
    title: 'Customize Practice',
    description: 'Choose difficulty and problem types.',
    target: 'settings',
    emoji: '⚙️',
    position: 'bottom',
    mobileTab: 'settings'
  },
  {
    id: 3,
    title: 'Generate Problems',
    description: 'Get fresh problems tailored to your settings.',
    target: 'new-problem',
    emoji: '✨',
    position: 'top',
    mobileTab: 'settings'
  },
  {
    id: 4,
    title: 'Enter Your Answer',
    description: 'Type your answer and submit when ready.',
    target: 'answer-input',
    emoji: '✍️',
    position: 'bottom',
    mobileTab: 'problem'
  },
  {
    id: 5,
    title: 'Need a Hint?',
    description: 'Get helpful hints when stuck.',
    target: 'hint-button',
    emoji: '💡',
    position: 'top',
    mobileTab: 'problem'
  },
  {
    id: 6,
    title: 'View Solution',
    description: 'See step-by-step solutions.',
    target: 'solution-button',
    emoji: '📖',
    position: 'top',
    mobileTab: 'problem'
  },
  {
    id: 7,
    title: 'Review History',
    description: 'All your attempts are saved here!',
    target: 'history',
    emoji: '📜',
    position: 'bottom',
    mobileTab: 'history'
  }
]

export default function TutorialModal({ isOpen, onClose, userName, onStepChange }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({})
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      setCurrentStep(0)
    }
  }, [isOpen])

  // Notify parent when step changes
  useEffect(() => {
    if (isVisible && onStepChange) {
      const step = tutorialSteps[currentStep]
      if (step.mobileTab) {
        onStepChange(currentStep)
      }
    }
  }, [currentStep, isVisible, onStepChange])

  // Calculate tooltip position based on target element (mobile only)
  useEffect(() => {
    if (!isVisible) return

    const calculatePosition = () => {
      const step = tutorialSteps[currentStep]
      const targetElement = document.querySelector(`[data-tutorial="${step.target}"]`)
      
      if (!targetElement || !tooltipRef.current) return

      const targetRect = targetElement.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const isMobile = window.innerWidth < 1024

      if (isMobile) {
        // Mobile: Position tooltip based on available space
        let top = 0
        let left = 16 // margin from edge
        const maxWidth = window.innerWidth - 32 // 16px margin on each side

        // Check if target is in top or bottom half of screen
        const isTopHalf = targetRect.top < window.innerHeight / 2

        if (isTopHalf) {
          // Position below the target
          top = targetRect.bottom + 8
        } else {
          // Position above the target
          top = targetRect.top - tooltipRect.height - 8
        }

        // Keep within viewport bounds
        if (top < 60) top = 60 // Below header
        if (top + tooltipRect.height > window.innerHeight - 20) {
          top = window.innerHeight - tooltipRect.height - 20
        }

        setTooltipStyle({
          position: 'fixed',
          top: `${top}px`,
          left: `${left}px`,
          right: `${left}px`,
          maxWidth: `${maxWidth}px`,
          zIndex: 102
        })
      } else {
        // Desktop: reset style
        setTooltipStyle({})
      }
    }

    // Calculate immediately and on resize
    setTimeout(calculatePosition, 100) // Wait for DOM to update
    window.addEventListener('resize', calculatePosition)
    
    return () => window.removeEventListener('resize', calculatePosition)
  }, [currentStep, isVisible])

  if (!isOpen || !isVisible) return null

  const step = tutorialSteps[currentStep]
  const isLastStep = currentStep === tutorialSteps.length - 1
  const isFirstStep = currentStep === 0

  // Determine modal position for desktop
  const isHintOrSolutionStep = currentStep === 4 || currentStep === 5
  const desktopPositionClass = isHintOrSolutionStep 
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
        {/* Dark overlay - clickable to close, but don't blur the highlighted element */}
        <div 
          className="absolute inset-0 bg-black/70 pointer-events-auto" 
          onClick={handleClose} 
        />
        
        {/* Spotlight effect on target element */}
        {step.target !== 'center' && (
          <style jsx global>{`
            [data-tutorial="${step.target}"] {
              position: relative;
              z-index: 101 !important;
              border-radius: 12px;
              pointer-events: auto;
              filter: none !important;
            }
            
            /* Desktop spotlight */
            @media (min-width: 1024px) {
              [data-tutorial="${step.target}"] {
                box-shadow: 0 0 0 4px rgba(147, 51, 234, 0.6), 0 0 0 9999px rgba(0, 0, 0, 0.7) !important;
              }
            }
            
            /* Mobile spotlight - bright outline */
            @media (max-width: 1023px) {
              [data-tutorial="${step.target}"] {
                outline: 4px solid rgba(147, 51, 234, 1) !important;
                outline-offset: 3px;
                box-shadow: 0 0 30px 8px rgba(147, 51, 234, 0.8) !important;
                animation: mobile-pulse 2s ease-in-out infinite;
              }
              
              @keyframes mobile-pulse {
                0%, 100% {
                  outline-color: rgba(147, 51, 234, 1);
                  box-shadow: 0 0 30px 8px rgba(147, 51, 234, 0.8);
                }
                50% {
                  outline-color: rgba(168, 85, 247, 1);
                  box-shadow: 0 0 40px 12px rgba(168, 85, 247, 1);
                }
              }
            }
          `}</style>
        )}
      </div>

      {/* Tutorial Modal - Positioned dynamically on mobile, flex on desktop */}
      <div 
        ref={tooltipRef}
        style={tooltipStyle}
        className="lg:fixed lg:inset-0 lg:z-[102] lg:flex lg:items-center lg:pointer-events-none lg:p-4"
      >
        <div className={`lg:flex lg:w-full lg:h-full lg:items-center ${desktopPositionClass}`}>
          <div className="relative bg-white shadow-2xl border-3 border-purple-400 pointer-events-auto rounded-xl p-3 lg:max-w-lg lg:border-4 lg:rounded-2xl lg:p-6 animate-fade-in">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-2 lg:mb-4">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="text-xl lg:text-4xl flex-shrink-0">{step.emoji}</div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm lg:text-2xl font-bold text-purple-900 leading-tight">{step.title}</h2>
                  <p className="text-xs lg:text-sm text-purple-600">Step {currentStep + 1}/{tutorialSteps.length}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-2"
                aria-label="Close"
              >
                <svg className="w-4 h-4 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-2 lg:mb-4">
              <div className="h-1 lg:h-2 bg-purple-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-600 transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="mb-3 lg:mb-6">
              <p className="text-xs lg:text-base text-gray-700 leading-snug lg:leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Welcome message - only on first step */}
            {isFirstStep && (
              <div className="mb-3 lg:mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-2 lg:p-4">
                <div className="flex items-start gap-2">
                  <div className="text-lg lg:text-3xl flex-shrink-0">🐙</div>
                  <div className="min-w-0">
                    <p className="text-xs lg:text-sm font-semibold text-purple-900 mb-0.5">Hey {userName}! 🎉</p>
                    <p className="text-xs text-purple-700 leading-tight">
                      I'm Otto! Let me show you around!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Last step celebration */}
            {isLastStep && (
              <div className="mb-3 lg:mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-2 lg:p-4">
                <div className="flex items-start gap-2">
                  <div className="text-lg lg:text-3xl flex-shrink-0">🎊</div>
                  <div className="min-w-0">
                    <p className="text-xs lg:text-sm font-semibold text-green-900 mb-0.5">You're all set!</p>
                    <p className="text-xs text-green-700 leading-tight">
                      Ready to start practicing!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={handleSkip}
                className="text-xs lg:text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Skip
              </button>
              
              <div className="flex gap-1.5">
                {!isFirstStep && (
                  <button
                    onClick={handlePrevious}
                    className="px-2.5 py-1.5 lg:px-5 lg:py-2.5 text-xs lg:text-sm font-semibold text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-lg transition-all active:scale-95"
                  >
                    ← Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="px-3 py-1.5 lg:px-5 lg:py-2.5 text-xs lg:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  {isLastStep ? 'Start! 🚀' : 'Next →'}
                </button>
              </div>
            </div>

            {/* Step indicators - Desktop only, hidden on mobile */}
            <div className="hidden lg:flex justify-center gap-2 mt-6">
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
      </div>
    </>
  )
}
