import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Wand2, 
  Download, 
  Copy, 
  Check, 
  Maximize2, 
  RefreshCw, 
  Sliders, 
  Layers,
  ZoomIn,
  Grid,
  Palette,
  Eye,
  Camera,
  X,
  Upload,
  FileDown,
  Film
} from 'lucide-react';
import { DEMO_IMAGE_PROMPTS } from '../../data/demoData';
import { openrouter } from '../../services/openrouter';
import { imageGenerator } from '../../services/imageGenerator';

export default function ImageStudio({ activeModel, isTitanMode = false, onOpenVideoStudio }) {
  const [prompt, setPrompt] = useState(DEMO_IMAGE_PROMPTS[0].prompt);
  const [negativePrompt, setNegativePrompt] = useState('');
  const [showNegative, setShowNegative] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('Photorealistic 8K');
  const [selectedModel, setSelectedModel] = useState('flux-realism');
  const [aspectRatio, setAspectRatio] = useState('3:4');
  const [resolution, setResolution] = useState('8k'); // '1080p' | '4k' | '8k'
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('create'); // 'create' | 'gallery'

  const [gallery, setGallery] = useState(() => {
    try {
      const saved = localStorage.getItem('girionix_image_gallery');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return [
      {
        id: 'img-1',
        title: DEMO_IMAGE_PROMPTS[0].title,
        prompt: DEMO_IMAGE_PROMPTS[0].prompt,
        url: DEMO_IMAGE_PROMPTS[0].thumbnail,
        style: DEMO_IMAGE_PROMPTS[0].style,
        aspect: DEMO_IMAGE_PROMPTS[0].aspect,
        engine: 'FLUX.1 Cinema 8K'
      },
      {
        id: 'img-2',
        title: DEMO_IMAGE_PROMPTS[1].title,
        prompt: DEMO_IMAGE_PROMPTS[1].prompt,
        url: DEMO_IMAGE_PROMPTS[1].thumbnail,
        style: DEMO_IMAGE_PROMPTS[1].style,
        aspect: DEMO_IMAGE_PROMPTS[1].aspect,
        engine: 'FLUX.1 Cinema 8K'
      }
    ];
  });

  const stylePresets = [
    { name: 'Photorealistic 8K', icon: '📸', desc: '85mm f/1.4 natural human skin, pores & realistic HDR' },
    { name: 'Unreal Engine 5', icon: '🎮', desc: 'Nanite & Lumen 3D Octane global illumination' },
    { name: 'Anime Masterpiece', icon: '✨', desc: 'Makoto Shinkai & Studio Ghibli cel-shaded art' },
    { name: 'Cyberpunk Neon', icon: '🌆', desc: 'Blade Runner neon rain, volumetric mist & HUDs' },
    { name: '3D Pixar Animation', icon: '🧸', desc: 'Subsurface scattering & vibrant character lighting' },
    { name: 'Oil Painting Masterpiece', icon: '🎨', desc: 'Textured impasto palette knife museum canvas' },
    { name: 'Macro Photography', icon: '🔬', desc: '100mm macro lens, ultra-shallow depth of field' }
  ];

  const aspectRatios = [
    { label: '👤 3:4 Portrait', value: '3:4', width: 768, height: 1024, desc: 'People, Faces & Characters' },
    { label: '🔲 1:1 Square', value: '1:1', width: 1024, height: 1024, desc: 'Art, Icons & Animals' },
    { label: '🎬 16:9 Cinema', value: '16:9', width: 1280, height: 720, desc: 'Scenery & Landscapes' },
    { label: '📱 9:16 Story', value: '9:16', width: 720, height: 1280, desc: 'Mobile Wallpapers & Reels' },
    { label: '🌌 21:9 Ultra-Wide', value: '21:9', width: 1344, height: 576, desc: 'Anamorphic Panoramas' }
  ];

  const engineModels = [
    { id: 'flux-realism', name: '✨ FLUX.1 Realism', desc: 'Lifelike skin & zero plastic look' },
    { id: 'flux', name: '📸 Cinema 8K', desc: 'Master cinematic raytracing' },
    { id: 'flux-anime', name: '🎨 Anime Master', desc: 'Studio Ghibli aesthetic' },
    { id: 'flux-3d', name: '🧸 3D Pixar', desc: 'Octane subsurface scattering' }
  ];

  useEffect(() => {
    try {
      if (gallery && gallery.length > 0) {
        localStorage.setItem('girionix_image_gallery', JSON.stringify(gallery.slice(0, 40)));
      }
    } catch (_) {}
  }, [gallery]);

  const handleMagicEnhance = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);

    try {
      let enhanced = '';
      await openrouter.streamChat({
        messages: [
          {
            role: 'system',
            content: 'You are the Girionix Vision Director. Expand the prompt into an ultra-detailed, 8K studio-grade visual masterpiece prompt with camera lens, lighting, atmospheric haze, and material textures. Output ONLY the expanded prompt string.'
          },
          { role: 'user', content: `Expand for ${selectedStyle}: "${prompt}"` }
        ],
        model: activeModel?.id || 'deepseek/deepseek-chat',
        onChunk: (chunk, acc) => { enhanced = acc; }
      });

      if (enhanced && enhanced.length > 10) {
        setPrompt(enhanced.trim());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async (customPrompt) => {
    const p = customPrompt || prompt;
    if (!p.trim() || isGenerating) return;
    setIsGenerating(true);

    try {
      const selectedAspect = aspectRatios.find(a => a.value === aspectRatio) || aspectRatios[0];
      const result = await imageGenerator.generate({
        prompt: p,
        width: selectedAspect.width,
        height: selectedAspect.height,
        stylePreset: selectedStyle,
        model: selectedModel
      });

      const newImg = {
        id: 'img-' + Date.now(),
        title: p.slice(0, 32) + '...',
        prompt: p,
        url: result.url,
        style: selectedStyle,
        aspect: aspectRatio,
        engine: selectedModel.toUpperCase(),
        createdAt: Date.now()
      };

      setGallery(prev => [newImg, ...prev]);
      setSelectedImage(newImg);
    } catch (err) {
      console.error('Image generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBatchGenerate = async () => {
    if (!prompt.trim() || isBatchGenerating) return;
    setIsBatchGenerating(true);

    try {
      const selectedAspect = aspectRatios.find(a => a.value === aspectRatio) || aspectRatios[0];
      const results = await imageGenerator.generateVariations({
        prompt,
        stylePreset: selectedStyle,
        width: selectedAspect.width,
        height: selectedAspect.height
      });

      const newImages = results.map((res, i) => ({
        id: `img-${Date.now()}-${i}`,
        title: `${prompt.slice(0, 24)} (Var ${i + 1})`,
        prompt,
        url: res.url,
        style: selectedStyle,
        aspect: aspectRatio,
        engine: 'FLUX.1 Cinema 8K',
        createdAt: Date.now()
      }));

      setGallery(prev => [...newImages, ...prev]);
      setSelectedImage(newImages[0]);
    } catch (err) {
      console.error('Batch generation error:', err);
    } finally {
      setIsBatchGenerating(false);
    }
  };

  const handleCopyPrompt = (p, idx) => {
    navigator.clipboard.writeText(p);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleDownloadImage = (url, title) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `girionix_8k_${(title || 'artwork').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.png`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleExportImageProject = () => {
    const projectData = {
      version: '1.0.0',
      type: 'girionix_image_gallery',
      exportedAt: new Date().toISOString(),
      prompt,
      negativePrompt,
      selectedStyle,
      selectedModel,
      aspectRatio,
      resolution,
      gallery
    };
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Girionix_VisionGallery_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportImageProject = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        if (file.name.endsWith('.json')) {
          const data = JSON.parse(evt.target.result);
          if (data.prompt) setPrompt(data.prompt);
          if (data.negativePrompt) setNegativePrompt(data.negativePrompt);
          if (data.selectedStyle) setSelectedStyle(data.selectedStyle);
          if (data.aspectRatio) setAspectRatio(data.aspectRatio);
          if (data.resolution) setResolution(data.resolution);
          if (data.gallery && Array.isArray(data.gallery)) setGallery(data.gallery);
        } else if (file.type.startsWith('image/')) {
          // Import image as reference into gallery
          const dataUrl = evt.target.result;
          const newImg = {
            id: `imported-${Date.now()}`,
            title: file.name.replace(/\.[^/.]+$/, ''),
            prompt: `Imported Reference: ${file.name}`,
            url: dataUrl,
            style: 'Reference Image',
            aspect: '1:1',
            model: 'Custom Upload',
            timestamp: new Date().toLocaleTimeString()
          };
          setGallery(prev => [newImg, ...prev]);
          setActiveTab('gallery');
        }
      } catch (err) {
        console.error('Import error:', err);
      }
    };
    if (file.name.endsWith('.json')) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#07080F] overflow-y-auto p-4 space-y-4">
      {/* Top Banner Control Hub */}
      <div className="p-5 rounded-3xl bg-[#090B18] border border-cyan-500/20 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>VisionForge 8K Master Studio</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono border border-rose-500/30">
                  {resolution.toUpperCase()} Master Optics
                </span>
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                {isTitanMode ? '⚡ Titan 8K Neural Vision (100% Offline GPU Engine)' : '🎨 FLUX.1 Cinema Ultra & Arri Alexa 85mm f/1.2'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Export & Import Buttons */}
            <button
              onClick={handleExportImageProject}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Export Gallery & Recipes (.json)"
            >
              <FileDown className="w-3.5 h-3.5 text-rose-400" />
              <span>Export</span>
            </button>

            <label className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Import</span>
              <input type="file" accept=".json,image/*" onChange={handleImportImageProject} className="hidden" />
            </label>

            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 text-[10px] font-mono">
              {['1080p', '4k', '8k'].map(r => (
                <button
                  key={r}
                  onClick={() => setResolution(r)}
                  className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                    resolution === r
                      ? 'bg-rose-500 text-white shadow-glow-rose'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="space-y-2.5">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your vision in 8K (e.g. majestic cybernetic dragon soaring above Neo-Tokyo)..."
              rows={2}
              className="w-full p-3.5 pr-28 rounded-2xl bg-black/60 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-rose-500/50 resize-none font-sans"
            />
            <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5">
              <button
                onClick={() => setShowNegative(!showNegative)}
                className={`px-2 py-1.5 rounded-xl border text-[10px] font-mono transition-colors ${
                  showNegative ? 'bg-white/20 text-white border-white/40' : 'bg-black/40 text-gray-400 border-white/10'
                }`}
                title="Toggle Negative Prompt"
              >
                - Neg
              </button>
              <button
                onClick={handleMagicEnhance}
                disabled={isEnhancing || !prompt.trim()}
                className="px-2.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-[11px] font-mono flex items-center gap-1 transition-all disabled:opacity-40"
                title="Deep Vision Prompt Expander"
              >
                {isEnhancing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5 text-purple-400" />}
                <span>Enhance</span>
              </button>
            </div>
          </div>

          {showNegative && (
            <input
              type="text"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="Negative prompt (e.g. blurry, low quality, artifacts, distortion)..."
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-red-500/30 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-red-500/60 font-mono animate-fadeIn"
            />
          )}

          {/* Style Presets Grid */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">Artistic Style Preset:</span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {stylePresets.map((s) => (
                <button
                  key={s.name}
                  onClick={() => setSelectedStyle(s.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all shrink-0 ${
                    selectedStyle === s.name
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-glow-cyan'
                      : 'bg-black/40 text-gray-400 border border-white/5 hover:border-white/20 hover:text-gray-200'
                  }`}
                  title={s.desc}
                >
                  <span>{s.icon}</span>
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Engine Models & Aspect Ratios */}
          <div className="space-y-2 pt-1 border-t border-white/5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                <span className="text-[10px] font-mono text-gray-400 uppercase font-bold mr-1">Engine:</span>
                {engineModels.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-all shrink-0 ${
                      selectedModel === m.id
                        ? 'bg-purple-500/25 text-purple-300 font-bold border border-purple-500/50 shadow-glow-purple'
                        : 'bg-black/40 text-gray-400 border border-white/5 hover:text-white'
                    }`}
                    title={m.desc}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5 overflow-x-auto">
                <span className="text-[10px] font-mono text-gray-400 uppercase font-bold ml-1 mr-1">Ratio:</span>
                {aspectRatios.map((a) => (
                  <button
                    key={a.value}
                    onClick={() => setAspectRatio(a.value)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono whitespace-nowrap transition-all ${
                      aspectRatio === a.value
                        ? 'bg-cyan-500/25 text-cyan-300 font-bold border border-cyan-500/40 shadow-glow-cyan'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                    title={a.desc}
                  >
                    {a.label}
                  </button>
                ))}
              </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleBatchGenerate}
                disabled={isBatchGenerating || !prompt.trim()}
                className="px-3.5 py-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                title="Generate 4 Variations in Parallel"
              >
                {isBatchGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Grid className="w-3.5 h-3.5" />}
                <span>4x Variations</span>
              </button>

              <button
                onClick={() => handleGenerate()}
                disabled={isGenerating || !prompt.trim()}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-rose-500 text-black font-extrabold text-xs shadow-glow-cyan hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    <span>Rendering 8K Art...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Generate Artwork</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Gallery Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
            Artwork Gallery ({gallery.length})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {gallery.map((img, idx) => (
            <div
              key={img.id}
              onClick={() => setSelectedImage(img)}
              className="group relative rounded-2xl overflow-hidden bg-black/50 border border-white/10 hover:border-cyan-500/50 transition-all cursor-pointer shadow-lg hover:shadow-glow-cyan/20"
            >
              <div className="aspect-video relative overflow-hidden bg-gray-950">
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-black/60 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                      {img.style}
                    </span>
                    <div className="flex items-center gap-1">
                      {onOpenVideoStudio && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenVideoStudio(img.url, img.prompt);
                          }}
                          className="p-1.5 rounded-lg bg-black/60 hover:bg-amber-500/20 text-white hover:text-amber-300 transition-colors"
                          title="Animate in MotionLab Video Studio"
                        >
                          <Film className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadImage(img.url, img.title);
                        }}
                        className="p-1.5 rounded-lg bg-black/60 hover:bg-cyan-500/20 text-white hover:text-cyan-300 transition-colors"
                        title="Download 8K Image"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-white line-clamp-2 font-medium">
                    {img.prompt}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen 8K Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-fadeIn select-none"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="max-w-5xl w-full max-h-[92vh] bg-[#090B18] border border-cyan-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center shadow-glow-cyan"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar */}
            <div className="w-full px-5 py-3 bg-[#0A0D1F] border-b border-white/10 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                  {selectedImage.style || 'Photorealistic 8K'}
                </span>
                <span className="text-gray-400">
                  {selectedImage.aspect} • {selectedImage.engine || 'FLUX.1 8K'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {onOpenVideoStudio && (
                  <button
                    onClick={() => {
                      onOpenVideoStudio(selectedImage.url, selectedImage.prompt);
                      setSelectedImage(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Animate this Artwork in MotionLab Video Studio"
                  >
                    <Film className="w-3.5 h-3.5 text-amber-400" />
                    <span>Animate in Video</span>
                  </button>
                )}

                <button
                  onClick={() => handleCopyPrompt(selectedImage.prompt, 'modal')}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-gray-300 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedIdx === 'modal' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIdx === 'modal' ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => handleDownloadImage(selectedImage.url, selectedImage.title)}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-glow-cyan hover:opacity-90 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save PNG</span>
                </button>

                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Image Container with Natural Geometry */}
            <div className="p-3 sm:p-4 max-h-[calc(92vh-100px)] overflow-auto flex items-center justify-center bg-black/80 w-full">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-h-[72vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
              />
            </div>

            {/* Bottom Prompt Note */}
            <div className="w-full px-5 py-2.5 bg-[#060812] border-t border-white/10 text-xs text-gray-300 font-sans truncate">
              <span className="font-mono text-cyan-400 mr-2">Prompt:</span>
              <span>{selectedImage.prompt}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
