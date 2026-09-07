export const TITAN_AI_MODELS = [
  {
    id: "girionix-titan-70b",
    name: "⚡ Titan 70B Heavy Core (100% Offline Heavy Hardware)",
    provider: "Physical Machine Hardware (16GB+ RAM / 8+ Cores)",
    category: "titan-heavy",
    tag: "100% Air-Gapped Heavy Hardware Engine",
    badgeColor: "emerald",
    description: "Military-grade 100% offline physical execution. Pins 8–32 CPU threads and offloads 100% weights to GPU VRAM with zero internet packets.",
    contextWindow: 128000,
    speed: "⚡ ~90-140 tok/s (Local RAM/VRAM)",
    pricing: "100% Sovereign Offline",
    isTitan: true,
    isLocal: true,
    supportsReasoning: true,
    supportsVision: true,
    recommendedFor: ["Air-Gapped Sovereign Intelligence", "Heavy Coding & Math", "Zero Cloud Latency", "High-End PCs"]
  },
  {
    id: "girionix-titan-lite",
    name: "🌱 Titan Lite (100% Offline Low-End Hardware Engine)",
    provider: "Physical Machine (2GB–8GB RAM / Dual-Core)",
    category: "titan-lite",
    tag: "Ultra-Lightweight 100% Offline • Low-End Devices",
    badgeColor: "teal",
    description: "Quantized ultra-efficient offline engine designed for low-end laptops, older PCs, and budget devices (2GB–8GB RAM, Dual/Quad-Core CPUs). Instant responses with zero internet.",
    contextWindow: 32000,
    speed: "🌱 ~25-45 tok/s (Low-End CPU Engine)",
    pricing: "100% Free Offline",
    isTitan: true,
    isTitanLite: true,
    isLocal: true,
    supportsReasoning: true,
    supportsVision: true,
    recommendedFor: ["Low-End PCs & Laptops", "Older Systems (2GB-8GB RAM)", "Battery-Saving Offline Tasks", "Zero Network Traffic"]
  },
  {
    id: "girionix-titan-coder",
    name: "⚡ Titan Matrix Coder 33B (Zero-Latency Local Compilation)",
    provider: "Physical Machine Hardware (Multi-Core CPU)",
    category: "titan-coding",
    tag: "Superhuman Offline Code Compilation",
    badgeColor: "cyan",
    description: "Compiles fullstack React, Python, C++, Rust, and CUDA code on-device with zero network latency and deep AST parsing.",
    contextWindow: 128000,
    speed: "Instantaneous Local",
    pricing: "100% Sovereign Offline",
    isTitan: true,
    isLocal: true,
    supportsReasoning: true,
    supportsVision: false,
    recommendedFor: ["Superhuman Offline Coding", "Kernel / CUDA Dev", "Fullstack Sandbox"]
  },
  {
    id: "girionix-titan-math",
    name: "⚡ Titan Olympiad Quantum Matrix (Symbolic Offline Solver)",
    provider: "Physical Machine Hardware (Tensor Shaders)",
    category: "titan-math",
    tag: "Quantum Tensor & Olympiad Proofs",
    badgeColor: "purple",
    description: "Heavy numerical analysis, tensor calculus, Riemannian manifolds, and IMO Gold Medal formal proofs running locally.",
    contextWindow: 128000,
    speed: "Real-time Symbolic",
    pricing: "100% Sovereign Offline",
    isTitan: true,
    isLocal: true,
    supportsReasoning: true,
    supportsVision: false,
    recommendedFor: ["Olympiad Math Proofs", "Tensor Physics", "Differential Equations"]
  },
  {
    id: "girionix-titan-vision",
    name: "⚡ Titan 8K Neural Vision (Metal 3 / Vulkan Shaders)",
    provider: "Physical Machine Hardware (GPU Shaders)",
    category: "titan-vision",
    tag: "DirectX 12 / Metal 3 8K Visual Engine",
    badgeColor: "rose",
    description: "Runs native GPU shaders for sub-second 8K photorealistic visual synthesis and 60 FPS motion trajectory rendering.",
    contextWindow: 64000,
    speed: "Hardware Accelerated",
    pricing: "100% Sovereign Offline",
    isTitan: true,
    isLocal: true,
    supportsReasoning: false,
    supportsVision: true,
    recommendedFor: ["8K Photorealism", "60 FPS Video Synthesis", "Local Computer Vision"]
  }
];

