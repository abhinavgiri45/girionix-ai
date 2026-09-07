import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Columns2, 
  MessageSquare, 
  User, 
  Sparkles, 
  Download, 
  Crown, 
  Cpu, 
  ChevronDown, 
  Wrench, 
  FileText, 
  Award, 
  Activity, 
  RefreshCw,
  Globe
} from 'lucide-react';

export default function Header({
  layoutMode,
  setLayoutMode,
  onOpenTools,
  onOpenAbout,
  onOpenDownload,
  onOpenProStatus,
  onOpenScratchpad,
  onOpenUpdates,
  onOpenLocalEngine,
  onOpenTitanWorkstation,
  onToggleSidebar,
  userName,
  onChangeName,
  isAppInstalled,
  isTitanMode,
  onToggleTitanMode,
  onOpenWhySwitch
}) {
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsToolsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`h-14 border-b px-3 sm:px-5 flex items-center justify-between z-30 backdrop-blur-xl transition-colors select-none ${
      isTitanMode 
        ? 'bg-[#030609]/95 border-emerald-500/30' 
        : 'bg-[#0A0C14]/95 border-white/[0.08]'
    }`}>
      {/* Left: Sidebar Toggle & Official Brand Identity */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          title="Toggle Sidebar (Ctrl+B)"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div 
          className="flex items-center gap-2.5 cursor-pointer group" 
          onClick={onOpenAbout} 
          title="Introducing Girionix AI • Envisioned & Built by Abhinav Giri"
        >
          <img
            src="/logo.png"
            alt="Girionix AI Logo"
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-contain group-hover:scale-105 transition-transform ${
              isTitanMode ? 'shadow-glow-emerald' : 'shadow-glow-cyan'
            }`}
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-sm sm:text-base tracking-wider text-white leading-tight flex items-center gap-1">
              <span>GIRIONIX</span>
              <span className={isTitanMode ? 'text-emerald-400 font-black' : 'text-cyan-400'}>
                {isTitanMode ? 'TITAN' : 'AI'}
              </span>
            </span>
            <span className={`text-[9px] font-mono tracking-widest hidden sm:inline uppercase ${
              isTitanMode ? 'text-emerald-400/90 font-bold' : 'text-cyan-300/80'
            }`}>
              {isTitanMode ? '⚡ 100% On-Device Offline' : 'Think • Create • Explore'}
            </span>
          </div>
        </div>

        {/* Edition Mode Segmented Switcher (Standard vs Titan) */}
        <div className="hidden xs:flex items-center p-0.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono ml-1 sm:ml-2">
          <button
            onClick={() => onToggleTitanMode && onToggleTitanMode(false)}
            className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              !isTitanMode
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Standard Universal Edition"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Standard</span>
          </button>

          <button
            onClick={() => onToggleTitanMode && onToggleTitanMode(true)}
            className={`px-2 sm:px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              isTitanMode
                ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-black font-extrabold shadow-glow-emerald'
                : 'text-emerald-400/80 hover:text-emerald-300'
            }`}
            title="Titan 100% On-Device Hardware Edition"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Titan</span>
          </button>
        </div>
      </div>

      {/* Center: Clean Layout & Studio Mode Switcher */}
      {/* Desktop Mode Switcher */}
      <div className="hidden sm:flex items-center p-0.5 rounded-xl bg-black/60 border border-white/[0.08] text-xs font-medium">
        <button
          onClick={() => setLayoutMode('chat')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
            layoutMode === 'chat'
              ? isTitanMode 
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' 
                : 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
          title="Chat Focus"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chat</span>
        </button>

        <button
          onClick={() => setLayoutMode('split')}
          className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
            layoutMode === 'split'
              ? isTitanMode 
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' 
                : 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
          title="Side-by-Side Split Workspace"
        >
          <Columns2 className="w-3.5 h-3.5" />
          <span>Split</span>
        </button>

        <button
          onClick={() => setLayoutMode('studio')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
            layoutMode === 'studio'
              ? isTitanMode 
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' 
                : 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 shadow-sm'
              : 'text-gray-400 hover:text-white'
          }`}
          title="AI Studio (Google AI Studio, Code, Math & Media)"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Studio</span>
        </button>
      </div>

      {/* Mobile Mode Switcher (< sm) */}
      <div className="flex sm:hidden items-center p-0.5 rounded-xl bg-black/60 border border-white/10 text-xs font-medium">
        <button
          onClick={() => setLayoutMode('chat')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
            layoutMode === 'chat'
              ? isTitanMode 
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' 
                : 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
              : 'text-gray-400 hover:text-white'
          }`}
          title="Chat Focus"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chat</span>
        </button>

        <button
          onClick={() => setLayoutMode('studio')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
            layoutMode === 'studio'
              ? isTitanMode 
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' 
                : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-cyan-300 font-bold border border-cyan-500/30'
              : 'text-gray-400 hover:text-white'
          }`}
          title="Google AI Studio"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Studio</span>
        </button>
      </div>

      {/* Right: Clean Action Hub (Why Switch, Get App, Unified Tools Menu & User Profile) */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Why Switch? Quick Button */}
        {onOpenWhySwitch && (
          <button
            onClick={onOpenWhySwitch}
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all hover:scale-[1.02] cursor-pointer"
            title="Why Switch to Girionix AI? (Model Benchmarks & Comparison)"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="hidden xs:inline">Why Switch?</span>
          </button>
        )}

        {/* App Status / Download App */}
        {isAppInstalled ? (
          <button
            onClick={onOpenProStatus || onOpenDownload}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold shadow-sm transition-all"
            title="Native App Active • Pro Superpowers Unlocked"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 animate-pulse" />
            <span className="hidden md:inline">Pro Active</span>
          </button>
        ) : (
          onOpenDownload && (
            <button
              onClick={onOpenDownload}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold shadow-glow-emerald transition-all hover:scale-[1.02]"
              title="Download Desktop & Mobile Standalone Apps"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">Get App</span>
            </button>
          )
        )}

        {/* Unified Tools & Extra Features Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isToolsDropdownOpen
                ? 'bg-white/10 text-white border-white/25 shadow-md'
                : 'bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white border-white/10'
            }`}
            title="AI Tools, Offline Engine & Extras"
          >
            <Wrench className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Tools</span>
            <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isToolsDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 sm:w-72 rounded-2xl bg-[#090C18]/95 border border-white/15 shadow-2xl backdrop-blur-2xl p-2 z-50 animate-fadeIn space-y-1">
              {/* Why Switch? */}
              {onOpenWhySwitch && (
                <button
                  onClick={() => { setIsToolsDropdownOpen(false); onOpenWhySwitch(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs text-gray-200 hover:text-white hover:bg-purple-500/20 transition-colors border-b border-white/5 pb-2 mb-1"
                >
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white flex items-center gap-1">
                      <span>Why Switch to Girionix?</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">Compare</span>
                    </div>
                    <div className="text-[10px] text-gray-400">Model benchmarks vs ChatGPT & Claude</div>
                  </div>
                </button>
              )}

              {/* 1. Tools Hub */}
              <button
                onClick={() => { setIsToolsDropdownOpen(false); onOpenTools(); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Universal API & Tools Hub</div>
                  <div className="text-[10px] text-gray-400">Universal API, Auto-Upgrade & Parameters</div>
                </div>
              </button>

              {/* 2. 100% Offline Neural Core */}
              {!isTitanMode && onOpenLocalEngine && (
                <button
                  onClick={() => { setIsToolsDropdownOpen(false); onOpenLocalEngine(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <span>Local Neural Core</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">Offline</span>
                    </div>
                    <div className="text-[10px] text-gray-400">Air-gapped hardware execution</div>
                  </div>
                </button>
              )}

              {/* 3. Scratchpad & Notes */}
              {onOpenScratchpad && (
                <button
                  onClick={() => { setIsToolsDropdownOpen(false); onOpenScratchpad(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Scratchpad & Notes</div>
                    <div className="text-[10px] text-gray-400">Persistent canvas & markdown notes</div>
                  </div>
                </button>
              )}

              {/* 4. Intro & Creator */}
              {onOpenAbout && (
                <button
                  onClick={() => { setIsToolsDropdownOpen(false); onOpenAbout(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <div className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Introducing Girionix AI</div>
                    <div className="text-[10px] text-gray-400">Envisioned & Built by Abhinav Giri</div>
                  </div>
                </button>
              )}

              {/* 5. Updates (if app installed) */}
              {isAppInstalled && onOpenUpdates && (
                <button
                  onClick={() => { setIsToolsDropdownOpen(false); onOpenUpdates(); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs text-gray-200 hover:text-white hover:bg-white/10 transition-colors border-t border-white/5 pt-2"
                >
                  <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Check for Updates</div>
                    <div className="text-[10px] text-gray-400">Standalone live sync</div>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        {userName && (
          <button
            onClick={onChangeName}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-colors"
            title="Click to edit your name"
          >
            <User className="w-3.5 h-3.5" />
            <span className="max-w-[70px] sm:max-w-[90px] truncate">{userName}</span>
          </button>
        )}
      </div>
    </header>
  );
}
