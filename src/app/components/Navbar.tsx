"use client";

import React from "react";

interface NavbarProps {
  showHomeButton?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ showHomeButton = true }) => {
  const handleHomeClick = () => {
    window.location.reload(); // Simple way to go back to main page
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-800 backdrop-blur-sm border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-white font-semibold text-lg">Aven Insights</span>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center space-x-10">
            {showHomeButton && (
              <button
                onClick={handleHomeClick}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <span>Home</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}; 