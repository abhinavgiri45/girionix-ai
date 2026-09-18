export const DEMO_CODE_PROJECT = {
  activeFile: 'App.jsx',
  files: [
    {
      name: 'App.jsx',
      language: 'javascript',
      content: `import React, { useState, useEffect, useRef } from 'react';

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
    },
    {
      name: 'index.html',
      language: 'html',
      content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Girionix Live Canvas</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-black text-white m-0 p-0 flex items-center justify-center min-h-screen">
    <div id="root" class="w-full h-full"></div>
  </body>
</html>`
    }
  ]
};

export const DEMO_MATH_PROBLEMS = [
  {
    id: 'riemann-hypothesis',
    title: 'Riemann Zeta Analytic Continuation & Critical Line Zeros',
    category: 'Analytic Number Theory',
    difficulty: 'Millennium Problem Rigor',
    formula: '\\zeta(s) = \\sum_{n=1}^\\infty \\frac{1}{n^s} = 2^s \\pi^{s-1} \\sin\\left(\\frac{\\pi s}{2}\\right) \\Gamma(1-s) \\zeta(1-s)',
    plotFunction: 'Math.sin(x * 2.5) * Math.exp(-0.08 * Math.abs(x))',
    steps: [
      {
        step: 1,
        title: 'Mellin Transform & Functional Equation Formulation',
        math: '\\pi^{-\\frac{s}{2}} \\Gamma\\left(\\frac{s}{2}\\right) \\zeta(s) = \\int_0^\\infty x^{\\frac{s}{2}-1} \\psi(x) dx',
        explanation: 'Relates the completed zeta function $\\xi(s)$ to the Jacobi theta function $\\psi(x) = \\sum_{n=1}^\\infty e^{-n^2 \\pi x}$.'
      },
      {
        step: 2,
        title: 'Jacobi Inversion Formula Application',
        math: '\\theta(x^{-1}) = \\sqrt{x} \\theta(x) \\implies \\xi(s) = \\xi(1-s)',
        explanation: 'Proves the functional symmetry about the critical line $\\operatorname{Re}(s) = 1/2$.'
      },
      {
        step: 3,
        title: 'Hardy Z-Function on the Critical Strip',
        math: 'Z(t) = e^{i \\theta(t)} \\zeta\\left(\\frac{1}{2} + it\\right) \\in \\mathbb{R}',
        explanation: 'Transforms critical line evaluations into a purely real oscillatory function.'
      }
    ]
  },
  {
    id: 'fourier-gaussian',
    title: 'Fourier Transform Invariance of Gaussian Wavepackets',
    category: 'Quantum Mechanics & Harmonic Analysis',
    difficulty: 'Olympiad Gold Standard',
    formula: '\\mathcal{F}\\{e^{-a x^2}\\}(k) = \\sqrt{\\frac{\\pi}{a}} e^{-\\frac{k^2}{4a}}',
    plotFunction: 'Math.exp(-0.5 * x * x)',
    steps: [
      {
        step: 1,
        title: 'Integral Representation',
        math: '\\hat{f}(k) = \\int_{-\\infty}^\\infty e^{-a x^2} e^{-i k x} dx',
        explanation: 'By completing the square in the exponent: $-a x^2 - ikx = -a\\left(x + \\frac{ik}{2a}\\right)^2 - \\frac{k^2}{4a}$.'
      },
      {
        step: 2,
        title: 'Contour Shift and Gaussian Integral',
        math: '\\int_{-\\infty}^\\infty e^{-a u^2} du = \\sqrt{\\frac{\\pi}{a}}',
        explanation: 'Shifting the integration contour into the complex plane by Cauchy-Goursat theorem.'
      },
      {
        step: 3,
        title: 'Final Invariant Eigenstate',
        math: '\\hat{f}(k) = \\sqrt{\\frac{\\pi}{a}} e^{-\\frac{k^2}{4a}}',
        explanation: 'The Gaussian is an eigenfunction of the Fourier operator with eigenvalue $\\sqrt{2\\pi}$.'
      }
    ]
  },
  {
    id: 'basel-problem',
    title: "Euler's Basel Problem & Weierstrass Sine Product",
    category: 'Infinite Series & Complex Analysis',
    difficulty: 'Eulerian Classical Rigor',
    formula: '\\sum_{n=1}^\\infty \\frac{1}{n^2} = 1 + \\frac{1}{4} + \\frac{1}{9} + \\frac{1}{16} + \\cdots = \\frac{\\pi^2}{6}',
    plotFunction: 'Math.sin(x) / (x || 0.001)',
    steps: [
      {
        step: 1,
        title: 'Weierstrass Infinite Product for Sine',
        math: '\\frac{\\sin(x)}{x} = \\prod_{n=1}^\\infty \\left(1 - \\frac{x^2}{n^2 \\pi^2}\\right) = \\left(1 - \\frac{x^2}{\\pi^2}\\right)\\left(1 - \\frac{x^2}{4\\pi^2}\\right)\\cdots',
        explanation: 'Expressing the sine function as an infinite polynomial expansion through its real roots $\\pm n\\pi$.'
      },
      {
        step: 2,
        title: 'Taylor Series Expansion & Coefficient Equating',
        math: '\\frac{\\sin(x)}{x} = 1 - \\frac{x^2}{3!} + \\frac{x^4}{5!} - \\cdots = 1 - \\frac{x^2}{6} + \\mathcal{O}(x^4)',
        explanation: 'Comparing the quadratic coefficient $x^2$ between the Maclaurin series and the expanded infinite product.'
      },
      {
        step: 3,
        title: 'Exact Closed-Form Convergence',
        math: '-\\frac{1}{6} = -\\sum_{n=1}^\\infty \\frac{1}{n^2 \\pi^2} \\implies \\sum_{n=1}^\\infty \\frac{1}{n^2} = \\frac{\\pi^2}{6}',
        explanation: 'Multiplying both sides by $-\\pi^2$ confirms Euler\'s landmark solution.'
      }
    ]
  },
  {
    id: 'quantum-infinite-well',
    title: 'Quantum Particle in a 1D Infinite Potential Well',
    category: 'Quantum Mechanics & Boundary Value ODEs',
    difficulty: 'Hamiltonian Bound States',
    formula: 'E_n = \\frac{n^2 \\pi^2 \\hbar^2}{2m L^2}, \\qquad \\psi_n(x) = \\sqrt{\\frac{2}{L}} \\sin\\left(\\frac{n \\pi x}{L}\\right)',
    plotFunction: 'Math.sqrt(2) * Math.sin(Math.PI * (x + 5) / 10)',
    steps: [
      {
        step: 1,
        title: 'Time-Independent Schrödinger Equation',
        math: '-\\frac{\\hbar^2}{2m} \\frac{d^2 \\psi(x)}{dx^2} = E \\psi(x), \\quad 0 < x < L',
        explanation: 'Within the well where potential $V(x) = 0$, wavefunctions satisfy harmonic oscillation $k = \\sqrt{2mE}/\\hbar$.'
      },
      {
        step: 2,
        title: 'Dirichlet Boundary Conditions',
        math: '\\psi(0) = 0 \\implies B = 0, \\quad \\psi(L) = A\\sin(kL) = 0 \\implies k_n = \\frac{n\\pi}{L}',
        explanation: 'Quantization emerges naturally from spatial confinement conditions at the infinite potential barriers.'
      },
      {
        step: 3,
        title: 'Orthonormal Probability Density',
        math: '\\int_0^L |\\psi_n(x)|^2 dx = 1 \\implies A = \\sqrt{\\frac{2}{L}}',
        explanation: 'Normalizing the wavepackets yields discrete orthogonal standing eigenstates.'
      }
    ]
  }
];

