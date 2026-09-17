import React from 'react';
import { 
  X, 
  Sparkles, 
  Code2, 
  Sigma, 
  Image as ImageIcon, 
  Film, 
  Radio, 
  Wrench, 
  Award, 
  ExternalLink, 
  Heart, 
  CheckCircle2, 
  Layers, 
  Zap, 
  ArrowRight, 
  ShieldCheck,
  Globe 
} from 'lucide-react';

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const XTwitterIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

export default function AboutDeveloperModal({ isOpen, onClose, onOpenStudio }) {
  if (!isOpen) return null;

  const features = [
    {
      icon: <Code2 className="w-5 h-5 text-cyan-400" />,
      title: 'React 18 & App IDE Studio',
      desc: 'Sandboxed component runner, 100k-ops JS benchmark profiler, 1-click clipboard paste, auto-indent formatter, unit test generator, and 1-click Auto-Fixer.'
    },
    {
      icon: <Sigma className="w-5 h-5 text-emerald-400" />,
      title: 'Math Olympiad & 3D Lab',
      desc: 'Step-by-step rigorous proofs, 2D calculus curve plotting, 3D parametric surface mesh visualization, and KaTeX mathematical typesetting.'
    },
    {
      icon: <ImageIcon className="w-5 h-5 text-rose-400" />,
      title: '8K VisionForge Studio',
      desc: 'FLUX.1 Ultra-HD generation, 4X upscale, uncropped natural framing, and dedicated style presets for Studio Ghibli, 3D Pixar, Cyberpunk & Oil Painting.'
    },
    {
      icon: <Film className="w-5 h-5 text-amber-400" />,
      title: '60 FPS MotionLab Video Director',
      desc: 'Interactive 60 FPS cinematic video player with 3D camera trajectory paths (360° Orbit, FPV Drone Dive) and multi-shot screenplays.'
    },
    {
      icon: <Radio className="w-5 h-5 text-purple-400" />,
      title: 'Bidirectional AI Voice Engine',
      desc: 'Natural hands-free voice synthesis in English and Hindi with 16-bar animated audio equalizer spectrum and speaking speed controls.'
    },
    {
      icon: <Layers className="w-5 h-5 text-blue-400" />,
      title: 'Workspace Backup & Full Restore',
      desc: 'Complete 1-click .json export/import of all conversations, custom personas, pinned bookmarks, and custom settings across any browser.'
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl rounded-3xl bg-[#090B16] border border-cyan-500/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-glow-cyan"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Girionix AI Logo"
              className="w-10 h-10 rounded-2xl object-contain shadow-glow-cyan"
            />
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>About Girionix AI & Creator</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Official Verification
                </span>
              </h2>
              <p className="text-xs text-cyan-400/80 font-mono">
                Think • Create • Explore
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Creator Profile Spotlight */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/30 via-indigo-950/30 to-black border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center text-black font-extrabold text-xl shadow-glow-cyan flex-shrink-0">
                AG
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Abhinav Giri</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Lead Creator
                  </span>
                </div>
                <p className="text-xs text-gray-300">
                  Envisioned, designed, and architected the complete Girionix AI polymath engine.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <a
                    href="https://giri-corporation.pages.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-cyan-300 hover:underline flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-lg font-medium"
                    title="Official Giri Corporation Website"
                  >
                    <img src="/giri-corporation-logo.png" alt="Giri Corporation" className="w-3.5 h-3.5 object-contain rounded" />
                    <span>Giri Corporation</span>
                  </a>
                  <a
                    href="https://x.com/AbhinavGiri45"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-cyan-300 hover:underline flex items-center gap-1 bg-white/[0.04] px-2 py-0.5 rounded-lg"
                  >
                    <XTwitterIcon className="w-3 h-3 text-white" />
                    <span>@AbhinavGiri45</span>
                  </a>
                  <a
                    href="https://github.com/abhinavgiri45/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-cyan-300 hover:underline flex items-center gap-1 bg-white/[0.04] px-2 py-0.5 rounded-lg"
                  >
                    <GithubIcon className="w-3 h-3 text-white" />
                    <span>@abhinavgiri45</span>
                  </a>
                  <a
                    href="https://instagram.com/abhinavgiri45"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-pink-400 hover:underline flex items-center gap-1 bg-pink-500/10 px-2 py-0.5 rounded-lg"
                  >
                    <InstagramIcon className="w-3 h-3 text-pink-400" />
                    <span>@abhinavgiri45</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Girionix Core Features Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-gray-400 font-bold">
                ⚡ Girionix AI Superhuman Capabilities & Features
              </h3>
              <span className="text-[11px] font-mono text-cyan-400">6 Core Engines</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {features.map((feat, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-cyan-500/30 transition-all space-y-1.5"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                      {feat.icon}
                    </div>
                    <h4 className="text-xs font-bold text-white">{feat.title}</h4>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed pl-1">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Vision Quote Banner */}
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 flex items-center gap-3 text-xs font-mono text-cyan-200">
            <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            <span>
              "Built to empower creators, developers, and thinkers with omnipotent artificial intelligence." — <strong>Abhinav Giri</strong>
            </span>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400">
            <span>Envisioned & Engineered by Abhinav Giri</span>
            <span className="text-gray-600">•</span>
            <a
              href="https://giri-corporation.pages.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline font-medium"
            >
              <Globe className="w-3 h-3" />
              <span>Giri Corporation</span>
            </a>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold text-xs shadow-glow-cyan hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Explore Girionix Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
