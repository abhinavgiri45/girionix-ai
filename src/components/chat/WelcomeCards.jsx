import React from 'react';
import { Crown, Sparkles, Code2, Sigma, Film, Image as ImageIcon, Building2 } from 'lucide-react';

export default function WelcomeCards({ userName, onOpenAbout, onOpenWhySwitch }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-3 sm:px-4 py-6 sm:py-8 max-w-2xl mx-auto w-full animate-fadeIn select-none">
      {/* Official Brand Logo Icon & Hero */}
      <div 
        className="mb-4 sm:mb-5 flex flex-col items-center cursor-pointer group" 
        onClick={onOpenAbout} 
        title="Click to view About Girionix AI & Creator Abhinav Giri"
      >
        <img
          src="/logo.png"
          alt="Girionix AI Official Logo"
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-contain shadow-glow-cyan mb-2.5 sm:mb-3 group-hover:scale-105 transition-transform duration-300"
        />
        <span className="text-[11px] sm:text-xs font-mono tracking-[0.25em] text-cyan-300 font-bold uppercase drop-shadow-sm">
          THINK • CREATE • EXPLORE
        </span>
      </div>

      {/* Greeting Hero */}
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-1.5 sm:mb-2">
        <span className="text-white">Hello, </span>
        <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
          {userName || 'Abhinav'}
        </span>
      </h1>
      
      <h2 className="text-sm sm:text-xl md:text-2xl font-semibold text-gray-400 tracking-tight mb-4 sm:mb-6">
        What would you like to explore today?
      </h2>

      {/* Action Badges: Why Switch, Company Website & Quick Tip */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
        <a
          href="https://giri-corporation.pages.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all hover:scale-105 shadow-sm"
          title="Official Giri Corporation Website — Owner & Developer of Girionix AI"
        >
          <Building2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>Giri Corporation (Official) ↗</span>
        </a>

        {onOpenWhySwitch && (
          <button
            onClick={onOpenWhySwitch}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-bold transition-all hover:scale-105 shadow-sm cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Why Switch to Girionix AI?</span>
          </button>
        )}

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-gray-400 text-xs font-mono shadow-inner">
          <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[10px]">/</span>
          <span>Type <strong className="text-gray-200">/</strong> for commands</span>
        </div>
      </div>
    </div>
  );
}
