import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Trash2, 
  Square, 
  Mic, 
  Radio, 
  ChevronDown, 
  Check, 
  Zap, 
  Globe, 
  Brain, 
  Paperclip, 
  Wand2, 
  FolderClock, 
  Download, 
  X, 
  Plus, 
  ArrowRight,
  Brush,
  Layers,
  Code2,
  Image as ImageIcon,
  Film,
  Sigma,
  ShieldAlert,
  BookOpen,
  Award,
  Crown,
  Lock,
  RefreshCw,
  FileCode
} from 'lucide-react';
import MessageItem from './MessageItem';
import VoiceOrbModal from './VoiceOrbModal';
import FileUploadModal from './FileUploadModal';
import PromptEnhancerModal from '../common/PromptEnhancerModal';
import ChatHistorySidebar from './ChatHistorySidebar';
import PersonaModal from '../common/PersonaModal';
import PinnedDrawer from '../common/PinnedDrawer';
import DiffViewerModal from '../common/DiffViewerModal';
import SnippetLibraryModal from '../common/SnippetLibraryModal';
import SketchCanvasModal from '../image/SketchCanvasModal';
import TelemetryHUD from './TelemetryHUD';
import WelcomeCards from './WelcomeCards';
import SlashCommandMenu from './SlashCommandMenu';
import UrlInspectorModal from './UrlInspectorModal';
import FlashcardModal from './FlashcardModal';

import { openrouter } from '../../services/openrouter';
import { imageGenerator } from '../../services/imageGenerator';
import { speech } from '../../services/speech';
import { storage, PERSONAS } from '../../services/storage';
import { AI_MODELS, TITAN_AI_MODELS } from '../../services/modelCatalog';
import { localNeuralEngine } from '../../services/localNeuralEngine';
import { universalApiEngine } from '../../services/universalApiEngine';

