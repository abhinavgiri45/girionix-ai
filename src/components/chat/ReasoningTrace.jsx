import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Brain, CheckCircle2 } from 'lucide-react';

export default function ReasoningTrace({ reasoning, isThinking = false }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!reasoning && !isThinking) return null;

  return (
    <div className="my-3 rounded-xl border border-purple-500/30 bg-purple-950/20 backdrop-blur-md overflow-hidden transition-all duration-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between bg-purple-900/30 hover:bg-purple-900/40 text-left transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-purple-500/20 text-purple-300">
            <Brain className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-purple-200 flex items-center gap-1.5">
            {isThinking ? (
              <>
                <span>Reasoning Chain (Deep Thinking)...</span>
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              </>
            ) : (
              <>
                <span>Thought Process & Derivation Path</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              </>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-purple-300 font-mono">
          <span>{isExpanded ? 'Hide' : 'Show'} Trace</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {isExpanded && (
        <div className="p-3.5 text-xs text-purple-200/90 font-mono leading-relaxed bg-black/40 border-t border-purple-500/20 max-h-72 overflow-y-auto whitespace-pre-wrap selection:bg-purple-500/40">
          {reasoning || 'Formulating logical hypothesis and checking boundary conditions...'}
        </div>
      )}
    </div>
  );
}
