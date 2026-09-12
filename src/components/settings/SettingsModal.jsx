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
  Radio,
  ExternalLink,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { storage } from '../../services/storage';
import { openrouter } from '../../services/openrouter';
import { universalApiEngine, SUPPORTED_PROVIDERS } from '../../services/universalApiEngine';
import { geminiStudioEngine } from '../../services/geminiStudioEngine';

export default function SettingsModal({ isOpen, onClose, onApiKeyUpdated }) {
  const [providerConfig, setProviderConfig] = useState(universalApiEngine.getProviderConfig());
  const [selectedProvider, setSelectedProvider] = useState(providerConfig.providerId);
  const [customBaseUrl, setCustomBaseUrl] = useState(providerConfig.baseUrl);
  const [apiKeyInput, setApiKeyInput] = useState(providerConfig.apiKey);
  const [autoUpgradeEnabled, setAutoUpgradeEnabled] = useState(providerConfig.autoUpgradeEnabled);

  const [newReplicateToken, setNewReplicateToken] = useState('');
  const [settings, setSettings] = useState(storage.getSettings());
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [syncStatus, setSyncStatus] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [dynamicRegistry, setDynamicRegistry] = useState(universalApiEngine.getDynamicRegistry());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const cfg = universalApiEngine.getProviderConfig();
      setProviderConfig(cfg);
      setSelectedProvider(cfg.providerId);
      setCustomBaseUrl(cfg.baseUrl);
      setApiKeyInput(cfg.apiKey);
      setAutoUpgradeEnabled(cfg.autoUpgradeEnabled);
      setNewReplicateToken('');
      setSettings(storage.getSettings());
      setVerificationStatus(null);
      setSyncStatus(null);
      setDynamicRegistry(universalApiEngine.getDynamicRegistry());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProviderChange = (providerId) => {
    setSelectedProvider(providerId);
    const provider = SUPPORTED_PROVIDERS.find(p => p.id === providerId);
    if (provider) {
      setCustomBaseUrl(provider.defaultBaseUrl);
    }
  };

  const handleVerify = async () => {
    setVerificationStatus({ loading: true });
    const result = await openrouter.verifyKey(apiKeyInput, {
      providerId: selectedProvider,
      baseUrl: customBaseUrl
    });
    setVerificationStatus({ loading: false, ...result });
  };

  const handleSyncModels = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      // Temporarily persist input credentials for sync test
      universalApiEngine.saveProviderConfig({
        providerId: selectedProvider,
        baseUrl: customBaseUrl,
        apiKey: apiKeyInput,
        autoUpgradeEnabled
      });

      const res = await universalApiEngine.syncLatestModels();
      setIsSyncing(false);
      setSyncStatus(res);
      if (res.success) {
        setDynamicRegistry(universalApiEngine.getDynamicRegistry());
      }
    } catch (err) {
      setIsSyncing(false);
      setSyncStatus({ success: false, message: err.message });
    }
  };

  const handleApiKeyChange = (val) => {
    setApiKeyInput(val);
    const detected = universalApiEngine.detectProviderFromKey(val);
    if (detected) {
      setSelectedProvider(detected.providerId);
      setCustomBaseUrl(detected.baseUrl);
    }
  };

  const handleSave = () => {
    const trimmed = (apiKeyInput || '').trim();
    universalApiEngine.saveProviderConfig({
      providerId: selectedProvider,
      baseUrl: customBaseUrl,
      apiKey: trimmed,
      autoUpgradeEnabled
    });

    storage.setApiKey(trimmed);
    if (trimmed.startsWith('AIzaSy')) {
      geminiStudioEngine.setApiKey(trimmed);
    }

    if (onApiKeyUpdated) onApiKeyUpdated(trimmed);

    if (newReplicateToken.trim()) {
      storage.setReplicateToken(newReplicateToken.trim());
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
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Universal API & Engine Hub</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                  Auto-Upgrade Ready
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Connect any AI provider with automatic model generation upgrades.
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

          {/* 1. UNIVERSAL API & AUTO-UPGRADE CONTROLS */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-cyan-950/30 to-black/60 border border-cyan-500/30 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold text-white">Universal AI API Gateway</span>
              </div>

              {/* Auto-Upgrade Switch */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-300 font-bold">Auto-Upgrade Models</span>
                <button
                  type="button"
                  onClick={() => setAutoUpgradeEnabled(!autoUpgradeEnabled)}
                  className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center cursor-pointer ${
                    autoUpgradeEnabled ? 'bg-cyan-400' : 'bg-white/20'
                  }`}
                  title="When enabled, Girionix automatically switches to newer model generations as they release"
                >
                  <div className={`w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
                    autoUpgradeEnabled ? 'translate-x-5 bg-black shadow-sm' : 'translate-x-0 bg-gray-400'
                  }`} />
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-300 font-sans leading-relaxed">
              When <strong>Auto-Upgrade</strong> is active, Girionix AI autonomously routes requests to newly released frontier models (e.g. Claude 3.7/4.0, GPT-4.5/5, DeepSeek R1/R2, Gemini 2.5) without needing manual updates.
            </p>

            {/* Provider Select */}
            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-gray-400 font-bold">Target AI Provider / Protocol:</label>
              <select
                value={selectedProvider}
                onChange={(e) => handleProviderChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white font-sans text-xs focus:border-cyan-400 focus:outline-none"
              >
                {SUPPORTED_PROVIDERS.map(p => (
                  <option key={p.id} value={p.id} className="bg-[#0B0D18] text-white">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Base URL Input */}
            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-gray-400 font-bold">API Base Endpoint URL:</label>
              <input
                type="text"
                value={customBaseUrl}
                onChange={(e) => setCustomBaseUrl(e.target.value)}
                placeholder="https://openrouter.ai/api/v1 or http://localhost:11434/v1"
                className="w-full px-3.5 py-2 rounded-xl bg-black/80 border border-white/15 text-cyan-300 text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* API Key Input */}
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center">
                <label className="text-gray-400 font-bold">Provider API Key / Bearer Token:</label>
                <span className="text-[10px] text-gray-500 font-normal">Encrypted in Local Disk Vault</span>
              </div>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder={SUPPORTED_PROVIDERS.find(p => p.id === selectedProvider)?.defaultPlaceholder || 'sk-...'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />

              {/* Live Provider Auto-Detection Badge */}
              {(() => {
                const detected = universalApiEngine.detectProviderFromKey(apiKeyInput);
                if (detected) {
                  return (
                    <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center justify-between text-[11px] font-sans">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                        Detected: <strong>{detected.name}</strong>
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-500/20">
                        Auto-Configured
                      </span>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Free API Key Direct Links */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-sans">
                <span className="text-gray-500 text-[10px]">Get Free Keys:</span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1 transition-all"
                >
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  <span>Google AI Studio (Gemini 2.5 Free)</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/30 flex items-center gap-1 transition-all"
                >
                  <Zap className="w-3 h-3 text-orange-400" />
                  <span>Groq (500+ tok/s Free)</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 transition-all"
                >
                  <Layers className="w-3 h-3 text-purple-400" />
                  <span>OpenRouter</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </div>
            </div>

            {/* Test Connection & Sync Live Models Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs font-mono">
              <button
                onClick={handleVerify}
                disabled={verificationStatus?.loading}
                className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-400 hover:text-cyan-300 border border-white/10 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                {verificationStatus?.loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                <span>Test Provider Connection</span>
              </button>

              <button
                onClick={handleSyncModels}
                disabled={isSyncing}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/30 to-purple-500/30 hover:from-cyan-500/40 hover:to-purple-500/40 text-white font-bold border border-cyan-500/40 flex items-center gap-1.5 cursor-pointer shadow-glow-cyan/50 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Scanning Registries...' : '⚡ Check & Sync Model Upgrades'}</span>
              </button>
            </div>

            {/* Verification Result Feedback */}
            {verificationStatus && (
              <div className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
                verificationStatus.valid 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}>
                {verificationStatus.valid ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                <span>{verificationStatus.valid ? `✅ ${verificationStatus.label || 'Connection Valid'} — Ready for inference` : `⚠️ ${verificationStatus.message}`}</span>
              </div>
            )}

            {/* Sync Result Feedback */}
            {syncStatus && (
              <div className={`p-3 rounded-xl text-xs font-mono space-y-1.5 ${
                syncStatus.success 
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' 
                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
              }`}>
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{syncStatus.success ? `✅ Synced with ${syncStatus.totalModelsAvailable} available models on registry` : `⚠️ Sync Notice: ${syncStatus.message}`}</span>
                </div>
                {syncStatus.upgraded && (
                  <div className="text-[11px] text-emerald-400 space-y-0.5 pt-1">
                    {syncStatus.upgradedFamilies.map((u, i) => (
                      <div key={i}>🚀 Upgraded <strong>{u.name}</strong>: <code className="text-white">{u.newModel}</code></div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 2. DYNAMIC LIVE MODEL RESOLUTION STATUS */}
          <div className="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-gray-400 tracking-wider flex items-center gap-1.5 font-bold">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Active Dynamic Auto-Upgraded Models</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Live Auto-Routing Active</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/30">
                <div className="text-[10px] text-gray-400">🧠 Frontier Reasoning:</div>
                <div className="text-purple-300 font-bold truncate" title={dynamicRegistry.frontier?.currentId}>
                  {dynamicRegistry.frontier?.currentId || 'deepseek/deepseek-r1'}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
                <div className="text-[10px] text-gray-400">💻 Superhuman Coding:</div>
                <div className="text-cyan-300 font-bold truncate" title={dynamicRegistry.coding?.currentId}>
                  {dynamicRegistry.coding?.currentId || 'anthropic/claude-3.7-sonnet'}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <div className="text-[10px] text-gray-400">📐 Olympiad Math Lab:</div>
                <div className="text-emerald-300 font-bold truncate" title={dynamicRegistry.math?.currentId}>
                  {dynamicRegistry.math?.currentId || 'openai/o3-mini'}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-indigo-950/20 border border-indigo-500/30">
                <div className="text-[10px] text-gray-400">✍️ Hollywood Script Writer:</div>
                <div className="text-indigo-300 font-bold truncate" title={dynamicRegistry.script?.currentId}>
                  {dynamicRegistry.script?.currentId || 'anthropic/claude-3.7-sonnet'}
                </div>
              </div>
            </div>
          </div>

          {/* 3. VOICE ACOUSTICS & HYPERPARAMETERS */}
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
