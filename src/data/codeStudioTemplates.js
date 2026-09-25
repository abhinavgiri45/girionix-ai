import { ADVANCED_SKILLS_CATALOG } from '../services/advancedCodingSkills';

/**
 * GIRIONIX AI — CODING STUDIO SHOWCASE TEMPLATES
 * Curated for high-impact office demonstrations and instant interactive prototyping.
 */

const BASE_TEMPLATES = [
  {
    id: 'cyber-snake',
    name: 'Cyber Snake Arcade Game',
    tag: 'Interactive Game',
    category: 'Game Dev',
    icon: 'Gamepad2',
    description: 'Playable 2D cyberpunk arcade snake game with Web Audio sound synthesis, particle effects, and high score tracking.',
    code: `import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function CyberSnakeGame() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try { return parseInt(localStorage.getItem('girionix_snake_hs') || '0', 10); } catch (_) { return 0; }
  });
  const [gameState, setGameState] = useState('ready'); // 'ready' | 'playing' | 'gameover'
  const [speedLevel, setSpeedLevel] = useState('normal'); // 'easy' | 'normal' | 'hyper'

  // Game internal state ref to prevent stale closures in requestAnimationFrame
  const stateRef = useRef({
    snake: [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 15, y: 10 },
    particles: [],
    gridSize: 20,
    tileCount: 20,
    lastTick: 0,
    speedMs: 100
  });

  // Simple Web Audio API Synth (Zero External Assets)
  const playBeep = useCallback((freq = 440, type = 'sine', duration = 0.08) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (_) {}
  }, []);

  const spawnFood = useCallback(() => {
    const s = stateRef.current;
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * s.tileCount),
        y: Math.floor(Math.random() * s.tileCount)
      };
      const onSnake = s.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    s.food = newFood;
  }, []);

  const spawnParticles = (x, y, color) => {
    const s = stateRef.current;
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16;
      const speed = Math.random() * 2 + 1;
      s.particles.push({
        x: x * s.gridSize + s.gridSize / 2,
        y: y * s.gridSize + s.gridSize / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        color
      });
    }
  };

  const startGame = () => {
    const s = stateRef.current;
    s.snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    s.dir = { x: 1, y: 0 };
    s.nextDir = { x: 1, y: 0 };
    s.particles = [];
    s.speedMs = speedLevel === 'easy' ? 130 : speedLevel === 'hyper' ? 65 : 95;
    spawnFood();
    setScore(0);
    setGameState('playing');
    playBeep(660, 'sine', 0.12);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      const s = stateRef.current;
      if (['ArrowUp', 'KeyW'].includes(e.code) && s.dir.y === 0) {
        s.nextDir = { x: 0, y: -1 };
        e.preventDefault();
      } else if (['ArrowDown', 'KeyS'].includes(e.code) && s.dir.y === 0) {
        s.nextDir = { x: 0, y: 1 };
        e.preventDefault();
      } else if (['ArrowLeft', 'KeyA'].includes(e.code) && s.dir.x === 0) {
        s.nextDir = { x: -1, y: 0 };
        e.preventDefault();
      } else if (['ArrowRight', 'KeyD'].includes(e.code) && s.dir.x === 0) {
        s.nextDir = { x: 1, y: 0 };
        e.preventDefault();
      } else if (e.code === 'Space' && gameState !== 'playing') {
        startGame();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, speedLevel]);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const gameLoop = (timestamp) => {
      const s = stateRef.current;
      const size = canvas.width;
      const gs = size / s.tileCount;
      s.gridSize = gs;

      // Update game physics on tick
      if (gameState === 'playing' && timestamp - s.lastTick > s.speedMs) {
        s.lastTick = timestamp;
        s.dir = s.nextDir;

        const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };

        // Wall collisions
        if (head.x < 0 || head.x >= s.tileCount || head.y < 0 || head.y >= s.tileCount) {
          setGameState('gameover');
          playBeep(180, 'sawtooth', 0.3);
          return;
        }

        // Self collisions
        if (s.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
          setGameState('gameover');
          playBeep(160, 'sawtooth', 0.3);
          return;
        }

        s.snake.unshift(head);

        // Food collision
        if (head.x === s.food.x && head.y === s.food.y) {
          spawnParticles(s.food.x, s.food.y, '#00F0FF');
          playBeep(880, 'triangle', 0.08);
          setScore(prev => {
            const next = prev + 10;
            if (next > highScore) {
              setHighScore(next);
              try { localStorage.setItem('girionix_snake_hs', next.toString()); } catch (_) {}
            }
            return next;
          });
          spawnFood();
          // Gradual speed acceleration
          s.speedMs = Math.max(50, s.speedMs - 1.5);
        } else {
          s.snake.pop();
        }
      }

      // Draw Grid & Background
      ctx.fillStyle = '#060812';
      ctx.fillRect(0, 0, size, size);

      // Subtle Gridlines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= s.tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gs, 0);
        ctx.lineTo(i * gs, size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * gs);
        ctx.lineTo(size, i * gs);
        ctx.stroke();
      }

      // Draw Food with Pulsing Glow
      const pulse = (Math.sin(timestamp * 0.008) + 1) * 0.5;
      ctx.save();
      ctx.shadowBlur = 15 + pulse * 10;
      ctx.shadowColor = '#FF0055';
      ctx.fillStyle = '#FF0055';
      ctx.beginPath();
      ctx.arc(
        s.food.x * gs + gs / 2,
        s.food.y * gs + gs / 2,
        (gs / 2 - 2) + pulse * 1.5,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();

      // Draw Snake Segments
      s.snake.forEach((seg, idx) => {
        const isHead = idx === 0;
        ctx.save();
        ctx.shadowBlur = isHead ? 14 : 6;
        ctx.shadowColor = isHead ? '#00F0FF' : '#00A3FF';
        ctx.fillStyle = isHead ? '#00F0FF' : 'rgba(0, 200, 255, ' + (1 - idx / (s.snake.length + 4)) + ')';
        
        const pad = isHead ? 2 : 3;
        ctx.beginPath();
        ctx.roundRect(
          seg.x * gs + pad,
          seg.y * gs + pad,
          gs - pad * 2,
          gs - pad * 2,
          isHead ? 6 : 4
        );
        ctx.fill();
        ctx.restore();
      });

      // Update & Draw Particles
      s.particles = s.particles.filter(p => p.life > 0.05);
      s.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
        ctx.restore();
      });

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, highScore, playBeep, spawnFood]);

  return (
    <div className="w-full h-full min-h-[520px] bg-[#070913] text-white p-5 rounded-2xl flex flex-col items-center justify-between border border-cyan-500/30 shadow-2xl font-sans select-none">
      
      {/* Top Header & Score HUD */}
      <div className="w-full max-w-md flex items-center justify-between px-2 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-lg font-black tracking-tight flex items-center gap-2 text-cyan-400">
            <span>⚡ Cyber Snake Arcade</span>
          </h2>
          <p className="text-[11px] text-gray-400 font-mono">React 18 + HTML5 Canvas Engine</p>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
            <span className="text-gray-400 text-[10px] block">SCORE</span>
            <span className="text-cyan-300 font-bold text-sm">{score}</span>
          </div>
          <div className="px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30">
            <span className="text-gray-400 text-[10px] block">BEST</span>
            <span className="text-purple-300 font-bold text-sm">{highScore}</span>
          </div>
        </div>
      </div>

      {/* Main Game Screen Canvas Container */}
      <div className="relative my-4 rounded-2xl overflow-hidden border-2 border-cyan-500/40 shadow-glow-cyan/30">
        <canvas
          ref={canvasRef}
          width={380}
          height={380}
          className="block bg-[#050711]"
        />

        {/* Start / Game Over Overlay */}
        {gameState !== 'playing' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fadeIn">
            {gameState === 'gameover' ? (
              <>
                <div className="text-rose-400 font-mono text-xs font-bold tracking-widest uppercase">System Crash</div>
                <div className="text-2xl font-black text-white">GAME OVER</div>
                <div className="text-cyan-300 text-sm font-mono">Final Score: {score}</div>
              </>
            ) : (
              <>
                <div className="text-cyan-400 font-mono text-xs font-bold tracking-widest uppercase">Girionix Arcade Engine</div>
                <div className="text-2xl font-black text-white">CYBER SNAKE</div>
                <p className="text-xs text-gray-400 max-w-xs">
                  Guide the neon particle snake, eat red quantum energy cores, and beat your high score.
                </p>
              </>
            )}

            <button
              onClick={startGame}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-xs uppercase tracking-wider shadow-glow-cyan transition-all transform hover:scale-105 cursor-pointer"
            >
              {gameState === 'gameover' ? 'Play Again' : 'Launch Game'}
            </button>
            <div className="text-[10px] text-gray-400 font-mono">Press [Space] or Click to Start</div>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div className="w-full max-w-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono pt-2 border-t border-white/10">
        <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
          <span>Speed:</span>
          {['easy', 'normal', 'hyper'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setSpeedLevel(lvl)}
              disabled={gameState === 'playing'}
              className={\`px-2 py-0.5 rounded capitalize transition-all \${
                speedLevel === lvl 
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' 
                  : 'hover:text-white text-gray-500'
              }\`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-gray-400">
          Controls: <span className="text-cyan-300 font-bold">W/A/S/D</span> or <span className="text-cyan-300 font-bold">Arrows</span>
        </div>
      </div>

    </div>
  );
}`
  },
  {
    id: 'saas-dashboard',
    name: 'SaaS Executive Analytics Dashboard',
    tag: 'Enterprise UI',
    category: 'Full Dashboard',
    icon: 'BarChart3',
    description: 'Executive revenue metrics, interactive SVG line charts with monthly tooltips, and real-time transaction stream.',
    code: `import React, { useState } from 'react';

export default function SaasExecutiveDashboard() {
  const [timeRange, setTimeRange] = useState('30D');
  const [selectedMetric, setSelectedMetric] = useState('mrr');
  const [searchTerm, setSearchTerm] = useState('');

  const metrics = [
    { id: 'mrr', label: 'Monthly Recurring Revenue', value: '$148,520', change: '+18.4%', isPositive: true, sub: '+$23,100 vs last month' },
    { id: 'subs', label: 'Active Enterprise Seats', value: '4,180', change: '+12.6%', isPositive: true, sub: '+468 net new users' },
    { id: 'ltv', label: 'Customer Lifetime Value', value: '$3,840', change: '+5.2%', isPositive: true, sub: 'Net retention 124%' },
    { id: 'churn', label: 'Gross Churn Rate', value: '0.78%', change: '-0.24%', isPositive: true, sub: 'Lowest this quarter' }
  ];

  const chartData = [
    { month: 'Jan', mrr: 88, subs: 2400 },
    { month: 'Feb', mrr: 96, subs: 2700 },
    { month: 'Mar', mrr: 104, subs: 3050 },
    { month: 'Apr', mrr: 115, subs: 3300 },
    { month: 'May', mrr: 122, subs: 3520 },
    { month: 'Jun', mrr: 135, subs: 3890 },
    { month: 'Jul', mrr: 148, subs: 4180 }
  ];

  const transactions = [
    { id: 'TX-9021', company: 'Acme Robotics AI', plan: 'Enterprise Sovereign', amount: '$12,400', date: 'Today, 2:45 PM', status: 'Settled' },
    { id: 'TX-9022', company: 'Nexus BioHealth', plan: 'Girionix Enterprise Cluster', amount: '$8,900', date: 'Today, 1:12 PM', status: 'Settled' },
    { id: 'TX-9023', company: 'Quantum Dynamics', plan: 'Developer Studio', amount: '$2,400', date: 'Today, 11:30 AM', status: 'Processing' },
    { id: 'TX-9024', company: 'Vanguard Aerospace', plan: 'Enterprise Sovereign', amount: '$24,000', date: 'Yesterday', status: 'Settled' },
    { id: 'TX-9025', company: 'Aether Cloud Labs', plan: 'Team Pro', amount: '$1,200', date: 'Yesterday', status: 'Settled' }
  ];

  const filteredTx = transactions.filter(t => 
    t.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full min-h-[560px] bg-[#070914] text-gray-100 p-6 rounded-2xl flex flex-col gap-5 border border-cyan-500/20 shadow-2xl font-sans overflow-y-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <h1 className="text-xl font-bold tracking-tight text-white">Giri Corp • Executive SaaS Metrics</h1>
          </div>
          <p className="text-xs text-gray-400 font-mono mt-0.5">Sovereign Enterprise ARR / MRR Intelligence</p>
        </div>

        {/* Time Filter Controls */}
        <div className="flex items-center gap-1.5 bg-white/[0.04] p-1 rounded-xl border border-white/10 text-xs font-mono">
          {['7D', '30D', '90D', '1Y'].map(t => (
            <button
              key={t}
              onClick={() => setTimeRange(t)}
              className={\`px-3 py-1 rounded-lg transition-all \${
                timeRange === t 
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm' 
                  : 'text-gray-400 hover:text-white'
              }\`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map(m => (
          <div
            key={m.id}
            onClick={() => setSelectedMetric(m.id)}
            className={\`p-4 rounded-xl border transition-all cursor-pointer \${
              selectedMetric === m.id
                ? 'bg-gradient-to-b from-cyan-950/40 to-black/60 border-cyan-500/50 shadow-glow-cyan/20'
                : 'bg-white/[0.02] border-white/10 hover:border-white/20'
            }\`}
          >
            <div className="text-xs text-gray-400 font-medium truncate">{m.label}</div>
            <div className="text-2xl font-black text-white mt-1">{m.value}</div>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono">
              <span className="text-emerald-400 font-bold">{m.change}</span>
              <span className="text-gray-500 truncate">{m.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Revenue SVG Line Chart */}
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="font-bold text-gray-200">Revenue Growth Trajectory (Thousands USD)</div>
          <div className="text-cyan-400 font-bold">Q1-Q3 2026 Active Record</div>
        </div>

        <div className="h-44 w-full relative pt-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 700 140" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Gradient Area */}
            <path
              d="M 0,110 L 100,95 L 200,80 L 300,60 L 400,48 L 500,28 L 600,8 L 600,140 L 0,140 Z"
              fill="url(#chartGrad)"
            />

            {/* Main Trajectory Line */}
            <path
              d="M 0,110 L 100,95 L 200,80 L 300,60 L 400,48 L 500,28 L 600,8"
              fill="none"
              stroke="#00F0FF"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Data Points */}
            {[
              { x: 0, y: 110, val: '$88k' },
              { x: 100, y: 95, val: '$96k' },
              { x: 200, y: 80, val: '$104k' },
              { x: 300, y: 60, val: '$115k' },
              { x: 400, y: 48, val: '$122k' },
              { x: 500, y: 28, val: '$135k' },
              { x: 600, y: 8, val: '$148k' }
            ].map((pt, i) => (
              <g key={i}>
                <circle cx={pt.x} cy={pt.y} r="5" fill="#050711" stroke="#00F0FF" strokeWidth="2.5" />
                <text x={pt.x} y={pt.y - 10} fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  {pt.val}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="flex justify-between text-[11px] text-gray-500 font-mono px-2 pt-2 border-t border-white/5">
          {chartData.map(d => <span key={d.month}>{d.month}</span>)}
        </div>
      </div>

      {/* Real-Time Transaction Stream Table */}
      <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-xs font-mono font-bold text-gray-200">Recent Enterprise Invoices</div>
          <input
            type="text"
            placeholder="Search account or plan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-gray-500 border-b border-white/5">
                <th className="pb-2 font-medium">Invoice ID</th>
                <th className="pb-2 font-medium">Client Account</th>
                <th className="pb-2 font-medium">Subscription Tier</th>
                <th className="pb-2 font-medium">Amount</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {filteredTx.map(t => (
                <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5 text-cyan-400 font-bold">{t.id}</td>
                  <td className="py-2.5 text-white font-medium">{t.company}</td>
                  <td className="py-2.5">{t.plan}</td>
                  <td className="py-2.5 text-white font-bold">{t.amount}</td>
                  <td className="py-2.5">
                    <span className={\`px-2 py-0.5 rounded-full text-[10px] font-bold \${
                      t.status === 'Settled'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }\`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}`
  },
  {
    id: 'agile-kanban',
    name: 'Agile Sprint Kanban Board',
    tag: 'Workflow Tool',
    category: 'Productivity',
    icon: 'KanbanSquare',
    description: 'Sprint management board with task creation, priority badges, drag/move actions, and completion tracking.',
    code: `import React, { useState } from 'react';

export default function AgileKanbanBoard() {
  const [tasks, setTasks] = useState([
    { id: 'GIR-101', title: 'Integrate DeepSeek R1 671B model weights', column: 'in-progress', priority: 'Critical', tag: 'Core AI' },
    { id: 'GIR-102', title: 'Add dedicated /chat direct workspace routing', column: 'review', priority: 'High', tag: 'SPA Engine' },
    { id: 'GIR-103', title: 'Design Web Audio synth for arcade snake game', column: 'done', priority: 'Medium', tag: 'Canvas Dev' },
    { id: 'GIR-104', title: 'Compile sovereign offline binary for Linux AppImage', column: 'backlog', priority: 'High', tag: 'Sovereign' },
    { id: 'GIR-105', title: 'Optimize KaTeX LaTeX rendering in Math Lab', column: 'done', priority: 'Low', tag: 'KaTeX' }
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('High');
  const [newTaskTag, setNewTaskTag] = useState('Feature');

  const columns = [
    { id: 'backlog', title: 'Sprint Backlog', color: 'border-gray-500/30 text-gray-300' },
    { id: 'in-progress', title: 'In Progress', color: 'border-cyan-500/40 text-cyan-300' },
    { id: 'review', title: 'Code Review', color: 'border-purple-500/40 text-purple-300' },
    { id: 'done', title: 'Shipped & Verified', color: 'border-emerald-500/40 text-emerald-300' }
  ];

  const moveTask = (taskId, direction) => {
    const order = ['backlog', 'in-progress', 'review', 'done'];
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const currentIdx = order.indexOf(t.column);
      const nextIdx = currentIdx + direction;
      if (nextIdx >= 0 && nextIdx < order.length) {
        return { ...t, column: order[nextIdx] };
      }
      return t;
    }));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: \`GIR-\${Math.floor(100 + Math.random() * 900)}\`,
      title: newTaskTitle.trim(),
      column: 'backlog',
      priority: newTaskPriority,
      tag: newTaskTag
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
  };

  const completedCount = tasks.filter(t => t.column === 'done').length;
  const progressPct = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="w-full h-full min-h-[560px] bg-[#070914] text-gray-100 p-5 rounded-2xl flex flex-col gap-4 border border-cyan-500/20 shadow-2xl font-sans overflow-hidden">
      
      {/* Header & Sprint Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <span>📋 Girionix Agile Sprint 42</span>
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-0.5">Autonomous Task & Engineering Flow</p>
        </div>

        {/* Sprint Progress Gauge */}
        <div className="flex items-center gap-3">
          <div className="text-right font-mono text-xs">
            <div className="text-gray-400 text-[10px]">SPRINT VELOCITY</div>
            <div className="text-emerald-400 font-bold">{progressPct}% Completed ({completedCount}/{tasks.length})</div>
          </div>
          <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500" style={{ width: \`\${progressPct}%\` }}></div>
          </div>
        </div>
      </div>

      {/* Quick Add Task Input Form */}
      <form onSubmit={handleAddTask} className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono">
        <input
          type="text"
          placeholder="New engineering task description..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
        />
        <select
          value={newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-gray-300 focus:outline-none"
        >
          <option value="Critical">Critical Priority</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
        <button
          type="submit"
          className="px-4 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold transition-all cursor-pointer"
        >
          + Add Task
        </button>
      </form>

      {/* 4-Column Kanban Grid */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 overflow-y-auto">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.column === col.id);
          return (
            <div key={col.id} className="flex flex-col bg-white/[0.02] rounded-xl border border-white/5 p-3 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className={\`text-xs font-mono font-bold uppercase tracking-wider \${col.color}\`}>
                  {col.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                  {colTasks.length}
                </span>
              </div>

              <div className="flex-1 space-y-2 overflow-y-auto">
                {colTasks.map(t => (
                  <div key={t.id} className="p-3 rounded-xl bg-[#090C19] border border-white/10 hover:border-cyan-500/40 transition-all space-y-2 shadow-sm">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-gray-500">{t.id}</span>
                      <span className={\`px-1.5 py-0.5 rounded font-bold \${
                        t.priority === 'Critical' ? 'bg-rose-500/20 text-rose-300' :
                        t.priority === 'High' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-blue-500/20 text-blue-300'
                      }\`}>
                        {t.priority}
                      </span>
                    </div>

                    <div className="text-xs font-sans text-gray-200 leading-snug">
                      {t.title}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] font-mono">
                      <span className="text-cyan-400/80 bg-cyan-950/40 px-2 py-0.5 rounded">
                        {t.tag}
                      </span>
                      
                      {/* Move Direction Buttons */}
                      <div className="flex items-center gap-1">
                        {col.id !== 'backlog' && (
                          <button
                            onClick={() => moveTask(t.id, -1)}
                            className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                            title="Move back"
                          >
                            ←
                          </button>
                        )}
                        {col.id !== 'done' && (
                          <button
                            onClick={() => moveTask(t.id, 1)}
                            className="px-1.5 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold"
                            title="Advance forward"
                          >
                            →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}`
  },
  {
    id: 'quantum-particle',
    name: 'Quantum Particle Visualizer',
    tag: '3D Simulation',
    category: 'Graphics',
    icon: 'Atom',
    description: 'Real-time 3D particle mesh simulation with interactive rotation speeds, node density, and color palette.',
    code: `import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const canvasRef = useRef(null);
  const [speed, setSpeed] = useState(1.5);
  const [particleCount, setParticleCount] = useState(250);
  const [glowColor, setGlowColor] = useState('#00F0FF');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight || 450);

    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 130 + Math.random() * 20;
      particles.push({ theta, phi, radius, baseSpeed: (Math.random() * 0.005 + 0.002) });
    }

    let angle = 0;
    const render = () => {
      ctx.fillStyle = 'rgba(7, 8, 13, 0.25)';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      angle += 0.01 * speed;

      particles.forEach((p, idx) => {
        p.theta += p.baseSpeed * speed;
        const x = p.radius * Math.sin(p.phi) * Math.cos(p.theta + angle);
        const y = p.radius * Math.cos(p.phi);
        const z = p.radius * Math.sin(p.phi) * Math.sin(p.theta + angle) + 200;

        const scale = 300 / (300 + z);
        const screenX = cx + x * scale;
        const screenY = cy + y * scale;
        const alpha = Math.max(0.1, (scale - 0.5) * 1.5);

        ctx.beginPath();
        ctx.arc(screenX, screenY, Math.max(1, 2.5 * scale), 0, Math.PI * 2);
        ctx.fillStyle = glowColor;
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 12 * scale;
        ctx.shadowColor = glowColor;
        ctx.fill();

        if (idx % 4 === 0) {
          const next = particles[(idx + 1) % particles.length];
          const nx = cx + (next.radius * Math.sin(next.phi) * Math.cos(next.theta + angle)) * scale;
          const ny = cy + (next.radius * Math.cos(next.phi)) * scale;
          ctx.beginPath();
          ctx.moveTo(screenX, screenY);
          ctx.lineTo(nx, ny);
          ctx.strokeStyle = glowColor;
          ctx.globalAlpha = alpha * 0.25;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 450;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [speed, particleCount, glowColor]);

  return (
    <div className="w-full h-full min-h-[480px] bg-[#07080D] rounded-2xl p-6 flex flex-col justify-between border border-cyan-500/20 shadow-2xl relative overflow-hidden font-sans">
      <div className="flex justify-between items-center z-10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            Girionix Quantum Visualizer
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">Real-time 3D Particle Mesh & Simulation</p>
        </div>
        <div className="flex gap-2">
          {['#00F0FF', '#9D4EDD', '#10B981', '#FF007A'].map((c) => (
            <button
              key={c}
              onClick={() => setGlowColor(c)}
              className="w-5 h-5 rounded-full border border-white/20 transition-transform hover:scale-125"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 my-4 relative rounded-xl overflow-hidden border border-white/5 bg-[#05060A]">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="flex items-center gap-6 p-4 rounded-xl bg-slate-900/80 border border-white/10 z-10 text-xs font-mono">
        <div className="flex-1 space-y-1">
          <div className="flex justify-between text-gray-300">
            <span>Rotation Speed: {speed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="4.0"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex justify-between text-gray-300">
            <span>Node Density: {particleCount}</span>
          </div>
          <input
            type="range"
            min="50"
            max="600"
            step="10"
            value={particleCount}
            onChange={(e) => setParticleCount(parseInt(e.target.value))}
            className="w-full accent-purple-400"
          />
        </div>
      </div>
    </div>
  );
}`
  }
];

export const CODE_STUDIO_TEMPLATES = [
  ...ADVANCED_SKILLS_CATALOG,
  ...BASE_TEMPLATES
];

