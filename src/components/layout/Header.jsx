import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Plus, 
  Settings, 
  Wrench, 
  User, 
  Sparkles, 
  Globe, 
  Download, 
  Crown, 
  Layers
} from 'lucide-react';

export default function Header({
  onOpenTools,
  onOpenSettings,
  onOpenAbout,
  onNewChat,
  onToggleSidebar,
  userName,
  onChangeName,
  isOfficeMode = false,
  onImportToWorkplace,
  showTools = true
}) {
  return (
    <header className="h-14 border-b px-3 sm:px-5 flex items-center justify-between z-30 backdrop-blur-xl bg-[#090a0f]/95 border-white/[0.08] select-none">
      {/* Left: Sidebar Toggle & Official Brand Identity */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div 
          className="flex items-center gap-2.5 cursor-pointer group" 
          onClick={onOpenAbout} 
          title="Girionix AI • Envisioned & Built by Abhinav Giri"
        >
          <img
            src="/logo.png"
            alt="Girionix AI Logo"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-contain shadow-glow-cyan group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-sm sm:text-base tracking-wider text-white leading-tight flex items-center gap-1">
              <span>Girionix</span>
              <span className="text-cyan-400">AI</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest hidden sm:inline uppercase text-cyan-300/80">
              Think • Create • Explore
            </span>
          </div>
        </div>
      </div>

      {/* Center: When in office mode, show office bar */}
      {isOfficeMode && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500/15 via-cyan-500/15 to-purple-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Office Suite Copilot</span>
          </div>
          {onImportToWorkplace && (
            <button
              onClick={onImportToWorkplace}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer"
            >
              <span>📥 Import</span>
            </button>
          )}
        </div>
      )}

      {/* Right: + New chat, ⚙ Tools, User Profile (Matching Screenshot) */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* + New Chat Pill Button (Matching Reference Image) */}
        {onNewChat && (
          <button
            onClick={onNewChat}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-gray-200 hover:text-white border border-white/10 text-xs font-medium transition-all cursor-pointer shadow-sm active:scale-95"
            title="Start New Chat Session"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">New chat</span>
          </button>
        )}

        {/* ⚙ Tools Pill Button (Matching Reference Image) */}
        {onOpenTools && showTools && (
          <button
            onClick={onOpenTools}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-gray-200 hover:text-white border border-white/10 text-xs font-medium transition-all cursor-pointer shadow-sm active:scale-95"
            title="Open Tools & Modules"
          >
            <Wrench className="w-3.5 h-3.5 text-gray-300" />
            <span className="hidden sm:inline">Tools</span>
          </button>
        )}

        {/* User Profile / Home Button */}
        <button
          onClick={onChangeName}
          className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/10 text-xs font-medium transition-colors cursor-pointer"
          title="Personalization & Profile"
        >
          <User className="w-3.5 h-3.5 text-cyan-400" />
          <span className="max-w-[80px] truncate hidden md:inline font-mono">{userName || 'Profile'}</span>
        </button>
      </div>
    </header>
  );
}
