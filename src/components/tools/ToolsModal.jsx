import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Wrench, 
  Code2, 
  Sigma, 
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
  ScrollText, 
  Globe,
  Terminal,
  Copy,
  Layers,
  Search,
  Sliders,
  Maximize2,
  Minimize2,
  FileText,
  User,
  Activity,
  CheckSquare
} from 'lucide-react';
import { storage, PERSONAS, THEMES } from '../../services/storage';
import { updateService, CURRENT_APP_VERSION } from '../../services/updateService';
import { runPythonInBrowser } from '../../services/inBrowserPythonRunner';

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
  activePersona,
  onSelectPersona,
  pinnedItems = [],
  onRemovePinned,
  onOpenLocalEngine,
  onLaunchOrbitStation
}) {
  // Tabs: 'utilities' | 'personas' | 'focus' | 'themes' | 'backup' | 'pinned' | 'download' | 'updates' | 'certificate'
  const [activeTab, setActiveTab] = useState('utilities');
  const [backupStatus, setBackupStatus] = useState(null);

  // -------------------------------------------------------------
  // UTILITY TOOLS SUB-STATE
  // -------------------------------------------------------------
  const [activeUtil, setActiveUtil] = useState('scratchpad'); // 'scratchpad' | 'json' | 'regex' | 'text' | 'prompt'
  
  // 1. Scratchpad Code Runner
  const [scratchLang, setScratchLang] = useState('python');
  const [scratchCode, setScratchCode] = useState(`# Instant Python Scratchpad
def fibonacci(n):
    sequence = [0, 1]
    for i in range(2, n):
        sequence.append(sequence[-1] + sequence[-2])
    return sequence

print("Fibonacci Sequence (First 10):", fibonacci(10))
print("Sum of Sequence:", sum(fibonacci(10)))
`);
  const [scratchOutput, setScratchOutput] = useState('');
  const [scratchStatus, setScratchStatus] = useState(null);
  const [isScratchRunning, setIsScratchRunning] = useState(false);
  const [copiedScratch, setCopiedScratch] = useState(false);

  const handleRunScratchCode = async () => {
    setIsScratchRunning(true);
    setScratchStatus('running');
    setScratchOutput('');

    const start = performance.now();
    try {
      if (scratchLang === 'python') {
        const res = await runPythonInBrowser(scratchCode);
        const duration = Math.round(performance.now() - start);
        if (res.success) {
          const out = res.stdout || (res.returnValue !== undefined ? String(res.returnValue) : '(No output)');
          setScratchOutput(out);
          setScratchStatus(`success (${duration}ms)`);
        } else {
          setScratchOutput(res.stdout ? `${res.stdout}\n${res.error}` : res.error);
          setScratchStatus(`error (${duration}ms)`);
        }
      } else {
        // Safe JavaScript Evaluation
        const logs = [];
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;

        console.log = (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        console.warn = (...args) => logs.push('[WARN] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        console.error = (...args) => logs.push('[ERROR] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));

        try {
          const evalFn = new Function(scratchCode);
          const result = evalFn();
          if (result !== undefined && logs.length === 0) logs.push(String(result));
          const duration = Math.round(performance.now() - start);
          setScratchOutput(logs.join('\n') || '(Code executed with 0 outputs)');
          setScratchStatus(`success (${duration}ms)`);
        } catch (err) {
          const duration = Math.round(performance.now() - start);
          setScratchOutput((logs.length ? logs.join('\n') + '\n' : '') + `Runtime Error: ${err.message}`);
          setScratchStatus(`error (${duration}ms)`);
        } finally {
          console.log = originalLog;
          console.warn = originalWarn;
          console.error = originalError;
        }
      }
    } catch (err) {
      setScratchOutput(`Execution Failure: ${err.message}`);
      setScratchStatus('error');
    } finally {
      setIsScratchRunning(false);
    }
  };

  // 2. JSON Tool State
  const [jsonInput, setJsonInput] = useState('{\n  "app": "Girionix AI",\n  "status": "ready",\n  "features": ["code_runner", "voice", "orbit_copilot"]\n}');
  const [jsonStatus, setJsonStatus] = useState(null);

  const handleFormatJson = (spaces = 2) => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, spaces));
      setJsonStatus({ type: 'success', msg: `Formatted (${new Blob([jsonInput]).size} bytes)` });
    } catch (err) {
      setJsonStatus({ type: 'error', msg: `Invalid JSON: ${err.message}` });
    }
  };

  const handleMinifyJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed));
      setJsonStatus({ type: 'success', msg: 'Minified successfully' });
    } catch (err) {
      setJsonStatus({ type: 'error', msg: `Invalid JSON: ${err.message}` });
    }
  };

  // 3. Regex Tool State
  const [regexPattern, setRegexPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [regexFlags, setRegexFlags] = useState('gi');
  const [regexTestText, setRegexTestText] = useState('Contact support@girionix.ai or lead.dev@giri-orbit.pages.dev for assistance.');
  const [regexMatches, setRegexMatches] = useState([]);
  const [regexError, setRegexError] = useState(null);

  useEffect(() => {
    if (!regexPattern) {
      setRegexMatches([]);
      setRegexError(null);
      return;
    }
    try {
      const re = new RegExp(regexPattern, regexFlags);
      const matches = [...regexTestText.matchAll(re)];
      setRegexMatches(matches.map(m => m[0]));
      setRegexError(null);
    } catch (err) {
      setRegexError(err.message);
      setRegexMatches([]);
    }
  }, [regexPattern, regexFlags, regexTestText]);

  // 4. Text Transform & Token Estimator State
  const [rawText, setRawText] = useState('Girionix AI enables autonomous intelligence, neural voice synthesizers, and real-time execution.');
  const textWords = rawText.trim() ? rawText.trim().split(/\s+/).length : 0;
  const textChars = rawText.length;
  const estimatedTokens = Math.ceil(textChars / 3.8);

  const applyCaseTransform = (type) => {
    if (!rawText) return;
    switch (type) {
      case 'upper':
        setRawText(rawText.toUpperCase());
        break;
      case 'lower':
        setRawText(rawText.toLowerCase());
        break;
      case 'title':
        setRawText(rawText.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))));
        break;
      case 'camel':
        setRawText(
          rawText
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
        );
        break;
      case 'snake':
        setRawText(
          rawText
            .toLowerCase()
            .trim()
            .replace(/[\s\W-]+/g, '_')
        );
        break;
      case 'slug':
        setRawText(
          rawText
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
        );
        break;
      default:
        break;
    }
  };

  // 5. Prompt Enhancer
  const [roughPrompt, setRoughPrompt] = useState('write a python script to parse csv');
  const [enhancedResult, setEnhancedResult] = useState('');
  const [promptTone, setPromptTone] = useState('technical');

  const handleEnhancePrompt = () => {
    if (!roughPrompt.trim()) return;
    const toneMap = {
      technical: 'Provide robust, production-grade architecture with type hints, logging, and error handling.',
      creative: 'Infuse authentic, human, engaging storytelling with vivid metaphors and memorable hooks.',
      concise: 'Deliver a high-density, 3-bullet executive briefing with actionable takeaways only.'
    };
    const enhanced = `[TASK OBJECTIVE]:
${roughPrompt.trim()}

[EXECUTION DIRECTIVE]:
${toneMap[promptTone]}

[OUTPUT SPECIFICATION]:
- Structure the response with clear hierarchical markdown headings.
- Include concrete real-world examples and unit edge cases.
- Avoid generic filler, preamble, or disclaimers; begin directly with the solution.`;
    setEnhancedResult(enhanced);
  };

  // -------------------------------------------------------------
  // OTA UPDATE STATE
  // -------------------------------------------------------------
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

  // -------------------------------------------------------------
  // CUSTOM PERSONA STATE & MEMORY
  // -------------------------------------------------------------
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

  // User Profile Memory
  const currentUserProfile = {
    name: storage.getUserName() || 'Orbit User',
    age: storage.getUserAge() || 'Not specified',
    dob: storage.getUserDob() || 'Not specified',
    gender: storage.getUserGender() || 'Not specified'
  };

  // -------------------------------------------------------------
  // THEME STATE
  // -------------------------------------------------------------
  const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('girionix_theme') || 'obsidian');

  const handleApplyTheme = (themeId) => {
    setCurrentTheme(themeId);
    localStorage.setItem('girionix_theme', themeId);
  };

  // -------------------------------------------------------------
  // FOCUS TIMER & AMBIENCE
  // -------------------------------------------------------------
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('work'); // 'work' | 'break'
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

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // -------------------------------------------------------------
  // BACKUP & RESTORE
  // -------------------------------------------------------------
  const handleExportWorkspace = () => {
    const data = {
      sessions: storage.getSessions(),
      settings: storage.getSettings(),
      pinned: storage.getPinnedItems(),
      userName: storage.getUserName(),
      userAge: storage.getUserAge(),
      userDob: storage.getUserDob(),
      userGender: storage.getUserGender(),
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
        if (imported.userAge) storage.setUserAge(imported.userAge);
        if (imported.userDob) storage.setUserDob(imported.userDob);
        if (imported.userGender) storage.setUserGender(imported.userGender);
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

  if (!isOpen) return null;

  const allPersonas = [...PERSONAS, ...customPersonas];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-2xl animate-fadeIn">
      <div className="w-full max-w-4xl rounded-3xl bg-[#090B16] border border-cyan-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-glow-cyan">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Girionix Power Tools Hub</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Enhanced Utilities
                </span>
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Code Scratchpad, JSON/Regex Suite, AI Personas, Focus Audio, Backups & System Core
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Close Tools"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 bg-black/40 border-b border-white/[0.06] overflow-x-auto text-xs font-mono scrollbar-none">
          {[
            { id: 'utilities', label: '⚡ Dev & Text Tools', icon: <Terminal className="w-3.5 h-3.5 text-cyan-400" /> },
            { id: 'personas', label: '🧠 Personas & Memory', icon: <UserCheck className="w-3.5 h-3.5 text-purple-400" /> },
            { id: 'focus', label: '⏱️ Focus & Spatial Audio', icon: <Timer className="w-3.5 h-3.5 text-rose-400" /> },
            { id: 'themes', label: '🌈 Visual Themes', icon: <Palette className="w-3.5 h-3.5 text-amber-400" /> },
            { id: 'backup', label: '💾 Vault & Backups', icon: <HardDriveDownload className="w-3.5 h-3.5 text-emerald-400" /> },
            { id: 'pinned', label: '📌 Bookmarks', icon: <Bookmark className="w-3.5 h-3.5 text-blue-400" /> },
            { id: 'download', label: '📲 Native Apps', icon: <Download className="w-3.5 h-3.5 text-teal-400" /> },
            { id: 'updates', label: '🔄 OTA Updates', icon: <RefreshCw className="w-3.5 h-3.5 text-cyan-400" /> },
            { id: 'certificate', label: '🎖️ Genesis', icon: <Award className="w-3.5 h-3.5 text-yellow-400" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ============================================================ */}
          {/* 1. POWER UTILITIES TAB (Live Scratchpad, JSON, Regex, Text) */}
          {/* ============================================================ */}
          {activeTab === 'utilities' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Utility Sub-Nav */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-black/50 border border-white/10 text-xs font-mono">
                {[
                  { id: 'scratchpad', label: '▶ Live Code Scratchpad', icon: <Terminal className="w-3.5 h-3.5" /> },
                  { id: 'json', label: '{ } JSON Validator & Prettifier', icon: <Code2 className="w-3.5 h-3.5" /> },
                  { id: 'regex', label: '.* Regex Evaluator', icon: <Search className="w-3.5 h-3.5" /> },
                  { id: 'text', label: 'Aa Text & Token Counter', icon: <FileText className="w-3.5 h-3.5" /> },
                  { id: 'prompt', label: '✨ Prompt Enhancer', icon: <Sparkles className="w-3.5 h-3.5" /> }
                ].map(u => (
                  <button
                    key={u.id}
                    onClick={() => setActiveUtil(u.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      activeUtil === u.id
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {u.icon}
                    <span>{u.label}</span>
                  </button>
                ))}
              </div>

              {/* Sub-tool 1: Live Code Scratchpad */}
              {activeUtil === 'scratchpad' && (
                <div className="space-y-3 p-4 rounded-2xl bg-[#070810] border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-400">Language:</span>
                      <select
                        value={scratchLang}
                        onChange={(e) => {
                          setScratchLang(e.target.value);
                          if (e.target.value === 'javascript' && scratchCode.includes('def fibonacci')) {
                            setScratchCode(`// Instant JavaScript Scratchpad\nconst fib = (n) => {\n  const s = [0, 1];\n  for (let i = 2; i < n; i++) s.push(s[i-1] + s[i-2]);\n  return s;\n};\n\nconsole.log('Fibonacci (10):', fib(10));\nconsole.log('Sum:', fib(10).reduce((a, b) => a + b, 0));`);
                          }
                        }}
                        className="px-2.5 py-1 rounded-xl bg-black border border-white/20 text-cyan-300 text-xs font-mono focus:outline-none"
                      >
                        <option value="python">Python 3 (In-Browser Virtual Engine)</option>
                        <option value="javascript">JavaScript (ESNext Sandbox)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleRunScratchCode}
                        disabled={isScratchRunning}
                        className="px-4 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-glow-cyan transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isScratchRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                        <span>{isScratchRunning ? 'Executing...' : '▶ Run Code'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Code Editor Area */}
                  <textarea
                    rows={8}
                    value={scratchCode}
                    onChange={(e) => setScratchCode(e.target.value)}
                    spellCheck="false"
                    className="w-full p-3 rounded-xl bg-black/80 border border-white/10 font-mono text-xs text-gray-200 focus:border-cyan-500/60 focus:outline-none resize-none leading-relaxed"
                  />

                  {/* Output Terminal */}
                  <div className="p-3 rounded-xl bg-black border border-white/15 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono border-b border-white/10 pb-1.5">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-gray-300 font-bold">Standard Output (stdout)</span>
                        {scratchStatus && (
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            scratchStatus.includes('success') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            scratchStatus.includes('error') ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                            'bg-cyan-500/20 text-cyan-300'
                          }`}>
                            {scratchStatus}
                          </span>
                        )}
                      </div>
                      {scratchOutput && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(scratchOutput);
                            setCopiedScratch(true);
                            setTimeout(() => setCopiedScratch(false), 2000);
                          }}
                          className="text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          {copiedScratch ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedScratch ? 'Copied' : 'Copy'}</span>
                        </button>
                      )}
                    </div>
                    <pre className="text-xs font-mono text-cyan-200 overflow-x-auto whitespace-pre-wrap min-h-[50px] max-h-40">
                      {scratchOutput || <span className="text-gray-600">// Click "▶ Run Code" above to execute and inspect outputs here</span>}
                    </pre>
                  </div>
                </div>
              )}

              {/* Sub-tool 2: JSON Validator & Prettifier */}
              {activeUtil === 'json' && (
                <div className="space-y-3 p-4 rounded-2xl bg-[#070810] border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-400">JSON Payload:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleFormatJson(2)}
                        className="px-3 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono cursor-pointer"
                      >
                        Format (2 spaces)
                      </button>
                      <button
                        onClick={handleMinifyJson}
                        className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono cursor-pointer"
                      >
                        Minify
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(jsonInput);
                          setJsonStatus({ type: 'success', msg: 'Copied to clipboard' });
                          setTimeout(() => setJsonStatus(null), 2000);
                        }}
                        className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={8}
                    value={jsonInput}
                    onChange={(e) => {
                      setJsonInput(e.target.value);
                      setJsonStatus(null);
                    }}
                    spellCheck="false"
                    className="w-full p-3 rounded-xl bg-black/80 border border-white/10 font-mono text-xs text-gray-200 focus:border-cyan-500/60 focus:outline-none resize-none leading-relaxed"
                  />

                  {jsonStatus && (
                    <div className={`p-2.5 rounded-xl text-xs font-mono flex items-center gap-2 ${
                      jsonStatus.type === 'success' ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30' : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
                    }`}>
                      {jsonStatus.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      <span>{jsonStatus.msg}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Sub-tool 3: Regex Evaluator */}
              {activeUtil === 'regex' && (
                <div className="space-y-3 p-4 rounded-2xl bg-[#070810] border border-white/10">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <div className="sm:col-span-3">
                      <label className="text-[10px] font-mono text-gray-400 block mb-1">Regular Expression:</label>
                      <div className="flex items-center rounded-xl bg-black border border-white/15 px-3 py-1.5 focus-within:border-cyan-400">
                        <span className="text-gray-500 font-mono text-xs">/</span>
                        <input
                          type="text"
                          value={regexPattern}
                          onChange={(e) => setRegexPattern(e.target.value)}
                          className="w-full bg-transparent text-white font-mono text-xs px-1.5 focus:outline-none"
                        />
                        <span className="text-gray-500 font-mono text-xs">/</span>
                        <input
                          type="text"
                          value={regexFlags}
                          onChange={(e) => setRegexFlags(e.target.value)}
                          className="w-10 bg-transparent text-cyan-400 font-mono text-xs text-center focus:outline-none"
                          title="Flags: g, i, m, s"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-gray-400 block mb-1">Matches Found:</label>
                      <div className="h-9 rounded-xl bg-black border border-white/15 flex items-center justify-center font-mono text-xs font-bold text-cyan-400">
                        {regexMatches.length} match{regexMatches.length === 1 ? '' : 'es'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-gray-400 block mb-1">Test Text:</label>
                    <textarea
                      rows={4}
                      value={regexTestText}
                      onChange={(e) => setRegexTestText(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/80 border border-white/10 font-mono text-xs text-gray-200 focus:border-cyan-500/60 focus:outline-none resize-none"
                    />
                  </div>

                  {regexError ? (
                    <div className="p-2.5 rounded-xl bg-rose-950/40 text-rose-300 border border-rose-500/30 text-xs font-mono">
                      Syntax Error: {regexError}
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-gray-400">Extracted Matches:</span>
                      <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
                        {regexMatches.length > 0 ? (
                          regexMatches.map((m, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                              {m}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-500 font-mono">No matches found</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sub-tool 4: Text Transform & Token Counter */}
              {activeUtil === 'text' && (
                <div className="space-y-3 p-4 rounded-2xl bg-[#070810] border border-white/10">
                  {/* Stats Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-black border border-white/10">
                      <span className="text-[10px] font-mono text-gray-400 uppercase block">Characters</span>
                      <span className="text-base font-bold text-white font-mono">{textChars}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black border border-white/10">
                      <span className="text-[10px] font-mono text-gray-400 uppercase block">Words</span>
                      <span className="text-base font-bold text-cyan-400 font-mono">{textWords}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black border border-white/10">
                      <span className="text-[10px] font-mono text-gray-400 uppercase block">Estimated Tokens</span>
                      <span className="text-base font-bold text-purple-400 font-mono">~{estimatedTokens}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black border border-white/10">
                      <span className="text-[10px] font-mono text-gray-400 uppercase block">Reading Time</span>
                      <span className="text-base font-bold text-emerald-400 font-mono">
                        {Math.ceil(textWords / 200)} min
                      </span>
                    </div>
                  </div>

                  <textarea
                    rows={5}
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    className="w-full p-3 rounded-xl bg-black/80 border border-white/10 font-mono text-xs text-gray-200 focus:border-cyan-500/60 focus:outline-none resize-none leading-relaxed"
                    placeholder="Enter or paste any text here..."
                  />

                  {/* Transform Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono text-gray-400">Transform Case:</span>
                    {[
                      { id: 'upper', label: 'UPPERCASE' },
                      { id: 'lower', label: 'lowercase' },
                      { id: 'title', label: 'Title Case' },
                      { id: 'camel', label: 'camelCase' },
                      { id: 'snake', label: 'snake_case' },
                      { id: 'slug', label: 'url-slug' }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => applyCaseTransform(t.id)}
                        className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-gray-200 text-xs font-mono border border-white/10 transition-colors cursor-pointer"
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-tool 5: Prompt Enhancer */}
              {activeUtil === 'prompt' && (
                <div className="space-y-3 p-4 rounded-2xl bg-[#070810] border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-400">Enter a raw prompt to enhance for maximum AI performance:</span>
                    <div className="flex items-center gap-2">
                      <select
                        value={promptTone}
                        onChange={(e) => setPromptTone(e.target.value)}
                        className="px-2.5 py-1 rounded-xl bg-black border border-white/20 text-cyan-300 text-xs font-mono focus:outline-none"
                      >
                        <option value="technical">Technical & Production Grade</option>
                        <option value="creative">Creative & Human Voice</option>
                        <option value="concise">Concise Executive Brief</option>
                      </select>
                      <button
                        onClick={handleEnhancePrompt}
                        className="px-3.5 py-1 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-glow-cyan transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Enhance</span>
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    value={roughPrompt}
                    onChange={(e) => setRoughPrompt(e.target.value)}
                    placeholder="Enter rough prompt..."
                    className="w-full p-2.5 rounded-xl bg-black/80 border border-white/10 font-mono text-xs text-gray-200 focus:border-cyan-500/60 focus:outline-none resize-none"
                  />

                  {enhancedResult && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Enhanced System & User Prompt:</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(enhancedResult);
                            alert('Enhanced prompt copied to clipboard!');
                          }}
                          className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy Prompt</span>
                        </button>
                      </div>
                      <pre className="p-3 rounded-xl bg-black border border-cyan-500/30 text-xs font-mono text-gray-200 whitespace-pre-wrap max-h-48 overflow-y-auto">
                        {enhancedResult}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* 2. AI PERSONAS & MEMORY VAULT TAB */}
          {/* ============================================================ */}
          {activeTab === 'personas' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Active Memory Inspector Banner */}
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                    <User className="w-4 h-4 text-cyan-400" />
                    <span>Active User Memory Recall</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    100% Persistent Local
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                    <span className="text-[10px] text-gray-400 block">Name:</span>
                    <span className="text-white font-bold">{currentUserProfile.name}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                    <span className="text-[10px] text-gray-400 block">Age:</span>
                    <span className="text-white">{currentUserProfile.age}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                    <span className="text-[10px] text-gray-400 block">Date of Birth:</span>
                    <span className="text-white">{currentUserProfile.dob}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-black/50 border border-white/5">
                    <span className="text-[10px] text-gray-400 block">Gender:</span>
                    <span className="text-white">{currentUserProfile.gender}</span>
                  </div>
                </div>
              </div>

              {/* Persona Selection */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-mono">Select an active persona or build your own custom AI expert:</span>
                <button
                  onClick={() => setIsCreatingPersona(!isCreatingPersona)}
                  className="px-3 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono flex items-center gap-1 cursor-pointer"
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
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold text-xs shadow-glow-cyan disabled:opacity-40 cursor-pointer"
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
                      className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
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

          {/* ============================================================ */}
          {/* 3. FOCUS TIMER & SPATIAL AMBIENCE */}
          {/* ============================================================ */}
          {activeTab === 'focus' && (
            <div className="space-y-6 animate-fadeIn">
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
                    className="px-6 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs flex items-center gap-2 shadow-glow-cyan cursor-pointer"
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isTimerRunning ? 'Pause Sprint' : 'Start 25-Min Sprint'}</span>
                  </button>
                  <button
                    onClick={() => { setIsTimerRunning(false); setTimerSeconds(25 * 60); setTimerMode('work'); }}
                    className="p-2.5 rounded-xl bg-white/[0.04] text-gray-400 hover:text-white cursor-pointer"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs text-gray-400 font-mono">
                  Synthesizer spatial audio for deep coding concentration (Web Audio API):
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
                        className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between min-h-[110px] cursor-pointer ${
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

          {/* ============================================================ */}
          {/* 4. VISUAL THEMES */}
          {/* ============================================================ */}
          {activeTab === 'themes' && (
            <div className="space-y-4 animate-fadeIn">
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
                      className={`p-4 rounded-2xl text-left border transition-all flex items-center justify-between cursor-pointer ${
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

          {/* ============================================================ */}
          {/* 5. BACKUP & RESTORE */}
          {/* ============================================================ */}
          {activeTab === 'backup' && (
            <div className="space-y-4 animate-fadeIn">
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
                    Save all your chats, custom personas, user profile memory, and pinned snippets as a `.json` backup file.
                  </p>
                  <button
                    onClick={handleExportWorkspace}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-glow-cyan cursor-pointer transition-all"
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
                    Upload a previously saved `.json` backup file to restore all your conversations and personal memory.
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

          {/* ============================================================ */}
          {/* 6. BOOKMARKS */}
          {/* ============================================================ */}
          {activeTab === 'pinned' && (
            <div className="space-y-3 animate-fadeIn">
              {pinnedItems.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-xs font-mono">
                  No pinned bookmarks yet. Bookmark ⭐ any chat snippet or answer to save it here!
                </div>
              ) : (
                pinnedItems.map(item => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <span className="text-xs text-gray-200 truncate">{item.title}</span>
                    <button 
                      onClick={() => onRemovePinned(item.id)} 
                      className="text-gray-500 hover:text-rose-400 text-xs font-mono cursor-pointer transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* 7. CROSS-PLATFORM APPS */}
          {/* ============================================================ */}
          {activeTab === 'download' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Girionix AI Native Cross-Platform Apps</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                      Air-Gapped Ready
                    </span>
                  </h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    Real standalone signed installers for Windows, Android, macOS, Linux, and iOS.
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
                      className="w-full py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download ({item.ext})</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 8. OVER-THE-AIR UPDATES & CODE SYNC */}
          {/* ============================================================ */}
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
                  className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-mono flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
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
                    <p className="text-[11px] text-gray-400 font-sans">All models, utilities, and in-chat runners are fully synchronized.</p>
                  </div>
                </div>
              )}

              {/* 1-Click Action */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
                <button
                  onClick={handleApplyUpdate}
                  disabled={isApplyingUpdate}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-rose-500 text-black font-extrabold text-xs shadow-glow-cyan hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
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

          {/* ============================================================ */}
          {/* 9. CREATOR HOLOGRAPHIC CERTIFICATE WITH SOCIAL LINKS */}
          {/* ============================================================ */}
          {activeTab === 'certificate' && (
            <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-[#0B0D1B] to-purple-950/60 border border-cyan-500/40 text-center space-y-5 shadow-2xl relative overflow-hidden animate-fadeIn">
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

              {/* Creator & Company Official Links */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="https://giri-corporation.pages.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600/30 via-blue-600/30 to-purple-600/30 hover:from-cyan-600/50 hover:via-blue-600/50 hover:to-purple-600/50 text-cyan-200 font-mono text-xs border border-cyan-500/40 shadow-lg shadow-cyan-500/10 transition-transform transform hover:scale-105"
                >
                  <img src="/giri-corporation-logo.png" alt="Giri Corporation" className="w-4 h-4 object-contain rounded" />
                  <span className="font-semibold">Giri Corporation</span>
                </a>

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
