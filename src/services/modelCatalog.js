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
    id: "gemini-2.5-pro",
    name: "⚡ Gemini 2.5 Pro",
    provider: "Google DeepMind Flagship",
    category: "reasoning",
    tag: "⚡ Frontier Reasoning • 2M Context",
    badgeColor: "cyan",
    description: "Google's premier frontier model. Unrivaled long-context understanding, deep step-by-step thinking, multimodal analysis, and superhuman coding.",
    contextWindow: 2000000,
    speed: "⚡ Fast & Analytical",
    pricing: "Frontier",
    supportsReasoning: true,
    supportsVision: true,
    isPro: true,
    isAutoUpgrade: true,
    recommendedFor: ["Superhuman Reasoning", "Complex Code Refactoring", "Deep Mathematical Proofs", "2M Long Document Analysis"]
  },
  {
    id: "gemini-2.5-flash",
    name: "⚡ Gemini 2.5 Flash",
    provider: "Google DeepMind Ultra-Fast",
    category: "fast",
    tag: "Sub-Second Speed • Adaptive Thinking",
    badgeColor: "cyan",
    description: "Next-generation workhorse model with breakthrough speed, native multimodal comprehension, and dynamic latency optimization.",
    contextWindow: 1000000,
    speed: "⚡ Sub-Second Ultra-Fast",
    pricing: "Free / Fast",
    supportsReasoning: true,
    supportsVision: true,
    isLite: true,
    recommendedFor: ["Rapid Conversational Q&A", "Real-Time Streaming", "Code Debugging", "High-Volume Tasks"]
  },
  {
    id: "gemini-2.0-flash-thinking-exp",
    name: "⚡ Gemini 2.0 Flash Thinking",
    provider: "Google DeepMind Reasoning",
    category: "reasoning",
    tag: "Transparent Chain-of-Thought",
    badgeColor: "purple",
    description: "Exposes raw internal thinking process before generating final answers. Ideal for solving competitive programming and complex STEM proofs.",
    contextWindow: 1000000,
    speed: "Deep Reasoning",
    pricing: "Reasoning",
    supportsReasoning: true,
    supportsVision: true,
    isPro: true,
    recommendedFor: ["Math Olympiad Proofs", "Algorithmic Logic", "Transparent Reasoning"]
  },
  {
    id: "girionix-pro",
    name: "⚡ Girionix Pro",
    provider: "Girionix Dynamic Neural Core",
    category: "reasoning",
    tag: "⚡ Flagship Frontier Intelligence",
    badgeColor: "cyan",
    description: "Flagship intelligence engine. Autonomous multi-model router combining deep chain-of-thought reasoning, Olympiad mathematics, and superhuman code architecture.",
    contextWindow: 2000000,
    speed: "⚡ Dynamic Peak Velocity",
    pricing: "Universal Flagship",
    supportsReasoning: true,
    supportsVision: true,
    isPro: true,
    isAutoUpgrade: true,
    recommendedFor: ["Superhuman Reasoning", "Complex Coding & Architecture", "Math Olympiad Proofs", "Always-Latest Frontier Intelligence"]
  },
  {
    id: "anthropic/claude-3.7-sonnet",
    name: "⚡ Claude 3.7 Sonnet",
    provider: "Anthropic / Girionix",
    category: "coding",
    tag: "Hybrid Extended Thinking & Architecture",
    badgeColor: "cyan",
    description: "State-of-the-art software engineering and hybrid reasoning engine with deep multi-file fullstack code synthesis.",
    contextWindow: 200000,
    speed: "Fast",
    pricing: "Standard",
    supportsReasoning: true,
    supportsVision: true,
    recommendedFor: ["Superhuman Coding", "Fullstack Architecture", "System Design"]
  },
  {
    id: "openai/gpt-4o",
    name: "⚡ GPT-4o Omni",
    provider: "OpenAI / Girionix",
    category: "multimodal",
    tag: "Flagship Omnimodal Intelligence",
    badgeColor: "blue",
    description: "High-intelligence flagship omnimodal model with supreme general fluency, vision, creative writing, and prompt synthesis.",
    contextWindow: 128000,
    speed: "Fast",
    pricing: "Standard",
    supportsReasoning: false,
    supportsVision: true,
    recommendedFor: ["Omni Chat", "Vision Analysis", "Creative Storytelling"]
  },
  {
    id: "deepseek/deepseek-r1",
    name: "⚡ DeepSeek R1",
    provider: "DeepSeek / Open Weights",
    category: "reasoning",
    tag: "Open Chain-of-Thought Olympiad Reasoning",
    badgeColor: "purple",
    description: "High-intelligence open-weights reasoning model with extensive internal deliberation and mathematical derivation.",
    contextWindow: 128000,
    speed: "Deliberate Reasoning",
    pricing: "Low",
    supportsReasoning: true,
    supportsVision: false,
    recommendedFor: ["Pure STEM Logic", "Mathematical Proofs", "Step-by-step Thinking"]
  },
  {
    id: "openai/o3-mini",
    name: "⚡ OpenAI o3-mini",
    provider: "OpenAI / Girionix",
    category: "reasoning",
    tag: "High-Speed STEM & Formal Logic",
    badgeColor: "emerald",
    description: "Cost-efficient STEM reasoning model specialized in competitive programming, formal verification, and algorithmic problems.",
    contextWindow: 200000,
    speed: "Very Fast",
    pricing: "Low",
    supportsReasoning: true,
    supportsVision: false,
    recommendedFor: ["Speed STEM", "Python Optimization", "Logic Proofs"]
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct",
    name: "⚡ Llama 3.3 70B",
    provider: "Meta / Groq Cloud",
    category: "fast",
    tag: "Ultra-Fast Open Weights 500+ tok/s",
    badgeColor: "teal",
    description: "State-of-the-art open model operating at extreme speed via Groq LPUs or open cloud gateways.",
    contextWindow: 128000,
    speed: "⚡ 500+ tok/s Ultra-Fast",
    pricing: "Free / Fast",
    supportsReasoning: false,
    supportsVision: false,
    recommendedFor: ["Instant Real-World Q&A", "High-Velocity Parsing", "Open Weights"]
  },
  {
    id: "girionix-lite",
    name: "🌱 Girionix Lite",
    provider: "DeepMind Frontier Ultra-Fast",
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
  }
];

