import React, { useState } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Settings, 
  ChevronRight, 
  Sparkles, 
  Lock, 
  Search, 
  FolderArchive,
  Award,
  Download,
  Crown,
  X,
  Globe,
  ExternalLink
} from 'lucide-react';

export default function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onCreateNewSession,
  onDeleteSession,
  onClearAllSessions,
  isCollapsed,
  setIsCollapsed,
  onOpenSettings,
  onOpenAbout,
  onOpenDownload,
  onOpenProStatus,
  isAppInstalled,
  onOpenWhySwitch
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = sessions.filter(s => 
    (s.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isCollapsed) {
    return (
      <aside className="hidden md:flex w-16 h-full border-r border-white/[0.08] bg-[#07080E] flex-col items-center py-4 justify-between z-30 select-none">
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={onCreateNewSession}
            className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-rose-500 text-black font-bold shadow-glow-cyan hover:scale-105 transition-all"
            title="New Chat"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-2">
          {onOpenDownload && (
            isAppInstalled ? (
              <button
                onClick={onOpenDownload}
                className="p-2.5 rounded-xl text-amber-400 hover:text-white hover:bg-amber-500/20 transition-colors"
                title="Pro App Active"
              >
                <Crown className="w-5 h-5 animate-pulse" />
              </button>
            ) : (
              <button
                onClick={onOpenDownload}
                className="p-2.5 rounded-xl text-emerald-400 hover:text-white hover:bg-emerald-500/20 transition-colors"
                title="Download Apps (Android/Win/iOS/Mac)"
              >
                <Download className="w-5 h-5" />
              </button>
            )
          )}

          {onOpenWhySwitch && (
            <button
              onClick={onOpenWhySwitch}
              className="p-2.5 rounded-xl text-amber-400 hover:text-white hover:bg-purple-500/20 transition-colors"
              title="Why Switch to Girionix AI? (Model Benchmarks)"
            >
              <Crown className="w-5 h-5" />
            </button>
          )}

          {onOpenAbout && (
            <button
              onClick={onOpenAbout}
              className="p-2.5 rounded-xl text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-colors"
              title="Introducing Girionix AI & Creator Abhinav Giri"
            >
              <Award className="w-5 h-5" />
            </button>
          )}

          <a
            href="https://giri-corporation.pages.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-colors flex items-center justify-center"
            title="Official Giri Corporation Website (giri-corporation.pages.dev)"
          >
            <Globe className="w-5 h-5" />
          </a>

          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Tools & Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </aside>
    );
  }

  const handleMobileSessionSelect = (id) => {
    onSelectSession(id);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  };

  const handleMobileNewChat = () => {
    onCreateNewSession();
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
        onClick={() => setIsCollapsed(true)}
      />

      <aside className="fixed md:relative inset-y-0 left-0 w-72 sm:w-64 h-full border-r border-white/[0.06] bg-[#06080F] p-3 flex flex-col justify-between z-50 select-none shadow-2xl animate-slideRight md:animate-none">
        <div className="flex flex-col h-full overflow-hidden space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleMobileNewChat}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/[0.05] hover:bg-cyan-500/15 text-white hover:text-cyan-300 font-semibold text-xs border border-white/[0.08] hover:border-cyan-500/30 transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>New Chat</span>
            </button>

            <button
              onClick={() => setIsCollapsed(true)}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
              title="Collapse Sidebar"
            >
              <X className="w-4 h-4 md:hidden" />
              <ChevronRight className="w-4 h-4 hidden md:block rotate-180" />
            </button>
          </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500/30 transition-all font-mono"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          <div className="flex items-center justify-between text-[11px] font-mono text-gray-500 uppercase px-2 py-1">
            <span>Recent Chats</span>
            {sessions.length > 1 && onClearAllSessions && (
              <button
                onClick={onClearAllSessions}
                className="text-gray-500 hover:text-rose-400 transition-colors text-[10px] lowercase"
              >
                clear
              </button>
            )}
          </div>

          <div className="space-y-1">
            {filteredSessions.map((s) => {
              const isActive = s.id === activeSessionId;
              return (
                <div
                  key={s.id}
                  onClick={() => handleMobileSessionSelect(s.id)}
                  className={`w-full group flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-300 font-medium border border-cyan-500/30'
                      : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-gray-500'}`} />
                    <span className="truncate">{s.title || 'New Chat'}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(s.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-rose-400 transition-opacity cursor-pointer"
                    title="Delete Chat"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
        {isAppInstalled ? (
          <button
            onClick={onOpenProStatus || onOpenDownload}
            className="w-full p-2 rounded-xl bg-amber-950/20 hover:bg-amber-950/40 border border-amber-500/20 hover:border-amber-500/40 flex items-center justify-between text-left transition-all group cursor-pointer"
            title="Native App Active • Pro Superpowers Unlocked"
          >
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white group-hover:text-amber-300">Pro Active</span>
                <span className="text-[10px] font-mono text-amber-400/80">Local Vault Unlocked</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-amber-300 transition-transform" />
          </button>
        ) : (
          onOpenDownload && (
            <button
              onClick={onOpenDownload}
              className="w-full p-2 rounded-xl bg-white/[0.02] hover:bg-emerald-950/30 border border-white/[0.06] hover:border-emerald-500/30 flex items-center justify-between text-left transition-all group cursor-pointer"
              title="Download Android, Windows, iOS, Mac, Linux Apps"
            >
              <div className="flex items-center gap-2">
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-200 group-hover:text-emerald-300">Get Girionix App</span>
                  <span className="text-[10px] font-mono text-gray-500">Android • Win • Mac • iOS</span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-emerald-300 transition-transform" />
            </button>
          )
        )}

        {onOpenWhySwitch && (
          <button
            onClick={onOpenWhySwitch}
            className="w-full p-2 rounded-xl bg-purple-950/20 hover:bg-purple-950/40 border border-purple-500/20 hover:border-purple-500/40 flex items-center justify-between text-left transition-all group cursor-pointer"
            title="Why Switch to Girionix AI • Model Benchmarks & Comparison"
          >
            <div className="flex items-center gap-2">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white group-hover:text-amber-300">Why Switch to Girionix?</span>
                <span className="text-[10px] font-mono text-purple-300/80">Benchmarks vs ChatGPT & Claude</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-amber-300 transition-transform" />
          </button>
        )}

        {onOpenAbout && (
          <button
            onClick={onOpenAbout}
            className="w-full p-2 rounded-xl bg-white/[0.02] hover:bg-cyan-950/30 border border-white/[0.06] hover:border-cyan-500/30 flex items-center justify-between text-left transition-all group cursor-pointer"
            title="Open Introducing Girionix AI & Creator Profile"
          >
            <div className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-200 group-hover:text-cyan-300">About Girionix AI</span>
                <span className="text-[10px] font-mono text-gray-500">Creator: Abhinav Giri</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-cyan-300 transition-transform" />
          </button>
        )}

        <a
          href="https://giri-corporation.pages.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full p-2 rounded-xl bg-gradient-to-r from-blue-950/25 via-cyan-950/25 to-purple-950/25 hover:from-blue-950/45 hover:via-cyan-950/45 hover:to-purple-950/45 border border-cyan-500/25 hover:border-cyan-500/50 flex items-center justify-between text-left transition-all group cursor-pointer shadow-sm"
          title="Official Giri Corporation Website (giri-corporation.pages.dev)"
        >
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-200 group-hover:text-cyan-300">Giri Corporation</span>
              <span className="text-[10px] font-mono text-cyan-400/70">Parent Organization ↗</span>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-cyan-300 transition-colors" />
        </a>

        <div className="text-[10px] text-gray-500 font-mono flex items-center gap-1.5 leading-tight px-1 pt-0.5">
          <Lock className="w-3 h-3 text-gray-500 flex-shrink-0" />
          <span>{isAppInstalled ? 'Local Vault • 90-day retention' : 'Auto-sync active • 45-day retention'}</span>
        </div>
      </div>
    </aside>
    </>
  );
}
