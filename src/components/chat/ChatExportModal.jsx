import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  Code, 
  FileJson, 
  Globe, 
  Sparkles,
  Share2,
  Calendar,
  Clock
} from 'lucide-react';

export default function ChatExportModal({ isOpen, onClose, session, activeModel }) {
  if (!isOpen || !session) return null;

  const [copiedFormat, setCopiedFormat] = useState(null);
  const [includeTimestamps, setIncludeTimestamps] = useState(true);
  const [includeModelInfo, setIncludeModelInfo] = useState(true);
  const [activeTab, setActiveTab] = useState('markdown');

  const messages = session.messages || [];
  const cleanMessages = messages.filter(m => m.id !== 'welcome');
  const sessionTitle = session.title || 'Girionix AI Conversation';
  const currentDate = new Date().toISOString().split('T')[0];

  const formatTimestamp = (ts) => {
    if (!ts) return '';
    try {
      return new Date(ts).toLocaleString();
    } catch {
      return '';
    }
  };

  // 1. Generate Markdown Content
  const generateMarkdown = () => {
    let md = `# ${sessionTitle}\n\n`;
    md += `> **Platform**: [Girionix AI](https://girionix-ai.pages.dev/)\n`;
    md += `> **Enterprise**: [Giri Corporation](https://giri-corporation.pages.dev/)\n`;
    md += `> **Date**: ${new Date().toLocaleDateString()}\n`;
    if (includeModelInfo && activeModel) {
      md += `> **Model**: ${activeModel.name || 'Girionix AI Frontier'}\n`;
    }
    md += `\n---\n\n`;

    cleanMessages.forEach((msg) => {
      const isUser = msg.role === 'user';
      const sender = isUser ? '👤 User' : '⚡ Girionix AI';
      const timeStr = includeTimestamps && msg.timestamp ? ` (${formatTimestamp(msg.timestamp)})` : '';
      
      md += `### ${sender}${timeStr}\n\n`;
      if (!isUser && includeModelInfo && msg.modelName) {
        md += `*Engine: ${msg.modelName}*\n\n`;
      }
      md += `${msg.content || ''}\n\n`;
      md += `---\n\n`;
    });

    return md;
  };

  // 2. Generate Plain Text
  const generatePlainText = () => {
    let txt = `=======================================================\n`;
    txt += `${sessionTitle.toUpperCase()}\n`;
    txt += `Exported from Girionix AI (Giri Corporation)\n`;
    txt += `Date: ${new Date().toLocaleString()}\n`;
    if (includeModelInfo && activeModel) {
      txt += `Model: ${activeModel.name || 'Girionix AI'}\n`;
    }
    txt += `=======================================================\n\n`;

    cleanMessages.forEach((msg) => {
      const isUser = msg.role === 'user';
      const timeStr = includeTimestamps && msg.timestamp ? ` [${formatTimestamp(msg.timestamp)}]` : '';
      txt += `[${isUser ? 'USER' : 'GIRIONIX AI'}]${timeStr}\n`;
      txt += `${'-'.repeat(40)}\n`;
      txt += `${msg.content || ''}\n\n`;
    });

    return txt;
  };

  // 3. Generate JSON
  const generateJSON = () => {
    const exportData = {
      title: sessionTitle,
      exportDate: new Date().toISOString(),
      platform: "Girionix AI",
      enterprise: "Giri Corporation",
      website: "https://giri-corporation.pages.dev/",
      activeModel: activeModel?.name || "Girionix AI Frontier",
      messageCount: cleanMessages.length,
      messages: cleanMessages.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.timestamp || new Date().toISOString(),
        modelName: m.modelName || activeModel?.name,
        hasCode: !!m.code,
        hasMath: !!m.math
      }))
    };
    return JSON.stringify(exportData, null, 2);
  };

  // 4. Generate HTML
  const generateHTML = () => {
    const escapedTitle = sessionTitle.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapedTitle} — Girionix AI</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #0B0E17; color: #E2E8F0; margin: 0; padding: 2rem 1rem; }
    .container { max-width: 800px; margin: 0 auto; background: #131826; border: 1px solid #1E293B; border-radius: 16px; padding: 2rem; }
    h1 { color: #38BDF8; font-size: 1.5rem; margin-top: 0; }
    .meta { font-size: 0.85rem; color: #94A3B8; margin-bottom: 2rem; border-bottom: 1px solid #1E293B; padding-bottom: 1rem; }
    .message { margin-bottom: 1.5rem; padding: 1.25rem; border-radius: 12px; }
    .user { background: #1E293B; border-left: 4px solid #38BDF8; }
    .assistant { background: #0F172A; border-left: 4px solid #A855F7; }
    .sender { font-weight: bold; font-size: 0.9rem; margin-bottom: 0.5rem; display: flex; justify-content: space-between; }
    .sender-user { color: #38BDF8; }
    .sender-ai { color: #C084FC; }
    .timestamp { font-size: 0.75rem; color: #64748B; font-weight: normal; }
    .content { white-space: pre-wrap; font-size: 0.95rem; line-height: 1.6; }
    footer { text-align: center; margin-top: 2rem; font-size: 0.8rem; color: #64748B; }
    footer a { color: #38BDF8; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <h1>${escapedTitle}</h1>
    <div class="meta">
      <div>Platform: <strong>Girionix AI</strong> | Enterprise: <a href="https://giri-corporation.pages.dev/" style="color:#38BDF8;">Giri Corporation</a></div>
      <div>Exported: ${new Date().toLocaleString()}</div>
      ${includeModelInfo && activeModel ? `<div>Model: ${activeModel.name}</div>` : ''}
    </div>
    ${cleanMessages.map(m => `
      <div class="message ${m.role === 'user' ? 'user' : 'assistant'}">
        <div class="sender ${m.role === 'user' ? 'sender-user' : 'sender-ai'}">
          <span>${m.role === 'user' ? '👤 User' : '⚡ Girionix AI'}</span>
          ${includeTimestamps && m.timestamp ? `<span class="timestamp">${formatTimestamp(m.timestamp)}</span>` : ''}
        </div>
        <div class="content">${(m.content || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
      </div>
    `).join('')}
    <footer>
      Generated with <a href="https://girionix-ai.pages.dev/">Girionix AI</a> • Envisioned by <a href="https://giri-corporation.pages.dev/">Abhinav Giri</a>
    </footer>
  </div>
</body>
</html>`;
  };

  const getActiveContent = () => {
    switch (activeTab) {
      case 'markdown': return generateMarkdown();
      case 'text': return generatePlainText();
      case 'json': return generateJSON();
      case 'html': return generateHTML();
      default: return generateMarkdown();
    }
  };

  const handleCopy = async () => {
    try {
      const content = getActiveContent();
      await navigator.clipboard.writeText(content);
      setCopiedFormat(activeTab);
      setTimeout(() => setCopiedFormat(null), 2500);
    } catch (err) {
      console.error('Failed to copy chat to clipboard', err);
    }
  };

  const handleDownload = () => {
    const content = getActiveContent();
    const extensions = {
      markdown: 'md',
      text: 'txt',
      json: 'json',
      html: 'html'
    };
    const mimeTypes = {
      markdown: 'text/markdown;charset=utf-8',
      text: 'text/plain;charset=utf-8',
      json: 'application/json;charset=utf-8',
      html: 'text/html;charset=utf-8'
    };

    const ext = extensions[activeTab] || 'txt';
    const mime = mimeTypes[activeTab] || 'text/plain';
    const safeTitle = sessionTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 32) || 'chat';
    const filename = `girionix-${safeTitle}-${currentDate}.${ext}`;

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-[#0C101A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                <span>Export & Share Conversation</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {cleanMessages.length} Messages
                </span>
              </h3>
              <p className="text-xs text-gray-400 truncate max-w-xs sm:max-w-md">
                {sessionTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Export Format Selector Tabs */}
        <div className="px-4 pt-3 border-b border-white/5 bg-black/20 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('markdown')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-xl transition-all border-b-2 ${
              activeTab === 'markdown'
                ? 'text-cyan-300 border-cyan-400 bg-cyan-500/10'
                : 'text-gray-400 border-transparent hover:text-gray-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Markdown (.md)</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-xl transition-all border-b-2 ${
              activeTab === 'text'
                ? 'text-cyan-300 border-cyan-400 bg-cyan-500/10'
                : 'text-gray-400 border-transparent hover:text-gray-200'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-amber-400" />
            <span>Plain Text (.txt)</span>
          </button>

          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-xl transition-all border-b-2 ${
              activeTab === 'json'
                ? 'text-cyan-300 border-cyan-400 bg-cyan-500/10'
                : 'text-gray-400 border-transparent hover:text-gray-200'
            }`}
          >
            <FileJson className="w-3.5 h-3.5 text-purple-400" />
            <span>JSON (.json)</span>
          </button>

          <button
            onClick={() => setActiveTab('html')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-xl transition-all border-b-2 ${
              activeTab === 'html'
                ? 'text-cyan-300 border-cyan-400 bg-cyan-500/10'
                : 'text-gray-400 border-transparent hover:text-gray-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>HTML Document</span>
          </button>
        </div>

        {/* Options Toggles */}
        <div className="px-4 py-2 bg-white/[0.02] border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-300">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
              <input
                type="checkbox"
                checked={includeTimestamps}
                onChange={(e) => setIncludeTimestamps(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-white/20 text-cyan-500 focus:ring-cyan-500/30 bg-black/40 cursor-pointer"
              />
              <span>Timestamps</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer hover:text-white">
              <input
                type="checkbox"
                checked={includeModelInfo}
                onChange={(e) => setIncludeModelInfo(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-white/20 text-cyan-500 focus:ring-cyan-500/30 bg-black/40 cursor-pointer"
              />
              <span>Model Metadata</span>
            </label>
          </div>

          <div className="text-[11px] text-gray-500 font-mono">
            {new Blob([getActiveContent()]).size} bytes
          </div>
        </div>

        {/* Preview Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-black/30 font-mono text-xs text-gray-300 custom-scrollbar max-h-60 sm:max-h-72">
          <pre className="whitespace-pre-wrap leading-relaxed select-text">
            {getActiveContent()}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-black/50 flex items-center justify-between gap-3">
          <div className="text-[11px] text-gray-500 hidden sm:flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Ready for documentation or offline archive</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-gray-200 border border-white/10 text-xs font-semibold transition-all cursor-pointer"
            >
              {copiedFormat === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                  <span>Copy Formatted</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs shadow-glow-cyan transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
