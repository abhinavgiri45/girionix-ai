import React, { useState, useEffect, useRef } from 'react';
import { 
  Sigma, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Calculator,
  Rotate3d,
  Cpu,
  Zap,
  Upload,
  FileDown
} from 'lucide-react';
import KatexMath from '../common/KatexMath';
import Surface3DPlotter from './Surface3DPlotter';
import { DEMO_MATH_PROBLEMS } from '../../data/demoData';
import { openrouter } from '../../services/openrouter';
import { localNeuralEngine } from '../../services/localNeuralEngine';

export default function MathLab({ activeModel, isLocalMode = false }) {
  const [selectedProblem, setSelectedProblem] = useState(DEMO_MATH_PROBLEMS[0]);
  const [customEquation, setCustomEquation] = useState('');
  const [activeFunction, setActiveFunction] = useState('Math.sin(x) / (x || 0.0001)');
  const [plotRange, setPlotRange] = useState({ minX: -10, maxX: 10, minY: -2, maxY: 2 });
  const [plotMode, setPlotMode] = useState('2d'); // '2d' | '3d'
  const [isSolving, setIsSolving] = useState(false);
  const [solvedDerivation, setSolvedDerivation] = useState(null);
  const [reasoningTrace, setReasoningTrace] = useState('');

  const canvasRef = useRef(null);

  const mathSymbols = [
    { label: '∫', code: '\\int_{0}^{\\infty} ' },
    { label: '∑', code: '\\sum_{n=1}^{\\infty} ' },
    { label: '∂/∂x', code: '\\frac{\\partial}{\\partial x} ' },
    { label: '√x', code: '\\sqrt{x} ' },
    { label: 'lim', code: '\\lim_{x\\to 0} ' },
    { label: 'π', code: '\\pi ' },
    { label: '∞', code: '\\infty ' },
    { label: '∇', code: '\\nabla ' },
    { label: 'e^x', code: 'e^{x} ' },
    { label: 'ζ(s)', code: '\\zeta(s) ' }
  ];

  const [showDerivative, setShowDerivative] = useState(true);
  const [showIntegral, setShowIntegral] = useState(false);
  const [hoverCoord, setHoverCoord] = useState(null);

  const functionPresets = [
    { name: 'sinc(x)', fn: 'Math.sin(x) / (x || 0.0001)', desc: 'Cardinal Sine' },
    { name: 'Gaussian Wave', fn: 'Math.exp(-x*x/8) * Math.cos(3*x)', desc: 'Wave Packet' },
    { name: 'Harmonics', fn: 'Math.sin(x) + 0.5 * Math.sin(3*x) + 0.25 * Math.sin(5*x)', desc: 'Fourier Sum' },
    { name: 'Damped Oscillator', fn: 'Math.exp(-0.15 * Math.abs(x)) * Math.cos(2*x)', desc: 'Decaying Wave' },
    { name: 'Cubic Poly', fn: '0.08 * (x*x*x - 7*x)', desc: 'Polynomial' }
  ];

  useEffect(() => {
    if (plotMode !== '2d') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight || 240);

    ctx.fillStyle = '#070913';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;

    const { minX, maxX, minY, maxY } = plotRange;
    const toScreenX = (x) => ((x - minX) / (maxX - minX)) * width;
    const toScreenY = (y) => height - ((y - minY) / (maxY - minY)) * height;

    // Grid lines
    for (let x = Math.ceil(minX); x <= Math.floor(maxX); x += 2) {
      const sx = toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();
    }

    for (let y = Math.ceil(minY); y <= Math.floor(maxY); y += 1) {
      const sy = toScreenY(y);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, toScreenY(0));
    ctx.lineTo(width, toScreenY(0));
    ctx.moveTo(toScreenX(0), 0);
    ctx.lineTo(toScreenX(0), height);
    ctx.stroke();

    const evalFn = (x) => {
      try {
        const fn = new Function('x', `return ${activeFunction};`);
        return fn(x);
      } catch (_) {
        return NaN;
      }
    };

    const step = (maxX - minX) / width;
    const h = 0.001;

    // 1. Numerical Derivative f'(x) in Cyan (if enabled)
    if (showDerivative) {
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.7)';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      let started = false;
      for (let x = minX; x <= maxX; x += step) {
        const y1 = evalFn(x + h);
        const y0 = evalFn(x - h);
        const dy = (y1 - y0) / (2 * h);
        if (!isNaN(dy) && isFinite(dy)) {
          const sx = toScreenX(x);
          const sy = toScreenY(dy);
          if (!started) { ctx.moveTo(sx, sy); started = true; }
          else { ctx.lineTo(sx, sy); }
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 2. Numerical Integral in Emerald (if enabled)
    if (showIntegral) {
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      let started = false;
      let accum = 0;
      for (let x = minX; x <= maxX; x += step) {
        const yVal = evalFn(x);
        if (!isNaN(yVal) && isFinite(yVal)) {
          accum += yVal * step;
          const sx = toScreenX(x);
          const sy = toScreenY(accum);
          if (!started) { ctx.moveTo(sx, sy); started = true; }
          else { ctx.lineTo(sx, sy); }
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 3. Primary Function f(x) in Purple
    ctx.strokeStyle = '#A855F7';
    ctx.lineWidth = 2.8;
    ctx.beginPath();

    let started = false;
    for (let x = minX; x <= maxX; x += step) {
      const y = evalFn(x);
      if (!isNaN(y) && isFinite(y)) {
        const sx = toScreenX(x);
        const sy = toScreenY(y);
        if (!started) {
          ctx.moveTo(sx, sy);
          started = true;
        } else {
          ctx.lineTo(sx, sy);
        }
      }
    }
    ctx.stroke();

    // 4. Hover Crosshair & Tangent Point
    if (hoverCoord && hoverCoord.x !== null) {
      const hx = hoverCoord.x;
      const hy = evalFn(hx);
      if (!isNaN(hy) && isFinite(hy)) {
        const sx = toScreenX(hx);
        const sy = toScreenY(hy);

        // Vertical dashed guideline
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Highlight point
        ctx.fillStyle = '#EC4899';
        ctx.beginPath();
        ctx.arc(sx, sy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }, [activeFunction, plotRange, plotMode, showDerivative, showIntegral, hoverCoord]);

  const handleSolveCustom = async () => {
    if (!customEquation.trim()) return;
    setIsSolving(true);
    setSolvedDerivation(null);
    setReasoningTrace('');

    try {
      if (isLocalMode || activeModel?.isLocal || !navigator.onLine) {
        // 100% Offline Girionix Sovereign Tensor Solver
        await localNeuralEngine.generateStream({
          messages: [
            {
              role: 'system',
              content: 'You are the Girionix Deep Math Lab. Solve with maximum analytical rigor, step-by-step proofs, and formatted KaTeX equations ($$ ... $$).'
            },
            { role: 'user', content: `Solve with step-by-step derivations:\n\n${customEquation}` }
          ],
          model: 'girionix-pro',
          onChunk: (chunk, acc) => {
            setSolvedDerivation(acc);
          }
        });
      } else {
        let fullContent = '';
        await openrouter.streamChat({
          messages: [
            {
              role: 'system',
              content: 'You are the Girionix Deep Math Lab. Solve with maximum analytical rigor, step-by-step proofs, and formatted KaTeX equations ($$ ... $$).'
            },
            { role: 'user', content: `Solve with step-by-step derivations:\n\n${customEquation}` }
          ],
          model: activeModel?.id || 'openai/o3-mini',
          onReasoningChunk: (chunk, full) => setReasoningTrace(full),
          onChunk: (chunk, full) => {
            fullContent = full;
            setSolvedDerivation(full);
          }
        });
      }
    } catch (err) {
      setSolvedDerivation(`⚠️ Error: ${err.message}`);
    } finally {
      setIsSolving(false);
    }
  };

  const handleExportMathSession = () => {
    const mathData = {
      version: '1.0.0',
      type: 'girionix_math_session',
      exportedAt: new Date().toISOString(),
      problem: selectedProblem,
      customEquation,
      solvedDerivation,
      activeFunction,
      plotRange,
      plotMode
    };
    const blob = new Blob([JSON.stringify(mathData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Girionix_MathLab_Session_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportMathSession = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target.result;
        if (file.name.endsWith('.json')) {
          const data = JSON.parse(text);
          if (data.problem) setSelectedProblem(data.problem);
          if (data.customEquation) setCustomEquation(data.customEquation);
          if (data.solvedDerivation) setSolvedDerivation(data.solvedDerivation);
          if (data.activeFunction) setActiveFunction(data.activeFunction);
          if (data.plotRange) setPlotRange(data.plotRange);
          if (data.plotMode) setPlotMode(data.plotMode);
        } else {
          setCustomEquation(text);
        }
      } catch (err) {
        console.error('Import math error:', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#07080F] overflow-y-auto p-4 space-y-4">
      {/* Top Presets & Import/Export */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 flex-shrink-0 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {DEMO_MATH_PROBLEMS.map((problem) => (
            <button
              key={problem.id}
              onClick={() => {
                setSelectedProblem(problem);
                setActiveFunction(problem.plotFunction);
                setSolvedDerivation(null);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all border whitespace-nowrap ${
                selectedProblem.id === problem.id && !solvedDerivation
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glow-emerald font-bold'
                  : 'bg-white/[0.03] text-gray-400 border-white/[0.08] hover:text-white'
              }`}
            >
              <span>{problem.title.split(':')[0]}</span>
            </button>
          ))}
        </div>

        {/* Export & Import Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportMathSession}
            className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Export Math Session (.json)"
          >
            <FileDown className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export</span>
          </button>

          <label className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Import</span>
            <input type="file" accept=".json,.tex,.txt" onChange={handleImportMathSession} className="hidden" />
          </label>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        {/* Left: Derivations (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="p-4 rounded-2xl bg-[#0C0E1B] border border-emerald-500/30 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-emerald-400 font-semibold">{selectedProblem.category}</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">{selectedProblem.difficulty}</span>
            </div>

            <h3 className="text-sm font-bold text-white">{selectedProblem.title}</h3>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-center shadow-inner">
              <KatexMath math={selectedProblem.formula} block={true} />
            </div>

            {!solvedDerivation ? (
              <div className="space-y-2 pt-1">
                {selectedProblem.steps.map((step) => (
                  <div key={step.step} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <div className="text-xs font-semibold text-emerald-300 flex items-center justify-between">
                      <span>Step {step.step}: {step.title}</span>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div className="py-0.5">
                      <KatexMath math={step.math} block={true} />
                    </div>
                    <p className="text-[11px] text-gray-400">{step.explanation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                {reasoningTrace && (
                  <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs font-mono text-purple-200 whitespace-pre-wrap">
                    {reasoningTrace}
                  </div>
                )}
                <div className="p-3 rounded-xl bg-slate-950 text-xs text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {solvedDerivation}
                </div>
              </div>
            )}
          </div>

          {/* Formula Toolbar */}
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/[0.08] space-y-2">
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              <span className="text-[10px] text-gray-500 font-mono flex-shrink-0">Insert:</span>
              {mathSymbols.map((sym, idx) => (
                <button
                  key={idx}
                  onClick={() => setCustomEquation(prev => prev + sym.code)}
                  className="px-2 py-0.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-cyan-300 text-xs font-mono border border-white/5 transition-colors flex-shrink-0"
                >
                  {sym.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter equation, e.g. \int_0^\pi \sin^2(x) dx..."
                value={customEquation}
                onChange={(e) => setCustomEquation(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSolveCustom(); }}
                className="flex-1 px-3 py-2 rounded-xl bg-[#080911] border border-white/10 text-white text-xs font-mono focus:border-emerald-400 focus:outline-none"
              />
              <button
                onClick={handleSolveCustom}
                disabled={isSolving || !customEquation.trim()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:opacity-90 disabled:opacity-40 text-black font-bold text-xs flex items-center gap-1 shadow-glow-emerald transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isSolving ? '...' : 'Derive'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: 2D & 3D Function Grapher (Feature 7) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/10 w-fit">
            <button
              onClick={() => setPlotMode('2d')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                plotMode === '2d' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-gray-400'
              }`}
            >
              2D Curve
            </button>
            <button
              onClick={() => setPlotMode('3d')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                plotMode === '3d' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-gray-400'
              }`}
            >
              3D Surface
            </button>
          </div>

          {plotMode === '2d' ? (
            <div className="p-4 rounded-2xl bg-[#0C0E1B] border border-cyan-500/30 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white">2D Function Visualizer</span>
                </div>
                {hoverCoord ? (
                  <span className="text-[10px] font-mono text-pink-300 font-bold">
                    x: {hoverCoord.x.toFixed(2)} | y: {hoverCoord.y.toFixed(2)}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-cyan-400">Canvas 60fps • Hover Inspector</span>
                )}
              </div>

              {/* Function Presets Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {functionPresets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveFunction(p.fn)}
                    className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-gray-300 hover:text-cyan-300 text-[10px] font-mono border border-white/5 whitespace-nowrap transition-colors"
                  >
                    {p.name}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 block mb-1">Plot $f(x)$:</label>
                <input
                  type="text"
                  value={activeFunction}
                  onChange={(e) => setActiveFunction(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-cyan-300 font-mono text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              {/* Curve Layer Toggles */}
              <div className="flex items-center gap-2 text-[10px] font-mono">
                <button
                  onClick={() => setShowDerivative(!showDerivative)}
                  className={`px-2 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                    showDerivative ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold' : 'bg-white/5 text-gray-400 border-white/5'
                  }`}
                >
                  <span>🔵 f'(x) Derivative</span>
                </button>
                <button
                  onClick={() => setShowIntegral(!showIntegral)}
                  className={`px-2 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                    showIntegral ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold' : 'bg-white/5 text-gray-400 border-white/5'
                  }`}
                >
                  <span>🟢 ∫ f(x)dx Integral</span>
                </button>
              </div>

              <div 
                className="w-full h-56 rounded-xl overflow-hidden border border-cyan-500/20 bg-[#070913] relative cursor-crosshair"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const px = e.clientX - rect.left;
                  const ratio = px / rect.width;
                  const xVal = plotRange.minX + ratio * (plotRange.maxX - plotRange.minX);
                  try {
                    const fn = new Function('x', `return ${activeFunction};`);
                    const yVal = fn(xVal);
                    setHoverCoord({ x: xVal, y: isNaN(yVal) ? 0 : yVal });
                  } catch (_) {}
                }}
                onMouseLeave={() => setHoverCoord(null)}
              >
                <canvas ref={canvasRef} className="w-full h-full" />
              </div>
            </div>
          ) : (
            <Surface3DPlotter />
          )}
        </div>
      </div>
    </div>
  );
}
