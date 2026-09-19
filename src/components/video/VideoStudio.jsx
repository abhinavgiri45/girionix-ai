import React, { useState, useEffect, useRef } from 'react';
import { 
  Film, 
  Sparkles, 
  Play, 
  Camera, 
  Sliders, 
  RefreshCw, 
  Copy, 
  Check, 
  Maximize2, 
  Video, 
  Orbit, 
  Crown, 
  Lock, 
  Download, 
  Zap, 
  Layers, 
  Cpu,
  Music,
  Tv,
  Eye,
  Settings2,
  Clapperboard,
  SlidersHorizontal,
  Flame,
  Palette,
  Clock,
  Upload,
  FileDown,
  FolderOpen,
  Wand2,
  ImageIcon,
  History,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Move,
  Volume2,
  VolumeX,
  Key,
  Repeat
} from 'lucide-react';
import { imageGenerator, VIDEO_MODELS } from '../../services/imageGenerator';
import CinematicVideoPlayer from './CinematicVideoPlayer';

export default function VideoStudio({ activeModel, isAppInstalled = false, isTitanMode = false, onOpenDownload }) {
  // Modes: 'text' | 'image' | 'interpolate' | 'loop'
  const [generationMode, setGenerationMode] = useState('text');
  const [customPrompt, setCustomPrompt] = useState('a majestic cybernetic dragon soaring above futuristic neo-Tokyo skyscrapers at midnight with volumetric rain reflections');
  const [referenceImage, setReferenceImage] = useState(null);
  const [endFrameImage, setEndFrameImage] = useState(null);
  const [cameraMotion, setCameraMotion] = useState('Orbit 360° Counter-Clockwise');
  const [motionIntensity, setMotionIntensity] = useState(6); // 1-10
  const [engineModel, setEngineModel] = useState('nano-banana-turbo');
  const [cinematicStyle, setCinematicStyle] = useState('Hollywood Blockbuster Sci-Fi');
  const [resolution, setResolution] = useState('4k'); // '1080p' | '4k' | '8k'
  const [aspectRatio, setAspectRatio] = useState('2.39:1 Anamorphic Cinema');
  const [audioGenre, setAudioGenre] = useState('epic');
  const [includeAudio, setIncludeAudio] = useState(true);
  const [fps, setFps] = useState('60 FPS');
  const [duration, setDuration] = useState(12); // 12 | 30 | 60 | 120
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [activeVideoData, setActiveVideoData] = useState(null);
  const [showDirectorSettings, setShowDirectorSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showKeyDrawer, setShowKeyDrawer] = useState(false);
  const [bananaApiKey, setBananaApiKey] = useState(() => {
    try {
      return localStorage.getItem('girionix_banana_api_key') || '';
    } catch (_) { return ''; }
  });

  // Video Generation History from localStorage
  const [videoHistory, setVideoHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('girionix_video_history');
      return saved ? JSON.parse(saved) : [];
    } catch (_) { return []; }
  });

  const durationOptions = [
    { value: 5, label: '5s (Quick Action Clip)' },
    { value: 10, label: '10s (High-Def Cinema Shot)' },
    { value: 12, label: '12s (Director Teaser)' },
    { value: 30, label: '30s (Short Sequence)' }
  ];

  const bananaEngines = [
    { id: 'nano-banana-turbo', name: 'Nano Banana Turbo 2.5', speed: '0.8s Ultra-Fast', desc: 'Real-time multi-shot camera synthesis' },
    { id: 'nano-banana-pro', name: 'Nano Banana Pro Cinema 8K', speed: 'High Consistency', desc: 'Sub-pixel temporal morphing & 8K physics' },
    { id: 'luma-dream-motion', name: 'Luma Dream & Runway Gen-3', speed: 'Fluid Dynamics', desc: 'Anamorphic cinema optics & fluid simulation' }
  ];

  const motions = [
    { label: '🔄 Orbit 360° Counter-Clockwise', value: 'Orbit 360° Counter-Clockwise' },
    { label: '🎯 Hyper-Dolly Zoom (Vertigo)', value: 'Hyper-Dolly Zoom (Vertigo Effect)' },
    { label: '🦅 FPV Drone Dive', value: 'FPV Drone Dive (Speed Ramp)' },
    { label: '🏗️ Top-Down Crane Sweep', value: 'Top-Down Crane Sweep' },
    { label: '🔍 Rack Focus Macro Push-In', value: 'Rack Focus Macro Push-In' },
    { label: '🏎️ Low-Angle Hero Tracking', value: 'Low-Angle Hero Tracking' },
    { label: '⚡ Cyberpunk Glitch Pan', value: 'Cyberpunk Glitch Pan' }
  ];

  const styles = [
    { label: '🚀 Hollywood Blockbuster Sci-Fi', value: 'Hollywood Blockbuster Sci-Fi' },
    { label: '🎮 Hyperrealistic Unreal Engine 5.4', value: 'Hyperrealistic Unreal Engine 5.4' },
    { label: '✨ Studio Ghibli Anime Masterpiece', value: 'Studio Ghibli Anime' },
    { label: '🌆 Cyberpunk 2077 Night City', value: 'Cyberpunk 2077 Night City' },
    { label: '🦅 National Geographic 8K HDR', value: 'National Geographic 8K HDR' },
    { label: '🎬 Vintage 35mm Film Noir', value: 'Vintage 35mm Film Noir' }
  ];

  const resolutions = [
    { id: '1080p', label: '1080p' },
    { id: '4k', label: '4K UHD', default: true },
    { id: '8k', label: '8K IMAX' }
  ];

  const aspectRatios = [
    { label: '2.39:1 Cinema', value: '2.39:1 Anamorphic Cinema' },
    { label: '16:9 4K Wide', value: '16:9 4K Widescreen' },
    { label: '9:16 Vertical Reel', value: '9:16 Vertical' },
    { label: '1:1 Square', value: '1:1 Square' },
    { label: '21:9 Ultra-Wide', value: '21:9 Ultra-Wide IMAX' }
  ];

  const fpsOptions = [
    { label: '24 FPS', value: '24 FPS' },
    { label: '60 FPS', value: '60 FPS' },
    { label: '120 FPS', value: '120 FPS' }
  ];

  const audioGenres = [
    { id: 'epic', label: '🎻 Hollywood Orchestra' },
    { id: 'cyberpunk', label: '⚡ Cyberpunk Synthwave' },
    { id: 'ambient', label: '🎹 Ambient Piano' },
    { id: 'suspense', label: '🥁 808 Dark Trap' }
  ];

  const inspirationPrompts = [
    'a cybernetic samurai duel in rain-soaked Neo-Tokyo neon alleyway with volumetric steam reflections',
    'golden retriever sprinting across sunset flower meadow with cinematic slow motion tracking',
    'interstellar spaceship warping through purple black hole accretion disk with lens flare streaks',
    'ancient mythical golden dragon emerging from misty mountain sunrise in 8k IMAX'
  ];

  // Initialize with initial storyboard on mount
  useEffect(() => {
    if (!activeVideoData) {
      imageGenerator.generateVideoStoryboard({ 
        prompt: 'cybernetic neon city night cinematic', 
        audioTheme: audioGenre,
        stylePreset: cinematicStyle,
        resolution,
        fps,
        aspectRatio,
        cameraMotion,
        motionIntensity,
        engineModel
      })
        .then(storyboard => {
          storyboard.duration = duration;
          setActiveVideoData(storyboard);
        })
        .catch(() => {});
    }
  }, []);

  const saveToVideoHistory = (videoItem) => {
    try {
      const updated = [videoItem, ...videoHistory.filter(v => v.id !== videoItem.id)].slice(0, 20);
      setVideoHistory(updated);
      localStorage.setItem('girionix_video_history', JSON.stringify(updated));
    } catch (_) {}
  };

  const handleMagicEnhancePrompt = () => {
    if (!customPrompt.trim()) return;
    setIsEnhancing(true);
    setTimeout(() => {
      const clean = customPrompt.replace(/^(create a video of|make a video of|generate a video of)/i, '').trim();
      const enhanced = `${clean}, shot on 35mm anamorphic prime lens f/1.4, cinematic volumetric haze, high-dynamic-range HDR color grading, natural motion blur, photorealistic textures, 8k resolution`;
      setCustomPrompt(enhanced);
      setIsEnhancing(false);
    }, 600);
  };

  const handleGenerateScript = async () => {
    if (!customPrompt.trim() || isGenerating) return;
    setIsGenerating(true);

    try {
      const storyboard = await imageGenerator.generateVideoStoryboard({ 
        prompt: customPrompt,
        referenceImage: generationMode === 'image' ? referenceImage : null,
        audioTheme: audioGenre,
        stylePreset: cinematicStyle,
        resolution,
        fps,
        aspectRatio,
        cameraMotion
      });
      storyboard.duration = duration;
      setActiveVideoData(storyboard);

      saveToVideoHistory({
        id: `vid-${Date.now()}`,
        title: customPrompt.slice(0, 48) + '...',
        prompt: customPrompt,
        thumbnail: storyboard.shots?.[0]?.image,
        storyboard,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        resolution,
        fps
      });
    } catch (err) {
      console.error('Video generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setReferenceImage(evt.target.result);
      setGenerationMode('image');
    };
    reader.readAsDataURL(file);
  };

  const handleExportProject = () => {
    const projectData = {
      version: '1.0.0',
      type: 'girionix_video_project',
      exportedAt: new Date().toISOString(),
      prompt: customPrompt,
      cameraMotion,
      cinematicStyle,
      resolution,
      aspectRatio,
      fps,
      duration,
      audioGenre,
      videoData: activeVideoData
    };
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Girionix_MotionLab_Project_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportProject = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result);
        if (data.prompt) setCustomPrompt(data.prompt);
        if (data.cameraMotion) setCameraMotion(data.cameraMotion);
        if (data.cinematicStyle) setCinematicStyle(data.cinematicStyle);
        if (data.resolution) setResolution(data.resolution);
        if (data.aspectRatio) setAspectRatio(data.aspectRatio);
        if (data.fps) setFps(data.fps);
        if (data.duration) setDuration(data.duration);
        if (data.audioGenre) setAudioGenre(data.audioGenre);
        if (data.videoData) setActiveVideoData(data.videoData);
      } catch (err) {
        console.error('Invalid video project JSON:', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleEndFrameUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setEndFrameImage(evt.target.result);
      setGenerationMode('interpolate');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBananaKey = (key) => {
    setBananaApiKey(key);
    try {
      localStorage.setItem('girionix_banana_api_key', key);
    } catch (_) {}
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#06070D] overflow-y-auto p-3 sm:p-5 space-y-3 font-sans">
      {/* Nano Banana Video Header & Command Bar */}
      <div className="p-4 rounded-2xl bg-[#0A0D1B]/95 backdrop-blur-xl border border-amber-500/20 space-y-3 shadow-xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 w-1/2 h-10 bg-amber-500/10 blur-xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3 flex-wrap relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black shadow-glow-amber">
              <Film className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-black text-white tracking-wide flex items-center gap-1.5">
                  <span>Nano Banana Video</span>
                  <span className="text-amber-400 font-mono text-xs font-normal">(MotionLab 4K/8K)</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold">
                  🍌 Turbo 2.5 • Runway Gen-3 Continuity
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
                  {resolution.toUpperCase()} • {fps}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-mono">
                First & Last Frame Interpolation • 3D Camera Rig • Hollywood Foley Audio Sync
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Banana Engine Selector */}
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 text-xs font-mono">
              <span className="text-gray-500 text-[10px] px-1.5 hidden lg:inline">ENGINE:</span>
              <select
                value={engineModel}
                onChange={(e) => setEngineModel(e.target.value)}
                className="bg-transparent text-amber-300 font-bold text-xs focus:outline-none cursor-pointer py-0.5 px-1"
              >
                {bananaEngines.map(eng => (
                  <option key={eng.id} value={eng.id} className="bg-gray-900 text-white">
                    {eng.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Optional Engine Key Drawer Toggle */}
            <button
              onClick={() => setShowKeyDrawer(!showKeyDrawer)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                showKeyDrawer || bananaApiKey
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 border-white/10'
              }`}
              title="Configure Cloud Banana / Gemini Omni API Key (Optional)"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{bananaApiKey ? 'Key Active' : 'Key (Optional)'}</span>
            </button>

            <button
              onClick={() => setShowDirectorSettings(!showDirectorSettings)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                showDirectorSettings 
                  ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-glow-amber' 
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Camera Rig</span>
            </button>

            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1 transition-all cursor-pointer ${
                showHistory 
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
              }`}
              title="View Video Creation History"
            >
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">History ({videoHistory.length})</span>
            </button>

            <button
              onClick={handleExportProject}
              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
              title="Export MotionLab Project (.json)"
            >
              <FileDown className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <label className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Import</span>
              <input type="file" accept=".json" onChange={handleImportProject} className="hidden" />
            </label>
          </div>
        </div>

        {/* Optional Cloud Banana API Key Drawer */}
        {showKeyDrawer && (
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs font-mono animate-fadeIn">
            <div className="space-y-0.5">
              <span className="font-bold text-amber-300 flex items-center gap-1">
                <Key className="w-3.5 h-3.5" /> Banana Video Engine API Key (Optional)
              </span>
              <p className="text-[10px] text-gray-400">
                Leave blank to use sovereign built-in browser engine. Input your custom Gemini Omni / Runway key if desired.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="password"
                value={bananaApiKey}
                onChange={(e) => handleSaveBananaKey(e.target.value)}
                placeholder="Paste optional API key..."
                className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/15 text-white text-xs w-full sm:w-64 focus:outline-none focus:border-amber-400"
              />
              {bananaApiKey && (
                <button
                  onClick={() => handleSaveBananaKey('')}
                  className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-rose-400"
                  title="Remove Key"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* 4 Generation Modes Bar */}
        <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-white/10 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setGenerationMode('text')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              generationMode === 'text' ? 'bg-amber-400 text-black font-bold shadow-glow-amber' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Text to Video</span>
          </button>

          <button
            onClick={() => setGenerationMode('image')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              generationMode === 'image' ? 'bg-amber-400 text-black font-bold shadow-glow-amber' : 'text-gray-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Image to Video (First Frame)</span>
          </button>

          <button
            onClick={() => setGenerationMode('interpolate')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              generationMode === 'interpolate' ? 'bg-gradient-to-r from-amber-400 to-rose-500 text-black font-bold shadow-glow-amber' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>First + Last Frame (Interpolate)</span>
          </button>

          <button
            onClick={() => setGenerationMode('loop')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              generationMode === 'loop' ? 'bg-amber-400 text-black font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Move className="w-3.5 h-3.5" />
            <span>Extend & Loop</span>
          </button>
        </div>

        {/* First Frame Uploader (for Image-to-Video mode) */}
        {generationMode === 'image' && (
          <div className="p-3 rounded-xl bg-black/50 border border-cyan-500/30 flex items-center justify-between gap-3 text-xs font-mono animate-fadeIn">
            <div className="flex items-center gap-3">
              {referenceImage ? (
                <img src={referenceImage} alt="First Frame" className="w-14 h-14 object-cover rounded-lg border border-cyan-500/40" />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-gray-400">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}
              <div>
                <span className="text-cyan-300 font-bold block">
                  {referenceImage ? 'First Frame (Start Scene) Loaded' : 'Upload First Frame Image:'}
                </span>
                <span className="text-[10px] text-gray-400">
                  Nano Banana will animate motion starting from this exact keyframe.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 cursor-pointer transition-all">
                <span>{referenceImage ? 'Change Image' : 'Browse File...'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              {referenceImage && (
                <button
                  onClick={() => setReferenceImage(null)}
                  className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-rose-400"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* First + Last Frame Dual Interpolator (for Interpolation Mode) */}
        {generationMode === 'interpolate' && (
          <div className="p-3.5 rounded-2xl bg-black/60 border border-amber-500/30 space-y-2 text-xs font-mono animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <Repeat className="w-4 h-4" /> Banana End-Frame Interpolation Matrix
              </span>
              <span className="text-[10px] text-gray-400">
                Seamless transition between Start & End keyframes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* First Frame Slot */}
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {referenceImage ? (
                    <img src={referenceImage} alt="Start Frame" className="w-12 h-12 object-cover rounded-lg border border-amber-500/40" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <span className="text-white font-bold block text-[11px]">1. Start Frame</span>
                    <span className="text-[10px] text-gray-500">{referenceImage ? 'Attached' : 'Upload initial pose'}</span>
                  </div>
                </div>
                <label className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-[11px] cursor-pointer">
                  <span>{referenceImage ? 'Replace' : 'Upload'}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              {/* End Frame Slot */}
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {endFrameImage ? (
                    <img src={endFrameImage} alt="End Frame" className="w-12 h-12 object-cover rounded-lg border border-rose-500/40" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <span className="text-white font-bold block text-[11px]">2. End Frame</span>
                    <span className="text-[10px] text-gray-500">{endFrameImage ? 'Attached' : 'Upload final pose'}</span>
                  </div>
                </div>
                <label className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-[11px] cursor-pointer">
                  <span>{endFrameImage ? 'Replace' : 'Upload'}</span>
                  <input type="file" accept="image/*" onChange={handleEndFrameUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Clean Input & Generate Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateScript()}
              placeholder="Describe scene motion, camera action & lighting (e.g., cybernetic dragon soaring above Neo-Tokyo)..."
              className="w-full pl-9 pr-20 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-amber-500/50 shadow-inner"
            />
            <Video className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
            
            <button
              onClick={handleMagicEnhancePrompt}
              disabled={isEnhancing || !customPrompt.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg bg-white/10 hover:bg-amber-500/20 text-[10px] font-mono text-gray-300 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
              title="Enhance with Banana Optics"
            >
              <Wand2 className="w-3 h-3 text-amber-400" />
              <span>{isEnhancing ? '...' : 'Enhance'}</span>
            </button>
          </div>

          <button
            onClick={handleGenerateScript}
            disabled={isGenerating || !customPrompt.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:opacity-95 text-black font-black text-xs shadow-glow-amber transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50 active:scale-95"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                <span>Banana Rendering...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Generate Video</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Inspiration Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono scrollbar-none">
          <span className="text-gray-500 flex items-center gap-1 shrink-0">
            <Flame className="w-3 h-3 text-amber-400" /> Quick Ideas:
          </span>
          {inspirationPrompts.map((idea, idx) => (
            <button
              key={idx}
              onClick={() => setCustomPrompt(idea)}
              className="px-2 py-0.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 hover:text-white border border-white/5 whitespace-nowrap transition-colors truncate max-w-xs cursor-pointer"
            >
              "{idea}"
            </button>
          ))}
        </div>

        {/* Video History Drawer */}
        {showHistory && (
          <div className="p-3 rounded-2xl bg-black/60 border border-white/10 space-y-2 animate-fadeIn text-xs font-mono">
            <div className="flex items-center justify-between text-gray-400">
              <span>Past Video Creations ({videoHistory.length}):</span>
              {videoHistory.length > 0 && (
                <button
                  onClick={() => { setVideoHistory([]); localStorage.removeItem('girionix_video_history'); }}
                  className="text-[10px] text-rose-400 hover:text-rose-300"
                >
                  Clear History
                </button>
              )}
            </div>

            {videoHistory.length === 0 ? (
              <p className="text-[11px] text-gray-500 italic">No previous video creations saved yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {videoHistory.map(v => (
                  <div
                    key={v.id}
                    onClick={() => { setActiveVideoData(v.storyboard); setCustomPrompt(v.prompt); }}
                    className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-amber-500/40 transition-all cursor-pointer space-y-1.5 group"
                  >
                    <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                      <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Play className="w-5 h-5 text-amber-300 fill-current" />
                      </div>
                    </div>
                    <p className="text-[10px] text-white truncate font-medium">{v.title}</p>
                    <div className="flex items-center justify-between text-[9px] text-gray-500">
                      <span>{v.resolution?.toUpperCase()}</span>
                      <span>{v.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Collapsible 3D Camera Rig & Director Drawer */}
        {showDirectorSettings && (
          <div className="p-4 rounded-2xl bg-black/70 border border-amber-500/30 space-y-4 text-xs font-mono animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold text-amber-300 flex items-center gap-2">
                <Camera className="w-4 h-4" /> 3D Camera Rig & Director Optics Matrix
              </span>
              <span className="text-[10px] text-gray-400">
                Nano Banana 6-DOF Spatial Motion Vector Control
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left Column: Interactive 3D Camera Rig D-Pad */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-2 flex flex-col items-center justify-between">
                <div className="w-full flex items-center justify-between">
                  <span className="text-[11px] text-gray-300 font-bold flex items-center gap-1.5">
                    <Move className="w-3.5 h-3.5 text-amber-400" /> 3D Camera Rig D-Pad
                  </span>
                  <span className="text-[10px] text-amber-400 truncate max-w-[120px]">{cameraMotion.split(' ')[0]}</span>
                </div>

                {/* Visual D-Pad */}
                <div className="grid grid-cols-3 gap-1.5 w-44 my-2">
                  <div />
                  <button
                    type="button"
                    onClick={() => setCameraMotion('Tilt Up & Pan High')}
                    className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                      cameraMotion.includes('Tilt Up') ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-glow-amber' : 'bg-black/50 border-white/15 text-gray-300 hover:bg-white/10'
                    }`}
                    title="Tilt Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <div />

                  <button
                    type="button"
                    onClick={() => setCameraMotion('Low-Angle Hero Tracking')}
                    className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                      cameraMotion.includes('Tracking') ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-glow-amber' : 'bg-black/50 border-white/15 text-gray-300 hover:bg-white/10'
                    }`}
                    title="Pan Left"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setCameraMotion('Orbit 360° Counter-Clockwise')}
                    className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                      cameraMotion.includes('Orbit') ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-glow-amber' : 'bg-black/50 border-white/15 text-gray-300 hover:bg-white/10'
                    }`}
                    title="360° Orbit (Center)"
                  >
                    <Orbit className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setCameraMotion('Cyberpunk Glitch Pan')}
                    className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                      cameraMotion.includes('Pan') ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-glow-amber' : 'bg-black/50 border-white/15 text-gray-300 hover:bg-white/10'
                    }`}
                    title="Pan Right"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div />
                  <button
                    type="button"
                    onClick={() => setCameraMotion('Top-Down Crane Sweep')}
                    className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                      cameraMotion.includes('Crane') ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-glow-amber' : 'bg-black/50 border-white/15 text-gray-300 hover:bg-white/10'
                    }`}
                    title="Tilt Down / Crane"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <div />
                </div>

                {/* Quick 3D Motion Presets */}
                <div className="w-full flex items-center justify-center gap-1 flex-wrap pt-1 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setCameraMotion('Hyper-Dolly Zoom (Vertigo Effect)')}
                    className={`px-2 py-0.5 rounded text-[9px] border cursor-pointer ${
                      cameraMotion.includes('Dolly') ? 'bg-amber-500 text-black font-bold' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    🎯 Vertigo Dolly
                  </button>
                  <button
                    type="button"
                    onClick={() => setCameraMotion('FPV Drone Dive (Speed Ramp)')}
                    className={`px-2 py-0.5 rounded text-[9px] border cursor-pointer ${
                      cameraMotion.includes('Drone') ? 'bg-amber-500 text-black font-bold' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    🦅 FPV Drone
                  </button>
                  <button
                    type="button"
                    onClick={() => setCameraMotion('Rack Focus Macro Push-In')}
                    className={`px-2 py-0.5 rounded text-[9px] border cursor-pointer ${
                      cameraMotion.includes('Macro') ? 'bg-amber-500 text-black font-bold' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    🔍 Push-In
                  </button>
                </div>
              </div>

              {/* Center Column: Motion Intensity & Aspect Ratio */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-3 flex flex-col justify-between">
                {/* Motion Intensity Slider (1-10) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-300 font-bold flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-400" /> Motion Intensity
                    </span>
                    <span className="text-xs font-bold text-amber-400">{motionIntensity}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={motionIntensity}
                    onChange={(e) => setMotionIntensity(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer h-1.5 bg-gray-800 rounded-lg"
                  />
                  <div className="flex items-center justify-between text-[9px] text-gray-500">
                    <span>1 (Serene Sub-pixel)</span>
                    <span className="text-amber-300 font-semibold">
                      {motionIntensity <= 3 ? 'Subtle Micro-Motion' : motionIntensity <= 7 ? 'Cinematic Horizon Tracking' : 'Kinetic Speed Ramp'}
                    </span>
                    <span>10 (Action Rush)</span>
                  </div>
                </div>

                {/* Aspect Ratio Framing */}
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <span className="text-[11px] text-gray-300 font-bold block">Aspect Ratio Framing</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {aspectRatios.map(ar => (
                      <button
                        key={ar.value}
                        type="button"
                        onClick={() => setAspectRatio(ar.value)}
                        className={`py-1.5 px-2 rounded-lg text-[10px] text-left border transition-all cursor-pointer truncate ${
                          aspectRatio === ar.value
                            ? 'bg-amber-500 text-black font-bold border-amber-400'
                            : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'
                        }`}
                      >
                        {ar.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Audio Foley Sync & Cinema Specs */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-3 flex flex-col justify-between">
                {/* Audio Foley Sync */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-300 font-bold flex items-center gap-1.5">
                      <Music className="w-3.5 h-3.5 text-emerald-400" /> Foley Audio Sync
                    </span>
                    <button
                      type="button"
                      onClick={() => setIncludeAudio(!includeAudio)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        includeAudio ? 'bg-emerald-500 text-black' : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {includeAudio ? 'SYNC ON' : 'MUTED'}
                    </button>
                  </div>
                  {includeAudio && (
                    <select
                      value={audioGenre}
                      onChange={(e) => setAudioGenre(e.target.value)}
                      className="w-full bg-black/70 text-emerald-300 p-1.5 rounded text-xs border border-white/10 focus:outline-none cursor-pointer"
                    >
                      {audioGenres.map(ag => (
                        <option key={ag.id} value={ag.id} className="bg-gray-900 text-white">
                          {ag.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Resolution & FPS Grid */}
                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-gray-400 block mb-1">Resolution</span>
                      <div className="grid grid-cols-3 gap-1">
                        {resolutions.map(r => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setResolution(r.id)}
                            className={`py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                              resolution === r.id ? 'bg-amber-500 text-black' : 'bg-white/5 text-gray-400 hover:text-white'
                            }`}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-400 block mb-1">Duration</span>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full bg-black/70 text-emerald-300 font-bold p-1 rounded text-xs border border-white/10 focus:outline-none cursor-pointer"
                      >
                        {durationOptions.map(d => (
                          <option key={d.value} value={d.value} className="bg-gray-900 text-white">
                            {d.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Style Optics Preset */}
                <div className="pt-2 border-t border-white/5">
                  <span className="text-[10px] text-gray-400 block mb-1">Optics Style Preset</span>
                  <select
                    value={cinematicStyle}
                    onChange={(e) => setCinematicStyle(e.target.value)}
                    className="w-full bg-black/70 text-purple-300 p-1.5 rounded text-xs border border-white/10 focus:outline-none cursor-pointer truncate"
                  >
                    {styles.map(s => (
                      <option key={s.value} value={s.value} className="bg-gray-900 text-white">{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Primary Video Viewport with High-Impact Focus */}
      <div className="flex-1 min-h-[480px] rounded-2xl bg-black/95 border border-white/10 overflow-hidden shadow-2xl relative">
        <CinematicVideoPlayer
          videoData={activeVideoData}
          title={customPrompt}
          aspectRatio={aspectRatio}
          resolution={resolution}
          fps={fps}
          isTitanMode={isTitanMode}
        />
      </div>
    </div>
  );
}

