import React from 'react';
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
  Trash2
} from 'lucide-react';

export default function SlashCommandMenu({ isOpen, onSelectCommand, filterText }) {
  if (!isOpen) return null;

  const commands = [
    { cmd: '/prompts', desc: 'Open curated Prompt Templates Library', icon: <Lightbulb className="w-3.5 h-3.5 text-amber-300" /> },
    { cmd: '/export', desc: 'Export chat as Markdown, Text, HTML, or JSON', icon: <Share2 className="w-3.5 h-3.5 text-emerald-400" /> },
    { cmd: '/code', desc: 'Generate or live-run a React / Fullstack Web App', icon: <Code2 className="w-3.5 h-3.5 text-cyan-400" /> },
    { cmd: '/script', desc: 'Write a Hollywood screenplay, YouTube script, or story', icon: <ScrollText className="w-3.5 h-3.5 text-indigo-400" /> },
    { cmd: '/image', desc: 'Create a photorealistic 8K FLUX.1 visual art render', icon: <ImageIcon className="w-3.5 h-3.5 text-rose-400" /> },
    { cmd: '/video', desc: 'Direct a cinematic 3D multi-shot video scene', icon: <Film className="w-3.5 h-3.5 text-amber-400" /> },
    { cmd: '/math', desc: 'Derive Olympiad proofs with step-by-step KaTeX math', icon: <Sigma className="w-3.5 h-3.5 text-emerald-400" /> },
    { cmd: '/voice', desc: 'Open hands-free bidirectional Voice Mode', icon: <Radio className="w-3.5 h-3.5 text-purple-400" /> },
    { cmd: '/web', desc: 'Toggle real-time web search grounding', icon: <Globe className="w-3.5 h-3.5 text-blue-400" /> },
    { cmd: '/enhance', desc: 'Expand prompt into master instructions', icon: <Wand2 className="w-3.5 h-3.5 text-cyan-300" /> },
    { cmd: '/clear', desc: 'Clear chat session and start fresh', icon: <Trash2 className="w-3.5 h-3.5 text-rose-400" /> },
    { cmd: '/incognito', desc: 'Enable Ephemeral session mode (unsaved)', icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-300" /> },
    { cmd: '/founder', desc: 'Learn about founder Abhinav Giri & Girionix vision', icon: <Sparkles className="w-3.5 h-3.5 text-amber-300" /> }
  ];

  const filtered = commands.filter(c => 
    c.cmd.toLowerCase().includes(filterText.toLowerCase()) || 
    c.desc.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="absolute bottom-full left-0 mb-2 w-80 rounded-2xl bg-[#0F1122]/95 border border-white/15 shadow-2xl p-2 z-50 backdrop-blur-2xl animate-fadeIn">
      <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-gray-400 border-b border-white/10 flex justify-between">
        <span>Quick Slash Commands</span>
        <span>Tab or Click</span>
      </div>
      <div className="py-1 space-y-1 max-h-56 overflow-y-auto">
        {filtered.map(item => (
          <button
            key={item.cmd}
            onClick={() => onSelectCommand(item.cmd)}
            className="w-full text-left p-2 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2.5 text-xs text-gray-200"
          >
            <div className="p-1 rounded-lg bg-black/50 border border-white/10">
              {item.icon}
            </div>
            <div className="flex-1 truncate">
              <div className="font-mono text-cyan-300 font-bold">{item.cmd}</div>
              <div className="text-[10px] text-gray-400 truncate">{item.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
