import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import StudioPanel from './components/layout/StudioPanel';
import CommandPalette from './components/layout/CommandPalette';
import ToolsModal from './components/tools/ToolsModal';
import VoiceOrbModal from './components/chat/VoiceOrbModal';
import ShortcutsModal from './components/common/ShortcutsModal';
import WelcomeNameModal from './components/common/WelcomeNameModal';
import IntroducingGirionixPage from './components/common/IntroducingGirionixPage';
import ScratchpadModal from './components/common/ScratchpadModal';
import DownloadAppsModal from './components/common/DownloadAppsModal';
import ProAppStatusModal from './components/common/ProAppStatusModal';
import UpdateModal from './components/common/UpdateModal';
import LocalNeuralModal from './components/common/LocalNeuralModal';
import TitanWorkstationModal from './components/common/TitanWorkstationModal';
import TitanWorkstationView from './components/titan/TitanWorkstationView';
import ChatView from './components/chat/ChatView';

import { AI_MODELS, TITAN_AI_MODELS } from './services/modelCatalog';
import { storage } from './services/storage';
import { updateService } from './services/updateService';

export default function App() {
  const [isAppInstalled, setIsAppInstalled] = useState(() => storage.isAppInstalled());
  const [isTitanMode, setIsTitanMode] = useState(() => {
    try {
      return localStorage.getItem('girionix_titan_mode') === 'true' || localStorage.getItem('girionix_titan_mode') === 'true' || (typeof window !== 'undefined' && window.location.search.includes('titan=true'));
    } catch (_) { return false; }
  });
  const [isTitanWorkstationOpen, setIsTitanWorkstationOpen] = useState(false);
  const [activeModel, setActiveModel] = useState(() => {
    const isTitan = typeof window !== 'undefined' && (localStorage.getItem('girionix_titan_mode') === 'true' || localStorage.getItem('girionix_titan_mode') === 'true' || window.location.search.includes('titan=true'));
    const isLite = typeof window !== 'undefined' && window.location.search.includes('profile=lite');
    if (isTitan) return isLite ? TITAN_AI_MODELS[1] : TITAN_AI_MODELS[0];
    return AI_MODELS[0]; // Full Pro Flagship Universal Model available seamlessly on both web and app
  });
  const [layoutMode, setLayoutMode] = useState('chat'); // 'chat' | 'split' | 'studio'
  const [activeStudioTab, setActiveStudioTab] = useState('code'); // 'code' | 'math' | 'image' | 'video'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [introTab, setIntroTab] = useState('overview');
  // The AI Web App ALWAYS opens with the Official Introduction Page as the primary landing page first!
  const [isAboutOpen, setIsAboutOpen] = useState(() => {
    try {
      if (typeof window === 'undefined') return true;
      const params = new URLSearchParams(window.location.search);
      // Skip intro only if explicit native app flags or direct chat mode requested
      if (params.get('direct') === 'chat' || params.get('app') === 'true' || params.get('native') === 'true') {
        return false;
      }
      return true;
    } catch (_) {
      return true;
    }
  });

  const handleOpenWhySwitch = () => {
    setIntroTab('comparison');
    setIsAboutOpen(true);
  };
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isProStatusOpen, setIsProStatusOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isLocalModalOpen, setIsLocalModalOpen] = useState(false);
  const [hasAvailableUpdate, setHasAvailableUpdate] = useState(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [injectedCode, setInjectedCode] = useState(null);

  const handleToggleTitanMode = (enableTitan, targetModelId = null) => {
    setIsTitanMode(enableTitan);
    try {
      localStorage.setItem('girionix_titan_mode', enableTitan ? 'true' : 'false');
    } catch (_) {}
    if (enableTitan) {
      const selected = targetModelId ? (TITAN_AI_MODELS.find(m => m.id === targetModelId) || TITAN_AI_MODELS[0]) : TITAN_AI_MODELS[0];
      setActiveModel(selected);
    } else {
      setActiveModel(AI_MODELS[0]);
    }
  };

  const [sessions, setSessions] = useState(() => storage.getSessions());
  const [activeSessionId, setActiveSessionId] = useState(() => storage.getActiveSessionId());
  const [pinnedItems, setPinnedItems] = useState(() => storage.getPinnedItems());
  const [activePersona, setActivePersona] = useState(() => storage.getSettings().activePersona || 'default');

  // Load user name and settings on boot + strict app mode detection
  useEffect(() => {
    const isApp = storage.isAppInstalled();
    const savedName = storage.getUserName();
    if (!savedName && (storage.hasSeenIntro() || isApp)) {
      setIsNameModalOpen(true);
    } else if (savedName) {
      setUserName(savedName);
    }

    const checkAppMode = () => {
      const isRunningApp = storage.isAppInstalled();
      setIsAppInstalled(isRunningApp);
      const isExplicitNative = typeof window !== 'undefined' && (
        window.location.search.includes('app=true') || 
        window.location.search.includes('native=true') ||
        window.location.hash.includes('app=true') ||
        window.location.hash.includes('native=true')
      );
      if (isRunningApp && isExplicitNative) {
        setIsAboutOpen(false); // Standalone installed desktop/mobile app goes straight to workspace
      }
    };

    checkAppMode();

    // Signal Native App Bridge (Android / Desktop) that workspace is ready
    try {
      if (typeof window !== 'undefined') {
        if (window.GirionixBridge?.onWebsiteReady) {
          window.GirionixBridge.onWebsiteReady();
        } else if (window.GirionixAndroid?.onWebsiteReady) {
          window.GirionixAndroid.onWebsiteReady();
        }
      }
    } catch (_) {}

    // Background Over-The-Air (OTA) Code Update Check
    const runUpdateCheck = async () => {
      try {
        const res = await updateService.checkForUpdates();
        if (res && res.hasUpdate) {
          setHasAvailableUpdate(true);
        }
      } catch (_) {}
    };
    runUpdateCheck();
    const updateInterval = setInterval(runUpdateCheck, 15 * 60 * 1000);

    if (typeof window !== 'undefined' && window.matchMedia) {
      const mql = window.matchMedia('(display-mode: standalone)');
      const handler = () => checkAppMode();
      if (mql.addEventListener) mql.addEventListener('change', handler);
      return () => {
        clearInterval(updateInterval);
        if (mql.removeEventListener) mql.removeEventListener('change', handler);
      };
    }
    return () => clearInterval(updateInterval);
  }, []);

  // Global Key listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsScratchpadOpen(prev => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setIsDownloadOpen(prev => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        setIsVoiceModeOpen(prev => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setLayoutMode(prev => prev === 'split' ? 'chat' : 'split');
      }
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        setIsShortcutsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCreateNewSession = () => {
    const newSession = {
      id: 'session-' + Date.now(),
      title: 'New Session',
      createdAt: Date.now(),
      messages: []
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
  };

  const handleDeleteSession = (id) => {
    const remaining = sessions.filter(s => s.id !== id);
    if (remaining.length > 0) {
      setSessions(remaining);
      if (activeSessionId === id) setActiveSessionId(remaining[0].id);
    }
  };

  const handleClearAllSessions = () => {
    const freshSession = {
      id: 'session-' + Date.now(),
      title: 'New Session',
      createdAt: Date.now(),
      messages: []
    };
    setSessions([freshSession]);
    setActiveSessionId(freshSession.id);
  };

  const [mobileActivePane, setMobileActivePane] = useState('chat'); // 'chat' | 'studio'

  const handleOpenInCodeStudio = (code) => {
    setInjectedCode(code);
    setActiveStudioTab('code');
    setLayoutMode('split');
    setMobileActivePane('studio');
  };

  const handleLaunchStudioFromTools = (studioId) => {
    setActiveStudioTab(studioId);
    setLayoutMode('split');
    setMobileActivePane('studio');
  };

  const handleCloseIntro = () => {
    setIsAboutOpen(false);
    storage.setSeenIntro(true);
    const savedName = storage.getUserName();
    if (!savedName) {
      setIsNameModalOpen(true);
    }
  };

  if (isTitanMode) {
    return (
      <TitanWorkstationView
        onExitTitanMode={() => handleToggleTitanMode(false)}
        userName={userName}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#07080E] text-gray-100 font-sans">
      {/* Left Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => setActiveSessionId(id)}
        onCreateNewSession={handleCreateNewSession}
        onDeleteSession={handleDeleteSession}
        onClearAllSessions={handleClearAllSessions}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onOpenSettings={() => setIsToolsOpen(true)}
        onOpenAbout={() => {
          setIntroTab('overview');
          setIsAboutOpen(true);
        }}
        onOpenWhySwitch={handleOpenWhySwitch}
        onOpenDownload={() => setIsDownloadOpen(true)}
        onOpenProStatus={() => setIsProStatusOpen(true)}
        isAppInstalled={isAppInstalled}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <Header
          layoutMode={layoutMode}
          setLayoutMode={setLayoutMode}
          onOpenTools={() => setIsToolsOpen(true)}
          onOpenAbout={() => {
            setIntroTab('overview');
            setIsAboutOpen(true);
          }}
          onOpenWhySwitch={handleOpenWhySwitch}
          onOpenDownload={() => setIsDownloadOpen(true)}
          onOpenProStatus={() => setIsProStatusOpen(true)}
          onOpenScratchpad={() => setIsScratchpadOpen(true)}
          onOpenUpdates={() => setIsUpdateModalOpen(true)}
          onOpenLocalEngine={() => setIsLocalModalOpen(true)}
          onOpenTitanWorkstation={() => setIsTitanWorkstationOpen(true)}
          onNewChat={handleCreateNewSession}
          onToggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
          userName={userName}
          onChangeName={() => setIsNameModalOpen(true)}
          isAppInstalled={isAppInstalled}
          isTitanMode={isTitanMode}
          onToggleTitanMode={handleToggleTitanMode}
        />

        {/* Mobile View Switcher when in Split Mode on small screens */}
        {layoutMode === 'split' && (
          <div className="flex md:hidden items-center justify-between px-3 py-1.5 bg-[#090C17] border-b border-white/10 gap-2 shrink-0">
            <button
              onClick={() => setMobileActivePane('chat')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mobileActivePane === 'chat'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                  : 'text-gray-400 hover:text-white bg-white/[0.03]'
              }`}
            >
              <span>💬 Chat</span>
            </button>
            <button
              onClick={() => setMobileActivePane('studio')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mobileActivePane === 'studio'
                  ? 'bg-gradient-to-r from-purple-500/25 to-cyan-500/25 text-cyan-200 border border-cyan-500/40 shadow-sm'
                  : 'text-gray-400 hover:text-white bg-white/[0.03]'
              }`}
            >
              <span>💻 Studio ({activeStudioTab.toUpperCase()})</span>
            </button>
          </div>
        )}

        {/* Workspace Dual Pane / Chat Layout */}
        <main className="flex-1 overflow-hidden relative flex flex-col md:flex-row min-w-0">
          {/* Left Pane: Chat & Welcome Screen */}
          {(layoutMode === 'chat' || layoutMode === 'split') && (
            <div className={`h-full flex-col transition-all duration-300 min-w-0 ${
              layoutMode === 'split' 
                ? (mobileActivePane === 'chat' ? 'flex w-full md:w-1/2 md:border-r md:border-white/[0.08]' : 'hidden md:flex md:w-1/2 md:border-r md:border-white/[0.08]') 
                : 'flex w-full'
            }`}>
              <ChatView
                activeModel={activeModel}
                setActiveModel={setActiveModel}
                onOpenInCodeStudio={handleOpenInCodeStudio}
                onOpenStudioTab={(tabId) => {
                  setActiveStudioTab(tabId);
                  setLayoutMode('split');
                  setMobileActivePane('studio');
                }}
                layoutMode={layoutMode}
                setLayoutMode={setLayoutMode}
                userName={userName}
                sessions={sessions}
                setSessions={setSessions}
                activeSessionId={activeSessionId}
                setActiveSessionId={setActiveSessionId}
                onCreateNewSession={handleCreateNewSession}
                onOpenVoiceModal={() => setIsVoiceModeOpen(true)}
                onOpenAbout={() => {
                  setIntroTab('overview');
                  setIsAboutOpen(true);
                }}
                onOpenWhySwitch={handleOpenWhySwitch}
                onOpenDownload={() => setIsDownloadOpen(true)}
                isAppInstalled={isAppInstalled}
                isTitanMode={isTitanMode}
                onOpenTitanWorkstation={() => setIsTitanWorkstationOpen(true)}
              />
            </div>
          )}

          {/* Right Pane: Live AI Studio (Code Sandbox, Math Lab, 8K Vision, Motion Lab) */}
          {(layoutMode === 'studio' || layoutMode === 'split') && (
            <div className={`h-full flex-col transition-all duration-300 min-w-0 ${
              layoutMode === 'split' 
                ? (mobileActivePane === 'studio' ? 'flex w-full md:w-1/2' : 'hidden md:flex md:w-1/2') 
                : 'flex w-full'
            }`}>
              <StudioPanel
                activeStudioTab={activeStudioTab}
                setActiveStudioTab={setActiveStudioTab}
                activeModel={activeModel}
                injectedCode={injectedCode}
                onClose={() => {
                  setLayoutMode('chat');
                  setMobileActivePane('chat');
                }}
                isAppInstalled={isAppInstalled}
                isTitanMode={isTitanMode}
                onOpenDownload={() => setIsDownloadOpen(true)}
              />
            </div>
          )}
        </main>
      </div>

      {/* Tools & AI Studio Hub Modal */}
      <ToolsModal
        isOpen={isToolsOpen}
        onClose={() => setIsToolsOpen(false)}
        onLaunchStudio={handleLaunchStudioFromTools}
        activePersona={activePersona}
        onSelectPersona={(p) => {
          setActivePersona(p);
          storage.saveSettings({ ...storage.getSettings(), activePersona: p });
        }}
        pinnedItems={pinnedItems}
        onRemovePinned={(id) => {
          const updated = pinnedItems.filter(p => p.id !== id);
          setPinnedItems(updated);
          storage.savePinnedItems(updated);
        }}
        onOpenLocalEngine={() => setIsLocalModalOpen(true)}
      />

      {/* Official OpenAI-Style Introducing Girionix AI Landing & Announcement Page */}
      <IntroducingGirionixPage
        isOpen={isAboutOpen}
        initialTab={introTab}
        onClose={handleCloseIntro}
        onLaunchApp={(studioTab) => {
          handleCloseIntro();
          if (studioTab && typeof studioTab === 'string') {
            setActiveStudioTab(studioTab);
            setLayoutMode('split');
          }
        }}
        onOpenDownload={() => {
          handleCloseIntro();
          setIsDownloadOpen(true);
        }}
      />

      {/* Download Native Apps Modal (Android, Windows, iOS, Mac, Linux) */}
      <DownloadAppsModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        onInstalledChange={(installed) => {
          setIsAppInstalled(installed);
          if (installed) setActiveModel(AI_MODELS[0]); // Automatically switch to Pro once installed!
        }}
      />

      {/* Pro App Active Status & Local Vault Modal */}
      <ProAppStatusModal
        isOpen={isProStatusOpen}
        onClose={() => setIsProStatusOpen(false)}
        userName={userName}
      />

      {/* Real-Time System Updates & Over-The-Air Sync Modal */}
      <UpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onOpenDownload={() => {
          setIsUpdateModalOpen(false);
          setIsDownloadOpen(true);
        }}
      />

      {/* 100% On-Device Local Neural Core Hardware Audit & Launcher Modal */}
      <LocalNeuralModal
        isOpen={isLocalModalOpen}
        onClose={() => setIsLocalModalOpen(false)}
        activeModel={activeModel}
        onActivateLocalModel={() => {
          const localModel = AI_MODELS.find(m => m.id === 'girionix-local-core') || AI_MODELS[0];
          setActiveModel(localModel);
        }}
      />

      {/* Dedicated Titan Heavy Hardware Workstation & Stress Benchmark Modal */}
      <TitanWorkstationModal
        isOpen={isTitanWorkstationOpen}
        onClose={() => setIsTitanWorkstationOpen(false)}
        onActivateTitanModel={(targetModelId) => {
          handleToggleTitanMode(true, targetModelId);
        }}
      />

      {/* AI Smart Scratchpad Modal (Ctrl+J) */}
      <ScratchpadModal
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
        activeModel={activeModel}
      />

      {/* Welcome Name Onboarding Modal */}
      <WelcomeNameModal
        isOpen={isNameModalOpen}
        onSaveName={(name) => {
          setUserName(name);
          setIsNameModalOpen(false);
        }}
      />

      {/* Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Live Voice Conversation Orb Modal */}
      <VoiceOrbModal
        isOpen={isVoiceModeOpen}
        onClose={() => setIsVoiceModeOpen(false)}
        activeModel={activeModel}
      />

      {/* Quick Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setCurrentStudio={(s) => { setActiveStudioTab(s); setLayoutMode('split'); }}
        setActiveModel={setActiveModel}
        onOpenSettings={() => setIsToolsOpen(true)}
      />
    </div>
  );
}