export default function ChatView({
  activeModel,
  setActiveModel,
  onOpenInCodeStudio,
  onOpenStudioTab,
  layoutMode,
  setLayoutMode,
  userName = 'Abhinav',
  sessions,
  setSessions,
  activeSessionId,
  setActiveSessionId,
  onCreateNewSession,
  onOpenVoiceModal,
  onOpenAbout,
  onOpenDownload,
  isAppInstalled = false,
  isTitanMode = false,
  onOpenTitanWorkstation,
  onOpenWhySwitch
}) {
  const [pinnedItems, setPinnedItems] = useState(() => storage.getPinnedItems());
  const [activePersona, setActivePersona] = useState(() => storage.getSettings().activePersona || 'default');

  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [useThinking, setUseThinking] = useState(() => storage.getDeepReasoningEnabled());
  const [webSearchEnabled, setWebSearchEnabled] = useState(() => storage.getWebSearchEnabled());

  const handleToggleWebSearch = (enabled) => {
    setWebSearchEnabled(enabled);
    storage.setWebSearchEnabled(enabled);
  };

  const handleToggleThinking = (enabled) => {
    setUseThinking(enabled);
    storage.setDeepReasoningEnabled(enabled);
  };
  const [isListening, setIsListening] = useState(false);
  const [isVoiceOrbOpen, setIsVoiceOrbOpen] = useState(false);
  const [isEngineDropdownOpen, setIsEngineDropdownOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isPromptEnhancerOpen, setIsPromptEnhancerOpen] = useState(false);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [isPinnedOpen, setIsPinnedOpen] = useState(false);
  const [isSketchOpen, setIsSketchOpen] = useState(false);
  const [isSnippetOpen, setIsSnippetOpen] = useState(false);
  const [isDiffOpen, setIsDiffOpen] = useState(false);
  const [diffCode, setDiffCode] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [isIncognito, setIsIncognito] = useState(false);

  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false);
  const [isSyncingModels, setIsSyncingModels] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState(null);

  const [promptHistory, setPromptHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashFilter, setSlashFilter] = useState('');

  const abortControllerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const chatScrollContainerRef = useRef(null);
  const isUserNearBottomRef = useRef(true);

  // Background auto-upgrade check on app startup
  useEffect(() => {
    const runAutoSync = async () => {
      try {
        const res = await universalApiEngine.syncLatestModels();
        if (res.upgraded) {
          console.log('[Girionix AI] Auto-Upgraded to newly released model weights:', res.upgradedFamilies);
        }
      } catch (_) {}
    };
    runAutoSync();
  }, []);

  const currentSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const messages = currentSession?.messages || [];
  const isCleanSession = messages.length === 0 || (messages.length === 1 && messages[0].id === 'welcome');

  const handleChatScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    isUserNearBottomRef.current = scrollHeight - scrollTop - clientHeight < 150;
  };

  useEffect(() => {
    if (!isIncognito) {
      storage.saveSessions(sessions);
      storage.setActiveSessionId(activeSessionId);
      storage.savePinnedItems(pinnedItems);
    }
    if (isUserNearBottomRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: isStreaming ? 'auto' : 'smooth' });
    }
  }, [sessions, activeSessionId, pinnedItems, isStreaming, isIncognito]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + 'px';
    }

    if (val.startsWith('/')) {
      setShowSlashMenu(true);
      setSlashFilter(val);
    } else {
      setShowSlashMenu(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp' && input === '' && promptHistory.length > 0) {
      e.preventDefault();
      const newIdx = historyIndex === -1 ? promptHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIdx);
      setInput(promptHistory[newIdx] || '');
    } else if (e.key === 'ArrowDown' && historyIndex !== -1) {
      e.preventDefault();
      const newIdx = historyIndex + 1;
      if (newIdx >= promptHistory.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(newIdx);
        setInput(promptHistory[newIdx] || '');
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectSlashCommand = (cmd) => {
    setShowSlashMenu(false);
    if (cmd === '/voice') {
      setIsVoiceOrbOpen(true);
      setInput('');
      return;
    }
    if (cmd === '/incognito') {
      setIsIncognito(!isIncognito);
      setInput('');
      return;
    }
    if (cmd === '/url') {
      setIsUrlModalOpen(true);
      setInput('');
      return;
    }
    if (cmd === '/quiz') {
      setIsFlashcardModalOpen(true);
      setInput('');
      return;
    }
    if (cmd === '/founder' || cmd === '/creator' || cmd === '/about') {
      if (onOpenAbout) {
        onOpenAbout();
      } else {
        handleSend('Who created you and what was the vision behind Girionix AI?');
      }
      setInput('');
      return;
    }
    if (cmd === '/download') {
      if (onOpenDownload) onOpenDownload();
      setInput('');
      return;
    }
    if (cmd === '/code') {
      setInput('Build a live interactive React component with Tailwind CSS: ');
      return;
    }
    if (cmd === '/script') {
      setInput('Write a cinematic Hollywood screenplay scene in Fountain format for: ');
      return;
    }
    if (cmd === '/image') {
      setInput('generate an 8k photorealistic image of ');
      return;
    }
    if (cmd === '/video') {
      setInput('create a cinematic 3D multi-shot video scene for: ');
      return;
    }
    if (cmd === '/math') {
      setInput('derive step-by-step with KaTeX proof: ');
      return;
    }
    if (cmd === '/mindmap') {
      setInput('create a mind map for ');
      return;
    }
    if (cmd === '/web') {
      setWebSearchEnabled(!webSearchEnabled);
      setInput('');
      return;
    }
    if (cmd === '/enhance') {
      setIsPromptEnhancerOpen(true);
      setInput('');
      return;
    }
    setInput(cmd + ' ');
  };

  const handleToggleListening = () => {
    if (isListening) {
      speech.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      const userLocale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
      speech.startListening({
        lang: userLocale.startsWith('hi') ? 'hi-IN' : userLocale.includes('IN') ? 'en-IN' : 'en-US',
        silenceTimeoutMs: 800,
        onResult: ({ transcript }) => {
          if (transcript) setInput(transcript);
        },
        onSpeechFinalized: (finalTranscript) => {
          if (finalTranscript) setInput(finalTranscript);
          setIsListening(false);
        },
        onError: () => setIsListening(false),
        onEnd: () => setIsListening(false)
      });
    }
  };

  const updateCurrentSessionMessages = (newMessages) => {
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: newMessages } : s));
  };

  const handleDeleteSession = (id) => {
    const remaining = sessions.filter(s => s.id !== id);
    if (remaining.length > 0) {
      setSessions(remaining);
      if (activeSessionId === id) setActiveSessionId(remaining[0].id);
    }
  };

  const handleRenameSession = (id, newTitle) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
  };

  const handlePinMessage = (msg) => {
    const exists = pinnedItems.find(p => p.id === msg.id);
    if (exists) {
      setPinnedItems(pinnedItems.filter(p => p.id !== msg.id));
    } else {
      setPinnedItems([{ id: msg.id, title: msg.content.slice(0, 30) + '...', content: msg.content, time: msg.timestamp }, ...pinnedItems]);
    }
  };

  const handleEditMessage = (id, newText) => {
    const msgIndex = messages.findIndex(m => m.id === id);
    if (msgIndex !== -1) {
      const truncated = messages.slice(0, msgIndex);
      updateCurrentSessionMessages(truncated);
      handleSend(newText);
    }
  };

  // Omnipotent Semantic Intent Matchers
  const isVideoRequest = (prompt) => {
    const p = prompt.toLowerCase();
    return /\b(video|movie|film|cinematic|footage|clip|animation|animate|screenplay|scene)\b/i.test(p) ||
           p.includes('make a video') ||
           p.includes('create a video') ||
           p.includes('generate a video') ||
           p.includes('video of');
  };

  const isImageRequest = (prompt) => {
    const p = prompt.toLowerCase();
    if (isVideoRequest(prompt)) return false;
    return /\b(image|picture|photo|photograph|drawing|draw|sketch|illustration|portrait|wallpaper|ghibli|gilbhli|art of|render|logo|icon|badge|emblem|symbol|vector|graphic|poster|avatar|mascot|artwork|clipart)\b/i.test(p) ||
           /\b(create|generate|make|design|draw|show|render)\s+(a|an|the|ai)?\s*(logo|icon|badge|image|picture|photo|drawing|illustration|sketch|wallpaper|poster|vector|art|graphic|mascot|avatar)\b/i.test(p) ||
           p.includes('create a image') ||
           p.includes('create an image') ||
           p.includes('create a logo') ||
           p.includes('create an ai logo') ||
           p.includes('create an logo') ||
           p.includes('generate a logo') ||
           p.includes('generate logo') ||
           p.includes('design a logo') ||
           p.includes('make a logo') ||
           p.includes('make an image') ||
           p.includes('make a image') ||
           p.includes('generate image') ||
           p.includes('picture of') ||
           p.includes('image of') ||
           p.includes('logo of') ||
           p.includes('logo for') ||
           /^(make|draw|show|generate|design|render)\s+(a|an)?\s*(dog|cat|car|house|sunset|lion|robot|city|anime|tree|person|girl|boy|logo|icon|poster|badge)/i.test(p);
  };

  const isMindMapRequest = (prompt) => {
    const p = prompt.toLowerCase();
    return /\b(mind map|mindmap|concept map|knowledge graph|topic tree|graph of)\b/i.test(p);
  };

  const isCodeRequest = (prompt) => {
    const p = prompt.toLowerCase();
    return /\b(code|write code|program|script|build an app|create an app|react component|build a website|make a game|snake game|tic tac toe|calculator|dashboard|algorithm|function)\b/i.test(p) ||
           p.includes('write code for') ||
           p.includes('code for') ||
           p.includes('build code') ||
           p.includes('implement');
  };

  const isIntroQuery = (text) => {
    const q = text.toLowerCase();
    return q.includes('who created you') ||
           q.includes('who made you') ||
           q.includes('who created') ||
           q.includes('introduce yourself') ||
           q.includes('your introduction') ||
           q.includes('who are you') ||
           q.includes('founder') ||
           q.includes('vision') ||
           q.includes('kisne banaya') ||
           q.includes('apna parichay');
  };

  const handleSend = async (customPrompt) => {
    const promptToSend = customPrompt || input;
    if ((!promptToSend.trim() && !attachedFile) || isStreaming) return;

    if (isListening) {
      speech.stopListening();
      setIsListening(false);
    }

    setPromptHistory(prev => [...prev.filter(p => p !== promptToSend.trim()), promptToSend.trim()]);
    setHistoryIndex(-1);

    let userContent = promptToSend.trim();
    if (attachedFile) {
      userContent += `\n\n[Attached File: ${attachedFile.name} (${attachedFile.size})]`;
    }

    const userMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: userContent,
      attachedFile: attachedFile,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const assistantId = 'resp-' + (Date.now() + 1);
    const initialAssistantMessage = {
      id: assistantId,
      role: 'assistant',
      modelName: activeModel.name,
      content: '',
      reasoning: '',
      isStreaming: true,
      isThinking: activeModel.supportsReasoning && useThinking,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const baseMessages = messages.filter(m => m.id !== 'welcome');
    const updatedMessages = [...baseMessages, userMessage, initialAssistantMessage];
    updateCurrentSessionMessages(updatedMessages);

    if (currentSession.title === 'New Session' || currentSession.title === 'New Chat') {
      handleRenameSession(currentSession.id, promptToSend.slice(0, 26) || 'Chat');
    }

    setInput('');
    setShowSlashMenu(false);
    setAttachedFile(null);
    setIsStreaming(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    abortControllerRef.current = new AbortController();

    // 1. Effective Model Selection (100% unlocked on both web and app)
    const effectiveModel = activeModel;

    // 3. Direct Cinematic Video Generation Intent (Fully Unlocked Everywhere)
    if (isVideoRequest(promptToSend)) {
      // Real 60 FPS Cinematic Multi-Shot Video Storyboard Generation!
      const cleanVideoPrompt = promptToSend
        .replace(/^(create a cinematic 3d multi-shot video scene for:|generate a video of|generate video of|create a video of|create video of|make a video of|video of|create video for|video scene for:?)/i, '')
        .trim();

      const targetVideoSubject = cleanVideoPrompt || promptToSend;
      const storyboard = await imageGenerator.generateVideoStoryboard({ prompt: targetVideoSubject });

      const videoScriptReply = `🎬 **Cinematic Video Scene Directed by Girionix Motion Engine (Pro)**\n\n**Scene Subject**: "${targetVideoSubject}"\n\n**Camera Motion**: 360° Counter-Clockwise Orbit & Speed Ramp\n**Aspect Ratio**: 2.39:1 Anamorphic Cinema • 60 FPS HD\n\n> 🎥 **Multi-Shot Screenplay Breakdown**:\n> - **Shot 1 (00:00 - 00:04)**: Dynamic wide establishing tracking shot with atmospheric volumetric lighting.\n> - **Shot 2 (00:04 - 00:08)**: Hyper-dolly zoom focusing on subject highlights at 60 FPS.\n> - **Shot 3 (00:08 - 00:12)**: FPV ascending crane move into dramatic rim-lighting.`;

      setSessions(prev => prev.map(s => s.id === activeSessionId ? {
        ...s,
        messages: s.messages.map(m => m.id === assistantId ? {
          ...m,
          content: videoScriptReply,
          generatedVideo: storyboard,
          isStreaming: false,
          isThinking: false
        } : m)
      } : s));
      setIsStreaming(false);
      return;
    }

    // 4. Direct Image & Logo Generation Intent
    if (isImageRequest(promptToSend)) {
      try {
        const cleanPrompt = promptToSend
          .replace(/^(generate an image of|generate image of|create an image of|create image of|make an image of|make image of|create an ai logo of|create a logo of|create a logo for|generate a logo for|generate a logo of|design a logo for|design a logo of|draw a logo of|make a logo for|make a logo of|create logo for|create logo of|draw a|draw an|draw|picture of|show me an image of|show me a picture of|make a picture of|image of|picture of|logo of|logo for)/i, '')
          .replace(/\b(image|picture|photo)\b/gi, '')
          .trim();

        const targetPrompt = cleanPrompt || promptToSend;
        const autoDims = imageGenerator.detectOptimalDimensions(targetPrompt);
        const autoModel = imageGenerator.detectOptimalModel(targetPrompt);

        const imgResult = await imageGenerator.generate({
          prompt: targetPrompt,
          width: autoDims.width,
          height: autoDims.height,
          model: autoModel
        });

        const imageReplyContent = `Here is your high-fidelity 8K visual design of **"${targetPrompt}"** (${autoDims.ratioLabel} • ${autoModel.toUpperCase()}):\n\n![${targetPrompt}](${imgResult.url})`;

        setSessions(prev => prev.map(s => s.id === activeSessionId ? {
          ...s,
          messages: s.messages.map(m => m.id === assistantId ? {
            ...m,
            content: imageReplyContent,
            generatedImage: imgResult,
            isStreaming: false,
            isThinking: false
          } : m)
        } : s));
        setIsStreaming(false);
        return;
      } catch (err) {
        console.warn('Image generation error:', err);
      }
    }

    // 5. Mind Map Intent
    if (isMindMapRequest(promptToSend)) {
      const cleanTopic = promptToSend
        .replace(/^(create a mind map for|create a mind map of|mind map of|mind map for|concept map for|knowledge graph of)/i, '')
        .trim() || 'Artificial Intelligence Architecture';

      const mindMapReply = `🧠 **Interactive AI Knowledge & Mind Map for "${cleanTopic}"**\n\nHere is your dynamic, interactive node-link knowledge graph visualizer:`;

      setSessions(prev => prev.map(s => s.id === activeSessionId ? {
        ...s,
        messages: s.messages.map(m => m.id === assistantId ? {
          ...m,
          content: mindMapReply,
          mindMapTopic: cleanTopic,
          isStreaming: false,
          isThinking: false
        } : m)
      } : s));
      setIsStreaming(false);
      return;
    }

    // 5.5 Check for 100% On-Device Offline Sovereign Execution (Titan / Local Mode / Network Disconnected)
    const isOfflineOrTitan = isTitanMode || 
      effectiveModel?.isTitan || 
      effectiveModel?.isLocal || 
      effectiveModel?.id?.startsWith('girionix-titan') || 
      effectiveModel?.id === 'girionix-local-core' || 
      (typeof navigator !== 'undefined' && !navigator.onLine);

    if (isOfflineOrTitan) {
      try {
        await localNeuralEngine.streamLocalResponse({
          prompt: promptToSend,
          history: updatedMessages,
          model: effectiveModel?.id || 'girionix-titan-70b',
          isTitanLite: effectiveModel?.id === 'girionix-titan-lite' || effectiveModel?.category === 'titan-lite',
          onReasoning: (reasoningText) => {
            setSessions(prev => prev.map(s => s.id === activeSessionId ? {
              ...s,
              messages: s.messages.map(m => m.id === assistantId ? { ...m, reasoning: reasoningText, isThinking: true } : m)
            } : s));
          },
          onToken: (fullContent, token) => {
            setSessions(prev => prev.map(s => s.id === activeSessionId ? {
              ...s,
              messages: s.messages.map(m => m.id === assistantId ? { ...m, content: fullContent, isThinking: false } : m)
            } : s));
          }
        });
      } catch (localErr) {
        console.error('Local neural engine execution error:', localErr);
      } finally {
        setIsStreaming(false);
        setSessions(prev => prev.map(s => s.id === activeSessionId ? {
          ...s,
          messages: s.messages.map(m => m.id === assistantId ? { ...m, isStreaming: false, isThinking: false } : m)
        } : s));
      }
      return;
    }

    // 6. Standard Streaming Chat (Cloud-Hybrid Models)
    try {
      const settings = storage.getSettings();
      const personaObj = PERSONAS.find(p => p.id === activePersona);
      const isCodeIntent = isCodeRequest(promptToSend);

      const codeDirective = isCodeIntent
        ? `\n\nSUPERHUMAN CODING DIRECTIVE: The user is requesting code. Provide a complete, fully functional, production-ready React 18 component formatted with Tailwind CSS in a standard \`\`\`jsx ... \`\`\` code block. Ensure default export or named App so it runs immediately in the Live Sandboxed IDE with 1 click.`
        : '';

      const systemPromptWithPersona = settings.systemPrompt + 
        `\n\nUSER'S NAME: The user is ${userName}. Address them warmly when appropriate.` + 
        `\n\nVISUAL DIRECTIVE: If the user asks for visual descriptions, paintings, animals, scenery, or graphics, ALWAYS include a live high-res markdown image at the end formatted strictly as: ![Description](https://image.pollinations.ai/prompt/ENCODED_PROMPT?width=1024&height=1024&model=flux-realism&nologo=true&enhance=true)` +
        codeDirective +
        (personaObj ? `\n\nACTIVE ROLE INSTRUCTION: ${personaObj.promptSuffix}` : '') +
        (webSearchEnabled ? '\n\nWEB GROUNDING: Cite real-world sources and current technical documentation.' : '');

      const apiMessages = [
        { role: 'system', content: systemPromptWithPersona },
        ...updatedMessages
          .filter(m => m.id !== assistantId && m.id !== 'welcome')
          .map(m => ({ role: m.role, content: m.content }))
      ];

      await openrouter.streamChat({
        messages: apiMessages,
        model: effectiveModel.id,
        temperature: settings.temperature,
        maxTokens: settings.maxTokens,
        webSearchEnabled: webSearchEnabled,
        useThinking: useThinking,
        signal: abortControllerRef.current.signal,
        onReasoningChunk: (chunk, fullReasoning) => {
          setSessions(prev => prev.map(s => s.id === activeSessionId ? {
            ...s,
            messages: s.messages.map(m => m.id === assistantId ? { ...m, reasoning: fullReasoning, isThinking: true } : m)
          } : s));
        },
        onChunk: (chunk, fullContent) => {
          setSessions(prev => prev.map(s => s.id === activeSessionId ? {
            ...s,
            messages: s.messages.map(m => m.id === assistantId ? { ...m, content: fullContent, isThinking: false } : m)
          } : s));
        }
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        setSessions(prev => prev.map(s => s.id === activeSessionId ? {
          ...s,
          messages: s.messages.map(m => m.id === assistantId ? {
            ...m,
            content: `⚠️ **Notice**: ${err.message}\n\nPlease check your configuration in **Tools (🔧)**.`,
            isStreaming: false,
            isThinking: false
          } : m)
        } : s));
      }
    } finally {
      setIsStreaming(false);
      setSessions(prev => prev.map(s => s.id === activeSessionId ? {
        ...s,
        messages: s.messages.map(m => m.id === assistantId ? { ...m, isStreaming: false, isThinking: false } : m)
      } : s));
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#07080E] relative overflow-hidden">
      {/* Incognito Warning if active */}
      {isIncognito && (
        <div className="bg-rose-950/40 border-b border-rose-500/30 px-4 py-1.5 flex items-center justify-between text-[11px] font-mono text-rose-300">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Ephemeral Incognito Mode: This chat is not being saved to browser storage.</span>
          </div>
          <button onClick={() => setIsIncognito(false)} className="hover:text-white underline">Exit</button>
        </div>
      )}

      {/* Main Messages or Welcome Area */}
      <div 
        ref={chatScrollContainerRef}
        onScroll={handleChatScroll}
        className="flex-1 overflow-y-auto custom-scrollbar px-3 sm:px-6 py-3 sm:py-4 flex flex-col justify-start"
      >
        {isCleanSession ? (
          <div className="flex-1 flex items-center justify-center">
            <WelcomeCards
              userName={userName}
              onOpenAbout={onOpenAbout}
              onOpenWhySwitch={onOpenWhySwitch}
            />
          </div>
        ) : (
          <div className="max-w-4xl w-full mx-auto space-y-5">
            {messages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                activeModel={activeModel}
                onOpenInCodeStudio={onOpenInCodeStudio}
                onOpenStudioTab={onOpenStudioTab}
                onPinMessage={handlePinMessage}
                onEditMessage={handleEditMessage}
                onOpenDiff={(code) => {
                  setDiffCode(code);
                  setIsDiffOpen(true);
                }}
                onOpenDownload={onOpenDownload}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Chat Input Bar with Integrated AI Studio Canvas Dock */}
      <div className="p-3 sm:p-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] border-t border-white/[0.08] bg-[#0A0C14]/90 backdrop-blur-xl relative z-10">
        <div className="max-w-4xl mx-auto space-y-2">
          {/* Integrated AI Studio Canvas Dock (ChatGPT Canvas & Claude Artifacts style) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-medium no-scrollbar">
            <button
              onClick={() => onOpenStudioTab ? onOpenStudioTab('google-studio') : setInput('analyze in Google AI Studio: ')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-purple-500/20 text-cyan-200 border border-cyan-400/40 transition-all whitespace-nowrap cursor-pointer hover:scale-105 shadow-glow-cyan/50"
              title="Open Google AI Studio (Chat, Freeform, Structured Prompts & Sandbox Execution)"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold">✦ AI Studio</span>
            </button>

            <button
              onClick={() => onOpenStudioTab ? onOpenStudioTab('code') : setInput('write a React 18 component with Tailwind CSS: ')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all whitespace-nowrap cursor-pointer hover:scale-105 shadow-glow-cyan/50"
              title="Open React 18 Sandboxed Code Canvas"
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold">💻 Code IDE</span>
            </button>

            <button
              onClick={() => onOpenStudioTab ? onOpenStudioTab('script') : setInput('write a screenplay scene: ')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-all whitespace-nowrap cursor-pointer hover:scale-105"
              title="Open Hollywood Screenplay Studio"
            >
              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-bold">✍️ Script Writer</span>
            </button>

            <button
              onClick={() => onOpenStudioTab ? onOpenStudioTab('math') : setInput('derive step-by-step with KaTeX proof: ')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all whitespace-nowrap cursor-pointer hover:scale-105"
              title="Open Olympiad Math & 3D Plotter"
            >
              <Sigma className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-bold">📐 Math Lab</span>
            </button>

            <button
              onClick={() => onOpenStudioTab ? onOpenStudioTab('image') : setInput('generate an 8k image of ')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all whitespace-nowrap cursor-pointer hover:scale-105"
              title="Open 8K FLUX.1 VisionForge"
            >
              <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
              <span className="font-bold">🎨 8K Vision</span>
            </button>

            <button
              onClick={() => onOpenStudioTab ? onOpenStudioTab('video') : setInput('create a cinematic 60fps video scene for: ')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all whitespace-nowrap cursor-pointer hover:scale-105"
              title="Open MotionLab 60FPS Video Studio"
            >
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold">🎬 MotionLab</span>
            </button>

            <button
              onClick={() => onOpenStudioTab ? onOpenStudioTab('audio') : setInput('compose music: ')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all whitespace-nowrap cursor-pointer hover:scale-105"
              title="Open AudioLab 48kHz Stem Mixer & Voice Studio"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold">🎙️ AudioLab</span>
            </button>

            <button
              onClick={() => setIsPromptEnhancerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/[0.1] transition-all whitespace-nowrap cursor-pointer"
              title="Enhance prompt with AI"
            >
              <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Enhance Prompt</span>
            </button>
          </div>

          {/* File Attachment Pill */}
          {attachedFile && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 w-fit animate-fadeIn">
              <Paperclip className="w-3.5 h-3.5" />
              <span>{attachedFile.name} ({attachedFile.size})</span>
              <button onClick={() => setAttachedFile(null)} className="hover:text-white ml-1">✕</button>
            </div>
          )}

          {/* Slash Commands Dropdown Menu */}
          {showSlashMenu && (
            <SlashCommandMenu
              filter={slashFilter}
              onSelect={handleSelectSlashCommand}
            />
          )}

          {/* Main Input Textarea & Action Buttons */}
          <div className="relative flex items-end rounded-2xl bg-black/60 border border-white/10 focus-within:border-cyan-500/40 transition-colors p-2">
            <button
              onClick={() => setIsFileModalOpen(true)}
              className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors mb-0.5"
              title="Attach File or Code"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything, write 'create a image of...', 'create a video of...', 'write code for...', or '/' for commands..."
              rows={1}
              className="flex-1 bg-transparent text-base sm:text-sm text-white placeholder-gray-500 px-3 py-1.5 focus:outline-none resize-none leading-relaxed max-h-44 overflow-y-auto"
            />

            <div className="flex items-center gap-1.5 mb-0.5">
              <button
                onClick={handleToggleListening}
                className={`p-2 rounded-xl transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-glow-rose'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                title="Voice Input (English / Hindi)"
              >
                <Mic className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenVoiceModal}
                className="p-2 text-gray-400 hover:text-cyan-300 rounded-xl hover:bg-white/5 transition-colors"
                title="Real-time Voice Conversation Orb"
              >
                <Radio className="w-4 h-4" />
              </button>

              {isStreaming ? (
                <button
                  onClick={handleStop}
                  className="p-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-colors"
                  title="Stop generating"
                >
                  <Square className="w-4 h-4 fill-current" />
                </button>
              ) : (
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() && !attachedFile}
                  className="p-2 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-bold disabled:opacity-30 transition-all shadow-glow-cyan"
                  title="Send message (Enter)"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Engine & Mode Bar below input */}
          <div className="flex items-center justify-between gap-2 px-1 text-[11px] font-mono text-gray-400 overflow-x-auto no-scrollbar py-0.5 w-full">
            <div className="flex items-center gap-1.5 sm:gap-2.5 flex-nowrap shrink-0">
              {/* Engine Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsEngineDropdownOpen(!isEngineDropdownOpen)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-gray-300 hover:text-white border transition-colors ${
                    isTitanMode
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 shadow-glow-emerald'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10'
                  }`}
                >
                  <Sparkles className={`w-3 h-3 ${isTitanMode ? 'text-emerald-400' : 'text-cyan-400'}`} />
                  <span className="font-bold">{activeModel.name}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {isEngineDropdownOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-[calc(100vw-2rem)] sm:w-84 max-w-sm rounded-2xl bg-[#070913] border border-white/15 p-2 shadow-2xl z-50 space-y-1 backdrop-blur-xl max-h-[75vh] flex flex-col">
                    <div className="px-2.5 py-1 text-[10px] font-mono text-gray-400 uppercase border-b border-white/10 flex justify-between items-center shrink-0">
                      <span>{isTitanMode ? '⚡ Titan 100% Offline Models' : '🌐 Standard AI Models'}</span>
                      {isTitanMode ? (
                        <span className="text-emerald-400 font-bold">100% Air-Gapped</span>
                      ) : (
                        <span className="text-cyan-400 font-bold flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          <span>Auto-Upgrade ON</span>
                        </span>
                      )}
                    </div>

                    <div className="overflow-y-auto space-y-1 flex-1 pr-0.5">
                      {(isTitanMode ? TITAN_AI_MODELS : AI_MODELS).map((m) => {
                        return (
                          <button
                            key={m.id}
                            onClick={() => {
                              setActiveModel(m);
                              storage.setActiveModelId(m.id);
                              setIsEngineDropdownOpen(false);
                            }}
                            className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between text-xs transition-all ${
                              activeModel.id === m.id 
                                ? isTitanMode 
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-emerald' 
                                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                                : 'text-gray-300 hover:bg-white/5 border border-transparent'
                            }`}
                          >
                            <div className="flex flex-col space-y-0.5 min-w-0 pr-2">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-bold text-white text-xs">{m.name}</span>
                                {m.isAutoUpgrade && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-gradient-to-r from-cyan-500/30 to-purple-500/30 text-cyan-200 border border-cyan-400/40 font-extrabold flex items-center gap-0.5">
                                    <Zap className="w-2.5 h-2.5 text-cyan-300 animate-pulse" />
                                    <span>AUTO-UPGRADED</span>
                                  </span>
                                )}
                                {m.isTitan && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                                    TITAN
                                  </span>
                                )}
                                {m.isPro && !m.isTitan && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                                    <Crown className="w-2.5 h-2.5" />
                                    <span>PRO</span>
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-gray-400 truncate">
                                {m.tag || m.description}
                              </span>
                            </div>
                            {activeModel.id === m.id && (
                              <Check className={`w-3.5 h-3.5 shrink-0 ${isTitanMode ? 'text-emerald-400' : 'text-cyan-400'}`} />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Quick Sync Button for Cloud / Standard Mode */}
                    {!isTitanMode && (
                      <div className="pt-1.5 border-t border-white/10 shrink-0">
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            setIsSyncingModels(true);
                            setSyncFeedback(null);
                            const res = await universalApiEngine.syncLatestModels();
                            setIsSyncingModels(false);
                            setSyncFeedback(res.success ? `✅ Synced (${res.totalModelsAvailable} models)` : '⚠️ Synced fallback');
                            setTimeout(() => setSyncFeedback(null), 3000);
                          }}
                          disabled={isSyncingModels}
                          className="w-full py-1.5 px-2 rounded-xl bg-white/[0.03] hover:bg-cyan-500/10 text-cyan-300 hover:text-cyan-200 text-[11px] font-mono border border-cyan-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${isSyncingModels ? 'animate-spin' : ''}`} />
                          <span>{isSyncingModels ? 'Checking Registries...' : (syncFeedback || '⚡ Sync & Check for Model Upgrades')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Web Grounding Toggle with Sliding On/Off Switch */}
              <button
                onClick={() => handleToggleWebSearch(!webSearchEnabled)}
                className={`flex items-center gap-2 px-2.5 py-1 rounded-xl border transition-all cursor-pointer select-none ${
                  webSearchEnabled
                    ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-glow-cyan/50'
                    : 'bg-white/[0.04] text-gray-400 border-white/10 hover:text-white hover:bg-white/[0.08]'
                }`}
                title={webSearchEnabled ? "Web Search is ON (Real-time grounding active)" : "Web Search is OFF (Click to turn ON)"}
              >
                <div className="flex items-center gap-1.5">
                  <Globe className={`w-3.5 h-3.5 transition-colors ${webSearchEnabled ? 'text-cyan-400' : 'text-gray-400'}`} />
                  <span className="font-semibold text-xs">Web Search</span>
                </div>

                {/* Sliding On/Off Switch */}
                <div className={`w-7 h-4 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center ${
                  webSearchEnabled ? 'bg-cyan-400' : 'bg-white/20'
                }`}>
                  <div className={`w-3 h-3 rounded-full transition-transform duration-200 ease-in-out ${
                    webSearchEnabled 
                      ? 'translate-x-3 bg-black shadow-sm' 
                      : 'translate-x-0 bg-gray-400'
                  }`} />
                </div>
              </button>

              {/* Deep Reasoning Toggle with Sliding On/Off Switch */}
              <button
                onClick={() => handleToggleThinking(!useThinking)}
                className={`flex items-center gap-2 px-2.5 py-1 rounded-xl border transition-all cursor-pointer select-none ${
                  useThinking
                    ? 'bg-purple-500/15 text-purple-300 border-purple-500/40 shadow-glow-purple/50'
                    : 'bg-white/[0.04] text-gray-400 border-white/10 hover:text-white hover:bg-white/[0.08]'
                }`}
                title={useThinking ? "Deep Reasoning is ON (Step-by-step thinking active)" : "Deep Reasoning is OFF (Direct concise responses)"}
              >
                <div className="flex items-center gap-1.5">
                  <Brain className={`w-3.5 h-3.5 transition-colors ${useThinking ? 'text-purple-400' : 'text-gray-400'}`} />
                  <span className="font-semibold text-xs">Deep Reasoning</span>
                </div>

                {/* Sliding On/Off Switch */}
                <div className={`w-7 h-4 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center ${
                  useThinking ? 'bg-purple-400' : 'bg-white/20'
                }`}>
                  <div className={`w-3 h-3 rounded-full transition-transform duration-200 ease-in-out ${
                    useThinking 
                      ? 'translate-x-3 bg-black shadow-sm' 
                      : 'translate-x-0 bg-gray-400'
                  }`} />
                </div>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-cyan-400/90 font-mono text-xs font-semibold">
                ⚡ Girionix Pro Sovereign Engine
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Modals */}
      <FileUploadModal
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        onFileSelect={(file) => setAttachedFile(file)}
      />

      <PromptEnhancerModal
        isOpen={isPromptEnhancerOpen}
        onClose={() => setIsPromptEnhancerOpen(false)}
        onApplyPrompt={(enhanced) => setInput(enhanced)}
        activeModel={activeModel}
      />

      <DiffViewerModal
        isOpen={isDiffOpen}
        onClose={() => setIsDiffOpen(false)}
        code={diffCode}
      />

      <UrlInspectorModal
        isOpen={isUrlModalOpen}
        onClose={() => setIsUrlModalOpen(false)}
        onInsertContext={(text) => setInput(prev => prev + '\n' + text)}
      />

      <FlashcardModal
        isOpen={isFlashcardModalOpen}
        onClose={() => setIsFlashcardModalOpen(false)}
        activeModel={activeModel}
      />
    </div>
  );
}
