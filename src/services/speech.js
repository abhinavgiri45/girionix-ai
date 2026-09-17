/**
 * Next-Gen Human-Grade Speech Recognition and Natural Neural Synthesis Service for Girionix AI
 * Envisioned & Engineered by Abhinav Giri (@abhinavgiri45)
 * 
 * Key Highlights:
 * - Single Persistent Self-Healing SpeechRecognition Engine (Eliminates "already started" / abort crashes)
 * - Safe Utterance Anchoring to prevent Chromium V8 SpeechSynthesis GC drop
 * - Priority Neural & Natural Voice Selection (Microsoft Online Natural, High-Precision Neural, Apple Siri/Enhanced)
 * - Human Conversational Silence Timing (~1200ms) for natural, unhurried human dialogue
 * - Hands-Free Infinite Turn-Taking: Dialogue seamlessly flows turn 1 -> turn 2 -> turn 100+
 * - Audio Context Analyzer for Reactive Orb Physics
 */

if (typeof window !== 'undefined') {
  window._activeSpeechUtterances = window._activeSpeechUtterances || [];
}

export const HUMAN_VOICE_PROFILES = [
  { id: 'nova', name: 'Nova (Warm & Expressive)', gender: 'female', lang: 'en-US', pitch: 1.0, rate: 1.02 },
  { id: 'atlas', name: 'Atlas (Deep & Confident)', gender: 'male', lang: 'en-US', pitch: 0.98, rate: 1.0 },
  { id: 'neerja', name: 'Neerja (Indian English / Hinglish)', gender: 'female', lang: 'en-IN', pitch: 1.0, rate: 1.02 },
  { id: 'kalpana', name: 'Kalpana (हिन्दी Hindi Natural)', gender: 'female', lang: 'hi-IN', pitch: 1.0, rate: 0.98 },
  { id: 'aura', name: 'Aura (Calm & Empathetic)', gender: 'female', lang: 'en-US', pitch: 1.02, rate: 0.96 }
];

export const VOICE_PERSONAS = [
  { 
    id: 'companion', 
    name: 'Friendly Companion', 
    icon: '✨', 
    description: 'Warm, conversational, empathetic, and witty',
    promptStyle: 'Speak warmly, naturally, and conversationally in 2-3 lively spoken sentences.' 
  },
  { 
    id: 'polymath', 
    name: 'Thoughtful Mentor', 
    icon: '🧠', 
    description: 'Intellectual, wise, concise, and structured',
    promptStyle: 'Speak like a wise mentor. Explain with crystal clarity in 2-3 spoken sentences.' 
  },
  { 
    id: 'copilot', 
    name: 'Direct Co-Pilot', 
    icon: '⚡', 
    description: 'Fast, sharp, and solution-focused',
    promptStyle: 'Be direct, super concise, and deliver solutions in 1-2 sharp spoken sentences.' 
  },
  { 
    id: 'storyteller', 
    name: 'Dynamic Storyteller', 
    icon: '🎙️', 
    description: 'Engaging, narrative-driven, and expressive',
    promptStyle: 'Speak with vivid imagination and engaging rhythm in 2-3 expressive spoken sentences.' 
  }
];

