import React, { useState, useEffect, useRef } from 'react';
import { 
  Code2, 
  Play, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Smartphone, 
  Monitor, 
  Tablet, 
  FileCode, 
  Terminal,
  Zap,
  Activity,
  Trash2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Gauge,
  RotateCcw,
  ClipboardPaste,
  Wand2,
  TestTube,
  Upload,
  FileDown,
  Layers,
  Gamepad2,
  BarChart3,
  Cpu,
  ShieldCheck,
  Send
} from 'lucide-react';
import { DEMO_CODE_PROJECT } from '../../data/demoData';
import { CODE_STUDIO_TEMPLATES } from '../../data/codeStudioTemplates';
import { localNeuralEngine } from '../../services/localNeuralEngine';

export const GIRIONIX_CODING_MODELS = [
  {
    id: 'girionix-titan-coder',
    name: '⚡ Titan Matrix Coder 33B',
    shortName: 'Titan Coder 33B',
    tag: 'Fullstack & Live AST',
    badge: 'FLAGSHIP CODER',
    description: 'Superhuman React 18, Python, Tailwind, Unit Tests, and AST Compilation.'
  },
  {
    id: 'girionix-titan-70b',
    name: '⚡ Titan 70B Heavy Core',
    shortName: 'Titan 70B Heavy',
    tag: 'Complex Systems',
    badge: 'HEAVY SYSTEMS',
    description: 'Deep algorithmic derivations, state machines, and distributed architecture.'
  },
  {
    id: 'girionix-titan-lite',
    name: '🌱 Titan Lite Quantized',
    shortName: 'Titan Lite',
    tag: 'Instant Prototypes',
    badge: 'ULTRA-FAST',
    description: 'Ultra-fast sub-second code generation with minimal memory overhead.'
  }
];

