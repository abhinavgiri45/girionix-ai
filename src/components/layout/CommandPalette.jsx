import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MessageSquare, 
  Code2, 
  Sigma, 
  Image as ImageIcon, 
  Clapperboard, 
  Settings, 
  Sparkles, 
  Zap, 
  Terminal,
  Cpu
} from 'lucide-react';
import { STUDIO_MODES, AI_MODELS } from '../../services/modelCatalog';

export default function CommandPalette({
  isOpen,
  onClose,
  setCurrentStudio,
  setActiveModel,
  onOpenSettings,
  onRunPrompt
}) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onClose ? (!isOpen ? null : null) : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    {
      id: 'studio-code',
      title: 'Open Superhuman Dev Studio',
      category: 'Studios',
      icon: <Code2 className="w-4 h-4 text-purple-400" />,
      action: () => { setCurrentStudio('code'); onClose(); }
    },
    {
      id: 'studio-math',
      title: 'Open Deep Math & Scientific Lab',
      category: 'Studios',
      icon: <Sigma className="w-4 h-4 text-emerald-400" />,
      action: () => { setCurrentStudio('math'); onClose(); }
    },
    {
      id: 'studio-image',
      title: 'Open VisionForge 8K Image Studio',
      category: 'Studios',
      icon: <ImageIcon className="w-4 h-4 text-rose-400" />,
      action: () => { setCurrentStudio('image'); onClose(); }
    },
    {
      id: 'studio-video',
      title: 'Open MotionLab Cinematic Video Studio',
      category: 'Studios',
      icon: <Clapperboard className="w-4 h-4 text-amber-400" />,
      action: () => { setCurrentStudio('video'); onClose(); }
    },
    {
      id: 'model-deepseek',
      title: 'Switch Engine to ⚡ Girionix Deep Reasoner',
      category: 'AI Engines',
      icon: <Cpu className="w-4 h-4 text-purple-400" />,
      action: () => {
        const m = AI_MODELS.find(x => x.id === 'deepseek/deepseek-r1');
        if (m) setActiveModel(m);
        onClose();
      }
    },
    {
      id: 'settings-key',
      title: 'Configure Universal API & Engine Hub',
      category: 'Configuration',
      icon: <Settings className="w-4 h-4 text-cyan-400" />,
      action: () => { onOpenSettings(); onClose(); }
    }
  ];

  const filtered = quickActions.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) || 
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-xl rounded-2xl bg-[#0C0E1A] border border-cyan-500/30 shadow-2xl overflow-hidden shadow-glow-cyan"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Type a command or search studios..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none"
          />
          <kbd className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono text-gray-400">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-500 font-mono">
              No matching actions found.
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-gray-200 hover:text-white transition-colors group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-white/10 group-hover:border-cyan-500/30">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs font-semibold">{item.title}</div>
                    <div className="text-[10px] text-gray-500 font-mono">{item.category}</div>
                  </div>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
