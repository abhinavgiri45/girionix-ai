import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  ScrollText,
  Sigma, 
  Image as ImageIcon, 
  Clapperboard, 
  Music, 
  Cpu, 
  Sparkles, 
  Zap, 
  Crown, 
  Info, 
  X, 
  Check, 
  Sliders, 
  Activity,
  Layers,
  ChevronDown,
  Smartphone,
  Monitor,
  Key
} from 'lucide-react';
import { getDedicatedStudioModel, STUDIO_DEDICATED_MODELS } from '../../services/modelCatalog';
import { universalApiEngine } from '../../services/universalApiEngine';

export default function StudioDedicatedBar({
  activeStudioTab,
  setActiveStudioTab,
  isTitanMode = false,
  onClose,
  isAppInstalled = false,
  onOpenDownload
}) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const tabs = [
    { id: 'google-studio', label: 'Google AI Studio', icon: <Sparkles className="w-3.5 h-3.5" />, color: 'cyan' },
    { id: 'code', label: 'Dev Runner', icon: <Code2 className="w-3.5 h-3.5" />, color: 'cyan' },
    { id: 'script', label: 'Script Writer', icon: <ScrollText className="w-3.5 h-3.5" />, color: 'indigo' },
    { id: 'math', label: 'Math Lab', icon: <Sigma className="w-3.5 h-3.5" />, color: 'purple' },
    { id: 'image', label: '8K Vision', icon: <ImageIcon className="w-3.5 h-3.5" />, color: 'rose' },
    { id: 'video', label: 'MotionLab 4K/8K', icon: <Clapperboard className="w-3.5 h-3.5" />, color: 'amber' },
    { id: 'audio', label: 'AudioLab HD', icon: <Music className="w-3.5 h-3.5" />, color: 'emerald' }
  ];

  const currentDedicatedModel = getDedicatedStudioModel(activeStudioTab, isTitanMode);

  return (
    <div className="bg-[#070915] border-b border-white/[0.08] flex flex-col select-none relative z-20">
      {/* Primary Navigation & Dedicated AI Model Bar */}
      <div className="px-3 py-1.5 flex items-center justify-between gap-2.5 flex-wrap bg-gradient-to-r from-[#070915] via-[#0B0F22] to-[#070915]">
        {/* Left: Studio Domain Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar touch-scroll max-w-full">
          {tabs.map((tab) => {
            const isActive = activeStudioTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveStudioTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? tab.id === 'google-studio' ? 'bg-gradient-to-r from-blue-500/25 via-cyan-500/25 to-purple-500/25 text-cyan-200 border border-cyan-400/50 shadow-glow-cyan font-bold scale-[1.02]'
                    : tab.id === 'code' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan font-bold scale-[1.02]'
                    : tab.id === 'script' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-glow-cyan font-bold scale-[1.02]'
                    : tab.id === 'math' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-glow-purple font-bold scale-[1.02]'
                    : tab.id === 'image' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-glow-rose font-bold scale-[1.02]'
                    : tab.id === 'video' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-amber font-bold scale-[1.02]'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-emerald font-bold scale-[1.02]'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Dedicated AI Model Indicator Badge & App Status */}
        <div className="flex items-center gap-2">
          {!isAppInstalled && onOpenDownload && (
            <button
              onClick={onOpenDownload}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 text-[11px] font-mono transition-all"
              title="Open full studio inside native desktop / mobile app"
            >
              <Smartphone className="w-3 h-3 text-cyan-400" />
              <span>Native App</span>
            </button>
          )}

          {/* Dynamic API Provider & Key Indicator */}
          <div 
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[11px] font-mono text-gray-300 cursor-pointer transition-all hover:scale-105"
            title="Active AI Provider & API Key Routing"
          >
            <Key className="w-3 h-3 text-cyan-400" />
            <span className="text-cyan-300 font-bold">
              {universalApiEngine.getProviderConfig().apiKey ? 'API Connected' : 'Free Neural Gateway'}
            </span>
          </div>

          <div 
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            className={`px-2.5 py-1 rounded-xl border flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] ${
              isTitanMode
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 shadow-glow-emerald'
                : 'bg-black/50 border-cyan-500/30 text-cyan-300'
            }`}
            title="Click to view dedicated model architecture & benchmarks"
          >
            <div className="flex items-center gap-1.5">
              {isTitanMode ? (
                <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              )}
              <div className="flex flex-col text-left leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] uppercase font-mono text-gray-400 font-bold hidden sm:inline">Engine:</span>
                  <span className="text-xs font-bold text-white tracking-wide truncate max-w-[150px] sm:max-w-[200px]">
                    {currentDedicatedModel.activeEngineName || currentDedicatedModel.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-gray-400">
                  <span className={isTitanMode ? 'text-emerald-400' : 'text-cyan-400'}>
                    {currentDedicatedModel.speed}
                  </span>
                </div>
              </div>
            </div>
            <Info className="w-3 h-3 text-gray-400 hover:text-white shrink-0" />
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close Split View"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown / Details Popover when user clicks on the dedicated model badge */}
      {isDetailsOpen && (
        <div className="p-4 bg-[#060813] border-t border-white/10 text-xs font-mono space-y-3 animate-fadeIn shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Cpu className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-bold text-white text-sm">{currentDedicatedModel.name}</h4>
                <p className="text-[10px] text-gray-400 font-sans">{currentDedicatedModel.workDomain}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsDetailsOpen(false)}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
            <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-1">
              <span className="text-gray-500 text-[10px] block">ENGINE BACKEND:</span>
              <div className="font-bold text-cyan-300">{currentDedicatedModel.hardwareProvider}</div>
              <span className="text-[10px] text-emerald-400 block">
                {isTitanMode ? '100% Offline Air-Gapped' : 'Ultra-Fast Cloud Acceleration'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-1">
              <span className="text-gray-500 text-[10px] block">BENCHMARK SCORE:</span>
              <div className="font-bold text-white">{currentDedicatedModel.benchmark}</div>
              <span className="text-[10px] text-gray-400 block">
                Context: {currentDedicatedModel.contextWindow?.toLocaleString()} Tokens
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-1">
              <span className="text-gray-500 text-[10px] block">SUPPORTED DIALECTS:</span>
              <div className="text-gray-300 text-[10px] truncate">
                {currentDedicatedModel.languages?.join(', ')}
              </div>
              <span className="text-[10px] text-purple-300 block">Real-time Reactive Tuning</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-wrap items-center gap-2">
            <span className="text-gray-400 text-[10px] uppercase font-bold">Specialized Capabilities:</span>
            {currentDedicatedModel.capabilities?.map((cap, i) => (
              <span key={i} className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 text-[10px] border border-cyan-500/20">
                ✓ {cap}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