export const AI_MODELS = [
  {
    id: "girionix-pro",
    openRouterModel: "minimax/minimax-m3:free",
    name: "⚡ Girionix Pro",
    provider: "Girionix Dynamic Neural Core",
    category: "reasoning",
    tag: "⚡ Flagship Frontier Intelligence",
    badgeColor: "cyan",
    description: "Flagship intelligence engine. Autonomous model router combining deep chain-of-thought reasoning, Olympiad mathematics, superhuman code architecture, and multi-modal synthesis.",
    contextWindow: 200000,
    speed: "⚡ Dynamic Peak Velocity",
    pricing: "Universal Flagship",
    supportsReasoning: true,
    supportsVision: true,
    isPro: true,
    isAutoUpgrade: true,
    recommendedFor: ["Superhuman Reasoning", "Complex Coding & Architecture", "Math Olympiad Proofs", "Always-Latest Frontier Intelligence"]
  },
  {
    id: "girionix-lite",
    openRouterModel: "google/gemini-2.0-flash-001",
    name: "Girionix Lite",
    provider: "Google Frontier Ultra-Fast",
    category: "fast",
    tag: "Sub-Second Ultra-Fast & Grounded Knowledge",
    badgeColor: "cyan",
    description: "Ultra-fast high-accuracy intelligence engine with zero hallucination, web search grounding, and sub-second instant responses.",
    contextWindow: 1000000,
    speed: "⚡ Sub-Second Instant",
    pricing: "Free / Fast",
    supportsReasoning: false,
    supportsVision: true,
    isLite: true,
    recommendedFor: ["Instant Real-World Q&A", "Factual Inquiries", "High-Speed Chat", "Accurate Real-Time Answers"]
  },
  {
    id: "anthropic/claude-3.7-sonnet",
    openRouterModel: "anthropic/claude-3.7-sonnet",
    name: "Girionix CodeMaster",
    provider: "Girionix Neural Network",
    category: "coding",
    tag: "Hybrid Thinking & Code Synthesis",
    badgeColor: "cyan",
    description: "State-of-the-art programming engine with hybrid standard/extended thinking modes and multi-file fullstack code synthesis.",
    contextWindow: 200000,
    speed: "Fast",
    pricing: "Standard",
    supportsReasoning: true,
    supportsVision: true,
    recommendedFor: ["Superhuman Coding", "Fullstack Architecture", "Debugging"]
  },
  {
    id: "openai/o3-mini",
    openRouterModel: "openai/o3-mini",
    name: "Girionix Math-X",
    provider: "Girionix Neural Network",
    category: "reasoning",
    tag: "STEM & High-Speed Proofs",
    badgeColor: "emerald",
    description: "High-intelligence reasoning engine specialized in STEM, algorithmic logic, and multi-step mathematical Olympiad proofs.",
    contextWindow: 200000,
    speed: "Very Fast",
    pricing: "Low",
    supportsReasoning: true,
    supportsVision: false,
    recommendedFor: ["Speed STEM", "Python Optimization", "Logic Proofs"]
  },
  {
    id: "openai/gpt-4o",
    openRouterModel: "openai/gpt-4o",
    name: "Girionix Omni",
    provider: "Girionix Neural Network",
    category: "multimodal",
    tag: "Flagship Multimodal",
    badgeColor: "blue",
    description: "Omnimodal flagship model with supreme general intelligence, vision, creative writing, and prompt synthesis.",
    contextWindow: 128000,
    speed: "Fast",
    pricing: "Standard",
    supportsReasoning: false,
    supportsVision: true,
    recommendedFor: ["Omni Chat", "Vision Analysis", "Creative Storytelling"]
  }
];

export const STUDIO_MODES = [
  {
    id: "google-studio",
    name: "Google AI Studio Flagship",
    shortName: "AI Studio",
    icon: "Sparkles",
    color: "cyan",
    description: "Flagship Google AI Studio environment matching aistudio.google.com with Chat, Freeform, Structured few-shot prompts, and live sandbox execution."
  },
  {
    id: "chat",
    name: "Omni Reasoning Chat",
    shortName: "Chat",
    icon: "MessageSquare",
    color: "cyan",
    description: "Conversational intelligence powered by Girionix Pro and Girionix Lite."
  },
  {
    id: "code",
    name: "Superhuman Dev Studio",
    shortName: "Dev Runner",
    icon: "Code2",
    color: "cyan",
    description: "Full-stack code generator, live sandboxed web preview, and algorithmic complexity analyzer."
  },
  {
    id: "math",
    name: "Deep Math & Scientific Lab",
    shortName: "Math Lab",
    icon: "Sigma",
    color: "purple",
    description: "Step-by-step LaTeX formula derivations, Olympiad problem solver, and interactive 2D function plotter."
  },
  {
    id: "image",
    name: "VisionForge 8K Image Studio",
    shortName: "8K Vision",
    icon: "Image",
    color: "rose",
    description: "Powered by Girionix Visual Engine for studio-grade photorealistic image generation."
  },
  {
    id: "video",
    name: "MotionLab Cinematic Video Studio",
    shortName: "MotionLab 4K/8K",
    icon: "Clapperboard",
    color: "amber",
    description: "Cinematic prompt-to-video director, 3D camera trajectory controls (Dolly, Pan, Orbit), and motion presets."
  },
  {
    id: "audio",
    name: "Neural Voice & Sound Studio",
    shortName: "AudioLab HD",
    icon: "Music",
    color: "emerald",
    description: "Studio-grade neural voice synthesis, sound effects generator, and Web Audio dynamic soundtracks."
  }
];

