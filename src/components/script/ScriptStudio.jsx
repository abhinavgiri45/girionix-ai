import React, { useState, useEffect, useRef } from 'react';
import { 
  ScrollText, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  Wand2, 
  Flame, 
  Layers, 
  Clock, 
  FileText, 
  Film, 
  Tv, 
  Mic, 
  Radio, 
  Sliders, 
  ChevronDown, 
  Plus, 
  Trash2,
  Maximize2,
  BookOpen,
  User,
  Quote,
  Sparkle,
  Upload,
  FileDown
} from 'lucide-react';
import { openrouter } from '../../services/openrouter';
import { localNeuralEngine } from '../../services/localNeuralEngine';
import { speech } from '../../services/speech';

const DEMO_SCREENPLAY = `TITLE: THE QUANTUM HEIST
AUTHOR: Abhinav Giri
FORMAT: Standard Screenplay (Fountain)

INT. OLYMPUS NEURAL LAB - NIGHT

Rain lashes violently against the reinforced panoramic glass. Cascading neon reflections from Neo-Tokyo illuminate the chrome workspace.

KAI (30s), a rogue neuro-architect in a rain-slicked duster, furiously typelines into a holographic terminal. 

On screen: a glowing multidimensional neural hypercube pulses at 98.4% capacity.

KAI
(into throat mic, breathless)
Vesper, the firewall is mutating. We have less than forty seconds before the orbital defense grids lock on this floor.

VESPER (V.O.)
(through neural link, steady)
I'm already through the sub-level quantum relays, Kai. Extract the core weights now. Don't look back.

Kai slams his palm onto the biometric glass. A blinding cyan shockwave ripples across the terminal.

The neural hypercube decompresses. Millions of holographic tensor streams orbit his fingertips.

KAI
Got it. The sovereign weights are ours.

Suddenly -- 

RED WARNING STROBES pierce the darkness. A deep hydraulic THUD echoes from the heavy reinforced blast doors.

AUTOMATED DEFENSE AI (V.O.)
Security breach detected in Sector 4. Lethal countermeasures engaged.

KAI
(grins)
Right on time.

Kai sprints toward the shattered glass window and dives into the neon-lit abyss.

FADE TO BLACK.`;

const SCRIPT_TEMPLATES = [
  {
    id: 'scifi',
    title: '🚀 Cyberpunk Sci-Fi Heist',
    genre: 'Cinema Feature',
    prompt: 'Write a high-stakes cyberpunk thriller scene where an AI engineer infiltrates an orbital server mainframe to liberate a sovereign open-source model.'
  },
  {
    id: 'youtube',
    title: '🎬 Viral YouTube Tech Essay',
    genre: 'Creator Content',
    prompt: 'Write a high-retention 3-minute YouTube video script with an irresistible psychological hook, 3 rapid value points, and a punchy call-to-action on the future of autonomous AI.'
  },
  {
    id: 'thriller',
    title: '🧠 Psychological Mystery',
    genre: 'Drama / Suspense',
    prompt: 'Write an intense dialogue-driven thriller scene between a detective and a brilliant mathematician who predicted an impossible crime using differential calculus.'
  },
  {
    id: 'podcast',
    title: '🎙️ Deep Narrative Podcast',
    genre: 'Audio Documentary',
    prompt: 'Write an atmospheric audio documentary intro exploring the philosophical discovery of quantum computing, with ambient sound cues and cinematic voiceover narration.'
  }
];

