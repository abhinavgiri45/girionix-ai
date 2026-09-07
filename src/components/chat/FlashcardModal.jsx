import React, { useState } from 'react';
import { X, Sparkles, BookOpen, RotateCw, Check, ArrowRight } from 'lucide-react';
import { openrouter } from '../../services/openrouter';

export default function FlashcardModal({ isOpen, onClose, activeModel }) {
  const [topic, setTopic] = useState('React Hooks & Concurrency');
  const [flashcards, setFlashcards] = useState([
    { q: 'What is the purpose of useEffect cleanup return function?', a: 'To cancel network subscriptions, clear timers, and prevent memory leaks before the component unmounts or re-runs.' },
    { q: 'What is time complexity of QuickSort in average vs worst case?', a: 'Average case is O(n log n). Worst case is O(n²) when the pivot selected is already the smallest/largest element.' },
    { q: 'What does the Euler-Lagrange equation determine in physics?', a: 'It determines the path of a dynamical system that minimizes the action integral S = ∫ L dt.' }
  ]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerateCards = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);

    try {
      let fullContent = '';
      await openrouter.streamChat({
        messages: [
          {
            role: 'system',
            content: 'Generate 4 high-yield study flashcards for the given topic in strictly valid JSON array format: [{"q": "Question", "a": "Answer"}]. Output ONLY valid JSON.'
          },
          { role: 'user', content: `Topic: "${topic}"` }
        ],
        model: activeModel.id,
        onChunk: (chunk, acc) => { fullContent = acc; }
      });

      const cleanJson = fullContent
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();
      const match = cleanJson.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          const parsed = JSON.parse(match[0]);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const validCards = parsed.filter(c => c && (c.q || c.question) && (c.a || c.answer)).map(c => ({
              q: c.q || c.question,
              a: c.a || c.answer
            }));
            if (validCards.length > 0) {
              setFlashcards(validCards);
              setCurrentIdx(0);
              setIsFlipped(false);
            }
          }
        } catch (innerErr) {
          console.warn('Inner Flashcard JSON parse error:', innerErr);
        }
      }
    } catch (err) {
      console.warn('Flashcard parse error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const card = flashcards[currentIdx] || flashcards[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-[#090B16] border border-amber-500/30 p-6 shadow-2xl space-y-4 shadow-glow-rose">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Interactive AI Flashcard Quiz</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Topic Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Topic (e.g. Machine Learning, Calculus, Python)..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl bg-black border border-white/10 text-white text-xs font-sans focus:border-amber-400 focus:outline-none"
          />
          <button
            onClick={handleGenerateCards}
            disabled={isGenerating || !topic.trim()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-rose-400 text-black font-bold text-xs flex items-center gap-1 shadow-glow-rose"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? '...' : 'Generate'}</span>
          </button>
        </div>

        {/* Flip Flashcard Card */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-full h-52 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0A0C18] border border-amber-500/30 p-6 flex flex-col justify-between items-center text-center cursor-pointer select-none transition-transform hover:scale-[1.02] shadow-xl relative"
        >
          <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
            {isFlipped ? 'Answer (Click to Flip back)' : 'Question (Click to Reveal Answer)'}
          </span>

          <div className="text-sm font-semibold text-white leading-relaxed max-h-28 overflow-y-auto">
            {isFlipped ? card.a : card.q}
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-gray-400">
            <RotateCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Card {currentIdx + 1} of {flashcards.length}</span>
          </div>
        </div>

        {/* Next / Prev Controls */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={() => { setCurrentIdx(prev => Math.max(0, prev - 1)); setIsFlipped(false); }}
            disabled={currentIdx === 0}
            className="px-4 py-1.5 rounded-xl bg-white/[0.04] text-gray-300 disabled:opacity-30 text-xs font-mono"
          >
            ← Previous
          </button>

          <button
            onClick={() => { setCurrentIdx(prev => Math.min(flashcards.length - 1, prev + 1)); setIsFlipped(false); }}
            disabled={currentIdx === flashcards.length - 1}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-rose-400 text-black font-bold text-xs font-mono disabled:opacity-30 flex items-center gap-1"
          >
            <span>Next Card</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
