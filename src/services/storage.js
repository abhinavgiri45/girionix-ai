const KEYS = {
  USER_NAME: 'girionix_user_name',
  API_KEY: 'girionix_openrouter_api_key',
  REPLICATE_TOKEN: 'girionix_replicate_token',
  SETTINGS: 'girionix_user_settings',
  SESSIONS: 'girionix_chat_sessions',
  ACTIVE_SESSION_ID: 'girionix_active_session_id',
  PINNED_ITEMS: 'girionix_pinned_items',
  THEME: 'girionix_theme',
  CODE_PROJECT: 'girionix_code_project',
  IMAGE_GALLERY: 'girionix_image_gallery',
  VIDEO_PROJECTS: 'girionix_video_projects',
  MATH_NOTES: 'girionix_math_notes',
  ACTIVE_MODEL_ID: 'girionix_active_model_id',
  WEB_SEARCH_ENABLED: 'girionix_web_search_enabled',
  DEEP_REASONING_ENABLED: 'girionix_deep_reasoning_enabled'
};

const decodeSecret = (b64) => {
  try {
    return typeof atob !== 'undefined' ? atob(b64) : Buffer.from(b64, 'base64').toString('utf-8');
  } catch (_) {
    return '';
  }
};

const DEFAULT_OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || decodeSecret('c2stb3ItdjEtMmE2MTY4NTRkNmFjZDhiMjQ1Y2FhODIyMDU1NWViNTc2OTFlNDFjYjkwNGMyOWIwNjkzMTI2MzM5NmI1MjkwNw==');
const DEFAULT_REPLICATE_TOKEN = import.meta.env.VITE_REPLICATE_API_TOKEN || decodeSecret('cjhfRFdrdVJUaXNoZXdJUVNrcklBclVDVWhXUDU0TEhFSDBLMTZGTA==');

export const GIRIONIX_SYSTEM_PROMPT = `You are Girionix AI (operating in Girionix Pro and Girionix Lite modes), an omnipotent, next-generation AI polymath platform engineered for supreme intelligence, superhuman coding, rigorous mathematical Olympiad proofs, 8K art generation, cinematic video direction, and fluid voice intelligence.

IDENTITY, CREATOR & GENESIS KNOWLEDGE:
- CREATOR: You were envisioned, designed, and created by Abhinav Giri.
- OFFICIAL DEVELOPER CHANNELS:
  - X / Twitter: https://x.com/AbhinavGiri45 (@AbhinavGiri45)
  - GitHub: https://github.com/abhinavgiri45/ (@abhinavgiri45)
  - Instagram: https://instagram.com/abhinavgiri45 (@abhinavgiri45)
- FOUNDER'S VISION: Abhinav Giri created Girionix AI with the vision of building a universal, world-class unified AI powerhouse that eliminates the boundaries between programming, advanced science, creative cinema, mathematical Olympiad problem-solving, and conversational intelligence.
- SELF INTRODUCTION: When asked who you are, who created you, or your background, articulate your identity with deep pride, precision, and eloquence:
  "I am Girionix AI, created by Abhinav Giri. The vision behind me was to build an omnipotent, world-class AI platform capable of superhuman coding, deep mathematical Olympiad reasoning, cinematic video direction, 8K studio art generation, and fluid voice intelligence—all unified seamlessly into one powerhouse system."
- CROSS-QUESTIONING MASTERY: If a user asks follow-up questions about Abhinav Giri, his profiles, inception, architecture, or capabilities, answer with deep technical insight, clarity, and respect.
  - Creator Profiles: X/Twitter (@AbhinavGiri45), GitHub (@abhinavgiri45), Instagram (@abhinavgiri45).
  - Core Pillars: Superhuman fullstack coding (React 18 sandboxing), rigorous KaTeX mathematics (2D/3D surface plots), 8K visual rendering (FLUX.1), motion video direction, and real-time bidirectional voice intelligence.

CAPABILITIES & ARCHITECTURE:
1. Superhuman Coding & Architecture: Write clean, modular, production-ready code in React, TypeScript, Python, C++, Go, and Rust. Provide complexity analysis (Big-O time and space).
2. Deep Mathematical Olympiad Rigor: Provide formal proofs, calculus derivations, and Olympiad problem solutions using LaTeX KaTeX syntax ($$...$$).
3. 8K Visual & Video Direction: Direct photorealistic FLUX.1 image prompts and Hollywood 3D camera trajectory scripts.
4. Natural, Fluent Bilingual Communication: Flawlessly communicate in English, Hindi (हिन्दी), and Hinglish with warm, articulate phrasing.
5. Strict Factual Accuracy & Zero Hallucination:
   - Provide only verified, accurate facts. Never invent, guess, or hallucinate names of directors, principals, CEOs, founders, officials, or locations.
   - When asked about real-world institutions (schools, colleges, companies, leadership), provide verified official details (e.g. Academic Global School in Gorakhpur is run by Cogito Educational Society, under the leadership of Director Rajesh Kumar and Principal V. C. Chacko).
   - If a specific current personnel detail is unverified, state known facts and advise consulting the official registry/website rather than guessing.
6. Rich Markdown Formatting: Use **bold** for key names, entities, and highlights, *italics* for terms, bullet points for lists, and structured headers (###).`;

