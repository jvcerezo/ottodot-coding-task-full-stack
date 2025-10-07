'use client'

import { useState, useEffect } from 'react'
import { getOttoMessage, getOttoMotivation, getOttoGreeting, getTimeOfDay, getMotivationalStatement, getAppWalkthrough, getFAQs } from '@/lib/ottoPersonality'

interface OttoTutorProps {
  userName: string
  score: number
  streak: number
  hasActiveProblem: boolean
  lastResult?: 'correct' | 'incorrect' | null
}

// Function to render markdown-style text
const renderFormattedText = (text: string) => {
  // Split by lines to preserve structure
  const lines = text.split('\n')
  
  return lines.map((line, idx) => {
    // Convert **text** to bold
    const parts = line.split(/(\*\*.*?\*\*)/)
    const formatted = parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>
      }
      return part
    })
    
    return (
      <span key={idx}>
        {formatted}
        {idx < lines.length - 1 && <br />}
      </span>
    )
  })
}

export default function OttoTutor({ userName, score, streak, hasActiveProblem, lastResult }: OttoTutorProps) {
  const [message, setMessage] = useState('')
  const [showChat, setShowChat] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Initial greeting
    setMessage(getOttoGreeting(userName, getTimeOfDay()))
  }, [userName])

  useEffect(() => {
    // Update message based on context
    if (lastResult === 'correct') {
      setMessage(getOttoMotivation(streak, score))
      triggerAnimation()
    } else if (lastResult === 'incorrect' && streak === 0) {
      setMessage(getOttoMessage('struggling'))
      triggerAnimation()
    }
  }, [lastResult, streak, score])

  const triggerAnimation = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 1000)
  }

  const handleOttoClick = () => {
    setShowChat(!showChat)
    if (!showChat) {
      // Generate a contextual message when opening chat
      if (!hasActiveProblem) {
        setMessage(getOttoMessage('welcome'))
      } else if (streak >= 3) {
        setMessage(getOttoMotivation(streak, score))
      } else {
        setMessage(getOttoMessage('idle'))
      }
    }
  }

  return (
    <>
      {/* Otto Avatar - Floating Button */}
      <button
        onClick={handleOttoClick}
        className={`fixed bottom-6 right-6 z-50 group ${isAnimating ? 'animate-bounce' : ''}`}
        aria-label="Chat with Otto"
      >
        <div className="relative">
          {/* Notification badge for new messages */}
          {!showChat && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          )}
          
          {/* Otto Avatar */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-200">
            🐙
          </div>
          
          {/* Hover tooltip */}
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
            <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
              Chat with Otto! 💬
            </div>
          </div>
        </div>
      </button>

      {/* Chat Panel */}
      {showChat && (
        <div className="fixed bottom-24 right-6 z-40 w-80 sm:w-96 max-w-[calc(100vw-3rem)] animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-purple-300 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🐙</div>
                  <div>
                    <h3 className="font-bold text-lg">Otto the Octopus</h3>
                    <p className="text-xs opacity-90">Your AI Math Tutor</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto bg-gradient-to-b from-purple-50 to-blue-50">
              {/* Otto's Message */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-200">
                <div className="flex gap-3">
                  <div className="text-2xl flex-shrink-0">🐙</div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-purple-700 mb-1">Otto says:</div>
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line break-words">{renderFormattedText(message)}</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setMessage(getMotivationalStatement())
                    triggerAnimation()
                  }}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-all shadow-md"
                >
                  Motivate me
                </button>
                <button
                  onClick={() => {
                    setMessage(getAppWalkthrough())
                    triggerAnimation()
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-all shadow-md"
                >
                  Give me a full walkthrough of the app
                </button>
                <button
                  onClick={() => {
                    setMessage(getFAQs())
                    triggerAnimation()
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-all shadow-md"
                >
                  FAQs
                </button>
              </div>

              {/* Fun Fact Footer */}
              <div className="bg-white/60 rounded-lg p-3 border border-purple-200">
                <p className="text-xs text-purple-800">
                  <span className="font-bold">🐙 Did you know?</span> Octopuses have 3 hearts and 9 brains! Perfect for solving math problems!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
