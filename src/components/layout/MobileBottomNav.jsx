import React from 'react';
import { 
  MessageSquare, 
  Wrench, 
  Download, 
  Crown
} from 'lucide-react';

export default function MobileBottomNav({
  onOpenTools,
  onOpenDownload,
  onOpenProStatus,
  isAppInstalled = false,
  isOfficeMode = false
}) {
  return (
    <div className="md:hidden z-40 bg-[#070914]/95 backdrop-blur-xl border-t border-white/[0.08] px-3 py-1 flex items-center justify-around select-none shrink-0 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-2xl">
      {/* 1. Chat Tab */}
      <button
        className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all cursor-pointer min-h-[44px] text-cyan-300 font-bold bg-cyan-500/10"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 text-cyan-400" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 shadow-glow-cyan" />
        </div>
        <span className="text-[11px] mt-0.5 tracking-tight">Chat</span>
      </button>

      {/* 2. Tools Hub Tab */}
      <button
        onClick={onOpenTools}
        className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all cursor-pointer min-h-[44px] text-gray-400 hover:text-white"
      >
        <Wrench className="w-5 h-5 text-gray-400" />
        <span className="text-[11px] mt-0.5 tracking-tight">Tools</span>
      </button>

      {/* 3. Get App / Pro Active Tab - Hidden in Office Mode */}
      {!isOfficeMode && (
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
      )}
    </div>
  );
}
