import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Wrench, 
  Code2, 
  Sigma, 
  Image as ImageIcon, 
  Film, 
  UserCheck, 
  Timer, 
  Headphones, 
  Bookmark, 
  Check, 
  Play, 
  Pause, 
  RotateCcw,
  Sparkles,
  Volume2,
  Award,
  HardDriveDownload,
  UploadCloud,
  FileDown,
  ArrowRight,
  ShieldCheck,
  Flame,
  Plus,
  Palette,
  ExternalLink,
  Download,
  Trash2,
  RefreshCw,
  Zap,
  CheckCircle,
  AlertCircle,
  Cpu,
  ScrollText
} from 'lucide-react';
import { storage, PERSONAS, THEMES } from '../../services/storage';
import { updateService, CURRENT_APP_VERSION } from '../../services/updateService';

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

export default function ToolsModal({
  isOpen,
  onClose,
  onLaunchStudio,
  activePersona,
  onSelectPersona,
  pinnedItems = [],
  onRemovePinned,
  onOpenLocalEngine
}) {
  const [activeTab, setActiveTab] = useState('studios'); // 'studios' | 'updates' | 'download' | 'personas' | 'themes' | 'focus' | 'backup' | 'pinned' | 'certificate'
  const [backupStatus, setBackupStatus] = useState(null);

  // Over-The-Air Update State
  const [updateState, setUpdateState] = useState({
    isChecking: false,
    hasUpdate: false,
    updateInfo: null
  });
  const [isApplyingUpdate, setIsApplyingUpdate] = useState(false);
  const [lastCheckedTime, setLastCheckedTime] = useState(null);

  const handleCheckUpdates = async () => {
    setUpdateState(prev => ({ ...prev, isChecking: true }));
    const res = await updateService.checkForUpdates();
    setUpdateState({
      isChecking: false,
      hasUpdate: res.hasUpdate,
      updateInfo: res
    });
    setLastCheckedTime(new Date().toLocaleTimeString());
  };

  const handleApplyUpdate = async () => {
    setIsApplyingUpdate(true);
    setTimeout(async () => {
      await updateService.applyUpdate();
    }, 1200);
  };

  // Custom Persona Builder State
  const [customPersonas, setCustomPersonas] = useState(() => {
    try {
      const saved = localStorage.getItem('girionix_custom_personas');
      return saved ? JSON.parse(saved) : [];
    } catch (_) { return []; }
  });
  const [newPersonaName, setNewPersonaName] = useState('');
  const [newPersonaDesc, setNewPersonaDesc] = useState('');
  const [newPersonaSuffix, setNewPersonaSuffix] = useState('');
  const [isCreatingPersona, setIsCreatingPersona] = useState(false);

  // Theme State
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('girionix_theme') || 'obsidian');

  // Focus Timer State
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('work'); // 'work' | 'break'

  // Ambient Sounds State
  const [playingAmbient, setPlayingAmbient] = useState(null);
  const audioCtxRef = useRef(null);
  const ambientNodesRef = useRef([]);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds(prev => prev - 1), 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
      if (timerMode === 'work') {
        setTimerMode('break');
        setTimerSeconds(5 * 60);
      } else {
        setTimerMode('work');
        setTimerSeconds(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, timerMode]);

  const stopAmbient = () => {
    ambientNodesRef.current.forEach(node => {
      try { node.stop(); } catch (_) {}
      try { node.disconnect(); } catch (_) {}
    });
    ambientNodesRef.current = [];
    setPlayingAmbient(null);
  };

  const playAmbient = (type) => {
    if (playingAmbient === type) {
      stopAmbient();
      return;
    }
    stopAmbient();

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    setPlayingAmbient(type);

    if (type === 'space') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      ambientNodesRef.current = [osc, gain];
    } else if (type === 'alpha') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.frequency.setValueAtTime(200, ctx.currentTime);
      osc2.frequency.setValueAtTime(210, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc2.start();
      ambientNodesRef.current = [osc1, osc2, gain];
    } else if (type === 'rain') {
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, ctx.currentTime);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start();
      ambientNodesRef.current = [whiteNoise, filter, gain];
    }
  };

  useEffect(() => {
    return () => stopAmbient();
  }, []);

  if (!isOpen) return null;

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSaveCustomPersona = () => {
    if (!newPersonaName.trim() || !newPersonaSuffix.trim()) return;
    const personaObj = {
      id: 'custom-' + Date.now(),
      name: newPersonaName.trim(),
      desc: newPersonaDesc.trim() || 'Custom user persona',
      promptSuffix: newPersonaSuffix.trim()
    };
    const updated = [...customPersonas, personaObj];
    setCustomPersonas(updated);
    localStorage.setItem('girionix_custom_personas', JSON.stringify(updated));
    setNewPersonaName('');
    setNewPersonaDesc('');
    setNewPersonaSuffix('');
    setIsCreatingPersona(false);
    onSelectPersona(personaObj.id);
  };

  const handleApplyTheme = (themeId) => {
    setCurrentTheme(themeId);
    localStorage.setItem('girionix_theme', themeId);
  };

  const handleExportWorkspace = () => {
    const data = {
      sessions: storage.getSessions(),
      settings: storage.getSettings(),
      pinned: storage.getPinnedItems(),
      userName: storage.getUserName(),
      customPersonas,
      theme: currentTheme,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `girionix_backup_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setBackupStatus('Workspace backup downloaded successfully!');
    setTimeout(() => setBackupStatus(null), 3000);
  };

  const handleImportWorkspace = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.sessions) storage.saveSessions(imported.sessions);
        if (imported.settings) storage.saveSettings(imported.settings);
        if (imported.pinned) storage.savePinnedItems(imported.pinned);
        if (imported.userName) storage.setUserName(imported.userName);
        if (imported.customPersonas) localStorage.setItem('girionix_custom_personas', JSON.stringify(imported.customPersonas));
        if (imported.theme) localStorage.setItem('girionix_theme', imported.theme);
        setBackupStatus('Workspace restored! Refreshing...');
        setTimeout(() => window.location.reload(), 1000);
      } catch (err) {
        setBackupStatus('Error restoring backup: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const downloadNativeApp = (filePath, fileName) => {
    const a = document.createElement('a');
    a.href = filePath;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const allPersonas = [...PERSONAS, ...customPersonas];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-fadeIn">
      <div className="w-full max-w-4xl rounded-3xl bg-[#090B16] border border-cyan-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] shadow-glow-cyan">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Girionix AI Studio & Tools Hub</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Production Ready
                </span>
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Interactive Studios, Personas, Themes, Focus Sprints, Backups & Verification
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 bg-black/40 border-b border-white/[0.06] overflow-x-auto text-xs font-mono">
          {[
            { id: 'studios', label: '🎨 AI Studios', icon: <Sparkles className="w-3.5 h-3.5" /> },
            { id: 'updates', label: '⚡ Updates & Sync', icon: <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> },
            { id: 'download', label: '📲 Download Apps', icon: <Download className="w-3.5 h-3.5 text-emerald-400" /> },
            { id: 'personas', label: '🧠 AI Personas', icon: <UserCheck className="w-3.5 h-3.5" /> },
            { id: 'themes', label: '🌈 Themes', icon: <Palette className="w-3.5 h-3.5" /> },
            { id: 'focus', label: '⏱️ Focus & Sounds', icon: <Timer className="w-3.5 h-3.5" /> },
            { id: 'backup', label: '💾 Backup/Restore', icon: <HardDriveDownload className="w-3.5 h-3.5" /> },
            { id: 'pinned', label: '📌 Bookmarks', icon: <Bookmark className="w-3.5 h-3.5" /> },
            { id: 'certificate', label: '🎖️ Master Creator', icon: <Award className="w-3.5 h-3.5" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-glow-cyan'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. AI STUDIOS TAB */}
          {activeTab === 'studios' && (
            <div className="space-y-4">
              <div className="text-xs text-gray-400 font-mono flex items-center justify-between">
                <span>Select a studio to launch with its dedicated specialized AI model:</span>
                <span className="text-cyan-400 font-bold">Specialized Studio Engines</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Flagship: Google AI Studio */}
                <div
                  onClick={() => { onLaunchStudio('google-studio'); onClose(); }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/50 via-cyan-950/40 to-[#0B0D19] border border-cyan-400/50 hover:border-cyan-300 cursor-pointer transition-all hover:scale-[1.01] shadow-xl group space-y-2.5 sm:col-span-2 lg:col-span-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500/25 via-blue-500/25 to-purple-500/25 text-cyan-300 border border-cyan-400/30">
                      <Sparkles className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">1M+ Context</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">Flagship Studio</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 flex items-center gap-2">
                      <span>Google AI Studio</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-mono">aistudio.google.com parity</span>
                    </h3>
                    <div className="text-[11px] font-mono text-cyan-400 font-bold">✦ Model: Google Gemini 2.5 Pro & Flash Thinking Core</div>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed max-w-2xl">
                    Faithful Google AI Studio developer environment featuring Chat, Freeform, and Structured (Few-Shot) prompt workspaces, live in-browser code execution sandbox, KaTeX math rendering, and multi-language SDK code export (Python, JS, cURL, Swift, Kotlin).
                  </p>
                  <div className="pt-1 flex items-center gap-1.5 text-xs text-cyan-400 font-mono font-bold">
                    <span>Launch Google AI Studio</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 1. Code Studio */}
                <div
                  onClick={() => { onLaunchStudio('code'); onClose(); }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-[#0B0D19] border border-cyan-500/30 hover:border-cyan-400 cursor-pointer transition-all hover:scale-[1.02] shadow-xl group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                      <Code2 className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Live React 18</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300">Dev Runner & Code Studio</h3>
                    <div className="text-[10px] font-mono text-cyan-400 font-bold">⚡ Model: Girionix CodeMaster Ultra (70B)</div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Live sandboxed component runner, Tailwind preview, AST auto-debugger, and zero-latency compilation.
                  </p>
                  <div className="pt-1 flex items-center gap-1 text-[11px] text-cyan-400 font-mono">
                    <span>Launch Studio</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 2. Script Writer Studio */}
                <div
                  onClick={() => { onLaunchStudio('script'); onClose(); }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-[#0B0D19] border border-indigo-500/30 hover:border-indigo-400 cursor-pointer transition-all hover:scale-[1.02] shadow-xl group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                      <ScrollText className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Fountain / FDX</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-300">Screenplay & Script Studio</h3>
                    <div className="text-[10px] font-mono text-indigo-400 font-bold">✍️ Model: Girionix ScriptMaster Cinema</div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Hollywood screenplay formatting, YouTube video hooks, AI scene co-pilot, and neural voice table-read mode.
                  </p>
                  <div className="pt-1 flex items-center gap-1 text-[11px] text-indigo-400 font-mono">
                    <span>Launch Script Studio</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 2. Math Lab */}
                <div
                  onClick={() => { onLaunchStudio('math'); onClose(); }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900 to-[#0B0D19] border border-purple-500/30 hover:border-purple-400 cursor-pointer transition-all hover:scale-[1.02] shadow-xl group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                      <Sigma className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">KaTeX + 3D Mesh</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-purple-300">Math Olympiad & 3D Lab</h3>
                    <div className="text-[10px] font-mono text-purple-400 font-bold">📐 Model: Girionix Math-X Olympiad (72B)</div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Step-by-step rigorous proofs, formula derivations, 2D calculus curve grapher, and 3D parametric surface plotter.
                  </p>
                  <div className="pt-1 flex items-center gap-1 text-[11px] text-purple-400 font-mono">
                    <span>Launch Lab</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 3. 8K Vision */}
                <div
                  onClick={() => { onLaunchStudio('image'); onClose(); }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-[#0B0D19] border border-rose-500/30 hover:border-rose-400 cursor-pointer transition-all hover:scale-[1.02] shadow-xl group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">FLUX.1 8K Pro</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-rose-300">8K VisionForge Studio</h3>
                    <div className="text-[10px] font-mono text-rose-400 font-bold">🎨 Model: Girionix VisionForge 8K Pro</div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Ultra-HD photorealistic generation, Arri Alexa optics, 4X upscale, and multi-aspect ratio cinema framing.
                  </p>
                  <div className="pt-1 flex items-center gap-1 text-[11px] text-rose-400 font-mono">
                    <span>Launch VisionForge</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 4. MotionLab Video Studio */}
                <div
                  onClick={() => { onLaunchStudio('video'); onClose(); }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-[#0B0D19] border border-amber-500/30 hover:border-amber-400 cursor-pointer transition-all hover:scale-[1.02] shadow-xl group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                      <Film className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">4K/8K 60-120 FPS</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-300">MotionLab 4K/8K Cinema Video</h3>
                    <div className="text-[10px] font-mono text-amber-400 font-bold">🎬 Model: Girionix CineMotion 4K/8K Max</div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Cinematic 4-shot storyboard synthesis, 3D camera flight trajectories (Orbit, Dolly, FPV), and stereo scoring.
                  </p>
                  <div className="pt-1 flex items-center gap-1 text-[11px] text-amber-400 font-mono">
                    <span>Launch Motion Lab</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 5. AudioLab HD */}
                <div
                  onClick={() => { onLaunchStudio('audio'); onClose(); }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-[#0B0D19] border border-emerald-500/30 hover:border-emerald-400 cursor-pointer transition-all hover:scale-[1.02] shadow-xl group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <Headphones className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">48kHz Master</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300">AudioLab & Neural Voice Studio</h3>
                    <div className="text-[10px] font-mono text-emerald-400 font-bold">🎙️ Model: Girionix AudioCraft HD</div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Multi-speaker neural voice synthesis, real-time audio spectrum frequency analyzer, and procedural soundtrack scoring.
                  </p>
                  <div className="pt-1 flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                    <span>Launch AudioLab</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 6. Titan Local Core */}
                <div
                  onClick={() => { 
                    if (onOpenLocalEngine) onOpenLocalEngine(); 
                    onClose(); 
                  }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-teal-950/40 via-slate-900 to-[#0B0D19] border border-teal-500/30 hover:border-teal-400 cursor-pointer transition-all hover:scale-[1.02] shadow-xl group space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400">
                      <Cpu className="w-6 h-6 animate-pulse" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">100% Offline Air-Gapped</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-teal-300">Titan Sovereign Local Core</h3>
                    <div className="text-[10px] font-mono text-teal-400 font-bold">⚡ Model: Titan 70B & Titan Lite Engine</div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Runs strictly on your machine's physical CPU cores, RAM, and GPU shaders with zero internet network traffic.
                  </p>
                  <div className="pt-1 flex items-center gap-1 text-[11px] text-teal-400 font-mono">
                    <span>Configure Local Core</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 1.1 OVER-THE-AIR UPDATES & CODE SYNC TAB */}
          {activeTab === 'updates' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Over-The-Air (OTA) Live Code Sync</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                      Live Push Channel
                    </span>
                  </h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    Instantly syncs new code updates, features, and model improvements across all apps with 0 data loss.
                  </p>
                </div>
                <button
                  onClick={handleCheckUpdates}
                  disabled={updateState.isChecking}
                  className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-mono flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${updateState.isChecking ? 'animate-spin' : ''}`} />
                  <span>{updateState.isChecking ? 'Checking...' : 'Check Cloud'}</span>
                </button>
              </div>

              {/* Version Comparison Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1">
                  <span className="text-[11px] font-mono text-gray-400 uppercase">Installed Build:</span>
                  <div className="text-xl font-black text-white flex items-center gap-2">
                    <span>v{CURRENT_APP_VERSION.version}</span>
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-gray-300 text-[10px] font-mono">
                      {CURRENT_APP_VERSION.channel}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono">Build Date: {CURRENT_APP_VERSION.buildDate}</p>
                </div>

                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-1">
                  <span className="text-[11px] font-mono text-gray-400 uppercase">Cloud Release Version:</span>
                  <div className="text-xl font-black text-cyan-400 flex items-center gap-2">
                    <span>v{updateState.updateInfo?.latestVersion || CURRENT_APP_VERSION.version}</span>
                    {updateState.hasUpdate ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                        Update Ready
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                        Up to Date
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono">
                    {lastCheckedTime ? `Checked today at ${lastCheckedTime}` : 'Checking live cloud...'}
                  </p>
                </div>
              </div>

              {/* Status Banner */}
              {updateState.hasUpdate ? (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>New Update Available! (v{updateState.updateInfo?.latestVersion})</span>
                  </div>
                  <p className="text-xs text-gray-300 font-sans">
                    {updateState.updateInfo?.title || 'A new code update is ready with studio upgrades.'}
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div>
                    <h4 className="font-bold text-white text-xs">You are running the latest version of Girionix AI</h4>
                    <p className="text-[11px] text-gray-400 font-sans">All studios, 8K engines, and offline vaults are fully synchronized.</p>
                  </div>
                </div>
              )}

              {/* Release Notes */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                  Changelog & What's New:
                </span>
                <div className="max-h-48 overflow-y-auto p-4 rounded-2xl bg-black/60 border border-white/5 space-y-2 text-xs font-sans text-gray-300">
                  {updateState.updateInfo?.changelog && updateState.updateInfo.changelog.length > 0 ? (
                    <ul className="space-y-1.5 list-disc pl-5">
                      {updateState.updateInfo.changelog.map((note, i) => (
                        <li key={i} className="text-gray-300 leading-relaxed text-[11px]">
                          {note}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="space-y-1.5 list-disc pl-5 text-[11px]">
                      <li>100% Standalone Multi-Platform Native Engine (Windows, Android, macOS, Linux, iOS).</li>
                      <li>Hollywood 4-Shot Cinematic Video Studio with Web Audio Stereo Scoring.</li>
                      <li>8K FLUX.1 Visual Studio with 8 artistic styles & aspect ratios.</li>
                      <li>Real-Time Over-The-Air (OTA) Code Sync across all installed apps.</li>
                    </ul>
                  )}
                </div>
              </div>

              {/* 1-Click Action */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
                <button
                  onClick={handleApplyUpdate}
                  disabled={isApplyingUpdate}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-rose-500 text-black font-extrabold text-xs shadow-glow-cyan hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isApplyingUpdate ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      <span>Applying Live Code Update...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 text-black" />
                      <span>1-Click Apply Live Code Sync</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* 1.5 DOWNLOAD CROSS-PLATFORM APPS TAB */}
          {activeTab === 'download' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Girionix AI Native Cross-Platform Apps</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                      90-Day Local Vault
                    </span>
                  </h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    Real signed installers with dedicated uninstaller wizards for Windows, Android, macOS, iOS, and Linux.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { name: 'Windows', ext: 'Girionix_AI_Setup.exe', file: '/downloads/Girionix_AI_Setup.exe', os: 'Win 7, 8, 10, 11, 12', color: 'cyan', desc: 'Full GUI Setup Wizard + Windows Settings/Control Panel integration.' },
                  { name: 'Android', ext: 'Girionix_AI.apk', file: '/downloads/Girionix_AI.apk', os: 'Android 8.0 to 15/16', color: 'emerald', desc: 'Real signed Android APK with 90-day sandbox storage.' },
                  { name: 'macOS', ext: 'Girionix_AI_macOS.dmg', file: '/downloads/Girionix_AI_macOS.dmg', os: 'Apple Silicon & Intel', color: 'rose', desc: 'Universal DMG bundle with 1-click uninstaller script.' },
                  { name: 'Linux', ext: 'Girionix_AI_Linux.AppImage', file: '/downloads/Girionix_AI_Linux.AppImage', os: 'Ubuntu, Fedora, Arch', color: 'amber', desc: 'Self-contained executable with Wayland & X11 acceleration.' },
                  { name: 'iOS Profile', ext: 'Girionix_AI_iOS.mobileconfig', file: '/downloads/Girionix_AI_iOS.mobileconfig', os: 'iOS 15 to 18/19', color: 'purple', desc: 'Instant Apple WebClip profile with isolated app container.' }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-cyan-400/50 space-y-2.5 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{item.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300">{item.os}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-snug">{item.desc}</p>
                    <button
                      onClick={() => downloadNativeApp(item.file, item.ext)}
                      className="w-full py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download ({item.ext})</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. AI PERSONAS TAB */}
          {activeTab === 'personas' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-mono">Select an active persona or build your own custom AI expert:</span>
                <button
                  onClick={() => setIsCreatingPersona(!isCreatingPersona)}
                  className="px-3 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isCreatingPersona ? 'Cancel' : 'Create Persona'}</span>
                </button>
              </div>

              {isCreatingPersona && (
                <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-3 animate-fadeIn">
                  <span className="text-xs font-bold text-cyan-400 font-mono">Custom Persona Builder</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Persona Name (e.g. Senior Security Auditor)"
                      value={newPersonaName}
                      onChange={(e) => setNewPersonaName(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Short Description"
                      value={newPersonaDesc}
                      onChange={(e) => setNewPersonaDesc(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="System Instruction / Prompt Suffix (e.g. Always evaluate code for OWASP Top 10 vulnerabilities...)"
                    value={newPersonaSuffix}
                    onChange={(e) => setNewPersonaSuffix(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveCustomPersona}
                      disabled={!newPersonaName.trim() || !newPersonaSuffix.trim()}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold text-xs shadow-glow-cyan disabled:opacity-40"
                    >
                      Save & Activate Persona
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allPersonas.map(p => {
                  const isSelected = activePersona === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => { onSelectPersona(p.id); onClose(); }}
                      className={`p-4 rounded-2xl text-left border transition-all ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-500/40 text-white shadow-glow-cyan'
                          : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] text-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          {isSelected && <Flame className="w-3.5 h-3.5 text-cyan-400 fill-current" />}
                          <span>{p.name}</span>
                        </span>
                        {isSelected && <span className="text-[10px] font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-500/20">Active</span>}
                      </div>
                      <p className="text-[11px] text-gray-400 leading-snug">{p.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. THEMES TAB */}
          {activeTab === 'themes' && (
            <div className="space-y-4">
              <div className="text-xs text-gray-400 font-mono">
                Select an aesthetic visual theme for your Girionix workspace:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {THEMES.map(th => {
                  const isSelected = currentTheme === th.id;
                  return (
                    <button
                      key={th.id}
                      onClick={() => handleApplyTheme(th.id)}
                      className={`p-4 rounded-2xl text-left border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-white/[0.06] border-white/40 shadow-xl'
                          : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl border border-white/20 shadow-md"
                          style={{ backgroundColor: th.bg, borderColor: th.primary }}
                        />
                        <div>
                          <span className="text-xs font-bold text-white block">{th.name}</span>
                          <span className="text-[10px] font-mono text-gray-400">Accent: {th.primary}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="text-[10px] font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-500/20">
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. FOCUS TIMER & AMBIENT AUDIO TAB */}
          {activeTab === 'focus' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="text-xs font-mono uppercase text-gray-400 tracking-wider">
                  {timerMode === 'work' ? '🧠 Deep Work Sprint' : '☕ Rest Break'}
                </div>
                <div className="text-5xl font-extrabold font-mono text-cyan-400 tracking-tight">
                  {formatTimer(timerSeconds)}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="px-6 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs flex items-center gap-2 shadow-glow-cyan"
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isTimerRunning ? 'Pause Sprint' : 'Start 25-Min Sprint'}</span>
                  </button>
                  <button
                    onClick={() => { setIsTimerRunning(false); setTimerSeconds(25 * 60); setTimerMode('work'); }}
                    className="p-2.5 rounded-xl bg-white/[0.04] text-gray-400 hover:text-white"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs text-gray-400 font-mono">
                  Synthesizer background audio for deep coding concentration:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'space', name: 'Deep Space Drone', desc: '55Hz Sub-harmonic calming wave' },
                    { id: 'alpha', name: '10Hz Alpha Waves', desc: 'Binaural focus oscillation' },
                    { id: 'rain', name: 'Cyberpunk Rain', desc: 'Filtered acoustic pink noise' }
                  ].map(item => {
                    const isPlaying = playingAmbient === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => playAmbient(item.id)}
                        className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between min-h-[110px] ${
                          isPlaying
                            ? 'bg-rose-500/20 border-rose-500/40 text-white shadow-glow-rose'
                            : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] text-gray-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{item.name}</span>
                            {isPlaying ? <Volume2 className="w-4 h-4 text-rose-400 animate-pulse" /> : <Headphones className="w-4 h-4 text-gray-500" />}
                          </div>
                          <p className="text-[11px] text-gray-400 mt-1 leading-snug">{item.desc}</p>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400 mt-2">
                          {isPlaying ? '■ Stop Audio' : '▶ Play Soundscape'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 5. BACKUP & RESTORE TAB */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="text-xs text-gray-400 font-mono">
                Export and restore your entire Girionix workspace (all chat sessions, bookmarks, custom settings):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                    <FileDown className="w-5 h-5" />
                    <span>Backup Entire Workspace</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Save all your chats, custom personas, and pinned snippets as a `.json` backup file.
                  </p>
                  <button
                    onClick={handleExportWorkspace}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-glow-cyan"
                  >
                    <HardDriveDownload className="w-4 h-4" />
                    <span>Download Backup (.json)</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-black/60 border border-purple-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                    <UploadCloud className="w-5 h-5" />
                    <span>Restore Workspace</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Upload a previously saved `.json` backup file to restore all your conversations.
                  </p>
                  <label className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer hover:opacity-90">
                    <UploadCloud className="w-4 h-4" />
                    <span>Choose File to Restore</span>
                    <input type="file" accept=".json" onChange={handleImportWorkspace} className="hidden" />
                  </label>
                </div>
              </div>

              {backupStatus && (
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs font-mono text-cyan-300 text-center">
                  {backupStatus}
                </div>
              )}
            </div>
          )}

          {/* 6. BOOKMARKS TAB */}
          {activeTab === 'pinned' && (
            <div className="space-y-3">
              {pinnedItems.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-xs font-mono">
                  No pinned bookmarks yet. Star ⭐ any chat snippet or code block to save it here!
                </div>
              ) : (
                pinnedItems.map(item => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <span className="text-xs text-gray-200 truncate">{item.title}</span>
                    <button onClick={() => onRemovePinned(item.id)} className="text-gray-500 hover:text-rose-400 text-xs font-mono">
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 7. CREATOR HOLOGRAPHIC CERTIFICATE WITH SOCIAL LINKS */}
          {activeTab === 'certificate' && (
            <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-[#0B0D1B] to-purple-950/60 border border-cyan-500/40 text-center space-y-5 shadow-2xl relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-rose-500 p-0.5 mx-auto shadow-glow-cyan flex items-center justify-center">
                <div className="w-full h-full bg-[#07080F] rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-cyan-400 animate-pulse" />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-white tracking-wider uppercase">
                  Official Genesis Verification
                </h2>
                <span className="text-xs font-mono text-cyan-400">Architect & Visionary: Abhinav Giri</span>
              </div>

              <p className="text-xs font-sans text-gray-300 max-w-lg mx-auto leading-relaxed">
                This certifies that <strong className="text-cyan-400">Girionix AI</strong> was envisioned, architected, and engineered in India by <strong className="text-purple-300 font-bold">Abhinav Giri</strong> to pioneer the next generation of artificial intelligence, combining superhuman code sandboxing, Olympiad mathematics, 8K art direction, and conversational voice intelligence.
              </p>

              {/* Creator Official Links */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="https://x.com/AbhinavGiri45"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-white/10 text-white font-mono text-xs border border-white/10 shadow-lg transition-transform transform hover:scale-105"
                >
                  <XTwitterIcon className="w-3.5 h-3.5 text-white" />
                  <span>𝕏: @AbhinavGiri45</span>
                </a>

                <a
                  href="https://github.com/abhinavgiri45/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black/60 hover:bg-white/10 text-white font-mono text-xs border border-white/10 shadow-lg transition-transform transform hover:scale-105"
                >
                  <GithubIcon className="w-3.5 h-3.5 text-white" />
                  <span>GitHub: @abhinavgiri45</span>
                </a>

                <a
                  href="https://instagram.com/abhinavgiri45"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-rose-500/20 transition-transform transform hover:scale-105"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Instagram: @abhinavgiri45</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
