import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  ScrollText,
  Image as ImageIcon, 
  Film, 
  Sigma, 
  Radio, 
  Sparkles, 
  Globe, 
  ShieldAlert,
  Brain,
  Wand2,
  Lightbulb,
  Share2,
  Trash2,
  Download,
  Layers,
  Music
} from 'lucide-react';

export default function SlashCommandMenu({ 
  isOpen = true, 
  onSelectCommand, 
  onSelect, 
  filterText = '', 
  filter = '',
  selectedIndex: externalIndex
}) {
  if (!isOpen) return null;

  const selectHandler = onSelectCommand || onSelect || (() => {});
  const activeFilter = (filterText || filter || '').trim().toLowerCase();
  // Remove leading '/' for matching if user typed '/co'
  const cleanFilter = activeFilter.startsWith('/') ? activeFilter.slice(1) : activeFilter;

  const commands = [
    { cmd: '/code', desc: 'Open Coding Studio (React 18, Tailwind, Algorithms & Live Preview)', icon: <Code2 className="w-3.5 h-3.5 text-cyan-400" />, category: 'Studio' },
    { cmd: '/studio', desc: 'Open full-screen AI Studio workspace', icon: <Layers className="w-3.5 h-3.5 text-purple-400" />, category: 'Studio' },
    { cmd: '/image', desc: 'Create a photorealistic 8K FLUX.1 visual art render', icon: <ImageIcon className="w-3.5 h-3.5 text-rose-400" />, category: 'Creative' },
    { cmd: '/video', desc: 'Direct a cinematic 3D multi-shot video scene', icon: <Film className="w-3.5 h-3.5 text-amber-400" />, category: 'Creative' },
    { cmd: '/audio', desc: 'Open 16-Step Audio Synthesizer & Beat Sequencer', icon: <Music className="w-3.5 h-3.5 text-pink-400" />, category: 'Creative' },
    { cmd: '/math', desc: 'Derive Olympiad proofs with step-by-step KaTeX math & 3D plots', icon: <Sigma className="w-3.5 h-3.5 text-emerald-400" />, category: 'Reasoning' },
    { cmd: '/script', desc: 'Write a Hollywood screenplay, YouTube script, or story', icon: <ScrollText className="w-3.5 h-3.5 text-indigo-400" />, category: 'Creative' },
    { cmd: '/prompts', desc: 'Open curated Prompt Templates Library', icon: <Lightbulb className="w-3.5 h-3.5 text-amber-300" />, category: 'Productivity' },
    { cmd: '/export', desc: 'Export chat as Markdown, HTML, JSON, or Text', icon: <Share2 className="w-3.5 h-3.5 text-emerald-400" />, category: 'Productivity' },
    { cmd: '/voice', desc: 'Open hands-free bidirectional Voice Mode', icon: <Radio className="w-3.5 h-3.5 text-purple-400" />, category: 'AI' },
    { cmd: '/web', desc: 'Toggle real-time web search grounding', icon: <Globe className="w-3.5 h-3.5 text-blue-400" />, category: 'AI' },
    { cmd: '/enhance', desc: 'Expand prompt into master instructions', icon: <Wand2 className="w-3.5 h-3.5 text-cyan-300" />, category: 'AI' },
    { cmd: '/clear', desc: 'Clear chat session and start fresh', icon: <Trash2 className="w-3.5 h-3.5 text-rose-400" />, category: 'Chat' },
    { cmd: '/incognito', desc: 'Enable Ephemeral session mode (unsaved)', icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-300" />, category: 'Privacy' },
    { cmd: '/founder', desc: 'Learn about founder Abhinav Giri & Girionix vision', icon: <Sparkles className="w-3.5 h-3.5 text-amber-300" />, category: 'Info' },
    { cmd: '/download', desc: 'Download Girionix Apps for Windows, Mac, iOS & Android', icon: <Download className="w-3.5 h-3.5 text-cyan-400" />, category: 'Apps' }
  ];

  const filtered = commands.filter(c => {
    if (!cleanFilter) return true;
    const cmdClean = c.cmd.slice(1).toLowerCase();
    return cmdClean.includes(cleanFilter) || c.desc.toLowerCase().includes(cleanFilter) || c.category.toLowerCase().includes(cleanFilter);
  });

  const [localIndex, setLocalIndex] = useState(0);
  const activeIndex = typeof externalIndex === 'number' ? externalIndex : localIndex;

  useEffect(() => {
    setLocalIndex(0);
  }, [activeFilter]);

  if (filtered.length === 0) {
    return (
      <div className="absolute bottom-full left-0 mb-2 w-84 max-w-[calc(100vw-2rem)] rounded-2xl bg-[#090C18]/95 border border-white/15 shadow-2xl p-3 z-50 backdrop-blur-2xl animate-fadeIn font-mono text-xs text-gray-400">
        No slash command matching <span className="text-cyan-400">"{activeFilter}"</span>
      </div>
    );
  }

  return (
    <div className="absolute bottom-full left-0 mb-2 w-88 max-w-[calc(100vw-2rem)] rounded-2xl bg-[#090C18]/95 border border-cyan-500/30 shadow-2xl p-2 z-50 backdrop-blur-2xl animate-fadeIn font-sans">
      <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-gray-400 border-b border-white/10 flex justify-between items-center">
        <span className="flex items-center gap-1.5 font-bold text-cyan-400">
          <span>⚡ Slash Commands</span>
          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/15 text-cyan-300">
            {filtered.length}
          </span>
        </span>
        <span className="text-gray-500">Click or Press Tab ↹</span>
      </div>

      <div className="py-1 space-y-0.5 max-h-60 overflow-y-auto no-scrollbar">
        {filtered.map((item, idx) => {
          const isSelected = idx === activeIndex;
          return (
            <button
              key={item.cmd}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault(); // prevent losing focus from textarea
                selectHandler(item.cmd);
              }}
              onMouseEnter={() => setLocalIndex(idx)}
              className={"w-full text-left p-2 rounded-xl transition-all flex items-center gap-2.5 text-xs cursor-pointer " + (
                isSelected 
                  ? 'bg-cyan-500/20 border border-cyan-500/40 text-white shadow-sm' 
                  : 'hover:bg-white/[0.06] border border-transparent text-gray-300'
              )}
            >
              <div className={"p-1.5 rounded-lg border transition-colors shrink-0 " + (
                isSelected ? 'bg-cyan-500/20 border-cyan-400/40' : 'bg-black/50 border-white/10'
              )}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-mono text-cyan-300 font-bold text-xs">{item.cmd}</span>
                  <span className="text-[9px] font-mono text-gray-500 uppercase">{item.category}</span>
                </div>
                <div className="text-[11px] text-gray-400 truncate leading-tight mt-0.5">{item.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
