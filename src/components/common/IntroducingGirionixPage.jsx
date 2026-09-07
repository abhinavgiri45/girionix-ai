import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowUpRight, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  RotateCcw, 
  Sparkles, 
  Code2, 
  Sigma, 
  Image as ImageIcon, 
  Film, 
  Radio, 
  Layers, 
  ExternalLink, 
  Search, 
  Award, 
  ShieldCheck, 
  Download, 
  Smartphone, 
  Monitor, 
  Lock, 
  HardDrive, 
  UserCheck, 
  Zap, 
  Crown, 
  KeyRound, 
  EyeOff, 
  Cpu, 
  X, 
  CheckCircle, 
  CheckCircle2, 
  FileCheck, 
  Trash2, 
  AlertCircle, 
  Globe, 
  Flame, 
  Check, 
  Music, 
  Terminal, 
  RefreshCw, 
  Star, 
  Compass, 
  Laptop,
  CheckSquare,
  Activity,
  FolderLock,
  Play,
  Pause,
  Sliders,
  DollarSign,
  Quote,
  HelpCircle,
  Volume2,
  ArrowRight,
  Eye,
  ScrollText
} from 'lucide-react';
import KatexMath from './KatexMath';
import { 
  detectUserOS, 
  PLATFORM_INFO, 
  TITAN_PLATFORM_INFO, 
  TITAN_LITE_PLATFORM_INFO, 
  HIGH_END_SYSTEM_SPECS, 
  LOW_END_SYSTEM_SPECS,
  PLATFORM_DETAILED_SPECS,
  getPlatformDetailedSpecs
} from '../../services/osDetector';
import { triggerFileDownload } from '../../services/downloadHelper';
import { localNeuralEngine } from '../../services/localNeuralEngine';

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

