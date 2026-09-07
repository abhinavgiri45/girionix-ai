import React from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  Wrench, 
  Download, 
  Crown,
  Cpu
} from 'lucide-react';

export default function MobileBottomNav({
  layoutMode,
  setLayoutMode,
  mobileActivePane,
  setMobileActivePane,
  onOpenTools,
  onOpenDownload,
  onOpenProStatus,
  isAppInstalled = false,
  isTitanMode = false
}) {
  const isChatActive = layoutMode === 'chat' || (layoutMode === 'split' && mobileActivePane === 'chat');
  const isStudioActive = layoutMode === 'studio' || (layoutMode === 'split' && mobileActivePane === 'studio');

  const handleSelectChat = () => {
    setLayoutMode('chat');
    if (setMobileActivePane) setMobileActivePane('chat');
  };

  const handleSelectStudio = () => {
    setLayoutMode('studio');
    if (setMobileActivePane) setMobileActivePane('studio');
  };

  return (
    <div className="md:hidden z-40 bg-[#070914]/95 backdrop-blur-xl border-t border-white/[0.08] px-2 py-1 flex items-center justify-around select-none shrink-0 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl">
      {/* 1. Chat Tab */}
      <button
        onClick={handleSelectChat}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all cursor-pointer min-h-[44px] ${
          isChatActive
            ? isTitanMode 
              ? 'text-emerald-300 font-bold bg-emerald-500/10' 
              : 'text-cyan-300 font-bold bg-cyan-500/10'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <div className="relative">
          <MessageSquare className={`w-5 h-5 ${isChatActive ? (isTitanMode ? 'text-emerald-400' : 'text-cyan-400') : 'text-gray-400'}`} />
          {isChatActive && (
            <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${isTitanMode ? 'bg-emerald-400 shadow-glow-emerald' : 'bg-cyan-400 shadow-glow-cyan'}`} />
          )}
        </div>
        <span className="text-[11px] mt-0.5 tracking-tight">Chat</span>
      </button>

      {/* 2. AI Studio Tab */}
      <button
        onClick={handleSelectStudio}
        className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all cursor-pointer min-h-[44px] ${
          isStudioActive
            ? isTitanMode 
              ? 'text-emerald-300 font-bold bg-emerald-500/10' 
              : 'text-purple-300 font-bold bg-purple-500/10'
            : 'text-gray-400 hover:text-white'
        }`}
      >
        <div className="relative">
          <Sparkles className={`w-5 h-5 ${isStudioActive ? (isTitanMode ? 'text-emerald-400' : 'text-purple-400') : 'text-gray-400'}`} />
          {isStudioActive && (
            <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${isTitanMode ? 'bg-emerald-400 shadow-glow-emerald' : 'bg-purple-400 shadow-glow-purple'}`} />
          )}
        </div>
        <span className="text-[11px] mt-0.5 tracking-tight">AI Studio</span>
      </button>

      {/* 3. Tools Hub Tab */}
      <button
        onClick={onOpenTools}
        className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all cursor-pointer min-h-[44px] text-gray-400 hover:text-white"
      >
        <Wrench className="w-5 h-5 text-gray-400" />
        <span className="text-[11px] mt-0.5 tracking-tight">Tools</span>
      </button>

      {/* 4. Get App / Pro Active Tab */}
      <button
        onClick={isAppInstalled ? (onOpenProStatus || onOpenDownload) : onOpenDownload}
        className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all cursor-pointer min-h-[44px] text-gray-400 hover:text-white"
      >
        {isAppInstalled ? (
          <>
            <Crown className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className="text-[11px] mt-0.5 text-amber-300 font-semibold tracking-tight">Pro Active</span>
          </>
        ) : (
          <>
            <Download className="w-5 h-5 text-emerald-400" />
            <span className="text-[11px] mt-0.5 text-emerald-300 font-semibold tracking-tight">Get App</span>
          </>
        )}
      </button>
    </div>
  );
}
