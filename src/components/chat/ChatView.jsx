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
  FileCode,
  Share2,
  Lightbulb,
  Key
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
import ChatExportModal from './ChatExportModal';
import PromptLibraryModal from './PromptLibraryModal';
import FreeKeyModal from '../common/FreeKeyModal';

import { openrouter } from '../../services/openrouter';
import { imageGenerator } from '../../services/imageGenerator';
import { speech } from '../../services/speech';
import { storage, PERSONAS } from '../../services/storage';
import { AI_MODELS, getModelDisplayName } from '../../services/modelCatalog';
import { localNeuralEngine } from '../../services/localNeuralEngine';
import { universalApiEngine } from '../../services/universalApiEngine';
import { conversationMemory } from '../../services/conversationMemory';
import { geminiStudioEngine } from '../../services/geminiStudioEngine';

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
  onOpenSettings,
  onOpenWhySwitch,
  onOpenTools
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
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
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
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPromptLibraryOpen, setIsPromptLibraryOpen] = useState(false);
  const [isSyncingModels, setIsSyncingModels] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState(null);
  const [modelToast, setModelToast] = useState(null);
  const [isFreeKeyModalOpen, setIsFreeKeyModalOpen] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(() => {
    return Boolean(geminiStudioEngine.getApiKey() || storage.getApiKey());
  });
  const [promptHistory, setPromptHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashFilter, setSlashFilter] = useState('');

  // Keep API key status synchronized in real time
  useEffect(() => {
    const checkKey = () => {
      setHasGeminiKey(Boolean(geminiStudioEngine.getApiKey() || storage.getApiKey()));
    };
    window.addEventListener('storage', checkKey);
    window.addEventListener('girionix:key-updated', checkKey);
    return () => {
      window.removeEventListener('storage', checkKey);
      window.removeEventListener('girionix:key-updated', checkKey);
    };
  }, []);

  const handleKeySaved = (key, modelId) => {
    const hasKey = Boolean(key);
    setHasGeminiKey(hasKey);
    if (hasKey && modelId) {
      const target = AI_MODELS.find(m => m.id === modelId) || AI_MODELS[0];
      if (target) {
        setActiveModel(target);
        storage.setActiveModelId(target.id);
        setModelToast(`🟢 Activated: ${target.name}`);
        setTimeout(() => setModelToast(null), 3000);
      }
    } else if (!hasKey) {
      setModelToast(`⚡ Switched to Sovereign Local Core`);
      setTimeout(() => setModelToast(null), 3000);
    }
  };

  // Synchronize activeModel when storage or another component changes it
  useEffect(() => {
    const handleModelSync = (e) => {
      const modelId = e.detail?.modelId;
      if (modelId && (!activeModel || activeModel.id !== modelId)) {
        const matched = AI_MODELS.find(m => m.id === modelId);
        if (matched) {
          setActiveModel(matched);
        }
      }
    };
    window.addEventListener('girionix:model-sync', handleModelSync);
    return () => window.removeEventListener('girionix:model-sync', handleModelSync);
  }, [activeModel, setActiveModel]);


  const abortControllerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const chatScrollContainerRef = useRef(null);
  const isUserNearBottomRef = useRef(true);
  const engineDropdownRef = useRef(null);
  const plusMenuRef = useRef(null);

  // Close dropdowns on outside click anywhere on the page
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (engineDropdownRef.current && !engineDropdownRef.current.contains(e.target)) {
        setIsEngineDropdownOpen(false);
      }
      if (plusMenuRef.current && !plusMenuRef.current.contains(e.target)) {
        setIsPlusMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

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
    if (showSlashMenu) {
      if (e.key === 'Escape') {
        setShowSlashMenu(false);
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        const clean = (slashFilter.startsWith('/') ? slashFilter.slice(1) : slashFilter).toLowerCase().trim();
        const commands = ['/code', '/studio', '/image', '/video', '/audio', '/math', '/script', '/prompts', '/export', '/voice', '/web', '/enhance', '/clear', '/incognito', '/founder', '/download'];
        const matched = commands.find(c => c.slice(1).startsWith(clean)) || commands[0];
        if (matched) {
          handleSelectSlashCommand(matched);
        }
        return;
      }
    }

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
    if (cmd === '/tools') {
      if (onOpenTools) onOpenTools();
      setInput('');
      return;
    }
    if (cmd === '/export') {
      setIsExportModalOpen(true);
      setInput('');
      return;
    }
    if (cmd === '/prompts' || cmd === '/template') {
      setIsPromptLibraryOpen(true);
      setInput('');
      return;
    }
    if (cmd === '/clear') {
      updateCurrentSessionMessages([]);
      setInput('');
      return;
    }
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
      if (onOpenStudioTab) {
        onOpenStudioTab('code');
      } else if (onOpenInCodeStudio) {
        onOpenInCodeStudio();
      }
      setInput('');
      return;
    }
    if (cmd === '/studio') {
      if (onOpenStudioTab) onOpenStudioTab('ai-studio');
      setInput('');
      return;
    }
    if (cmd === '/audio') {
      if (onOpenStudioTab) onOpenStudioTab('audio');
      setInput('');
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
      const existingText = input ? input.trim() + ' ' : '';
      speech.startListening({
        lang: userLocale.startsWith('hi') ? 'hi-IN' : userLocale.includes('IN') ? 'en-IN' : 'en-US',
        silenceTimeoutMs: 2500, // Natural 2.5s pause threshold so users are not cut off
        onResult: ({ transcript }) => {
          if (transcript) {
            setInput(existingText + transcript);
          }
        },
        onSpeechFinalized: (finalTranscript) => {
          speech.stopListening();
          setIsListening(false);
          if (finalTranscript && finalTranscript.trim()) {
            setInput(existingText + finalTranscript.trim());
          }
        },
        onError: (err) => {
          console.warn('Voice dictation notice:', err);
          speech.stopListening();
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        }
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

    // Direct Slash Command Interception (e.g. user typed "/code" or "/studio" and hit Enter)
    const trimmedPrompt = promptToSend.trim();
    if (trimmedPrompt.startsWith('/') && !trimmedPrompt.includes(' ')) {
      handleSelectSlashCommand(trimmedPrompt);
      return;
    }

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

    // 6. Streaming Chat & Precision Code Modification Handling
    try {
      const settings = storage.getSettings();
      const personaObj = PERSONAS.find(p => p.id === activePersona);

      // Check for code modification intent and prior code context in this session
      const priorHistory = updatedMessages.filter(m => m.id !== assistantId);
      const lastCodeObj = conversationMemory.getLastGeneratedCode(priorHistory);
      const isCodeMod = conversationMemory.isCodeModificationRequest(promptToSend, lastCodeObj);
      const isCodeIntent = isCodeRequest(promptToSend) || isCodeMod;

      let codeDirective = '';
      if (isCodeMod && lastCodeObj) {
        codeDirective = conversationMemory.buildCodeModificationDirective(lastCodeObj, promptToSend);
      } else if (isCodeIntent) {
        codeDirective = `\n\nSUPERHUMAN CODING DIRECTIVE: The user is requesting code. Provide a complete, fully functional, production-ready React 18 component formatted with Tailwind CSS in a standard \`\`\`jsx ... \`\`\` code block. Ensure default export or named App so it runs immediately in the Live Sandboxed IDE with 1 click.`;
      }

      const memoryDirective = conversationMemory.buildMemoryDirective(updatedMessages, userName);

      const systemPromptWithPersona = settings.systemPrompt + 
        `\n\nUSER'S NAME: The user is ${userName}. Address them warmly when appropriate.` + 
        `\n\nVISUAL DIRECTIVE: If the user asks for visual descriptions, paintings, animals, scenery, or graphics, ALWAYS include a live high-res markdown image at the end formatted strictly as: ![Description](https://image.pollinations.ai/prompt/ENCODED_PROMPT?width=1024&height=1024&model=flux-realism&nologo=true&enhance=true)` +
        codeDirective +
        (personaObj ? `\n\nACTIVE ROLE INSTRUCTION: ${personaObj.promptSuffix}` : '') +
        (webSearchEnabled ? '\n\nWEB GROUNDING: Cite real-world sources and current technical documentation.' : '') +
        memoryDirective;

      const validDialogue = conversationMemory.formatMessagesForApi(
        updatedMessages.filter(m => m.id !== assistantId),
        80
      );

      const apiMessages = [
        { role: 'system', content: systemPromptWithPersona },
        ...validDialogue
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

  // Cross-Window / Iframe Bridge: Handle incoming prompts from Giri Orbit parent window
  useEffect(() => {
    const handleBridgeMessage = (e) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === 'GIRIONIX_EXECUTE_PROMPT' && e.data.payload?.prompt) {
        handleSend(e.data.payload.prompt);
      }
    };
    window.addEventListener('message', handleBridgeMessage);
    return () => window.removeEventListener('message', handleBridgeMessage);
  }, [handleSend]);

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

      {/* Active Conversation Control Bar */}
      {!isCleanSession && (
        <div className="px-3 sm:px-6 py-2 bg-black/40 border-b border-white/[0.06] flex items-center justify-between text-xs backdrop-blur-md z-10">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-gray-200 truncate max-w-[180px] sm:max-w-xs md:max-w-md">
              {currentSession?.title || 'Active Conversation'}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 whitespace-nowrap">
              {messages.filter(m => m.id !== 'welcome').length} msgs
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsPromptLibraryOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all cursor-pointer text-xs"
              title="Browse Practical Prompt Templates"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-medium">Prompts</span>
            </button>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer text-xs"
              title="Export Conversation (Markdown, Text, JSON, HTML)"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-medium">Export</span>
            </button>

            <button
              onClick={() => updateCurrentSessionMessages([])}
              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Clear Current Chat"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
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
              onOpenStudioTab={onOpenStudioTab}
              onSelectPrompt={(p) => {
                setInput(p);
                handleSend(p);
              }}
            />
          </div>
        ) : (
          <div className="max-w-4xl w-full mx-auto space-y-8 sm:space-y-10">
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

      {/* Chat Input Bar with Integrated Action Dock */}
      <div className="p-3 sm:p-4 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] border-t border-white/[0.08] bg-[#0A0C14]/90 backdrop-blur-xl relative z-10">
        <div className="max-w-4xl mx-auto space-y-2 relative">


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
              isOpen={showSlashMenu}
              filterText={slashFilter}
              filter={slashFilter}
              onSelectCommand={handleSelectSlashCommand}
              onSelect={handleSelectSlashCommand}
            />
          )}


          {/* Main Unified Input Card matching GranthMind screenshot */}
          <div className="relative rounded-3xl bg-[#14151b] border border-white/[0.08] focus-within:border-cyan-500/40 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all shadow-2xl p-3 flex flex-col">
            {/* Live Token & Character Counter HUD */}
            {input.trim().length > 0 && (
              <div className="flex items-center justify-between px-2 pt-0.5 pb-1.5 text-[11px] font-mono text-gray-400 border-b border-white/5 mb-1.5 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-semibold">{input.length} chars</span>
                  <span className="text-gray-600">•</span>
                  <span>{input.trim().split(/\s+/).length} words</span>
                  <span className="text-gray-600">•</span>
                  <span className={input.length > 3000 ? "text-amber-400 font-bold" : "text-purple-300 font-medium"}>
                    ~{Math.ceil(input.length / 4)} tokens
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setInput('')}
                  className="text-gray-500 hover:text-gray-300 text-[10px] uppercase tracking-wider cursor-pointer"
                  title="Clear text"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Input Textarea */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={
                isListening 
                  ? "🎙️ Listening... Speak your prompt..." 
                  : "Ask anything, build an app, analyze code..."
              }
              rows={2}
              className="w-full bg-transparent text-sm sm:text-base text-white placeholder-gray-500 px-2 py-1 focus:outline-none resize-none leading-relaxed max-h-48 overflow-y-auto"
            />

            {/* Bottom Inner Card Action Bar (Matches Reference Image Exactly) */}
            <div className="flex items-center justify-between pt-2 mt-1 border-t border-white/[0.04]">
              {/* Left Actions: + Options Button and Model Selector Chip */}
              <div className="flex items-center gap-2 relative">
                
                {/* + Button with Quick Options Popover */}
                <div className="relative" ref={plusMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsPlusMenuOpen(prev => !prev)}
                    className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 hover:text-white transition-colors cursor-pointer border border-white/5"
                    title="Add attachment or options"
                  >
                    <Plus className="w-4 h-4 text-gray-300" />
                  </button>

                  {isPlusMenuOpen && (
                    <div className="absolute bottom-full left-0 mb-2 w-64 rounded-2xl bg-[#090b14] border border-white/15 p-2 shadow-2xl z-50 space-y-1 backdrop-blur-xl animate-fadeIn text-xs">
                      <div className="px-2 py-1 text-[10px] font-mono text-gray-400 uppercase border-b border-white/10 font-bold">
                        Options & Tools
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsFileModalOpen(true);
                          setIsPlusMenuOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-xl flex items-center gap-2 hover:bg-white/5 text-gray-200 transition-colors"
                      >
                        <Paperclip className="w-4 h-4 text-cyan-400" />
                        <span>Attach File or Code</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsPromptLibraryOpen(true);
                          setIsPlusMenuOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-xl flex items-center gap-2 hover:bg-white/5 text-gray-200 transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-amber-400" />
                        <span>Prompt Library</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          handleToggleWebSearch(!webSearchEnabled);
                          setIsPlusMenuOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-xl flex items-center justify-between hover:bg-white/5 text-gray-200 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-cyan-400" />
                          <span>Web Search Grounding</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${webSearchEnabled ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-gray-400'}`}>
                          {webSearchEnabled ? 'ON' : 'OFF'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          handleToggleThinking(!useThinking);
                          setIsPlusMenuOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-xl flex items-center justify-between hover:bg-white/5 text-gray-200 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4 text-purple-400" />
                          <span>Deep Reasoning</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${useThinking ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-gray-400'}`}>
                          {useThinking ? 'ON' : 'OFF'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsFreeKeyModalOpen(true);
                          setIsPlusMenuOpen(false);
                        }}
                        className="w-full text-left p-2 rounded-xl flex items-center gap-2 hover:bg-white/5 text-gray-200 transition-colors"
                      >
                        <Key className="w-4 h-4 text-emerald-400" />
                        <span>Connect Free Gemini Key</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Model Selector Chip: GranthMind Pro Flash ⚡ ^ => Girionix Pro Flash ⚡ ^ */}
                <div className="relative" ref={engineDropdownRef}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEngineDropdownOpen(prev => !prev);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-cyan-300 border border-white/10 transition-all cursor-pointer select-none active:scale-95"
                  >
                    <span>{getModelDisplayName(activeModel, 'chat')}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isEngineDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isEngineDropdownOpen && (
                    <div className="absolute bottom-full left-0 mb-2 w-72 sm:w-80 rounded-2xl bg-[#090b14] border border-white/15 p-2 shadow-2xl z-50 space-y-1 backdrop-blur-xl max-h-[70vh] flex flex-col animate-fadeIn">
                      <div className="px-2.5 py-1 text-[10px] font-mono text-gray-400 uppercase border-b border-white/10 flex justify-between items-center shrink-0">
                        <span>Frontier AI Models</span>
                        <span className="text-cyan-400 font-bold flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          <span>Auto-Upgrade ON</span>
                        </span>
                      </div>

                      <div className="overflow-y-auto space-y-1 flex-1 pr-0.5 max-h-64">
                        {AI_MODELS.map((m) => {
                          const isSelected = activeModel.id === m.id;
                          return (
                            <button
                              type="button"
                              key={m.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveModel(m);
                                storage.setActiveModelId(m.id);
                                setIsEngineDropdownOpen(false);
                                setModelToast(`⚡ Active: ${m.name}`);
                                setTimeout(() => setModelToast(null), 2500);
                              }}
                              className={`w-full text-left p-2 rounded-xl flex items-center justify-between text-xs transition-all cursor-pointer ${
                                isSelected 
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                                  : 'text-gray-300 hover:bg-white/5 border border-transparent'
                              }`}
                            >
                              <div className="flex flex-col min-w-0 pr-2">
                                <span className="font-bold text-white text-xs">{m.name}</span>
                                <span className="text-[10px] text-gray-400 truncate">{m.tag || m.description}</span>
                              </div>
                              {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      <div className="pt-1.5 border-t border-white/10 shrink-0">
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            setIsSyncingModels(true);
                            setSyncFeedback(null);
                            const res = await universalApiEngine.syncLatestModels();
                            setIsSyncingModels(false);
                            setSyncFeedback(`✅ Synced (${res.totalModelsAvailable || 12} models)`);
                            setTimeout(() => setSyncFeedback(null), 3000);
                          }}
                          disabled={isSyncingModels}
                          className="w-full py-1.5 px-2 rounded-xl bg-white/[0.03] hover:bg-cyan-500/10 text-cyan-300 text-[11px] font-mono border border-cyan-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${isSyncingModels ? 'animate-spin' : ''}`} />
                          <span>{isSyncingModels ? 'Checking Registries...' : (syncFeedback || '⚡ Sync Latest Models')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Actions: Voice Mic & Circular Send Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleListening}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    isListening ? 'bg-rose-500 text-white animate-pulse' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  title="Voice Input (English / Hindi)"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onOpenVoiceModal}
                  className="p-2 text-gray-400 hover:text-cyan-300 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                  title="Voice Orb"
                >
                  <Radio className="w-4 h-4" />
                </button>

                {isStreaming ? (
                  <button
                    type="button"
                    onClick={handleStop}
                    className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center justify-center hover:bg-rose-500/30 transition-all cursor-pointer"
                    title="Stop Generating"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSend()}
                    disabled={!input.trim() && !attachedFile}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-cyan-500 text-gray-300 hover:text-black flex items-center justify-center disabled:opacity-20 transition-all cursor-pointer shadow-md disabled:cursor-not-allowed hover:scale-105"
                    title="Send message"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Disclaimer text below input (Matches Reference Image) */}
          <div className="text-center pt-2 text-[11px] text-gray-500 select-none">
            Girionix can make mistakes. Verify important info.
          </div>
        </div>
      </div>

      {/* Visual Model Switch Confirmation Toast */}
      {modelToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#0c1021]/95 border border-cyan-500/40 text-cyan-200 text-xs px-4 py-2 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2 pointer-events-none transition-all duration-300">
          <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>{modelToast}</span>
        </div>
      )}

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

      <ChatExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        session={currentSession}
        activeModel={activeModel}
      />

      <PromptLibraryModal
        isOpen={isPromptLibraryOpen}
        onClose={() => setIsPromptLibraryOpen(false)}
        onSelectPrompt={(text) => {
          setInput(text);
          if (textareaRef.current) {
            textareaRef.current.focus();
          }
        }}
        onRunPrompt={(text) => {
          handleSend(text);
        }}
      />

      <FreeKeyModal
        isOpen={isFreeKeyModalOpen}
        onClose={() => setIsFreeKeyModalOpen(false)}
        onKeySaved={handleKeySaved}
      />
    </div>
  );
}