export default function CodeStudio({ activeModel, injectedCode, isTitanMode = false }) {
  const [project, setProject] = useState(DEMO_CODE_PROJECT);
  const [activeFileName, setActiveFileName] = useState('App.jsx');
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const templatesDropdownRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [pasted, setPasted] = useState(false);
  const [viewMode, setViewMode] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  // Selected Girionix Flagship Model (Zero API key required)
  const [selectedGirionixModel, setSelectedGirionixModel] = useState('girionix-titan-coder');

  // Micro-Benchmark Execution state
  const [benchmarkResult, setBenchmarkResult] = useState(null);
  const [isRunningBenchmark, setIsRunningBenchmark] = useState(false);

  // Auto-Fix state
  const [isAutoFixing, setIsAutoFixing] = useState(false);

  const iframeRef = useRef(null);

  useEffect(() => {
    if (injectedCode) {
      setProject(prev => {
        const files = prev.files.map(f => {
          if (f.name === 'App.jsx') {
            return { ...f, content: injectedCode };
          }
          return f;
        });
        return { ...prev, files };
      });
    }
  }, [injectedCode]);

  // Click outside listener for templates dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (templatesDropdownRef.current && !templatesDropdownRef.current.contains(e.target)) {
        setIsTemplatesOpen(false);
      }
    };
    if (isTemplatesOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isTemplatesOpen]);

  const handleSelectTemplate = (template) => {
    setProject(prev => ({
      ...prev,
      files: prev.files.map(f => f.name === 'App.jsx' ? { ...f, content: template.code } : f)
    }));
    setActiveFileName('App.jsx');
    setIsTemplatesOpen(false);
    setConsoleLogs(prev => [...prev, {
      type: 'info',
      text: `⚡ Loaded showcase template: ${template.name}`,
      time: new Date().toLocaleTimeString()
    }]);
  };

  useEffect(() => {
    const handleWindowMessage = (event) => {
      if (event.data?.type === 'GIRIONIX_CONSOLE_LOG') {
        setConsoleLogs(prev => [...prev.slice(-40), {
          type: event.data.level,
          text: event.data.message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }]);
      }
    };
    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, []);

  const activeFile = project.files.find(f => f.name === activeFileName) || project.files[0];

  const handleCodeChange = (newContent) => {
    setProject(prev => ({
      ...prev,
      files: prev.files.map(f => f.name === activeFileName ? { ...f, content: newContent } : f)
    }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1-Click Paste from Clipboard
  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        const cleanText = text.replace(/^```[a-zA-Z]*\n/i, '').replace(/```$/i, '');
        handleCodeChange(cleanText);
        setPasted(true);
        setTimeout(() => setPasted(false), 2000);
      }
    } catch (err) {
      console.warn('Clipboard read failed:', err);
    }
  };

  // 1-Click Auto-Indent & Format
  const handleFormatCode = () => {
    try {
      const lines = activeFile.content.split('\n');
      let indent = 0;
      const formatted = lines.map(line => {
        let trimmed = line.trim();
        if (trimmed.startsWith('}') || trimmed.startsWith(']') || trimmed.startsWith(')')) {
          indent = Math.max(0, indent - 1);
        }
        const result = '  '.repeat(indent) + trimmed;
        if (trimmed.endsWith('{') || trimmed.endsWith('[') || trimmed.endsWith('(')) {
          indent++;
        }
        return result;
      }).join('\n');

      handleCodeChange(formatted);
    } catch (_) {}
  };

  // 1-Click Generate Unit Tests with Girionix Flagship Models (0 API Key Required)
  const handleGenerateUnitTests = async () => {
    setIsGenerating(true);
    try {
      let testCode = '';
      await localNeuralEngine.generateStream({
        messages: [
          {
            role: 'system',
            content: 'Generate clean Vitest / Jest unit tests with mock rendering and assertions for the provided React component. Return ONLY executable test code.'
          },
          { role: 'user', content: activeFile.content }
        ],
        model: selectedGirionixModel,
        onChunk: (chunk, acc) => { testCode = acc; }
      });

      const cleanTest = testCode.replace(/^```[a-zA-Z]*\n/i, '').replace(/```$/i, '').trim();
      if (cleanTest) {
        setProject(prev => {
          const exists = prev.files.find(f => f.name === 'App.test.jsx');
          if (exists) {
            return {
              ...prev,
              files: prev.files.map(f => f.name === 'App.test.jsx' ? { ...f, content: cleanTest } : f)
            };
          }
          return {
            ...prev,
            files: [...prev.files, { name: 'App.test.jsx', language: 'javascript', content: cleanTest }]
          };
        });
        setActiveFileName('App.test.jsx');
        setConsoleLogs(prev => [...prev, {
          type: 'info',
          text: `🧪 Generated unit tests via ${selectedGirionixModel} (0 API Key Needed)`,
          time: new Date().toLocaleTimeString()
        }]);
      }
    } catch (err) {
      console.warn('Test generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadActiveFile = () => {
    const blob = new Blob([activeFile.content], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = activeFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadProjectZip = () => {
    const jsonContent = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `girionix_project_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleRunBenchmark = () => {
    setIsRunningBenchmark(true);
    const start = performance.now();
    const iterations = 100000;
    let acc = 0;
    for (let i = 0; i < iterations; i++) {
      acc += Math.sin(i) * Math.cos(i);
    }
    const end = performance.now();
    const duration = (end - start).toFixed(2);
    const ops = Math.round((iterations / (end - start)) * 1000).toLocaleString();

    setBenchmarkResult({
      durationMs: duration,
      opsPerSec: ops,
      iterations
    });
    setIsRunningBenchmark(false);
  };

  // 1-Click Code Auto-Fix with Girionix Flagship Models (0 API Key Required)
  const handleAutoFixCode = async () => {
    setIsAutoFixing(true);
    try {
      const errorContext = consoleLogs.filter(l => l.type === 'error').map(l => l.text).join('\n') || 'Fix syntax errors or runtime issues in this React component.';
      let fixedContent = '';

      await localNeuralEngine.generateStream({
        messages: [
          {
            role: 'system',
            content: 'You are Girionix Live Code Auto-Fixer. Fix all runtime and syntax errors in the provided React code. Return ONLY valid, executable JavaScript/JSX without markdown backticks.'
          },
          { role: 'user', content: `Error context:\n${errorContext}\n\nCurrent Code:\n${activeFile.content}` }
        ],
        model: selectedGirionixModel,
        onChunk: (chunk, acc) => { fixedContent = acc; }
      });

      const cleanCode = fixedContent.replace(/^```[a-zA-Z]*\n/i, '').replace(/```$/i, '').trim();
      if (cleanCode) {
        handleCodeChange(cleanCode);
        setConsoleLogs(prev => [...prev, {
          type: 'info',
          text: `⚡ Girionix Auto-Fix applied successfully via ${selectedGirionixModel}!`,
          time: new Date().toLocaleTimeString()
        }]);
      }
    } catch (err) {
      console.warn('Auto-fix failed:', err);
    } finally {
      setIsAutoFixing(false);
    }
  };

  const handleExportCodeProject = () => {
    const projectData = {
      version: '1.0.0',
      type: 'girionix_code_project',
      exportedAt: new Date().toISOString(),
      activeFileName,
      files: project.files
    };
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Girionix_Project_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportCodeProject = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target.result;
        if (file.name.endsWith('.json')) {
          const data = JSON.parse(text);
          if (data.files && Array.isArray(data.files)) {
            setProject({ files: data.files });
            if (data.activeFileName) setActiveFileName(data.activeFileName);
            return;
          }
        }
        const updatedFiles = [...project.files];
        const existingIdx = updatedFiles.findIndex(f => f.name === file.name);
        if (existingIdx >= 0) {
          updatedFiles[existingIdx].content = text;
        } else {
          updatedFiles.push({ name: file.name, content: text });
        }
        setProject({ files: updatedFiles });
        setActiveFileName(file.name);
      } catch (err) {
        console.error('Import error:', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // AI Prompt Modification using Girionix Flagship Models (0 API Key Required)
  const handleAiModify = async () => {
    if (!aiPrompt.trim() || isGenerating) return;
    setIsGenerating(true);

    try {
      let fullCode = '';
      await localNeuralEngine.generateStream({
        messages: [
          {
            role: 'system',
            content: 'You are Girionix AI Code Architect. Return ONLY the updated React 18 component code. No markdown wrapping, no conversational filler.'
          },
          {
            role: 'user',
            content: `Instruction: "${aiPrompt}"\n\nCurrent Code:\n${activeFile.content}`
          }
        ],
        model: selectedGirionixModel,
        onChunk: (chunk, acc) => {
          fullCode = acc;
        }
      });

      const cleanCode = fullCode.replace(/^```[a-zA-Z]*\n/i, '').replace(/```$/i, '').trim();
      if (cleanCode) {
        handleCodeChange(cleanCode);
        setAiPrompt('');
        setConsoleLogs(prev => [...prev, {
          type: 'info',
          text: `⚡ Code modified successfully with ${selectedGirionixModel}`,
          time: new Date().toLocaleTimeString()
        }]);
      }
    } catch (err) {
      console.warn('AI modify error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const getSandboxHtml = () => {
    const appFile = project.files.find(f => f.name === 'App.jsx')?.content || activeFile?.content || project.files[0]?.content || '';
    
    const candidateMatches = appFile.match(/(?:function|class|const|let|var)\s+([A-Z][A-Za-z0-9_]*)/g) || [];
    const candidateNames = Array.from(new Set(
      candidateMatches.map(m => m.replace(/(?:function|class|const|let|var)\s+/, '').trim())
    )).filter(name => !['React', 'ReactDOM', 'LucideIcons', 'Component', 'PureComponent', 'ErrorBoundary'].includes(name));

    let transformedCode = appFile
      .replace(/import\s+type\s+.*?;?/g, '')
      .replace(/import\s*\*\s*as\s+React\s+from\s+['"][^'"]+['"];?/g, '')
      .replace(/import\s+React\s*,?\s*\{[^}]*\}\s+from\s+['"][^'"]+['"];?/g, '')
      .replace(/import\s+React\s+from\s+['"][^'"]+['"];?/g, '')
      .replace(/import\s+\{[^}]*\}\s+from\s+['"][^'"]+['"];?/g, '')
      .replace(/import\s+.*?from\s+['"][^'"]+['"];?/g, '')
      .replace(/export\s+default\s+/g, 'window.__DEFAULT_EXPORT__ = ')
      .replace(/export\s+function\s+/g, 'function ')
      .replace(/export\s+class\s+/g, 'class ')
      .replace(/export\s+\{[^}]+\};?/g, '')
      .replace(/export\s+default\s+function\s+([A-Za-z0-9_]+)/g, 'window.__DEFAULT_EXPORT__ = $1; function $1')
      .replace(/export\s+default\s+function\s*\(/g, 'window.__DEFAULT_EXPORT__ = function(')
      .replace(/export\s+default\s+class\s+([A-Za-z0-9_]+)/g, 'window.__DEFAULT_EXPORT__ = $1; class $1')
      .replace(/export\s+default\s+([A-Za-z0-9_]+);?/g, 'window.__DEFAULT_EXPORT__ = $1;')
      .replace(/export\s+default\s+/g, 'window.__DEFAULT_EXPORT__ = ');

    const escapedCode = JSON.stringify(transformedCode);

    const candidateChecks = candidateNames.map(name => `(typeof ${name} !== "undefined" ? ${name} : null)`).join(' || ');
    const returnStatement = `return window.__DEFAULT_EXPORT__ || (typeof App !== "undefined" ? App : null) || ${candidateChecks ? candidateChecks + ' || ' : ''}(typeof SnakeGame !== "undefined" ? SnakeGame : null) || (typeof StandaloneSnakeGame !== "undefined" ? StandaloneSnakeGame : null) || (typeof Dashboard !== "undefined" ? Dashboard : null) || (typeof QuantumVisualizer !== "undefined" ? QuantumVisualizer : null) || (typeof Component !== "undefined" ? Component : null) || (typeof Main !== "undefined" ? Main : null);`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js" crossorigin></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.5/babel.min.js"></script>
  <style>
    body { background-color: #07080F; color: #FFFFFF; font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 12px; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
  </style>
  <script>
    const sendLog = (level, msg) => {
      try {
        window.parent.postMessage({ type: 'GIRIONIX_CONSOLE_LOG', level, message: String(msg) }, '*');
      } catch(_) {}
    };
    console.log = (...args) => sendLog('log', args.join(' '));
    console.warn = (...args) => sendLog('warn', args.join(' '));
    console.error = (...args) => sendLog('error', args.join(' '));
    window.onerror = (msg, url, line) => { sendLog('error', msg + (line ? ' (Line ' + line + ')' : '')); return true; };

    window.LucideIcons = new Proxy({}, {
      get: function(target, prop) {
        if (typeof prop === 'symbol' || prop === 'then' || prop === 'toJSON') return target[prop];
        return function DynamicIcon(props) {
          props = props || {};
          const className = props?.className || 'w-4 h-4 inline-block';
          const size = props?.size || 18;
          const color = props?.color || 'currentColor';
          return React.createElement('svg', {
            xmlns: 'http://www.w3.org/2000/svg',
            width: size,
            height: size,
            viewBox: '0 0 24 24',
            fill: props?.fill || 'none',
            stroke: color,
            strokeWidth: props?.strokeWidth || 2,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            className: className,
            ...props
          }, React.createElement('circle', { cx: 12, cy: 12, r: 9, strokeOpacity: 0.4 }),
             React.createElement('path', { d: 'M12 8v8M8 12h8', strokeOpacity: 0.6 }));
        };
      }
    });

    window.Motion = {
      motion: new Proxy({}, {
        get: (target, prop) => (props) => React.createElement(prop, props)
      }),
      AnimatePresence: ({ children }) => children
    };
    window.confetti = () => {};
  </script>
</head>
<body>
  <div id="root"></div>
  <script>
    window.addEventListener('DOMContentLoaded', () => {
      if (typeof window.React === 'undefined' || typeof window.ReactDOM === 'undefined' || typeof window.Babel === 'undefined') {
        document.getElementById('root').innerHTML = '<div class="p-6 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-300 font-mono text-xs space-y-2"><div class="font-bold text-sm text-white">⚡ Initializing React 18 Engine...</div><div>Setting up in-memory sandbox.</div></div>';
        return;
      }

      const { useState, useEffect, useRef, useMemo, useCallback, useContext, useReducer, useId, useLayoutEffect } = window.React;
      window.useState = useState;
      window.useEffect = useEffect;
      window.useRef = useRef;
      window.useMemo = useMemo;
      window.useCallback = useCallback;
      window.useContext = useContext;
      window.useReducer = useReducer;
      window.useId = useId;
      window.useLayoutEffect = useLayoutEffect;

      class ErrorBoundary extends React.Component {
        constructor(props) {
          super(props);
          this.state = { hasError: false, error: null };
        }
        static getDerivedStateFromError(error) {
          return { hasError: true, error };
        }
        componentDidCatch(error, info) {
          console.error("Component Error: " + error.message);
        }
        render() {
          if (this.state.hasError) {
            return React.createElement('div', {
              className: 'p-6 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 font-mono text-xs space-y-3'
            },
              React.createElement('div', { className: 'font-bold text-sm text-rose-300 flex items-center gap-2' }, '⚠️ Runtime Execution Error'),
              React.createElement('div', { className: 'p-3 rounded-xl bg-black/60 border border-rose-500/20 text-rose-400 select-all overflow-x-auto' }, this.state.error?.message || 'Unknown error'),
              React.createElement('div', { className: 'text-[11px] text-gray-400' }, 'Click "Auto-Fix" in the top bar to have Girionix AI resolve this error automatically.')
            );
          }
          return this.props.children;
        }
      }

      try {
        const rawCode = ${escapedCode};
        window.__DEFAULT_EXPORT__ = null;

        const transformed = Babel.transform(rawCode, {
          presets: ['react'],
          filename: 'App.jsx'
        }).code;

        const functionBody = 'var { useState, useEffect, useRef, useMemo, useCallback, useContext, useReducer, useId, useLayoutEffect } = (window.React || {});\\n' + transformed + '\\n' + ${JSON.stringify(returnStatement)};
        const execFn = new Function('React', 'ReactDOM', 'LucideIcons', functionBody);
        const Component = execFn(window.React, window.ReactDOM, window.LucideIcons);

        if (Component && (typeof Component === 'function' || typeof Component === 'object')) {
          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(React.createElement(ErrorBoundary, null, React.createElement(Component)));
        } else {
          document.getElementById('root').innerHTML = '<div class="p-6 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs text-center space-y-2"><div class="font-bold text-sm text-white">⚡ Component Ready</div><div>Type or paste your React 18 / Tailwind component in the editor.</div></div>';
        }
      } catch (err) {
        console.error("Syntax / Compile Error: " + err.message);
        document.getElementById('root').innerHTML = '<div class="p-6 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 font-mono text-xs space-y-3"><div class="font-bold text-sm text-rose-300">⚠️ Syntax / Compilation Error</div><div class="p-3 rounded-xl bg-black/60 border border-rose-500/20 text-rose-400 select-all overflow-x-auto">' + err.message + '</div><div class="text-[11px] text-gray-400">Click <strong>Auto-Fix</strong> in the top bar to resolve this syntax error with AI.</div></div>';
      }
    });
  </script>
</body>
</html>`;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#07080F] text-gray-200 overflow-hidden select-none font-sans">
      {/* 1. Primary Clean Studio Header */}
      <div className="px-3 sm:px-4 py-2 border-b border-white/10 bg-[#090C16] flex flex-wrap items-center justify-between gap-2.5 shrink-0 z-10">
        {/* Left: Active File Tabs */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold shrink-0">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Coding Studio</span>
          </div>

          <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 overflow-x-auto no-scrollbar">
            {project.files.map(f => (
              <button
                key={f.name}
                onClick={() => setActiveFileName(f.name)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                  activeFileName === f.name
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Girionix 3 Flagship Models Switcher (NO API KEY REQUIRED) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-2xl bg-black/60 border border-cyan-500/30 shadow-inner">
            {GIRIONIX_CODING_MODELS.map((m) => {
              const isSelected = selectedGirionixModel === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedGirionixModel(m.id)}
                  className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500/25 to-blue-500/25 text-cyan-200 border border-cyan-400/50 shadow-glow-cyan font-bold scale-[1.02]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                  title={`${m.name}: ${m.description}`}
                >
                  <Cpu className={`w-3 h-3 ${isSelected ? 'text-cyan-400 animate-pulse' : 'text-gray-500'}`} />
                  <span className="hidden sm:inline">{m.shortName}</span>
                  <span className="sm:hidden">{m.shortName.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Zero API Key Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>0 API Key Needed • 100% Free</span>
          </div>
        </div>

        {/* Right: Showcase Templates Dropdown & Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Templates Dropdown */}
          <div className="relative" ref={templatesDropdownRef}>
            <button
              onClick={() => setIsTemplatesOpen(!isTemplatesOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30 text-white font-bold border border-cyan-500/30 text-xs font-mono transition-all cursor-pointer shadow-sm"
              title="Select pre-built demo app templates"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>⚡ Showcase Demos</span>
              <ChevronDown className={`w-3 h-3 text-cyan-400 transition-transform ${isTemplatesOpen ? 'rotate-180' : ''}`} />
            </button>

            {isTemplatesOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#080B17] border border-cyan-500/40 shadow-2xl p-2 z-50 animate-fadeIn backdrop-blur-2xl">
                <div className="px-2.5 py-1.5 border-b border-white/10 mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider">
                    Office Showcase Demos
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">100% Interactive</span>
                </div>

                <div className="space-y-1 max-h-72 overflow-y-auto">
                  {CODE_STUDIO_TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTemplate(t)}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-white/[0.06] border border-transparent hover:border-cyan-500/30 transition-all flex items-start gap-2.5 group cursor-pointer"
                    >
                      <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 shrink-0 mt-0.5">
                        {t.id === 'cyber-snake' ? <Gamepad2 className="w-4 h-4 text-emerald-400" /> :
                         t.id === 'saas-dashboard' ? <BarChart3 className="w-4 h-4 text-cyan-400" /> :
                         t.id === 'agile-kanban' ? <Layers className="w-4 h-4 text-purple-400" /> :
                         <Sparkles className="w-4 h-4 text-amber-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                            {t.name}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-gray-300 shrink-0">
                            {t.tag}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 line-clamp-2 mt-0.5 leading-snug">
                          {t.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Secondary Clean Action Strip */}
      <div className="px-3 sm:px-4 py-1.5 border-b border-white/10 bg-[#060810] flex items-center justify-between gap-2 text-xs font-mono flex-wrap">
        {/* Left: Code Utilities */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={handleFormatCode}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/10 text-[11px] transition-all cursor-pointer"
            title="Auto-Indent & Format Code"
          >
            <Wand2 className="w-3 h-3 text-purple-400" />
            <span>Format</span>
          </button>

          <button
            onClick={handlePasteFromClipboard}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/10 text-[11px] transition-all cursor-pointer"
            title="Paste code from clipboard"
          >
            <ClipboardPaste className="w-3 h-3 text-cyan-400" />
            <span>{pasted ? 'Pasted!' : 'Paste'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/10 text-[11px] transition-all cursor-pointer"
            title="Copy current code"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-cyan-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <div className="h-3 w-px bg-white/10 hidden sm:block" />

          <button
            onClick={handleExportCodeProject}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-gray-400 hover:text-white border border-white/5 text-[11px] transition-all cursor-pointer"
            title="Export full project"
          >
            <FileDown className="w-3 h-3 text-cyan-400" />
            <span>Export</span>
          </button>

          <label className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-gray-400 hover:text-white border border-white/5 text-[11px] transition-all cursor-pointer">
            <Upload className="w-3 h-3 text-emerald-400" />
            <span>Import</span>
            <input type="file" accept=".json,.jsx,.js,.tsx,.ts,.py,.html,.css" onChange={handleImportCodeProject} className="hidden" />
          </label>
        </div>

        {/* Right: Quick Tools & Viewport Mode */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Unit Tests Button */}
          <button
            onClick={handleGenerateUnitTests}
            disabled={isGenerating}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold transition-all cursor-pointer"
            title="Generate Vitest / Jest Unit Tests with on-device model"
          >
            <TestTube className="w-3 h-3 text-emerald-400" />
            <span>Unit Tests</span>
          </button>

          {/* Auto-Fix Button */}
          <button
            onClick={handleAutoFixCode}
            disabled={isAutoFixing}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold transition-all cursor-pointer"
            title="Auto-Fix syntax & console runtime errors"
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span>{isAutoFixing ? 'Fixing...' : 'Auto-Fix'}</span>
          </button>

          {/* Benchmark Button */}
          <button
            onClick={handleRunBenchmark}
            disabled={isRunningBenchmark}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold transition-all cursor-pointer"
            title="Run 100k-ops JS Benchmark"
          >
            <Activity className="w-3 h-3 text-purple-400" />
            <span>{isRunningBenchmark ? 'Measuring...' : 'Benchmark'}</span>
          </button>

          <div className="h-3 w-px bg-white/10" />

          {/* Viewport switcher */}
          <div className="flex items-center p-0.5 rounded-lg bg-black/40 border border-white/10">
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-1 rounded ${viewMode === 'desktop' ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:text-white'}`}
              title="Desktop Preview"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('tablet')}
              className={`p-1 rounded ${viewMode === 'tablet' ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:text-white'}`}
              title="Tablet Preview (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-1 rounded ${viewMode === 'mobile' ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:text-white'}`}
              title="Mobile Preview (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Benchmark Results HUD */}
      {benchmarkResult && (
        <div className="px-4 py-2 bg-[#0c0e1a] border-b border-purple-500/30 flex items-center justify-between text-xs font-mono text-purple-300 animate-fadeIn">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bold flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span>JS Engine Benchmark:</span>
            </span>
            <span>Duration: <strong>{benchmarkResult.durationMs} ms</strong></span>
            <span>Throughput: <strong>{benchmarkResult.opsPerSec} ops/sec</strong></span>
            <span>Iterations: <strong>{benchmarkResult.iterations.toLocaleString()}</strong></span>
          </div>
          <button onClick={() => setBenchmarkResult(null)} className="text-gray-400 hover:text-white text-xs">✕</button>
        </div>
      )}

      {/* 3. Main Split View: Code Editor (Left) & Sandbox Preview (Right) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left: Code Editor */}
        <div className="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-white/10 bg-[#060812]">
          <div className="px-3 py-1.5 bg-[#090C16] border-b border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-400">
            <span className="flex items-center gap-1.5">
              <FileCode className="w-3 h-3 text-cyan-400" />
              <span>{activeFileName}</span>
            </span>
            <span className="text-[10px] text-gray-500">
              {activeFile.content.split('\n').length} lines • {activeFile.content.length} chars
            </span>
          </div>

          <textarea
            value={activeFile.content}
            onChange={(e) => handleCodeChange(e.target.value)}
            spellCheck="false"
            className="flex-1 w-full p-4 bg-transparent text-gray-200 font-mono text-xs leading-relaxed resize-none focus:outline-none focus:ring-0 selection:bg-cyan-500/30"
            placeholder="Write or paste React 18 / Tailwind component code here..."
          />
        </div>

        {/* Right: Live Sandbox & Console */}
        <div className="w-full md:w-1/2 flex flex-col bg-[#05060D]">
          <div className="px-3 py-1.5 bg-[#090C16] border-b border-white/5 flex items-center justify-between text-[11px] font-mono text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Preview ({viewMode})</span>
            </span>

            <button
              onClick={() => setIsConsoleOpen(!isConsoleOpen)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] transition-colors ${
                consoleLogs.some(l => l.type === 'error') 
                  ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Terminal className="w-3 h-3" />
              <span>Console ({consoleLogs.length})</span>
            </button>
          </div>

          {/* Sandbox Frame Container */}
          <div className="flex-1 flex items-center justify-center p-3 sm:p-4 bg-black/40 overflow-auto">
            <div 
              className={`h-full transition-all duration-300 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#07080F] flex flex-col ${
                viewMode === 'mobile' ? 'w-[375px] max-h-[667px]' :
                viewMode === 'tablet' ? 'w-[768px] max-h-[900px]' :
                'w-full'
              }`}
            >
              <iframe
                ref={iframeRef}
                srcDoc={getSandboxHtml()}
                title="Live Sandbox"
                sandbox="allow-scripts allow-same-origin allow-modals"
                className="w-full h-full border-0 bg-transparent flex-1"
              />
            </div>
          </div>

          {/* Collapsible Console Drawer */}
          {isConsoleOpen && (
            <div className="h-44 border-t border-white/10 bg-[#070914] flex flex-col font-mono text-xs">
              <div className="px-3 py-1.5 bg-black/40 border-b border-white/5 flex items-center justify-between text-[10px] text-gray-400">
                <span>Console Logs</span>
                <button onClick={() => setConsoleLogs([])} className="hover:text-white">Clear</button>
              </div>
              <div className="flex-1 p-2 overflow-y-auto space-y-1">
                {consoleLogs.length === 0 ? (
                  <div className="text-gray-600 text-[10px] italic">No console logs recorded yet.</div>
                ) : (
                  consoleLogs.map((log, idx) => (
                    <div 
                      key={idx} 
                      className={`text-[11px] leading-snug flex items-start gap-1.5 ${
                        log.type === 'error' ? 'text-rose-400' : 
                        log.type === 'warn' ? 'text-amber-300' : 'text-gray-300'
                      }`}
                    >
                      <span className="text-gray-600 shrink-0 text-[9px]">{log.time}</span>
                      <span className="break-all">{log.text}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Bottom AI Assistant Dock with Girionix Flagship Models (0 API Key Needed) */}
      <div className="p-2.5 sm:p-3 bg-[#080B15] border-t border-white/10 shrink-0 z-10">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-mono shrink-0 hidden sm:flex">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold">{GIRIONIX_CODING_MODELS.find(m => m.id === selectedGirionixModel)?.shortName}</span>
          </div>

          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiModify()}
              placeholder={`Ask AI to modify this code (e.g. "Add a dark/light mode toggle", "Add search filter")...`}
              className="w-full px-3.5 py-2.5 pr-20 rounded-xl bg-black/60 border border-white/15 focus:border-cyan-400 focus:outline-none text-xs text-white placeholder-gray-500 font-mono"
            />
            <div className="absolute right-1.5 flex items-center gap-1">
              <button
                type="button"
                onClick={handleAiModify}
                disabled={isGenerating || !aiPrompt.trim()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold disabled:opacity-30 transition-all cursor-pointer"
              >
                {isGenerating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <span>Generate</span>
                    <Send className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