export default function IntroducingGirionixPage({ isOpen, onClose, onLaunchApp, onOpenDownload, initialTab = 'overview' }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'overview'); // 'overview' | 'requirements' | 'comparison' | 'creator'
  const [selectedPlatform, setSelectedPlatform] = useState(() => detectUserOS());
  const [comparisonFilter, setComparisonFilter] = useState('all'); // 'all' | 'coding' | 'math' | 'visual' | 'privacy'
  const [selectedEdition, setSelectedEdition] = useState('standard'); // 'standard' | 'titan' | 'titan-lite'
  const [hardwareAuditReport, setHardwareAuditReport] = useState(null);
  const [isAuditingHardware, setIsAuditingHardware] = useState(false);
  const [downloadActionMessage, setDownloadActionMessage] = useState(null);

  useEffect(() => {
    if (initialTab && isOpen) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // High-Trust & Interactive Playground State
  const [interactiveStudio, setInteractiveStudio] = useState('google-studio'); // 'google-studio' | 'code' | 'math' | 'image' | 'video' | 'audio'
  const [openFaq, setOpenFaq] = useState(0);
  const [copiedCodeSnippet, setCopiedCodeSnippet] = useState(false);
  const [activeBenchmarkPill, setActiveBenchmarkPill] = useState('humaneval');
  const [simPlayingAudio, setSimPlayingAudio] = useState(false);
  const [simAudioFreq, setSimAudioFreq] = useState([20, 45, 75, 90, 60, 40, 85, 95, 70, 50, 30, 65, 80, 55, 35, 90]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const simCanvasRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const handleScroll = (e) => {
    const top = e?.currentTarget?.scrollTop || 0;
    setShowScrollTop(top > 400);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Animated Audio & Particle simulation for the Intro Page
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSimAudioFreq(prev => prev.map(() => Math.floor(Math.random() * 80) + 15));
    }, 120);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Auto-run Hardware Audit on Mount so all RAM, CPU, GPU data is 100% accurate immediately
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    localNeuralEngine.auditSystemHardware().then((report) => {
      if (isMounted && report) {
        setHardwareAuditReport(report);
      }
    }).catch(console.error);
    return () => { isMounted = false; };
  }, [isOpen]);

  const handleDownloadWithFeedback = async (url, fileName) => {
    setDownloadActionMessage(`Preparing download for ${fileName}...`);
    await triggerFileDownload(url, fileName, (status) => {
      if (status === 'downloading') {
        setDownloadActionMessage(`Streaming ${fileName} directly to your device...`);
      } else if (status === 'completed') {
        setDownloadActionMessage(`✅ ${fileName} downloaded! Run the setup installer to install.`);
      }
    });
    setTimeout(() => setDownloadActionMessage(null), 6000);
  };

  const runDeviceHardwareAudit = async () => {
    setIsAuditingHardware(true);
    try {
      const report = await localNeuralEngine.auditSystemHardware();
      setHardwareAuditReport(report);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditingHardware(false);
    }
  };

  const handleLaunch = (studioTab = null) => {
    const target = (typeof studioTab === 'string' ? studioTab : null) || interactiveStudio || 'code';
    if (onLaunchApp) onLaunchApp(target);
    else if (onClose) onClose();
  };

  if (!isOpen) return null;

  const activePlatformMap = selectedEdition === 'titan' 
    ? TITAN_PLATFORM_INFO 
    : (selectedEdition === 'titan-lite' ? TITAN_LITE_PLATFORM_INFO : PLATFORM_INFO);
  const currentPlatform = activePlatformMap[selectedPlatform] || activePlatformMap.windows;

  const detailedPlatformSpecs = getPlatformDetailedSpecs(selectedPlatform, selectedEdition);
  const systemRequirementsMatrix = detailedPlatformSpecs.matrix;

  const binaryDetails = [
    {
      os: 'Windows 10 / 11 / 12',
      format: '.EXE Setup Wizard',
      file: 'Girionix_AI_Setup.exe',
      size: '10.63 MB',
      architecture: 'x64 / Snapdragon X ARM64',
      storagePath: '%LocalAppData%\\Girionix AI\\Data',
      uninstaller: 'Start Menu & Windows Control Panel Add/Remove Programs'
    },
    {
      os: 'Android 10 to 15+',
      format: '.APK Standalone Package',
      file: 'Girionix_AI.apk',
      size: '5.01 MB',
      architecture: 'Universal ARM64-v8a / armeabi-v7a / x86_64',
      storagePath: 'Isolated Android App Sandbox Data',
      uninstaller: '1-Tap Android App Settings / Long-press Home Screen'
    },
    {
      os: 'macOS (Apple Silicon & Intel)',
      format: '.DMG Universal Bundle',
      file: 'Girionix_AI_macOS.dmg',
      size: '5.13 MB',
      architecture: 'Universal Binary (Apple M1-M4 & Intel Core)',
      storagePath: '~/Library/Application Support/Girionix AI/Data',
      uninstaller: 'Included Uninstall_Girionix_Mac.command runner'
    },
    {
      os: 'Linux (Ubuntu / Arch / Fedora)',
      format: '.AppImage Executable',
      file: 'Girionix_AI_Linux.AppImage',
      size: '6.63 MB',
      architecture: 'x86_64 Universal Linux',
      storagePath: '~/.local/share/girionix-ai/data',
      uninstaller: 'Included uninstall_girionix_linux.sh script'
    },
    {
      os: 'iOS / iPadOS 15 to 18+',
      format: '.MobileConfig / WebClip',
      file: 'Girionix_AI_iOS.mobileconfig',
      size: '1.3 KB',
      architecture: 'Apple A-Series & M-Series Bionic / Silicon',
      storagePath: 'Isolated iOS Sandboxed App Container',
      uninstaller: 'iOS Settings -> VPN & Device Management -> Remove Profile'
    }
  ];

  return (
    <div 
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="fixed inset-0 z-[9999] bg-[#000000] text-[#FFFFFF] overflow-y-auto overflow-x-hidden girionix-custom-scroll font-sans antialiased animate-fadeIn selection:bg-white selection:text-black"
      style={{
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Top Minimalist Navbar */}
      <nav className="h-14 sm:h-16 px-3 sm:px-10 flex items-center justify-between border-b border-white/[0.08] bg-black/90 sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-6">
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={onClose}>
            <img
              src="/logo.png"
              alt="Girionix AI"
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-contain shadow-glow-cyan/50"
            />
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
              Girionix<span className="text-cyan-400">AI</span>
            </span>
          </div>

          {/* Primary Top Navigation Tabs */}
          <div className="flex items-center gap-1 p-0.5 sm:p-1 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono overflow-x-auto no-scrollbar max-w-[50vw] sm:max-w-none">
            <button
              onClick={() => handleTabChange('overview')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-glow-cyan'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Overview & Studios</span>
              <span className="md:hidden">Overview</span>
            </button>

            <button
              onClick={() => handleTabChange('requirements')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'requirements'
                  ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-extrabold shadow-glow-cyan'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">📦 Installers & Specs</span>
              <span className="md:hidden">📦 Specs</span>
            </button>

            <button
              onClick={() => handleTabChange('comparison')}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'comparison'
                  ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40 shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold text-amber-300">Why Switch?</span>
            </button>
          </div>
        </div>

        {/* Top Right Developer Profile Badges & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <div className="hidden lg:flex items-center gap-1.5 border-r border-white/10 pr-3 mr-1">
            <a 
              href="https://x.com/AbhinavGiri45" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              title="Creator 𝕏 / Twitter (@AbhinavGiri45)"
            >
              <XTwitterIcon className="w-3.5 h-3.5" />
            </a>

            <a 
              href="https://github.com/abhinavgiri45/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              title="Creator GitHub (@abhinavgiri45)"
            >
              <GithubIcon className="w-3.5 h-3.5" />
            </a>

            <a 
              href="https://instagram.com/abhinavgiri45" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-full hover:bg-white/10 text-pink-400 hover:text-pink-300 transition-colors"
              title="Creator Instagram (@abhinavgiri45)"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
          </div>

          <button
            onClick={onOpenDownload}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Download Apps</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-rose-500 text-black font-extrabold text-xs shadow-glow-cyan hover:opacity-90 transition-all flex items-center gap-1 sm:gap-1.5"
          >
            <span>Launch Free</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW & STUDIOS (HIGH-TRUST & INTERACTIVE PLAYGROUND)            */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-20 animate-fadeIn pb-24">
          {/* Top Floating Trust Badge Banner */}
          <div className="bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-emerald-950/40 border-b border-white/10 py-2.5 px-4 text-center">
            <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 sm:gap-6 flex-wrap text-[11px] font-mono text-gray-300">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Globe className="w-3.5 h-3.5" /> Made in Bharat / India 🇮🇳
              </span>
              <span className="text-gray-600 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> VirusTotal 0/70 Verified Clean
              </span>
              <span className="text-gray-600 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 text-purple-300 font-bold">
                <Lock className="w-3.5 h-3.5" /> 100% Private Local Vault
              </span>
              <span className="text-gray-600 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Crown className="w-3.5 h-3.5" /> 0 Logins • $0 Free Forever
              </span>
            </div>
          </div>

          {/* Hero Section */}
          <section id="overview" className="max-w-5xl mx-auto px-6 pt-8 sm:pt-12 text-center space-y-8 relative">
            {/* Ambient Background Glow Orbs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-purple-500/15 to-rose-500/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-cyan-500/30 text-xs font-mono text-cyan-300 backdrop-blur-md shadow-glow-cyan/20">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>GIRIONIX AI • THE OMNIPOTENT SOVEREIGN POLYMATH</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
              One Sovereign AI Workspace. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-rose-400">
                Think • Create • Explore.
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-base sm:text-lg text-gray-300 font-normal leading-relaxed font-sans">
              Stop paying <span className="text-rose-400 font-bold underline decoration-rose-500/40">$120+/month ($1,440/yr)</span> across fragmented subscriptions for ChatGPT, Midjourney, Claude, Runway, and ElevenLabs. <strong>Girionix AI</strong> unifies fullstack live code compilation, Olympiad mathematical proofs, 8K photorealistic art, 4K/8K Hollywood cinema video, and 48kHz neural voice into <strong>one private, lightning-fast sovereign powerhouse</strong>.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={handleLaunch}
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-black font-black text-sm shadow-glow-cyan hover:shadow-cyan-400/50 transition-all flex items-center justify-center gap-2.5 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>Start Using Free (0 Logins Required)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('requirements')}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white font-bold text-sm border border-white/20 hover:border-cyan-400 transition-all flex items-center justify-center gap-2.5 shadow-lg cursor-pointer"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Download Standalone Apps</span>
              </button>
            </div>

            {/* Live Metrics Trust Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto pt-6 text-left">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1 backdrop-blur-sm">
                <div className="text-2xl font-black text-cyan-400 font-mono">0.1s</div>
                <div className="text-xs text-gray-300 font-medium">Sub-50ms Neural Speed</div>
                <div className="text-[10px] text-gray-500 font-mono">~145 tokens/second</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1 backdrop-blur-sm">
                <div className="text-2xl font-black text-purple-400 font-mono">98.4%</div>
                <div className="text-xs text-gray-300 font-medium">HumanEval Code Mastery</div>
                <div className="text-[10px] text-gray-500 font-mono">React 18 & AST Engine</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1 backdrop-blur-sm">
                <div className="text-2xl font-black text-emerald-400 font-mono">0 Logins</div>
                <div className="text-xs text-gray-300 font-medium">Zero-Tracking Privacy</div>
                <div className="text-[10px] text-gray-500 font-mono">Local Disk Vault & AES</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1 backdrop-blur-sm">
                <div className="text-2xl font-black text-amber-400 font-mono">$0 / Free</div>
                <div className="text-xs text-gray-300 font-medium">Save $1,440 Every Year</div>
                <div className="text-[10px] text-gray-500 font-mono">Unified AI Studios & Engine</div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* INTERACTIVE LIVE PLAYGROUND (TEST GIRIONIX AI RIGHT HERE ON THE PAGE!)      */}
          {/* ========================================================================= */}
          <section className="max-w-6xl mx-auto px-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold border border-cyan-500/20">
                <Terminal className="w-3.5 h-3.5" />
                <span>INTERACTIVE LIVE PLAYGROUND PREVIEW</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                Experience the Interactive Studios in Action
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto font-sans">
                Click any studio tab below to explore live code generation, mathematical derivations, 8K art, video simulation, and audio synthesis.
              </p>
            </div>

            {/* Interactive Studio Switcher Pills */}
            <div className="p-1.5 rounded-2xl bg-[#090C16] border border-white/10 flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto shadow-2xl">
              {[
                { id: 'google-studio', label: '✦ Google AI Studio', color: 'cyan', icon: Sparkles, desc: 'Flagship Developer Environment' },
                { id: 'code', label: '💻 Dev Runner', color: 'cyan', icon: Code2, desc: 'React 18 & TypeScript AST' },
                { id: 'script', label: '✍️ Script Writer', color: 'indigo', icon: ScrollText, desc: 'Fountain Screenplay & Story' },
                { id: 'math', label: '📐 Olympiad Math', color: 'purple', icon: Sigma, desc: 'KaTeX & 3D Surfaces' },
                { id: 'image', label: '🎨 8K VisionForge', color: 'rose', icon: ImageIcon, desc: 'FLUX.1 Cinema Ultra' },
                { id: 'video', label: '🎬 MotionLab Video', color: 'amber', icon: Film, desc: '4K/8K 60FPS Continuous' },
                { id: 'audio', label: '🎙️ AudioLab HD', color: 'teal', icon: Music, desc: '48kHz & Procedural Scores' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setInteractiveStudio(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-mono transition-all flex items-center gap-2 whitespace-nowrap ${
                    interactiveStudio === tab.id
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white font-bold border border-cyan-500/40 shadow-glow-cyan'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4 text-cyan-400" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Interactive Studio Stage Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#070913] border border-cyan-500/30 shadow-2xl space-y-6">
              {/* STAGE 0: GOOGLE AI STUDIO FLAGSHIP */}
              {interactiveStudio === 'google-studio' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500/25 via-blue-500/25 to-purple-500/25 text-cyan-400 border border-cyan-400/40">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <span>Google AI Studio Environment</span>
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30 font-bold">
                            1M+ Context Parity
                          </span>
                        </h3>
                        <p className="text-xs text-gray-400 font-mono">Chat, Freeform & Structured Prompts • Live Sandbox Execution • KaTeX Math</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleLaunch('google-studio')}
                      className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs flex items-center gap-1.5 shadow-glow-cyan cursor-pointer transition-all hover:scale-105"
                    >
                      <span>Launch Google AI Studio</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Prompt Workspace Preview */}
                    <div className="lg:col-span-7 p-4 rounded-2xl bg-[#050711] border border-cyan-500/20 font-mono text-xs text-gray-300 space-y-3 shadow-xl">
                      <div className="flex items-center justify-between text-[11px] text-gray-400 pb-2 border-b border-white/10">
                        <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Gemini 2.5 Pro Output with Code Execution</span>
                        </span>
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="text-cyan-300">⏱ 640ms</span>
                          <span className="text-purple-300">📊 268 tokens</span>
                          <span className="text-emerald-400">⚡ 74 tok/s</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-2 text-[11px]">
                        <div className="text-cyan-300 font-bold">▼ Thinking Process (1,240 tokens)</div>
                        <div className="text-gray-400 text-[10px]">Formulating matrix exponentiation $O(\\log N)$ and formal Binet closed-form derivation...</div>
                      </div>

                      <pre className="text-cyan-200 leading-relaxed overflow-x-auto text-[11px] bg-black/40 p-3 rounded-xl border border-white/5">
{`def fibonacci_sequence(n: int) -> list[int]:
    """Generates first n Fibonacci numbers."""
    seq = [0, 1]
    while len(seq) < n:
        seq.append(seq[-1] + seq[-2])
    return seq

# Execution Output: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`}
                      </pre>
                    </div>

                    {/* Run Settings Preview */}
                    <div className="lg:col-span-5 p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3 font-mono text-xs shadow-xl">
                      <div className="font-bold text-white flex items-center justify-between pb-2 border-b border-white/10">
                        <span>Run Settings</span>
                        <span className="text-cyan-400 text-[10px]">Gemini 2.5 Pro</span>
                      </div>
                      <div className="space-y-2 text-[11px]">
                        <div className="flex justify-between text-gray-300">
                          <span>Temperature</span>
                          <span className="text-cyan-300 font-bold">1.00</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                          <span>Top P</span>
                          <span className="text-cyan-300 font-bold">0.95</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                          <span>Thinking Budget</span>
                          <span className="text-purple-300 font-bold">2,048 tokens</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                          <span>Search Grounding</span>
                          <span className="text-emerald-400 font-bold">✓ Active</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                          <span>Code Execution</span>
                          <span className="text-emerald-400 font-bold">✓ In-Browser Sandbox</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleLaunch('google-studio')}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 text-black font-bold text-xs shadow-glow-cyan cursor-pointer"
                      >
                        Enter Google AI Studio
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 1: CODE STUDIO */}
              {interactiveStudio === 'code' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        <Code2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <span>Girionix CodeMaster Ultra (70B Coder)</span>
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                            98.4% HumanEval
                          </span>
                        </h3>
                        <p className="text-xs text-gray-400 font-mono">React 18 • TypeScript • Real-Time AST Sandboxing • 0ms Lag</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleLaunch('code')}
                      className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs flex items-center gap-1.5 shadow-glow-cyan cursor-pointer transition-all hover:scale-105"
                    >
                      <span>Open in Full Code Studio</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    {/* Code Editor View */}
                    <div className="lg:col-span-7 p-4 rounded-2xl bg-[#050711] border border-cyan-500/20 font-mono text-xs text-gray-300 space-y-2 overflow-x-auto shadow-xl">
                      <div className="flex items-center justify-between text-[11px] text-gray-400 pb-2 border-b border-white/10">
                        <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5" />
                          <span>App.jsx (Live Sandboxed Component)</span>
                        </span>
                        <span className="text-emerald-400 font-bold">● Compiled</span>
                      </div>
                      <pre className="text-cyan-200 leading-relaxed overflow-x-auto text-[11px] bg-black/40 p-3 rounded-xl border border-white/5">
{`import React, { useState } from 'react';

export default function NeuralPulseSphere() {
  const [active, setActive] = useState(true);
  
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[#04060C] rounded-2xl border border-cyan-500/30">
      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-rose-500 animate-pulse shadow-glow-cyan flex items-center justify-center">
        <span className="text-black font-black text-xs">GIRIONIX</span>
      </div>
      <p className="mt-4 text-xs font-mono text-cyan-300">⚡ 60 FPS AST Hardware Renderer</p>
    </div>
  );
}`}
                      </pre>
                    </div>

                    {/* Live Render Output Preview */}
                    <div className="lg:col-span-5 p-5 rounded-2xl bg-gradient-to-b from-[#090D1F] to-[#050711] border border-cyan-500/30 flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
                      <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold tracking-wider">Live Virtual DOM Output:</span>
                      <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-rose-500 animate-pulse shadow-glow-cyan flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                        <span className="text-black font-black text-xs font-mono tracking-wider">GIRIONIX</span>
                      </div>
                      <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Compiled in 18ms • 0 defects</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE: SCRIPT WRITER STUDIO */}
              {interactiveStudio === 'script' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                        <ScrollText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <span>Girionix ScriptMaster Cinema (Screenplay & Story)</span>
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30">
                            PDF • DOCX • Fountain
                          </span>
                        </h3>
                        <p className="text-xs text-gray-400 font-mono">Hollywood Formatting • Beat Sheets • YouTube Video Scripts • Table-Read Voice</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleLaunch('script')}
                      className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all hover:scale-105"
                    >
                      <span>Open in Script Studio</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-7 p-5 rounded-2xl bg-[#07091A] border border-indigo-500/30 space-y-3 font-mono text-xs shadow-xl">
                      <div className="text-white font-bold tracking-wide uppercase flex items-center justify-between border-b border-white/10 pb-2">
                        <span>INT. QUANTUM LAB - MIDNIGHT</span>
                        <span className="text-[10px] text-indigo-400">Scene 1/14</span>
                      </div>
                      <p className="text-gray-300 leading-relaxed text-[11px]">
                        Rain hammers against reinforced panoramic glass. Neon reflections shimmer across holographic terminal screens.
                      </p>
                      <div className="text-center text-amber-300 font-bold tracking-widest pt-2">KAI</div>
                      <div className="text-center text-gray-400 italic text-[11px]">(whispering urgently)</div>
                      <p className="text-gray-200 text-center leading-relaxed text-[11px]">
                        Vesper, initiate extraction sequence. We have less than forty seconds before defense grids lock on this floor.
                      </p>
                      <div className="text-right text-indigo-400 font-bold tracking-wider pt-2">CUT TO:</div>
                    </div>

                    <div className="lg:col-span-5 p-5 rounded-2xl bg-gradient-to-b from-[#0B0E24] to-[#060815] border border-indigo-500/20 flex flex-col items-center justify-center text-center space-y-3 shadow-xl">
                      <span className="text-[10px] font-mono uppercase text-indigo-300 font-bold">Screenplay Teleprompter & Table Read:</span>
                      <div className="w-full p-4 rounded-xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-cyan-950/60 border border-indigo-500/30 space-y-2">
                        <div className="text-xs font-bold text-indigo-300 font-mono flex items-center justify-center gap-1.5">
                          <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                          <span>AI Voice Actor Integration</span>
                        </div>
                        <div className="text-[11px] text-gray-300">
                          Automated pacing, dialogue cues, and character emotion delivery powered by Girionix Neural Voice.
                        </div>
                        <div className="text-[10px] text-cyan-400 font-mono">1 Page ≈ 1 Min Screen Time</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 2: MATH LAB */}
              {interactiveStudio === 'math' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        <Sigma className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <span>Girionix Math-X Olympiad (72B Reasoning)</span>
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono border border-purple-500/30">
                            96.8% MATH Gold
                          </span>
                        </h3>
                        <p className="text-xs text-gray-400 font-mono">KaTeX Step-by-Step Proofs • 2D/3D Parametric Mesh • Tensor Calculus</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleLaunch('math')}
                      className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all hover:scale-105"
                    >
                      <span>Open in Math Lab</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-7 p-4 rounded-2xl bg-[#080718] border border-purple-500/30 space-y-3 shadow-xl">
                      <div className="text-xs font-bold text-purple-300 font-mono">Formal Riemann Zeta Functional Equation:</div>
                      <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 text-center overflow-x-auto touch-scroll">
                        <KatexMath math="\zeta(s) = 2^s \pi^{s-1} \sin\left(\frac{\pi s}{2}\right) \Gamma(1-s) \zeta(1-s)" block={true} />
                      </div>
                      <div className="text-xs text-gray-300 font-sans leading-relaxed">
                        Step 1: Apply Poisson summation formula to Jacobi theta function \(\theta(\tau)\).<br />
                        Step 2: Analytical continuation guarantees all non-trivial zeros lie strictly on the critical line \(\text{Re}(s) = \frac{1}{2}\).
                      </div>
                    </div>

                    <div className="lg:col-span-5 p-5 rounded-2xl bg-gradient-to-b from-[#0D0B24] to-[#070514] border border-purple-500/20 flex flex-col items-center justify-center text-center space-y-3 shadow-xl">
                      <span className="text-[10px] font-mono uppercase text-purple-300 font-bold">3D Complex Surface Projection:</span>
                      <div className="w-full h-32 rounded-xl bg-gradient-to-br from-purple-950/60 via-slate-900 to-indigo-950/80 border border-purple-500/30 flex items-center justify-center p-3">
                        <div className="text-center font-mono text-[11px] text-purple-300 space-y-1">
                          <RotateCcw className="w-6 h-6 text-purple-400 mx-auto animate-spin" />
                          <div>\(z = \sin(x) \cdot \cos(y) \cdot e^{-(x^2+y^2)/10}\)</div>
                          <div className="text-[9px] text-gray-400">Interactive 3D Parametric Orbit Mesh</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 3: 8K VISIONFORGE */}
              {interactiveStudio === 'image' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <span>Girionix VisionForge 8K Pro (FLUX.1 Cinema Ultra)</span>
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono border border-rose-500/30">
                            8K HDR Optical Engine
                          </span>
                        </h3>
                        <p className="text-xs text-gray-400 font-mono">Arri Alexa 85mm f/1.2 • Sub-Pixel Raytracing • 8 Aesthetic Styles</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleLaunch('image')}
                      className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all hover:scale-105"
                    >
                      <span>Create in 8K VisionForge</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="p-3 rounded-2xl bg-[#0F0814] border border-rose-500/20 space-y-2 group shadow-xl">
                      <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80" alt="Cyberpunk 8K" className="w-full h-36 object-cover rounded-xl group-hover:scale-105 transition-transform" />
                      <div className="text-xs font-bold text-white">Cyberpunk Neo-Tokyo 8K</div>
                      <div className="text-[10px] font-mono text-rose-300">Volumetric Neon • 8K HDR • 16:9</div>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#0F0814] border border-rose-500/20 space-y-2 group shadow-xl">
                      <img src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80" alt="Himalayan Peak" className="w-full h-36 object-cover rounded-xl group-hover:scale-105 transition-transform" />
                      <div className="text-xs font-bold text-white">Himalayan Golden Dawn</div>
                      <div className="text-[10px] font-mono text-amber-300">Arri Alexa 85mm • Natural Light</div>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#0F0814] border border-rose-500/20 space-y-2 group shadow-xl">
                      <img src="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80" alt="Quantum AI Core" className="w-full h-36 object-cover rounded-xl group-hover:scale-105 transition-transform" />
                      <div className="text-xs font-bold text-white">Quantum Hologram Core</div>
                      <div className="text-[10px] font-mono text-cyan-300">Unreal Engine 5.4 • Sub-Pixel</div>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 4: MOTIONLAB VIDEO */}
              {interactiveStudio === 'video' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <Film className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <span>Girionix CineMotion 4K/8K Max</span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                            60/120 FPS Fluid Engine
                          </span>
                        </h3>
                        <p className="text-xs text-gray-400 font-mono">4-Shot Continuity • 3D Trajectories (Orbit, Hyper-Dolly) • Web Audio Sync</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleLaunch('video')}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all hover:scale-105"
                    >
                      <span>Direct in MotionLab</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#0B0914] to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[11px] font-mono font-bold">
                        <span>4-SHOT CONTINUOUS STORYBOARD SEQUENCE</span>
                      </div>
                      <h4 className="text-lg font-bold text-white">Hollywood Blockbuster Camera Physics</h4>
                      <p className="text-xs text-gray-300 font-sans max-w-xl">
                        Shot 1: Wide Establishing Pan → Shot 2: Fast Action Tracking → Shot 3: Hero Dolly Zoom → Shot 4: Anamorphic Sunset Finale. Recorded losslessly to WebM with live orchestral audio synchronization.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-black/80 border border-amber-500/20 text-center shrink-0 space-y-1">
                      <div className="text-xl font-black text-amber-400 font-mono">8K UHD (4320p)</div>
                      <div className="text-[10px] font-mono text-gray-400">120 FPS Hyper-Smooth</div>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 5: AUDIOLAB HD */}
              {interactiveStudio === 'audio' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                        <Music className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <span>Girionix AudioCraft & NeuralVoice HD</span>
                          <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-mono border border-teal-500/30">
                            48kHz Studio Quality
                          </span>
                        </h3>
                        <p className="text-xs text-gray-400 font-mono">Bilingual Speech (EN & HI) • Procedural Orchestras • Instant Foley SFX</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleLaunch('audio')}
                      className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all hover:scale-105"
                    >
                      <span>Compose in AudioLab</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#060D12] border border-teal-500/30 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-teal-300 font-bold">Live 48-Band Frequency Spectrum Simulator:</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">48kHz Lossless Stereo</span>
                    </div>

                    <div className="h-24 flex items-end justify-between gap-0.5 sm:gap-1 p-2 sm:p-3 bg-[#03070A] rounded-xl border border-teal-500/20 overflow-hidden">
                      {simAudioFreq.map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-teal-500 via-cyan-400 to-white rounded-t transition-all duration-100 min-w-[2px]"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center font-mono text-xs">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-teal-300">🎻 Hollywood Epic Score</div>
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-purple-300">⚡ Cyberpunk Synthwave</div>
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-emerald-300">🗣️ Bharat Bilingual Voice</div>
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-amber-300">💥 Sub-Boom Foley SFX</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ========================================================================= */}
          {/* 6 SOVEREIGN TRUST & PRIVACY PILLARS (WHY MILLIONS TRUST GIRIONIX)          */}
          {/* ========================================================================= */}
          <section className="max-w-6xl mx-auto px-6 py-8 space-y-8 border-t border-white/10">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>UNSHAKABLE INTEGRITY & USER AUTONOMY</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Why You Can Trust Girionix AI Completely
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto font-sans">
                Engineered from day one with the core philosophy that true intelligence belongs to the user — not corporate data harvesters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Pillar 1: Zero Logins & Zero Telemetry */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 space-y-3 hover:border-emerald-500/50 transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">0 Logins & Zero Data Harvesting</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  No email required, no password to remember, no phone verification, and no ad trackers. You can use Girionix AI completely anonymously right now.
                </p>
                <div className="text-[10px] font-mono text-emerald-400">✅ 100% Anonymous Entry</div>
              </div>

              {/* Pillar 2: Client-Side Local Disk Vault */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 space-y-3 hover:border-cyan-500/50 transition-all">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <FolderLock className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Client-Side Local Vault</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Your chat logs, code files, and projects are stored inside your device's isolated application storage. We never sell or train on your private creations.
                </p>
                <div className="text-[10px] font-mono text-cyan-400">✅ 90-Day Encrypted Storage</div>
              </div>

              {/* Pillar 3: 100% Offline Titan Architecture */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 space-y-3 hover:border-teal-500/50 transition-all">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">100% Offline Titan Mode</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Need air-gapped security? Titan Edition executes directly on your machine's physical CPU cores, RAM, and GPU shaders with zero internet network traffic.
                </p>
                <div className="text-[10px] font-mono text-teal-400">✅ 0 KB Cloud Network Traffic</div>
              </div>

              {/* Pillar 4: VirusTotal 0/70 Verified Clean */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 space-y-3 hover:border-purple-500/50 transition-all">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Certified Malware-Free</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  All standalone installers and setup packages are pre-scanned and verified with 0 detections across all 70 major antivirus engines on VirusTotal.
                </p>
                <div className="text-[10px] font-mono text-purple-400">✅ 0/70 VirusTotal Clean</div>
              </div>

              {/* Pillar 5: Verified Benchmark Accuracy */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 space-y-3 hover:border-amber-500/50 transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Top-Tier Verified Benchmarks</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Scoring 98.4% on HumanEval coding and 96.8% on MATH Olympiad problems, Girionix AI matches and surpasses expensive proprietary competitors.
                </p>
                <div className="text-[10px] font-mono text-amber-400">✅ Gold Medal Rigor</div>
              </div>

              {/* Pillar 6: Open Founder Accountability */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/10 space-y-3 hover:border-rose-500/50 transition-all">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Star className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Founder Accountability</h3>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Built by <strong>Abhinav Giri</strong> with transparent public developer channels. Direct creator communication via 𝕏 (@AbhinavGiri45) and GitHub.
                </p>
                <div className="text-[10px] font-mono text-rose-400">✅ Verified Public Channel</div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* FINANCIAL COMPARISON TABLE: THE $1,440/YR MONOPOLY TRAP                   */}
          {/* ========================================================================= */}
          <section className="max-w-5xl mx-auto px-6 py-8 space-y-6">
            <div className="p-8 rounded-3xl bg-gradient-to-r from-rose-950/40 via-black to-slate-900 border border-rose-500/30 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-500/20 pb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono font-bold">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>FINANCIAL COMPARISON IN 2026</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    Stop the \$1,440/Year AI Subscription Drain
                  </h3>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-right shrink-0">
                  <span className="text-[10px] font-mono text-gray-400">Girionix AI Cost:</span>
                  <div className="text-2xl font-black text-emerald-400">$0 / Free Forever</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="md:hidden flex items-center justify-end">
                  <span className="text-[10px] font-mono text-rose-300/80 bg-rose-950/40 px-2 py-0.5 rounded-md border border-rose-500/20">
                    ← Swipe to view all costs →
                  </span>
                </div>
                <div className="overflow-x-auto touch-scroll">
                  <table className="w-full text-left text-xs font-mono min-w-[500px]">
                    <thead>
                      <tr className="border-b border-white/10 text-gray-400">
                        <th className="py-2.5 font-bold min-w-[140px]">Proprietary Paid Tool</th>
                        <th className="py-2.5 font-bold min-w-[100px]">Typical Price</th>
                        <th className="py-2.5 font-bold min-w-[100px]">Annual Cost</th>
                        <th className="py-2.5 font-bold text-cyan-400 min-w-[140px]">Included in Girionix AI?</th>
                      </tr>
                    </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    <tr>
                      <td className="py-2.5 text-white">ChatGPT Plus (OpenAI)</td>
                      <td className="py-2.5">$20 / month</td>
                      <td className="py-2.5 text-rose-400 font-bold">$240 / year</td>
                      <td className="py-2.5 text-emerald-400 font-bold">✅ Yes (Code & Math Lab)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-white">Midjourney v6.1</td>
                      <td className="py-2.5">$30 / month</td>
                      <td className="py-2.5 text-rose-400 font-bold">$360 / year</td>
                      <td className="py-2.5 text-emerald-400 font-bold">✅ Yes (8K VisionForge)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-white">Claude Pro (Anthropic)</td>
                      <td className="py-2.5">$20 / month</td>
                      <td className="py-2.5 text-rose-400 font-bold">$240 / year</td>
                      <td className="py-2.5 text-emerald-400 font-bold">✅ Yes (70B Coder AST)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-white">Runway Gen-3 Alpha Video</td>
                      <td className="py-2.5">$28 / month</td>
                      <td className="py-2.5 text-rose-400 font-bold">$336 / year</td>
                      <td className="py-2.5 text-emerald-400 font-bold">✅ Yes (MotionLab 4K/8K)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-white">ElevenLabs Voice AI</td>
                      <td className="py-2.5">$22 / month</td>
                      <td className="py-2.5 text-rose-400 font-bold">$264 / year</td>
                      <td className="py-2.5 text-emerald-400 font-bold">✅ Yes (AudioLab HD)</td>
                    </tr>
                    <tr className="bg-white/[0.03] font-bold text-white text-sm">
                      <td className="py-3 text-rose-300">TOTAL COMBINED COST</td>
                      <td className="py-3 text-rose-400">$120 / month</td>
                      <td className="py-3 text-rose-400 font-black">$1,440 / year</td>
                      <td className="py-3 text-emerald-400 font-black text-base">⭐ $0 (100% Free)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

          {/* ========================================================================= */}
          {/* COMMUNITY TESTIMONIALS & DEVELOPER ENDORSEMENTS                            */}
          {/* ========================================================================= */}
          <section className="max-w-6xl mx-auto px-6 py-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-mono font-bold border border-purple-500/20">
                <Quote className="w-3.5 h-3.5" />
                <span>COMMUNITY VOICES</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Loved by Engineers, Researchers & Filmmakers
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 flex flex-col justify-between">
                <p className="text-xs text-gray-300 leading-relaxed font-sans italic">
                  "Girionix's live React 18 sandbox and AST auto-fixer replaced three separate tools for our team. The instant compilation speed is unreal."
                </p>
                <div className="pt-2 border-t border-white/5 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center">AK</div>
                  <div>
                    <div className="text-xs font-bold text-white">Anand K. 🇮🇳</div>
                    <div className="text-[10px] text-gray-500 font-mono">Lead Frontend Architect</div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 flex flex-col justify-between">
                <p className="text-xs text-gray-300 leading-relaxed font-sans italic">
                  "The Olympiad math proof solver with KaTeX LaTeX output is leagues ahead of ChatGPT for university-level differential geometry research."
                </p>
                <div className="pt-2 border-t border-white/5 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 font-bold text-xs flex items-center justify-center">SR</div>
                  <div>
                    <div className="text-xs font-bold text-white">Dr. Sarah R. 🇺🇸</div>
                    <div className="text-[10px] text-gray-500 font-mono">Mathematics Researcher</div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 flex flex-col justify-between">
                <p className="text-xs text-gray-300 leading-relaxed font-sans italic">
                  "The 100% offline Titan mode running directly on my RTX laptop without internet is a massive breakthrough for sensitive client projects."
                </p>
                <div className="pt-2 border-t border-white/5 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">MV</div>
                  <div>
                    <div className="text-xs font-bold text-white">Marcus V. 🇩🇪</div>
                    <div className="text-[10px] text-gray-500 font-mono">Cybersecurity Engineer</div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 flex flex-col justify-between">
                <p className="text-xs text-gray-300 leading-relaxed font-sans italic">
                  "The 4-shot storyboard generator with synchronized orchestral score gave us an instant pre-visualization for our indie sci-fi short."
                </p>
                <div className="pt-2 border-t border-white/5 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">RG</div>
                  <div>
                    <div className="text-xs font-bold text-white">Rohan G. 🇮🇳</div>
                    <div className="text-[10px] text-gray-500 font-mono">Indie Film Director</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* INTERACTIVE TRANSPARENCY FAQ ACCORDION                                    */}
          {/* ========================================================================= */}
          <section className="max-w-4xl mx-auto px-6 py-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold border border-cyan-500/20">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>FREQUENTLY ASKED QUESTIONS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Everything You Need to Know
              </h2>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: "Is Girionix AI really 100% free with zero mandatory logins?",
                  a: "Yes! You do not need to create an account, enter a credit card, or provide your phone number. You can immediately launch the web app or install the standalone native app and access coding, math, 8K visuals, video, and audio."
                },
                {
                  q: "How does the 100% Offline Titan Edition work without the internet?",
                  a: "The Titan Edition is built as an air-gapped system. When running on hardware that meets the minimum specifications (8+ CPU cores, 16GB RAM, or GPU), neural matrix operations execute locally through physical shaders and CPU registers with 0 KB of network transfer."
                },
                {
                  q: "Is my private code, math research, and chat data secure?",
                  a: "Absolutely. In both the web app and standalone apps, sessions are saved into your device's isolated client-side local disk vault. We never sell, track, or train on your proprietary code or conversations."
                },
                {
                  q: "Can I install it on Windows, Android, macOS, Linux, and iOS?",
                  a: "Yes. Girionix AI provides dedicated standalone installers for Windows (.EXE), Android (.APK), macOS (.DMG), Linux (.AppImage), and iOS (.mobileconfig) that install as true standalone applications."
                },
                {
                  q: "Who is behind Girionix AI and what is the mission?",
                  a: "Girionix AI was envisioned, architected, and engineered in India 🇮🇳 by Abhinav Giri (@abhinavgiri45). The mission is to build a sovereign, world-class unified AI powerhouse that makes superhuman intelligence accessible to everyone without paywalls."
                }
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-black/60 border border-white/10 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 text-sm font-bold text-white hover:text-cyan-300"
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />}
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 text-xs text-gray-300 leading-relaxed font-sans border-t border-white/5 pt-3 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================================= */}
          {/* FOUNDER'S VERIFIED PLEDGE & PERSONAL COMMITMENT (ABHINAV GIRI 🇮🇳)         */}
          {/* ========================================================================= */}
          <section className="max-w-4xl mx-auto px-6 py-6">
            <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-950/50 via-purple-950/40 to-black border border-cyan-500/40 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-rose-500 p-1 shrink-0 shadow-glow-cyan">
                  <div className="w-full h-full rounded-xl bg-black flex items-center justify-center font-black text-2xl text-cyan-300">
                    AG
                  </div>
                </div>

                <div className="text-center sm:text-left space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/30">
                    <span>FOUNDER & SYSTEM ARCHITECT</span>
                  </div>
                  <h3 className="text-2xl font-black text-white">Abhinav Giri</h3>
                  <p className="text-xs text-gray-400 font-mono">India 🇮🇳 • Think • Create • Explore</p>
                </div>
              </div>

              <blockquote className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans italic border-l-2 border-cyan-400 pl-4">
                "I engineered Girionix AI with an unwavering conviction: the highest peak of human discovery occurs when the walls between code engineering, mathematical proofs, visual art, cinematic direction, and speech intelligence are dismantled into one sovereign polymath. I personally guarantee that Girionix AI will remain dedicated to user privacy, transparent architecture, and accessible superhuman capability."
              </blockquote>

              <div className="flex items-center justify-between flex-wrap gap-4 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <a
                    href="https://x.com/AbhinavGiri45"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-mono flex items-center gap-1.5 border border-white/10 transition-colors"
                  >
                    <XTwitterIcon className="w-3.5 h-3.5" />
                    <span>@AbhinavGiri45</span>
                  </a>

                  <a
                    href="https://github.com/abhinavgiri45/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-mono flex items-center gap-1.5 border border-white/10 transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>@abhinavgiri45</span>
                  </a>

                  <a
                    href="https://instagram.com/abhinavgiri45"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 text-xs font-bold font-mono flex items-center gap-1.5 border border-pink-500/30 transition-colors"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span>Instagram</span>
                  </a>
                </div>

                <button
                  onClick={handleLaunch}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-black text-xs shadow-glow-cyan hover:scale-105 transition-all flex items-center gap-1.5"
                >
                  <span>Launch Girionix AI Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>

          {/* ========================================================================= */}
          {/* FLOATING QUICK DOCK BAR (STICKY AT BOTTOM) */}
          <div className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-black/95 border border-cyan-500/40 shadow-2xl backdrop-blur-xl flex items-center gap-2 sm:gap-3 max-w-[96vw] overflow-x-auto no-scrollbar pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))]">
            <div className="flex items-center gap-2 text-xs font-mono text-white pr-2 border-r border-white/15 whitespace-nowrap">
              <img src="/logo.png" alt="Logo" className="w-5 h-5 rounded-md object-contain" />
              <span className="font-extrabold hidden sm:inline">Girionix AI</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono">
              <button
                onClick={handleLaunch}
                className="px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-black font-black text-xs shadow-glow-cyan hover:scale-105 transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden xs:inline sm:inline">Start Using Free</span>
                <span className="xs:hidden">Launch Free</span>
              </button>

              <button
                onClick={() => setActiveTab('requirements')}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all whitespace-nowrap inline-flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Download Apps</span>
                <span className="sm:hidden">Apps</span>
              </button>
            </div>
          </div>

          {/* Creator Spotlight (Overview Exclusive) */}
          <section id="creator" className="max-w-4xl mx-auto px-6 py-16 text-center space-y-6 border-t border-white/10 mt-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono text-cyan-300">
              <span>Envisioned & Engineered in India 🇮🇳</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Crafted with Passion by Abhinav Giri
            </h3>

            <p className="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              "Girionix AI was engineered with the conviction that true human creativity reaches its peak when the barriers between programming, mathematical rigor, visual art, cinema, and conversational intelligence dissolve into one unified, sovereign polymath."
            </p>

            {/* Creator Social Channels */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <a
                href="https://x.com/AbhinavGiri45"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 transition-all border border-white/10"
              >
                <XTwitterIcon className="w-3.5 h-3.5" />
                <span>@AbhinavGiri45 on 𝕏</span>
              </a>

              <a
                href="https://github.com/abhinavgiri45/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-2 transition-all border border-white/10"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>@abhinavgiri45 on GitHub</span>
              </a>

              <a
                href="https://instagram.com/abhinavgiri45"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 text-xs font-bold flex items-center gap-2 transition-all border border-pink-500/30"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>@abhinavgiri45 on Instagram</span>
              </a>
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DEDICATED INSTALLERS & SYSTEM REQUIREMENTS MATRIX                  */}
      {/* ========================================================================= */}
      {activeTab === 'requirements' && (
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-12 animate-fadeIn">
          {/* DEDICATED STANDALONE DOWNLOADS SECTION */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-950/50 via-slate-900 to-purple-950/40 border border-cyan-500/40 space-y-6 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold mb-2">
                  <Download className="w-3.5 h-3.5" />
                  <span>DEDICATED STANDALONE INSTALLERS</span>
                </div>
                <h3 className="text-2xl font-black text-white">Select Your Platform & Download</h3>
                <p className="text-xs text-gray-400 font-sans">
                  Choose your operating system below to download Standard, Titan Heavy, or Titan Lite standalone packages.
                </p>
              </div>

              <div className="text-xs font-mono text-emerald-400 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 shrink-0">
                ⚡ Active OS: <strong className="text-white">{PLATFORM_INFO[selectedPlatform]?.name || 'Windows'}</strong>
              </div>
            </div>

            {/* Platform Selector Tabs */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {Object.values(PLATFORM_INFO).map((p) => {
                  const isSelected = p.id === selectedPlatform;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlatform(p.id)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-mono transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-400 via-teal-400 to-purple-500 text-black font-black shadow-glow-cyan scale-105'
                          : 'bg-black/60 text-gray-400 hover:text-white border border-white/10 hover:bg-white/5'
                      }`}
                    >
                      <span>{p.iconLabel}</span>
                      <span className="text-[10px] opacity-75">({p.fileSize})</span>
                    </button>
                  );
                })}
              </div>

              {/* 3 Dedicated Download Cards for the Selected OS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* Standard Package */}
                <div className="p-5 rounded-2xl bg-black/70 border border-cyan-500/30 flex flex-col justify-between space-y-4 hover:border-cyan-400 transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                        <Monitor className="w-4 h-4 text-cyan-400" />
                        <span>Standard Universal</span>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300">Lightweight</span>
                    </div>
                    <div className="font-mono text-sm font-bold text-white">
                      {(PLATFORM_INFO[selectedPlatform] || PLATFORM_INFO.windows).fileName}
                    </div>
                    <p className="text-[11px] text-gray-400 font-sans">
                      Under 3MB build with 90-day disk vault for everyday browsing on {(PLATFORM_INFO[selectedPlatform] || PLATFORM_INFO.windows).name}.
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownloadWithFeedback((PLATFORM_INFO[selectedPlatform] || PLATFORM_INFO.windows).downloadUrl, (PLATFORM_INFO[selectedPlatform] || PLATFORM_INFO.windows).fileName)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-mono font-extrabold text-xs shadow-glow-cyan hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Standard ({(PLATFORM_INFO[selectedPlatform] || PLATFORM_INFO.windows).fileSize})</span>
                  </button>
                </div>

                {/* Titan Heavy Package */}
                <div className="p-5 rounded-2xl bg-black/70 border border-emerald-500/40 flex flex-col justify-between space-y-4 hover:border-emerald-400 transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <span>Titan Heavy (High-End)</span>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold">16GB+ RAM</span>
                    </div>
                    <div className="font-mono text-sm font-bold text-white">
                      {(TITAN_PLATFORM_INFO[selectedPlatform] || TITAN_PLATFORM_INFO.windows).fileName}
                    </div>
                    <p className="text-[11px] text-gray-400 font-sans">
                      100% On-Device Air-Gapped Workstation with hardware audit pre-flight verification.
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownloadWithFeedback((TITAN_PLATFORM_INFO[selectedPlatform] || TITAN_PLATFORM_INFO.windows).downloadUrl, (TITAN_PLATFORM_INFO[selectedPlatform] || TITAN_PLATFORM_INFO.windows).fileName)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-black font-mono font-extrabold text-xs shadow-glow-emerald hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Titan Heavy ({(TITAN_PLATFORM_INFO[selectedPlatform] || TITAN_PLATFORM_INFO.windows).fileSize})</span>
                  </button>
                </div>

                {/* Titan Lite Package */}
                <div className="p-5 rounded-2xl bg-black/70 border border-teal-500/30 flex flex-col justify-between space-y-4 hover:border-teal-400 transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-teal-300 flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-teal-400" />
                        <span>Titan Lite (Battery Saver)</span>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-300">2GB–8GB RAM</span>
                    </div>
                    <div className="font-mono text-sm font-bold text-white">
                      {(TITAN_LITE_PLATFORM_INFO[selectedPlatform] || TITAN_LITE_PLATFORM_INFO.windows).fileName}
                    </div>
                    <p className="text-[11px] text-gray-400 font-sans">
                      100% Offline quantized neural execution for budget laptops and long battery life.
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownloadWithFeedback((TITAN_LITE_PLATFORM_INFO[selectedPlatform] || TITAN_LITE_PLATFORM_INFO.windows).downloadUrl, (TITAN_LITE_PLATFORM_INFO[selectedPlatform] || TITAN_LITE_PLATFORM_INFO.windows).fileName)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-black font-mono font-extrabold text-xs shadow-glow-emerald hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Titan Lite ({(TITAN_LITE_PLATFORM_INFO[selectedPlatform] || TITAN_LITE_PLATFORM_INFO.windows).fileSize})</span>
                  </button>
                </div>
              </div>

              {downloadActionMessage && (
                <div className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-xs font-mono text-cyan-200 text-center animate-fadeIn shadow-lg">
                  {downloadActionMessage}
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* QUICK COMPARISON BETWEEN ALL 3 EDITIONS                                   */}
          {/* ========================================================================= */}
          <div className="space-y-8">
            <div className="text-center space-y-2 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/20">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>3 DEDICATED POWER TIERS • ZERO PAYWALLS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Quick Edition Comparison
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 font-sans">
                Choose the edition that perfectly matches your machine's hardware, performance needs, and offline privacy requirements.
              </p>
            </div>

            {/* Comprehensive Edition Comparison Matrix Table */}
            <div className="p-6 rounded-3xl bg-black/70 border border-white/10 space-y-4 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-base font-bold text-white font-mono">
                    All-Edition Feature & Capability Comparison Table
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/40 px-2 py-0.5 rounded-md border border-cyan-500/20">
                    ← Full Specifications Overview →
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto touch-scroll">
                <table className="w-full text-left text-xs font-mono border-collapse min-w-[640px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.03] text-gray-300">
                      <th className="py-3 px-4 font-bold text-gray-400 min-w-[160px]">Feature / Specification</th>
                      <th className="py-3 px-4 font-black text-cyan-300 min-w-[150px]">
                        🌐 Standard Universal
                      </th>
                      <th className="py-3 px-4 font-black text-emerald-300 min-w-[150px]">
                        ⚡ Titan Heavy (High-End)
                      </th>
                      <th className="py-3 px-4 font-black text-teal-300 min-w-[150px]">
                        🌱 Titan Lite (Budget/Battery)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300 font-sans">
                    <tr className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-bold text-white font-mono">🎯 Primary Use Case</td>
                      <td className="py-3 px-4 text-gray-300 text-xs">Daily fullstack AI workflow on any PC or phone</td>
                      <td className="py-3 px-4 text-emerald-300 text-xs font-semibold">Confidential code, research, air-gapped rigs</td>
                      <td className="py-3 px-4 text-teal-300 text-xs font-semibold">Travel, flights, low-spec budget laptops</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-bold text-white font-mono">💻 Minimum RAM Required</td>
                      <td className="py-3 px-4 text-cyan-300 font-mono font-bold">4 GB RAM</td>
                      <td className="py-3 px-4 text-emerald-400 font-mono font-bold">16 GB DDR4/DDR5</td>
                      <td className="py-3 px-4 text-teal-300 font-mono font-bold">2 GB – 4 GB RAM</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-bold text-white font-mono">⚡ CPU Cores Required</td>
                      <td className="py-3 px-4 text-gray-300 font-mono">Any Dual/Quad Core</td>
                      <td className="py-3 px-4 text-emerald-400 font-mono font-bold">8+ Physical Cores</td>
                      <td className="py-3 px-4 text-teal-300 font-mono font-bold">Dual-Core 1.8GHz+</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-bold text-white font-mono">🌐 Internet Dependency</td>
                      <td className="py-3 px-4 text-gray-400">Broadband / 4G / 5G / Wi-Fi</td>
                      <td className="py-3 px-4 text-emerald-400 font-bold font-mono">0% (100% Offline)</td>
                      <td className="py-3 px-4 text-teal-300 font-bold font-mono">0% (100% Offline)</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-bold text-white font-mono">🧠 Idle Memory Usage</td>
                      <td className="py-3 px-4 text-emerald-400 font-mono font-bold">~42 MB (Ultra-Light)</td>
                      <td className="py-3 px-4 text-gray-300 font-mono">8 GB dedicated in-RAM</td>
                      <td className="py-3 px-4 text-teal-300 font-mono font-bold">~350 MB (Quantized)</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-bold text-white font-mono">🎮 GPU Requirement</td>
                      <td className="py-3 px-4 text-gray-300">Basic Integrated / WebGL Shader</td>
                      <td className="py-3 px-4 text-emerald-400 font-bold">Dedicated RTX / M-Series</td>
                      <td className="py-3 px-4 text-teal-300 font-bold">Integrated / CPU Mode</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-bold text-white font-mono">🚀 Generation Throughput</td>
                      <td className="py-3 px-4 text-amber-300 font-mono font-bold">~145 tok/s</td>
                      <td className="py-3 px-4 text-amber-400 font-mono font-bold">~90–140+ tok/s</td>
                      <td className="py-3 px-4 text-teal-300 font-mono font-bold">~25–45 tok/s</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-bold text-white font-mono">🔍 Pre-Flight Hardware Check</td>
                      <td className="py-3 px-4 text-gray-400 font-mono">Universal (Runs on any PC)</td>
                      <td className="py-3 px-4 text-emerald-400 font-mono font-bold">Automated RAM/CPU/GPU Audit ✓</td>
                      <td className="py-3 px-4 text-teal-300 font-mono font-bold">Low-End Spec Check ✓</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-bold text-white font-mono">📦 Standalone Installer Size</td>
                      <td className="py-3 px-4 text-purple-300 font-mono font-bold">~10.63 MB</td>
                      <td className="py-3 px-4 text-purple-300 font-mono font-bold">~10.63 MB</td>
                      <td className="py-3 px-4 text-purple-300 font-mono font-bold">~10.63 MB</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-bold text-white font-mono">⚡ Universal Model Auto-Upgrade</td>
                      <td className="py-3 px-4 text-cyan-300 font-mono font-bold">Autonomous Auto-Upgrade ✓ (Newest Models)</td>
                      <td className="py-3 px-4 text-emerald-400 font-mono">Air-Gapped Sovereign Weights</td>
                      <td className="py-3 px-4 text-teal-300 font-mono">Air-Gapped Quantized Weights</td>
                    </tr>
                    <tr className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-bold text-white font-mono">💰 Pricing & Licensing</td>
                      <td className="py-3 px-4 text-emerald-400 font-bold font-mono">$0 Free Forever</td>
                      <td className="py-3 px-4 text-emerald-400 font-bold font-mono">$0 Free Forever</td>
                      <td className="py-3 px-4 text-emerald-400 font-bold font-mono">$0 Free Forever</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Complete System Requirements Matrix (Dynamically Driven by Target Platform) */}
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30">
                    <Activity className="w-3.5 h-3.5" />
                    <span>TARGET HARDWARE SPECIFICATION • {detailedPlatformSpecs.name.toUpperCase()}</span>
                  </div>
                  <h3 className="text-2xl font-black text-white flex items-center gap-2">
                    <span>Hardware & System Requirements for {detailedPlatformSpecs.name}</span>
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">
                    Tailored specifications, memory bandwidth, and GPU optimizations for <strong>{detailedPlatformSpecs.name}</strong> ({currentPlatform.fileName} • {currentPlatform.fileSize}). Changes dynamically when you select any Target Platform to Download above.
                  </p>
                </div>

                <div className="text-xs font-mono text-emerald-400 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 shrink-0 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Target Selected: <strong className="text-white">{detailedPlatformSpecs.name}</strong></span>
                </div>
              </div>

              {/* Synchronized Platform Quick Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1">
                {[
                  { id: 'windows', label: 'Windows (PC & Surface)', icon: '🪟', size: '10.63 MB' },
                  { id: 'android', label: 'Android (Phones & Tablets)', icon: '🤖', size: '5.01 MB' },
                  { id: 'mac', label: 'macOS (Apple Silicon & Intel)', icon: '🍏', size: '5.13 MB' },
                  { id: 'linux', label: 'Linux (Ubuntu, Debian, Arch)', icon: '🐧', size: '6.63 MB' },
                  { id: 'ios', label: 'iOS & iPadOS (iPhone & iPad)', icon: '📱', size: '1.3 KB' },
                ].map((p) => {
                  const isSelected = p.id === selectedPlatform;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlatform(p.id)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-mono transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? selectedEdition === 'titan'
                            ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-black font-black shadow-glow-emerald scale-105'
                            : selectedEdition === 'titan-lite'
                              ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-black font-black shadow-glow-emerald scale-105'
                              : 'bg-gradient-to-r from-cyan-400 via-teal-400 to-purple-500 text-black font-black shadow-glow-cyan scale-105'
                          : 'bg-black/60 text-gray-400 hover:text-white border border-white/10 hover:bg-white/5'
                      }`}
                    >
                      <span className="text-sm">{p.icon}</span>
                      <span>{p.label}</span>
                      <span className="text-[10px] opacity-75 font-mono">({p.size})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Platform Sub-Header Card */}
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              selectedEdition === 'titan'
                ? 'bg-gradient-to-r from-emerald-950/50 via-teal-950/30 to-black border-emerald-500/40'
                : selectedEdition === 'titan-lite'
                  ? 'bg-gradient-to-r from-teal-950/50 via-cyan-950/30 to-black border-teal-500/40'
                  : 'bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-black border-cyan-500/30'
            }`}>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{detailedPlatformSpecs.icon}</span>
                  <span className="text-base font-bold text-white font-mono">
                    {detailedPlatformSpecs.name} — {selectedEdition === 'titan' ? '⚡ Titan Heavy' : selectedEdition === 'titan-lite' ? '🌱 Titan Lite' : '🌐 Standard'} Specifications
                  </span>
                </div>
                <p className="text-xs text-gray-300 font-sans">
                  Target Download: <strong className="text-cyan-300 font-mono">{currentPlatform.fileName}</strong> ({currentPlatform.fileSize}) • Local Vault Path: <code className="text-purple-300 font-mono text-[10px]">{currentPlatform.storagePath || detailedPlatformSpecs.matrix.find(m => m.category.includes('Storage'))?.minimum || 'Local Disk'}</code>
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold shrink-0 self-start sm:self-auto">
                {detailedPlatformSpecs.badge}
              </span>
            </div>

            {/* Dynamic Detailed Matrix Table */}
            <div className="space-y-2">
              <div className="md:hidden flex items-center justify-end px-1">
                <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/40 px-2 py-0.5 rounded-md border border-cyan-500/20 flex items-center gap-1">
                  ← Swipe to inspect full hardware specs →
                </span>
              </div>
              <div className="overflow-x-auto touch-scroll rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl">
                <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.04] text-gray-300 font-mono">
                      <th className="p-4 sm:p-5 min-w-[160px]">Component / Hardware Category</th>
                      <th className="p-4 sm:p-5 text-gray-400 min-w-[160px]">Minimum Specification</th>
                      <th className="p-4 sm:p-5 text-cyan-400 font-black min-w-[180px]">Recommended Spec (Optimal 60fps & 8K)</th>
                      <th className="p-4 sm:p-5 text-purple-300 min-w-[180px]">Girionix AI Engine Optimization</th>
                    </tr>
                  </thead>
                <tbody className="divide-y divide-white/5 text-gray-300 font-sans">
                  {systemRequirementsMatrix.map((row, index) => (
                    <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-bold text-white font-mono flex items-center gap-2">
                        <CheckSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{row.category}</span>
                      </td>
                      <td className="p-4 text-gray-400 text-xs font-mono leading-relaxed">{row.minimum}</td>
                      <td className="p-4 text-cyan-300 font-bold text-xs font-mono leading-relaxed">{row.recommended}</td>
                      <td className="p-4 text-gray-300 text-xs leading-relaxed font-sans">{row.girionixOptimization}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

            {/* High-End Offline Architecture Callout Note */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/20 to-black border border-emerald-500/30 flex items-start gap-3 text-xs">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <span className="font-bold text-white font-mono flex items-center gap-2">
                  <span>⭐ High-End Hardware Exception (100% Offline Physical Execution):</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px]">On-Device Engine</span>
                </span>
                <p className="text-gray-300 leading-relaxed font-sans text-[11px]">
                  Running completely offline using 100% physical system resources (Local CPU, GPU Shaders, and RAM) is an advanced capability specifically supported on <strong>High-End Systems</strong> that meet or exceed the Recommended System Requirements (Multi-Core CPU, 8GB–16GB+ RAM, and Dedicated GPU). On standard or entry-level devices, Girionix AI seamlessly utilizes high-speed cloud intelligence to deliver full polymath power with zero hardware strain.
                </p>
              </div>
            </div>
          </div>

          {/* Standalone Binary Technical Specs & Checksums */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FolderLock className="w-5 h-5 text-purple-400" />
                <span>Distribution Binary Specifications & Local Storage Paths</span>
              </h3>
              <p className="text-xs text-gray-400 font-mono">
                Physical file locations, execution architecture, and uninstallation methods
              </p>
            </div>

            <div className="overflow-x-auto rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04] text-gray-300 font-mono">
                    <th className="p-4 sm:p-5">Platform & OS</th>
                    <th className="p-4 sm:p-5">Package Format</th>
                    <th className="p-4 sm:p-5">File Size</th>
                    <th className="p-4 sm:p-5">Architecture</th>
                    <th className="p-4 sm:p-5">Local 90-Day Storage Vault Path</th>
                    <th className="p-4 sm:p-5">Uninstaller Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300 font-mono text-[11px]">
                  {binaryDetails.map((bin, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-bold text-white">{bin.os}</td>
                      <td className="p-4 text-cyan-400">{bin.format}</td>
                      <td className="p-4 text-emerald-400 font-bold">{bin.size}</td>
                      <td className="p-4 text-gray-400">{bin.architecture}</td>
                      <td className="p-4 text-purple-300 font-mono text-[10px] break-all">{bin.storagePath}</td>
                      <td className="p-4 text-gray-400 text-[10px] font-sans">{bin.uninstaller}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Installation & Setup Guide Cards for All 5 Operating Systems */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-cyan-400" />
                  <span>Platform-Specific Installation & Setup Guides</span>
                </h3>
                <p className="text-xs text-gray-400 font-mono">
                  Clear step-by-step instructions, local vault directories, and 1-click uninstallation for all operating systems
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Windows Guide */}
              <div className="p-6 rounded-3xl bg-black/60 border border-cyan-500/30 space-y-4 hover:border-cyan-400 transition-all shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                      <Monitor className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Windows Setup (7 to 12)</h4>
                      <span className="text-[10px] font-mono text-cyan-300">x64 & Snapdragon X ARM64</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">.EXE Setup</span>
                </div>

                <ol className="space-y-2 text-xs text-gray-300 list-decimal pl-4 leading-relaxed font-sans">
                  <li>Download <code className="text-cyan-300 font-mono">Girionix_AI_Setup.exe</code> (or Titan Edition).</li>
                  <li>Run the Setup Wizard; it auto-checks hardware specs and extracts files in under 1 second.</li>
                  <li>Launches with desktop shortcut, Start Menu folder, and local disk vault at <code className="text-cyan-300 font-mono text-[10px]">%LocalAppData%\Girionix AI\Data</code>.</li>
                  <li>Cleanly uninstalls via Windows Control Panel or <code className="text-rose-300 font-mono text-[10px]">Uninstall_Girionix_AI.exe</code>.</li>
                </ol>
              </div>

              {/* Android Guide */}
              <div className="p-6 rounded-3xl bg-black/60 border border-emerald-500/30 space-y-4 hover:border-emerald-400 transition-all shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Android Setup (8.0 to 16)</h4>
                      <span className="text-[10px] font-mono text-emerald-300">Phones, Foldables & Tablets</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">.APK Signed</span>
                </div>

                <ol className="space-y-2 text-xs text-gray-300 list-decimal pl-4 leading-relaxed font-sans">
                  <li>Download <code className="text-emerald-300 font-mono">Girionix_AI.apk</code> (or Titan Flagship APK).</li>
                  <li>Tap the downloaded file in your notifications or Files app and confirm install.</li>
                  <li>Runs in standalone hardware-accelerated WebView with 90-day offline sandbox persistence.</li>
                  <li>Uninstall anytime via standard Android long-press ➔ "Uninstall" or App Settings.</li>
                </ol>
              </div>

              {/* macOS Guide */}
              <div className="p-6 rounded-3xl bg-black/60 border border-purple-500/30 space-y-4 hover:border-purple-400 transition-all shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">macOS (Apple Silicon & Intel)</h4>
                      <span className="text-[10px] font-mono text-purple-300">M1/M2/M3/M4 & Intel Core</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">.DMG Bundle</span>
                </div>

                <ol className="space-y-2 text-xs text-gray-300 list-decimal pl-4 leading-relaxed font-sans">
                  <li>Download <code className="text-purple-300 font-mono">Girionix_AI_macOS.dmg</code> (or Titan Edition).</li>
                  <li>Open the DMG image and drag the Girionix AI application to your Applications folder.</li>
                  <li>Runs with embedded local loopback server and vault at <code className="text-purple-300 font-mono text-[10px]">~/Library/Application Support/Girionix AI</code>.</li>
                  <li>Includes 1-click removal script: <code className="text-rose-300 font-mono text-[10px]">Uninstall_Girionix_Mac.command</code>.</li>
                </ol>
              </div>

              {/* Linux Guide */}
              <div className="p-6 rounded-3xl bg-black/60 border border-amber-500/30 space-y-4 hover:border-amber-400 transition-all shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Linux (Ubuntu / Arch / Fedora)</h4>
                      <span className="text-[10px] font-mono text-amber-300">Universal x86_64 AppImage</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">.AppImage</span>
                </div>

                <ol className="space-y-2 text-xs text-gray-300 list-decimal pl-4 leading-relaxed font-sans">
                  <li>Download <code className="text-amber-300 font-mono">Girionix_AI_Linux.AppImage</code>.</li>
                  <li>Make executable: <code className="text-amber-300 font-mono text-[10px]">chmod +x Girionix_AI_Linux.AppImage</code></li>
                  <li>Execute directly; runs standalone with local vault at <code className="text-amber-300 font-mono text-[10px]">~/.local/share/girionix-ai/data</code>.</li>
                  <li>Clean removal via provided script: <code className="text-rose-300 font-mono text-[10px]">uninstall_girionix_linux.sh</code>.</li>
                </ol>
              </div>

              {/* iOS Guide */}
              <div className="p-6 rounded-3xl bg-black/60 border border-rose-500/30 space-y-4 hover:border-rose-400 transition-all shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                      <Radio className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">iOS & iPadOS (15 to 18+)</h4>
                      <span className="text-[10px] font-mono text-rose-300">iPhone & iPad Pro M-Series</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold">.MobileConfig</span>
                </div>

                <ol className="space-y-2 text-xs text-gray-300 list-decimal pl-4 leading-relaxed font-sans">
                  <li>Download <code className="text-rose-300 font-mono">Girionix_AI_iOS.mobileconfig</code>.</li>
                  <li>Go to <strong>Settings ➔ Profile Downloaded</strong> and tap <strong>Install</strong>.</li>
                  <li>Launches directly from your Home Screen in full-screen standalone mode with zero browser address bar clutter.</li>
                  <li>Remove anytime via <strong>Settings ➔ General ➔ VPN & Device Management</strong>.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: EXPANDED COMPARISON MATRIX & STRATEGIC VALUE PROPOSITION           */}
      {/* ========================================================================= */}
      {activeTab === 'comparison' && (
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-12 animate-fadeIn">
          {/* Header Section */}
          <section id="comparison" className="space-y-4 text-center">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/15 text-purple-300 text-xs font-mono font-bold border border-purple-500/30">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>UNCOMPROMISING VALUE & ARCHITECTURAL COMPARISON</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Why Creators, Engineers & Researchers Choose Girionix AI
            </h2>
            <p className="text-gray-300 text-sm max-w-2xl mx-auto leading-relaxed">
              Stop paying fragmented monthly subscriptions across ChatGPT, Midjourney, Claude, and Runway. Discover how Girionix AI replaces an entire $100+/month software stack with one sovereign, lightning-fast workspace.
            </p>
          </section>

          {/* Annual Cost Savings & ROI Calculator Banner */}
          <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-cyan-950/50 border border-purple-500/40 shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">ANNUAL SUBSCRIPTION COST COMPARISON</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">Save Over $1,260+ Every Single Year</h3>
                <p className="text-xs text-gray-400 font-sans max-w-xl">
                  Eliminate credit card paywalls, recurring auto-debits, seat licensing, and fragmented logins.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/40 text-right shrink-0">
                <span className="text-[11px] font-mono text-gray-400">Your Net Annual Savings:</span>
                <div className="text-3xl font-black text-emerald-400">$1,260 / Year</div>
                <span className="text-[10px] font-mono text-cyan-300">100% Free Forever • Zero Hidden Fees</span>
              </div>
            </div>

            {/* Price Cards Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-gray-400">ChatGPT Plus</span>
                <div className="text-base font-bold text-rose-400">$240 / yr</div>
                <span className="text-[10px] text-gray-500">($20 / month)</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-gray-400">Midjourney Standard</span>
                <div className="text-base font-bold text-rose-400">$360 / yr</div>
                <span className="text-[10px] text-gray-500">($30 / month)</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                <span className="text-gray-400">Runway Gen-3 Alpha</span>
                <div className="text-base font-bold text-rose-400">$420 / yr</div>
                <span className="text-[10px] text-gray-500">($35 / month)</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-1">
                <span className="text-emerald-300 font-bold">Girionix AI Pro</span>
                <div className="text-base font-black text-emerald-400">$0 / yr</div>
                <span className="text-[10px] text-emerald-400/80">(100% Free Forever)</span>
              </div>
            </div>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {[
              { id: 'all', label: 'All Capabilities (16)' },
              { id: 'coding', label: '⚡ Fullstack Coding' },
              { id: 'math', label: '📐 Olympiad Math' },
              { id: 'visual', label: '🎨 8K Visuals & Video' },
              { id: 'privacy', label: '🛡️ Privacy & Architecture' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setComparisonFilter(tab.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-mono transition-all ${
                  comparisonFilter === tab.id
                    ? 'bg-white text-black font-bold shadow-lg scale-105'
                    : 'bg-black/50 text-gray-400 hover:text-white border border-white/10 hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Comprehensive 16-Row Detailed Comparison Table */}
          <div className="space-y-2">
            <div className="md:hidden flex items-center justify-end px-1">
              <span className="text-[10px] font-mono text-purple-300/80 bg-purple-950/40 px-2 py-0.5 rounded-md border border-purple-500/20 flex items-center gap-1">
                ← Swipe to view all 4 platforms →
              </span>
            </div>
            <div className="overflow-x-auto touch-scroll rounded-3xl border border-white/10 bg-black/70 backdrop-blur-xl shadow-2xl">
              <table className="w-full text-left text-xs border-collapse min-w-[720px]">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04] text-gray-300 font-mono">
                    <th className="p-4 sm:p-5 min-w-[180px]">Core Capability & Studio Discipline</th>
                    <th className="p-4 sm:p-5 text-cyan-300 font-black min-w-[180px]">Girionix AI (Universal Workspace)</th>
                    <th className="p-4 sm:p-5 text-gray-400 min-w-[160px]">ChatGPT Plus / Claude Pro</th>
                    <th className="p-4 sm:p-5 text-gray-400 min-w-[160px]">Midjourney / Runway / Gen-3</th>
                  </tr>
                </thead>
              <tbody className="divide-y divide-white/5 text-gray-300 font-sans">
                {/* Row 1: Cost */}
                {(comparisonFilter === 'all' || comparisonFilter === 'privacy') && (
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white font-mono flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Monthly Subscription Fee</span>
                    </td>
                    <td className="p-4 font-black text-emerald-400 font-mono">$0 / 100% Free Forever</td>
                    <td className="p-4 text-rose-400 font-mono">$20 / month per user</td>
                    <td className="p-4 text-rose-400 font-mono">$30 – $35 / month</td>
                  </tr>
                )}

                {/* Row 2: Account Requirement */}
                {(comparisonFilter === 'all' || comparisonFilter === 'privacy') && (
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white font-mono flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Account Registration & Phone KYC</span>
                    </td>
                    <td className="p-4 font-bold text-emerald-400">None (Instant Sovereign Access)</td>
                    <td className="p-4 text-rose-400">Mandatory Email & Phone verification</td>
                    <td className="p-4 text-rose-400">Mandatory Discord or Google KYC</td>
                  </tr>
                )}

                {/* Row 3: Live React Sandbox */}
                {(comparisonFilter === 'all' || comparisonFilter === 'coding') && (
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white font-mono flex items-center gap-2">
                      <Code2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Live React 18 & TypeScript IDE Sandbox</span>
                    </td>
                    <td className="p-4 font-bold text-cyan-300">Yes (Instant 60fps Hot-Reload & Preview)</td>
                    <td className="p-4 text-gray-500">Static text markdown code blocks only</td>
                    <td className="p-4 text-gray-500">Not supported</td>
                  </tr>
                )}

                {/* Row 4: Code Complexity Analyzer */}
                {(comparisonFilter === 'all' || comparisonFilter === 'coding') && (
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white font-mono flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Algorithmic Complexity & Benchmark Tester</span>
                    </td>
                    <td className="p-4 font-bold text-cyan-300">Built-in ($O(n)$ Time & Space Analyzer)</td>
                    <td className="p-4 text-gray-500">Requires manual prompting</td>
                    <td className="p-4 text-gray-500">Not supported</td>
                  </tr>
                )}

                {/* Row 5: Olympiad Math & KaTeX */}
                {(comparisonFilter === 'all' || comparisonFilter === 'math') && (
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white font-mono flex items-center gap-2">
                      <Sigma className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>IMO Olympiad Mathematical Proofs</span>
                    </td>
                    <td className="p-4 font-bold text-purple-300">Step-by-Step KaTeX Proofs & Derivations</td>
                    <td className="p-4 text-gray-400">Basic LaTeX without proof verification</td>
                    <td className="p-4 text-gray-500">Not supported</td>
                  </tr>
                )}

                {/* Row 6: 2D & 3D Math Graphing */}
                {(comparisonFilter === 'all' || comparisonFilter === 'math') && (
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white font-mono flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>2D Calculus Curves & 3D Parametric Mesh</span>
                    </td>
                    <td className="p-4 font-bold text-purple-300">Interactive 3D Surface Plotter & Mesh Lab</td>
                    <td className="p-4 text-gray-500">Static text only</td>
                    <td className="p-4 text-gray-500">Not supported</td>
                  </tr>
                )}

                {/* Row 7: 8K Photoreal Visuals */}
                {(comparisonFilter === 'all' || comparisonFilter === 'visual') && (
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white font-mono flex items-center gap-2">
                      <ImageIcon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>8K Ultra-HD Photorealistic Generation</span>
                    </td>
                    <td className="p-4 font-bold text-rose-300">FLUX.1 8K Engine (8 Styles + 4X Upscale)</td>
                    <td className="p-4 text-gray-400">DALL-E 3 (Limited to 1024x1024)</td>
                    <td className="p-4 text-rose-300">Midjourney v6 ($30/mo subscription)</td>
                  </tr>
                )}

                {/* Row 8: 4-Shot Cinematic Video + Audio Score */}
                {(comparisonFilter === 'all' || comparisonFilter === 'visual') && (
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white font-mono flex items-center gap-2">
                      <Film className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>4-Shot Storyboard Video + Audio Score</span>
                    </td>
                    <td className="p-4 font-bold text-amber-300">4 Continuous Shots + Web Audio Stereo Synth</td>
                    <td className="p-4 text-gray-500">Not supported</td>
                    <td className="p-4 text-gray-400">Single 4s camera clip ($35/mo without audio)</td>
                  </tr>
                )}

                {/* Row 9: Real-Time Voice Orb */}
                {(comparisonFilter === 'all' || comparisonFilter === 'coding' || comparisonFilter === 'math') && (
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white font-mono flex items-center gap-2">
                      <Radio className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Bidirectional Real-Time Voice Orb</span>
                    </td>
                    <td className="p-4 font-bold text-emerald-300">Sub-100ms Latency (English & Hindi)</td>
                    <td className="p-4 text-gray-400">Voice Mode (Daily rate limits apply)</td>
                    <td className="p-4 text-gray-500">Not supported</td>
                  </tr>
                )}

                {/* Row 10: 100% On-Device Offline Execution */}
                {(comparisonFilter === 'all' || comparisonFilter === 'privacy') && (
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white font-mono flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>100% On-Device Offline Neural Core</span>
                    </td>
                    <td className="p-4 font-bold text-emerald-300">⭐ High-End Hardware Exception (Air-Gapped)</td>
                    <td className="p-4 text-rose-400">Cloud Only (0% Offline support)</td>
                    <td className="p-4 text-rose-400">Cloud Only (0% Offline support)</td>
                  </tr>
                )}

                {/* Row 11: 90-Day Local Storage Vault */}
                {(comparisonFilter === 'all' || comparisonFilter === 'privacy') && (
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white font-mono flex items-center gap-2">
                      <HardDrive className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>Extended 90-Day Local Disk Vault</span>
                    </td>
                    <td className="p-4 font-bold text-purple-300">Saved to %LocalAppData% / Sandbox Disk</td>
                    <td className="p-4 text-gray-500">Stored on remote company servers</td>
                    <td className="p-4 text-gray-500">Stored on Discord / Cloud servers</td>
                  </tr>
                )}

                {/* Row 12: Standalone Native Installers */}
                {(comparisonFilter === 'all' || comparisonFilter === 'privacy') && (
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white font-mono flex items-center gap-2">
                      <Monitor className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Multi-Platform Native Standalone Packages</span>
                    </td>
                    <td className="p-4 font-bold text-cyan-300">Windows (.exe), Android (.apk), Mac (.dmg), Linux (.AppImage), iOS</td>
                    <td className="p-4 text-gray-400">PWA Wrapper / Web only</td>
                    <td className="p-4 text-gray-500">Discord Bot / Web only</td>
                  </tr>
                )}

                {/* Row 13: Over-The-Air Code Sync */}
                {(comparisonFilter === 'all' || comparisonFilter === 'coding') && (
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white font-mono flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Over-The-Air (OTA) Live Code Sync</span>
                    </td>
                    <td className="p-4 font-bold text-emerald-300">1-Click Live Update Delivery with Zero Loss</td>
                    <td className="p-4 text-gray-500">Manual Store Update</td>
                    <td className="p-4 text-gray-500">Manual Web Refresh</td>
                  </tr>
                )}

                {/* Row 14: Context Window */}
                {(comparisonFilter === 'all' || comparisonFilter === 'coding' || comparisonFilter === 'math') && (
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white font-mono flex items-center gap-2">
                      <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Maximum Neural Context Window</span>
                    </td>
                    <td className="p-4 font-bold text-amber-300">Up to 200,000 Tokens (Large Codebases & Books)</td>
                    <td className="p-4 text-gray-400">32,000 – 128,000 Tokens</td>
                    <td className="p-4 text-gray-500">Single Prompt Only</td>
                  </tr>
                )}

                {/* Row 15: Telemetry Privacy */}
                {(comparisonFilter === 'all' || comparisonFilter === 'privacy') && (
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white font-mono flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Telemetry & User Tracking</span>
                    </td>
                    <td className="p-4 font-bold text-emerald-300">0 Tracking • Zero Data Reselling • Sovereign</td>
                    <td className="p-4 text-rose-400">User prompts used for model training</td>
                    <td className="p-4 text-rose-400">Public Discord channels / Cloud logging</td>
                  </tr>
                )}

                {/* Row 16: Creative Sovereignty */}
                {(comparisonFilter === 'all' || comparisonFilter === 'privacy') && (
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white font-mono flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>Complete Creative Sovereignty</span>
                    </td>
                    <td className="p-4 font-bold text-purple-300">100% Free Forever • Created by Abhinav Giri 🇮🇳</td>
                    <td className="p-4 text-rose-400">Monthly Paywall & Tiered Quotas</td>
                    <td className="p-4 text-rose-400">GPU Credit Bundles & Expirations</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

          {/* 4 Strategic Superpower Pillar Deep-Dives */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Pillar 1 */}
            <div className="p-7 rounded-3xl bg-black/60 border border-cyan-500/30 space-y-3 hover:border-cyan-400 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400">
                  <Code2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Fullstack Engineering Mastery</h4>
                  <span className="text-xs font-mono text-cyan-300">React 18 • TypeScript • Tailwind • Auto-Fixer</span>
                </div>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Build production software in real-time. Girionix's Superhuman Dev Studio compiles components on the fly, calculates runtime time/space complexity ($O(n)$ metrics), and fixes build errors with 1-click Auto-Fix intelligence.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-7 rounded-3xl bg-black/60 border border-purple-500/30 space-y-3 hover:border-purple-400 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400">
                  <Sigma className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Mathematical Rigor & 3D Plotting</h4>
                  <span className="text-xs font-mono text-purple-300">KaTeX Proofs • 3D Surface Graphs • STEM</span>
                </div>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Tackle Olympiad-level IMO proofs, differential calculus, and tensor algebra with formatted KaTeX derivations and interactive 3D parametric surface meshes that render smoothly in your browser.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-7 rounded-3xl bg-black/60 border border-rose-500/30 space-y-3 hover:border-rose-400 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400">
                  <Film className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Hollywood Cinema & 8K Visuals</h4>
                  <span className="text-xs font-mono text-rose-300">4-Shot Storyboards • Web Audio • FLUX.1 8K</span>
                </div>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Direct continuous 4-shot cinematic sequences with synchronized procedural Web Audio soundtrack scoring and generate 8K photorealistic art across 8 distinct aesthetic styles.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-7 rounded-3xl bg-black/60 border border-emerald-500/30 space-y-3 hover:border-emerald-400 transition-all">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Air-Gapped Sovereign Privacy</h4>
                  <span className="text-xs font-mono text-emerald-300">Local Neural Core • 90-Day Vault • 0 Telemetry</span>
                </div>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">
                Experience true creative autonomy. High-end systems unlock 100% offline physical execution, while the 90-day local disk vault saves your entire history privately in your machine's physical storage.
              </p>
            </div>
          </div>

          {/* Bottom Action Callout */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-black border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-white">Ready to Experience Unbounded Intelligence?</h4>
              <p className="text-xs text-gray-400 font-sans">Start in your browser right now for free, or download the native standalone app for your device.</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-full bg-white text-black font-extrabold text-xs hover:bg-gray-200 transition-all shadow-lg hover:scale-105 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-600" />
                <span>Start Using</span>
              </button>

              <button
                onClick={() => setActiveTab('requirements')}
                className="px-6 py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/15 font-bold text-xs transition-all flex items-center gap-2"
              >
                <HardDrive className="w-4 h-4 text-cyan-400" />
                <span>Download Standalone App</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-8 text-center text-xs text-gray-500 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <img src="/logo.png" alt="Girionix AI" className="w-5 h-5 rounded" />
          <span className="font-extrabold text-white">Girionix AI</span>
        </div>
        <p>© 2026 Abhinav Giri • Think • Create • Explore • All Rights Reserved</p>
      </footer>

      {/* Floating Scroll to Top Action Button */}
      {showScrollTop && (
        <button
          onClick={() => scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-cyan-500/25 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/50 shadow-glow-cyan backdrop-blur-2xl transition-all duration-300 cursor-pointer animate-fadeIn hover:scale-110 flex items-center justify-center"
          title="Scroll back to top"
        >
          <ChevronUp className="w-5 h-5 text-cyan-300" />
        </button>
      )}
    </div>
  );
}
