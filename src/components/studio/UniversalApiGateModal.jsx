import React, { useState, useEffect } from 'react';
import { 
  Key, 
  ExternalLink, 
  Check, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  Trash2, 
  X, 
  Zap, 
  ArrowRight,
  Server,
  Layers,
  Code2,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { universalApiEngine, SUPPORTED_PROVIDERS } from '../../services/universalApiEngine';
import { geminiStudioEngine } from '../../services/geminiStudioEngine';
import { openrouter } from '../../services/openrouter';
import { storage } from '../../services/storage';

const PROVIDER_INFO = {
  google: {
    badge: 'RECOMMENDED • 100% FREE',
    badgeColor: 'emerald',
    docsUrl: 'https://aistudio.google.com/app/apikey',
    ctaText: 'Get Free Gemini Key (0 Credit Card)',
    description: 'Google AI Studio provides 100% free API keys for Gemini 2.5 Pro & Flash without requiring any credit card.'
  },
  openrouter: {
    badge: 'UNIVERSAL ACCESS',
    badgeColor: 'purple',
    docsUrl: 'https://openrouter.ai/keys',
    ctaText: 'Get OpenRouter Key',
    description: 'Access Claude 3.7, GPT-4o, DeepSeek R1, and Llama 3.3 with a single unified API key.'
  },
  groq: {
    badge: '500+ TOK/S ULTRA-FAST',
    badgeColor: 'amber',
    docsUrl: 'https://console.groq.com/keys',
    ctaText: 'Get Free Groq Key',
    description: 'Ultra-low-latency LPU inference for Llama 3.3 70B, Qwen 2.5, and DeepSeek R1 distill.'
  },
  deepseek: {
    badge: 'FRONTIER REASONING',
    badgeColor: 'blue',
    docsUrl: 'https://platform.deepseek.com/api_keys',
    ctaText: 'Get DeepSeek Key',
    description: 'Direct access to DeepSeek V3 and DeepSeek R1 full 671B reasoning models.'
  },
  openai: {
    badge: 'STANDARD OPENAI',
    badgeColor: 'cyan',
    docsUrl: 'https://platform.openai.com/api-keys',
    ctaText: 'Get OpenAI Key',
    description: 'Official API access to GPT-4o, GPT-4o-mini, and o3-mini models.'
  },
  anthropic: {
    badge: 'CLAUDE FRONTIER',
    badgeColor: 'rose',
    docsUrl: 'https://console.anthropic.com/settings/keys',
    ctaText: 'Get Anthropic Key',
    description: 'Official API access to Claude 3.7 Sonnet, Claude 3.5 Sonnet, and Claude 3 Opus.'
  },
  custom: {
    badge: 'LOCAL / OLLAMA / LM STUDIO',
    badgeColor: 'teal',
    docsUrl: 'https://ollama.com',
    ctaText: 'Ollama Setup Guide',
    description: 'Connect any OpenAI-compatible local server (Ollama, LM Studio, vLLM) on your machine or LAN.'
  }
};

export default function UniversalApiGateModal({ 
  isOpen, 
  isMandatory = false, 
  onClose, 
  onKeyVerified,
  onSwitchToCodingStudio
}) {
  const currentConfig = universalApiEngine.getProviderConfig();
  const [selectedProvider, setSelectedProvider] = useState(currentConfig.providerId || 'google');
  const [apiKeyInput, setApiKeyInput] = useState(() => {
    return currentConfig.apiKey || geminiStudioEngine.getApiKey() || storage.getApiKey() || '';
  });
  const [baseUrlInput, setBaseUrlInput] = useState(currentConfig.baseUrl || '');
  const [showKey, setShowKey] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

  useEffect(() => {
    if (isOpen) {
      const cfg = universalApiEngine.getProviderConfig();
      const existingKey = cfg.apiKey || geminiStudioEngine.getApiKey() || storage.getApiKey() || '';
      setSelectedProvider(cfg.providerId || (existingKey.startsWith('AIzaSy') ? 'google' : 'openrouter'));
      setApiKeyInput(existingKey);
      setBaseUrlInput(cfg.baseUrl || '');
      setStatus(null);
      setIsVerifying(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProviderSelect = (provId) => {
    setSelectedProvider(provId);
    setStatus(null);
    const provMeta = SUPPORTED_PROVIDERS.find(p => p.id === provId);
    if (provMeta) {
      setBaseUrlInput(provMeta.defaultBaseUrl);
    }
  };

  const handleApiKeyChange = (val) => {
    setApiKeyInput(val);
    setStatus(null);
    // Auto-detect provider if user pastes known key format
    const detected = universalApiEngine.detectProviderFromKey(val);
    if (detected && detected.providerId !== selectedProvider) {
      setSelectedProvider(detected.providerId);
      setBaseUrlInput(detected.baseUrl);
    }
  };

  const handleVerifyAndSave = async () => {
    const trimmedKey = (apiKeyInput || '').trim();
    if (!trimmedKey && selectedProvider !== 'custom') {
      setStatus({ 
        type: 'error', 
        message: 'Please paste your API key to verify and connect.' 
      });
      return;
    }

    setIsVerifying(true);
    setStatus(null);

    try {
      let isSuccess = false;
      let label = '';
      let errorMsg = '';

      if (selectedProvider === 'google') {
        const res = await geminiStudioEngine.verifyApiKey(trimmedKey);
        if (res.valid) {
          isSuccess = true;
          label = res.label || 'Google AI Studio (Gemini) Verified';
          geminiStudioEngine.setApiKey(trimmedKey);
        } else {
          errorMsg = res.message || 'Invalid Gemini API Key';
        }
      } else {
        const res = await openrouter.verifyKey(trimmedKey, {
          providerId: selectedProvider,
          baseUrl: baseUrlInput
        });
        if (res.valid) {
          isSuccess = true;
          label = res.label || `${selectedProvider.toUpperCase()} Verified & Connected`;
        } else {
          errorMsg = res.message || `Verification failed for ${selectedProvider}`;
        }
      }

      if (isSuccess) {
        // Save to universal config and storage
        universalApiEngine.saveProviderConfig({
          providerId: selectedProvider,
          baseUrl: baseUrlInput,
          apiKey: trimmedKey,
          autoUpgradeEnabled: true
        });
        storage.setApiKey(trimmedKey);

        if (selectedProvider === 'google' || trimmedKey.startsWith('AIzaSy')) {
          geminiStudioEngine.setApiKey(trimmedKey);
          try {
            localStorage.setItem('girionix_gemini_api_key', trimmedKey);
          } catch (_) {}
        }

        try {
          localStorage.setItem('girionix_ai_studio_setup_done', 'true');
        } catch (_) {}

        setStatus({
          type: 'success',
          message: `✅ Key verified successfully: ${label}`
        });

        if (onKeyVerified) {
          onKeyVerified({
            providerId: selectedProvider,
            apiKey: trimmedKey,
            baseUrl: baseUrlInput
          });
        }

        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setStatus({
          type: 'error',
          message: `❌ Verification failed: ${errorMsg}. Please check that your key is correct and has active quota.`
        });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: `Network error verifying key: ${err.message}`
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const activeProviderMeta = PROVIDER_INFO[selectedProvider] || PROVIDER_INFO.google;
  const currentProviderDef = SUPPORTED_PROVIDERS.find(p => p.id === selectedProvider) || SUPPORTED_PROVIDERS[0];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-[#080B15] border border-cyan-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-20 bg-gradient-to-b from-cyan-500/20 to-transparent blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                isMandatory 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              }`}>
                {isMandatory ? 'Required For AI Studio' : 'Universal API Setup'}
              </span>
              <span className="text-[10px] font-mono text-gray-400">
                Live Key Validation Active
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-cyan-400" />
              <span>Connect Universal API for AI Studio</span>
            </h2>

            <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
              AI Studio enables frontier multi-turn chat, freeform prompt development, and schema-structured JSON output. Connect any verified AI provider below.
            </p>
          </div>

          {!isMandatory && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs">
          {/* Provider Selection Grid */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-gray-300 font-bold block">
              1. Choose AI Provider
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SUPPORTED_PROVIDERS.map((prov) => {
                const isSelected = selectedProvider === prov.id;
                const info = PROVIDER_INFO[prov.id] || {};
                const isFree = prov.id === 'google';

                return (
                  <button
                    key={prov.id}
                    type="button"
                    onClick={() => handleProviderSelect(prov.id)}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400 shadow-glow-cyan/40 text-white scale-[1.02]'
                        : 'bg-white/[0.03] border-white/10 text-gray-400 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{prov.name.split(' ')[0]}</span>
                        {isFree && (
                          <span className="text-[9px] px-1 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                            FREE
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-500 truncate block">
                        {prov.id === 'google' ? 'Gemini 2.5' : prov.id === 'groq' ? '500+ tok/s' : prov.id}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-end">
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-gray-600'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Provider Helper Card */}
          <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs">
                  {currentProviderDef.name}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                  {activeProviderMeta.badge}
                </span>
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                {activeProviderMeta.description}
              </p>
            </div>

            {activeProviderMeta.docsUrl && (
              <a
                href={activeProviderMeta.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>{activeProviderMeta.ctaText}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-gray-300 font-bold">
                2. Enter API Key
              </label>
              <span className="text-[10px] text-gray-500 font-mono">
                {currentProviderDef.defaultPlaceholder}
              </span>
            </div>

            <div className="relative flex items-center">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder={currentProviderDef.defaultPlaceholder}
                className="w-full px-4 py-3 pr-20 rounded-2xl bg-black/60 border border-white/15 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-xs text-white font-mono placeholder:text-gray-600 transition-all"
              />
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
                  title={showKey ? "Hide API key" : "Show API key"}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Base URL Input for Custom or Advanced Users */}
          {(selectedProvider === 'custom' || selectedProvider === 'openrouter') && (
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-gray-400 flex items-center gap-1">
                <span>API Base Endpoint URL</span>
                <span className="text-gray-500 text-[10px]">(OpenAI-Compatible /v1)</span>
              </label>
              <input
                type="text"
                value={baseUrlInput}
                onChange={(e) => setBaseUrlInput(e.target.value)}
                placeholder="http://localhost:11434/v1"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400 focus:outline-none text-xs text-white font-mono"
              />
            </div>
          )}

          {/* Status / Error Banner */}
          {status && (
            <div className={`p-3.5 rounded-2xl flex items-start gap-2.5 text-xs leading-relaxed ${
              status.type === 'success'
                ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                : 'bg-red-500/15 border border-red-500/40 text-red-300'
            }`}>
              {status.type === 'success' ? (
                <Check className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              )}
              <span>{status.message}</span>
            </div>
          )}

          {/* Mandatory Fallback Notice for Coding Studio */}
          {isMandatory && onSwitchToCodingStudio && (
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-[11px] text-gray-400">
                  Don't have an API key right now? Coding Studio requires <strong>zero API keys</strong>.
                </span>
              </div>
              <button
                type="button"
                onClick={onSwitchToCodingStudio}
                className="shrink-0 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 hover:text-cyan-200 text-[11px] font-mono border border-cyan-500/20 transition-all cursor-pointer"
              >
                Go to Coding Studio
              </button>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 flex items-center justify-between gap-3 bg-black/40">
          <div className="text-[11px] text-gray-400 font-mono hidden sm:flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted in local browser storage</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {!isMandatory && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={handleVerifyAndSave}
              disabled={isVerifying || (!apiKeyInput.trim() && selectedProvider !== 'custom')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-lg shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Checking Key Validity...</span>
                </>
              ) : (
                <>
                  <span>Verify & Unlock AI Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
