import React, { useState, useEffect } from 'react';
import { 
  X, 
  Key, 
  ShieldCheck, 
  Sliders, 
  Cpu, 
  Check, 
  Lock,
  RefreshCw,
  Zap,
  Volume2,
  Sparkles,
  Globe,
  User,
  Heart,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react';
import { storage } from '../../services/storage';
import { openrouter } from '../../services/openrouter';
import { universalApiEngine } from '../../services/universalApiEngine';
import { geminiStudioEngine } from '../../services/geminiStudioEngine';

export default function SettingsModal({ isOpen, onClose, onApiKeyUpdated }) {
  const [providerConfig, setProviderConfig] = useState(universalApiEngine.getProviderConfig());
  const [customBaseUrl, setCustomBaseUrl] = useState(providerConfig.baseUrl);
  const [apiKeyInput, setApiKeyInput] = useState(providerConfig.apiKey);
  const [showApiKey, setShowApiKey] = useState(false);

  const [userProfile, setUserProfile] = useState(() => storage.getUserProfile());
  const [settings, setSettings] = useState(storage.getSettings());
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [alwaysDirectChat, setAlwaysDirectChat] = useState(() => {
    try { return localStorage.getItem('girionix_always_direct_chat') === 'true'; } catch (_) { return false; }
  });
  const [showToolsInHeader, setShowToolsInHeader] = useState(() => {
    try {
      const s = storage.getSettings();
      return s.showToolsInHeader !== false;
    } catch (_) { return true; }
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowToolsInHeader(storage.getSettings().showToolsInHeader !== false);
      const cfg = universalApiEngine.getProviderConfig();
      setProviderConfig(cfg);
      setCustomBaseUrl(cfg.baseUrl);
      setApiKeyInput(cfg.apiKey);
      setSettings(storage.getSettings());
      setUserProfile(storage.getUserProfile());
      setVerificationStatus(null);
      setAlwaysDirectChat(localStorage.getItem('girionix_always_direct_chat') === 'true');
      setSavedSuccess(false);
      setShowApiKey(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApiKeyChange = (val) => {
    setApiKeyInput(val);
    const detected = universalApiEngine.detectProviderFromKey(val);
    if (detected) {
      if (!customBaseUrl || customBaseUrl.includes('openrouter.ai') || customBaseUrl.includes('generativelanguage.googleapis.com')) {
        setCustomBaseUrl(detected.baseUrl);
      }
    }
  };

  const handleVerify = async () => {
    setVerificationStatus({ loading: true });
    const detected = universalApiEngine.detectProviderFromKey(apiKeyInput);
    const providerId = detected ? detected.providerId : 'custom';
    const baseUrl = customBaseUrl || (detected ? detected.baseUrl : 'https://openrouter.ai/api/v1');
    const result = await openrouter.verifyKey(apiKeyInput, {
      providerId,
      baseUrl
    });
    setVerificationStatus({ loading: false, ...result });
  };

  const handleSave = () => {
    const trimmed = (apiKeyInput || '').trim();
    const detected = universalApiEngine.detectProviderFromKey(trimmed);
    const providerId = detected ? detected.providerId : (customBaseUrl ? 'custom' : 'openrouter');
    const baseUrl = customBaseUrl ? customBaseUrl.trim() : (detected ? detected.baseUrl : 'https://openrouter.ai/api/v1');

    universalApiEngine.saveProviderConfig({
      providerId,
      baseUrl,
      apiKey: trimmed,
      autoUpgradeEnabled: true
    });

    storage.setApiKey(trimmed);
    if (providerId === 'google' || trimmed.startsWith('AIzaSy')) {
      geminiStudioEngine.setApiKey(trimmed);
      try {
        localStorage.setItem('girionix_gemini_api_key', trimmed);
      } catch (_) {}
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('girionix:key-updated'));
      window.dispatchEvent(new Event('storage'));
    }

    if (onApiKeyUpdated) onApiKeyUpdated(trimmed);

    try {
      localStorage.setItem('girionix_always_direct_chat', alwaysDirectChat ? 'true' : 'false');
    } catch (_) {}

    if (userProfile && userProfile.name && userProfile.name.trim()) {
      storage.setUserProfile({
        name: userProfile.name.trim(),
        gender: userProfile.gender || 'prefer_not_to_say',
        age: userProfile.age || ''
      });
    }

    storage.saveSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-2xl animate-fadeIn">
      <div className="w-full max-w-2xl rounded-3xl bg-[#080B14] border border-cyan-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-300">
              <Sliders className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Settings</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                  Custom API
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Configure your custom AI endpoint, user profile, and speech settings.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* 0. USER IDENTITY & PERSONALIZATION */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#111425] to-black/60 border border-purple-500/30 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-bold text-white">User Identity & Personalization</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                Custom Tailored
              </span>
            </div>

            <p className="text-xs text-gray-300 font-sans leading-relaxed">
              Personalize how Girionix AI addresses you. Optional gender and age help customize explanations, tone, analogies, and coding style to your exact experience level.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-gray-300 flex items-center gap-1 font-bold">
                  <User className="w-3 h-3 text-cyan-400" />
                  <span>Name</span>
                </label>
                <input
                  type="text"
                  value={userProfile.name || ''}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your Name"
                  className="w-full px-3 py-2 rounded-xl bg-[#090B14] border border-white/15 focus:border-cyan-400 text-white placeholder-gray-500 text-xs focus:outline-none"
                />
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-gray-300 flex items-center gap-1 font-bold">
                  <Heart className="w-3 h-3 text-purple-400" />
                  <span>Gender</span>
                </label>
                <select
                  value={userProfile.gender || 'prefer_not_to_say'}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#090B14] border border-white/15 focus:border-purple-400 text-white text-xs focus:outline-none cursor-pointer"
                >
                  <option value="prefer_not_to_say" className="bg-[#0b0d19] text-gray-300">Prefer not to say</option>
                  <option value="male" className="bg-[#0b0d19] text-gray-300">Male</option>
                  <option value="female" className="bg-[#0b0d19] text-gray-300">Female</option>
                  <option value="non_binary" className="bg-[#0b0d19] text-gray-300">Non-binary</option>
                  <option value="other" className="bg-[#0b0d19] text-gray-300">Other</option>
                </select>
              </div>

              {/* Age */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-gray-300 flex items-center gap-1 font-bold">
                  <Calendar className="w-3 h-3 text-cyan-400" />
                  <span>Age Range</span>
                </label>
                <select
                  value={userProfile.age || ''}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-[#090B14] border border-white/15 focus:border-cyan-400 text-white text-xs focus:outline-none cursor-pointer"
                >
                  <option value="" className="bg-[#0b0d19] text-gray-300">Select (Optional)</option>
                  <option value="under_18" className="bg-[#0b0d19] text-gray-300">Under 18</option>
                  <option value="18-24" className="bg-[#0b0d19] text-gray-300">18 - 24</option>
                  <option value="25-34" className="bg-[#0b0d19] text-gray-300">25 - 34</option>
                  <option value="35-49" className="bg-[#0b0d19] text-gray-300">35 - 49</option>
                  <option value="50+" className="bg-[#0b0d19] text-gray-300">50+</option>
                </select>
              </div>
            </div>
          </div>

          {/* 1. CUSTOM API */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-cyan-950/30 to-black/60 border border-cyan-500/30 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold text-white">Custom API</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                Encrypted & Direct
              </span>
            </div>

            <p className="text-xs text-gray-300 font-sans leading-relaxed">
              Configure your Custom API key and endpoint. Supports <strong>OpenRouter</strong>, <strong>Google Gemini</strong>, <strong>Groq</strong>, <strong>DeepSeek</strong>, <strong>Anthropic</strong>, <strong>OpenAI</strong>, or any OpenAI-compatible local/remote endpoint.
            </p>

            {/* Custom API Key */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between items-center">
                <label className="text-gray-300 font-bold flex items-center gap-1.5">
                  <span>Custom API Key / Bearer Token:</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-sans cursor-pointer flex items-center gap-1 transition-colors"
                >
                  {showApiKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showApiKey ? 'Hide Key' : 'Show Key'}</span>
                </button>
              </div>
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder="sk-..., AIzaSy..., gsk_..., or custom token"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none transition-colors"
              />

              {/* Live Provider Auto-Detection Badge */}
              {(() => {
                const detected = universalApiEngine.detectProviderFromKey(apiKeyInput);
                if (detected) {
                  return (
                    <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center justify-between text-[11px] font-sans">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                        Detected Provider: <strong>{detected.name}</strong>
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-500/20">
                        Auto-Routed
                      </span>
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            {/* Custom Base URL Input */}
            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-gray-300 font-bold">Custom Base Endpoint URL (Optional):</label>
              <input
                type="text"
                value={customBaseUrl}
                onChange={(e) => setCustomBaseUrl(e.target.value)}
                placeholder="https://openrouter.ai/api/v1 (or custom OpenAI-compatible endpoint)"
                className="w-full px-3.5 py-2 rounded-xl bg-black/80 border border-white/15 text-cyan-300 text-xs font-mono focus:border-cyan-400 focus:outline-none transition-colors"
              />
              <p className="text-[10px] text-gray-500 font-sans">
                Defaults to OpenRouter (<code className="text-gray-400">https://openrouter.ai/api/v1</code>) or your provider's native endpoint. Can also be set to local servers (e.g. Ollama <code className="text-gray-400">http://localhost:11434/v1</code>).
              </p>
            </div>

            {/* Test Connection Button */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={handleVerify}
                disabled={verificationStatus?.loading || !apiKeyInput?.trim()}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-40 text-cyan-400 hover:text-cyan-300 border border-white/10 flex items-center gap-1.5 cursor-pointer text-xs font-mono transition-all"
              >
                {verificationStatus?.loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                <span>Test Connection</span>
              </button>
            </div>

            {/* Verification Result Feedback */}
            {verificationStatus && (
              <div className={`p-3.5 rounded-xl text-xs font-mono space-y-1.5 ${
                verificationStatus.valid 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}>
                <div className="flex items-center gap-2 font-bold">
                  {verificationStatus.valid ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-rose-400" />}
                  <span>{verificationStatus.valid ? `✅ ${verificationStatus.label || 'Connection Valid'} — Ready for inference` : `⚠️ ${verificationStatus.message}`}</span>
                </div>
                {verificationStatus.valid && (verificationStatus.usage !== undefined || verificationStatus.limit !== undefined) && (
                  <div className="text-[11px] text-gray-300 font-sans pl-6 space-y-0.5 pt-1 border-t border-emerald-500/20">
                    {verificationStatus.usage !== undefined && (
                      <div>Usage on key: <span className="font-mono text-emerald-300 font-bold">${typeof verificationStatus.usage === 'number' ? verificationStatus.usage.toFixed(4) : verificationStatus.usage}</span></div>
                    )}
                    {verificationStatus.limit && (
                      <div>Credit limit: <span className="font-mono text-cyan-300 font-bold">${verificationStatus.limit}</span></div>
                    )}
                    {verificationStatus.isFreeTier && (
                      <div className="text-amber-300 font-medium">Account Tier: Free Tier (Use :free models if credit is $0)</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 3. STARTUP & WORKSPACE ROUTING PREFERENCE */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-gray-400 tracking-wider flex items-center gap-1.5 font-bold">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Startup Landing Page & Routing</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-400">Direct Workspace</span>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Start directly in Chat Workspace (/chat)</span>
                  {alwaysDirectChat && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[9px] font-mono border border-cyan-500/30">
                      Active
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-gray-400 font-sans">
                  When enabled, visiting <code className="text-cyan-300">https://girionix-ai.pages.dev</code> bypasses the announcement page and opens Chat immediately.
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAlwaysDirectChat(!alwaysDirectChat)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  alwaysDirectChat ? 'bg-cyan-500 shadow-glow-cyan' : 'bg-white/10'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    alwaysDirectChat ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Show Tools Pill Button Toggle */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>Show "Tools" button in header</span>
                  {showToolsInHeader && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[9px] font-mono border border-cyan-500/30">
                      Enabled
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-gray-400 font-sans">
                  Show or hide the quick Tools pill button in the top navigation bar. (You can still open tools anytime via <code className="text-cyan-300">/tools</code>).
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const updated = !showToolsInHeader;
                  setShowToolsInHeader(updated);
                  storage.saveSettings({ ...storage.getSettings(), showToolsInHeader: updated });
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  showToolsInHeader ? 'bg-cyan-500 shadow-glow-cyan' : 'bg-white/10'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    showToolsInHeader ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 4. VOICE ACOUSTICS & HYPERPARAMETERS */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
            <h3 className="text-xs font-mono uppercase text-gray-400 tracking-wider flex items-center gap-2 font-bold">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              Voice Acoustics & Speech Speed
            </h3>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-300">Speech Rate</span>
                <span className="text-cyan-400 font-bold">{settings.voiceSpeed || 1.05}x</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.5"
                step="0.05"
                value={settings.voiceSpeed || 1.05}
                onChange={(e) => setSettings({ ...settings, voiceSpeed: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          {/* 4. REASONING TEMPERATURE */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-gray-300 flex items-center gap-1.5 font-bold">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Creativity & Reasoning Temperature</span>
              </span>
              <span className="text-cyan-400 font-bold">{settings.temperature}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={settings.temperature}
              onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
          <button
            onClick={() => setSettings(storage.getSettings())}
            className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            Reset Defaults
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-extrabold text-black bg-gradient-to-r from-cyan-400 to-purple-400 hover:opacity-90 shadow-glow-cyan transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
              <span>{savedSuccess ? 'Saved' : 'Save & Apply'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
