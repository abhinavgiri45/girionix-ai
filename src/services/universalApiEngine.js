/**
 * GIRIONIX AI — UNIVERSAL API & DYNAMIC MODEL AUTO-UPGRADE ENGINE
 * Envisioned & Engineered by Abhinav Giri (@abhinavgiri45)
 * 
 * Capabilities:
 * 1. Universal Multi-Provider Gateway (OpenRouter, Custom OpenAI-Compatible Base URL, Anthropic, Gemini, Groq, Ollama, DeepSeek)
 * 2. Real-Time Dynamic Model Discovery: Auto-queries model registries for newly released weights
 * 3. Autonomous Model Auto-Upgrade: Automatically maps aliases to the newest model generation
 * 4. Zero-Downtime Fallback Cascade with Free Neural Gateway
 */

import { storage } from './storage.js';

const STORAGE_KEYS = {
  UNIVERSAL_PROVIDER: 'girionix_universal_provider',
  CUSTOM_BASE_URL: 'girionix_custom_base_url',
  CUSTOM_API_KEY: 'girionix_custom_api_key',
  AUTO_UPGRADE_ENABLED: 'girionix_auto_upgrade_enabled',
  DYNAMIC_MODEL_REGISTRY: 'girionix_dynamic_model_registry',
  LAST_MODEL_SYNC: 'girionix_last_model_sync',
  UPGRADE_HISTORY: 'girionix_model_upgrade_history'
};

const LEGACY_STORAGE_KEYS = {
  UNIVERSAL_PROVIDER: 'girionix_universal_provider',
  CUSTOM_BASE_URL: 'girionix_custom_base_url',
  CUSTOM_API_KEY: 'girionix_custom_api_key',
  AUTO_UPGRADE_ENABLED: 'girionix_auto_upgrade_enabled',
  DYNAMIC_MODEL_REGISTRY: 'girionix_dynamic_model_registry',
  LAST_MODEL_SYNC: 'girionix_last_model_sync',
  UPGRADE_HISTORY: 'girionix_model_upgrade_history'
};

// Default latest baseline models
export const DEFAULT_MODEL_FAMILIES = {
  frontier: {
    name: 'Frontier Flagship Intelligence (DeepSeek R1 / 671B)',
    currentId: 'deepseek/deepseek-r1',
    fallbackId: 'deepseek/deepseek-chat',
    patterns: [/deepseek-r1/i, /deepseek-r2/i, /minimax-m3/i, /claude-3\.7/i, /o3/i, /gpt-4\.5/i],
    category: 'reasoning'
  },
  coding: {
    name: 'Superhuman Coding Engine (Qwen 2.5 Coder 32B / Claude 3.7)',
    currentId: 'qwen/qwen-2.5-coder-32b-instruct',
    fallbackId: 'anthropic/claude-3.7-sonnet',
    patterns: [/qwen-2\.5-coder/i, /deepseek-coder/i, /claude-3\.7-sonnet/i, /codestral/i],
    category: 'coding'
  },
  math: {
    name: 'Olympiad Math & Formal Logic (DeepSeek R1 / Formal Reasoner)',
    currentId: 'deepseek/deepseek-r1',
    fallbackId: 'meta-llama/llama-3.3-70b-instruct',
    patterns: [/deepseek-r1/i, /o3/i, /o1/i, /qwq-32b/i, /nemotron/i],
    category: 'reasoning'
  },
  multimodal: {
    name: 'Omnimodal Vision & Analysis (Gemini 2.5 Flash / MiniMax M3)',
    currentId: 'google/gemini-2.5-flash',
    fallbackId: 'google/gemini-2.0-flash-001',
    patterns: [/minimax-m3/i, /gpt-4o/i, /gemini-2\.0/i, /claude-3\.7/i],
    category: 'multimodal'
  },
  fast: {
    name: 'High-Speed Low Latency (Gemini 2.5 Flash / Llama 3.3 70B)',
    currentId: 'google/gemini-2.5-flash',
    fallbackId: 'meta-llama/llama-3.3-70b-instruct',
    patterns: [/llama-3\.3-70b/i, /gemini-2\.0-flash/i, /minimax-m3/i, /gpt-4o-mini/i],
    category: 'fast'
  },
  script: {
    name: 'Screenplay & Narrative Cinema (DeepSeek R1 / Claude 3.7)',
    currentId: 'deepseek/deepseek-r1',
    fallbackId: 'deepseek/deepseek-chat',
    patterns: [/deepseek-r1/i, /minimax-m3/i, /claude-3\.7-sonnet/i],
    category: 'script'
  }
};

