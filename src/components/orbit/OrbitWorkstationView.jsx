import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Table, 
  Presentation, 
  ShieldCheck, 
  Send, 
  Sparkles, 
  Download, 
  Check, 
  Copy, 
  Share2, 
  ExternalLink, 
  ArrowLeft,
  RefreshCw,
  Layers,
  ChevronRight,
  Shield,
  Zap,
  Mic,
  MicOff,
  FileCode,
  FileSpreadsheet,
  Trash2,
  BookOpen
} from 'lucide-react';
import { giriOrbitBridge, ORBIT_TOOLS, detectToolFromPrompt } from '../../services/giriOrbitBridge';
import { storage } from '../../services/storage';
import { openrouter } from '../../services/openrouter';

export default function OrbitWorkstationView({ onExitOrbitMode }) {
  const [activeTool, setActiveTool] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const t = params.get('tool') || params.get('app') || params.get('station');
        if (t && ['drift', 'axis', 'kinetic', 'aegis'].includes(t.toLowerCase())) {
          return t.toLowerCase();
        }
      }
    } catch (_) {}
    return 'drift';
  });

  const [isAutoDetectMode, setIsAutoDetectMode] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSelectTool = (toolId) => {
    setActiveTool(toolId);
    setIsAutoDetectMode(false);
    giriOrbitBridge.orbitContext.activeTool = toolId;
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tool', toolId);
      window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
    }
  };

  const handleEnableAutoMode = () => {
    setIsAutoDetectMode(true);
  };

  const handleCopyDirectLink = () => {
    const directUrl = `${window.location.origin}/orbit`;
    navigator.clipboard.writeText(directUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const [orbitContext, setOrbitContext] = useState(() => giriOrbitBridge.orbitContext);
  const [sessions, setSessions] = useState(() => storage.getOrbitSessions());
  const [activeSessionId, setActiveSessionId] = useState(() => storage.getOrbitActiveSessionId());
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [importedId, setImportedId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const abortControllerRef = useRef(null);
  const recognitionRef = useRef(null);

  // Subscribe to bridge events from parent Giri Orbit
  useEffect(() => {
    giriOrbitBridge.initBridge();
    const unsubscribe = giriOrbitBridge.subscribe((ctx) => {
      setOrbitContext(ctx);
      if (ctx.activeTool) setActiveTool(ctx.activeTool);
    });
    return () => unsubscribe();
  }, []);

  // Save sessions to isolated Orbit storage
  useEffect(() => {
    storage.saveOrbitSessions(sessions);
    storage.setOrbitActiveSessionId(activeSessionId);
  }, [sessions, activeSessionId]);

  const currentSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messages = currentSession?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // Voice Dictation
  const handleToggleVoice = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => setIsListening(true);
      rec.onresult = (e) => {
        let transcript = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          transcript += e.results[i][0].transcript;
        }
        setInput(prev => (prev ? prev + ' ' : '') + transcript);
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.error('Speech recognition error:', err);
      setIsListening(false);
    }
  };

  // Real-time live prompt tool detection
  const liveDetection = React.useMemo(() => {
    if (!input.trim() || input.trim().length < 3) return null;
    return detectToolFromPrompt(input, activeTool);
  }, [input, activeTool]);

  const handleSend = async (customPrompt) => {
    const promptToSend = customPrompt || input;
    if (!promptToSend.trim() || isStreaming) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    // Auto-identify target tool based on prompt semantics and formulas
    const detected = detectToolFromPrompt(promptToSend, activeTool);
    const shouldAutoSwitch = isAutoDetectMode || detected.confidence === 'high';
    const targetTool = (shouldAutoSwitch && detected.confidence !== 'none' && detected.confidence !== 'neutral')
      ? detected.detectedTool
      : activeTool;

    if (targetTool !== activeTool) {
      setActiveTool(targetTool);
      giriOrbitBridge.orbitContext.activeTool = targetTool;
    }

    const userMessage = {
      id: 'orbit-msg-' + Date.now(),
      role: 'user',
      tool: targetTool,
      content: promptToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const assistantId = 'orbit-resp-' + (Date.now() + 1);
    const assistantMessage = {
      id: assistantId,
      role: 'assistant',
      tool: targetTool,
      autoDetected: Boolean(shouldAutoSwitch && detected.confidence !== 'none' && detected.confidence !== 'neutral'),
      detectionReason: detected.reason,
      content: '',
      isStreaming: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...messages, userMessage, assistantMessage];
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: updated } : s));
    setInput('');
    setIsStreaming(true);

    abortControllerRef.current = new AbortController();

    try {
      const toolObj = ORBIT_TOOLS[targetTool.toUpperCase()] || ORBIT_TOOLS.DRIFT;
      const systemDirective = giriOrbitBridge.buildOrbitSystemDirective(targetTool, shouldAutoSwitch) +
        `\n\nOPERATOR: Working in Giri Orbit for ${orbitContext.operatorName || 'Orbit Workspace Member'}.` +
        `\nACTIVE DOCUMENT: "${orbitContext.documentTitle || 'Untitled'}".` +
        `\nMODEL ENGINE: Girionix Pro Enterprise Office Core. Provide high-density, beautifully structured enterprise-grade deliverables with clean tables, formatted headings, and formulas where applicable.`;

      const apiDialogue = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      }));

      await openrouter.streamChat({
        messages: [
          { role: 'system', content: systemDirective },
          ...apiDialogue,
          { role: 'user', content: promptToSend.trim() }
        ],
        model: 'girionix-pro',
        temperature: 0.5,
        signal: abortControllerRef.current.signal,
        onChunk: (chunk, fullContent) => {
          setSessions(prev => prev.map(s => s.id === activeSessionId ? {
            ...s,
            messages: s.messages.map(m => m.id === assistantId ? { ...m, content: fullContent, isStreaming: false } : m)
          } : s));
        }
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        setSessions(prev => prev.map(s => s.id === activeSessionId ? {
          ...s,
          messages: s.messages.map(m => m.id === assistantId ? {
            ...m,
            content: `⚠️ Error generating office response: ${err.message}`,
            isStreaming: false
          } : m)
        } : s));
      }
    } finally {
      setIsStreaming(false);
      setSessions(prev => prev.map(s => s.id === activeSessionId ? {
        ...s,
        messages: s.messages.map(m => m.id === assistantId ? { ...m, isStreaming: false } : m)
      } : s));
    }
  };

  const handleImportToActiveTool = (content, msgId) => {
    giriOrbitBridge.importToWorkplace(content, activeTool);
    setImportedId(msgId);
    setTimeout(() => setImportedId(null), 2500);
  };

  const handleCopy = (content, id) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Exporters for Giri Orbit documents
  const handleExportFile = (content, format = 'md') => {
    let filename = `Giri_Orbit_${activeTool}_${Date.now()}`;
    let mimeType = 'text/plain';
    let fileData = content;

    if (format === 'md') {
      filename += '.md';
      mimeType = 'text/markdown';
    } else if (format === 'html') {
      filename += '.html';
      mimeType = 'text/html';
      fileData = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${filename}</title><style>body{font-family:system-ui,-apple-system,sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;line-height:1.6;color:#222;}table{border-collapse:collapse;width:100%;margin:1rem 0;}th,td{border:1px solid #ddd;padding:8px;}th{background:#f4f4f4;}pre{background:#f8f8f8;padding:12px;border-radius:6px;}</style></head><body>${content.replace(/\n/g, '<br/>')}</body></html>`;
    } else if (format === 'csv') {
      filename += '.csv';
      mimeType = 'text/csv';
      const lines = content.split('\n');
      const csvLines = lines.map(line => {
        if (line.includes('|')) {
          return line.split('|').filter(c => c.trim()).map(c => `"${c.trim().replace(/"/g, '""')}"`).join(',');
        }
        return `"${line.replace(/"/g, '""')}"`;
      });
      fileData = csvLines.join('\n');
    }

    const blob = new Blob([fileData], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearSession = () => {
    if (confirm('Clear all conversation history in this Orbit document?')) {
      const freshSession = {
        id: 'orbit-session-' + Date.now(),
        title: 'New Orbit Session',
        createdAt: Date.now(),
        messages: []
      };
      setSessions([freshSession]);
      setActiveSessionId(freshSession.id);
    }
  };

  const toolConfig = ORBIT_TOOLS[activeTool.toUpperCase()] || ORBIT_TOOLS.DRIFT;

  const toolDirectives = {
    drift: [
      { label: 'Executive Memorandum', prompt: 'Draft a comprehensive executive briefing memo on Q3 operational milestones with action items and key stakeholders for Giri Drift.' },
      { label: 'Standard Operating Procedure (SOP)', prompt: 'Create a formal Standard Operating Procedure document with step-by-step phases, prerequisites, and quality assurance gates.' },
      { label: 'Client Contract Addendum', prompt: 'Draft a professional enterprise service level agreement (SLA) contract addendum with liability, uptime guarantees, and remediation clauses.' }
    ],
    axis: [
      { label: '4-Quarter Financial Model', prompt: 'Generate an enterprise financial projection spreadsheet table for 4 quarters with Revenue, OPEX, Gross Profit, EBITDA, and growth formulas.' },
      { label: 'Department Budget Tracker', prompt: 'Build a department budget variance model with Planned Budget, Actual Spend, Variance (%), and conditional status flags.' },
      { label: 'Unit Economics Matrix', prompt: 'Create a SaaS unit economics spreadsheet with CAC, LTV, Payback Period, Churn Rate, and ARPU sensitivity formulas.' }
    ],
    kinetic: [
      { label: 'Executive Board Deck', prompt: 'Create a 4-slide executive board presentation deck outline on strategic expansion with vision, market traction, and financial roadmap for Giri Kinetic.' },
      { label: 'Product Launch Keynote', prompt: 'Create a 5-slide keynote presentation outline for a major tech product reveal with hook, architecture, demo flow, and call to action.' },
      { label: 'Quarterly All-Hands', prompt: 'Draft a 4-slide company all-hands presentation celebrating team wins, KPI achievements, and next-quarter objectives.' }
    ],
    aegis: [
      { label: 'Cryptographic Audit Seal', prompt: 'Synthesize an enterprise cryptographic audit addendum and legal compliance verification stamp for an official PDF document.' },
      { label: 'Zero-Trust Security Verification', prompt: 'Draft a formal Zero-Knowledge encryption verification declaration and document authenticity seal.' },
      { label: 'GDPR / SOC-2 Compliance Note', prompt: 'Generate an official regulatory compliance attestation note certifying data privacy, retention, and non-disclosure standards.' }
    ]
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#070912] text-gray-100 font-sans select-none overflow-hidden">
      {/* Top Dedicated Giri Orbit Navigation Header */}
      <header className="h-14 bg-[#090C19] border-b border-cyan-500/20 px-3 sm:px-6 flex items-center justify-between shrink-0 shadow-md z-30">
        <div className="flex items-center gap-3">
          {onExitOrbitMode && (
            <button
              onClick={onExitOrbitMode}
              className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5 text-xs font-mono"
              title="Return to standard Girionix AI"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline">Girionix Standard</span>
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 shadow-glow-cyan">
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-white">Giri Orbit</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                  DEDICATED CO-PILOT
                </span>
                <span className="hidden sm:inline-flex text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold items-center gap-1">
                  <Zap className="w-3 h-3 text-purple-400" />
                  Girionix Pro
                </span>
              </div>
              <div className="text-[10px] font-mono text-gray-400 leading-none">
                Official Office Suite AI • Drift • Axis • Kinetic • Aegis
              </div>
            </div>
          </div>
        </div>

        {/* Center: Auto-Detect + 4 Orbit Tool Switchers */}
        <div className="hidden sm:flex items-center p-1 rounded-2xl bg-black/60 border border-white/10 text-xs font-medium gap-1">
          <button
            onClick={handleEnableAutoMode}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              isAutoDetectMode
                ? 'bg-gradient-to-r from-purple-500/25 to-pink-500/25 text-purple-200 border border-purple-400/50 shadow-sm font-bold shadow-glow-purple'
                : 'text-gray-400 hover:text-gray-200'
            }`}
            title="Automatically identify optimal office tool from prompt"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Auto-Detect</span>
          </button>

          <div className="w-px h-4 bg-white/10 mx-0.5" />

          {Object.values(ORBIT_TOOLS).map((tool) => {
            const isSelected = !isAutoDetectMode && activeTool === tool.id;
            const isAutoMatched = isAutoDetectMode && activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => handleSelectTool(tool.id)}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500/25 to-blue-500/25 text-cyan-200 border border-cyan-400/40 shadow-sm font-bold'
                    : isAutoMatched
                    ? 'text-cyan-300 bg-white/[0.06] font-semibold border border-cyan-500/30'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
                title={isAutoMatched ? `Auto-detected active context: ${tool.name}` : tool.name}
              >
                <span>{tool.name}</span>
                {isAutoMatched && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
              </button>
            );
          })}
        </div>

        {/* Right Status, Direct Link, Clear, & Official Orbit Link */}
        <div className="flex items-center gap-2">
          {/* Direct Link Share Button */}
          <button
            onClick={handleCopyDirectLink}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/30 text-gray-300 text-xs font-mono transition-all cursor-pointer"
            title="Copy direct shareable URL for this Giri Orbit Co-Pilot workstation"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
            <span className="hidden md:inline">{copiedLink ? 'Copied URL!' : '/orbit'}</span>
          </button>

          {messages.length > 0 && (
            <button
              onClick={handleClearSession}
              className="p-1.5 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all text-xs flex items-center gap-1 cursor-pointer"
              title="Clear current Orbit conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{orbitContext.connected ? 'Connected to Orbit' : 'Active Station'}</span>
          </div>

          <a
            href="https://giri-orbit.pages.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-all hover:scale-105"
            title="Open Giri Orbit in a new tab"
          >
            <span>Giri Orbit ↗</span>
          </a>
        </div>
      </header>

      {/* Secondary Mobile Switcher Bar */}
      <div className="sm:hidden flex items-center justify-between px-3 py-2 bg-[#090C19] border-b border-white/10 overflow-x-auto gap-1">
        <button
          onClick={handleEnableAutoMode}
          className={`px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
            isAutoDetectMode
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
              : 'text-gray-400'
          }`}
        >
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>Auto</span>
        </button>
        {Object.values(ORBIT_TOOLS).map((tool) => (
          <button
            key={tool.id}
            onClick={() => handleSelectTool(tool.id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              !isAutoDetectMode && activeTool === tool.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : isAutoDetectMode && activeTool === tool.id
                ? 'text-cyan-300 font-semibold bg-white/[0.05]'
                : 'text-gray-400'
            }`}
          >
            {tool.name}
          </button>
        ))}
      </div>

      {/* Main Dedicated Workspace Area */}
      <main className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 flex flex-col items-center">
        <div className="max-w-4xl w-full flex-1 flex flex-col justify-between space-y-4">
          
          {/* Welcome Hero when no messages */}
          {messages.length === 0 ? (
            <div className="my-auto flex flex-col items-center text-center px-4 py-8 animate-fadeIn">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center shadow-glow-cyan mb-3">
                <Sparkles className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
                Giri Orbit Dedicated AI Engine
              </h2>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                Powered by Girionix Pro
              </div>
              <p className="text-xs sm:text-sm text-gray-400 max-w-lg mb-6">
                Engineered exclusively for <strong className="text-cyan-300">{toolConfig.name}</strong> ({toolConfig.category}). Generate production documents, complex spreadsheets, executive slide decks, and compliance stamps with 1-click import and multi-format export.
              </p>

              {/* Tool Directives */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-left">
                {(toolDirectives[activeTool] || toolDirectives.drift).map((d, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setInput(d.prompt);
                      handleSend(d.prompt);
                    }}
                    className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer group shadow-sm hover:scale-[1.02]"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                        {toolConfig.name}
                      </span>
                      <span className="text-[10px] text-gray-500 group-hover:text-cyan-300 transition-colors">
                        Run ⚡
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mb-1 group-hover:text-cyan-200">
                      {d.label}
                    </h4>
                    <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                      {d.prompt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {messages.map((m) => {
                const isAssistant = m.role === 'assistant';
                const msgTool = ORBIT_TOOLS[(m.tool || activeTool).toUpperCase()] || ORBIT_TOOLS.DRIFT;
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'} animate-fadeIn`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-1 text-[11px] font-mono text-gray-400">
                      <span>{isAssistant ? `✦ ${msgTool.name} Co-Pilot (Girionix Pro)` : 'You'}</span>
                      <span>•</span>
                      <span>{m.timestamp}</span>
                      {isAssistant && m.autoDetected && (
                        <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[10px] font-semibold border border-purple-500/30 flex items-center gap-1" title={m.detectionReason}>
                          <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                          <span>Auto-Identified</span>
                        </span>
                      )}
                    </div>

                    <div
                      className={`p-4 rounded-2xl max-w-3xl text-sm leading-relaxed ${
                        isAssistant
                          ? 'bg-[#0B0F20] border border-cyan-500/20 text-gray-200 shadow-md'
                          : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium shadow-sm'
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                        {m.content}
                      </div>

                      {/* Action Bar for AI Responses */}
                      {isAssistant && !m.isStreaming && (
                        <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <button
                            onClick={() => handleImportToActiveTool(m.content, m.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/25 to-teal-500/25 hover:from-emerald-500/35 text-emerald-200 border border-emerald-500/40 transition-all font-bold cursor-pointer hover:scale-105"
                            title="Insert directly into your active Giri Orbit document / spreadsheet / slide"
                          >
                            {importedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Download className="w-3.5 h-3.5 text-emerald-400" />}
                            <span>{importedId === m.id ? 'Imported to Workplace!' : `📥 Insert to ${msgTool.name}`}</span>
                          </button>

                          <div className="flex items-center gap-1.5">
                            {/* Export Formats */}
                            <button
                              onClick={() => handleExportFile(m.content, 'md')}
                              className="px-2 py-1 rounded-lg text-[11px] font-mono bg-white/[0.04] hover:bg-white/[0.1] text-gray-300 border border-white/10 transition-colors flex items-center gap-1"
                              title="Export as Markdown (.md)"
                            >
                              <FileText className="w-3 h-3 text-cyan-400" />
                              <span>MD</span>
                            </button>
                            <button
                              onClick={() => handleExportFile(m.content, 'html')}
                              className="px-2 py-1 rounded-lg text-[11px] font-mono bg-white/[0.04] hover:bg-white/[0.1] text-gray-300 border border-white/10 transition-colors flex items-center gap-1"
                              title="Export as HTML (.html)"
                            >
                              <FileCode className="w-3 h-3 text-purple-400" />
                              <span>HTML</span>
                            </button>
                            <button
                              onClick={() => handleExportFile(m.content, 'csv')}
                              className="px-2 py-1 rounded-lg text-[11px] font-mono bg-white/[0.04] hover:bg-white/[0.1] text-gray-300 border border-white/10 transition-colors flex items-center gap-1"
                              title="Export as CSV (.csv)"
                            >
                              <FileSpreadsheet className="w-3 h-3 text-emerald-400" />
                              <span>CSV</span>
                            </button>

                            <button
                              onClick={() => handleCopy(m.content, m.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                              title="Copy text"
                            >
                              {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Bottom Prompt Input Dock */}
          <div className="sticky bottom-0 pt-2 pb-3 bg-[#070912]/90 backdrop-blur-xl border-t border-white/10 w-full">
            {/* Real-time Dynamic Tool Auto-Identification Chip */}
            {liveDetection && liveDetection.confidence !== 'none' && liveDetection.confidence !== 'neutral' && (
              <div className="mb-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-blue-950/40 border border-cyan-500/30 flex items-center justify-between text-xs text-cyan-200 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span>
                    Auto-Identified: <strong className="text-white font-bold">{liveDetection.toolName}</strong> ({liveDetection.reason})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  {activeTool !== liveDetection.detectedTool && !isAutoDetectMode && (
                    <button
                      type="button"
                      onClick={() => handleSelectTool(liveDetection.detectedTool)}
                      className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/40 transition-colors cursor-pointer"
                    >
                      Switch to {liveDetection.toolName}
                    </button>
                  )}
                  <span className="text-cyan-400/80">
                    {isAutoDetectMode ? '⚡ Optimal Output Formatter Ready' : 'Manual Station Selected'}
                  </span>
                </div>
              </div>
            )}

            <div className="relative rounded-2xl bg-black/60 border border-cyan-500/30 focus-within:border-cyan-400/60 transition-colors p-2 flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={isListening ? 'Listening to your voice dictation...' : `Ask ${toolConfig.name} Co-Pilot to draft a document, build a spreadsheet model, or outline slides...`}
                rows={1}
                className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 px-3 py-1.5 focus:outline-none resize-none leading-relaxed max-h-36 overflow-y-auto"
              />

              {/* Voice Dictation Button */}
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isListening 
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse shadow-glow-rose'
                    : 'bg-white/[0.04] border-white/10 text-gray-400 hover:text-white'
                }`}
                title={isListening ? 'Stop voice dictation' : 'Start voice dictation'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Send Button */}
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isStreaming}
                className="p-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold disabled:opacity-30 transition-all shadow-glow-cyan cursor-pointer"
                title="Send Prompt (Enter)"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between px-2 pt-1.5 text-[10px] font-mono text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Girionix Pro Office Engine</span>
                {isAutoDetectMode && (
                  <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                    Auto-Detection Active
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-gray-400">Press Enter ↵ to Send</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
