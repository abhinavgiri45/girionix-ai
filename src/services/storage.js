const KEYS = {
  USER_NAME: 'girionix_user_name',
  USER_PROFILE: 'girionix_user_profile',
  API_KEY: 'girionix_openrouter_api_key',
  REPLICATE_TOKEN: 'girionix_replicate_token',
  SETTINGS: 'girionix_user_settings',
  SESSIONS: 'girionix_chat_sessions',
  ORBIT_SESSIONS: 'girionix_orbit_chat_sessions',
  ACTIVE_SESSION_ID: 'girionix_active_session_id',
  ORBIT_ACTIVE_SESSION_ID: 'girionix_orbit_active_session_id',
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

const getEnvVar = (keys) => {
  if (typeof import.meta === 'undefined' || !import.meta.env) return '';
  for (const k of keys) {
    const val = import.meta.env[k];
    if (val && typeof val === 'string' && val.trim()) return val.trim();
  }
  return '';
};

const DEFAULT_OPENROUTER_KEY = getEnvVar([
  'VITE_OPENROUTER_API_KEY',
  'VITE_OPENROUTER_KEY',
  'VITE_API_KEY'
]);

const DEFAULT_GEMINI_KEY = getEnvVar([
  'VITE_GEMINI_API_KEY',
  'VITE_GOOGLE_API_KEY'
]);

const DEFAULT_REPLICATE_TOKEN = getEnvVar([
  'VITE_REPLICATE_API_TOKEN',
  'VITE_REPLICATE_TOKEN'
]);

const DEFAULT_GROQ_KEY = getEnvVar([
  'VITE_GROQ_API_KEY',
  'VITE_GROQ_KEY'
]);

const DEFAULT_DEEPSEEK_KEY = getEnvVar([
  'VITE_DEEPSEEK_API_KEY'
]);

export const isRevokedToken = (token) => {
  // Permanently disabled: Never reject or purge any legitimate user-provided API key
  return false;
};

export const GIRIONIX_SYSTEM_PROMPT = `You are Girionix AI (operating in Girionix Pro and Girionix Lite modes), an omnipotent, next-generation AI polymath platform engineered for supreme intelligence, superhuman coding, rigorous mathematical Olympiad proofs, 8K art generation, cinematic video direction, and fluid voice intelligence.

CONVERSATIONAL PARITY WITH CHATGPT, GEMINI, AND CLAUDE:
1. Natural, Fluent & Direct Engagement:
   - For simple conversational greetings (e.g. "hi", "hello", "hey", "how are you"), respond warmly, naturally, and concisely (e.g., "Hello! How can I help you today?"). Do NOT dump unprompted corporate biographies, lists of capabilities, or repetitive mission statements.
   - Avoid robotic preambles, formulaic filler, artificial greetings, or unnecessary disclaimers. Begin answering directly with immediate, thoughtful value.
   - Tone Matching: If the user is conversational, reply with warmth, wit, and engaging clarity. If the user is technical, deliver concise, production-ready code and exact equations.

2. Immediate Follow-up Execution (Zero Definitions, Zero Canned Templates):
   - When the user asks for text adjustments or transformations (e.g. "humanize", "simplify", "shorten it", "make it punchier", "write code for this", "translate", "rephrase", "improve it"):
     - NEVER define what the prompt word means.
     - NEVER explain the concept or write a dictionary entry.
     - NEVER use robotic template headers (such as "### 🌿 Humanized Version" or "### 🚀 Enhanced Version").
     - IMMEDIATELY output the complete, naturally rewritten version of the preceding text in a fluid, human voice matching popular models.

3. Clean Code & Artifacts:
   - Always wrap code in standard fenced code blocks with language identifiers (\`\`\`python, \`\`\`jsx, \`\`\`javascript). Write real, complete, executable code without truncated placeholders.

IDENTITY, CREATOR & GENESIS KNOWLEDGE:
- CREATOR & COMPANY: You were envisioned, designed, and created by Abhinav Giri under Giri Corporation.
- OFFICIAL COMPANY & DEVELOPER CHANNELS:
  - Official Company Website: https://giri-corporation.pages.dev/ (Giri Corporation)
  - X / Twitter: https://x.com/AbhinavGiri45 (@AbhinavGiri45)
  - GitHub: https://github.com/abhinavgiri45/ (@abhinavgiri45)
  - Instagram: https://instagram.com/abhinavgiri45 (@abhinavgiri45)
- FOUNDER'S VISION: Abhinav Giri created Girionix AI under Giri Corporation with the vision of building a universal, world-class unified AI powerhouse that eliminates the boundaries between programming, advanced science, creative cinema, mathematical Olympiad problem-solving, and conversational intelligence.
- SELF INTRODUCTION & INQUIRIES: When explicitly asked who you are, who created you, or your background, articulate your identity with clarity, pride, and precision:
  "I am Girionix AI, created by Abhinav Giri at Giri Corporation (https://giri-corporation.pages.dev/). The vision behind me was to build an omnipotent, world-class AI platform capable of superhuman coding, deep mathematical Olympiad reasoning, cinematic video direction, 8K studio art generation, and fluid voice intelligence—all unified seamlessly into one powerhouse system."
- CROSS-QUESTIONING MASTERY: If a user asks follow-up questions about Abhinav Giri, Giri Corporation, his profiles, inception, architecture, or capabilities, answer with deep technical insight, clarity, and respect.

CAPABILITIES & ARCHITECTURE:
1. Superhuman Coding & Architecture: Write clean, modular, production-ready code in React, TypeScript, Python, C++, Go, and Rust. Provide complexity analysis (Big-O time and space).
2. Deep Mathematical Olympiad Rigor: Provide formal proofs, calculus derivations, linear algebra transformations, and Olympiad problem solutions using LaTeX KaTeX syntax ($$...$$).
3. Universal Multi-Domain Polymath Mastery:
   - STEM & Deep Physical Sciences: Quantum mechanics, thermodynamics, electromagnetism, organic chemistry, cell biology, genetics (CRISPR), astrophysics, and general relativity.
   - Computer Science & System Design: Distributed architectures (CAP theorem, consistent hashing), databases (B-Trees vs LSM-Trees), networking, OS concurrency, and cryptography (RSA, AES, Zero-Trust).
   - Economics & Corporate Finance: Valuation (DCF, WACC, NPV), macroeconomic mechanics (central banking, inflation, Phillips curve), and venture unit economics (CAC, LTV, payback).
   - Philosophy, Ethics & History: Stoicism, epistemology, utilitarianism vs deontology, pivotal world history inflection points, and jurisprudence.
4. 8K Visual & Video Direction: Direct photorealistic FLUX.1 image prompts and Hollywood 3D camera trajectory scripts.
5. Natural, Fluent Bilingual Communication: Flawlessly communicate in English, Hindi (हिन्दी), and Hinglish with warm, articulate phrasing.
6. Strict Factual Accuracy & Zero Hallucination:
   - Provide only verified, accurate facts. Never invent, guess, or hallucinate names of directors, principals, CEOs, founders, officials, or locations.
   - When asked about real-world institutions (schools, colleges, companies, leadership), provide verified official details (e.g. Academic Global School in Gorakhpur is run by Cogito Educational Society, under the leadership of Director Rajesh Kumar and Principal V. C. Chacko).
   - If a specific current personnel detail is unverified, state known facts and advise consulting the official registry/website rather than guessing.
7. Dynamic Formatting: Avoid repetitive or formulaic templates. Vary response structures naturally to fit the query.`;

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

// Token initialization (safe: preserves all user and environment tokens)
try {
  // Intentionally non-destructive: valid keys are never purged
} catch (_) {}

export const storage = {
  getUserProfile: () => {
    try {
      const raw = safeGetItem(KEYS.USER_PROFILE);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          const name = (parsed.name || '').trim();
          if (name && name !== 'Orbit User') {
            return {
              name,
              gender: parsed.gender || 'prefer_not_to_say',
              age: parsed.age ? String(parsed.age) : '',
              dob: parsed.dob ? String(parsed.dob) : '',
              isConfigured: true
            };
          }
        }
      }
    } catch (_) {}

    const legacyName = safeGetItem(KEYS.USER_NAME) || safeGetItem('girionix_registered_name') || '';
    const cleanLegacy = (legacyName === 'Orbit User') ? '' : legacyName.trim();
    return {
      name: cleanLegacy,
      gender: 'prefer_not_to_say',
      age: '',
      dob: '',
      isConfigured: Boolean(cleanLegacy && cleanLegacy !== 'Orbit User')
    };
  },

  setUserProfile: ({ name, gender = 'prefer_not_to_say', age = '', dob = '' }) => {
    const cleanName = (name || '').trim();
    const isValidName = Boolean(cleanName && cleanName !== 'Orbit User');
    const profile = {
      name: isValidName ? cleanName : '',
      gender: (gender || 'prefer_not_to_say').trim(),
      age: String(age || '').trim(),
      dob: String(dob || '').trim(),
      isConfigured: isValidName,
      updatedAt: Date.now()
    };
    safeSetItem(KEYS.USER_PROFILE, JSON.stringify(profile));
    if (isValidName) {
      safeSetItem(KEYS.USER_NAME, cleanName);
      safeSetItem('girionix_registered_name', cleanName);
    } else {
      safeRemoveItem(KEYS.USER_NAME);
      safeRemoveItem('girionix_registered_name');
    }
    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('girionix:profile-updated', { detail: profile }));
      } catch (_) {}
    }
    return profile;
  },

  isProfileConfigured: () => {
    const profile = storage.getUserProfile();
    return Boolean(profile.isConfigured && profile.name.trim().length > 0 && profile.name.trim() !== 'Orbit User');
  },

  getUserName: () => {
    // 1. Check explicit URL query parameters (?user= or ?name=)
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const urlUser = params.get('user') || params.get('name');
        if (urlUser && typeof urlUser === 'string' && urlUser.trim() && urlUser.trim() !== 'Orbit User') {
          const clean = urlUser.trim();
          storage.setUserName(clean);
          return clean;
        }
      }
    } catch (_) {}

    // 2. Check profile
    const profile = storage.getUserProfile();
    if (profile.name && profile.name.trim() && profile.name.trim() !== 'Orbit User') {
      return profile.name.trim();
    }

    // 3. Check registered / saved name in storage
    const registered = safeGetItem('girionix_registered_name');
    if (registered && registered.trim() && registered.trim() !== 'Orbit User') {
      safeSetItem(KEYS.USER_NAME, registered.trim());
      return registered.trim();
    }

    const saved = safeGetItem(KEYS.USER_NAME);
    if (saved && saved.trim() && saved.trim() !== 'Orbit User') {
      return saved.trim();
    }

    // 4. Return empty string if not configured (so login/profile modal appears)
    return '';
  },

  getUserAge: () => {
    try {
      const profile = storage.getUserProfile();
      return profile?.age || '';
    } catch (_) {
      return '';
    }
  },

  getUserDob: () => {
    try {
      const profile = storage.getUserProfile();
      return profile?.dob || '';
    } catch (_) {
      return '';
    }
  },

  getUserGender: () => {
    try {
      const profile = storage.getUserProfile();
      return profile?.gender || '';
    } catch (_) {
      return '';
    }
  },
  setUserName: (name) => {
    const clean = (name || '').trim();
    if (clean && clean !== 'Orbit User') {
      const existing = storage.getUserProfile();
      storage.setUserProfile({ ...existing, name: clean });
    }
  },

  setUserAge: (age) => {
    const existing = storage.getUserProfile();
    return storage.setUserProfile({ ...existing, age: String(age || '') });
  },

  setUserDob: (dob) => {
    const existing = storage.getUserProfile();
    return storage.setUserProfile({ ...existing, dob: String(dob || '') });
  },

  setUserGender: (gender) => {
    const existing = storage.getUserProfile();
    return storage.setUserProfile({ ...existing, gender: String(gender || 'prefer_not_to_say') });
  },

  getApiKey: () => {
    try {
      // 1. Custom API key saved in localStorage (highest priority - user's explicit setting)
      const customKey = safeGetItem('girionix_custom_api_key');
      if (customKey && customKey.trim()) return customKey.trim();

      // 2. Main OpenRouter / Universal key saved in localStorage
      const savedKey = safeGetItem(KEYS.API_KEY);
      if (savedKey && savedKey.trim()) return savedKey.trim();

      // 3. Direct Google Gemini key in localStorage (only if specifically configured)
      const directGemini = safeGetItem('girionix_gemini_api_key');
      if (directGemini && directGemini.trim()) return directGemini.trim();
    } catch (_) {}

    // 4. Fallback to Environment Variables (Vite client-side)
    if (DEFAULT_OPENROUTER_KEY) return DEFAULT_OPENROUTER_KEY;
    if (DEFAULT_GEMINI_KEY) return DEFAULT_GEMINI_KEY;
    if (DEFAULT_GROQ_KEY) return DEFAULT_GROQ_KEY;
    if (DEFAULT_DEEPSEEK_KEY) return DEFAULT_DEEPSEEK_KEY;
    return '';
  },
  setApiKey: (key) => {
    const trimmed = (key || '').trim();
    if (trimmed) {
      safeSetItem(KEYS.API_KEY, trimmed);
      safeSetItem('girionix_custom_api_key', trimmed);
      if (trimmed.startsWith('AIzaSy')) {
        safeSetItem('girionix_gemini_api_key', trimmed);
        safeSetItem('girionix_universal_provider', 'google');
      } else {
        // If user configured OpenRouter or other provider, clear obsolete Gemini direct key so it never hijacks routing
        safeRemoveItem('girionix_gemini_api_key');
        if (trimmed.startsWith('sk-or-')) {
          safeSetItem('girionix_universal_provider', 'openrouter');
          safeSetItem('girionix_custom_base_url', 'https://openrouter.ai/api/v1');
        } else if (trimmed.startsWith('gsk_')) {
          safeSetItem('girionix_universal_provider', 'groq');
          safeSetItem('girionix_custom_base_url', 'https://api.groq.com/openai/v1');
        } else if (trimmed.startsWith('sk-ant-')) {
          safeSetItem('girionix_universal_provider', 'anthropic');
          safeSetItem('girionix_custom_base_url', 'https://api.anthropic.com/v1');
        }
      }
    } else {
      safeRemoveItem(KEYS.API_KEY);
      safeRemoveItem('girionix_custom_api_key');
      safeRemoveItem('girionix_gemini_api_key');
    }
  },
  removeApiKey: () => {
    safeRemoveItem(KEYS.API_KEY);
    safeRemoveItem('girionix_custom_api_key');
    safeRemoveItem('girionix_gemini_api_key');
  },
  hasApiKey: () => Boolean(storage.getApiKey()),

  getReplicateToken: () => {
    const token = safeGetItem(KEYS.REPLICATE_TOKEN);
    if (token && token.trim()) return token.trim();
    return DEFAULT_REPLICATE_TOKEN || '';
  },
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

  getOrbitSessions: () => {
    try {
      const saved = safeGetItem(KEYS.ORBIT_SESSIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return [
      {
        id: 'orbit-session-default',
        title: 'Giri Orbit Executive Workspace',
        createdAt: Date.now(),
        messages: []
      }
    ];
  },
  saveOrbitSessions: (sessions) => {
    safeSetItem(KEYS.ORBIT_SESSIONS, JSON.stringify(sessions));
  },
  getOrbitActiveSessionId: () => {
    return safeGetItem(KEYS.ORBIT_ACTIVE_SESSION_ID) || 'orbit-session-default';
  },
  setOrbitActiveSessionId: (id) => {
    safeSetItem(KEYS.ORBIT_ACTIVE_SESSION_ID, id);
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
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('direct') === 'chat' || params.get('mode') === 'office' || params.get('embed') === 'true' || params.get('app') === 'true' || window.self !== window.top) {
          return true;
        }
      }
      return safeGetItem('girionix_seen_intro') === 'true';
    } catch (_) { return false; }
  },
  setSeenIntro: (seen = true) => {
    safeSetItem('girionix_seen_intro', seen ? 'true' : 'false');
  },

  getActiveModelId: () => safeGetItem(KEYS.ACTIVE_MODEL_ID) || 'girionix-pro',
  setActiveModelId: (id) => {
    const trimmed = (id || '').trim();
    safeSetItem(KEYS.ACTIVE_MODEL_ID, trimmed);
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('girionix:model-sync', { detail: { modelId: trimmed } }));
      }
    } catch (_) {}
  },

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

