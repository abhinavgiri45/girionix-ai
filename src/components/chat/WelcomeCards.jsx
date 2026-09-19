import React from 'react';
import { Crown, Sparkles, FileText, Table, Presentation, ShieldCheck } from 'lucide-react';

export default function WelcomeCards({ userName, onOpenAbout, onOpenWhySwitch, onSelectPrompt }) {
  const officeCards = [
    {
      tool: 'Giri Drift',
      icon: <FileText className="w-4 h-4 text-blue-400" />,
      tag: 'Word Processor',
      title: 'Executive Briefing & Memo',
      desc: 'Draft an operational strategy briefing with headings, metrics, and deliverables.',
      prompt: 'Draft an executive briefing memorandum on Q3 operational milestones, formatted with clear headings, bullet deliverables, and executive recommendations for Giri Drift.'
    },
    {
      tool: 'Giri Axis',
      icon: <Table className="w-4 h-4 text-emerald-400" />,
      tag: 'Spreadsheet Model',
      title: 'Quarterly Financial Matrix',
      desc: 'Generate revenue, OPEX, EBITDA projections with spreadsheet formulas.',
      prompt: 'Generate an enterprise financial projection table for 4 quarters with Revenue, OPEX, Gross Profit, EBITDA, and formula calculations formatted as a clean spreadsheet table.'
    },
    {
      tool: 'Giri Kinetic',
      icon: <Presentation className="w-4 h-4 text-purple-400" />,
      tag: 'Slide Deck',
      title: 'Strategic Executive Keynote',
      desc: 'Create a 4-slide presentation outline with SWOT analysis and KPI metrics.',
      prompt: 'Create a 4-slide executive presentation deck outline on "Sovereign Cloud & Client AI Architecture" including vision, SWOT matrix, and KPI milestones for Giri Kinetic.'
    },
    {
      tool: 'Giri Aegis',
      icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />,
      tag: 'PDF Studio',
      title: 'Compliance & Audit Stamp',
      desc: 'Synthesize cryptographic verification seal and zero-telemetry audit notes.',
      prompt: 'Synthesize an enterprise cryptographic audit addendum and legal compliance verification stamp for an official PDF document.'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center px-3 sm:px-4 py-4 sm:py-6 max-w-3xl mx-auto w-full animate-fadeIn select-none">
      {/* Official Brand Logo Icon & Hero */}
      <div 
        className="mb-3 sm:mb-4 flex flex-col items-center cursor-pointer group" 
        onClick={onOpenAbout} 
        title="Click to view About Girionix AI & Creator Abhinav Giri"
      >
        <img
          src="/logo.png"
          alt="Girionix AI Official Logo"
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-contain shadow-glow-cyan mb-2 group-hover:scale-105 transition-transform duration-300"
        />
        <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-cyan-300 font-bold uppercase drop-shadow-sm">
          THINK • CREATE • EXPLORE
        </span>
      </div>

      {/* Greeting Hero */}
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-1">
        <span className="text-white">Hello, </span>
        <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
          {userName || 'Orbit User'}
        </span>
      </h1>
      
      <h2 className="text-xs sm:text-base md:text-lg font-medium text-gray-400 tracking-tight mb-4 sm:mb-5">
        What document, spreadsheet, or presentation would you like to build today?
      </h2>

      {/* 4 Dedicated Office Suite Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 w-full mb-4 text-left">
        {officeCards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => onSelectPrompt && onSelectPrompt(card.prompt)}
            className="p-3 sm:p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer group shadow-sm hover:scale-[1.01]"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                {card.icon}
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 group-hover:text-cyan-300">
                  {card.tool} • {card.tag}
                </span>
              </div>
              <span className="text-[10px] text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                Run ⚡
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white mb-0.5 group-hover:text-cyan-200">
              {card.title}
            </h4>
            <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Footer Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <a
          href="https://giri-corporation.pages.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-all hover:scale-105 shadow-sm"
          title="Official Giri Corporation Website — Owner & Developer of Girionix AI"
        >
          <img src="/giri-corporation-logo.png" alt="Giri Corporation" className="w-3.5 h-3.5 object-contain rounded" />
          <span>Giri Corporation (Official) ↗</span>
        </a>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-gray-400 text-xs font-mono shadow-inner">
          <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[10px]">/</span>
          <span>Type <strong className="text-gray-200">/</strong> for commands</span>
        </div>
      </div>
    </div>
  );
}
