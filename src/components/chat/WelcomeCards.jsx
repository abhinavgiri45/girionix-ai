import React from 'react';
import { Star, Laptop, DraftingCompass, Lightbulb } from 'lucide-react';

export default function WelcomeCards({ userName, onOpenAbout, onSelectPrompt }) {
  const cards = [
    {
      icon: <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />,
      title: 'Founder & Vision',
      desc: 'Who created Girionix AI?',
      prompt: 'Who created Girionix AI and what is the founder\'s vision for this platform?'
    },
    {
      icon: <Laptop className="w-5 h-5 text-gray-300" />,
      title: 'Code & App Builder',
      desc: 'Playable Snake game or interactive web app',
      prompt: 'Build a complete playable Snake game with score counter, high score, retro cyber arcade styling, and arrow key controls that runs directly in the live interactive sandbox!'
    },
    {
      icon: <DraftingCompass className="w-5 h-5 text-yellow-400" />,
      title: 'Math & Derivations',
      desc: 'Step-by-step LaTeX formula & proof',
      prompt: 'Provide a rigorous step-by-step mathematical derivation and proof with LaTeX formulas for the Black-Scholes partial differential equation.'
    },
    {
      icon: <Lightbulb className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />,
      title: 'Study & Deep Concepts',
      desc: 'Intuitive breakdown with key takeaways',
      prompt: 'Give me an intuitive deep breakdown of transformer self-attention mechanisms with key takeaways, mathematical intuition, and practical examples.'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 sm:px-6 py-6 sm:py-12 max-w-5xl mx-auto w-full animate-fadeIn select-none">
      {/* Greeting Hero matching reference image */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-2">
        <span className="bg-gradient-to-r from-[#4d82f3] via-[#7b61ff] to-[#a855f7] bg-clip-text text-transparent">
          Hello, {userName || 'Abhinav'}
        </span>
      </h1>
      
      <h2 className="text-lg sm:text-2xl md:text-3xl font-medium text-gray-400 tracking-tight mb-8 sm:mb-10">
        What would you like to explore today?
      </h2>

      {/* 4 Cards Grid from Reference Image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 w-full mb-8 text-center">
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => onSelectPrompt && onSelectPrompt(card.prompt)}
            className="flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl bg-[#131418] hover:bg-[#1a1b22] border border-white/[0.08] hover:border-cyan-500/40 transition-all duration-200 cursor-pointer group shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-0.5"
          >
            <div className="mb-3.5 p-2 rounded-xl bg-white/[0.04] group-hover:bg-white/[0.08] transition-colors flex items-center justify-center">
              {card.icon}
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mb-1.5 group-hover:text-cyan-200 transition-colors">
              {card.title}
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed font-normal">
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Pill: Type / in search bar for quick access */}
      <div 
        onClick={() => onSelectPrompt && onSelectPrompt('/')}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#131418] hover:bg-[#1a1b22] border border-white/[0.08] hover:border-cyan-500/30 text-xs text-gray-400 hover:text-gray-200 transition-all cursor-pointer shadow-sm group"
      >
        <span className="px-1.5 py-0.5 rounded bg-white/[0.08] text-cyan-400 font-mono font-bold text-xs border border-white/10 group-hover:border-cyan-500/40">/</span>
        <span>
          Type <strong className="text-gray-300 font-mono">/</strong> in the search bar for quick access to <strong className="text-cyan-300 font-semibold">Girionix AI tools</strong>
        </span>
      </div>
    </div>
  );
}
