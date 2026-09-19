import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Settings2,
  RefreshCw,
  Sliders,
  Check,
  Zap,
  Hand,
  Globe
} from 'lucide-react';
import { speech, HUMAN_VOICE_PROFILES, VOICE_PERSONAS } from '../../services/speech';
import { voiceAiEngine } from '../../services/voiceAiEngine';
import { storage } from '../../services/storage';

export default function VoiceOrbModal({ isOpen, onClose, onExportToChat }) {
  const [connectionStatus, setConnectionStatus] = useState('listening'); // 'listening' | 'thinking' | 'speaking' | 'ready'
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [voiceLang, setVoiceLang] = useState('en-US'); // 'en-US' | 'en-IN' | 'hi-IN'
  const [voiceProfile, setVoiceProfile] = useState('nova');
  const [voicePersona, setVoicePersona] = useState('companion');
  const [voiceSpeed, setVoiceSpeed] = useState(1.02);
  const [silenceMode, setSilenceMode] = useState(1200); // 1200ms natural human silence threshold
  const [showSettings, setShowSettings] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0);
  const [chatTurns, setChatTurns] = useState([]); // [{ role: 'user'|'assistant', text: string }]

  const isMountedRef = useRef(true);
  const abortControllerRef = useRef(null);
  const isSessionActiveRef = useRef(false);

  // Stop session
  const stopSession = useCallback(() => {
    isSessionActiveRef.current = false;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    speech.stopListening();
    speech.stopSpeaking();
    setAudioVolume(0);
    setConnectionStatus('ready');
  }, []);

  // Continuous listening turn-taker
  const startListeningTurn = useCallback((targetLang = voiceLang) => {
    if (!isOpen || !isMountedRef.current) return;

    isSessionActiveRef.current = true;
    speech.stopSpeaking();
    setConnectionStatus('listening');
    setTranscript('');

    speech.startListening({
      lang: targetLang,
      silenceTimeoutMs: silenceMode,
      onVolumeChange: (vol) => {
        if (isMountedRef.current) setAudioVolume(vol);
      },
      onResult: ({ transcript: text }) => {
        if (isMountedRef.current) {
          setTranscript(text);
        }
      },
      onSpeechFinalized: (finalText) => {
        if (isMountedRef.current && finalText.trim()) {
          processSpokenPrompt(finalText.trim(), targetLang);
        }
      },
      onError: (err) => {
        console.warn('Speech recognition status:', err);
        if (err === 'not-allowed' || err === 'service-not-allowed') {
          if (isMountedRef.current) {
            setTranscript('Microphone access blocked. Please enable microphone permissions in your browser.');
            setConnectionStatus('ready');
          }
        }
      },
      onEnd: () => {
        // SpeechService handles automatic continuous restart internally
      }
    });
  }, [isOpen, voiceLang, silenceMode]);

  // Process speech prompt with Voice AI Engine
  const processSpokenPrompt = async (userPrompt, currentLang) => {
    if (!userPrompt || !isMountedRef.current) return;

    // Clean and strip punctuation
    const cleanCmd = userPrompt
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'।]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // 1. Stop / Pause
    if (
      cleanCmd === 'stop' || 
      cleanCmd === 'pause' || 
      cleanCmd === 'be quiet' || 
      cleanCmd === 'chup ho jao' || 
      cleanCmd === 'chup raho' || 
      cleanCmd === 'ruko'
    ) {
      stopSession();
      setAiResponse('Session paused. Tap the mic or orb when you are ready to talk.');
      speech.speak('Paused.');
      return;
    }

    // 2. Clear Session / Clear Chat
    if (
      cleanCmd === 'clear chat' || 
      cleanCmd === 'clear session' || 
      cleanCmd === 'clear conversation' || 
      cleanCmd === 'reset' || 
      cleanCmd === 'chat saaf karo'
    ) {
      setChatTurns([]);
      setTranscript('');
      setAiResponse('Conversation cleared.');
      speech.speak('Conversation cleared.', () => {
        if (isMountedRef.current && isSessionActiveRef.current) {
          startListeningTurn(currentLang);
        }
      }, voiceSpeed, currentLang, voiceProfile);
      return;
    }

    // 3. Switch Language to Hindi
    if (
      cleanCmd === 'switch to hindi' || 
      cleanCmd === 'hindi me bolo' || 
      cleanCmd === 'hindi mein baat karo'
    ) {
      setVoiceLang('hi-IN');
      storage.setVoiceLanguage('hi-IN');
      setTranscript('');
      setAiResponse('ज़रूर, अब हम हिंदी में बात करेंगे। आप क्या जानना चाहते हैं?');
      speech.speak('ज़रूर, अब हम हिंदी में बात करेंगे। आप क्या जानना चाहते हैं?', () => {
        if (isMountedRef.current && isSessionActiveRef.current) {
          startListeningTurn('hi-IN');
        }
      }, voiceSpeed, 'hi-IN', voiceProfile);
      return;
    }

    // 4. Switch Language to English
    if (
      cleanCmd === 'switch to english' || 
      cleanCmd === 'speak in english'
    ) {
      setVoiceLang('en-US');
      storage.setVoiceLanguage('en-US');
      setTranscript('');
      setAiResponse('Switched to English. What would you like to explore?');
      speech.speak('Switched to English. What would you like to explore?', () => {
        if (isMountedRef.current && isSessionActiveRef.current) {
          startListeningTurn('en-US');
        }
      }, voiceSpeed, 'en-US', voiceProfile);
      return;
    }

    // 5. Close / Exit Voice Mode
    if (
      cleanCmd === 'close' || 
      cleanCmd === 'exit' || 
      cleanCmd === 'exit voice' || 
      cleanCmd === 'close voice orb' || 
      cleanCmd === 'goodbye' || 
      cleanCmd === 'bye bye'
    ) {
      stopSession();
      if (onClose) onClose();
      return;
    }

    // Keep mic stream alive during AI thinking/speaking turn
    speech.stopListening(false);
    setConnectionStatus('thinking');
    setTranscript(userPrompt);

    const updatedTurns = [...chatTurns, { role: 'user', text: userPrompt }];
    setChatTurns(updatedTurns);

    abortControllerRef.current = new AbortController();

    try {
      // Generate ultra-fast dynamic spoken AI response (<250ms)
      const reply = await voiceAiEngine.generateVoiceResponse({
        prompt: userPrompt,
        lang: currentLang,
        chatTurns: updatedTurns,
        persona: voicePersona,
        signal: abortControllerRef.current.signal
      });

      if (!isMountedRef.current) return;

      const cleanReply = voiceAiEngine.cleanSpokenText(reply);
      setTranscript('');
      setAiResponse(cleanReply);
      setConnectionStatus('speaking');

      // Update turns with assistant response
      const turnsWithAssistant = [...updatedTurns, { role: 'assistant', text: cleanReply }];
      setChatTurns(turnsWithAssistant);

      // Determine language-appropriate voice profile
      const effectiveProfile = (currentLang === 'hi-IN' && voiceProfile !== 'kalpana' && voiceProfile !== 'madhur') 
        ? 'kalpana' 
        : (currentLang === 'en-IN' && voiceProfile !== 'neerja' && voiceProfile !== 'ravi') 
        ? 'neerja' 
        : voiceProfile;

      // Play human speech
      speech.speak(
        cleanReply,
        () => {
          // Callback when AI finishes speaking -> IMMEDIATELY resume listening for next turn!
          if (isMountedRef.current && isSessionActiveRef.current) {
            startListeningTurn(currentLang);
          }
        },
        voiceSpeed,
        currentLang,
        effectiveProfile
      );
    } catch (err) {
      console.warn('Voice AI processing error:', err);
      if (!isMountedRef.current) return;

      const fallbackMsg = voiceAiEngine.generateDynamicVoiceFallback(userPrompt, currentLang, updatedTurns);
      setAiResponse(fallbackMsg);
      setConnectionStatus('speaking');

      const effectiveProfile = (currentLang === 'hi-IN' && voiceProfile !== 'kalpana' && voiceProfile !== 'madhur') 
        ? 'kalpana' 
        : (currentLang === 'en-IN' && voiceProfile !== 'neerja' && voiceProfile !== 'ravi') 
        ? 'neerja' 
        : voiceProfile;

      speech.speak(
        fallbackMsg,
        () => {
          if (isMountedRef.current && isSessionActiveRef.current) {
            startListeningTurn(currentLang);
          }
        },
        voiceSpeed,
        currentLang,
        effectiveProfile
      );
    }
  };

  // Instant Interrupt / Barge-In
  const handleInterrupt = () => {
    if (connectionStatus === 'speaking') {
      speech.stopSpeaking();
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    startListeningTurn(voiceLang);
  };

  // Lifecycle
  useEffect(() => {
    isMountedRef.current = true;
    if (isOpen) {
      speech.setVoiceProfile(voiceProfile);
      speech.setLanguage(voiceLang);
      const timer = setTimeout(() => {
        startListeningTurn(voiceLang);
      }, 100);
      return () => {
        clearTimeout(timer);
        stopSession();
      };
    } else {
      stopSession();
    }
    return () => {
      isMountedRef.current = false;
      stopSession();
    };
  }, [isOpen, voiceLang, voiceProfile, startListeningTurn, stopSession]);

  const handleLanguageSwitch = (langId) => {
    setVoiceLang(langId);
    storage.setVoiceLanguage(langId);
    speech.setLanguage(langId);

    let targetProfile = voiceProfile;
    if (langId === 'hi-IN') targetProfile = 'kalpana';
    else if (langId === 'en-IN') targetProfile = 'neerja';
    else if (langId === 'en-US' && (voiceProfile === 'kalpana' || voiceProfile === 'neerja' || voiceProfile === 'madhur' || voiceProfile === 'ravi')) {
      targetProfile = 'nova';
    }

    setVoiceProfile(targetProfile);
    speech.setVoiceProfile(targetProfile);
    startListeningTurn(langId);
  };

  const handleClearHistory = () => {
    setChatTurns([]);
    setTranscript('');
    setAiResponse('');
    startListeningTurn(voiceLang);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-2xl animate-fadeIn select-none"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md rounded-[38px] bg-[#070914] border border-cyan-500/40 p-5 sm:p-7 flex flex-col items-center justify-between min-h-[560px] max-h-[92dvh] shadow-2xl relative shadow-glow-cyan overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dynamic Multi-Color Ambient Backlight Glow */}
        <div className={`absolute -top-24 -left-24 w-60 h-60 rounded-full blur-3xl opacity-30 transition-all duration-700 pointer-events-none ${
          connectionStatus === 'speaking' 
            ? 'bg-purple-600 scale-150 opacity-60' 
            : connectionStatus === 'listening' 
            ? 'bg-cyan-500 scale-125 opacity-50' 
            : connectionStatus === 'thinking'
            ? 'bg-amber-500 scale-125 opacity-50'
            : 'bg-blue-600'
        }`} />

        <div className={`absolute -bottom-24 -right-24 w-60 h-60 rounded-full blur-3xl opacity-30 transition-all duration-700 pointer-events-none ${
          connectionStatus === 'speaking' 
            ? 'bg-rose-500 scale-150 opacity-60' 
            : connectionStatus === 'listening' 
            ? 'bg-teal-500 scale-125 opacity-50' 
            : connectionStatus === 'thinking'
            ? 'bg-orange-500 scale-125 opacity-50'
            : 'bg-indigo-600'
        }`} />

        {/* Top Header: Live Status Badge & Quick Controls */}
        <div className="w-full flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border transition-all ${
              connectionStatus === 'listening'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-glow-cyan'
                : connectionStatus === 'thinking'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                : connectionStatus === 'speaking'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-glow-purple'
                : 'bg-white/5 text-gray-400 border-white/10'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                connectionStatus === 'listening' 
                  ? 'bg-cyan-400 animate-ping' 
                  : connectionStatus === 'speaking' 
                  ? 'bg-purple-400 animate-pulse' 
                  : connectionStatus === 'thinking'
                  ? 'bg-amber-400 animate-bounce'
                  : 'bg-emerald-400'
              }`} />
              <span className="font-bold">
                {connectionStatus === 'listening' ? 'Listening...' : connectionStatus === 'thinking' ? 'Reasoning...' : connectionStatus === 'speaking' ? 'Speaking...' : 'Ready'}
              </span>
            </span>

            {/* Tap to Interrupt Button when AI is speaking */}
            {connectionStatus === 'speaking' && (
              <button
                onClick={handleInterrupt}
                className="px-2.5 py-1 rounded-full bg-rose-500/25 hover:bg-rose-500/35 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold animate-pulse flex items-center gap-1 cursor-pointer transition-all"
                title="Tap to speak now (Interrupts current audio)"
              >
                <Hand className="w-3 h-3 text-rose-400" />
                <span>Interrupt</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-2xl border transition-all cursor-pointer ${
                showSettings ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
              }`}
              title="Voice & Persona Settings"
            >
              <Settings2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title="Close Voice Mode"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Language Mode Strip */}
        <div className="w-full flex items-center justify-center gap-1.5 p-1 rounded-2xl bg-black/60 border border-white/10 relative z-10 mt-2 text-xs font-mono">
          {[
            { id: 'en-US', label: 'English', flag: '🌐' },
            { id: 'en-IN', label: 'Hinglish', flag: '🇮🇳' },
            { id: 'hi-IN', label: 'हिन्दी', flag: '🕉️' }
          ].map(l => (
            <button
              key={l.id}
              onClick={() => handleLanguageSwitch(l.id)}
              className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                voiceLang === l.id
                  ? 'bg-gradient-to-r from-cyan-500/30 to-purple-500/30 text-white font-bold border border-cyan-500/50 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <span className="text-xs">{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>

        {/* Center Reactive Organic ChatGPT-Grade Voice Orb */}
        <div className="relative flex items-center justify-center my-6 sm:my-8 z-10">
          {/* Multi-layered pulsating ethereal waves reacting to microphone volume */}
          <div 
            className={`absolute rounded-full transition-all duration-300 pointer-events-none ${
              connectionStatus === 'speaking' 
                ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-xl animate-pulse' 
                : connectionStatus === 'listening' 
                ? 'bg-gradient-to-r from-cyan-400/30 via-blue-500/30 to-indigo-500/30 blur-xl' 
                : 'bg-white/5 blur-lg'
            }`}
            style={{
              width: `${160 + (audioVolume * 1.2)}px`,
              height: `${160 + (audioVolume * 1.2)}px`,
              opacity: connectionStatus === 'listening' ? 0.6 + (audioVolume / 100) : 0.3
            }}
          />

          <div 
            className={`absolute rounded-full border border-white/20 transition-all duration-500 pointer-events-none ${
              connectionStatus === 'speaking' 
                ? 'border-purple-400/40 animate-ping' 
                : connectionStatus === 'listening' 
                ? 'border-cyan-300/30' 
                : 'border-white/5'
            }`}
            style={{
              width: `${200 + (audioVolume * 1.5)}px`,
              height: `${200 + (audioVolume * 1.5)}px`,
              opacity: connectionStatus === 'listening' ? 0.35 + (audioVolume / 140) : 0.15
            }}
          />

          {/* Core Interactive Glowing ChatGPT-Style Fluid Morphing Sphere */}
          <div 
            onClick={connectionStatus === 'speaking' ? handleInterrupt : () => startListeningTurn(voiceLang)}
            className={`w-36 h-36 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 shadow-2xl relative select-none overflow-hidden ${
              connectionStatus === 'speaking'
                ? 'shadow-[0_0_60px_rgba(168,85,247,0.6)] scale-110'
                : connectionStatus === 'listening'
                ? 'shadow-[0_0_60px_rgba(56,189,248,0.6)] scale-105'
                : connectionStatus === 'thinking'
                ? 'shadow-[0_0_60px_rgba(245,158,11,0.6)] animate-pulse'
                : 'shadow-[0_0_40px_rgba(255,255,255,0.2)] border border-white/20 hover:scale-105'
            }`}
            style={{
              background: connectionStatus === 'speaking'
                ? 'radial-gradient(circle at 35% 30%, #ffffff 0%, #f472b6 25%, #a855f7 60%, #4c1d95 100%)'
                : connectionStatus === 'listening'
                ? 'radial-gradient(circle at 30% 30%, #ffffff 0%, #a5f3fc 20%, #38bdf8 50%, #1e40af 85%, #0f172a 100%)'
                : connectionStatus === 'thinking'
                ? 'radial-gradient(circle at 30% 30%, #ffffff 0%, #fed7aa 25%, #f97316 60%, #9a3412 100%)'
                : 'radial-gradient(circle at 30% 30%, #ffffff 0%, #cbd5e1 30%, #475569 70%, #0f172a 100%)',
              transform: connectionStatus === 'listening' ? `scale(${1 + (audioVolume * 0.003)})` : undefined
            }}
          >
            {/* Fluid inner highlight shader */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-black/40 mix-blend-overlay pointer-events-none" />
            
            <Sparkles className={`w-10 h-10 transition-all drop-shadow-md ${
              connectionStatus === 'speaking' ? 'text-white animate-spin' : connectionStatus === 'listening' ? 'text-white animate-pulse' : connectionStatus === 'thinking' ? 'text-white' : 'text-slate-200'
            }`} />
            
            <span className="text-[10px] font-mono text-white font-extrabold mt-1.5 uppercase tracking-widest drop-shadow">
              {connectionStatus === 'speaking' ? 'Interrupt' : connectionStatus === 'listening' ? 'Listening' : connectionStatus === 'thinking' ? 'Reasoning' : 'Tap to Speak'}
            </span>
          </div>
        </div>

        {/* 12-Band Equalizer Frequency Waveform */}
        <div className="flex items-center justify-center gap-1.5 h-7 z-10 w-full max-w-[260px]">
          {[14, 28, 42, 56, 38, 22, 48, 34, 20, 36, 44, 18].map((baseH, i) => {
            const dynamicH = connectionStatus === 'listening' 
              ? Math.max(6, Math.min(32, (baseH * (audioVolume / 35)) + Math.sin(Date.now() / 150 + i) * 6))
              : connectionStatus === 'speaking' 
              ? Math.max(8, Math.min(30, baseH * 0.6 + Math.sin(Date.now() / 120 + i) * 10))
              : 4;
            return (
              <div
                key={i}
                className={`flex-1 rounded-full transition-all duration-75 ${
                  connectionStatus === 'listening'
                    ? 'bg-gradient-to-t from-cyan-500 to-teal-300'
                    : connectionStatus === 'speaking'
                    ? 'bg-gradient-to-t from-purple-500 via-pink-400 to-amber-300'
                    : 'bg-gray-700'
                }`}
                style={{ height: `${dynamicH}px` }}
              />
            );
          })}
        </div>

        {/* Real-time Spoken Transcript & AI Spoken Speech Bubble */}
        <div className="w-full space-y-2 text-center z-10 min-h-[110px] flex flex-col justify-center px-1">
          {transcript ? (
            <div className="p-3 rounded-2xl bg-cyan-950/50 border border-cyan-500/40 space-y-1 animate-fadeIn">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold flex items-center justify-center gap-1">
                <Mic className="w-3 h-3 animate-pulse" /> You:
              </span>
              <p className="text-xs font-sans text-cyan-200 font-medium leading-relaxed line-clamp-3">
                "{transcript}"
              </p>
            </div>
          ) : aiResponse ? (
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1 max-h-28 overflow-y-auto touch-scroll text-left">
              <span className="text-[10px] font-mono text-purple-300 uppercase font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" /> Girionix Voice AI:
              </span>
              <p className="text-xs font-sans text-gray-200 leading-relaxed">
                {aiResponse}
              </p>
            </div>
          ) : (
            <div className="space-y-1 text-center py-2">
              <p className="text-xs font-mono text-cyan-300 font-bold flex items-center justify-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Continuous Hands-Free Voice Active</span>
              </p>
              <p className="text-[11px] font-sans text-gray-400">
                Speak freely in {voiceLang === 'hi-IN' ? 'Hindi' : voiceLang === 'en-IN' ? 'Hinglish' : 'English'}. Girionix listens & responds continuously turn after turn.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Interactive Controls */}
        <div className="w-full flex items-center justify-between gap-3 relative z-10 pt-2 border-t border-white/10">
          <button
            onClick={handleClearHistory}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            title="Clear Voice Session Context"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Main Action: Toggle Listening Button */}
          <button
            onClick={() => {
              if (connectionStatus === 'listening') {
                speech.stopListening();
                setConnectionStatus('ready');
              } else {
                startListeningTurn(voiceLang);
              }
            }}
            className={`p-4 rounded-full transition-all shadow-2xl cursor-pointer ${
              connectionStatus === 'listening'
                ? 'bg-cyan-400 text-black shadow-glow-cyan scale-105'
                : 'bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/10'
            }`}
            title={connectionStatus === 'listening' ? 'Pause Microphone' : 'Start Listening'}
          >
            {connectionStatus === 'listening' ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </button>

          {connectionStatus === 'speaking' ? (
            <button
              onClick={handleInterrupt}
              className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 transition-all shadow-glow-rose animate-pulse flex items-center gap-1.5 text-xs font-mono font-bold cursor-pointer"
              title="Interrupt / Stop AI Speech and start talking"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Stop</span>
            </button>
          ) : aiResponse ? (
            <button
              onClick={() => {
                const effectiveProfile = (voiceLang === 'hi-IN' && voiceProfile !== 'kalpana' && voiceProfile !== 'madhur') 
                  ? 'kalpana' 
                  : (voiceLang === 'en-IN' && voiceProfile !== 'neerja' && voiceProfile !== 'ravi') 
                  ? 'neerja' 
                  : voiceProfile;
                setConnectionStatus('speaking');
                speech.speak(aiResponse, () => {
                  if (isMountedRef.current && isSessionActiveRef.current) {
                    startListeningTurn(voiceLang);
                  }
                }, voiceSpeed, voiceLang, effectiveProfile);
              }}
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 transition-colors text-xs font-mono flex items-center gap-1.5 cursor-pointer"
              title="Replay Spoken Audio"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Replay</span>
            </button>
          ) : (
            <div className="w-9" />
          )}
        </div>

        {/* Enhanced Voice Settings Modal Drawer */}
        {showSettings && (
          <div className="absolute inset-x-3 bottom-16 top-16 p-4 rounded-3xl bg-[#090C1A]/95 backdrop-blur-2xl border border-cyan-500/40 shadow-2xl z-30 space-y-4 overflow-y-auto touch-scroll animate-fadeIn text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                <span>Voice & Persona Settings</span>
              </span>
              <button onClick={() => setShowSettings(false)} className="p-1 rounded-lg text-gray-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. Conversational Persona */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-gray-400 uppercase font-bold">1. Conversational Persona:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {VOICE_PERSONAS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setVoicePersona(p.id)}
                    className={`p-2 rounded-xl text-left transition-all border cursor-pointer ${
                      voicePersona === p.id
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-white shadow-sm'
                        : 'bg-black/50 border-white/5 text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center gap-1">
                      <span>{p.icon}</span>
                      <span>{p.name}</span>
                    </div>
                    <div className="text-[9px] text-gray-400 font-sans mt-0.5 leading-tight">{p.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Neural Voice Profile */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-gray-400 uppercase font-bold">2. Natural Voiceprint:</span>
              <div className="space-y-1">
                {HUMAN_VOICE_PROFILES.map(vp => (
                  <button
                    key={vp.id}
                    onClick={() => {
                      setVoiceProfile(vp.id);
                      speech.setVoiceProfile(vp.id);
                    }}
                    className={`w-full p-2 rounded-xl text-left transition-all flex items-center justify-between border cursor-pointer ${
                      voiceProfile === vp.id
                        ? 'bg-purple-500/20 border-purple-500/50 text-purple-200 font-bold'
                        : 'bg-black/40 border-white/5 text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <span className="text-xs font-mono">{vp.name}</span>
                    {voiceProfile === vp.id && <Check className="w-3.5 h-3.5 text-purple-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Speaking Speed & Cadence Slider */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-mono text-gray-300">
                <span>Speaking Rate ({voiceSpeed.toFixed(2)}x)</span>
                <span className="text-cyan-400 font-bold">{voiceSpeed < 1.0 ? 'Relaxed' : voiceSpeed > 1.1 ? 'Energetic' : 'Natural'}</span>
              </div>
              <input
                type="range"
                min="0.85"
                max="1.30"
                step="0.05"
                value={voiceSpeed}
                onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
