import React from 'react';

export default function WelcomeCards({ userName, onOpenAbout, onSelectPrompt }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 sm:px-6 py-8 sm:py-16 max-w-4xl mx-auto w-full animate-fadeIn select-none">
      {/* Greeting Hero */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-3">
        <span className="bg-gradient-to-r from-[#4d82f3] via-[#7b61ff] to-[#a855f7] bg-clip-text text-transparent">
          Hello, {userName || 'Abhinav'}
        </span>
      </h1>
      
      <h2 className="text-lg sm:text-2xl md:text-3xl font-medium text-gray-400 tracking-tight mb-8">
        What would you like to explore today?
      </h2>

      {/* Pill: Type / in search bar for quick access */}
      <div 
        onClick={() => onSelectPrompt && onSelectPrompt('/')}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#131418] hover:bg-[#1a1b22] border border-white/[0.08] hover:border-cyan-500/30 text-xs text-gray-400 hover:text-gray-200 transition-all cursor-pointer shadow-sm group"
      >
        <span className="px-1.5 py-0.5 rounded bg-white/[0.08] text-cyan-400 font-mono font-bold text-xs border border-white/10 group-hover:border-cyan-500/40">/</span>
        <span>
          Type <strong className="text-gray-300 font-mono">/</strong> in the search bar for quick access to <strong className="text-cyan-300 font-semibold">Girionix AI tools</strong>
        </span>
      </div>
    </div>
  );
}