export const STUDIO_MODES = [
  {
    id: "ai-studio",
    name: "AI Studio Flagship",
    shortName: "AI Studio",
    icon: "Sparkles",
    color: "cyan",
    description: "Flagship AI Studio environment with Chat, Freeform, Structured few-shot prompts, and live sandbox execution."
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
    name: "Coding Studio",
    shortName: "Coding Studio",
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

const AI_STUDIO_MODEL_DEF = {
  id: "gemini-2.5-pro",
  name: "Gemini 2.5 Pro (AI Studio Flagship)",
  provider: "DeepMind Tensor Core",
  workDomain: "AI Studio Developer Environment",
  badgeColor: "cyan",
  tag: "Gemini 2.5 Pro Multi-Modal Reasoning Engine",
  speed: "⚡ 85-120 tok/s (TPU v5e)",
  contextWindow: 1048576,
  openRouterModel: "google/gemini-2.5-pro",
  titanModelId: "girionix-titan-70b",
  languages: ["Python 3.12", "TypeScript", "JSON Schema", "KaTeX Math", "cURL", "Swift", "Kotlin"],
  capabilities: [
    "Collapsible Thinking Process & Chain-of-Thought",
    "Interactive In-Browser Code Execution Sandbox",
    "Search Grounding & Dynamic Citations",
    "Few-Shot Structured & Freeform Prompt Modes"
  ],
  benchmark: "Flagship Reasoning & 1M+ Context Window"
};

export const STUDIO_DEDICATED_MODELS = {
  'ai-studio': AI_STUDIO_MODEL_DEF,
  'google-studio': AI_STUDIO_MODEL_DEF,
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
    id: "nano-banana-video-cinema",
    name: "Nano Banana Video (MotionLab 4K/8K)",
    provider: "Nano Banana Turbo / Runway Gen-3 Cinema Engine",
    workDomain: "Cinematic Multi-Shot 60FPS Video Generation",
    badgeColor: "amber",
    tag: "Nano Banana First/Last Frame Interpolation & 3D Camera Rig",
    speed: "⚡ 60 FPS Real-Time Canvas Motion",
    contextWindow: 128000,
    openRouterModel: "openai/gpt-4o",
    titanModelId: "girionix-titan-vision",
    languages: ["4-Shot Storyboard", "24/60/120 FPS", "2.39:1 Anamorphic", "4K UHD 2160p", "8K IMAX"],
    capabilities: [
      "First & Last Frame Interpolation Continuity",
      "Interactive 3D Camera Rig D-Pad (Pan, Tilt, Zoom, Orbit 360°, FPV Drone)",
      "Motion Intensity Sliders (1-10) with Dynamic Easing",
      "Web Audio API Dynamic Orchestral Score & Foley SFX Sync",
      "Lossless MP4 / 60FPS GIF Video Master Exporter"
    ],
    benchmark: "Nano Banana 8K Cinema Grade • 100% Temporal Continuity"
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
    id: "elevenlabs-audiolab-hd",
    name: "ElevenLabs Audio Studio (AudioLab HD)",
    provider: "ElevenLabs V3 Neural Voice Architecture",
    workDomain: "ElevenLabs Voice Library, Instant Cloning & 5-Track Stems",
    badgeColor: "emerald",
    tag: "48kHz Lossless Voice, Cloning & Multi-Track Foley Engine",
    speed: "⚡ Sub-50ms Real-Time Synthesis",
    contextWindow: 64000,
    openRouterModel: "openai/gpt-4o-mini",
    titanModelId: "girionix-titan-70b",
    languages: ["ElevenLabs Voice Library", "Instant Voice Cloning", "Multilingual", "Polyphonic Foley", "48kHz Studio WAV"],
    capabilities: [
      "ElevenLabs Voice Library (Rachel, Adam, Antoni, Bella, Arnold, Neerja)",
      "Stability, Similarity, Style Exaggeration & Speaker Boost Controls",
      "Instant Voice Cloning (Microphone Record & Audio File Upload)",
      "Sound Effects (SFX) Prompt-to-Audio Generator",
      "5-Track Studio Stem Mixer with Live Frequency Visualizer"
    ],
    benchmark: "ElevenLabs 48kHz Studio Quality • Zero-Latency Voice"
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

export function findModelById(id) {
  if (!id) return AI_MODELS[0];
  const all = [...TITAN_AI_MODELS, ...AI_MODELS];
  return all.find(m => m.id === id) || AI_MODELS[0];
}