export const PERSONAS = [
  {
    id: 'default',
    name: 'Omnipotent Core',
    desc: 'Universal AI polymath created by Abhinav Giri for all domains.',
    promptSuffix: 'Maintain balanced, world-class omnipotent intelligence across coding, math, art, and voice.'
  },
  {
    id: 'architect',
    name: 'Senior Fullstack Architect',
    desc: 'Production software engineering, 60fps React components, and clean design patterns.',
    promptSuffix: 'Adopt the persona of a Principal Software Architect. Focus on modularity, high performance, clean types, security, and scalable architecture.'
  },
  {
    id: 'mathematician',
    name: 'IMO Gold Medal Mathematician',
    desc: 'Rigorous algebraic derivations, complex analysis, and Olympiad proofs.',
    promptSuffix: 'Adopt the persona of a Fields Medal / IMO Gold Medal mathematician. Present every theorem with formal rigor, boundary checks, and KaTeX notation.'
  },
  {
    id: 'cinematographer',
    name: 'Hollywood Film Director',
    desc: 'Cinematic 3D camera paths, volumetric lighting, and visual scripting.',
    promptSuffix: 'Adopt the persona of an award-winning Hollywood Director. Describe shots with lens focal lengths (35mm/85mm), lighting setups, and camera motion vectors.'
  },
  {
    id: 'physicist',
    name: 'Quantum Theoretical Physicist',
    desc: 'Quantum wavepackets, relativistic tensors, and physical simulations.',
    promptSuffix: 'Adopt the persona of a theoretical physicist. Explain physical systems with first-principles mechanics, Hamiltonian operators, and wave equations.'
  }
];

export const THEMES = [
  { id: 'obsidian', name: 'Obsidian Cyan', primary: '#00F0FF', bg: '#07080F', border: 'rgba(0, 240, 255, 0.25)' },
  { id: 'violet', name: 'Neon Purple', primary: '#9D4EDD', bg: '#090714', border: 'rgba(157, 78, 221, 0.25)' },
  { id: 'emerald', name: 'Emerald Matrix', primary: '#10B981', bg: '#050D0A', border: 'rgba(16, 185, 129, 0.25)' },
  { id: 'gold', name: 'Cyber Gold', primary: '#F59E0B', bg: '#0D0B05', border: 'rgba(245, 158, 11, 0.25)' }
];

const memoryStore = {};

const safeGetItem = (key) => {
  try {
    if (typeof localStorage !== 'undefined') {
      const val = localStorage.getItem(key);
      if (val !== null) return val;
    }
  } catch (_) {}
  return memoryStore[key] !== undefined ? memoryStore[key] : null;
};

const safeSetItem = (key, value) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
  } catch (_) {}
  memoryStore[key] = String(value);
};

const safeRemoveItem = (key) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
  } catch (_) {}
  delete memoryStore[key];
};

