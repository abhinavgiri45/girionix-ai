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
  ArrowRight
} from 'lucide-react';
import { geminiStudioEngine } from '../../services/geminiStudioEngine';
import { storage } from '../../services/storage';
import { universalApiEngine } from '../../services/universalApiEngine';

export default function FreeKeyModal({ isOpen, onClose, onKeySaved }) {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error' | 'info', text: string }
  const [showKey, setShowKey] = useState(false);
  const [hasExistingKey, setHasExistingKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const existing = geminiStudioEngine.getApiKey() || storage.getApiKey() || '';
      setApiKeyInput(existing);
      setHasExistingKey(Boolean(existing));
      setStatus(null);
      setIsValidating(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerifyAndSave = async () => {
    const trimmed = (apiKeyInput || '').trim();
    if (!trimmed) {
      setStatus({ type: 'error', text: 'Please paste your Gemini API key from Google AI Studio.' });
      return;
    }

    if (!trimmed.startsWith('AIzaSy')) {
      setStatus({ 
        type: 'error', 
        text: 'Invalid key format. Google Gemini keys usually begin with "AIzaSy". Please check your copied key.' 
      });
      return;
    }

    setIsValidating(true);
    setStatus(null);

    try {
      const res = await geminiStudioEngine.verifyApiKey(trimmed);
      if (res.valid) {
        // Save to all persistence layers
        geminiStudioEngine.setApiKey(trimmed);
        storage.setApiKey(trimmed);
        universalApiEngine.saveProviderConfig({
          providerId: 'google',
          apiKey: trimmed,
          baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
          autoUpgradeEnabled: true
        });

        setStatus({ 
          type: 'success', 
          text: `Connected! ${res.label || 'Google Gemini 2.5 is now active with zero rate throttling.'}` 
        });

        if (onKeySaved) {
          onKeySaved(trimmed, 'gemini-2.5-pro');
        }

        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setStatus({ 
          type: 'error', 
          text: res.message || 'Verification failed. Please check that your key is active in Google AI Studio.' 
        });
      }
    } catch (err) {
      setStatus({ 
        type: 'error', 
        text: err.message || 'Network error while verifying key. Check your internet connection.' 
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveKey = () => {
    geminiStudioEngine.setApiKey('');
    storage.removeApiKey();
    try {
      localStorage.removeItem('girionix_gemini_api_key');
      localStorage.removeItem('girionix_custom_api_key');
    } catch (_) {}

    setApiKeyInput('');
    setHasExistingKey(false);
    setStatus({ 
      type: 'info', 
      text: 'Gemini API key removed. Switched back to Sovereign On-Device Local Core.' 
    });

    if (onKeySaved) {
      onKeySaved('', 'girionix-local-core');
    }

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-[#080B16] border border-cyan-500/30 p-6 shadow-2xl space-y-6 text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-cyan-500/20 to-transparent blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                100% FREE • NO CREDIT CARD REQUIRED
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-cyan-400" />
              <span>Connect Free Gemini API</span>
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Unlock Google's flagship <span className="text-cyan-300 font-semibold">Gemini 2.5 Pro</span> and <span className="text-cyan-300 font-semibold">Gemini 2.5 Flash</span> models with deep multi-step thinking and web grounding.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 gap-2.5 relative z-10">
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini 2.5 Pro & Flash</span>
            </div>
            <p className="text-[11px] text-gray-400">
              State-of-the-art code generation, complex math proofs, and live web research.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Direct & Secure</span>
            </div>
            <p className="text-[11px] text-gray-400">
              Key is stored only in your local browser storage. Never sent to any 3rd party servers.
            </p>
          </div>
        </div>

        {/* Step 1: External Link to Google AI Studio */}
        <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between gap-3 relative z-10">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
              Step 1: Get Your Free Key
            </span>
            <p className="text-xs text-gray-200">
              Sign in with your standard Google account and click <strong>Create API key</strong>.
            </p>
          </div>

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all shadow-lg hover:shadow-cyan-500/25 active:scale-95 cursor-pointer"
          >
            <span>Get Free Key</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Step 2: Paste Key Input */}
        <div className="space-y-2 relative z-10">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
              <span>Step 2: Paste Your API Key</span>
              <span className="text-gray-500 text-[10px]">(starts with AIzaSy...)</span>
            </label>
            {hasExistingKey && (
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Currently Connected</span>
              </span>
            )}
          </div>

          <div className="relative flex items-center">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKeyInput}
              onChange={(e) => {
                setApiKeyInput(e.target.value);
                if (status) setStatus(null);
              }}
              placeholder="AIzaSy..."
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

        {/* Status Message */}
        {status && (
          <div className={`p-3 rounded-xl flex items-start gap-2 text-xs relative z-10 ${
            status.type === 'success' 
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' 
              : status.type === 'error'
              ? 'bg-red-500/15 border border-red-500/30 text-red-300'
              : 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300'
          }`}>
            {status.type === 'success' ? (
              <Check className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            ) : status.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            ) : (
              <Zap className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
            )}
            <span className="leading-relaxed">{status.text}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10 relative z-10">
          <div>
            {hasExistingKey && (
              <button
                type="button"
                onClick={handleRemoveKey}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Disconnect Key</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleVerifyAndSave}
              disabled={isValidating || !apiKeyInput.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-lg shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
            >
              {isValidating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Key...</span>
                </>
              ) : (
                <>
                  <span>Save & Connect</span>
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
