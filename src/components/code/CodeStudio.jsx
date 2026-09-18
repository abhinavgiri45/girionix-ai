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
  BarChart3
} from 'lucide-react';
import { DEMO_CODE_PROJECT } from '../../data/demoData';
import { CODE_STUDIO_TEMPLATES } from '../../data/codeStudioTemplates';
import { openrouter } from '../../services/openrouter';
import { localNeuralEngine } from '../../services/localNeuralEngine';

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

  // 1-Click Generate Unit Tests
  const handleGenerateUnitTests = async () => {
    setIsGenerating(true);
    try {
      let testCode = '';
      if (isTitanMode || activeModel?.isTitan || activeModel?.isLocal || !navigator.onLine) {
        await localNeuralEngine.generateStream({
          messages: [
            {
              role: 'system',
              content: 'Generate clean Vitest / Jest unit tests with mock rendering and assertions for the provided React component. Return ONLY executable test code.'
            },
            { role: 'user', content: activeFile.content }
          ],
          model: 'girionix-titan-coder',
          onChunk: (chunk, acc) => { testCode = acc; }
        });
      } else {
        await openrouter.streamChat({
          messages: [
            {
              role: 'system',
              content: 'Generate clean Vitest / Jest unit tests with mock rendering and assertions for the provided React component. Return ONLY executable test code.'
            },
            {
              role: 'user',
              content: activeFile.content
            }
          ],
          model: activeModel?.id || 'anthropic/claude-3.7-sonnet',
          onChunk: (chunk, acc) => { testCode = acc; }
        });
      }

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

  const handleAutoFixCode = async () => {
    setIsAutoFixing(true);
    try {
      const errorContext = consoleLogs.filter(l => l.type === 'error').map(l => l.text).join('\n') || 'Fix syntax errors or runtime issues in this React component.';
      let fixedContent = '';

      if (isTitanMode || activeModel?.isTitan || activeModel?.isLocal || !navigator.onLine) {
        await localNeuralEngine.generateStream({
          messages: [
            {
              role: 'system',
              content: 'You are Girionix Live Code Auto-Fixer. Fix all runtime and syntax errors in the provided React code. Return ONLY valid, executable JavaScript/JSX without markdown backticks.'
            },
            { role: 'user', content: `Error context:\n${errorContext}\n\nCurrent Code:\n${activeFile.content}` }
          ],
          model: 'girionix-titan-coder',
          onChunk: (chunk, acc) => { fixedContent = acc; }
        });
      } else {
        await openrouter.streamChat({
          messages: [
            {
              role: 'system',
              content: 'You are Girionix Live Code Auto-Fixer. Fix all runtime and syntax errors in the provided React code. Return ONLY valid, executable JavaScript/JSX without markdown backticks.'
            },
            { role: 'user', content: `Error context:\n${errorContext}\n\nCurrent Code:\n${activeFile.content}` }
          ],
          model: activeModel?.id || 'anthropic/claude-3.7-sonnet',
          onChunk: (chunk, acc) => { fixedContent = acc; }
        });
      }

      const cleanCode = fixedContent.replace(/^```[a-zA-Z]*\n/i, '').replace(/```$/i, '').trim();
      if (cleanCode) {
        handleCodeChange(cleanCode);
        setConsoleLogs(prev => [...prev, {
          type: 'info',
          text: '⚡ Girionix Auto-Fix applied successfully!',
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
        // If single code file (e.g. App.jsx, script.js, Component.tsx, main.py)
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

  const handleAiModify = async () => {
    if (!aiPrompt.trim() || isGenerating) return;
    setIsGenerating(true);

    try {
      let fullCode = '';
      if (isTitanMode || activeModel?.isTitan || activeModel?.isLocal || !navigator.onLine) {
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
          model: 'girionix-titan-coder',
          onChunk: (chunk, acc) => {
            fullCode = acc;
          }
        });
      } else {
        await openrouter.streamChat({
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
          model: activeModel?.id || 'anthropic/claude-3.7-sonnet',
          onChunk: (chunk, acc) => {
            fullCode = acc;
          }
        });
      }

      const cleanCode = fullCode.replace(/^```[a-zA-Z]*\n/i, '').replace(/```$/i, '').trim();
      if (cleanCode) {
        handleCodeChange(cleanCode);
        setAiPrompt('');
      }
    } catch (err) {
      console.warn('AI modify error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const getSandboxHtml = () => {
    const appFile = project.files.find(f => f.name === 'App.jsx')?.content || activeFile?.content || project.files[0]?.content || '';
    
    // Extract potential React component candidate names from user code
    const candidateMatches = appFile.match(/(?:function|class|const|let|var)\s+([A-Z][A-Za-z0-9_]*)/g) || [];
    const candidateNames = Array.from(new Set(
      candidateMatches.map(m => m.replace(/(?:function|class|const|let|var)\s+/, '').trim())
    )).filter(name => !['React', 'ReactDOM', 'LucideIcons', 'Component', 'PureComponent', 'ErrorBoundary'].includes(name));

    // Clean and transform ES6 imports & exports for in-browser Babel execution
    let transformedCode = appFile
      // Remove TS type imports
      .replace(/import\s+type\s+.*?;?/g, '')
      .replace(/import\s*\*\s*as\s+React\s+from\s+['"][^'"]+['"];?/g, '')
      // React imports: use var so re-declarations never throw SyntaxError
      .replace(/import\s+React\s*,\s*\{([^}]+)\}\s+from\s+['"][^'"]+['"];?/g, 'var { $1 } = (window.React || {});')
      .replace(/import\s+React\s+from\s+['"][^'"]+['"];?/g, '')
      .replace(/import\s*\{([^}]+)\}\s+from\s+['"]react['"];?/g, 'var { $1 } = (window.React || {});')
      // Lucide and icon imports
      .replace(/import\s*\{([^}]+)\}\s+from\s+['"]lucide-react['"];?/g, 'var { $1 } = (window.LucideIcons || {});')
      .replace(/import\s+([A-Za-z0-9_]+)\s+from\s+['"]lucide-react['"];?/g, 'var $1 = (window.LucideIcons && window.LucideIcons.$1) || (window.LucideIcons?.Sparkles);')
      .replace(/import\s*\{([^}]+)\}\s+from\s+['"]react-icons\/?[^'"]*['"];?/g, 'var { $1 } = (window.LucideIcons || {});')
      // Framer motion and animation mocks
      .replace(/import\s*\{([^}]+)\}\s+from\s+['"]framer-motion['"];?/g, 'var { $1 } = (window.Motion || {});')
      .replace(/import\s+([A-Za-z0-9_]+)\s+from\s+['"]framer-motion['"];?/g, 'var $1 = (window.Motion && window.Motion.$1) || window.Motion?.motion;')
      .replace(/import\s+.*?from\s+['"]canvas-confetti['"];?/g, 'var confetti = window.confetti || (() => {});')
      // Remove other CSS and external package imports gracefully
      .replace(/import\s+['"][^'"]+\.css['"];?/g, '')
      .replace(/import\s+.*?from\s+['"][^'"]+['"];?/g, '')
      // Strip named exports so Babel inside new Function doesn't choke on 'export'
      .replace(/export\s+const\s+/g, 'var ')
      .replace(/export\s+let\s+/g, 'var ')
      .replace(/export\s+var\s+/g, 'var ')
      .replace(/export\s+function\s+/g, 'function ')
      .replace(/export\s+class\s+/g, 'class ')
      .replace(/export\s+\{[^}]+\};?/g, '')
      // Handle export default variants cleanly
      .replace(/export\s+default\s+function\s+([A-Za-z0-9_]+)/g, 'window.__DEFAULT_EXPORT__ = $1; function $1')
      .replace(/export\s+default\s+function\s*\(/g, 'window.__DEFAULT_EXPORT__ = function(')
      .replace(/export\s+default\s+class\s+([A-Za-z0-9_]+)/g, 'window.__DEFAULT_EXPORT__ = $1; class $1')
      .replace(/export\s+default\s+([A-Za-z0-9_]+);?/g, 'window.__DEFAULT_EXPORT__ = $1;')
      .replace(/export\s+default\s+/g, 'window.__DEFAULT_EXPORT__ = ');

    const escapedCode = JSON.stringify(transformedCode);

    // Build return statement checking default export, App, candidates, and common component names
    const candidateChecks = candidateNames.map(name => `(typeof ${name} !== "undefined" ? ${name} : null)`).join(' || ');
    const returnStatement = `return window.__DEFAULT_EXPORT__ || (typeof App !== "undefined" ? App : null) || ${candidateChecks ? candidateChecks + ' || ' : ''}(typeof SnakeGame !== "undefined" ? SnakeGame : null) || (typeof StandaloneSnakeGame !== "undefined" ? StandaloneSnakeGame : null) || (typeof Dashboard !== "undefined" ? Dashboard : null) || (typeof QuantumVisualizer !== "undefined" ? QuantumVisualizer : null) || (typeof Component !== "undefined" ? Component : null) || (typeof Main !== "undefined" ? Main : null);`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Multi-CDN Fallback Engine for React 18 & Babel Standalone -->
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

    // Universal Lucide & React Icons SVG Proxy Generator (Ensures Zero Icon Crash)
    window.LucideIcons = new Proxy({}, {
      get: function(target, prop) {
        if (typeof prop === 'symbol' || prop === 'then' || prop === 'toJSON') {
          return target[prop];
        }
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

    // Mock Framer Motion to prevent crashes in UI animations
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

      // Pre-inject React Hooks into Global Sandbox Context
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

      // Error Boundary Component
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

        // Transform JSX to standard JS with Babel Standalone
        const transformed = Babel.transform(rawCode, {
          presets: ['react'],
          filename: 'App.jsx'
        }).code;

        // Execute Transformed Code without formal parameter collisions
        // Inject hooks with var so redeclaration never causes SyntaxError
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
    <div className="flex-1 flex flex-col h-full bg-[#07080F] text-gray-200 overflow-hidden">
      {/* Top Studio Control Bar */}
      <div className="p-3 border-b border-white/10 bg-[#090B16] flex items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
            <Code2 className="w-4 h-4" />
            <span>Coding Studio • React 18 Live IDE</span>
          </div>

          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
            {project.files.map(f => (
              <button
                key={f.name}
                onClick={() => setActiveFileName(f.name)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                  activeFileName === f.name
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>

          {/* Export & Import File / Project Buttons */}
          <button
            onClick={handleExportCodeProject}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/10 text-xs font-mono transition-all cursor-pointer"
            title="Export Project (.json)"
          >
            <FileDown className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export</span>
          </button>

          <label className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/10 text-xs font-mono transition-all cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Import</span>
            <input type="file" accept=".json,.jsx,.js,.tsx,.ts,.py,.html,.css" onChange={handleImportCodeProject} className="hidden" />
          </label>

          {/* Showcase Templates Dropdown */}
          <div className="relative" ref={templatesDropdownRef}>
            <button
              onClick={() => setIsTemplatesOpen(!isTemplatesOpen)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 text-white font-bold border border-cyan-500/40 text-xs font-mono transition-all cursor-pointer shadow-sm"
              title="Select a pre-built interactive demo for presentation"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>⚡ Templates</span>
              <ChevronDown className={`w-3 h-3 text-cyan-400 transition-transform ${isTemplatesOpen ? 'rotate-180' : ''}`} />
            </button>

            {isTemplatesOpen && (
              <div className="absolute left-0 mt-1.5 w-72 rounded-2xl bg-[#080B17] border border-cyan-500/40 shadow-2xl shadow-glow-cyan/20 p-2 z-50 animate-fadeIn backdrop-blur-2xl">
                <div className="px-2.5 py-1.5 border-b border-white/10 mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-gray-400 font-bold tracking-wider">
                    Office Showcase Demos
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">1-Click Live</span>
                </div>

                <div className="space-y-1">
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

        {/* Viewport switcher & 1-Click Code Actions */}
        <div className="flex items-center gap-2">
          {/* 1-Click Paste Button */}
          <button
            onClick={handlePasteFromClipboard}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/10 text-xs font-mono transition-all"
            title="1-Click Paste from Clipboard"
          >
            <ClipboardPaste className="w-3.5 h-3.5 text-cyan-400" />
            <span>{pasted ? 'Pasted!' : 'Paste Code'}</span>
          </button>

          {/* 1-Click Auto-Indent / Format */}
          <button
            onClick={handleFormatCode}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/10 text-xs font-mono transition-all"
            title="Format Code & Auto-Indent"
          >
            <Wand2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Format</span>
          </button>

          {/* 1-Click Generate Unit Tests */}
          <button
            onClick={handleGenerateUnitTests}
            disabled={isGenerating}
            className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-emerald-300 border border-white/10 text-xs font-mono transition-all"
            title="Generate Vitest / Jest Unit Tests"
          >
            <TestTube className="w-3.5 h-3.5 text-emerald-400" />
            <span>Unit Tests</span>
          </button>

          <div className="hidden sm:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-1.5 rounded-lg ${viewMode === 'desktop' ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:text-white'}`}
              title="Desktop 100%"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('tablet')}
              className={`p-1.5 rounded-lg ${viewMode === 'tablet' ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:text-white'}`}
              title="Tablet (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-1.5 rounded-lg ${viewMode === 'mobile' ? 'bg-cyan-500/20 text-cyan-300' : 'text-gray-400 hover:text-white'}`}
              title="Mobile (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleRunBenchmark}
            disabled={isRunningBenchmark}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 font-bold transition-colors"
            title="Run 100k-ops JavaScript Execution Micro-Benchmark"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{isRunningBenchmark ? 'Measuring...' : 'Benchmark'}</span>
          </button>

          <button
            onClick={handleAutoFixCode}
            disabled={isAutoFixing}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-bold transition-colors"
            title="1-Click Code Auto-Fix: Automatically repair console errors"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isAutoFixing ? 'Fixing...' : 'Auto-Fix'}</span>
          </button>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shadow-sm hover:scale-105 ${
              copied 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-emerald' 
                : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 shadow-glow-cyan'
            }`}
            title="1-Click Copy entire code to clipboard (Ctrl+C)"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleDownloadActiveFile}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer"
            title="Download Active File (.jsx)"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Benchmark Results HUD */}
      {benchmarkResult && (
        <div className="px-4 py-2 bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border-b border-purple-500/20 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-purple-300 font-bold flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-purple-400" />
              <span>JS Engine Latency:</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 font-bold">
              {benchmarkResult.durationMs} ms
            </span>
            <span className="text-gray-400">
              Throughput: <strong className="text-cyan-300">{benchmarkResult.opsPerSec} ops/sec</strong> ({benchmarkResult.iterations} cycles)
            </span>
          </div>
          <button onClick={() => setBenchmarkResult(null)} className="text-gray-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Main Split: Code Editor (Left) & Sandboxed Preview (Right) */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 overflow-hidden">
        {/* Left: Code Editor */}
        <div className="flex flex-col h-full bg-[#05060A] overflow-hidden">
          <div className="flex-1 overflow-auto p-4 font-mono text-xs text-cyan-100">
            <textarea
              value={activeFile.content}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="w-full h-full bg-transparent border-0 outline-none resize-none font-mono text-xs text-cyan-200 leading-relaxed focus:outline-none"
              spellCheck="false"
            />
          </div>

          {/* AI Code Copilot Prompt Bar */}
          <div className="p-3 border-t border-white/10 bg-[#090B16] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Ask Girionix to add a feature, refactor, or style this component..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAiModify(); }}
              className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/40"
            />
            <button
              onClick={handleAiModify}
              disabled={!aiPrompt.trim() || isGenerating}
              className="px-3 py-1.5 rounded-xl bg-cyan-500 text-black font-bold text-xs disabled:opacity-40 shadow-glow-cyan"
            >
              {isGenerating ? 'Synthesizing...' : 'Refactor'}
            </button>
          </div>
        </div>

        {/* Right: Live Sandboxed React 18 Runner */}
        <div className="flex flex-col h-full bg-[#07080F] overflow-hidden">
          <div className="flex-1 flex items-center justify-center p-3 bg-black/40 overflow-auto">
            <div
              className={`h-full transition-all duration-300 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black ${
                viewMode === 'desktop' ? 'w-full' : viewMode === 'tablet' ? 'w-[768px] max-w-full' : 'w-[375px] max-w-full'
              }`}
            >
              <iframe
                ref={iframeRef}
                title="Girionix Sandboxed Live App"
                srcDoc={getSandboxHtml()}
                sandbox="allow-scripts allow-modals allow-same-origin"
                className="w-full h-full border-0 bg-[#07080F]"
              />
            </div>
          </div>

          {/* Collapsible Console Drawer */}
          <div className="border-t border-white/10 bg-[#090B16]">
            <button
              onClick={() => setIsConsoleOpen(!isConsoleOpen)}
              className="w-full px-3 py-1.5 flex items-center justify-between text-[11px] font-mono text-gray-400 hover:text-white"
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Console ({consoleLogs.length})</span>
                {consoleLogs.some(l => l.type === 'error') && (
                  <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[10px]">Errors</span>
                )}
              </div>
              {isConsoleOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>

            {isConsoleOpen && (
              <div className="p-3 max-h-36 overflow-y-auto font-mono text-[11px] space-y-1 bg-[#05060A]">
                {consoleLogs.length === 0 ? (
                  <div className="text-gray-600">No console outputs yet.</div>
                ) : (
                  consoleLogs.map((log, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-2 ${
                        log.type === 'error' ? 'text-rose-400' : log.type === 'warn' ? 'text-amber-400' : 'text-cyan-200'
                      }`}
                    >
                      <span className="text-gray-600 flex-shrink-0">{log.time}</span>
                      <span className="break-all">{log.text}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
