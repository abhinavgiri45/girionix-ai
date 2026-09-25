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
  Award, 
  Crown, 
  X, 
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
  onOpenWhySwitch,
  isOfficeMode = false,
  onLaunchOrbitStation
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
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={onCreateNewSession}
            className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-blue-500 text-white font-bold shadow-glow-cyan hover:scale-105 transition-all cursor-pointer"
            title="New Session"
          >
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-2">
          {onLaunchOrbitStation && (
            <button
              onClick={onLaunchOrbitStation}
              className="p-2.5 rounded-xl text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-colors cursor-pointer"
              title="Giri Orbit Dedicated AI Station"
            >
              <span className="text-sm">🌐</span>
            </button>
          )}

          <a
            href="https://giri-corporation.pages.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-colors flex items-center justify-center cursor-pointer"
            title="Official Giri Corporation Website"
          >
            <img src="/giri-corporation-logo.png" alt="Giri Corporation" className="w-5 h-5 object-contain rounded" />
          </a>

          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Settings"
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

      <aside className="fixed md:relative inset-y-0 left-0 w-72 sm:w-64 h-full border-r border-white/[0.06] bg-[#07080f] p-3 flex flex-col justify-between z-50 select-none shadow-2xl animate-slideRight md:animate-none">
        <div className="flex flex-col h-full overflow-hidden space-y-3">
          
          {/* Top Big Gradient Button (Matching GranthMind Screenshot) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleMobileNewChat}
              className="flex-1 py-3 px-3.5 rounded-2xl bg-gradient-to-r from-[#4d82f3] via-[#7b61ff] to-[#38bdf8] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 group active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300 group-hover:rotate-12 transition-transform shrink-0" />
              <span className="truncate">New Girionix Session</span>
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

          {/* Search bar */}
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

          {/* Section: RECENT CHATS (45 DAYS) with Clear (Matching Screenshot) */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
              <span>RECENT CHATS (45 DAYS)</span>
              {sessions.length > 0 && onClearAllSessions && (
                <button
                  onClick={onClearAllSessions}
                  className="text-rose-400 hover:text-rose-300 font-bold transition-colors cursor-pointer capitalize"
                  title="Clear all sessions"
                >
                  Clear
                </button>
              )}
            </div>

            {/* List of sessions */}
            <div className="space-y-1">
              {filteredSessions.map((s) => {
                const isActive = s.id === activeSessionId;
                return (
                  <div
                    key={s.id}
                    onClick={() => handleMobileSessionSelect(s.id)}
                    className={`w-full group flex items-center justify-between p-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#18132b] text-purple-200 font-medium border border-purple-500/50 shadow-sm'
                        : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-purple-400' : 'text-gray-500'}`} />
                      <span className="truncate">{s.title || 'New Session'}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(s.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-rose-400 transition-opacity cursor-pointer"
                      title="Delete Session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer: Matching Screenshot with Lock icon */}
        <div className="pt-2 border-t border-white/[0.06] space-y-2">


          <a
            href="https://giri-corporation.pages.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] flex items-center justify-between text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <img src="/giri-corporation-logo.png" alt="Giri Corporation" className="w-4 h-4 object-contain rounded" />
              <span className="text-xs text-gray-300 group-hover:text-white">Giri Corporation</span>
            </div>
            <ExternalLink className="w-3 h-3 text-gray-500" />
          </a>

          {/* Privacy Disclaimer (Matching Screenshot) */}
          <div className="flex items-center gap-2 text-[10px] text-gray-400 px-1 pt-1">
            <Lock className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
            <span>Chats stored in browser • Auto-cleaned after 45 days</span>
          </div>
        </div>
      </aside>
    </>
  );
}
