/**
 * GIRIONIX AI — FRONTIER MODEL CATALOG & STUDIO ENGINES
 * Unified registry of frontier AI models with context-aware naming for AI Studios and Giri Orbit.
 */

export const AI_MODELS = [
  {
    id: "gemini-2.5-flash",
    name: "⚡ Girionix Pro Flash",
    provider: "Girionix Neural Lab",
    category: "fast",
    tag: "Sub-Second Speed • Adaptive Intelligence",
    badgeColor: "cyan",
    description: "Next-generation workhorse model with breakthrough speed, native multimodal comprehension, and dynamic latency optimization.",
    contextWindow: 1000000,
    speed: "⚡ Sub-Second Ultra-Fast",
    pricing: "Free / Fast",
    supportsReasoning: true,
    supportsVision: true,
    isPro: true,
    isLite: true,
    recommendedFor: ["Rapid Conversational Q&A", "Real-Time Streaming", "Code Debugging", "High-Volume Tasks"]
  },
  {
    id: "girionix-pro",
    name: "⚡ Girionix Pro",
    provider: "Girionix Dynamic Neural Core",
    category: "reasoning",
    tag: "⚡ Flagship Frontier Intelligence",
    badgeColor: "cyan",
    description: "Flagship intelligence engine combining deep chain-of-thought reasoning, Olympiad mathematics, and superhuman code architecture.",
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
    id: "gemini-2.5-pro",
    name: "⚡ Girionix Ultra",
    provider: "Girionix Deep Intelligence Lab",
    category: "reasoning",
    tag: "⚡ Frontier Reasoning • 2M Context",
    badgeColor: "cyan",
    description: "Girionix premier frontier model. Unrivaled 2M long-context understanding, deep step-by-step thinking, multimodal analysis, and superhuman coding.",
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
    id: "qwen/qwen-2.5-coder-32b-instruct",
    name: "⚡ Girionix CodeMaster",
    provider: "Girionix Autonomous Code Synthesis",
    category: "coding",
    tag: "SOTA Superhuman Coding & Architecture",
    badgeColor: "cyan",
    description: "World-class coding engine specializing in code generation, code modification, debugging, and multi-file fullstack implementation.",
    contextWindow: 131072,
    speed: "⚡ Ultra-Fast Tok/s",
    pricing: "Standard",
    supportsReasoning: true,
    supportsVision: false,
    recommendedFor: ["Precision Code Modification", "Refactoring", "React & Python Fullstack", "AST Debugging"]
  },
  {
    id: "deepseek/deepseek-chat",
    name: "⚡ Girionix Titan 671B",
    provider: "Girionix MoE Neural Network",
    category: "reasoning",
    tag: "671B MoE Frontier Intelligence",
    badgeColor: "purple",
    description: "State-of-the-art 671B parameter Mixture-of-Experts frontier model with supreme reasoning, coding fluency, and mathematics.",
    contextWindow: 128000,
    speed: "Fast",
    pricing: "Low",
    supportsReasoning: true,
    supportsVision: false,
    recommendedFor: ["Advanced Coding", "Mathematical Logic", "Complex Systems Analysis"]
  },
  {
    id: "openai/gpt-4o",
    name: "⚡ Girionix OmniVision",
    provider: "Girionix Omnimodal System",
    category: "multimodal",
    tag: "Flagship Omnimodal Intelligence & Vision",
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
    name: "⚡ Girionix Deep Reasoner",
    provider: "Girionix Olympiad Reasoning Core",
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
    name: "⚡ Girionix Logic Reasoner",
    provider: "Girionix Algorithmic STEM Lab",
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
    name: "⚡ Girionix Turbo 70B",
    provider: "Girionix High-Speed Neural Core",
    category: "fast",
    tag: "Ultra-Fast Neural Processing 500+ tok/s",
    badgeColor: "teal",
    description: "State-of-the-art open model operating at extreme speed via high-throughput neural accelerators.",
    contextWindow: 128000,
    speed: "⚡ 500+ tok/s Ultra-Fast",
    pricing: "Free / Fast",
    supportsReasoning: false,
    supportsVision: false,
    recommendedFor: ["Instant Real-World Q&A", "High-Velocity Parsing", "Neural Acceleration"]
  },
  {
    id: "girionix-lite",
    name: "🌱 Girionix Lite",
    provider: "Girionix Grounded Knowledge Engine",
    category: "fast",
    tag: "Sub-Second Ultra-Fast & Grounded Knowledge",
    badgeColor: "cyan",
    description: "Ultra-fast high-accuracy intelligence engine with web search grounding and sub-second instant responses.",
    contextWindow: 1000000,
    speed: "⚡ Sub-Second Instant",
    pricing: "Free / Fast",
    supportsReasoning: false,
    supportsVision: true,
    isLite: true,
    recommendedFor: ["Instant Real-World Q&A", "Factual Inquiries", "High-Speed Chat", "Accurate Real-Time Answers"]
  }
];

