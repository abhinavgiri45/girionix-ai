import React from 'react';
import { 
  X, 
  Crown, 
  CheckCircle2, 
  HardDrive, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Cpu, 
  Radio, 
  Clock, 
  RefreshCw, 
  Lock, 
  ArrowRight 
} from 'lucide-react';

export default function ProAppStatusModal({ isOpen, onClose, userName = 'User' }) {
  if (!isOpen) return null;

  const getPlatformInfo = () => {
    if (typeof window === 'undefined') return { os: 'Windows 11/12', path: '%LocalAppData%\\Girionix AI\\Data' };
    const ua = navigator.userAgent || '';
    if (/android/i.test(ua)) return { os: 'Android App', path: 'Native App Internal Storage' };
    if (/iphone|ipad|ipod/i.test(ua)) return { os: 'iOS App (WebClip)', path: 'iOS App Container' };
    if (/mac/i.test(ua)) return { os: 'macOS App', path: '~/Library/Application Support/Girionix AI/Data' };
    if (/linux/i.test(ua)) return { os: 'Linux Standalone', path: '~/.local/share/girionix-ai/data' };
    return { os: 'Windows App (Desktop Pro)', path: '%LocalAppData%\\Girionix AI\\Data' };
  };

  const plat = getPlatformInfo();

  const proEngines = [
    {
      name: 'Girionix Pro (Supreme Core)',
      status: 'Active & Unlocked',
      desc: 'High-throughput reasoning, multi-turn context retention, and zero rate-limiting.'
    },
    {
      name: 'Local Machine Disk Vault',
      status: 'Active (90-Day Retention)',
      desc: `All chats and projects saved directly on disk at: ${plat.path}`
    },
    {
      name: 'VisionForge 8K & MotionLab 60fps',
      status: 'Hardware Accelerated',
      desc: 'Uncapped FLUX.1 generation, 4X upscaling, and 3D trajectory camera scripting.'
    },
    {
      name: 'Olympiad Math & React 18 IDE',
      status: 'Direct Execution',
      desc: 'Sandboxed code execution, KaTeX 3D surface mesh plotting, and benchmark profiler.'
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-fadeIn select-none"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl rounded-3xl bg-[#090B16] border border-amber-500/40 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden shadow-glow-amber"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 p-1.5 flex items-center justify-center shrink-0 shadow-glow-amber">
              <img src="/logo.png" alt="Girionix Pro" className="w-full h-full object-contain rounded-xl" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Girionix Pro App Active</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Native Mode
                </span>
              </h2>
              <p className="text-xs text-amber-300/80 font-mono">
                Running locally on {plat.os} • Think • Create • Explore
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Status Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-slate-900 border border-amber-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Supreme Pro Superpowers Unlocked</span>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                PRO ACTIVE 👑
              </span>
            </div>
            <p className="text-xs text-gray-300 font-sans">
              Welcome, <strong>{userName}</strong>. You are running the official standalone Girionix AI native application with dedicated device disk storage and maximum inference bandwidth.
            </p>
          </div>

          {/* Local Disk Storage Health */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-mono uppercase text-gray-300 font-bold">
                  💾 Local Machine Disk Vault
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                90-Day Auto-Clean Retention
              </span>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs font-mono text-gray-300 space-y-1">
              <div className="flex items-center justify-between text-gray-400 text-[11px]">
                <span>Physical Disk Location:</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Isolated & Air-Gapped
                </span>
              </div>
              <p className="text-cyan-300 break-all font-semibold select-all pt-0.5">
                {plat.path}
              </p>
            </div>
          </div>

          {/* Unlocked Engines List */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono uppercase text-gray-400 font-bold tracking-wider">
              ⚡ Active Superhuman Engines & Capabilities:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {proEngines.map((eng, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{eng.name}</span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      {eng.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-sans">{eng.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs font-mono text-gray-500">
          <span>Created by Abhinav Giri (@abhinavgiri45) • Pro Edition</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
