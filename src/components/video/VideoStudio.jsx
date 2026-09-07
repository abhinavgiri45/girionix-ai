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
  Trash2
} from 'lucide-react';
import { imageGenerator, VIDEO_MODELS } from '../../services/imageGenerator';
import CinematicVideoPlayer from './CinematicVideoPlayer';

export default function VideoStudio({ activeModel, isAppInstalled = false, isTitanMode = false, onOpenDownload }) {
  const [generationMode, setGenerationMode] = useState('text'); // 'text' | 'image'
  const [customPrompt, setCustomPrompt] = useState('a majestic cybernetic dragon soaring above futuristic neo-Tokyo skyscrapers at midnight with volumetric rain reflections');
  const [referenceImage, setReferenceImage] = useState(null);
  const [cameraMotion, setCameraMotion] = useState('Orbit 360° Counter-Clockwise');
  const [cinematicStyle, setCinematicStyle] = useState('Hollywood Blockbuster Sci-Fi');
  const [resolution, setResolution] = useState('4k'); // '1080p' | '4k' | '8k'
  const [aspectRatio, setAspectRatio] = useState('2.39:1 Anamorphic Cinema');
  const [audioGenre, setAudioGenre] = useState('epic');
  const [fps, setFps] = useState('60 FPS');
  const [duration, setDuration] = useState(12); // 12 | 30 | 60 | 120
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [activeVideoData, setActiveVideoData] = useState(null);
  const [showDirectorSettings, setShowDirectorSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Video Generation History from localStorage
  const [videoHistory, setVideoHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('girionix_video_history');
      return saved ? JSON.parse(saved) : [];
    } catch (_) { return []; }
  });

  const durationOptions = [
    { value: 12, label: '12s (Cinema Teaser)' },
    { value: 30, label: '30s (Short Film)' },
    { value: 60, label: '60s (Master Trailer)' },
    { value: 120, label: '2 Min (Extended Cinematic)' }
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
        cameraMotion
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

  return (
    <div className="flex-1 flex flex-col h-full bg-[#06070D] overflow-y-auto p-3 sm:p-5 space-y-3 font-sans">
      {/* Clean, Streamlined Header & Command Bar */}
      <div className="p-4 rounded-2xl bg-[#0A0D1B]/90 backdrop-blur-xl border border-white/10 space-y-3 shadow-xl">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide">MotionLab 4K/8K Video Studio</h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                  {resolution.toUpperCase()} • {fps}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-mono">Hollywood Multi-Shot Continuity & Foley Audio Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Mode Switcher: Text-to-Video vs Image-to-Video */}
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 text-xs font-mono">
              <button
                onClick={() => setGenerationMode('text')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  generationMode === 'text' ? 'bg-amber-500 text-black font-bold shadow-sm' : 'text-gray-400 hover:text-white'
                }`}
              >
                Text-to-Video
              </button>
              <button
                onClick={() => setGenerationMode('image')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  generationMode === 'image' ? 'bg-amber-500 text-black font-bold shadow-sm' : 'text-gray-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3 h-3" />
                <span>Image-to-Video</span>
              </button>
            </div>

            <button
              onClick={() => setShowDirectorSettings(!showDirectorSettings)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                showDirectorSettings 
                  ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-glow-amber' 
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Director</span>
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

        {/* Image Reference Uploader (for Image-to-Video mode) */}
        {generationMode === 'image' && (
          <div className="p-3 rounded-xl bg-black/50 border border-cyan-500/30 flex items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-3">
              {referenceImage ? (
                <img src={referenceImage} alt="Reference" className="w-12 h-12 object-cover rounded-lg border border-cyan-500/40" />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-gray-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
              )}
              <div>
                <span className="text-cyan-300 font-bold block">
                  {referenceImage ? 'Reference Image Attached' : 'Upload Keyframe Image to Animate:'}
                </span>
                <span className="text-[10px] text-gray-400">
                  {referenceImage ? 'MotionLab will synthesize 3D dynamic camera movement over your image.' : 'PNG, JPG or WebP up to 8K resolution'}
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
                  title="Remove reference"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
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
              placeholder="Describe your video scene (e.g., cybernetic dragon soaring above Neo-Tokyo, running dog in meadow)..."
              className="w-full pl-9 pr-20 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-amber-500/50 shadow-inner"
            />
            <Video className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
            
            <button
              onClick={handleMagicEnhancePrompt}
              disabled={isEnhancing || !customPrompt.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg bg-white/10 hover:bg-amber-500/20 text-[10px] font-mono text-gray-300 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
              title="Enhance with Director Optics"
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
                <span>Synthesizing Video...</span>
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

        {/* Collapsible Director Settings Drawer */}
        {showDirectorSettings && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-3 border-t border-white/10 text-xs font-mono animate-fadeIn">
            {/* Resolution Selector */}
            <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-400 flex items-center gap-1"><Tv className="w-3 h-3 text-amber-400" /> Resolution</span>
              <div className="grid grid-cols-3 gap-1">
                {resolutions.map(r => (
                  <button
                    key={r.id}
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

            {/* Duration Selector */}
            <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3 text-emerald-400" /> Duration</span>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full bg-black/70 text-emerald-300 font-bold p-1 rounded text-xs border border-white/10 focus:outline-none cursor-pointer"
              >
                {durationOptions.map(d => (
                  <option key={d.value} value={d.value} className="bg-gray-900 text-white">{d.label}</option>
                ))}
              </select>
            </div>

            {/* FPS Selector */}
            <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-400 flex items-center gap-1"><SlidersHorizontal className="w-3 h-3 text-cyan-400" /> Framerate</span>
              <select
                value={fps}
                onChange={(e) => setFps(e.target.value)}
                className="w-full bg-black/70 text-cyan-300 font-bold p-1 rounded text-xs border border-white/10 focus:outline-none cursor-pointer"
              >
                {fpsOptions.map(f => (
                  <option key={f.value} value={f.value} className="bg-gray-900 text-white">{f.label}</option>
                ))}
              </select>
            </div>

            {/* Camera Motion */}
            <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] text-gray-400 flex items-center gap-1"><Camera className="w-3 h-3 text-rose-400" /> Camera Motion</span>
              <select
                value={cameraMotion}
                onChange={(e) => setCameraMotion(e.target.value)}
                className="w-full bg-black/70 text-rose-300 p-1 rounded text-xs border border-white/10 focus:outline-none cursor-pointer truncate"
              >
                {motions.map(m => (
                  <option key={m.value} value={m.value} className="bg-gray-900 text-white">{m.label}</option>
                ))}
              </select>
            </div>

            {/* Style Optics */}
            <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-gray-400 flex items-center gap-1"><Palette className="w-3 h-3 text-purple-400" /> Style Optics</span>
              <select
                value={cinematicStyle}
                onChange={(e) => setCinematicStyle(e.target.value)}
                className="w-full bg-black/70 text-purple-300 p-1 rounded text-xs border border-white/10 focus:outline-none cursor-pointer truncate"
              >
                {styles.map(s => (
                  <option key={s.value} value={s.value} className="bg-gray-900 text-white">{s.label}</option>
                ))}
              </select>
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

