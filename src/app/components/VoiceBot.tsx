"use client";

import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const VoiceBot: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black flex flex-col">
      <Navbar />
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="w-full max-w-md rounded-2xl shadow-2xl bg-zinc-950/90 border border-zinc-800 p-6">
          <h1 className="text-3xl font-bold text-center text-white mb-6 tracking-tight">Voice Assistant</h1>
          <p className="text-center text-zinc-400 mb-8">
            Voice chat functionality coming soon! For now, please use the text chat.
          </p>
          
          <div className="flex justify-center">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors flex items-center space-x-3"
              disabled
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v2m0 0h3m-3 0H9m6-6a3 3 0 01-6 0V7a3 3 0 016 0v5z" />
              </svg>
              <span>Voice Chat (Coming Soon)</span>
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}; 