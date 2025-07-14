"use client"

import React, { useState, useEffect } from 'react'
import Vapi from '@vapi-ai/web'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY
const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID

export const VoiceBot: React.FC = () => {
  const [vapi, setVapi] = useState<Vapi | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    if (!apiKey || !assistantId) return
    const vapiInstance = new Vapi(apiKey)
    setVapi(vapiInstance)

    vapiInstance.on('call-start', () => setIsConnected(true))
    vapiInstance.on('call-end', () => {
      setIsConnected(false)
      setIsSpeaking(false)
    })
    vapiInstance.on('speech-start', () => setIsSpeaking(true))
    vapiInstance.on('speech-end', () => setIsSpeaking(false))
    vapiInstance.on('error', (error) => console.error('Vapi error:', error))

    return () => {
      vapiInstance?.stop()
    }
  }, [])

  const startCall = () => vapi?.start(assistantId)
  const endCall = () => vapi?.stop()

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="w-full max-w-md rounded-2xl shadow-2xl bg-zinc-950/90 border border-zinc-800 p-6">
          <h1 className="text-3xl font-bold text-center text-white mb-6 tracking-tight">Voice Assistant</h1>
          <p className="text-center text-zinc-400 mb-8">
            {isConnected ? 'You are connected to the voice assistant.' : 'Start a conversation with your AI voice assistant.'}
          </p>
          <div className="flex justify-center">
            {!isConnected ? (
              <button
                onClick={startCall}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors flex items-center space-x-3 shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v2m0 0h3m-3 0H9m6-6a3 3 0 01-6 0V7a3 3 0 016 0v5z" />
                </svg>
                <span>Talk to Assistant</span>
              </button>
            ) : (
              <div className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-red-500 animate-pulse' : 'bg-green-600'}`}></div>
                    <span className="font-semibold text-white">
                      {isSpeaking ? 'Assistant Speaking...' : 'Listening...'}
                    </span>
                  </div>
                  <button
                    onClick={endCall}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded transition-colors text-xs"
                  >
                    End Call
                  </button>
                </div>
                {/* Transcript removed as per user request */}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  )
} 