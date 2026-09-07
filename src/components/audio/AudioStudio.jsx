import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Sparkles, 
  Mic, 
  Radio, 
  Sliders, 
  Layers, 
  Activity,
  Zap,
  Check,
  RefreshCw,
  Cpu,
  Crown,
  Upload,
  FileDown
} from 'lucide-react';
import { cinematicAudio } from '../../services/CinematicAudioEngine';

export default function AudioStudio({ activeModel, isTitanMode = false }) {
  const [activeSubTab, setActiveSubTab] = useState('singing'); // 'singing' | 'score' | 'voice' | 'sfx' | 'mixer'
  const [selectedScoreTheme, setSelectedScoreTheme] = useState('epic');
  const [isScorePlaying, setIsScorePlaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const [customMusicPrompt, setCustomMusicPrompt] = useState('Cinematic sci-fi orchestral soundtrack with heavy sub-bass and futuristic synth pads');
  const [isRenderingDownload, setIsRenderingDownload] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  // 5-Track Studio Stem Mixer State
  const [stems, setStems] = useState([
    { id: 'lead', name: 'Vocal Lead', icon: '🎤', vol: 85, pan: 0, mute: false, solo: false, color: 'from-pink-500 to-rose-500' },
    { id: 'strings', name: 'Symphony Strings', icon: '🎻', vol: 75, pan: -25, mute: false, solo: false, color: 'from-purple-500 to-indigo-500' },
    { id: 'synth', name: 'Cyberpunk Arp', icon: '🎹', vol: 70, pan: 25, mute: false, solo: false, color: 'from-cyan-500 to-blue-500' },
    { id: 'drums', name: '808 Sub Drums', icon: '🥁', vol: 90, pan: 0, mute: false, solo: false, color: 'from-amber-500 to-orange-500' },
    { id: 'reverb', name: 'Cosmic Reverb', icon: '🌌', vol: 60, pan: 0, mute: false, solo: false, color: 'from-emerald-500 to-teal-500' }
  ]);
  const [mixerKey, setMixerKey] = useState('C Major');
  const [mixerBpm, setMixerBpm] = useState(128);
  const [stereoWidth, setStereoWidth] = useState(120);
  const [isMixerPlaying, setIsMixerPlaying] = useState(false);

  // Singing Voice Synthesizer State
  const [singingLyrics, setSingingLyrics] = useState('Girionix AI shining like the stars tonight / Code and wisdom taking flight');
  const [selectedSinger, setSelectedSinger] = useState('aria');
  const [selectedScale, setSelectedScale] = useState('major');
  const [singingTempo, setSingingTempo] = useState(116);
  const [isSingingPlaying, setIsSingingPlaying] = useState(false);

  // Voice TTS State
  const [voiceText, setVoiceText] = useState('Welcome to Girionix AI Studio. Envisioned and engineered by Abhinav Giri to empower polymath thinkers, creators, and developers worldwide.');
  const [selectedVoice, setSelectedVoice] = useState('titan-deep');
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [voiceRate, setVoiceRate] = useState(1.0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  // Canvas visualizer
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

  const singers = [
    { id: 'aria', name: '🌸 Aria (Dream Pop Soprano)', range: 'High Range • Expressive Vibrato', desc: 'Melodic, airy female lead vocals with celestial reverb' },
    { id: 'nexus', name: '⚡ Nexus (Cyberpunk Vocoder)', range: 'Quantized • Formant Tuned', desc: 'Futuristic hyperpop / Daft Punk style autotuned vocals' },
    { id: 'leo', name: '🎸 Leo (Acoustic Indie Tenor)', range: 'Mid-Low Range • Warm Harmonics', desc: 'Soulful indie acoustic singer-songwriter vocals' },
    { id: 'sur', name: '🪕 Sur (Indian Classical Gayaki)', range: 'Microtonal • Meend Glissando', desc: 'Expressive Indian classical vocals with melodic slides' }
  ];

  const scales = [
    { id: 'major', name: '✨ C Major (Uplifting & Bright)' },
    { id: 'minor', name: '🌙 A Minor (Emotional & Deep)' },
    { id: 'cyber', name: '⚡ D Dorian (Futuristic Synthwave)' },
    { id: 'raga', name: '🪷 Raag Bhairavi (Soulful Classical)' }
  ];

  const scoreThemes = [
    { id: 'epic', name: '🎻 Epic Hollywood Orchestra', bpm: '110 BPM', mood: 'Heroic & Grand', desc: 'Sub-bass drones, brass swells, and cinematic Taiko drum pulses' },
    { id: 'cyberpunk', name: '⚡ Cyberpunk Synthwave', bpm: '128 BPM', mood: 'Futuristic & Intense', desc: '80s analog arpeggiators, filtered saw bass, and neon pads' },
    { id: 'ambient', name: '🎹 Ethereal Ambient Piano', bpm: '72 BPM', mood: 'Dreamy & Calm', desc: 'Lush reverb chords, celestial sine waves, and floating textures' },
    { id: 'suspense', name: '🥁 Dark Suspense 808 Trap', bpm: '140 BPM', mood: 'Tense & Heavy', desc: 'Deep 808 sub-bass glides, sharp ticks, and ominous minor chords' }
  ];

  const voiceOptions = [
    { id: 'titan-deep', name: '⚡ Titan Deep Baritone (Male)', gender: 'Male', accent: 'Deep & Authoritative', pitch: 0.85, rate: 0.95 },
    { id: 'aurora-warm', name: '✨ Aurora Studio Warm (Female)', gender: 'Female', accent: 'Inspiring & Melodic', pitch: 1.1, rate: 1.0 },
    { id: 'nova-ai', name: '🤖 Nova Cybernetic Core', gender: 'Neural', accent: 'Precise & Crisp', pitch: 1.0, rate: 1.05 },
    { id: 'bharat-narrator', name: '🇮🇳 Bharat Bilingual Narrator', gender: 'Polymath', accent: 'English & Hindi Fluent', pitch: 0.95, rate: 1.0 }
  ];

  const sfxPresets = [
    { name: '💥 Cinematic Sub-Boom Impact', type: 'impact', freq: 45, duration: 2.5 },
    { name: '⚡ Cyber Laser Beam Pulse', type: 'laser', freq: 1200, duration: 0.4 },
    { name: '🔮 Sci-Fi Hologram UI Chirp', type: 'ui', freq: 880, duration: 0.25 },
    { name: '🌊 Sub-Bass Drop Glissando', type: 'bassdrop', freq: 180, duration: 3.0 },
    { name: '🛡️ Energy Shield Activation', type: 'shield', freq: 440, duration: 1.2 }
  ];

  // Visualizer Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let phase = 0;
    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 600);
      const height = (canvas.height = 140);

      ctx.fillStyle = '#060812';
      ctx.fillRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let y = 20; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const isAudioActive = isScorePlaying || isSpeaking || isSingingPlaying;
      const barCount = 48;
      const barWidth = (width / barCount) - 3;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + 3);
        const baseHeight = isAudioActive 
          ? Math.sin(phase + i * 0.25) * 45 + Math.cos(phase * 1.5 + i * 0.15) * 35 + 50
          : 8 + Math.sin(phase * 0.3 + i * 0.1) * 4;

        const clampedH = Math.max(4, Math.min(height - 20, baseHeight));
        const y = height - clampedH - 10;

        // Gradient
        const grad = ctx.createLinearGradient(0, y, 0, height);
        if (activeSubTab === 'singing') {
          grad.addColorStop(0, '#EC4899');
          grad.addColorStop(1, '#8B5CF6');
        } else if (selectedScoreTheme === 'cyberpunk') {
          grad.addColorStop(0, '#00F0FF');
          grad.addColorStop(1, '#FF0055');
        } else if (selectedScoreTheme === 'ambient') {
          grad.addColorStop(0, '#A855F7');
          grad.addColorStop(1, '#06B6D4');
        } else if (selectedScoreTheme === 'suspense') {
          grad.addColorStop(0, '#EF4444');
          grad.addColorStop(1, '#78350F');
        } else {
          grad.addColorStop(0, '#00FFAA');
          grad.addColorStop(1, '#0284C7');
        }

        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth, clampedH);

        // Cap highlight
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x, y - 2, barWidth, 2);
      }

      phase += isAudioActive ? 0.08 : 0.02;
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isScorePlaying, isSpeaking, isSingingPlaying, selectedScoreTheme, activeSubTab]);

  const handleToggleScore = () => {
    if (isScorePlaying) {
      cinematicAudio.stop();
      setIsScorePlaying(false);
    } else {
      cinematicAudio.playCinematicScore(selectedScoreTheme);
      cinematicAudio.setVolume(volume / 100);
      setIsScorePlaying(true);
    }
  };

  const handleScoreThemeSelect = (themeId) => {
    setSelectedScoreTheme(themeId);
    if (isScorePlaying) {
      cinematicAudio.playCinematicScore(themeId);
    }
  };

  // Toggle Singing Performance
  const handleToggleSinging = () => {
    if (isSingingPlaying) {
      cinematicAudio.stop();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsSingingPlaying(false);
    } else {
      cinematicAudio.playSingingTrack({
        lyrics: singingLyrics,
        singer: selectedSinger,
        scale: selectedScale,
        tempo: singingTempo
      });
      setIsSingingPlaying(true);
    }
  };

  // Download Sung Song as WAV
  const handleDownloadSingingSong = async () => {
    setIsRenderingDownload(true);
    setDownloadSuccess(null);
    try {
      const blob = await cinematicAudio.renderSingingToWav({
        lyrics: singingLyrics,
        singer: selectedSinger,
        scale: selectedScale,
        tempo: singingTempo
      });
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Girionix_Singing_${selectedSinger}_44kHz.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setDownloadSuccess('✅ Downloaded Singing Track (.wav)');
        setTimeout(() => setDownloadSuccess(null), 3500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRenderingDownload(false);
    }
  };

  // Export Theme to WAV File
  const handleDownloadScore = async (themeId, name) => {
    setIsRenderingDownload(true);
    setDownloadSuccess(null);
    try {
      const blob = await cinematicAudio.renderScoreToWav(themeId, 12);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Girionix_Audio_${themeId}_44kHz.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setDownloadSuccess(`✅ Downloaded ${name} (.wav)`);
        setTimeout(() => setDownloadSuccess(null), 3500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRenderingDownload(false);
    }
  };

  // Browser Speech Synthesis for TTS
  const handleSpeakText = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(voiceText);
    utterance.pitch = voicePitch;
    utterance.rate = voiceRate;
    utterance.lang = selectedLanguage === 'hi' ? 'hi-IN' : 'en-US';

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (selectedVoice === 'aurora-warm') {
        const female = voices.find(v => /female|zira|samantha|victoria|karen/i.test(v.name));
        if (female) utterance.voice = female;
      } else if (selectedVoice === 'titan-deep') {
        const male = voices.find(v => /david|male|george|rishi|alex/i.test(v.name));
        if (male) utterance.voice = male;
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Procedural Web Audio SFX Trigger
  const triggerSfx = (sfx) => {
    cinematicAudio.init();
    const ctx = cinematicAudio.ctx;
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (sfx.type === 'impact') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(sfx.freq * 2, now);
      osc.frequency.exponentialRampToValueAtTime(20, now + sfx.duration);
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + sfx.duration);
    } else if (sfx.type === 'laser') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(sfx.freq, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + sfx.duration);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + sfx.duration);
    } else if (sfx.type === 'ui') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(sfx.freq, now);
      osc.frequency.setValueAtTime(sfx.freq * 1.5, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + sfx.duration);
    } else if (sfx.type === 'bassdrop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(sfx.freq, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + sfx.duration);
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.linearRampToValueAtTime(0.001, now + sfx.duration);
    } else {
      osc.type = 'square';
      osc.frequency.setValueAtTime(sfx.freq, now);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + sfx.duration);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + sfx.duration);
  };

  // Export SFX to WAV
  const handleDownloadSfx = async (sfx, e) => {
    e.stopPropagation();
    try {
      const blob = await cinematicAudio.renderSfxToWav(sfx);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Girionix_SFX_${sfx.type}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportAudioProject = () => {
    const audioProject = {
      version: '1.0.0',
      type: 'girionix_audio_project',
      exportedAt: new Date().toISOString(),
      activeSubTab,
      lyrics: singingLyrics,
      singer: selectedSinger,
      scale: selectedScale,
      tempo: singingTempo,
      scoreTheme: selectedScoreTheme,
      voiceText,
      voicePitch,
      voiceRate,
      selectedVoice,
      stems,
      mixerKey,
      mixerBpm,
      stereoWidth
    };
    const blob = new Blob([JSON.stringify(audioProject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Girionix_AudioCraft_Project_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportAudioProject = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result);
        if (data.activeSubTab) setActiveSubTab(data.activeSubTab);
        if (data.lyrics) setSingingLyrics(data.lyrics);
        if (data.singer) setSelectedSinger(data.singer);
        if (data.scale) setSelectedScale(data.scale);
        if (data.tempo) setSingingTempo(data.tempo);
        if (data.scoreTheme) setSelectedScoreTheme(data.scoreTheme);
        if (data.voiceText) setVoiceText(data.voiceText);
        if (data.voicePitch) setVoicePitch(data.voicePitch);
        if (data.voiceRate) setVoiceRate(data.voiceRate);
        if (data.selectedVoice) setSelectedVoice(data.selectedVoice);
        if (data.stems) setStems(data.stems);
        if (data.mixerKey) setMixerKey(data.mixerKey);
        if (data.mixerBpm) setMixerBpm(data.mixerBpm);
        if (data.stereoWidth) setStereoWidth(data.stereoWidth);
      } catch (err) {
        console.error('Invalid audio project JSON:', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#060812] overflow-y-auto p-4 space-y-4">
      {/* Studio Header Card */}
      <div className="p-5 rounded-3xl bg-[#080B18] border border-emerald-500/30 shadow-2xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-glow-emerald">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Girionix AudioCraft & Neural Voice Studio</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                  48kHz Master Studio
                </span>
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                {isTitanMode ? '⚡ 100% Offline Physical Web Audio Synthesizer' : '🌐 ElevenLabs V3 & Web Audio Engine'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Export & Import Buttons */}
            <button
              onClick={handleExportAudioProject}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Export AudioCraft Project (.json)"
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export</span>
            </button>

            <label className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Import</span>
              <input type="file" accept=".json" onChange={handleImportAudioProject} className="hidden" />
            </label>

            {/* Sub-Tab Navigation Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-black/60 rounded-2xl border border-white/10 flex-wrap">
            <button
              onClick={() => setActiveSubTab('singing')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                activeSubTab === 'singing' 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold shadow-glow-pink' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-pink-400" />
              <span>🎤 Neural Singer</span>
            </button>

            <button
              onClick={() => setActiveSubTab('score')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                activeSubTab === 'score' 
                  ? 'bg-emerald-500 text-black font-bold shadow-glow-emerald' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Soundtracks</span>
            </button>

            <button
              onClick={() => setActiveSubTab('voice')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                activeSubTab === 'voice' 
                  ? 'bg-cyan-500 text-black font-bold shadow-glow-cyan' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Neural Voice</span>
            </button>

            <button
              onClick={() => setActiveSubTab('sfx')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                activeSubTab === 'sfx' 
                  ? 'bg-amber-500 text-black font-bold' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Foley / SFX</span>
            </button>

            <button
              onClick={() => setActiveSubTab('mixer')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                activeSubTab === 'mixer' 
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold shadow-glow-purple' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>🎛️ Stem Mixer</span>
            </button>
          </div>
        </div>
      </div>

        {/* Real-time Audio Spectrum Visualizer */}
        <div className="relative rounded-2xl overflow-hidden border border-emerald-500/20 bg-[#060812]">
          <canvas ref={canvasRef} className="w-full h-28 block" />
          <div className="absolute top-2 right-3 flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isScorePlaying || isSpeaking || isSingingPlaying ? 'bg-pink-400' : 'bg-gray-600'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isScorePlaying || isSpeaking || isSingingPlaying ? 'bg-pink-500' : 'bg-gray-600'}`}></span>
            </span>
            <span className="text-[10px] font-mono text-pink-400">
              {isSingingPlaying ? 'VOCAL HARMONIC SYNTHESIS' : isScorePlaying ? 'LIVE SCORE STREAM' : isSpeaking ? 'VOICE SYNTHESIS' : 'SPECTRUM IDLE'}
            </span>
          </div>
        </div>
      </div>

      {/* TAB 0: AI NEURAL SINGER & VOCAL MELODY STUDIO */}
      {activeSubTab === 'singing' && (
        <div className="p-5 rounded-3xl bg-[#080B18] border border-pink-500/30 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>AI Neural Singer & Song Melodizer</span>
                <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-mono border border-pink-500/30">
                  Formant Vocal Engine
                </span>
              </h3>
              <p className="text-xs text-gray-400 pt-0.5">
                Generate singing voices with multi-note pitch contours, vibrato, and synchronized backing chords.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-400">Tempo:</span>
              <input
                type="range"
                min="80"
                max="160"
                value={singingTempo}
                onChange={(e) => setSingingTempo(Number(e.target.value))}
                className="w-20 accent-pink-400 cursor-pointer"
              />
              <span className="text-xs font-mono text-pink-400 font-bold w-12">{singingTempo} BPM</span>
            </div>
          </div>

          {/* Lyrics Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-gray-300 flex items-center justify-between">
              <span>Song Lyrics / Vocal Script:</span>
              <span className="text-[10px] text-gray-500">{singingLyrics.trim().split(/\s+/).filter(Boolean).length} words mapped to notes</span>
            </label>
            <textarea
              value={singingLyrics}
              onChange={(e) => setSingingLyrics(e.target.value)}
              rows={3}
              placeholder="Type your song lyrics here (each word will be tuned to a musical note in the melody)..."
              className="w-full p-3.5 rounded-2xl bg-black/60 border border-pink-500/30 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-pink-500 resize-none font-sans leading-relaxed shadow-inner"
            />
          </div>

          {/* 1-Click Lyric Presets */}
          <div className="flex gap-2 flex-wrap text-[11px] font-mono">
            <button
              onClick={() => setSingingLyrics('Rising high above the neon city lights / Girionix dreams ignite the darkest nights')}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-pink-500/20 text-gray-300 hover:text-pink-300 transition-colors border border-white/5"
            >
              ⚡ Cyberpunk Anthem
            </button>
            <button
              onClick={() => setSingingLyrics('Soft acoustic morning gentle summer breeze / Melody floating through the willow trees')}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-pink-500/20 text-gray-300 hover:text-pink-300 transition-colors border border-white/5"
            >
              🌸 Dream Pop Ballad
            </button>
            <button
              onClick={() => setSingingLyrics('ज्ञान और चेतना की यह अनंत धारा / हर हृदय में चमके गिरिऑनिक्स का सितारा')}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-pink-500/20 text-gray-300 hover:text-pink-300 transition-colors border border-white/5"
            >
              🪷 Classical Raag Lyric
            </button>
            <button
              onClick={() => setSingingLyrics('Zero latency and quantum speed / Autonomous intelligence is all we need')}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-pink-500/20 text-gray-300 hover:text-pink-300 transition-colors border border-white/5"
            >
              🚀 Sci-Fi Hyperpop
            </button>
          </div>

          {/* Singer Profiles */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-gray-300">Select Singer Profile:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {singers.map((s) => {
                const isSelected = selectedSinger === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSinger(s.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-pink-950/40 border-pink-500 shadow-glow-pink'
                        : 'bg-black/40 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="font-bold text-white text-xs">{s.name}</div>
                    <div className="text-[10px] text-pink-300 font-mono">{s.range}</div>
                    <div className="text-[10px] text-gray-400">{s.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Musical Scales */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-gray-300">Musical Key & Scale:</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {scales.map((sc) => {
                const isSelected = selectedScale === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => setSelectedScale(sc.id)}
                    className={`p-2.5 rounded-xl border text-xs font-mono text-left transition-all ${
                      isSelected
                        ? 'bg-purple-950/50 border-purple-400 text-purple-200 font-bold'
                        : 'bg-black/40 border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {sc.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleSinging}
                disabled={!singingLyrics.trim()}
                className={`px-6 py-3 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 shadow-lg cursor-pointer ${
                  isSingingPlaying
                    ? 'bg-rose-500 hover:bg-rose-400 text-white'
                    : 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:opacity-90 text-white font-extrabold shadow-glow-pink'
                }`}
              >
                {isSingingPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isSingingPlaying ? 'Stop Singing Voice' : 'Sing Lyrics Live with Music'}</span>
              </button>

              <button
                onClick={handleDownloadSingingSong}
                disabled={isRenderingDownload || !singingLyrics.trim()}
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-pink-500/20 text-pink-300 font-mono text-xs border border-pink-500/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isRenderingDownload ? 'Rendering 44.1kHz WAV...' : 'Export Singing WAV'}</span>
              </button>
            </div>

            {downloadSuccess && (
              <span className="text-xs font-mono text-pink-400 animate-fadeIn">
                {downloadSuccess}
              </span>
            )}
          </div>
        </div>
      )}

      {/* TAB 1: CINEMATIC SOUNDTRACK GENERATOR */}
      {activeSubTab === 'score' && (
        <div className="p-5 rounded-3xl bg-[#080B18] border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Procedural Multi-Track Soundtracks</span>
            </h3>

            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => {
                  setVolume(Number(e.target.value));
                  cinematicAudio.setVolume(Number(e.target.value) / 100);
                }}
                className="w-20 accent-emerald-400 cursor-pointer"
              />
              <span className="text-[10px] font-mono text-gray-400 w-8">{volume}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {scoreThemes.map((theme) => {
              const isSelected = selectedScoreTheme === theme.id;
              const isCurrentlyPlayingThis = isSelected && isScorePlaying;
              return (
                <div
                  key={theme.id}
                  onClick={() => handleScoreThemeSelect(theme.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 relative group ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-glow-emerald'
                      : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{theme.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-emerald-300">
                      {theme.bpm}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400">{theme.desc}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-mono text-gray-500">{theme.mood}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadScore(theme.id, theme.name);
                        }}
                        className="p-1 px-2 rounded-lg bg-white/10 hover:bg-emerald-500/20 text-emerald-300 text-[10px] font-mono flex items-center gap-1 transition-all"
                        title="Download as 44.1kHz .WAV file"
                      >
                        <Download className="w-3 h-3" />
                        <span>Export WAV</span>
                      </button>
                      <span className={`text-[10px] font-mono ${isSelected ? 'text-emerald-400 font-bold' : 'text-gray-600'}`}>
                        {isCurrentlyPlayingThis ? '● PLAYING' : isSelected ? '✓ SELECTED' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
            <button
              onClick={handleToggleScore}
              className={`px-6 py-3 rounded-2xl font-bold text-xs transition-all flex items-center gap-2 shadow-lg ${
                isScorePlaying
                  ? 'bg-rose-500 hover:bg-rose-400 text-white'
                  : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:opacity-90 text-black font-extrabold shadow-glow-emerald'
              }`}
            >
              {isScorePlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isScorePlaying ? 'Stop Soundtrack Playback' : 'Play Selected Soundtrack Live'}</span>
            </button>

            {downloadSuccess && (
              <span className="text-xs font-mono text-emerald-400 animate-fadeIn">
                {downloadSuccess}
              </span>
            )}

            <span className="text-xs font-mono text-gray-400">
              ⚡ Web Audio API 60FPS Multi-Oscillator Sound Engine
            </span>
          </div>
        </div>
      )}

      {/* TAB 2: NEURAL SPEECH SYNTHESIS */}
      {activeSubTab === 'voice' && (
        <div className="p-5 rounded-3xl bg-[#080B18] border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Mic className="w-4 h-4 text-cyan-400" />
              <span>Multi-Speaker Neural Speech Synthesis</span>
            </h3>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-400">Language:</span>
              <button
                onClick={() => setSelectedLanguage(l => l === 'en' ? 'hi' : 'en')}
                className="px-2.5 py-1 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-cyan-300 font-bold hover:bg-white/5"
              >
                {selectedLanguage === 'en' ? '🇺🇸 English (US)' : '🇮🇳 Hindi (हिन्दी)'}
              </button>
            </div>
          </div>

          <textarea
            value={voiceText}
            onChange={(e) => setVoiceText(e.target.value)}
            rows={3}
            placeholder="Type text for neural voice narration..."
            className="w-full p-3.5 rounded-2xl bg-black/60 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 resize-none font-sans leading-relaxed"
          />

          <div className="flex gap-2 flex-wrap text-[11px] font-mono">
            <button
              onClick={() => setVoiceText('In a world shaped by artificial intelligence, Girionix AI stands at the frontier of thought, creation, and exploration.')}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
            >
              🎬 Movie Trailer
            </button>
            <button
              onClick={() => setVoiceText('गिरिऑनिक्स एआई में आपका स्वागत है। सोचने, बनाने और खोजने की असीम क्षमता अब आपके हाथों में है।')}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
            >
              🇮🇳 Hindi Welcome
            </button>
            <button
              onClick={() => setVoiceText('Welcome to the developer sandbox. Here you can engineer, compile, and execute fullstack React applications in real time.')}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
            >
              💻 Dev Hook
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {voiceOptions.map((voice) => {
              const isSelected = selectedVoice === voice.id;
              return (
                <div
                  key={voice.id}
                  onClick={() => {
                    setSelectedVoice(voice.id);
                    setVoicePitch(voice.pitch);
                    setVoiceRate(voice.rate);
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/60 shadow-glow-cyan'
                      : 'bg-black/40 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="font-bold text-white text-xs truncate">{voice.name}</div>
                  <div className="text-[10px] text-gray-400">{voice.accent}</div>
                  <div className="text-[9px] font-mono text-cyan-400 pt-1">
                    {isSelected ? '✓ ACTIVE VOICE' : 'Select'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Voice Tuning Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-2xl bg-black/40 border border-white/5 text-xs font-mono">
            <div className="space-y-1">
              <div className="flex justify-between text-gray-400">
                <span>Voice Pitch:</span>
                <span className="text-white font-bold">{voicePitch.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={voicePitch}
                onChange={(e) => setVoicePitch(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-gray-400">
                <span>Speaking Rate / Speed:</span>
                <span className="text-white font-bold">{voiceRate.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.75"
                max="1.5"
                step="0.05"
                value={voiceRate}
                onChange={(e) => setVoiceRate(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSpeakText}
              disabled={!voiceText.trim()}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:opacity-90 text-black font-extrabold text-xs shadow-glow-cyan flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSpeaking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isSpeaking ? 'Stop Speaking' : 'Synthesize & Speak Live'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: PROCEDURAL FOLEY & SFX GENERATOR */}
      {activeSubTab === 'sfx' && (
        <div className="p-5 rounded-3xl bg-[#080B18] border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>1-Click Real-Time Foley & Sound Effects Synthesizer</span>
            </h3>
            <span className="text-[10px] font-mono text-gray-400">0ms Web Audio Generation • WAV Export</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sfxPresets.map((sfx, idx) => (
              <div
                key={idx}
                onClick={() => triggerSfx(sfx)}
                className="p-4 rounded-2xl bg-black/50 border border-white/10 hover:border-amber-500/50 hover:bg-amber-950/20 text-left transition-all group flex items-center justify-between cursor-pointer hover:scale-[1.02]"
              >
                <div className="space-y-1">
                  <div className="font-bold text-white text-xs group-hover:text-amber-300 transition-colors">
                    {sfx.name}
                  </div>
                  <div className="text-[10px] font-mono text-gray-400">
                    Base Freq: {sfx.freq} Hz • Length: {sfx.duration}s
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleDownloadSfx(sfx, e)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-amber-500/20 text-amber-400 transition-colors"
                    title="Download SFX .WAV file"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <div className="p-2 rounded-xl bg-white/5 group-hover:bg-amber-500/20 text-amber-400 transition-colors">
                    <Play className="w-4 h-4 fill-current" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: 5-TRACK MULTI-STEM STUDIO MIXER */}
      {activeSubTab === 'mixer' && (
        <div className="p-5 rounded-3xl bg-[#080B18] border border-purple-500/30 space-y-5 shadow-2xl">
          {/* Mixer Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-glow-purple">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>5-Track Neural Multi-Stem Console</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-extrabold">
                    {mixerBpm} BPM • {mixerKey}
                  </span>
                </h3>
                <p className="text-xs text-gray-400 font-mono">
                  Real-time Web Audio Gain Stages, Stereo Pan Fields & Master Limiter
                </p>
              </div>
            </div>

            {/* Master Transport & Export Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (isMixerPlaying) {
                    cinematicAudio.stop();
                    setIsMixerPlaying(false);
                  } else {
                    cinematicAudio.playCinematicScore(selectedScoreTheme);
                    setIsMixerPlaying(true);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 text-white font-bold text-xs shadow-glow-purple flex items-center gap-1.5 cursor-pointer"
              >
                {isMixerPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isMixerPlaying ? 'Pause Master' : 'Play Master Stems'}</span>
              </button>

              <button
                onClick={() => {
                  setStems(prev => prev.map(s => ({ ...s, vol: 80, pan: 0, mute: false, solo: false })));
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors"
                title="Reset All Faders to Unity Gain"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDownloadScore(selectedScoreTheme, 'Master_5Stem_Mix')}
                disabled={isRenderingDownload}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export Mix (.wav)</span>
              </button>
            </div>
          </div>

          {/* Master Transport Dials: Key, BPM, Stereo Width */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-black/40 border border-white/5 text-xs font-mono">
            <div className="space-y-1">
              <div className="flex justify-between text-gray-400">
                <span>Tempo / BPM:</span>
                <span className="text-amber-300 font-bold">{mixerBpm} BPM</span>
              </div>
              <input
                type="range"
                min="60"
                max="180"
                value={mixerBpm}
                onChange={(e) => setMixerBpm(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-gray-400">
                <span>Root Musical Key:</span>
                <span className="text-purple-300 font-bold">{mixerKey}</span>
              </div>
              <select
                value={mixerKey}
                onChange={(e) => setMixerKey(e.target.value)}
                className="w-full bg-black/60 text-white p-1 rounded-lg border border-white/10 focus:outline-none"
              >
                {['C Major', 'C# Minor', 'D Dorian', 'E Minor', 'F Major', 'F# Minor', 'G Major', 'A Minor', 'Bb Major'].map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-gray-400">
                <span>Stereo Width:</span>
                <span className="text-cyan-300 font-bold">{stereoWidth}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={stereoWidth}
                onChange={(e) => setStereoWidth(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          {/* 5 Vertical Channel Strips */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {stems.map((stem, idx) => {
              const isMuted = stem.mute || (stems.some(s => s.solo) && !stem.solo);

              return (
                <div
                  key={stem.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                    isMuted 
                      ? 'bg-black/30 border-white/5 opacity-50' 
                      : 'bg-black/60 border-white/10 shadow-lg ring-1 ring-white/5'
                  }`}
                >
                  {/* Channel Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-base select-none">{stem.icon}</span>
                    <span className="text-[10px] font-mono text-gray-400 font-bold">CH {idx + 1}</span>
                  </div>

                  <div>
                    <div className="font-bold text-white text-xs truncate">{stem.name}</div>
                    <div className="text-[10px] font-mono text-gray-400">
                      {isMuted ? 'MUTED' : `${stem.vol}% • Pan ${stem.pan > 0 ? `+${stem.pan}` : stem.pan}`}
                    </div>
                  </div>

                  {/* Volume Vertical Fader */}
                  <div className="h-32 flex items-center justify-center py-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={stem.mute ? 0 : stem.vol}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setStems(prev => prev.map(s => s.id === stem.id ? { ...s, vol: v, mute: false } : s));
                      }}
                      className="h-28 -rotate-90 w-28 accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  {/* Pan Control */}
                  <div className="space-y-1 pt-1 border-t border-white/5">
                    <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                      <span>L</span>
                      <span>PAN</span>
                      <span>R</span>
                    </div>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={stem.pan}
                      onChange={(e) => {
                        const p = Number(e.target.value);
                        setStems(prev => prev.map(s => s.id === stem.id ? { ...s, pan: p } : s));
                      }}
                      className="w-full accent-purple-400 cursor-pointer h-1"
                    />
                  </div>

                  {/* Mute / Solo Buttons */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      onClick={() => {
                        setStems(prev => prev.map(s => s.id === stem.id ? { ...s, mute: !s.mute } : s));
                      }}
                      className={`py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                        stem.mute
                          ? 'bg-rose-500 text-white shadow-glow-rose'
                          : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      MUTE
                    </button>

                    <button
                      onClick={() => {
                        setStems(prev => prev.map(s => s.id === stem.id ? { ...s, solo: !s.solo } : s));
                      }}
                      className={`py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                        stem.solo
                          ? 'bg-amber-400 text-black shadow-glow-amber'
                          : 'bg-white/5 text-gray-400 hover:text-white'
                      }`}
                    >
                      SOLO
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
