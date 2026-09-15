import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  Code2, 
  Brain, 
  Sigma, 
  ScrollText, 
  Briefcase, 
  Copy, 
  Check, 
  Send, 
  ArrowRight,
  Lightbulb,
  Cpu
} from 'lucide-react';

const PROMPT_CATEGORIES = [
  { id: 'all', label: 'All Prompts', icon: Sparkles },
  { id: 'coding', label: 'Coding & Arch', icon: Code2 },
  { id: 'reasoning', label: 'Reasoning & Logic', icon: Brain },
  { id: 'math', label: 'Math & Science', icon: Sigma },
  { id: 'writing', label: 'Writing & Media', icon: ScrollText },
  { id: 'business', label: 'Business & PRD', icon: Briefcase }
];

const PROMPT_TEMPLATES = [
  // 1. Coding & Architecture
  {
    id: 'react-component',
    category: 'coding',
    title: 'Modern React 18 & Tailwind UI',
    description: 'Generates a sleek, accessible, responsive React 18 component with interactive states and Tailwind styling.',
    tags: ['React', 'Frontend', 'Tailwind'],
    prompt: `Create a modern, production-ready React 18 component formatted with Tailwind CSS for: [describe feature or UI element]. Include smooth hover/focus transitions, responsive layout, dark theme compatibility, and simulated interactive state.`
  },
  {
    id: 'debug-rca',
    category: 'coding',
    title: 'Root Cause Bug Investigator',
    description: 'Systematically diagnoses a software bug, provides root-cause explanation, and a minimal bug fix with regression prevention.',
    tags: ['Debugging', 'RCA', 'Fullstack'],
    prompt: `Act as a principal software engineer. Diagnose and fix the following bug/stack trace:\n\n[PASTE CODE OR ERROR HERE]\n\nProvide:\n1. Root Cause Analysis (why it happens)\n2. Fixed Code Snippet\n3. Edge cases and regression prevention tips`
  },
  {
    id: 'sql-optimizer',
    category: 'coding',
    title: 'SQL & Database Index Optimizer',
    description: 'Analyzes SQL query bottlenecks, recommends composite indexes, and rewrites queries for sub-millisecond execution.',
    tags: ['SQL', 'Database', 'Performance'],
    prompt: `Analyze and optimize the following SQL query for high concurrency and large data volumes:\n\n[PASTE SQL QUERY HERE]\n\nProvide:\n1. Optimized SQL rewrite (avoiding sequential scans)\n2. Recommended index strategy (B-Tree, GiST, Composite)\n3. Expected execution plan improvement`
  },
  {
    id: 'api-architect',
    category: 'coding',
    title: 'REST / GraphQL API Schema Design',
    description: 'Designs an elegant, production-grade RESTful or GraphQL API schema with pagination, filtering, and error handling.',
    tags: ['API', 'Architecture', 'Backend'],
    prompt: `Design an enterprise-grade RESTful API specification for: [specify system, e.g., Multi-Tenant Payment Engine]. Include:\n- Resource URIs with standard HTTP verbs\n- JSON Request/Response schemas with validation rules\n- Cursor-based pagination & error contract (RFC 7807)`
  },
  {
    id: 'security-audit',
    category: 'coding',
    title: 'Security Vulnerability & Threat Audit',
    description: 'Performs a comprehensive security assessment checking for OWASP Top 10 vulnerabilities, injection flaws, and auth pitfalls.',
    tags: ['Security', 'OWASP', 'Audit'],
    prompt: `Conduct a rigorous security vulnerability audit of the following code/architecture:\n\n[PASTE CODE HERE]\n\nCheck for OWASP Top 10 (SQLi, XSS, SSRF, CSRF, IDOR, Broken Access Control), rate limiting gaps, and cryptographic weaknesses. Provide remediations with secure code examples.`
  },

  // 2. Reasoning & Logic
  {
    id: 'first-principles',
    category: 'reasoning',
    title: 'First-Principles Deconstructor',
    description: 'Strips away assumptions and analogies to analyze a problem from fundamental, foundational truths.',
    tags: ['FirstPrinciples', 'Logic', 'Strategy'],
    prompt: `Deconstruct the following problem down to first principles:\n\n[DESCRIBE PROBLEM OR DILEMMA]\n\n1. Strip away all conventional assumptions and industry standard analogies\n2. Identify the core, immutable physical or mathematical truths\n3. Synthesize a novel, highly efficient solution built directly from the ground up`
  },
  {
    id: 'devils-advocate',
    category: 'reasoning',
    title: "Devil's Advocate & Red Team",
    description: 'Rigorously stress-tests a plan, hypothesis, or design by uncovering blind spots, counter-arguments, and hidden risks.',
    tags: ['RedTeam', 'CriticalThinking', 'Review'],
    prompt: `Act as a merciless Devil's Advocate and Red Team challenger. I am considering this proposal:\n\n[INSERT PROPOSAL OR DECISION]\n\nIdentify:\n- The 3 most fatal flaws or unexamined assumptions\n- Worst-case failure modes that could cause total collapse\n- Counter-arguments that a skeptical stakeholder or competitor would make`
  },
  {
    id: 'decision-matrix',
    category: 'reasoning',
    title: 'Weighted Decision Trade-off Matrix',
    description: 'Compares competing options across weighted dimensions (cost, scalability, velocity, risk) in a clean comparison table.',
    tags: ['DecisionMaking', 'Comparison', 'Matrix'],
    prompt: `Create an objective, weighted trade-off decision matrix comparing:\n\nOptions: [Option A vs Option B vs Option C]\nContext: [Explain business or technical constraints]\n\nEvaluate each option across Speed to Market, Scalability, Cost, Maintenance Burden, and Risk with a scored table (1-10) and executive recommendation.`
  },

  // 3. Math & Science
  {
    id: 'katex-proof',
    category: 'math',
    title: 'Formal Mathematical Proof (KaTeX)',
    description: 'Derives an Olympiad-level mathematical theorem or calculus derivation with rigorous, step-by-step KaTeX notation.',
    tags: ['Math', 'LaTeX', 'KaTeX', 'Proof'],
    prompt: `Provide a formal mathematical derivation and proof for: [insert theorem or problem]. Format all mathematical expressions in valid KaTeX LaTeX with clear step-by-step commentary and lemma citations.`
  },
  {
    id: 'big-o-analysis',
    category: 'math',
    title: 'Big-O Complexity & Space Decomposition',
    description: 'Formally proves the exact time and space complexity of an algorithm using recurrence relations or iteration analysis.',
    tags: ['Algorithms', 'Big-O', 'ComputerScience'],
    prompt: `Perform a rigorous asymptotic time and space complexity analysis for the following algorithm:\n\n[PASTE ALGORITHM OR CODE]\n\nProvide:\n- Best, Average, and Worst-case time complexity (Big-O, Big-Omega, Big-Theta)\n- Auxiliary memory space analysis\n- Can this be optimized to a lower complexity class? If so, demonstrate how.`
  },

  // 4. Writing & Media
  {
    id: 'executive-summary',
    category: 'writing',
    title: 'Executive Briefing & Strategic TL;DR',
    description: 'Transforms a long, complex document or technical log into a concise 1-page executive brief with action items.',
    tags: ['Executive', 'Summary', 'Communication'],
    prompt: `Transform the following dense material into a crisp, high-impact Executive Briefing for leadership:\n\n[PASTE DOCUMENT OR NOTES]\n\nStructure:\n1. Executive Summary (3 sentences)\n2. Key Metrics & Strategic Takeaways\n3. High-Priority Action Items & Deadlines\n4. Risks & Mitigations`
  },
  {
    id: 'tech-rfc',
    category: 'writing',
    title: 'Engineering RFC & Architectural Spec',
    description: 'Drafts a standard Request For Comments (RFC) engineering document covering motivation, design, and rollout phases.',
    tags: ['RFC', 'Documentation', 'Engineering'],
    prompt: `Draft a comprehensive Engineering RFC (Request For Comments) for: [describe engineering initiative]. Follow standard industry conventions:\n- Abstract & Motivation\n- Detailed Technical Design & Data Models\n- Alternatives Considered\n- Cross-Cutting Concerns (Security, Observability, Migration)\n- Phased Rollout Plan`
  },
  {
    id: 'video-hook',
    category: 'writing',
    title: 'Cinematic Hook & Script Outline',
    description: 'Crafts an irresistible opening hook and structured screenplay beats for a high-retention video or documentary.',
    tags: ['Script', 'Cinematic', 'Hook', 'YouTube'],
    prompt: `Write an irresistible 30-second cinematic opening hook and 3-act narrative script outline for a video about: [insert topic]. Include visual camera direction, sound design cues, and pacing instructions to maximize audience retention.`
  },

  // 5. Business & Product
  {
    id: 'prd-generator',
    category: 'business',
    title: 'Complete Product Requirement Doc (PRD)',
    description: 'Synthesizes user needs, user stories, acceptance criteria, and edge cases into a polished product spec.',
    tags: ['PRD', 'ProductManagement', 'Agile'],
    prompt: `Write an exhaustive Product Requirement Document (PRD) for: [describe new feature or product]. Include:\n1. User Personas & Problem Statement\n2. Key Functional Requirements with acceptance criteria\n3. Non-functional Requirements (Performance, Security, A11y)\n4. Out of Scope items\n5. Success Metrics (KPIs, North Star)`
  },
  {
    id: 'pitch-narrative',
    category: 'business',
    title: 'High-Stakes Startup Pitch Narrative',
    description: 'Structures a compelling investment pitch narrative demonstrating problem urgency, moat, traction, and market size.',
    tags: ['Startup', 'Pitch', 'VentureCapital'],
    prompt: `Craft a compelling startup investment pitch deck narrative for: [describe venture]. Structure into the classic 10-slide venture narrative:\n1. The Bleeding-Neck Problem\n2. The Unfair Solution & Proprietary Moat\n3. Market Opportunity (TAM / SAM / SOM)\n4. Business Model & Unit Economics\n5. Visionary Ask & Milestones`
  }
];

