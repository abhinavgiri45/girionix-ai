const fs = require('fs');

const code = \import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ChevronRight, 
  Sparkles, 
  Code2, 
  Sigma, 
  Image as ImageIcon, 
  Film, 
  Music, 
  ScrollText, 
  Award, 
  ShieldCheck, 
  Download, 
  Smartphone, 
  Monitor, 
  Lock, 
  HardDrive, 
  Zap, 
  Crown, 
  Cpu, 
  X, 
  CheckCircle2, 
  Globe, 
  Flame, 
  Check, 
  Laptop, 
  Terminal, 
  Volume2, 
  ArrowRight, 
  ExternalLink 
} from 'lucide-react';
import KatexMath from './KatexMath';

const XTwitterIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'/>
  </svg>
);

const GithubIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
    <path fillRule='evenodd' clipRule='evenodd' d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'/>
  </svg>
);

export default function IntroducingGirionixPage({ isOpen, onClose, onLaunchApp, onOpenDownload, initialTab = 'overview' }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'overview');
  const [activeStudio, setActiveStudio] = useState('code');
  const [openFaq, setOpenFaq] = useState(0);

  if (!isOpen) return null;

  const handleStartChat = (studio = null) => {
    if (onLaunchApp) onLaunchApp(studio);
    else if (onClose) onClose();
  };

  const platforms = [
    { name: 'Windows 10 / 11 / 12', icon: <Monitor className='w-5 h-5 text-cyan-400' />, badge: 'Portable ZIP & Setup (.exe)', size: '5.66 MB' },
    { name: 'Android 8.0 to 16+', icon: <Smartphone className='w-5 h-5 text-emerald-400' />, badge: 'Standalone Package (.apk)', size: '5.01 MB' },
    { name: 'macOS (M1-M4 & Intel)', icon: <Laptop className='w-5 h-5 text-rose-400' />, badge: 'Universal Bundle (.dmg)', size: '715 KB' },
    { name: 'Linux (Ubuntu, Arch, Fedora)', icon: <Terminal className='w-5 h-5 text-amber-400' />, badge: 'Standalone (.AppImage & .sh)', size: '1.2 MB' }
  ];

  const comparisons = [
    { feature: 'Universal Multi-Studio (Code, Screenplay, Math, 8K Art, 4K Video, Audio)', girionix: '✅ 6 Native Integrated Studios', others: '❌ Fragmented separate subscriptions (\+/mo)' },
    { feature: 'Live React 18 AST Sandboxing & 1-Click Code Copy', girionix: '✅ Instant In-Memory Live Execution', others: '⚠️ Static text only or slow sandboxes' },
    { feature: 'Screenplay Exporter (.PDF, .DOCX, .DOC, .TXT, .Fountain)', girionix: '✅ 100% Free Hollywood formatting', others: '❌ Paid third-party plugins only' },
    { feature: 'Olympiad Math Proofs & 3D Interactive Mesh Plotter', girionix: '✅ KaTeX step-by-step + 3D Orbit Mesh', others: '⚠️ Basic plain-text arithmetic' },
    { feature: 'Titan 100% On-Device Offline Intelligence', girionix: '✅ 0KB Network Traffic / 100% Air-Gapped', others: '❌ 100% Cloud required / Data logged' },
    { feature: 'Cost & Mandatory Subscriptions', girionix: '✅ 100% Free & Open Access', others: '❌ \ to \/month recurring fees' }
  ];

  const faqs = [
    { q: 'What is Girionix AI?', a: 'Girionix AI is an omnipotent sovereign AI workspace that unifies React 18 code compilation, screenplay writing, Olympiad mathematics proofs, 8K photorealistic art, 4K video direction, and 100% on-device Titan physical compute into one private interface.' },
    { q: 'Who created Girionix AI?', a: 'Girionix AI was envisioned, architected, and engineered by Abhinav Giri (@abhinavgiri45) from Bharat / India.' },
    { q: 'Is Girionix AI free to use?', a: 'Yes, Girionix AI is 100% free with zero required logins, zero ad tracking, and client-side private storage.' },
    { q: 'What is Girionix Titan Edition?', a: 'Titan Edition is a 100% offline air-gapped environment that executes AI inference directly on your physical computer cores, RAM, and GPU shaders with zero internet network traffic.' }
  ];

  return (
    <div className='fixed inset-0 z-[9999] bg-[#07080E] text-white overflow-y-auto font-sans select-none antialiased'>
      {/* Top Sticky Navigation Bar */}
      <nav className='h-16 px-4 sm:px-8 flex items-center justify-between border-b border-white/10 bg-[#07080E]/90 sticky top-0 z-50 backdrop-blur-xl'>
        <div className='flex items-center gap-3 cursor-pointer' onClick={() => handleStartChat()}>
          <img src='/logo.png' alt='Girionix AI Logo' className='w-8 h-8 rounded-xl object-contain shadow-glow-cyan' />
          <div className='flex flex-col'>
            <span className='font-extrabold text-base tracking-wider text-white'>
              GIRIONIX <span className='text-cyan-400'>AI</span>
            </span>
            <span className='text-[9px] font-mono text-cyan-300 tracking-widest uppercase'>Think • Create • Explore</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className='hidden sm:flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono'>
          <button
            onClick={() => setActiveTab('overview')}
            className={\px-3 py-1.5 rounded-xl transition-all \\}
          >
            Overview & Studios
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={\px-3 py-1.5 rounded-xl transition-all \\}
          >
            Why Switch?
          </button>
          <button
            onClick={() => setActiveTab('downloads')}
            className={\px-3 py-1.5 rounded-xl transition-all \\}
          >
            📦 Standalone Apps
          </button>
        </div>

        {/* Action Button */}
        <div className='flex items-center gap-3'>
          <button
            onClick={() => handleStartChat()}
            className='px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-purple-500 to-rose-500 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-glow-cyan hover:opacity-90 transition-all cursor-pointer'
          >
            <span>Launch Chat</span>
            <ArrowRight className='w-4 h-4' />
          </button>
        </div>
      </nav>

      {/* Main Content Body */}
      <main className='max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-16'>
        {/* HERO SECTION */}
        <section className='text-center space-y-6 pt-4'>
          <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono'>
            <Sparkles className='w-3.5 h-3.5' />
            <span>Sovereign Omnipotent AI Workspace • Envisioned by Abhinav Giri</span>
          </div>

          <h1 className='text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight'>
            Think • Create • Explore with <span className='bg-gradient-to-r from-cyan-400 via-purple-400 to-rose-400 bg-clip-text text-transparent'>Girionix AI</span>
          </h1>

          <p className='text-sm sm:text-base text-gray-300 max-w-2xl mx-auto font-sans leading-relaxed'>
            The omnipotent multi-studio workspace unifying React 18 live code compilation, Hollywood screenplay formatting, Olympiad mathematics, 8K optical vision, 4K cinema direction, and 100% on-device Titan physical compute.
          </p>

          <div className='flex flex-wrap items-center justify-center gap-3 pt-2'>
            <button
              onClick={() => handleStartChat()}
              className='px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-black font-black text-sm flex items-center gap-2 shadow-glow-cyan hover:scale-105 transition-all cursor-pointer'
            >
              <span>Launch Superhuman Workspace</span>
              <ArrowRight className='w-4 h-4' />
            </button>

            <button
              onClick={() => {
                if (onOpenDownload) onOpenDownload();
                else setActiveTab('downloads');
              }}
              className='px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/15 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer'
            >
              <Download className='w-4 h-4 text-cyan-400' />
              <span>Download Standalone Apps</span>
            </button>
          </div>
        </section>

        {/* 6 NATIVE AI STUDIOS SHOWCASE */}
        <section className='space-y-6'>
          <div className='text-center space-y-2'>
            <h2 className='text-2xl sm:text-3xl font-extrabold text-white'>6 Sovereign AI Studios in One Unified Interface</h2>
            <p className='text-xs sm:text-sm text-gray-400 font-mono'>Switch seamlessly between studios directly inside the chat workspace</p>
          </div>

          {/* Studio Selector Tabs */}
          <div className='flex flex-wrap items-center justify-center gap-2'>
            {[
              { id: 'code', label: '💻 Code IDE' },
              { id: 'script', label: '✍️ Script Writer' },
              { id: 'math', label: '📐 Olympiad Math' },
              { id: 'image', label: '🎨 8K VisionForge' },
              { id: 'video', label: '🎬 CineMotion' },
              { id: 'audio', label: '🎙️ AudioCraft' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveStudio(tab.id)}
                className={\px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer \\}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Studio Details Card */}
          <div className='p-6 sm:p-8 rounded-3xl bg-[#090C1A] border border-cyan-500/30 space-y-6 shadow-2xl'>
            {activeStudio === 'code' && (
              <div className='space-y-4'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4'>
                  <div>
                    <h3 className='text-lg font-bold text-white flex items-center gap-2'>
                      <span>CodeMaster Ultra (React 18 & Live Sandbox)</span>
                      <span className='px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono'>98.4% HumanEval</span>
                    </h3>
                    <p className='text-xs text-gray-400 font-mono'>Real-time in-memory Babel transpilation, error boundary recovery, and 1-click code copying.</p>
                  </div>
                  <button
                    onClick={() => handleStartChat('code')}
                    className='px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs flex items-center gap-1.5 shadow-glow-cyan cursor-pointer'
                  >
                    <span>Open in Code Studio</span>
                    <ArrowUpRight className='w-3.5 h-3.5' />
                  </button>
                </div>
                <div className='p-4 rounded-2xl bg-[#050711] border border-white/10 font-mono text-xs text-cyan-200 overflow-x-auto'>
                  <pre>{\// Real-time React 18 Component
export default function NeuralPulseSphere() {
  return (
    <div className=\"p-6 bg-[#04060C] rounded-2xl border border-cyan-500/30 text-center\">
      <span className=\"text-cyan-300 font-bold font-mono\">⚡ 60 FPS AST Hardware Renderer</span>
    </div>
  );
}\}</pre>
                </div>
              </div>
            )}

            {activeStudio === 'script' && (
              <div className='space-y-4'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4'>
                  <div>
                    <h3 className='text-lg font-bold text-white flex items-center gap-2'>
                      <span>ScriptMaster Cinema (Screenplay & Exporter)</span>
                      <span className='px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono'>PDF • DOCX • DOC • Fountain</span>
                    </h3>
                    <p className='text-xs text-gray-400 font-mono'>Industry-standard Hollywood screenplay formatting, teleprompter, and multi-format document exporter.</p>
                  </div>
                  <button
                    onClick={() => handleStartChat('script')}
                    className='px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer'
                  >
                    <span>Open in Script Studio</span>
                    <ArrowUpRight className='w-3.5 h-3.5' />
                  </button>
                </div>
                <div className='p-4 rounded-2xl bg-[#07091A] border border-white/10 font-mono text-xs text-gray-200 space-y-2'>
                  <div className='text-cyan-300 font-bold'>INT. QUANTUM LAB - MIDNIGHT</div>
                  <p className='text-gray-300'>Rain hammers against reinforced panoramic glass. Neon reflections shimmer across terminal screens.</p>
                  <div className='text-amber-300 font-bold text-center'>KAI</div>
                  <p className='text-center text-gray-200'>Initiate extraction sequence. We have less than forty seconds.</p>
                </div>
              </div>
            )}

            {activeStudio === 'math' && (
              <div className='space-y-4'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4'>
                  <div>
                    <h3 className='text-lg font-bold text-white flex items-center gap-2'>
                      <span>Math-X Olympiad (KaTeX & 3D Plotter)</span>
                      <span className='px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono'>96.8% MATH Gold</span>
                    </h3>
                    <p className='text-xs text-gray-400 font-mono'>Formal step-by-step mathematical proofs, LaTeX equations, and 3D complex parametric surface plotting.</p>
                  </div>
                  <button
                    onClick={() => handleStartChat('math')}
                    className='px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer'
                  >
                    <span>Open in Math Lab</span>
                    <ArrowUpRight className='w-3.5 h-3.5' />
                  </button>
                </div>
                <div className='p-5 rounded-2xl bg-[#080718] border border-purple-500/30 text-center space-y-2'>
                  <div className='text-lg font-mono text-purple-300 font-bold'>ζ(s) = 2^s · π^(s-1) · sin(πs/2) · Γ(1-s) · ζ(1-s)</div>
                  <span className='text-xs text-gray-400 font-mono'>Formal Riemann Zeta Analytical Continuation</span>
                </div>
              </div>
            )}

            {activeStudio === 'image' && (
              <div className='space-y-4'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4'>
                  <div>
                    <h3 className='text-lg font-bold text-white flex items-center gap-2'>
                      <span>VisionForge 8K Pro (FLUX.1 Cinema Ultra)</span>
                      <span className='px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono'>8K Optical Engine</span>
                    </h3>
                    <p className='text-xs text-gray-400 font-mono'>8K photorealism, volumetric lighting, 8 aesthetic styles, and prompt refinement engine.</p>
                  </div>
                  <button
                    onClick={() => handleStartChat('image')}
                    className='px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer'
                  >
                    <span>Create in 8K VisionForge</span>
                    <ArrowUpRight className='w-3.5 h-3.5' />
                  </button>
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                  <div className='p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1 text-center'>
                    <span className='text-xs font-bold text-cyan-300'>Cyberpunk Neo-Tokyo</span>
                    <span className='text-[10px] text-gray-400 font-mono block'>8K HDR • Volumetric Neon</span>
                  </div>
                  <div className='p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1 text-center'>
                    <span className='text-xs font-bold text-amber-300'>Himalayan Golden Dawn</span>
                    <span className='text-[10px] text-gray-400 font-mono block'>Arri Alexa 85mm • Natural Light</span>
                  </div>
                  <div className='p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1 text-center'>
                    <span className='text-xs font-bold text-purple-300'>Quantum Neural Core</span>
                    <span className='text-[10px] text-gray-400 font-mono block'>Unreal Engine 5.4 • Sub-Pixel</span>
                  </div>
                </div>
              </div>
            )}

            {activeStudio === 'video' && (
              <div className='space-y-4'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4'>
                  <div>
                    <h3 className='text-lg font-bold text-white flex items-center gap-2'>
                      <span>CineMotion 4K/8K (60/120 FPS Fluid Engine)</span>
                      <span className='px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono'>120 FPS Storyboard</span>
                    </h3>
                    <p className='text-xs text-gray-400 font-mono'>Multi-shot continuous scene generation, 3D camera physics, and lossless WebM recording.</p>
                  </div>
                  <button
                    onClick={() => handleStartChat('video')}
                    className='px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer'
                  >
                    <span>Direct in MotionLab</span>
                    <ArrowUpRight className='w-3.5 h-3.5' />
                  </button>
                </div>
                <div className='p-4 rounded-2xl bg-black/50 border border-amber-500/30 text-xs font-mono text-amber-200'>
                  🎬 Shot 1: Wide Pan → Shot 2: Action Dolly Zoom → Shot 3: Cinematic Finale
                </div>
              </div>
            )}

            {activeStudio === 'audio' && (
              <div className='space-y-4'>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4'>
                  <div>
                    <h3 className='text-lg font-bold text-white flex items-center gap-2'>
                      <span>AudioCraft & NeuralVoice HD (48kHz Lossless)</span>
                      <span className='px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-mono'>48kHz Stereo</span>
                    </h3>
                    <p className='text-xs text-gray-400 font-mono'>Bilingual voiceover (English & Hindi), multi-stem track synthesizer, and Foley sound generator.</p>
                  </div>
                  <button
                    onClick={() => handleStartChat('audio')}
                    className='px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer'
                  >
                    <span>Compose in AudioLab</span>
                    <ArrowUpRight className='w-3.5 h-3.5' />
                  </button>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono'>
                  <div className='p-2.5 rounded-xl bg-white/5 border border-white/10 text-teal-300'>🎻 Hollywood Score</div>
                  <div className='p-2.5 rounded-xl bg-white/5 border border-white/10 text-purple-300'>⚡ Cyberpunk Synth</div>
                  <div className='p-2.5 rounded-xl bg-white/5 border border-white/10 text-emerald-300'>🗣️ Bilingual Voice</div>
                  <div className='p-2.5 rounded-xl bg-white/5 border border-white/10 text-amber-300'>💥 Foley Sound FX</div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* WHY SWITCH TO GIRIONIX AI? (BENCHMARKS) */}
        <section className='space-y-6'>
          <div className='text-center space-y-2'>
            <h2 className='text-2xl sm:text-3xl font-extrabold text-white'>Why Switch to Girionix AI?</h2>
            <p className='text-xs sm:text-sm text-gray-400 font-mono'>Direct capability comparison against proprietary walled gardens</p>
          </div>

          <div className='overflow-x-auto rounded-3xl border border-white/10 bg-[#090B15] shadow-2xl'>
            <table className='w-full text-left text-xs font-sans border-collapse'>
              <thead>
                <tr className='border-b border-white/10 bg-white/[0.03] text-gray-400 font-mono uppercase text-[11px]'>
                  <th className='p-4'>Feature / Capability</th>
                  <th className='p-4 text-cyan-300 font-bold'>Girionix AI Sovereign</th>
                  <th className='p-4 text-gray-400'>Standard Cloud LLMs</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-white/5'>
                {comparisons.map((c, i) => (
                  <tr key={i} className='hover:bg-white/[0.02] transition-colors'>
                    <td className='p-4 font-semibold text-gray-200'>{c.feature}</td>
                    <td className='p-4 font-bold text-emerald-300 font-mono'>{c.girionix}</td>
                    <td className='p-4 text-gray-400 font-mono'>{c.others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* DOWNLOAD STANDALONE APPS SECTION */}
        <section className='space-y-6'>
          <div className='text-center space-y-2'>
            <h2 className='text-2xl sm:text-3xl font-extrabold text-white'>Download Girionix AI for Every Device</h2>
            <p className='text-xs sm:text-sm text-gray-400 font-mono'>100% standalone native packages for Windows, Android, Mac, and Linux</p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {platforms.map((p, i) => (
              <div key={i} className='p-5 rounded-3xl bg-[#090C1A] border border-white/10 hover:border-cyan-500/40 space-y-3 transition-all hover:scale-105 shadow-xl'>
                <div className='p-3 rounded-2xl bg-white/5 w-fit border border-white/10'>{p.icon}</div>
                <div>
                  <h4 className='text-sm font-bold text-white'>{p.name}</h4>
                  <span className='text-[10px] text-gray-400 font-mono block'>{p.badge}</span>
                </div>
                <div className='text-[11px] text-cyan-300 font-mono font-bold'>{p.size}</div>
              </div>
            ))}
          </div>

          <div className='text-center pt-2'>
            <button
              onClick={() => {
                if (onOpenDownload) onOpenDownload();
                else handleStartChat();
              }}
              className='px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-rose-500 text-black font-extrabold text-xs shadow-glow-cyan hover:opacity-90 transition-all cursor-pointer'
            >
              Open Complete Download Center
            </button>
          </div>
        </section>

        {/* CREATOR & SOVEREIGN IDENTITY */}
        <section className='p-8 rounded-3xl bg-gradient-to-br from-[#090C1A] via-[#050711] to-[#0A0D20] border border-cyan-500/30 text-center space-y-4 shadow-2xl'>
          <div className='w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center mx-auto text-2xl font-bold'>
            ✨
          </div>
          <h3 className='text-xl sm:text-2xl font-extrabold text-white'>
            Envisioned & Engineered by <span className='text-cyan-300'>Abhinav Giri</span>
          </h3>
          <p className='text-xs sm:text-sm text-gray-400 font-mono max-w-xl mx-auto'>
            Created with the core motto: <strong>Think • Create • Explore</strong>. Built for developers, researchers, mathematicians, and creators who demand absolute speed and uncompromising privacy.
          </p>
          <div className='flex items-center justify-center gap-3 pt-2'>
            <a
              href='https://x.com/AbhinavGiri45'
              target='_blank'
              rel='noopener noreferrer'
              className='px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 hover:text-white flex items-center gap-2 transition-colors'
            >
              <XTwitterIcon className='w-3.5 h-3.5' />
              <span>@AbhinavGiri45</span>
            </a>
            <a
              href='https://github.com/abhinavgiri45/'
              target='_blank'
              rel='noopener noreferrer'
              className='px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-gray-300 hover:text-white flex items-center gap-2 transition-colors'
            >
              <GithubIcon className='w-3.5 h-3.5' />
              <span>GitHub</span>
            </a>
          </div>
        </section>

        {/* FAQ ACCORDION */}
        <section className='space-y-4'>
          <h2 className='text-xl sm:text-2xl font-extrabold text-white text-center'>Frequently Asked Questions</h2>
          <div className='space-y-2 max-w-3xl mx-auto'>
            {faqs.map((faq, i) => (
              <div key={i} className='rounded-2xl bg-[#090C1A] border border-white/10 overflow-hidden'>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className='w-full p-4 text-left font-bold text-sm text-white flex items-center justify-between cursor-pointer hover:bg-white/[0.02]'
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={\w-4 h-4 text-cyan-400 transition-transform \\} />
                </button>
                {openFaq === i && (
                  <div className='p-4 pt-0 text-xs text-gray-300 font-sans leading-relaxed border-t border-white/5'>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM FINAL CTA */}
        <section className='text-center p-8 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-[#0B0E24] to-purple-950/60 border border-cyan-500/30 space-y-4'>
          <h3 className='text-2xl sm:text-3xl font-extrabold text-white'>Ready to Experience Sovereign AI?</h3>
          <p className='text-xs text-gray-400 font-mono'>Zero setup required • Private in-browser storage • 100% Free</p>
          <button
            onClick={() => handleStartChat()}
            className='px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-rose-500 text-black font-black text-sm shadow-glow-cyan hover:scale-105 transition-all cursor-pointer'
          >
            Start Chatting in Girionix Workspace →
          </button>
        </section>
      </main>
    </div>
  );
}
\;

fs.writeFileSync('src/components/common/IntroducingGirionixPage.jsx', code, 'utf8');
console.log('✅ Generated clean IntroducingGirionixPage.jsx');