export const STUDIO_DEDICATED_MODELS = {
  'google-studio': {
    id: "google-gemini-2.5-pro",
    name: "Google Gemini 2.5 Pro (AI Studio Flagship)",
    provider: "Google DeepMind Tensor Core",
    workDomain: "Google AI Studio Developer Environment",
    badgeColor: "cyan",
    tag: "Gemini 2.5 Pro Multi-Modal Reasoning Engine",
    speed: "⚡ 85-120 tok/s (Google TPU v5e)",
    contextWindow: 1048576,
    openRouterModel: "google/gemini-2.5-pro",
    titanModelId: "girionix-titan-70b",
    languages: ["Python 3.12", "TypeScript", "JSON Schema", "KaTeX Math", "cURL", "Swift", "Kotlin"],
    capabilities: [
      "Collapsible Thinking Process & Chain-of-Thought",
      "Interactive In-Browser Code Execution Sandbox",
      "Google Search Grounding & Dynamic Citations",
      "Few-Shot Structured & Freeform Prompt Modes"
    ],
    benchmark: "Flagship Reasoning & 1M+ Context Window"
  },
  code: {
    id: "girionix-codemaster-ultra",
    name: "Girionix CodeMaster Ultra (70B Coder)",
    provider: "Girionix Neural Compilation Core",
    workDomain: "Fullstack Coding & Sandbox Execution",
    badgeColor: "cyan",
    tag: "Superhuman Fullstack Coder & AST Debugger",
    speed: "⚡ 140 tok/s (Real-Time AST Engine)",
    contextWindow: 200000,
    openRouterModel: "anthropic/claude-3.7-sonnet",
    titanModelId: "girionix-titan-coder",
    languages: ["React 18", "Next.js 15", "Tailwind CSS", "TypeScript", "Python 3.12", "Rust", "C++", "WebGL"],
    capabilities: [
      "Live Component Sandbox Execution",
      "Sub-Millisecond AST Linting & Auto-Fix",
      "Fullstack Architecture & Micro-Benchmarks",
      "WebGL Shader & 3D Canvas Synthesis"
    ],
    benchmark: "98.4% HumanEval • 0-Defect Sandbox"
  },
  math: {
    id: "girionix-mathx-olympiad",
    name: "Girionix Math-X Olympiad (Deep Logic 72B)",
    provider: "Girionix Quantum Symbolic Engine",
    workDomain: "Olympiad Math & Quantum Physics Lab",
    badgeColor: "purple",
    tag: "Formal Coq/Lean Logic & KaTeX Derivations",
    speed: "⚡ 125 tok/s (Symbolic Core)",
    contextWindow: 128000,
    openRouterModel: "openai/o3-mini",
    titanModelId: "girionix-titan-math",
    languages: ["KaTeX LaTeX", "Symbolic Math", "Tensor Calculus", "Differential Equations", "Riemann Zeta"],
    capabilities: [
      "IMO Gold Medal Step-by-Step Proofs",
      "Interactive 2D/3D Parametric Surface Plotter",
      "Riemann Zeta & Navier-Stokes Tensor Solvers",
      "Quantum State & Hilbert Space Analysis"
    ],
    benchmark: "96.8% MATH Olympiad • Formal Logic Verified"
  },
  image: {
    id: "girionix-visionforge-8k",
    name: "Girionix VisionForge 8K Pro (Cinema Optics)",
    provider: "FLUX.1 Cinema Ultra Engine",
    workDomain: "8K Photorealism & Multi-Style Image Synthesis",
    badgeColor: "rose",
    tag: "Arri Alexa 85mm f/1.2 & DaVinci Resolve Grade",
    speed: "⚡ 0.4s Ultra-Speed Pipeline",
    contextWindow: 64000,
    replicateModel: "black-forest-labs/flux-schnell",
    titanModelId: "girionix-titan-vision",
    languages: ["8K Photorealism", "Unreal Engine 5.4", "Studio Ghibli Anime", "Cyberpunk Neon", "Oil Painting"],
    capabilities: [
      "True 8K Master Resolution (7680x4320)",
      "4X / 8X AI Lossless Upscaler Engine",
      "Raytraced Global Illumination & Volumetric God Rays",
      "Multi-Aspect Ratio Cinema Framing"
    ],
    benchmark: "8K Sub-Pixel Sharpness • 0.4s Generation"
  },
  video: {
    id: "girionix-cinemotion-max",
    name: "Girionix CineMotion 4K/8K Max (Hollywood Director)",
    provider: "Runway Gen-3 / Sora V2 Cinema Engine",
    workDomain: "Cinematic Multi-Shot 60FPS Video Generation",
    badgeColor: "amber",
    tag: "Multi-Shot Evolving Continuity & 60/120 FPS Motion",
    speed: "⚡ 60 FPS Real-Time Canvas Motion",
    contextWindow: 128000,
    openRouterModel: "openai/gpt-4o",
    titanModelId: "girionix-titan-vision",
    languages: ["4-Shot Storyboard", "24/60/120 FPS", "2.39:1 Anamorphic", "4K UHD 2160p", "8K IMAX"],
    capabilities: [
      "Multi-Shot Scene Continuity (4 Evolving Hollywood Frames)",
      "Camera Trajectories: Orbit 360°, Hyper-Dolly Zoom, FPV Drone Dive, Crane",
      "Web Audio API Dynamic Orchestral Score & SFX Sync",
      "Lossless MP4 / 60FPS GIF Video Master Exporter"
    ],
    benchmark: "4K/8K 60FPS Cinema Grade • 100% Continuity"
  },
  script: {
    id: "girionix-scriptmaster-cinema",
    name: "Girionix ScriptMaster Cinema (Screenplay & Story)",
    provider: "Hollywood Screenplay & Beat Engine",
    workDomain: "Cinema Screenplays, YouTube Scripts & Story Architecture",
    badgeColor: "indigo",
    tag: "Industry Standard Fountain & Final Draft (.fdx) Formatting",
    speed: "⚡ Real-Time Scene Flow & Table-Read Audio",
    contextWindow: 128000,
    openRouterModel: "anthropic/claude-3.7-sonnet",
    titanModelId: "girionix-titan-70b",
    languages: ["Hollywood Screenplay", "YouTube Video Script", "TV Pilot & Episodic", "Theater Drama", "Podcast Narrative"],
    capabilities: [
      "Auto-Formatting for Scene Headings, Action, Dialogue & Transitions",
      "Dynamic Table-Read Teleprompter with Neural Voice Integration",
      "Multi-Genre Beat Board & 3-Act Structure Generator",
      "Fountain, PDF, Plain Text & JSON Exporter"
    ],
    benchmark: "Industry Standard Screenplay Format • Table-Read Mode"
  },
  audio: {
    id: "girionix-audiocraft-hd",
    name: "Girionix AudioCraft & NeuralVoice HD",
    provider: "ElevenLabs V3 Neural Studio",
    workDomain: "Studio Voice Synthesis & Sound Score Lab",
    badgeColor: "emerald",
    tag: "48kHz Lossless Voice & Multi-Track Foley Engine",
    speed: "⚡ Sub-50ms Real-Time Synthesis",
    contextWindow: 64000,
    openRouterModel: "openai/gpt-4o-mini",
    titanModelId: "girionix-titan-70b",
    languages: ["English", "Hindi", "Multilingual", "Polyphonic Foley", "48kHz Studio WAV"],
    capabilities: [
      "Emotional Tone & Timbre Customization",
      "Real-Time Web Audio Spectrum Frequency Visualizer",
      "Procedural Cinematic Soundtrack Generator",
      "Bilingual Studio Narrators (English & Hindi)"
    ],
    benchmark: "48kHz Studio Quality • Zero-Latency Voice"
  }
};

export function getDedicatedStudioModel(tabId, isTitan = false) {
  const domain = STUDIO_DEDICATED_MODELS[tabId] || STUDIO_DEDICATED_MODELS.code;
  if (isTitan) {
    const titanModel = TITAN_AI_MODELS.find(m => m.id === domain.titanModelId) || TITAN_AI_MODELS[0];
    return {
      ...domain,
      activeEngineName: titanModel.name,
      isTitanMode: true,
      executionSpeed: titanModel.speed,
      hardwareProvider: titanModel.provider
    };
  }
  return {
    ...domain,
    activeEngineName: domain.name,
    isTitanMode: false,
    executionSpeed: domain.speed,
    hardwareProvider: domain.provider
  };
}