export default function PromptLibraryModal({ isOpen, onClose, onSelectPrompt, onRunPrompt }) {
  if (!isOpen) return null;

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const filteredPrompts = PROMPT_TEMPLATES.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = async (id, promptText, e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl bg-[#0B0E17] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-black/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Practical Prompt Templates Library</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {PROMPT_TEMPLATES.length} Expert Prompts
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Curated, production-grade instructions designed for maximum output precision.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 border-b border-white/5 bg-black/20 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts by keyword, skill, tag, or topic..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {PROMPT_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold shadow-sm'
                      : 'bg-white/[0.03] hover:bg-white/[0.08] text-gray-400 hover:text-gray-200 border border-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Prompt Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 custom-scrollbar">
          {filteredPrompts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 space-y-2">
              <Sparkles className="w-8 h-8 mx-auto text-gray-600" />
              <p className="text-sm">No prompts matched your search query "{searchQuery}".</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="text-xs text-cyan-400 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredPrompts.map((item) => (
              <div
                key={item.id}
                className="group p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-cyan-500/30 transition-all flex flex-col justify-between gap-3 shadow-sm hover:shadow-glow-cyan/20"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                      <span>{item.title}</span>
                    </h3>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleCopy(item.id, item.prompt, e)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="Copy Prompt"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-gray-400 border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Preview of prompt text */}
                  <div className="mt-2 p-2.5 rounded-lg bg-black/40 border border-white/5 font-mono text-[11px] text-gray-300 line-clamp-2">
                    {item.prompt}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => {
                      onSelectPrompt(item.prompt);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-200 hover:text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer"
                  >
                    <span>Insert into Input</span>
                    <ArrowRight className="w-3 h-3 text-gray-400" />
                  </button>

                  <button
                    onClick={() => {
                      onRunPrompt(item.prompt);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black text-xs font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Run Immediately</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>Powered by</span>
            <a 
              href="https://giri-corporation.pages.dev/" 
              target="_blank" 
              rel="noreferrer"
              className="text-cyan-400 hover:underline font-semibold"
            >
              Giri Corporation
            </a>
          </div>
          <span>Tip: Type <code className="text-cyan-300 font-mono">/prompts</code> in chat to open anytime</span>
        </div>
      </div>
    </div>
  );
}
