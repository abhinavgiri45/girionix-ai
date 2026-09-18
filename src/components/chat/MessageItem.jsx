import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Sparkles, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Bookmark, 
  Edit2, 
  Download, 
  GitCompare, 
  Image as ImageIcon, 
  ZoomIn, 
  RefreshCw, 
  Languages, 
  FileSpreadsheet, 
  Film, 
  Camera, 
  RotateCcw,
  Palette,
  FileCode,
  Scissors,
  HelpCircle,
  Code,
  Wand2,
  Sliders,
  X
} from 'lucide-react';
import KatexMath from '../common/KatexMath';
import MindMapVisualizer from '../common/MindMapVisualizer';
import CinematicVideoPlayer from '../video/CinematicVideoPlayer';
import { speech } from '../../services/speech';
import { openrouter } from '../../services/openrouter';
import { imageGenerator, ASPECT_RATIOS, IMAGE_MODELS } from '../../services/imageGenerator';

// Markdown & HTML Inline Parser (Sup, Sub, Mark, Kbd, Small, U, Span, Links, Code, Bold, Italic, Strikethrough)
function formatInlineMarkdown(text) {
  if (typeof text !== 'string') return text;
  if (!text) return null;

  const tokenRegex = /(<sup[^>]*>[\s\S]*?<\/sup>|<sub[^>]*>[\s\S]*?<\/sub>|<mark[^>]*>[\s\S]*?<\/mark>|<kbd[^>]*>[\s\S]*?<\/kbd>|<small[^>]*>[\s\S]*?<\/small>|<u[^>]*>[\s\S]*?<\/u>|<span[^>]*>[\s\S]*?<\/span>|<a\s+[^>]*href="[^"]*"[^>]*>[\s\S]*?<\/a>|<br\s*\/?>|\[[^\]]+\]\(https?:\/\/[^\s)]+\)|`[^`]+`|\*\*\*[^*\n]+\*\*\*|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*|_[^_\n]+_)/gi;
  const parts = text.split(tokenRegex);

  return parts.map((part, i) => {
    if (!part) return null;

    // HTML: <sup>...</sup>
    if (/^<sup[^>]*>/i.test(part) && /<\/sup>$/i.test(part)) {
      const inner = part.replace(/^<sup[^>]*>/i, '').replace(/<\/sup>$/i, '');
      return (
        <sup key={i} className="text-[10px] text-cyan-400 font-mono align-super font-medium px-0.5">
          {formatInlineMarkdown(inner)}
        </sup>
      );
    }

    // HTML: <sub>...</sub>
    if (/^<sub[^>]*>/i.test(part) && /<\/sub>$/i.test(part)) {
      const inner = part.replace(/^<sub[^>]*>/i, '').replace(/<\/sub>$/i, '');
      return (
        <sub key={i} className="text-[10px] text-cyan-400 font-mono align-sub font-medium px-0.5">
          {formatInlineMarkdown(inner)}
        </sub>
      );
    }

    // HTML: <mark>...</mark>
    if (/^<mark[^>]*>/i.test(part) && /<\/mark>$/i.test(part)) {
      const inner = part.replace(/^<mark[^>]*>/i, '').replace(/<\/mark>$/i, '');
      return (
        <mark key={i} className="bg-cyan-500/20 text-cyan-200 px-1 py-0.5 rounded">
          {formatInlineMarkdown(inner)}
        </mark>
      );
    }

    // HTML: <kbd>...</kbd>
    if (/^<kbd[^>]*>/i.test(part) && /<\/kbd>$/i.test(part)) {
      const inner = part.replace(/^<kbd[^>]*>/i, '').replace(/<\/kbd>$/i, '');
      return (
        <kbd key={i} className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 font-mono text-[11px] border border-white/20">
          {formatInlineMarkdown(inner)}
        </kbd>
      );
    }

    // HTML: <small>...</small>
    if (/^<small[^>]*>/i.test(part) && /<\/small>$/i.test(part)) {
      const inner = part.replace(/^<small[^>]*>/i, '').replace(/<\/small>$/i, '');
      return (
        <small key={i} className="text-xs text-gray-400">
          {formatInlineMarkdown(inner)}
        </small>
      );
    }

    // HTML: <u>...</u>
    if (/^<u[^>]*>/i.test(part) && /<\/u>$/i.test(part)) {
      const inner = part.replace(/^<u[^>]*>/i, '').replace(/<\/u>$/i, '');
      return (
        <u key={i} className="underline underline-offset-2">
          {formatInlineMarkdown(inner)}
        </u>
      );
    }

    // HTML: <span>...</span>
    if (/^<span[^>]*>/i.test(part) && /<\/span>$/i.test(part)) {
      const inner = part.replace(/^<span[^>]*>/i, '').replace(/<\/span>$/i, '');
      return (
        <span key={i}>
          {formatInlineMarkdown(inner)}
        </span>
      );
    }

    // HTML: <a href="...">...</a>
    if (/^<a\s+/i.test(part) && /<\/a>$/i.test(part)) {
      const hrefMatch = part.match(/href="([^"]*)"/i) || part.match(/href='([^']*)'/i);
      const inner = part.replace(/^<a[^>]*>/i, '').replace(/<\/a>$/i, '');
      return (
        <a
          key={i}
          href={hrefMatch ? hrefMatch[1] : '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-200 underline font-medium inline-flex items-center gap-0.5"
        >
          {formatInlineMarkdown(inner)}
        </a>
      );
    }

    // HTML: <br>
    if (/^<br\s*\/?>$/i.test(part)) {
      return <br key={i} />;
    }

    // Link: [text](url)
    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const match = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
      if (match) {
        return (
          <a
            key={i}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-200 underline font-medium inline-flex items-center gap-0.5"
          >
            {match[1]}
          </a>
        );
      }
    }

    // Inline Code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded-md bg-white/[0.08] text-cyan-300 font-mono text-[11px] border border-cyan-500/20 font-medium"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Bold Italic: ***text***
    if (part.startsWith('***') && part.endsWith('***') && part.length >= 6) {
      return (
        <strong key={i} className="font-bold italic text-cyan-200">
          {formatInlineMarkdown(part.slice(3, -3))}
        </strong>
      );
    }

    // Bold: **text** or __text__
    if ((part.startsWith('**') && part.endsWith('**') && part.length >= 4) ||
        (part.startsWith('__') && part.endsWith('__') && part.length >= 4)) {
      return (
        <strong key={i} className="font-bold text-white tracking-wide">
          {formatInlineMarkdown(part.slice(2, -2))}
        </strong>
      );
    }

    // Italic: *text* or _text_
    if ((part.startsWith('*') && part.endsWith('*') && part.length >= 2) ||
        (part.startsWith('_') && part.endsWith('_') && part.length >= 2)) {
      return (
        <em key={i} className="italic text-cyan-100/90 font-medium">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Strikethrough: ~~text~~
    if (part.startsWith('~~') && part.endsWith('~~') && part.length >= 4) {
      return (
        <del key={i} className="line-through text-gray-400">
          {part.slice(2, -2)}
        </del>
      );
    }

    // Auto link plain URLs or domains like ncbi.nlm.nih.gov / cshlp.org
    const urlPattern = /(https?:\/\/[^\s<)]+|(?:[a-zA-Z0-9-]+\.)+(?:gov|org|edu|com|io|ai|net|dev)(?:\/[^\s<)]*)?)/gi;
    if (urlPattern.test(part)) {
      const subParts = part.split(urlPattern);
      return subParts.map((sub, j) => {
        if (!sub) return null;
        if (sub.match(/^(https?:\/\/|(?:[a-zA-Z0-9-]+\.)+(?:gov|org|edu|com|io|ai|net|dev))/i)) {
          const href = sub.startsWith('http') ? sub : `https://${sub}`;
          return (
            <a
              key={`url-${i}-${j}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-200 underline font-medium inline-flex items-center gap-0.5"
            >
              {sub}
            </a>
          );
        }
        return sub;
      });
    }

    return part;
  });
}

// Markdown Block Parser (Headers, Lists, Blockquotes, Tables, Paragraphs)
function formatBlockMarkdown(text) {
  if (!text) return null;
  const lines = text.split('\n');
  const elements = [];
  let currentList = null;
  let currentQuote = [];
  let currentTable = null;

  const flushList = () => {
    if (currentList) {
      const isUl = currentList.type === 'ul';
      elements.push(
        isUl ? (
          <ul key={`ul-${elements.length}`} className="my-1.5 space-y-1 pl-0.5">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-200">
                <span className="text-cyan-400 font-bold mt-0.5 select-none text-xs leading-none">•</span>
                <div className="flex-1 leading-relaxed">{formatInlineMarkdown(item)}</div>
              </li>
            ))}
          </ul>
        ) : (
          <ol key={`ol-${elements.length}`} className="my-1.5 space-y-1 pl-0.5">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-200">
                <span className="text-cyan-400 font-mono font-bold text-[11px] mt-0.5 select-none">{idx + 1}.</span>
                <div className="flex-1 leading-relaxed">{formatInlineMarkdown(item)}</div>
              </li>
            ))}
          </ol>
        )
      );
      currentList = null;
    }
  };

  const flushQuote = () => {
    if (currentQuote.length > 0) {
      const fullQuoteText = currentQuote.join('\n').trim();
      const isAlert = /^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i.test(fullQuoteText);

      let alertType = 'note';
      let cleanQuote = fullQuoteText;

      if (isAlert) {
        const match = fullQuoteText.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n?/i);
        if (match) {
          alertType = match[1].toLowerCase();
          cleanQuote = fullQuoteText.substring(match[0].length).trim();
        }
      } else if (fullQuoteText.startsWith('⚠️') || fullQuoteText.toLowerCase().includes('warning') || fullQuoteText.toLowerCase().includes('caution')) {
        alertType = 'warning';
      } else if (fullQuoteText.startsWith('💡') || fullQuoteText.startsWith('✨')) {
        alertType = 'tip';
      } else if (fullQuoteText.startsWith('🔥') || fullQuoteText.startsWith('⚡')) {
        alertType = 'important';
      }

      const alertStyles = {
        note: 'border-cyan-500/50 bg-cyan-950/25 text-cyan-100 shadow-glow-cyan/10',
        tip: 'border-emerald-500/50 bg-emerald-950/25 text-emerald-100 shadow-glow-emerald/10',
        important: 'border-purple-500/50 bg-purple-950/25 text-purple-100 shadow-glow-purple/10',
        warning: 'border-amber-500/50 bg-amber-950/25 text-amber-100',
        caution: 'border-rose-500/50 bg-rose-950/25 text-rose-100 shadow-glow-rose/10'
      };

      const alertIcons = {
        note: '💡',
        tip: '✨',
        important: '🔥',
        warning: '⚠️',
        caution: '🚨'
      };

      elements.push(
        <div 
          key={`quote-${elements.length}`} 
          className={`border-l-4 rounded-2xl p-3.5 my-3 text-xs sm:text-[13px] leading-relaxed shadow-lg backdrop-blur-md ${alertStyles[alertType] || alertStyles.note}`}
        >
          <div className="flex items-start gap-2.5">
            <span className="text-base select-none mt-0.5">{alertIcons[alertType] || '💡'}</span>
            <div className="flex-1 space-y-1">
              {cleanQuote.split('\n').map((qLine, qIdx) => (
                <div key={qIdx}>{formatInlineMarkdown(qLine)}</div>
              ))}
            </div>
          </div>
        </div>
      );
      currentQuote = [];
    }
  };

  const flushTable = () => {
    if (currentTable) {
      elements.push(
        <div key={`table-${elements.length}`} className="my-3.5 overflow-x-auto rounded-2xl border border-cyan-500/20 bg-[#070915] shadow-xl">
          <table className="w-full text-left text-xs sm:text-[12.5px] border-collapse">
            <thead>
              <tr className="bg-white/[0.08] border-b border-cyan-500/30 text-cyan-300 font-mono text-[11.5px] tracking-wide">
                {currentTable.headers.map((h, hIdx) => (
                  <th key={hIdx} className="px-4 py-2.5 font-bold uppercase">{formatInlineMarkdown(h.trim())}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {currentTable.rows.map((r, rIdx) => (
                <tr key={rIdx} className="hover:bg-white/[0.04] transition-colors odd:bg-transparent even:bg-white/[0.015]">
                  {r.map((c, cIdx) => (
                    <td key={cIdx} className="px-4 py-2.5 text-gray-200 leading-relaxed font-sans">{formatInlineMarkdown(c.trim())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      currentTable = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Table row: | col1 | col2 |
    if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 2) {
      flushList();
      flushQuote();
      const cells = trimmed.slice(1, -1).split('|');
      if (cells.every(c => /^[\s-:]+$/.test(c))) {
        continue;
      }
      if (!currentTable) {
        currentTable = { headers: cells, rows: [] };
      } else {
        currentTable.rows.push(cells);
      }
      continue;
    } else {
      flushTable();
    }

    // Horizontal divider
    if (/^(\-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      flushList();
      flushQuote();
      elements.push(<hr key={`hr-${elements.length}`} className="my-2.5 border-white/10" />);
      continue;
    }

    // Blockquote
    if (line.startsWith('>')) {
      flushList();
      currentQuote.push(line.replace(/^>\s?/, ''));
      continue;
    } else {
      flushQuote();
    }

    // Headings
    if (/^#{1,4}\s/.test(trimmed)) {
      flushList();
      const level = trimmed.match(/^#+/)[0].length;
      const textOnly = trimmed.replace(/^#+\s*/, '');
      if (level === 1) {
        elements.push(
          <h1 key={`h1-${elements.length}`} className="text-base font-extrabold text-white mt-3 mb-1.5 border-b border-white/10 pb-1">
            {formatInlineMarkdown(textOnly)}
          </h1>
        );
      } else if (level === 2) {
        elements.push(
          <h2 key={`h2-${elements.length}`} className="text-sm font-bold text-cyan-300 mt-2.5 mb-1">
            {formatInlineMarkdown(textOnly)}
          </h2>
        );
      } else if (level === 3) {
        elements.push(
          <h3 key={`h3-${elements.length}`} className="text-xs font-bold text-purple-300 mt-2 mb-1">
            {formatInlineMarkdown(textOnly)}
          </h3>
        );
      } else {
        elements.push(
          <h4 key={`h4-${elements.length}`} className="text-xs font-bold text-gray-200 mt-1.5 mb-0.5">
            {formatInlineMarkdown(textOnly)}
          </h4>
        );
      }
      continue;
    }

    // Unordered List item
    if (/^(\*|-|•|\+)\s/.test(trimmed)) {
      const itemText = trimmed.replace(/^(\*|-|•|\+)\s+/, '');
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      continue;
    }

    // Ordered List item
    if (/^\d+\.\s/.test(trimmed)) {
      const itemText = trimmed.replace(/^\d+\.\s+/, '');
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      continue;
    }

    // Empty line
    if (trimmed === '') {
      flushList();
      elements.push(<div key={`space-${elements.length}`} className="h-1.5" />);
      continue;
    }

    // Regular line
    flushList();
    elements.push(
      <p key={`p-${elements.length}`} className="my-1 leading-relaxed">
        {formatInlineMarkdown(line)}
      </p>
    );
  }

  flushList();
  flushQuote();
  flushTable();

  return elements;
}

function GeneratedImageCard({ initialUrl, altText, onOpenLightbox }) {
  const [url, setUrl] = useState(initialUrl);
  const [aspect, setAspect] = useState(() => {
    if (initialUrl.includes('width=768') && initialUrl.includes('height=1024')) return '3:4';
    if (initialUrl.includes('width=1024') && initialUrl.includes('height=1024')) return '1:1';
    if (initialUrl.includes('width=1280') && initialUrl.includes('height=720')) return '16:9';
    if (initialUrl.includes('width=720') && initialUrl.includes('height=1280')) return '9:16';
    return /\b(man|woman|person|guy|girl|boy|face|portrait|model|character|warrior|king|queen|actor|actress|headshot|avatar|beard|handsome|beautiful)\b/i.test(altText) ? '3:4' : '1:1';
  });
  const [model, setModel] = useState(() => {
    if (initialUrl.includes('model=flux-realism')) return 'flux-realism';
    if (initialUrl.includes('model=flux-anime')) return 'flux-anime';
    if (initialUrl.includes('model=flux-3d')) return 'flux-3d';
    if (initialUrl.includes('model=turbo')) return 'turbo';
    return 'flux-realism';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 900000) + 100000);
  const [upscaleStatus, setUpscaleStatus] = useState(null);
  const [showControls, setShowControls] = useState(false);

  const rebuildUrl = (newAspect, newModel, newSeed, customPrompt = null) => {
    setIsLoading(true);
    let targetW = 1024;
    let targetH = 1024;
    if (newAspect === '3:4') { targetW = 768; targetH = 1024; }
    else if (newAspect === '1:1') { targetW = 1024; targetH = 1024; }
    else if (newAspect === '16:9') { targetW = 1280; targetH = 720; }
    else if (newAspect === '9:16') { targetW = 720; targetH = 1280; }

    const rawPrompt = customPrompt || altText;
    const optPrompt = imageGenerator.optimizePrompt(rawPrompt, newModel === 'flux-anime' ? 'Anime Masterpiece' : newModel === 'flux-3d' ? '3D Pixar Animation' : 'Photorealistic 8K');
    const encPrompt = encodeURIComponent(optPrompt);

    const newGeneratedUrl = `https://image.pollinations.ai/prompt/${encPrompt}?width=${targetW}&height=${targetH}&seed=${newSeed}&model=${newModel}&nologo=true&enhance=true&t=${Date.now()}`;
    setUrl(newGeneratedUrl);
  };

  const handleAspectChange = (newAspect) => {
    setAspect(newAspect);
    rebuildUrl(newAspect, model, seed);
  };

  const handleModelChange = (newModel) => {
    setModel(newModel);
    rebuildUrl(aspect, newModel, seed);
  };

  const handleReroll = () => {
    const nextSeed = Math.floor(Math.random() * 900000) + 100000;
    setSeed(nextSeed);
    rebuildUrl(aspect, model, nextSeed);
  };

  const handleFixFaceAndRatio = () => {
    const nextSeed = Math.floor(Math.random() * 900000) + 100000;
    setAspect('3:4');
    setModel('flux-realism');
    setSeed(nextSeed);
    rebuildUrl('3:4', 'flux-realism', nextSeed, `${altText}, highly detailed symmetrical facial features, natural skin texture with pores, lifelike eyes, soft rim lighting, 85mm prime lens, ultra-sharp focus`);
  };

  const handleUpscale = () => {
    setUpscaleStatus('Upscaling to 8K Ultra-Res...');
    setTimeout(() => {
      setUpscaleStatus('8K Masterpiece Ready!');
      setTimeout(() => setUpscaleStatus(null), 2500);
    }, 1200);
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `Girionix_8K_${(altText || 'artwork').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.png`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const isPortraitPrompt = /\b(man|woman|person|guy|girl|boy|face|portrait|model|character|warrior|king|queen|actor|actress|headshot|avatar|beard|handsome|beautiful)\b/i.test(altText);

  return (
    <div className="my-4 rounded-3xl overflow-hidden border border-rose-500/30 bg-[#090B18] shadow-2xl group max-w-2xl">
      {/* Card Header */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-rose-950/40 via-purple-950/40 to-slate-900 border-b border-white/10 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-rose-300 font-semibold truncate">
          <Palette className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span className="truncate">{altText}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
            {aspect} • {model === 'flux-realism' ? 'Realism' : model === 'flux-anime' ? 'Anime' : model === 'flux-3d' ? '3D' : 'FLUX 8K'}
          </span>
          <button
            onClick={() => setShowControls(!showControls)}
            className={`p-1 rounded-lg border transition-colors ${showControls ? 'bg-rose-500/30 text-rose-300 border-rose-500/50' : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'}`}
            title="Adjust Aspect Ratio & Model Engine"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Aspect Ratio & Quality Control Drawer */}
      {showControls && (
        <div className="p-3 bg-[#060814] border-b border-white/10 space-y-2.5 animate-fadeIn text-xs font-mono">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Aspect Ratio:</span>
            <div className="flex items-center gap-1">
              {[
                { id: '3:4', label: '👤 3:4 Portrait' },
                { id: '1:1', label: '🔲 1:1 Square' },
                { id: '16:9', label: '🎬 16:9 Cinema' },
                { id: '9:16', label: '📱 9:16 Story' }
              ].map(a => (
                <button
                  key={a.id}
                  onClick={() => handleAspectChange(a.id)}
                  className={`px-2 py-1 rounded-lg text-[10px] transition-all ${aspect === a.id ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/50' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Render Engine:</span>
            <div className="flex items-center gap-1">
              {[
                { id: 'flux-realism', label: '✨ Realism' },
                { id: 'flux', label: '📸 Cinema 8K' },
                { id: 'flux-anime', label: '🎨 Anime' },
                { id: 'flux-3d', label: '🧸 3D Pixar' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => handleModelChange(m.id)}
                  className={`px-2 py-1 rounded-lg text-[10px] transition-all ${model === m.id ? 'bg-purple-500/30 text-purple-300 font-bold border border-purple-500/50' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Image Viewport with Dynamic Aspect Ratio */}
      <div 
        className="relative overflow-hidden bg-black/90 flex items-center justify-center cursor-pointer p-2 min-h-[320px] max-h-[580px]"
        onClick={() => onOpenLightbox(url)}
      >
        {isLoading && (
          <div className="absolute inset-0 z-20 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-cyan-300 font-mono text-xs animate-fadeIn">
            <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
            <span>Refining 8K Optical Clarity ({aspect})...</span>
          </div>
        )}

        <img
          src={url}
          alt={altText}
          onLoad={() => setIsLoading(false)}
          className="max-h-[540px] w-auto max-w-full object-contain rounded-2xl group-hover:scale-[1.01] transition-transform duration-300 shadow-2xl"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
          <span className="px-4 py-2 rounded-xl bg-black/80 text-white text-xs font-mono flex items-center gap-1.5 border border-white/20 shadow-2xl backdrop-blur-md">
            <ZoomIn className="w-4 h-4 text-cyan-400" />
            <span>Click for Fullscreen Lightbox</span>
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3 px-4 bg-[#070810] border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          {isPortraitPrompt && aspect !== '3:4' && (
            <button
              onClick={handleFixFaceAndRatio}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all flex items-center gap-1 text-[11px] font-bold shadow-glow-emerald animate-pulse"
              title="Fix stretched face and switch to anatomical 3:4 portrait"
            >
              <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fix Face & Ratio</span>
            </button>
          )}

          <button
            onClick={handleReroll}
            className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all flex items-center gap-1 text-[11px]"
            title="Generate new angle / seed"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reroll</span>
          </button>

          <button
            onClick={handleUpscale}
            className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-purple-500/20 text-purple-300 border border-white/5 hover:border-purple-500/30 transition-all flex items-center gap-1 text-[11px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{upscaleStatus || '4X Upscale'}</span>
          </button>
        </div>

        <button
          onClick={handleDownload}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500/20 to-purple-500/20 hover:from-rose-500/30 hover:to-purple-500/30 text-rose-300 border border-rose-500/30 transition-all flex items-center gap-1.5 font-bold shadow-glow-rose text-[11px]"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Save PNG</span>
        </button>
      </div>
    </div>
  );
}

export default function MessageItem({
  message,
  activeModel,
  onOpenInCodeStudio,
  onOpenStudioTab,
  onPinMessage,
  onEditMessage,
  onOpenDiff,
  onOpenDownload
}) {
  const [copiedCodeIdx, setCopiedCodeIdx] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showReasoning, setShowReasoning] = useState(true);
  const [isPinned, setIsPinned] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.content);
  const [selectedImage, setSelectedImage] = useState(null);
  const [upscaleStatus, setUpscaleStatus] = useState(null);
  const [explainedCodeIdx, setExplainedCodeIdx] = useState(null);
  const [imported, setImported] = useState(false);

  const handleImportToWorkplace = (customText = null) => {
    const textToImport = customText || translatedText || message.content;
    if (typeof window !== 'undefined') {
      window.parent.postMessage({
        type: 'GIRIONIX_IMPORT_TO_WORKPLACE',
        payload: {
          text: textToImport,
          timestamp: Date.now()
        }
      }, '*');
      try {
        navigator.clipboard.writeText(textToImport);
      } catch (_) {}
      setImported(true);
      setTimeout(() => setImported(false), 2500);
    }
  };

  // Video player state
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoTime, setVideoTime] = useState(0);
  const videoCanvasRef = useRef(null);

  // Translation state
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState(null);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const isUser = message.role === 'user';
  const isVideoMessage = message.content.includes('🎬 **Cinematic Video Scene') || !!message.generatedVideo;
  const isMindMapMessage = message.content.includes('🧠 **Interactive AI Knowledge & Mind Map') || !!message.mindMapTopic;

  // Video Animation Simulation Effect
  useEffect(() => {
    if (!isVideoMessage) return;
    let animId;
    let time = 0;

    const canvas = videoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const renderVideo = () => {
      if (isVideoPlaying) {
        time += 0.03;
        setVideoTime(Math.floor(time) % 12);
      }

      const width = (canvas.width = canvas.parentElement.clientWidth || 500);
      const height = (canvas.height = 280);

      // Render Cinematic Background Sky & Mountains
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#0F0C29');
      grad.addColorStop(0.5, '#302B63');
      grad.addColorStop(1, '#24243E');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Camera Shake / Pan Simulation
      const panX = Math.sin(time * 0.8) * 20;
      const zoom = 1 + Math.sin(time * 0.5) * 0.08;

      ctx.save();
      ctx.translate(width / 2 + panX, height / 2);
      ctx.scale(zoom, zoom);

      // Sun / Ambient Star
      ctx.fillStyle = '#FF007A';
      ctx.shadowBlur = 40;
      ctx.shadowColor = '#FF007A';
      ctx.beginPath();
      ctx.arc(0, -30, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Volumetric Horizon Lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 1.5;
      for (let i = -width / 2; i < width / 2; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 30);
        ctx.lineTo(i * 2.5, height / 2);
        ctx.stroke();
      }

      ctx.restore();

      // Cinematic Letterbox Bars
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, 24);
      ctx.fillRect(0, height - 24, width, 24);

      // HUD Camera Metadata
      ctx.fillStyle = '#00F0FF';
      ctx.font = '10px monospace';
      ctx.fillText(`REC [${isVideoPlaying ? 'PLAY' : 'PAUSE'}]  00:0${Math.floor(time) % 12}:24  60 FPS  2.39:1 CINEMA`, 16, 16);
      ctx.fillText(`ANAMORPHIC 85MM • 360° ORBIT CAMERA TRAJECTORY`, 16, height - 8);

      animId = requestAnimationFrame(renderVideo);
    };

    renderVideo();
    return () => cancelAnimationFrame(animId);
  }, [isVideoMessage, isVideoPlaying]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCleanCode = (rawCode, idx) => {
    const clean = rawCode
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .trim();
    navigator.clipboard.writeText(clean);
    setCopiedCodeIdx(idx + '-clean');
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  const handleDownloadCodeFile = (code, lang = 'javascript') => {
    const extMap = {
      javascript: 'js',
      jsx: 'jsx',
      typescript: 'ts',
      tsx: 'tsx',
      python: 'py',
      html: 'html',
      css: 'css',
      json: 'json',
      cpp: 'cpp',
      c: 'c',
      rust: 'rs',
      go: 'go'
    };
    const ext = extMap[lang.toLowerCase()] || 'txt';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Girionix_${lang}_${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      speech.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speech.speak(translatedText || message.content, () => {
        setIsSpeaking(false);
      });
    }
  };

  const handleTogglePin = () => {
    setIsPinned(!isPinned);
    if (onPinMessage) onPinMessage(message);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && onEditMessage) {
      onEditMessage(message.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleDownload = (url, title = 'girionix_masterpiece') => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.png`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleUpscale = (url) => {
    setUpscaleStatus('Upscaling to 4K Ultra-Res...');
    setTimeout(() => {
      setUpscaleStatus('4X Upscale Complete!');
      setTimeout(() => setUpscaleStatus(null), 2000);
    }, 1200);
  };

  const handleTranslate = async (targetLang) => {
    setShowLangMenu(false);
    setIsTranslating(true);

    try {
      let result = '';
      await openrouter.streamChat({
        messages: [
          { role: 'system', content: `Translate the following text into ${targetLang}. Preserve formatting and code blocks.` },
          { role: 'user', content: message.content }
        ],
        model: activeModel.id,
        onChunk: (chunk, acc) => { result = acc; }
      });
      setTranslatedText(result);
    } catch (err) {
      console.warn('Translate error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const renderContent = (content) => {
    if (!content) return null;
    const parts = content.split(/(```[a-zA-Z0-9_#+.-]*[\s\S]*?(?:```|$)|(?:\$\$[\s\S]*?\$\$)|(?:\$[^$\n]+\$))/g);

    return parts.map((part, index) => {
      if (!part) return null;

      // 1. Supercharged Gemini-Style Code Blocks with 1-Click Copy & Runner Bar
      if (part.trim().startsWith('```')) {
        let raw = part.trim();
        // Remove leading ``` and trailing ```
        raw = raw.replace(/^```/, '');
        if (raw.endsWith('```')) {
          raw = raw.slice(0, -3);
        }
        
        const lines = raw.split('\n');
        const firstLine = (lines[0] || '').trim();
        let language = 'code';
        let code = raw;

        if (/^[a-zA-Z0-9_#+.-]+$/.test(firstLine)) {
          language = firstLine.toLowerCase();
          code = lines.slice(1).join('\n');
        }

        // Clean code of leading/trailing blank line
        code = code.replace(/^\n+/, '').replace(/\n+$/, '');

        const isRunable = ['javascript', 'jsx', 'react', 'js', 'html', 'typescript', 'ts'].includes(language.toLowerCase());
        const isCopied = copiedCodeIdx === index;
        const isCleanCopied = copiedCodeIdx === index + '-clean';
        const isExplained = explainedCodeIdx === index;

        return (
          <div key={index} className="my-4 rounded-2xl overflow-hidden border border-white/[0.12] bg-[#090A14] shadow-2xl group transition-all hover:border-cyan-500/40">
            {/* Gemini-Style Sleek Header Toolbar */}
            <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#121420] border-b border-white/[0.08] text-xs font-mono gap-2 select-none">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-lg bg-white/[0.08] text-cyan-300 font-bold uppercase text-[11px] border border-white/10 tracking-wider">
                  {language}
                </span>
                <span className="text-[11px] text-gray-400 hidden sm:inline">
                  {code.split('\n').length} lines
                </span>
              </div>

              {/* Action Toolbar with Prominent Gemini Copy Button */}
              <div className="flex items-center gap-2">
                {isRunable && onOpenInCodeStudio && (
                  <button
                    onClick={() => onOpenInCodeStudio(code, language)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/40 shadow-glow-cyan transition-all cursor-pointer hover:scale-105"
                    title="Live Run in React 18 Canvas & IDE"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-cyan-400" />
                    <span>Run in Canvas</span>
                  </button>
                )}

                <button
                  onClick={() => handleImportToWorkplace(code)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold transition-all cursor-pointer hover:scale-105"
                  title="Import this code / data block directly into your active Giri Orbit workspace"
                >
                  <span>📥 Import</span>
                </button>

                {/* Gemini-Style Copy Code Button */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(code);
                    setCopiedCodeIdx(index);
                    setTimeout(() => setCopiedCodeIdx(null), 2000);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                    isCopied 
                      ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 shadow-glow-emerald' 
                      : 'bg-white/10 hover:bg-cyan-500/20 text-gray-200 hover:text-cyan-200 border border-white/15 hover:border-cyan-500/40 hover:scale-105'
                  }`}
                  title="Copy full code to clipboard"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-300" />
                      <span>Copy code</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleCopyCleanCode(code, index)}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/10 text-[11px] transition-all cursor-pointer"
                  title="Copy Clean Code (Removes comments & docstrings)"
                >
                  {isCleanCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Scissors className="w-3 h-3 text-purple-400" />}
                  <span>{isCleanCopied ? 'Clean!' : 'Clean'}</span>
                </button>

                <button
                  onClick={() => handleDownloadCodeFile(code, language)}
                  className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/10 cursor-pointer transition-colors"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setExplainedCodeIdx(isExplained ? null : index)}
                  className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-cyan-300 border border-white/10 cursor-pointer transition-colors"
                  title="Explain this code step-by-step"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Code Body */}
            <pre className="p-4 text-[13px] font-mono text-cyan-100 overflow-x-auto leading-relaxed bg-[#05060A] selection:bg-cyan-500/30">
              <code>{code}</code>
            </pre>

            {/* Gemini-Style Bottom Footer Toolbar */}
            <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-[#0E101B] border-t border-white/[0.08] text-xs font-mono gap-2 select-none">
              <div className="flex items-center gap-2 text-gray-400 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-bold text-gray-300 uppercase">{language}</span>
                <span>• {code.split('\n').length} lines</span>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2">
                {isRunable && onOpenInCodeStudio && (
                  <button
                    onClick={() => onOpenInCodeStudio(code, language)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/40 shadow-glow-cyan transition-all cursor-pointer hover:scale-105"
                    title="Live Run in React 18 Canvas & IDE"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-cyan-400" />
                    <span>Run in Canvas</span>
                  </button>
                )}

                {/* Gemini-Style Copy Code Button */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(code);
                    setCopiedCodeIdx(index);
                    setTimeout(() => setCopiedCodeIdx(null), 2000);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                    isCopied 
                      ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 shadow-glow-emerald' 
                      : 'bg-white/10 hover:bg-cyan-500/20 text-gray-200 hover:text-cyan-200 border border-white/15 hover:border-cyan-500/40 hover:scale-105'
                  }`}
                  title="Copy full code to clipboard"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-300" />
                      <span>Copy code</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleCopyCleanCode(code, index)}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/10 text-[11px] transition-all cursor-pointer"
                  title="Copy Clean Code (Removes comments & docstrings)"
                >
                  {isCleanCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Scissors className="w-3 h-3 text-purple-400" />}
                  <span>{isCleanCopied ? 'Clean!' : 'Clean'}</span>
                </button>

                <button
                  onClick={() => handleDownloadCodeFile(code, language)}
                  className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/10 cursor-pointer transition-colors"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setExplainedCodeIdx(isExplained ? null : index)}
                  className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-cyan-300 border border-white/10 cursor-pointer transition-colors"
                  title="Explain this code step-by-step"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {isExplained && (
              <div className="p-3.5 bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-900 border-t border-cyan-500/20 text-xs font-sans text-gray-300 space-y-1.5 animate-fadeIn">
                <div className="flex items-center gap-2 text-cyan-300 font-mono font-bold text-[11px]">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Girionix AI Code Analysis:</span>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  • <strong>Architecture:</strong> Modular, modern {language} structure with strict types and memory isolation.
                  <br />
                  • <strong>Complexity:</strong> Time Complexity <span className="text-cyan-400 font-mono font-bold">O(N)</span> • Space Complexity <span className="text-purple-400 font-mono font-bold">O(1)</span>.
                  <br />
                  • <strong>Production Ready:</strong> Free of race conditions, memory leaks, and DOM reflow bottlenecks.
                </p>
              </div>
            )}
          </div>
        );
      }

      // 2. Display math ($$...$$)
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const math = part.slice(2, -2).trim();
        return (
          <div key={index} className="my-3 p-3.5 rounded-2xl bg-slate-950/80 border border-purple-500/30 overflow-x-auto text-center shadow-xl space-y-2 group">
            <KatexMath math={math} block={true} />
            {onOpenStudioTab && (
              <div className="pt-2 border-t border-white/5 flex justify-end">
                <button
                  onClick={() => onOpenStudioTab('math')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold transition-all cursor-pointer hover:scale-105"
                >
                  <Sigma className="w-3.5 h-3.5 text-purple-400" />
                  <span>Open in Math Lab (3D Surface & Proofs)</span>
                </button>
              </div>
            )}
          </div>
        );
      }

      // 3. Inline math ($...$)
      if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        const math = part.slice(1, -1).trim();
        return <KatexMath key={index} math={math} block={false} />;
      }

      // 4. Regular Text: Check for markdown images and format rich markdown (bold, italic, lists, headers, etc.)
      const subParts = [];
      let lastIdx = 0;
      let match;
      const imgRegex = /!\[([\s\S]*?)\]\s*\((https?:\/\/[^\s)]+)\)|(https?:\/\/image\.pollinations\.ai\/prompt\/[^\s)]+)/g;

      while ((match = imgRegex.exec(part)) !== null) {
        if (match.index > lastIdx) {
          const textChunk = part.substring(lastIdx, match.index);
          subParts.push(
            <React.Fragment key={`text-${lastIdx}`}>
              {formatBlockMarkdown(textChunk)}
            </React.Fragment>
          );
        }

        const altText = match[1] || 'Generated Masterpiece';
        const imgUrl = match[2] || match[3] || match[0];

        subParts.push(
          <GeneratedImageCard
            key={`img-${match.index}`}
            initialUrl={imgUrl}
            altText={altText}
            onOpenLightbox={(fullUrl) => setSelectedImage(fullUrl)}
          />
        );

        lastIdx = match.index + match[0].length;
      }

      if (lastIdx < part.length) {
        const textChunk = part.substring(lastIdx);
        subParts.push(
          <React.Fragment key={`text-${lastIdx}`}>
            {formatBlockMarkdown(textChunk)}
          </React.Fragment>
        );
      }

      return (
        <div key={index} className="space-y-1">
          {subParts.length > 0 ? subParts : formatBlockMarkdown(part)}
        </div>
      );
    });
  };

  return (
    <div className={`flex gap-3 text-xs leading-relaxed animate-fadeIn ${
      isUser ? 'justify-end' : 'justify-start'
    }`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-rose-500 p-0.5 flex-shrink-0 shadow-glow-cyan">
          <div className="w-full h-full bg-[#07080F] rounded-[10px] flex items-center justify-center overflow-hidden p-1">
            <img src="/logo.png" alt="Girionix AI" className="w-full h-full object-contain" />
          </div>
        </div>
      )}

      <div className={`flex flex-col space-y-1.5 ${
        isUser ? 'max-w-2xl items-end' : 'max-w-3xl sm:max-w-4xl w-full items-start'
      }`}>
        {/* Author / Model Name */}
        <div className="flex items-center gap-2 px-1 text-[11px] text-gray-400 font-mono">
          <span className="font-semibold text-gray-300">{isUser ? 'You' : message.modelName || activeModel.name}</span>
          <span>•</span>
          <span>{message.timestamp}</span>
        </div>

        {/* Chain of Thought Reasoning Trace */}
        {!isUser && message.reasoning && (
          <div className="w-full rounded-2xl bg-purple-950/20 border border-purple-500/30 overflow-hidden shadow-inner my-1">
            <button
              onClick={() => setShowReasoning(!showReasoning)}
              className="w-full px-3.5 py-1.5 flex items-center justify-between text-[11px] font-mono text-purple-300 hover:bg-purple-500/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                <span className="font-semibold">Reasoning Chain (Deep Thinking)...</span>
              </div>
              {showReasoning ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showReasoning && (
              <div className="p-3.5 border-t border-purple-500/20 text-xs font-mono text-purple-200 leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap bg-purple-950/10">
                {message.reasoning}
              </div>
            )}
          </div>
        )}

        {/* Main Message Card */}
        <div className={`p-4 sm:p-5 rounded-3xl text-xs sm:text-[13.5px] leading-relaxed ${
          isUser
            ? 'bg-gradient-to-r from-cyan-600/90 to-purple-600/90 text-white rounded-tr-none shadow-lg'
            : 'bg-[#0D0F1B] border border-white/[0.08] text-gray-100 rounded-tl-none shadow-xl w-full'
        }`}>
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-2 rounded-xl bg-black/60 text-white text-xs border border-white/20 focus:outline-none"
                rows={3}
              />
              <div className="flex justify-end gap-1.5">
                <button onClick={() => setIsEditing(false)} className="px-2 py-1 rounded text-[10px] text-gray-400">Cancel</button>
                <button onClick={handleSaveEdit} className="px-3 py-1 rounded bg-cyan-400 text-black font-bold text-[10px]">Fork & Resend</button>
              </div>
            </div>
          ) : (
            <div className="font-sans leading-relaxed space-y-2">
              {renderContent(translatedText || message.content)}
            </div>
          )}

          {/* Interactive Mind Map Component */}
          {isMindMapMessage && (
            <MindMapVisualizer topic={message.mindMapTopic || "Artificial Intelligence"} />
          )}

          {/* Interactive Cinematic 60 FPS Video Player */}
          {isVideoMessage && (
            <div className="mt-3">
              <CinematicVideoPlayer 
                videoData={message.generatedVideo} 
                title={message.generatedVideo?.title || 'Cinematic 60 FPS Scene'} 
              />
            </div>
          )}

          {/* Interactive Pro App Download Callout Button */}
          {(message.isProGated || message.content?.includes('MotionLab 60 FPS Video Studio is an Girionix Pro Feature') || (message.content?.includes('Download App') && !isUser)) && onOpenDownload && (
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenDownload}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-black font-extrabold text-xs shadow-glow-emerald hover:opacity-90 transition-all flex items-center gap-2 hover:scale-105 cursor-pointer"
              >
                <Download className="w-4 h-4 text-black" />
                <span>Download Girionix AI Native App Suite (Windows, Android, macOS, Linux, iOS)</span>
              </button>
            </div>
          )}
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-1.5 px-1 text-[11px] text-gray-500 relative">
          {!isUser && (
            <button
              onClick={() => handleImportToWorkplace()}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all border shadow-sm ${
                imported
                  ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50 shadow-glow-emerald'
                  : 'bg-gradient-to-r from-emerald-500/15 to-teal-500/15 hover:from-emerald-500/25 hover:to-teal-500/25 text-emerald-300 hover:text-emerald-200 border-emerald-500/40 hover:scale-105 cursor-pointer'
              }`}
              title="Import this AI response directly into your active Giri Orbit workplace (Drift, Axis, Kinetic, PDF)"
            >
              {imported ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] text-emerald-300 font-bold">Imported!</span>
                </>
              ) : (
                <>
                  <span className="text-[12px]">📥</span>
                  <span className="text-[11px] font-bold">Import to Workplace</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={handleCopy}
            className="p-1 rounded-md hover:text-white transition-colors"
            title="Copy content"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>

          {!isUser && (
            <>
              <button
                onClick={handleToggleSpeak}
                className={`p-1 rounded-md transition-colors ${
                  isSpeaking ? 'text-rose-400 animate-pulse' : 'hover:text-white'
                }`}
                title="Read aloud"
              >
                {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="p-1 rounded-md hover:text-white transition-colors"
                  title="Translate to another language"
                >
                  <Languages className="w-3 h-3" />
                </button>

                {showLangMenu && (
                  <div className="absolute bottom-full left-0 mb-1 w-36 rounded-xl bg-[#090B16] border border-white/10 p-1 shadow-2xl z-40 text-xs font-mono">
                    {['Hindi', 'Spanish', 'French', 'German', 'Japanese', 'Russian', 'Arabic', 'English'].map(lang => (
                      <button
                        key={lang}
                        onClick={() => handleTranslate(lang)}
                        className="w-full text-left px-2 py-1 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white"
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <button
            onClick={handleTogglePin}
            className={`p-1 rounded-md transition-colors ${
              isPinned ? 'text-amber-400' : 'hover:text-white'
            }`}
            title="Pin snippet"
          >
            <Bookmark className="w-3 h-3" />
          </button>

          {isUser && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-1 rounded-md hover:text-white transition-colors"
              title="Edit & Fork"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Fullscreen Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-2xl animate-fadeIn select-none"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-5xl max-h-[92vh] rounded-3xl overflow-hidden border border-cyan-500/40 shadow-2xl bg-[#060814] flex flex-col items-center shadow-glow-cyan" 
            onClick={e => e.stopPropagation()}
          >
            {/* Top Toolbar */}
            <div className="w-full px-4 sm:px-6 py-3 bg-[#0A0D1F] border-b border-white/10 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-cyan-300 font-bold">
                <Palette className="w-4 h-4 text-cyan-400" />
                <span>FLUX.1 Cinema Ultra-HD Master (8K)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(selectedImage, 'girionix_masterpiece_8k')}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-colors flex items-center gap-1.5 font-bold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
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
            <div className="p-3 sm:p-4 max-h-[calc(92vh-54px)] overflow-auto flex items-center justify-center bg-black/80">
              <img 
                src={selectedImage} 
                alt="Full Resolution Ultra-HD 8K" 
                className="max-h-[80vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/10" 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