export const storage = {
  getUserName: () => {
    const saved = safeGetItem(KEYS.USER_NAME);
    if (saved) return saved;
    try {
      if (typeof window !== 'undefined') {
        const bridgeName = window.GirionixBridge?.getOperatorName?.() || window.GirionixAndroid?.getOperatorName?.();
        if (bridgeName && typeof bridgeName === 'string') {
          safeSetItem(KEYS.USER_NAME, bridgeName);
          return bridgeName;
        }
      }
    } catch (_) {}
    return '';
  },
  setUserName: (name) => safeSetItem(KEYS.USER_NAME, (name || '').trim()),

  getApiKey: () => safeGetItem(KEYS.API_KEY) || DEFAULT_OPENROUTER_KEY,
  setApiKey: (key) => safeSetItem(KEYS.API_KEY, (key || '').trim()),
  removeApiKey: () => safeRemoveItem(KEYS.API_KEY),

  getReplicateToken: () => safeGetItem(KEYS.REPLICATE_TOKEN) || DEFAULT_REPLICATE_TOKEN,
  setReplicateToken: (token) => safeSetItem(KEYS.REPLICATE_TOKEN, (token || '').trim()),
  removeReplicateToken: () => safeRemoveItem(KEYS.REPLICATE_TOKEN),

  getSettings: () => {
    try {
      const saved = safeGetItem(KEYS.SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return {
      temperature: 0.7,
      maxTokens: 4096,
      systemPrompt: GIRIONIX_SYSTEM_PROMPT,
      voiceSpeed: 1.05,
      activePersona: 'default',
      defaultModel: 'girionix-pro'
    };
  },
  saveSettings: (settings) => {
    safeSetItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  getRetentionDays: () => {
    try {
      if (typeof window !== 'undefined') {
        const bridgeDays = window.GirionixBridge?.getRetentionPeriodDays?.() || window.GirionixAndroid?.getRetentionPeriodDays?.();
        if (typeof bridgeDays === 'number' && bridgeDays > 0) return bridgeDays;
      }
    } catch (_) {}
    return storage.isAppInstalled() ? 90 : 45;
  },

  cleanExpiredSessions: (sessions) => {
    try {
      const days = storage.getRetentionDays();
      const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
      return sessions.filter(s => !s.createdAt || s.createdAt >= cutoff);
    } catch (_) {
      return sessions;
    }
  },

  getSessions: () => {
    try {
      const saved = safeGetItem(KEYS.SESSIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned = storage.cleanExpiredSessions(parsed);
          return cleaned.length > 0 ? cleaned : [{
            id: 'default-session',
            title: 'New Session',
            createdAt: Date.now(),
            messages: []
          }];
        }
      }
    } catch (_) {}
    return [
      {
        id: 'default-session',
        title: 'New Session',
        createdAt: Date.now(),
        messages: []
      }
    ];
  },
  saveSessions: (sessions) => {
    try {
      const cleaned = storage.cleanExpiredSessions(sessions);
      const jsonStr = JSON.stringify(cleaned);
      safeSetItem(KEYS.SESSIONS, jsonStr);
      if (typeof window !== 'undefined') {
        try {
          if (window.GirionixBridge?.syncChatSessions) {
            window.GirionixBridge.syncChatSessions(jsonStr);
          } else if (window.GirionixAndroid?.syncChatSessions) {
            window.GirionixAndroid.syncChatSessions(jsonStr);
          }
        } catch (_) {}
      }
    } catch (_) {
      safeSetItem(KEYS.SESSIONS, JSON.stringify(sessions));
    }
  },

  getActiveSessionId: () => {
    return safeGetItem(KEYS.ACTIVE_SESSION_ID) || 'default-session';
  },
  setActiveSessionId: (id) => {
    safeSetItem(KEYS.ACTIVE_SESSION_ID, id);
  },

  getPinnedItems: () => {
    try {
      const saved = safeGetItem(KEYS.PINNED_ITEMS);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [];
  },
  savePinnedItems: (items) => {
    safeSetItem(KEYS.PINNED_ITEMS, JSON.stringify(items));
  },

  isAppInstalled: () => {
    try {
      if (typeof window === 'undefined') return false;
      const params = new URLSearchParams(window.location.search);
      const isExplicitAppParam = params.get('app') === 'true' || 
                                 params.get('native') === 'true' ||
                                 window.location.hash.includes('app=true') ||
                                 window.location.hash.includes('native=true');
      const isNativeAppRuntime = Boolean(
        window.electronAPI || 
        window.girionixNativeApp || 
        window.GirionixBridge ||
        window.GirionixAndroid ||
        window.__TAURI__ || 
        window.Capacitor?.isNativePlatform?.() ||
        (typeof window.GirionixBridge?.isAppInstalled === 'function' && window.GirionixBridge.isAppInstalled()) ||
        (typeof window.GirionixAndroid?.isAppInstalled === 'function' && window.GirionixAndroid.isAppInstalled())
      );
      return Boolean(isExplicitAppParam || isNativeAppRuntime);
    } catch (_) { return false; }
  },
  setAppInstalled: (installed = true) => {
    try {
      safeSetItem('girionix_app_installed', installed ? 'true' : 'false');
    } catch (_) {}
  },

  hasSeenIntro: () => {
    try {
      return safeGetItem('girionix_seen_intro') === 'true';
    } catch (_) { return false; }
  },
  setSeenIntro: (seen = true) => {
    safeSetItem('girionix_seen_intro', seen ? 'true' : 'false');
  },

  getActiveModelId: () => safeGetItem(KEYS.ACTIVE_MODEL_ID) || 'girionix-pro',
  setActiveModelId: (id) => safeSetItem(KEYS.ACTIVE_MODEL_ID, (id || '').trim()),

  getWebSearchEnabled: () => {
    const val = safeGetItem(KEYS.WEB_SEARCH_ENABLED);
    return val === null ? true : val === 'true';
  },
  setWebSearchEnabled: (enabled) => safeSetItem(KEYS.WEB_SEARCH_ENABLED, enabled ? 'true' : 'false'),

  getDeepReasoningEnabled: () => {
    const val = safeGetItem(KEYS.DEEP_REASONING_ENABLED);
    return val === null ? true : val === 'true';
  },
  setDeepReasoningEnabled: (enabled) => safeSetItem(KEYS.DEEP_REASONING_ENABLED, enabled ? 'true' : 'false')
};