export const DEMO_IMAGE_PROMPTS = [
  {
    title: 'Cyberpunk Hyper-City in Starlight',
    style: 'Photorealistic 8K',
    aspect: '16:9',
    prompt: 'Ultra-detailed cinematic shot of a futuristic metropolis built into neon crystal canyons, bioluminescent flying vehicles weaving through holographic rain, Unreal Engine 5 render, raytraced volumetric lighting, 8k masterpiece.',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    tags: ['Cyberpunk', 'Cinematic', '8K']
  },
  {
    title: 'Quantum Neural Core Artifact',
    style: 'Surreal Concept Art',
    aspect: '1:1',
    prompt: 'Floating crystalline hypercube glowing with golden fractal circuits, levitating in a dark obsidian chamber with mist and laser reflections, macro shot, octane render, photorealistic materials, 8k resolution.',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    tags: ['Sci-Fi', 'Octane', 'Neural']
  }
];

export const DEMO_VIDEO_SCRIPTS = [
  {
    id: 'script-1',
    title: 'FPV Cyber Tokyo Hyperlapse',
    logline: 'FPV racing drone perspective dropping through neon skyscraper canyons in Neo Tokyo.',
    aspectRatio: '2.39:1 Anamorphic',
    shots: [
      {
        shotNumber: 1,
        timing: '00:00 - 00:06',
        cameraMovement: 'FPV Dive & 360 Orbit',
        description: 'Camera dives through rain-slick neon skyscraper canyon, accelerating past glowing holographic billboards into night streets.',
        renderPrompt: 'FPV drone dropping from clouds through rain-slick neon skyscraper canyon in Neo Tokyo, 60fps cinematic.'
      }
    ]
  },
  {
    id: 'script-2',
    title: 'Supernova Awakening',
    logline: 'Slow orbital zoom-out around an ancient collapsing neutron star.',
    aspectRatio: '16:9 IMAX',
    shots: [
      {
        shotNumber: 1,
        timing: '00:00 - 00:08',
        cameraMovement: 'Slow Orbital Zoom-Out',
        description: 'Camera slowly orbits a collapsing star as it erupts into iridescent relativistic plasma jets.',
        renderPrompt: 'Camera slowly orbits an ancient collapsing neutron star as it erupts into iridescent relativistic plasma jets, volumetric cosmic dust, IMAX 24fps.'
      }
    ]
  }
];

export const DEMO_VIDEO_PROMPTS = DEMO_VIDEO_SCRIPTS;