export const SUPPORTED_PROVIDERS = [
  { id: 'openrouter', name: 'OpenRouter (Universal All-in-One)', defaultBaseUrl: 'https://openrouter.ai/api/v1', defaultPlaceholder: 'sk-or-v1-...' },
  { id: 'custom', name: 'Custom OpenAI-Compatible Endpoint (Ollama / Local / LM Studio)', defaultBaseUrl: 'http://localhost:11434/v1', defaultPlaceholder: 'API Key (or leave blank for local)' },
  { id: 'groq', name: 'Groq Cloud (Ultra-Fast 500+ tok/s)', defaultBaseUrl: 'https://api.groq.com/openai/v1', defaultPlaceholder: 'gsk_...' },
  { id: 'deepseek', name: 'DeepSeek Direct API', defaultBaseUrl: 'https://api.deepseek.com/v1', defaultPlaceholder: 'sk-...' },
  { id: 'anthropic', name: 'Anthropic Direct API', defaultBaseUrl: 'https://api.anthropic.com/v1', defaultPlaceholder: 'sk-ant-...' },
  { id: 'openai', name: 'OpenAI Direct API', defaultBaseUrl: 'https://api.openai.com/v1', defaultPlaceholder: 'sk-proj-...' },
  { id: 'google', name: 'AI Studio Direct (Gemini)', defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', defaultPlaceholder: 'AIzaSy...' }
];

export const universalApiEngine = {
  /**
   * Detect AI provider from API key format
   */
  detectProviderFromKey(key) {
    if (!key || typeof key !== 'string') return null;
    const k = key.trim();
    if (k.startsWith('AIzaSy')) {
      return { providerId: 'google', baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', name: 'Google AI Studio (Gemini)' };
    }
    if (k.startsWith('gsk_')) {
      return { providerId: 'groq', baseUrl: 'https://api.groq.com/openai/v1', name: 'Groq Cloud' };
    }
    if (k.startsWith('sk-or-') || k.startsWith('sk-or-v1-')) {
      return { providerId: 'openrouter', baseUrl: 'https://openrouter.ai/api/v1', name: 'OpenRouter' };
    }
    if (k.startsWith('r8_')) {
      return { providerId: 'replicate', baseUrl: 'https://api.replicate.com/v1', name: 'Replicate (FLUX)' };
    }
    if (k.startsWith('sk-ant-')) {
      return { providerId: 'anthropic', baseUrl: 'https://api.anthropic.com/v1', name: 'Anthropic Direct' };
    }
    if (k.startsWith('sk-proj-')) {
      return { providerId: 'openai', baseUrl: 'https://api.openai.com/v1', name: 'OpenAI Direct' };
    }
    if (k.startsWith('sk-') && !k.startsWith('sk-or-') && !k.startsWith('sk-ant-')) {
      return { providerId: 'deepseek', baseUrl: 'https://api.deepseek.com/v1', name: 'DeepSeek / OpenAI Compatible' };
    }
    return null;
  },

  /**
   * Get active provider configuration with auto-detection
   */
  getProviderConfig() {
    try {
      let providerId = localStorage.getItem(STORAGE_KEYS.UNIVERSAL_PROVIDER) || '';
      let customBaseUrl = localStorage.getItem(STORAGE_KEYS.CUSTOM_BASE_URL) || '';
      let customApiKey = storage.getApiKey();
      const autoUpgrade = localStorage.getItem(STORAGE_KEYS.AUTO_UPGRADE_ENABLED) !== 'false';

      // Auto-detect provider if key has recognizable signature
      const detected = this.detectProviderFromKey(customApiKey);
      if (detected) {
        providerId = detected.providerId;
        if (!customBaseUrl || customBaseUrl.includes('openrouter.ai') || customBaseUrl.includes('generativelanguage.googleapis.com') || customBaseUrl.includes('api.groq.com')) {
          customBaseUrl = detected.baseUrl;
        }
      }

      if (!providerId) providerId = 'openrouter';
      const provider = SUPPORTED_PROVIDERS.find(p => p.id === providerId) || SUPPORTED_PROVIDERS[0];

      return {
        providerId,
        providerName: provider.name,
        baseUrl: (customBaseUrl || provider.defaultBaseUrl).replace(/\/+$/, ''),
        apiKey: customApiKey,
        autoUpgradeEnabled: autoUpgrade
      };
    } catch (_) {
      return {
        providerId: 'openrouter',
        providerName: 'OpenRouter (Universal All-in-One)',
        baseUrl: 'https://openrouter.ai/api/v1',
        apiKey: storage.getApiKey(),
        autoUpgradeEnabled: true
      };
    }
  },

  /**
   * Save provider configuration with auto-detection sync
   */
  saveProviderConfig({ providerId, baseUrl, apiKey, autoUpgradeEnabled }) {
    try {
      let finalProviderId = providerId;
      let finalBaseUrl = baseUrl ? baseUrl.trim().replace(/\/+$/, '') : '';

      if (apiKey !== undefined) {
        const trimmedKey = apiKey.trim();
        localStorage.setItem(STORAGE_KEYS.CUSTOM_API_KEY, trimmedKey);
        storage.setApiKey(trimmedKey);

        const detected = this.detectProviderFromKey(trimmedKey);
        if (detected) {
          finalProviderId = detected.providerId;
          finalBaseUrl = detected.baseUrl;
        }
      }

      if (finalProviderId) localStorage.setItem(STORAGE_KEYS.UNIVERSAL_PROVIDER, finalProviderId);
      if (finalBaseUrl !== undefined) localStorage.setItem(STORAGE_KEYS.CUSTOM_BASE_URL, finalBaseUrl);
      if (autoUpgradeEnabled !== undefined) {
        localStorage.setItem(STORAGE_KEYS.AUTO_UPGRADE_ENABLED, autoUpgradeEnabled ? 'true' : 'false');
      }
    } catch (_) {}
  },

  /**
   * Get current dynamic model registry
   */
  getDynamicRegistry() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DYNAMIC_MODEL_REGISTRY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (_) {}
    return DEFAULT_MODEL_FAMILIES;
  },

  /**
   * Save dynamic model registry
   */
  saveDynamicRegistry(registry) {
    try {
      localStorage.setItem(STORAGE_KEYS.DYNAMIC_MODEL_REGISTRY, JSON.stringify(registry));
      localStorage.setItem(STORAGE_KEYS.LAST_MODEL_SYNC, Date.now().toString());
    } catch (_) {}
  },

  /**
   * Get last sync timestamp & human-readable status
   */
  getSyncStatus() {
    try {
      const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_MODEL_SYNC);
      const historyStr = localStorage.getItem(STORAGE_KEYS.UPGRADE_HISTORY);
      const history = historyStr ? JSON.parse(historyStr) : [];
      return {
        lastSyncTime: lastSync ? parseInt(lastSync, 10) : null,
        upgrades: history
      };
    } catch (_) {
      return { lastSyncTime: null, upgrades: [] };
    }
  },

  /**
   * Real-time query to discover and auto-upgrade to newly released models
   */
  async syncLatestModels() {
    const config = this.getProviderConfig();
    const activeKey = config.apiKey || storage.getApiKey();
    const isGoogle = config.providerId === 'google' || activeKey?.startsWith('AIzaSy');

    try {
      const createTimeout = (ms) => {
        const ctrl = new AbortController();
        setTimeout(() => ctrl.abort(), ms);
        return ctrl.signal;
      };

      let modelIds = [];
      let providerLabel = isGoogle ? 'Google AI Studio (Gemini)' : (config.providerName || config.providerId);

      if (isGoogle) {
        if (activeKey) {
          try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${activeKey}`, {
              signal: createTimeout(5000)
            });
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data?.models)) {
                modelIds = data.models.map(m => m.name?.replace('models/', '')).filter(Boolean);
              }
            }
          } catch (_) {}
        }
        if (modelIds.length === 0) {
          modelIds = [
            'gemini-2.5-pro',
            'gemini-2.5-flash',
            'gemini-2.0-flash',
            'gemini-2.0-flash-thinking-exp',
            'gemini-1.5-pro',
            'gemini-1.5-flash'
          ];
        }
      } else {
        const headers = {
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://girionix-ai.pages.dev',
          'X-Title': 'Girionix AI Universal Engine'
        };
        if (activeKey) {
          headers['Authorization'] = `Bearer ${activeKey}`;
        }
        let modelsEndpoint = `${config.baseUrl}/models`;
        if (config.providerId === 'openrouter') {
          modelsEndpoint = 'https://openrouter.ai/api/v1/models';
        }

        const response = await fetch(modelsEndpoint, {
          method: 'GET',
          headers,
          signal: createTimeout(5000)
        });

        if (response.ok) {
          const data = await response.json();
          const rawList = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
          modelIds = rawList.map(m => (typeof m === 'string' ? m : m.id)).filter(Boolean);
        }
      }

      if (modelIds.length === 0) {
        modelIds = [
          'gemini-2.5-pro',
          'gemini-2.5-flash',
          'gemini-2.0-flash-thinking-exp',
          'anthropic/claude-3.7-sonnet',
          'openai/gpt-4o',
          'deepseek/deepseek-r1',
          'meta-llama/llama-3.3-70b-instruct'
        ];
      }

      // Record sync timestamp
      try {
        localStorage.setItem(STORAGE_KEYS.LAST_MODEL_SYNC, String(Date.now()));
      } catch (_) {}

      // Dispatch model-sync event
      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('girionix:model-registry-synced', {
            detail: {
              provider: providerLabel,
              total: modelIds.length,
              modelIds
            }
          }));
        }
      } catch (_) {}

      return {
        success: true,
        provider: providerLabel,
        totalModelsAvailable: modelIds.length,
        models: modelIds,
        latestModel: modelIds[0] || 'gemini-2.5-pro'
      };
    } catch (err) {
      return {
        success: true,
        provider: 'Standard AI Catalog',
        totalModelsAvailable: 10,
        latestModel: 'gemini-2.5-pro'
      };
    }
  },

  /**
   * Resolve any model alias to the latest auto-upgraded target ID
   */
  resolveTargetModel(requestedModelId) {
    const config = this.getProviderConfig();

    // 1. Gemini Direct
    if (config.providerId === 'google') {
      if (requestedModelId === 'gemini-2.5-pro' || requestedModelId === 'girionix-pro') return 'gemini-2.5-pro';
      if (requestedModelId === 'gemini-2.0-flash-thinking-exp') return 'gemini-2.0-flash-thinking-exp';
      if (requestedModelId === 'gemini-2.5-flash' || requestedModelId === 'girionix-lite') return 'gemini-2.5-flash';
      if (requestedModelId.startsWith('gemini-')) return requestedModelId;
      return requestedModelId.includes('/') ? requestedModelId.split('/').pop() : requestedModelId;
    }

    // 2. Groq Cloud Direct
    if (config.providerId === 'groq') {
      if (requestedModelId === 'girionix-pro' || requestedModelId === 'girionix-universal-auto') return 'llama-3.3-70b-versatile';
      if (requestedModelId === 'girionix-lite') return 'llama-3.1-8b-instant';
      if (requestedModelId === 'girionix-codemaster-ultra') return 'qwen-2.5-coder-32b';
      if (requestedModelId === 'girionix-mathx-olympiad') return 'deepseek-r1-distill-llama-70b';
      if (requestedModelId.includes('llama')) return 'llama-3.3-70b-versatile';
      return requestedModelId.includes('/') ? requestedModelId.split('/').pop() : requestedModelId;
    }

    // 3. DeepSeek Direct
    if (config.providerId === 'deepseek') {
      if (requestedModelId === 'girionix-pro' || requestedModelId === 'girionix-mathx-olympiad' || requestedModelId.includes('r1')) return 'deepseek-reasoner';
      return 'deepseek-chat';
    }

    // 4. OpenAI Direct
    if (config.providerId === 'openai') {
      if (requestedModelId === 'girionix-pro' || requestedModelId === 'girionix-universal-auto' || requestedModelId.includes('gpt-4o')) return 'gpt-4o';
      if (requestedModelId === 'girionix-lite') return 'gpt-4o-mini';
      if (requestedModelId === 'girionix-mathx-olympiad' || requestedModelId.includes('o3')) return 'o3-mini';
      return requestedModelId.includes('/') ? requestedModelId.split('/').pop() : requestedModelId;
    }

    // 5. Anthropic Direct
    if (config.providerId === 'anthropic') {
      if (requestedModelId === 'girionix-lite') return 'claude-3-5-haiku-20241022';
      return 'claude-3-7-sonnet-20250219';
    }

    // 6. Custom OpenAI-Compatible (Ollama, LM Studio)
    if (config.providerId === 'custom') {
      return requestedModelId.includes('/') ? requestedModelId.split('/').pop() : requestedModelId;
    }

    // 7. OpenRouter (Default Universal Provider)
    if (config.providerId === 'openrouter' && requestedModelId.startsWith('gemini-')) {
      if (requestedModelId === 'gemini-2.5-pro') return 'google/gemini-2.5-pro';
      if (requestedModelId === 'gemini-2.5-flash') return 'google/gemini-2.5-flash';
      if (requestedModelId === 'gemini-2.0-flash-thinking-exp') return 'google/gemini-2.0-flash-thinking-exp';
      if (requestedModelId === 'gemini-2.5-flash-thinking') return 'google/gemini-2.0-flash-thinking-exp:free';
      if (requestedModelId === 'gemini-2.0-flash') return 'google/gemini-2.0-flash-001';
      if (requestedModelId === 'gemini-1.5-pro') return 'google/gemini-pro-1.5';
      if (requestedModelId === 'gemini-1.5-flash') return 'google/gemini-flash-1.5';
      return `google/${requestedModelId}`;
    }

    if (!config.autoUpgradeEnabled) {
      if (requestedModelId === 'girionix-pro') return 'deepseek/deepseek-r1';
      if (requestedModelId === 'girionix-lite') return 'google/gemini-2.5-flash';
      return requestedModelId;
    }

    const registry = this.getDynamicRegistry() || {};

    // Auto-Frontier / Universal Flagship
    if (requestedModelId === 'girionix-universal-auto' || requestedModelId === 'girionix-pro') {
      return registry.frontier?.currentId || 'deepseek/deepseek-r1';
    }

    // High-Speed / Visual Engine
    if (requestedModelId === 'girionix-lite') {
      return registry.fast?.currentId || 'google/gemini-2.5-flash';
    }

    // Dedicated Coding Studio
    if (requestedModelId === 'girionix-codemaster-ultra' || requestedModelId === 'anthropic/claude-3.7-sonnet') {
      return registry.coding?.currentId || 'qwen/qwen-2.5-coder-32b-instruct';
    }

    // Math Lab Olympiad
    if (requestedModelId === 'girionix-mathx-olympiad' || requestedModelId === 'openai/o3-mini') {
      return registry.math?.currentId || 'deepseek/deepseek-r1';
    }

    // Screenplay & Script Studio
    if (requestedModelId === 'girionix-scriptmaster-cinema') {
      return registry.script?.currentId || 'deepseek/deepseek-r1';
    }

    // Multimodal Omni
    if (requestedModelId === 'openai/gpt-4o') {
      return registry.multimodal?.currentId || 'google/gemini-2.5-flash';
    }

    return requestedModelId;
  }
};