class SpeechService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.isProcessing = false;
    this.desiredListening = false;
    this.isStarting = false;
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.silenceTimer = null;
    this.restartDebounceTimer = null;
    this.watchdogTimer = null;
    this.currentLanguage = 'en-US';
    this.currentVoiceProfile = 'nova';
    this.voices = [];
    
    // Callbacks for active session
    this.activeCallbacks = null;

    // Web Audio Analyzer for reactive voice orb physics
    this.audioContext = null;
    this.analyser = null;
    this.micStream = null;
    this.audioVolume = 0;

    if (this.synth) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    try {
      this.voices = this.synth.getVoices() || [];
    } catch (_) {
      this.voices = [];
    }
  }

  setLanguage(lang) {
    this.currentLanguage = lang;
    if (this.recognition) {
      try {
        this.recognition.lang = lang === 'hi-IN' ? 'hi-IN' : lang === 'en-IN' ? 'en-IN' : 'en-US';
      } catch (_) {}
    }
  }

  setVoiceProfile(profileId) {
    this.currentVoiceProfile = profileId;
  }

  isSupported() {
    return !!(typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition));
  }

  /**
   * Initialize or Resume Microphone Stream for Real-time Audio Level Detection
   */
  async initAudioAnalyzer(onVolumeChange) {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) return;
    try {
      if (!this.audioContext) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.audioContext = new AudioCtx();
      }

      if (this.audioContext && this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      if (!this.micStream) {
        this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      }

      if (this.audioContext && this.micStream && !this.analyser) {
        const source = this.audioContext.createMediaStreamSource(this.micStream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 128;
        source.connect(this.analyser);
      }

      if (this.analyser) {
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        const checkVolume = () => {
          if (!this.isListening && !this.isSpeaking) {
            this.audioVolume = 0;
            if (onVolumeChange) onVolumeChange(0);
            return;
          }
          if (this.analyser) {
            this.analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const average = sum / dataArray.length;
            this.audioVolume = Math.min(100, Math.round((average / 100) * 100));
            if (onVolumeChange) onVolumeChange(this.audioVolume);
          }
          if (this.isListening || this.isSpeaking) {
            requestAnimationFrame(checkVolume);
          }
        };
        requestAnimationFrame(checkVolume);
      }
    } catch (e) {
      console.warn('Audio analyzer access notice:', e?.message);
    }
  }

  stopAudioAnalyzer() {
    if (this.micStream) {
      try {
        this.micStream.getTracks().forEach(t => t.stop());
      } catch (_) {}
      this.micStream = null;
      this.analyser = null;
    }
    this.audioVolume = 0;
  }

  /**
   * Start hands-free continuous adaptive listening with crash-proof lifecycle
   */
  startListening(callbacks) {
    if (typeof window === 'undefined') return;

    this.activeCallbacks = callbacks;
    const { onResult, onEnd, onError, onSpeechFinalized, lang, onVolumeChange, silenceTimeoutMs = 1200 } = callbacks;

    if (this.isListening) {
      // Already actively listening
      return;
    }

    this.desiredListening = true;
    this.isProcessing = false;
    clearTimeout(this.silenceTimer);
    clearTimeout(this.restartDebounceTimer);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (onError) onError('Speech recognition is not supported in this browser.');
      return;
    }

    const targetLang = lang || this.currentLanguage || 'en-US';
    this.currentLanguage = targetLang;

    // Clean up old recognition safely without triggering error cascades
    if (this.recognition) {
      try {
        this.recognition.onstart = null;
        this.recognition.onresult = null;
        this.recognition.onerror = null;
        this.recognition.onend = null;
        this.recognition.abort();
      } catch (_) {}
      this.recognition = null;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
      this.recognition.lang = targetLang === 'hi-IN' ? 'hi-IN' : targetLang === 'en-IN' ? 'en-IN' : 'en-US';
    } catch (e) {
      console.error('Speech recognition creation error:', e);
      if (onError) onError(e.message);
      return;
    }

    this.initAudioAnalyzer(onVolumeChange);

    let accumulatedText = '';
    let hasFinal = false;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.isStarting = false;
    };

    this.recognition.onresult = (event) => {
      if (this.isSpeaking || this.isProcessing) return;

      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = 0; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalTranscript += item[0].transcript + ' ';
          hasFinal = true;
        } else {
          interimTranscript += item[0].transcript;
        }
      }

      const currentText = (finalTranscript + interimTranscript).trim();
      if (currentText) {
        accumulatedText = currentText;
        if (onResult) {
          onResult({
            transcript: currentText,
            isFinal: hasFinal
          });
        }

        // Natural human breath pause threshold
        clearTimeout(this.silenceTimer);
        this.silenceTimer = setTimeout(() => {
          if (accumulatedText.trim() && !this.isSpeaking && !this.isProcessing) {
            const finalized = accumulatedText.trim();
            accumulatedText = '';
            hasFinal = false;
            this.isProcessing = true;
            if (onSpeechFinalized) {
              onSpeechFinalized(finalized);
            }
          }
        }, silenceTimeoutMs || 1200);
      }
    };

    this.recognition.onerror = (event) => {
      const err = event.error;
      // Normal browser idle/abort events
      if (err === 'no-speech' || err === 'aborted') {
        return;
      }
      console.warn('Speech recognition notice:', err);
      const isFatal = err === 'not-allowed' || err === 'service-not-allowed';
      if (isFatal) {
        this.desiredListening = false;
        this.isListening = false;
        this.isStarting = false;
        if (onError) onError(err);
        return;
      }

      // Recover safely on recoverable errors
      if (this.desiredListening && !this.isSpeaking && !this.isProcessing && !this.isStarting) {
        clearTimeout(this.restartDebounceTimer);
        this.restartDebounceTimer = setTimeout(() => {
          if (this.desiredListening && !this.isSpeaking && !this.isProcessing && !this.isListening) {
            this.startListening(this.activeCallbacks || callbacks);
          }
        }, 250);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.isStarting = false;

      // If user finished a spoken sentence and recognition ended, finalize immediately
      if (accumulatedText.trim() && !this.isSpeaking && !this.isProcessing) {
        clearTimeout(this.silenceTimer);
        const finalized = accumulatedText.trim();
        accumulatedText = '';
        hasFinal = false;
        this.isProcessing = true;
        if (onSpeechFinalized) {
          onSpeechFinalized(finalized);
        }
        return;
      }

      // Auto-restart for hands-free conversations if desired and idle
      if (this.desiredListening && !this.isSpeaking && !this.isProcessing) {
        clearTimeout(this.restartDebounceTimer);
        this.restartDebounceTimer = setTimeout(() => {
          if (this.desiredListening && !this.isSpeaking && !this.isProcessing && !this.isListening) {
            this.startListening(this.activeCallbacks || callbacks);
          }
        }, 150);
      } else if (onEnd) {
        onEnd();
      }
    };

    try {
      this.isStarting = true;
      this.recognition.start();
    } catch (e) {
      this.isStarting = false;
      if (this.desiredListening && !this.isSpeaking && !this.isProcessing) {
        setTimeout(() => {
          if (this.desiredListening && !this.isSpeaking && !this.isProcessing && !this.isListening) {
            try { this.recognition?.start(); } catch (_) {}
          }
        }, 300);
      }
    }
  }

  stopListening(releaseMic = true) {
    this.desiredListening = false;
    this.isListening = false;
    this.isProcessing = false;
    this.isStarting = false;
    clearTimeout(this.silenceTimer);
    clearTimeout(this.restartDebounceTimer);

    if (this.recognition) {
      try {
        this.recognition.onstart = null;
        this.recognition.onresult = null;
        this.recognition.onerror = null;
        this.recognition.onend = null;
        this.recognition.abort();
      } catch (_) {}
      this.recognition = null;
    }
    if (releaseMic) {
      this.stopAudioAnalyzer();
    }
  }

  stopSpeaking() {
    clearTimeout(this.watchdogTimer);
    if (this.synth) {
      try {
        this.synth.cancel();
        if (this.synth.resume) this.synth.resume(); // Unstick Chromium audio pipeline
      } catch (_) {}
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (typeof window !== 'undefined') {
        window._activeSpeechUtterances = [];
      }
    }
  }

  hasDevanagari(text) {
    if (!text) return false;
    return /[\u0900-\u097F]/.test(text);
  }

  naturalizeSpokenText(text, targetLang) {
    if (!text) return '';
    let t = text
      .replace(/```[\s\S]*?```/g, ' I have generated the solution for you. ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\$\$[\s\S]*?\$\$/g, ' ')
      .replace(/\$([^$\n]+)\$/g, '$1')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/^[-*+•]\s+/gm, '')
      .replace(/^\d+\.\s+/gm, '')
      .replace(/[*_~>#|]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

    const spokenReplacements = [
      [/\bDr\.\b/gi, 'Doctor '],
      [/\bMr\.\b/gi, 'Mister '],
      [/\bMrs\.\b/gi, 'Missus '],
      [/\bMs\.\b/gi, 'Miss '],
      [/\bProf\.\b/gi, 'Professor '],
      [/\bvs\.\b/gi, 'versus '],
      [/\bapprox\.\b/gi, 'approximately '],
      [/\bi\.e\.\b/gi, 'that is, '],
      [/\be\.g\.\b/gi, 'for example, '],
      [/\betc\.\b/gi, 'and so on'],
      [/\bAI\b/g, 'A I'],
      [/\bUI\b/g, 'U I'],
      [/\bAPI\b/g, 'A P I'],
      [/\b8K\b/gi, 'eight K'],
      [/\b4K\b/gi, 'four K'],
      [/\b60 FPS\b/gi, 'sixty frames per second'],
      [/\bReact 18\b/gi, 'React eighteen'],
      [/\bReact 19\b/gi, 'React nineteen'],
      [/\bAGS\b/g, 'A G S'],
      [/\bCBSE\b/g, 'C B S E'],
      [/\bUP\b/g, 'U P'],
      [/&/g, ' and '],
      [/%/g, ' percent ']
    ];

    spokenReplacements.forEach(([pattern, rep]) => {
      t = t.replace(pattern, rep);
    });

    // Human conversational breathing rhythm: replace colons, semicolons, and dashes with natural pauses
    t = t
      .replace(/[:;]/g, ', ')
      .replace(/[—–]/g, ', ')
      .replace(/\s*--\s*/g, ', ')
      .replace(/\n{2,}/g, '. ')
      .replace(/\n/g, ', ')
      .replace(/\s*,\s*,+/g, ', ')
      .replace(/\s*\.\s*\.+/g, '. ');

    if (targetLang === 'hi-IN' || this.hasDevanagari(t)) {
      t = t
        .replace(/\bGirionix AI\b/gi, 'गिरिऑनिक्स एआई')
        .replace(/\bGirionix\b/gi, 'गिरिऑनिक्स')
        .replace(/\bAbhinav Giri\b/gi, 'अभिनव गिरी')
        .replace(/\bIndia\b/gi, 'भारत');
    } else {
      t = t
        .replace(/\bGirionix AI\b/g, 'Girionix AI')
        .replace(/\bGirionix\b/g, 'Girionix');
    }

    return t.replace(/\s+/g, ' ').trim();
  }

  getBestVoice(targetLang, profileId = this.currentVoiceProfile) {
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }

    const profile = HUMAN_VOICE_PROFILES.find(p => p.id === profileId) || HUMAN_VOICE_PROFILES[0];
    const isHindi = targetLang === 'hi-IN' || profile.lang === 'hi-IN';
    const isIndianEn = targetLang === 'en-IN' || profile.lang === 'en-IN';
    // Exclude robotic legacy desktop voices (e.g. SAPI5 "Microsoft David Desktop", "Zira Desktop", eSpeak)
    const isRoboticDesktop = (name) => {
      const lower = name.toLowerCase();
      return lower.includes('desktop') || lower.includes('sapi') || lower.includes('espeak');
    };

    // 1. High-Fidelity Hindi Neural/Natural Voice Matching
    if (isHindi) {
      const topHindiKeywords = ['Natural', 'Neural', 'Google', 'Swara', 'Kalpana', 'Madhur', 'हिन्दी', 'hi-IN', 'hi_IN', 'Hindi'];
      for (const kw of topHindiKeywords) {
        const match = this.voices.find(v => (v.lang.includes('hi') || v.name.toLowerCase().includes('hindi')) && v.name.toLowerCase().includes(kw.toLowerCase()) && !isRoboticDesktop(v.name));
        if (match) return match;
      }
      const genericHindi = this.voices.find(v => (v.lang.includes('hi') || v.name.toLowerCase().includes('hindi')) && !isRoboticDesktop(v.name));
      if (genericHindi) return genericHindi;
    }

    // 2. High-Fidelity Indian English / Hinglish Voice Matching
    if (isIndianEn) {
      const topIndianKeywords = wantsMale
        ? ['Prabhat', 'Ravi', 'Google', 'Natural', 'Neural', 'India', 'en-IN']
        : ['Neerja', 'Aarti', 'Google', 'Natural', 'Neural', 'India', 'en-IN'];
      for (const kw of topIndianKeywords) {
        const match = this.voices.find(v => (v.lang === 'en-IN' || v.lang === 'en_IN' || v.name.toLowerCase().includes('india')) && v.name.toLowerCase().includes(kw.toLowerCase()) && !isRoboticDesktop(v.name));
        if (match) return match;
      }
      const genericIndian = this.voices.find(v => (v.lang === 'en-IN' || v.lang === 'en_IN' || v.name.toLowerCase().includes('india')) && !isRoboticDesktop(v.name));
      if (genericIndian) return genericIndian;
    }

    // 3. Top-Tier Human Natural & Neural English Voices (Online Natural, Google, Siri, Enhanced)
    const priorityKeywords = wantsMale
      ? [
          'Microsoft Guy Online (Natural)',
          'Microsoft Christopher Online (Natural)',
          'Microsoft Eric Online (Natural)',
          'Microsoft Roger Online (Natural)',
          'Microsoft Steffan Online (Natural)',
          'Google US English',
          'Google UK English Male',
          'Alex',
          'Daniel (Enhanced)',
          'Daniel',
          'Natural',
          'Neural'
        ]
      : [
          'Microsoft Jenny Online (Natural)',
          'Microsoft Aria Online (Natural)',
          'Microsoft Sonia Online (Natural)',
          'Microsoft Michelle Online (Natural)',
          'Google US English',
          'Google UK English Female',
          'Samantha (Enhanced)',
          'Samantha',
          'Siri',
          'Karen (Enhanced)',
          'Moira (Enhanced)',
          'Natural',
          'Neural'
        ];

    for (const keyword of priorityKeywords) {
      const matched = this.voices.find(v => v.name.toLowerCase().includes(keyword.toLowerCase()) && v.lang.startsWith('en') && !isRoboticDesktop(v.name));
      if (matched) return matched;
    }

    // Filter for any high-quality natural/neural voice before standard robotic voices
    const neuralFallback = this.voices.find(v => (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Enhanced') || v.name.includes('Google')) && v.lang.startsWith('en') && !isRoboticDesktop(v.name));
    if (neuralFallback) return neuralFallback;

    // Filter non-robotic English voices
    const naturalEn = this.voices.find(v => v.lang.startsWith('en') && !isRoboticDesktop(v.name));
    if (naturalEn) return naturalEn;

    return this.voices.find(v => v.lang.startsWith('en')) || this.voices[0] || null;
  }

  /**
   * High-Fidelity Human-Cadence Text-to-Speech with Watchdog Guarantee
   */
  speak(text, onEnd = null, speedMultiplier = 1.0, customLang = null, voiceProfileId = null) {
    if (!this.synth || !text) {
      if (onEnd) onEnd();
      return;
    }

    this.stopSpeaking();
    this.isSpeaking = true;
    this.isProcessing = false;

    // Unstick Chromium synthesis thread if paused
    try {
      if (this.synth.paused) this.synth.resume();
    } catch (_) {}

    const isHindi = this.hasDevanagari(text);
    const targetLang = customLang || (isHindi ? 'hi-IN' : (this.currentLanguage === 'en-IN' ? 'en-IN' : 'en-US'));
    const spokenText = this.naturalizeSpokenText(text, targetLang);

    if (!spokenText) {
      this.isSpeaking = false;
      if (onEnd) onEnd();
      return;
    }

    const profileId = voiceProfileId || this.currentVoiceProfile || 'nova';
    const profile = HUMAN_VOICE_PROFILES.find(p => p.id === profileId) || HUMAN_VOICE_PROFILES[0];

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.rate = Math.max(0.85, Math.min(1.25, (profile.rate || 1.02) * speedMultiplier));
    utterance.pitch = profile.pitch || 1.0;
    utterance.lang = targetLang;

    const matchedVoice = this.getBestVoice(targetLang, profileId);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    let ended = false;
    const handleFinished = () => {
      if (ended) return;
      ended = true;
      clearTimeout(this.watchdogTimer);
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (typeof window !== 'undefined') {
        window._activeSpeechUtterances = window._activeSpeechUtterances.filter(u => u !== utterance);
      }
      // 150ms acoustic cooldown so speaker audio doesn't re-trigger microphone
      setTimeout(() => {
        if (onEnd) onEnd();
      }, 150);
    };

    utterance.onend = handleFinished;
    utterance.onerror = (e) => {
      console.warn('Speech synthesis notice:', e);
      handleFinished();
    };

    // Store in global array to prevent Chromium GC drop
    if (typeof window !== 'undefined') {
      window._activeSpeechUtterances.push(utterance);
    }
    this.currentUtterance = utterance;

    // Accurate Watchdog Timer: calculated safely for long-form essays and speeches
    const words = spokenText.split(' ').length;
    const estimatedDurationMs = Math.max(4000, (words / 1.6) * 1000 + 10000);
    this.watchdogTimer = setTimeout(handleFinished, estimatedDurationMs);

    try {
      this.synth.speak(utterance);
      // Extra safeguard: resume after speak to prevent Chrome queue freeze
      if (this.synth.paused) this.synth.resume();
    } catch (err) {
      console.error('Speech speak failed:', err);
      handleFinished();
    }
  }
}

export const speech = new SpeechService();