/**
 * Context-aware model display name helper:
 * - 'studio': "Studio Architect Pro" / "Studio QuickFlow"
 * - 'orbit': "Orbit Executive Core" / "Orbit Dispatch Core"
 * - 'chat': "Girionix Pro" / "Girionix Lite"
 */
export function getModelDisplayName(modelOrId, context = 'chat') {
  const id = typeof modelOrId === 'string' ? modelOrId : modelOrId?.id;
  if (!id) return 'Girionix AI';

  if (id === 'gemini-2.5-flash') {
    return '⚡ Girionix Pro Flash';
  }
  if (id === 'girionix-pro') {
    if (context === 'orbit') return '⚡ Girionix Pro (Orbit Copilot)';
    return '⚡ Girionix Pro';
  }
  if (id === 'gemini-2.5-pro') {
    return '⚡ Girionix Ultra';
  }
  if (id === 'qwen/qwen-2.5-coder-32b-instruct') {
    return '⚡ Girionix CodeMaster';
  }
  if (id === 'deepseek/deepseek-chat') {
    return '⚡ Girionix Titan 671B';
  }
  if (id === 'openai/gpt-4o') {
    return '⚡ Girionix OmniVision';
  }
  if (id === 'deepseek/deepseek-r1') {
    return '⚡ Girionix Deep Reasoner';
  }
  if (id === 'openai/o3-mini') {
    return '⚡ Girionix Logic Reasoner';
  }
  if (id === 'meta-llama/llama-3.3-70b-instruct') {
    return '⚡ Girionix Turbo 70B';
  }
  if (id === 'girionix-lite') {
    return '🌱 Girionix Lite';
  }

  const found = findModelById(id);
  return found?.name || id;
}

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
  name: "⚡ Girionix Ultra (AI Studio Flagship)",
  provider: "Girionix Deep Intelligence Lab",
  workDomain: "AI Studio Developer Environment",
  badgeColor: "cyan",
  tag: "Girionix Ultra Multi-Modal Reasoning Engine",
  speed: "⚡ 85-120 tok/s",
  contextWindow: 1048576,
  openRouterModel: "google/gemini-2.5-pro",
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
    id: "qwen/qwen-2.5-coder-32b-instruct",
    name: "⚡ Girionix CodeMaster (Studio Architect Pro)",
    provider: "Girionix Autonomous Code Synthesis",
    workDomain: "Fullstack Coding & Live Sandbox Execution",
    badgeColor: "cyan",
    tag: "Superhuman Fullstack Coder & AST Modification Engine",
    speed: "⚡ 140 tok/s",
    contextWindow: 131072,
    openRouterModel: "qwen/qwen-2.5-coder-32b-instruct",
    languages: ["React 18", "Next.js 15", "Tailwind CSS", "TypeScript", "Python 3.12", "Rust", "C++", "WebGL"],
    capabilities: [
      "Live Component Sandbox Execution",
      "Sub-Millisecond AST Linting & Precise Code Modifications",
      "Fullstack Architecture & Micro-Benchmarks",
      "WebGL Shader & 3D Canvas Synthesis"
    ],
    benchmark: "98.4% HumanEval • Accurate Multi-Turn Code Edits"
  },
  math: {
    id: "deepseek/deepseek-r1",
    name: "⚡ Girionix Deep Reasoner (Olympiad Logic)",
    provider: "Girionix Olympiad Reasoning Core",
    workDomain: "Olympiad Math & Quantum Physics Lab",
    badgeColor: "purple",
    tag: "Formal Coq/Lean Logic & KaTeX Derivations",
    speed: "⚡ 125 tok/s",
    contextWindow: 128000,
    openRouterModel: "deepseek/deepseek-r1",
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
    name: "VisionForge 8K Pro (Cinema Optics)",
    provider: "FLUX.1 Cinema Ultra Engine",
    workDomain: "8K Photorealism & Multi-Style Image Synthesis",
    badgeColor: "rose",
    tag: "Arri Alexa 85mm f/1.2 & DaVinci Resolve Grade",
    speed: "⚡ 0.4s Ultra-Speed Pipeline",
    contextWindow: 64000,
    replicateModel: "black-forest-labs/flux-schnell",
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
    name: "⚡ Girionix MotionDirector (MotionLab 4K/8K)",
    provider: "Girionix MotionLab Cinema Engine",
    workDomain: "Cinematic Multi-Shot 60FPS Video Generation",
    badgeColor: "amber",
    tag: "First/Last Frame Interpolation & 3D Camera Rig",
    speed: "⚡ 60 FPS Real-Time Canvas Motion",
    contextWindow: 128000,
    openRouterModel: "openai/gpt-4o",
    languages: ["4-Shot Storyboard", "24/60/120 FPS", "2.39:1 Anamorphic", "4K UHD 2160p", "8K IMAX"],
    capabilities: [
      "First & Last Frame Interpolation Continuity",
      "Interactive 3D Camera Rig D-Pad (Pan, Tilt, Zoom, Orbit 360°, FPV Drone)",
      "Motion Intensity Sliders (1-10) with Dynamic Easing",
      "Web Audio API Dynamic Orchestral Score & Foley SFX Sync",
      "Lossless MP4 / 60FPS GIF Video Master Exporter"
    ],
    benchmark: "8K Cinema Grade • 100% Temporal Continuity"
  },
  script: {
    id: "deepseek-scriptmaster",
    name: "⚡ Girionix ScriptMaster Cinema",
    provider: "Girionix Narrative & Screenplay Core",
    workDomain: "Cinema Screenplays, YouTube Scripts & Story Architecture",
    badgeColor: "indigo",
    tag: "Industry Standard Fountain & Final Draft (.fdx) Formatting",
    speed: "⚡ Real-Time Scene Flow & Table-Read Audio",
    contextWindow: 128000,
    openRouterModel: "deepseek/deepseek-r1",
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
    name: "⚡ Girionix AudioLab HD (Neural Voice)",
    provider: "Girionix Neural Audio Architecture",
    workDomain: "ElevenLabs Voice Library, Instant Cloning & 5-Track Stems",
    badgeColor: "emerald",
    tag: "48kHz Lossless Voice, Cloning & Multi-Track Foley Engine",
    speed: "⚡ Sub-50ms Real-Time Synthesis",
    contextWindow: 64000,
    openRouterModel: "openai/gpt-4o-mini",
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

export function getDedicatedStudioModel(tabId) {
  const domain = STUDIO_DEDICATED_MODELS[tabId] || STUDIO_DEDICATED_MODELS.code;
  return {
    ...domain,
    activeEngineName: domain.name,
    isLocalMode: false,
    executionSpeed: domain.speed,
    hardwareProvider: domain.provider
  };
}

export function findModelById(id) {
  if (!id) return AI_MODELS[0];
  return AI_MODELS.find(m => m.id === id) || AI_MODELS[0];
}