export default function ScriptStudio({ activeModel, isLocalMode = false }) {
  const [scriptContent, setScriptContent] = useState(DEMO_SCREENPLAY);
  const [copied, setCopied] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('fountain'); // 'fountain' | 'screenplay' | 'youtube'
  const [isTableReading, setIsTableReading] = useState(false);
  const [currentSpokenLine, setCurrentSpokenLine] = useState(-1);
  const [readSpeed, setReadSpeed] = useState(1.0);
  const [selectedVoice, setSelectedVoice] = useState('nova');
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'editor' | 'preview'
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'beats' | 'characters'

  const textareaRef = useRef(null);
  const tableReadTimerRef = useRef(null);

  // Calculate Screenplay Stats
  const lines = scriptContent.split('\n');
  const wordCount = scriptContent.trim() ? scriptContent.trim().split(/\s+/).length : 0;
  // Standard Hollywood rule: ~55 lines = 1 page = ~1 minute of screen time
  const estimatedPages = (lines.length / 54).toFixed(1);
  const estimatedMinutes = Math.max(1, Math.round(wordCount / 140));

  // Character Extraction
  const characterCounts = {};
  lines.forEach(line => {
    const trimmed = line.trim();
    // Standard screenplay character headings are all uppercase without punctuation
    if (trimmed.length > 1 && trimmed.length < 30 && /^[A-Z0-9\s()'. -]+$/.test(trimmed) && !trimmed.startsWith('INT.') && !trimmed.startsWith('EXT.') && !trimmed.startsWith('FADE') && !trimmed.startsWith('CUT')) {
      const charName = trimmed.replace(/\s*\(.*?\)/g, '').trim();
      if (charName) {
        characterCounts[charName] = (characterCounts[charName] || 0) + 1;
      }
    }
  });

  // Screenplay Formatter Helpers
  const insertElement = (prefix, placeholder, suffix = '\n\n') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = scriptContent.substring(start, end) || placeholder;

    const newText = scriptContent.substring(0, start) + '\n\n' + prefix + selectedText + suffix + scriptContent.substring(end);
    setScriptContent(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length + 2, start + prefix.length + 2 + selectedText.length);
    }, 10);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = (ext) => {
    const blob = new Blob([scriptContent], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `girionix_script_${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // AI Script Generation / Continuation
  const handleAiGenerate = async (customInstruction = null) => {
    const instruction = customInstruction || aiPrompt;
    if (!instruction.trim() || isGenerating) return;

    setIsGenerating(true);
    let generatedScript = '';

    const systemPrompt = `You are Girionix ScriptMaster Cinema, a world-class Hollywood screenplay writer, Emmy-winning narrative architect, and viral content strategist.
Format all output in pure, industry-standard Fountain / Hollywood Screenplay format:
- Scene headings in all caps: INT. LOCATION - DAY/NIGHT
- Action lines in clear present tense
- Character names in ALL CAPS centered above dialogue
- Dialogue in natural, sharp, character-driven rhythm
- Parentheticals (like this) where emotional delivery matters
- Scene transitions like CUT TO: or FADE OUT.
Output ONLY the screenplay scene text without markdown backticks or conversational preamble.`;

    try {
      if (isLocalMode || activeModel?.isLocal || !navigator.onLine) {
        await localNeuralEngine.generateStream({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Instruction: "${instruction}"\n\nCurrent Script Context:\n${scriptContent.slice(-1200)}` }
          ],
          model: 'girionix-pro',
          onChunk: (chunk, acc) => { generatedScript = acc; }
        });
      } else {
        await openrouter.streamChat({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Instruction: "${instruction}"\n\nCurrent Script Context:\n${scriptContent.slice(-1200)}` }
          ],
          model: activeModel?.id || 'deepseek/deepseek-r1',
          onChunk: (chunk, acc) => { generatedScript = acc; }
        });
      }

      const cleanScript = generatedScript.replace(/^```[a-zA-Z]*\n/i, '').replace(/```$/i, '').trim();
      if (cleanScript) {
        setScriptContent(prev => prev + '\n\n' + cleanScript);
        setAiPrompt('');
      }
    } catch (err) {
      console.warn('Script generation notice:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Table-Read / Teleprompter Speech Player
  const startTableRead = () => {
    if (isTableReading) {
      speech.stopSpeaking();
      setIsTableReading(false);
      clearTimeout(tableReadTimerRef.current);
      return;
    }

    setIsTableReading(true);
    speech.setVoiceProfile(selectedVoice);

    const nonBlankLines = lines.filter(l => l.trim().length > 0);
    let lineIdx = 0;

    const readNext = () => {
      if (lineIdx >= nonBlankLines.length) {
        setIsTableReading(false);
        setCurrentSpokenLine(-1);
        return;
      }

      const rawLine = nonBlankLines[lineIdx];
      setCurrentSpokenLine(lineIdx);

      // Clean scene directions and speak line naturally
      const spokenText = speech.naturalizeSpokenText(rawLine);

      speech.speak({
        text: spokenText,
        rate: readSpeed,
        onEnd: () => {
          lineIdx++;
          tableReadTimerRef.current = setTimeout(readNext, 350);
        },
        onError: () => {
          lineIdx++;
          tableReadTimerRef.current = setTimeout(readNext, 350);
        }
      });
    };

    readNext();
  };

  const [showExportMenu, setShowExportMenu] = useState(false);

  // 1. Export as Standard PDF Document (.pdf) via print stylesheet window
  const handleExportPDF = () => {
    const printWin = window.open('', '_blank', 'width=850,height=1100');
    if (!printWin) return;

    const formattedHtml = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '<div class="blank-line">&nbsp;</div>';
      if (trimmed.startsWith('INT.') || trimmed.startsWith('EXT.') || trimmed.startsWith('I/E.')) {
        return `<div class="slugline">${trimmed}</div>`;
      }
      if (trimmed.startsWith('FADE') || trimmed.startsWith('CUT TO:') || trimmed.endsWith('TO:')) {
        return `<div class="transition">${trimmed}</div>`;
      }
      if (/^[A-Z0-9\s()'. -]+$/.test(trimmed) && trimmed.length < 35 && !trimmed.includes('.')) {
        return `<div class="character">${trimmed}</div>`;
      }
      if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
        return `<div class="parenthetical">${trimmed}</div>`;
      }
      return `<div class="action-or-dialogue">${trimmed}</div>`;
    }).join('\n');

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>Screenplay_${Date.now()}</title>
  <style>
    @page { size: letter; margin: 1in 1in 1in 1.5in; }
    body {
      font-family: 'Courier Prime', 'Courier New', Courier, monospace;
      font-size: 12pt;
      line-height: 1.0;
      color: #000000;
      background: #FFFFFF;
      margin: 0;
      padding: 20px;
    }
    .slugline { font-weight: bold; text-transform: uppercase; margin-top: 18pt; margin-bottom: 6pt; }
    .action-or-dialogue { margin-bottom: 6pt; text-align: justify; max-width: 60ch; }
    .character { margin-left: 2.2in; margin-top: 12pt; margin-bottom: 0; text-transform: uppercase; }
    .parenthetical { margin-left: 1.6in; max-width: 25ch; margin-bottom: 0; }
    .transition { margin-left: 4.0in; text-transform: uppercase; margin-top: 12pt; margin-bottom: 12pt; font-weight: bold; }
    .blank-line { height: 12pt; }
  </style>
</head>
<body>
  ${formattedHtml}
  <script>
    window.onload = function() { window.print(); }
  </script>
</body>
</html>`;

    printWin.document.open();
    printWin.document.write(htmlContent);
    printWin.document.close();
    setShowExportMenu(false);
  };

  // 2. Export as Word Document (.docx / .doc)
  const handleExportDOCX = (ext = 'docx') => {
    const formattedHtml = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '<p style="margin:0; font-size:12pt;">&nbsp;</p>';
      if (trimmed.startsWith('INT.') || trimmed.startsWith('EXT.')) {
        return `<p style="margin:18pt 0 6pt 0; font-weight:bold; font-family:'Courier New', monospace; font-size:12pt; text-transform:uppercase;">${trimmed}</p>`;
      }
      if (/^[A-Z0-9\s()'. -]+$/.test(trimmed) && trimmed.length < 35 && !trimmed.includes('.')) {
        return `<p style="margin:12pt 0 0 2.2in; font-weight:bold; font-family:'Courier New', monospace; font-size:12pt; text-transform:uppercase;">${trimmed}</p>`;
      }
      if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
        return `<p style="margin:0 0 0 1.6in; font-style:italic; font-family:'Courier New', monospace; font-size:12pt;">${trimmed}</p>`;
      }
      return `<p style="margin:0 0 6pt 0; font-family:'Courier New', monospace; font-size:12pt;">${trimmed}</p>`;
    }).join('\n');

    const docContent = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>Girionix Screenplay</title>
  <style>body { font-family: 'Courier New', Courier, monospace; font-size: 12pt; }</style>
</head>
<body>${formattedHtml}</body>
</html>`;

    const blob = new Blob(['\ufeff' + docContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Screenplay_${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // 3. Export as Plain Text (.txt)
  const handleExportTXT = () => {
    const blob = new Blob([scriptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Screenplay_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // 4. Export as Fountain Screenplay (.fountain)
  const handleExportFountain = () => {
    const blob = new Blob([scriptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Screenplay_${Date.now()}.fountain`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // 5. Export as Project JSON (.json)
  const handleExportJSON = () => {
    const projectData = {
      version: '1.0.0',
      type: 'girionix_screenplay_project',
      exportedAt: new Date().toISOString(),
      scriptContent,
      stats: { wordCount, estimatedPages, estimatedMinutes }
    };
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Girionix_Screenplay_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handleImportScript = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target.result;
        if (file.name.endsWith('.json')) {
          const data = JSON.parse(text);
          if (data.scriptContent) setScriptContent(data.scriptContent);
          else if (data.scriptText) setScriptContent(data.scriptText);
          else setScriptContent(text);
        } else {
          setScriptContent(text);
        }
      } catch (err) {
        console.error('Import script error:', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  useEffect(() => {
    return () => {
      speech.stopSpeaking();
      clearTimeout(tableReadTimerRef.current);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#060813] text-gray-200 overflow-hidden font-sans select-none" onClick={() => setShowExportMenu(false)}>
      {/* Top Studio Control Bar */}
      <div className="p-2.5 sm:p-3 border-b border-white/[0.08] bg-[#090C1A]/95 backdrop-blur-xl flex items-center justify-between gap-3 text-xs font-mono flex-wrap" onClick={(e) => e.stopPropagation()}>
        {/* Left: Branding & Formatting Toolbar */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-bold">
            <ScrollText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Screenplay Studio</span>
          </div>

          {/* Export Dropdown Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-mono transition-all cursor-pointer"
              title="Export Screenplay (.pdf, .docx, .doc, .txt, .fountain)"
            >
              <FileDown className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 text-indigo-300" />
            </button>

            {showExportMenu && (
              <div className="absolute left-0 mt-1.5 w-52 rounded-xl bg-[#0D1126] border border-white/10 shadow-2xl p-1.5 z-50 flex flex-col gap-0.5 text-xs font-mono backdrop-blur-2xl">
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indigo-500/20 text-gray-200 hover:text-white text-left transition-colors"
                >
                  <span className="text-rose-400 font-bold">PDF</span>
                  <span>Print / PDF Document (.pdf)</span>
                </button>
                <button
                  onClick={() => handleExportDOCX('docx')}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indigo-500/20 text-gray-200 hover:text-white text-left transition-colors"
                >
                  <span className="text-blue-400 font-bold">DOCX</span>
                  <span>Word Document (.docx)</span>
                </button>
                <button
                  onClick={() => handleExportDOCX('doc')}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indigo-500/20 text-gray-200 hover:text-white text-left transition-colors"
                >
                  <span className="text-cyan-400 font-bold">DOC</span>
                  <span>Word 97-2003 (.doc)</span>
                </button>
                <button
                  onClick={handleExportTXT}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indigo-500/20 text-gray-200 hover:text-white text-left transition-colors"
                >
                  <span className="text-emerald-400 font-bold">TXT</span>
                  <span>Plain Text (.txt)</span>
                </button>
                <button
                  onClick={handleExportFountain}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indigo-500/20 text-gray-200 hover:text-white text-left transition-colors"
                >
                  <span className="text-purple-400 font-bold">FTN</span>
                  <span>Fountain (.fountain)</span>
                </button>
                <button
                  onClick={handleExportJSON}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indigo-500/20 text-gray-200 hover:text-white text-left transition-colors"
                >
                  <span className="text-amber-400 font-bold">JSON</span>
                  <span>Project Data (.json)</span>
                </button>
              </div>
            )}
          </div>

          {/* Import Button */}
          <label className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/10 text-xs font-mono transition-all cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Import</span>
            <input type="file" accept=".fountain,.txt,.json,.doc,.docx" onChange={handleImportScript} className="hidden" />
          </label>

          <div className="hidden sm:flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => insertElement('INT. ', 'LOCATION - DAY', '\n\n')}
              className="px-2 py-0.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              title="Insert Scene Heading"
            >
              Scene
            </button>
            <button
              onClick={() => insertElement('', 'Action description here...', '\n\n')}
              className="px-2 py-0.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              title="Insert Action Description"
            >
              Action
            </button>
            <button
              onClick={() => insertElement('', 'CHARACTER NAME', '\n')}
              className="px-2 py-0.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              title="Insert Character Name"
            >
              Character
            </button>
            <button
              onClick={() => insertElement('', '(parenthetical emotion)', '\n')}
              className="px-2 py-0.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              title="Insert Parenthetical"
            >
              Parenthetical
            </button>
            <button
              onClick={() => insertElement('', 'Dialogue spoken by character...', '\n\n')}
              className="px-2 py-0.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              title="Insert Dialogue"
            >
              Dialogue
            </button>
            <button
              onClick={() => insertElement('', 'CUT TO:', '\n\n')}
              className="px-2 py-0.5 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
              title="Insert Transition"
            >
              Transition
            </button>
          </div>
        </div>

        {/* Right: Teleprompter Table Read & Actions */}
        <div className="flex items-center gap-2">
          {/* Table-Read Voice Button */}
          <button
            onClick={startTableRead}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
              isTableReading
                ? 'bg-rose-500 text-white shadow-glow-rose animate-pulse'
                : 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40'
            }`}
            title="Read Screenplay Aloud with Neural Voice Actor"
          >
            {isTableReading ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isTableReading ? 'Stop Reading' : 'Table-Read Voice'}</span>
          </button>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-0.5 bg-black/50 p-0.5 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('editor')}
              className={`px-2 py-1 rounded-lg text-xs transition-all ${viewMode === 'editor' ? 'bg-indigo-500/30 text-indigo-300 font-bold' : 'text-gray-400 hover:text-white'}`}
              title="Editor View"
            >
              Editor
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-2 py-1 rounded-lg text-xs transition-all ${viewMode === 'split' ? 'bg-indigo-500/30 text-indigo-300 font-bold' : 'text-gray-400 hover:text-white'}`}
              title="Split View"
            >
              Split
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-2 py-1 rounded-lg text-xs transition-all ${viewMode === 'preview' ? 'bg-indigo-500/30 text-indigo-300 font-bold' : 'text-gray-400 hover:text-white'}`}
              title="Formatted Preview"
            >
              Preview
            </button>
          </div>

          <button
            onClick={() => handleDownloadFile('fountain')}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"
            title="Download .fountain Screenplay"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"
            title="Copy script text"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Screenplay Metrics HUD */}
      <div className="px-4 py-2 bg-gradient-to-r from-indigo-950/30 via-slate-900/60 to-purple-950/30 border-b border-white/5 flex items-center justify-between text-xs font-mono text-gray-400 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Pages: <strong className="text-white">{estimatedPages}</strong> (~55 lines/page)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Est. Runtime: <strong className="text-cyan-300">~{estimatedMinutes} min</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Quote className="w-3.5 h-3.5 text-purple-400" />
            <span>Words: <strong className="text-purple-300">{wordCount.toLocaleString()}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 uppercase">Characters:</span>
          {Object.keys(characterCounts).slice(0, 4).map(char => (
            <span key={char} className="px-2 py-0.5 rounded bg-white/5 text-[11px] text-gray-300 border border-white/10">
              {char} <strong className="text-indigo-400">({characterCounts[char]})</strong>
            </span>
          ))}
        </div>
      </div>

      {/* Main Workspace: Editor + Real-time Screenplay Formatted Preview */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Script Editor */}
        {(viewMode === 'editor' || viewMode === 'split') && (
          <div className={`h-full flex flex-col border-r border-white/10 bg-[#070914] ${viewMode === 'split' ? 'w-full md:w-1/2' : 'w-full'}`}>
            <textarea
              ref={textareaRef}
              value={scriptContent}
              onChange={(e) => setScriptContent(e.target.value)}
              placeholder="Write or generate your screenplay here in Fountain format..."
              spellCheck="false"
              className="flex-1 w-full bg-transparent p-5 text-xs sm:text-sm font-mono text-gray-200 placeholder-gray-600 focus:outline-none resize-none leading-relaxed tracking-wide selection:bg-indigo-500/30 selection:text-indigo-200"
            />
          </div>
        )}

        {/* Right: Hollywood Formatted Screenplay Typography Preview */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`h-full flex flex-col bg-[#050711] overflow-y-auto ${viewMode === 'split' ? 'w-full md:w-1/2' : 'w-full'}`}>
            <div className="p-6 sm:p-8 max-w-xl mx-auto w-full space-y-4 font-mono text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-[11px] text-gray-400 mb-4 flex items-center justify-between">
                <span>🎬 Courier Prime 12pt Standard Layout</span>
                <span className="text-indigo-400">1 Page ≈ 1 Min Screen Time</span>
              </div>

              {lines.map((line, idx) => {
                const trimmed = line.trim();
                const isHeading = trimmed.startsWith('INT.') || trimmed.startsWith('EXT.') || trimmed.startsWith('I/E.');
                const isTransition = trimmed.startsWith('CUT TO:') || trimmed.startsWith('FADE') || trimmed.startsWith('DISSOLVE');
                const isCharacter = trimmed.length > 1 && trimmed.length < 30 && /^[A-Z0-9\s()'. -]+$/.test(trimmed) && !isHeading && !isTransition;
                const isParenthetical = trimmed.startsWith('(') && trimmed.endsWith(')');

                const isSpoken = currentSpokenLine === idx;

                if (!trimmed) {
                  return <div key={idx} className="h-3" />;
                }

                if (isHeading) {
                  return (
                    <div key={idx} className={`font-black text-white uppercase tracking-wider py-1 ${isSpoken ? 'bg-indigo-500/20 text-indigo-300 rounded px-2' : ''}`}>
                      {trimmed}
                    </div>
                  );
                }

                if (isCharacter) {
                  return (
                    <div key={idx} className={`text-center font-bold text-amber-300 uppercase tracking-widest pt-2 ${isSpoken ? 'bg-indigo-500/20 rounded px-2' : ''}`}>
                      {trimmed}
                    </div>
                  );
                }

                if (isParenthetical) {
                  return (
                    <div key={idx} className={`text-center text-gray-400 italic text-[11px] ${isSpoken ? 'bg-indigo-500/20 text-indigo-300 rounded px-2' : ''}`}>
                      {trimmed}
                    </div>
                  );
                }

                if (isTransition) {
                  return (
                    <div key={idx} className={`text-right font-bold text-indigo-400 uppercase tracking-wider py-1 ${isSpoken ? 'bg-indigo-500/20 rounded px-2' : ''}`}>
                      {trimmed}
                    </div>
                  );
                }

                // Standard Action / Dialogue lines
                return (
                  <div 
                    key={idx} 
                    className={`leading-relaxed text-gray-300 ${
                      trimmed.startsWith('TITLE:') || trimmed.startsWith('AUTHOR:') 
                        ? 'text-center font-bold text-indigo-400' 
                        : ''
                    } ${isSpoken ? 'bg-indigo-500/30 text-white rounded p-1 shadow-glow-cyan' : ''}`}
                  >
                    {trimmed}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom AI Co-Pilot Script Generator & Prompt Bar */}
      <div className="p-3 border-t border-white/10 bg-[#080A18]/95 backdrop-blur-xl space-y-2">
        {/* Quick Inspiration Templates */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[10px] uppercase font-mono text-gray-500 shrink-0">Templates:</span>
          {SCRIPT_TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => handleAiGenerate(t.prompt)}
              disabled={isGenerating}
              className="px-2.5 py-1 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/[0.08] text-xs font-mono transition-all whitespace-nowrap shrink-0 flex items-center gap-1"
            >
              <span>{t.title}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center bg-black/60 rounded-2xl border border-white/10 focus-within:border-indigo-500/40 p-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400 ml-2 mr-1 shrink-0" />
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
              placeholder="Ask Girionix to write next scene, create dialogue punch-up, or generate character backstory..."
              className="flex-1 bg-transparent px-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none"
            />
          </div>

          <button
            onClick={() => handleAiGenerate()}
            disabled={!aiPrompt.trim() || isGenerating}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 text-white font-bold text-xs font-mono transition-all shadow-glow-cyan flex items-center gap-1.5 disabled:opacity-40 shrink-0 cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Synthesizing Scene...' : 'Write Scene'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
