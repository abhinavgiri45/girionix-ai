import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
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
import ChatView from './components/chat/ChatView';
import OrbitWorkstationView from './components/orbit/OrbitWorkstationView';
import MobileBottomNav from './components/layout/MobileBottomNav';
import SettingsModal from './components/settings/SettingsModal';

import { AI_MODELS } from './services/modelCatalog';
import { storage } from './services/storage';
import { updateService } from './services/updateService';
import { giriOrbitBridge } from './services/giriOrbitBridge';

export default function App() {
  const [isOrbitWorkstationActive, setIsOrbitWorkstationActive] = useState(() => {
    return giriOrbitBridge.isOrbitMode();
  });

  const isOfficeMode = React.useMemo(() => {
    return isOrbitWorkstationActive;
  }, [isOrbitWorkstationActive]);

  const [isAppInstalled, setIsAppInstalled] = useState(() => storage.isAppInstalled());
  const [activeModel, setActiveModel] = useState(() => {
    const savedModelId = storage.getActiveModelId();
    const found = AI_MODELS.find(m => m.id === savedModelId);
    return found || AI_MODELS[0];
  });

  const handleSetActiveModel = (model) => {
    if (!model) return;
    setActiveModel(model);
    if (model.id) {
      storage.setActiveModelId(model.id);
    }
  };

  // Synchronize activeModel state across components when changed externally
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
  }, [activeModel]);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [introTab, setIntroTab] = useState('overview');

  // Direct Start: AI starts directly in the clean workspace/chat view
  const [isAboutOpen, setIsAboutOpen] = useState(() => {
    try {
      if (typeof window === 'undefined') return false;
      const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const params = new URLSearchParams(window.location.search);
      
      const isOffice = params.get('mode') === 'office' || params.get('embed') === 'true' || params.get('embed') === 'office' || params.has('office') || (window.self !== window.top);
      if (isOffice) return false;

      // Skip intro if explicit native app flags or direct chat mode requested
      if (params.get('direct') === 'chat' || params.get('app') === 'true' || params.get('native') === 'true') {
        return false;
      }

      // Explicit intro request via query param
      if (params.get('page') === 'intro' || path === '/intro' || path === '/about') {
        return true;
      }

      // Default: Direct start in chat workspace
      return false;
    } catch (_) {
      return false;
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
  const [isNameModalOpen, setIsNameModalOpen] = useState(() => !storage.isProfileConfigured());
  const [userName, setUserName] = useState(() => {
    try {
      return storage.getUserName() || '';
    } catch (_) {
      return '';
    }
  });

  useEffect(() => {
    const handleProfileUpdate = () => {
      const name = storage.getUserName();
      setUserName(name || '');
    };
    window.addEventListener('girionix:profile-updated', handleProfileUpdate);
    window.addEventListener('storage', handleProfileUpdate);
    return () => {
      window.removeEventListener('girionix:profile-updated', handleProfileUpdate);
      window.removeEventListener('storage', handleProfileUpdate);
    };
  }, []);

  const [sessions, setSessions] = useState(() => storage.getSessions());
  const [activeSessionId, setActiveSessionId] = useState(() => storage.getActiveSessionId());
  const [pinnedItems, setPinnedItems] = useState(() => storage.getPinnedItems());
  const [activePersona, setActivePersona] = useState(() => storage.getSettings().activePersona || 'default');

  // 1-Click Bridge: Import latest AI message directly to Giri Orbit workplace
  const handleImportLatestToWorkplace = () => {
    const curSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
    const lastMsg = curSession?.messages?.filter(m => m.role === 'assistant')?.slice(-1)[0];
    if (lastMsg && typeof window !== 'undefined') {
      window.parent.postMessage({
        type: 'GIRIONIX_IMPORT_TO_WORKPLACE',
        payload: {
          text: lastMsg.content,
          timestamp: Date.now()
        }
      }, '*');
      try {
        navigator.clipboard.writeText(lastMsg.content);
      } catch (_) {}
    }
  };

  // Bridge listener: Respond to parent window (Giri Orbit) requests for latest AI message
  useEffect(() => {
    const handleWindowMessage = (e) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === 'GIRIONIX_REQUEST_LATEST_MESSAGE') {
        const curSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
        const lastMsg = curSession?.messages?.filter(m => m.role === 'assistant')?.slice(-1)[0];
        if (lastMsg && e.source) {
          e.source.postMessage({
            type: 'GIRIONIX_LATEST_MESSAGE_RESPONSE',
            payload: {
              text: lastMsg.content,
              timestamp: Date.now()
            }
          }, '*');
        }
      }
    };
    window.addEventListener('message', handleWindowMessage);
    return () => window.removeEventListener('message', handleWindowMessage);
  }, [sessions, activeSessionId]);

  // Load user name and settings on boot + strict app mode detection
  useEffect(() => {
    const isApp = storage.isAppInstalled();
    const savedName = storage.getUserName() || 'Orbit User';
    setUserName(savedName);
    if (!savedName && !isOfficeMode && (storage.hasSeenIntro() || isApp)) {
      setIsNameModalOpen(true);
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
        setIsAboutOpen(false);
      }
    };

    checkAppMode();

    // Signal Native App Bridge that workspace is ready
    try {
      if (typeof window !== 'undefined') {
        if (window.GirionixBridge?.onWebsiteReady) {
          window.GirionixBridge.onWebsiteReady();
        } else if (window.GirionixAndroid?.onWebsiteReady) {
          window.GirionixAndroid.onWebsiteReady();
        }
      }
    } catch (_) {}

    // Background OTA Code Update Check
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

    return () => clearInterval(updateInterval);
  }, [isOfficeMode]);

  // Deep URL & Route Synchronization for dedicated /chat, /workspace links
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const currentPath = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    
    if (!isAboutOpen) {
      const targetPath = '/chat';
      if (currentPath !== targetPath && (currentPath === '' || currentPath === '/' || currentPath === '/intro' || currentPath === '/about')) {
        window.history.pushState({ path: targetPath }, '', targetPath + window.location.search);
      }
    } else {
      if (currentPath === '/chat' || currentPath === '/workspace') {
        window.history.pushState({ path: '/intro' }, '', '/intro' + window.location.search);
      }
    }
  }, [isAboutOpen]);

  // Handle browser Back / Forward navigation (popstate)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const params = new URLSearchParams(window.location.search);
      if (path === '/orbit' || params.get('mode') === 'orbit' || params.get('portal') === 'orbit') {
        setIsOrbitWorkstationActive(true);
        return;
      }
      if (path === '/chat' || path === '/workspace' || path === '/app') {
        setIsAboutOpen(false);
      } else if (path === '' || path === '/' || path === '/intro' || path === '/about') {
        setIsAboutOpen(true);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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

  const handleCloseIntro = () => {
    setIsAboutOpen(false);
    storage.setSeenIntro(true);
    if (!storage.isProfileConfigured()) {
      setIsNameModalOpen(true);
    }
  };

  if (isOrbitWorkstationActive) {
    return (
      <OrbitWorkstationView
        onExitOrbitMode={() => {
          setIsOrbitWorkstationActive(false);
          const url = new URL(window.location.href);
          url.searchParams.delete('mode');
          url.searchParams.delete('source');
          url.searchParams.delete('portal');
          url.searchParams.delete('embed');
          const targetPath = url.pathname === '/orbit' ? '/chat' : url.pathname;
          window.history.pushState({}, '', targetPath + (url.search ? url.search : ''));
        }}
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
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAbout={() => {
          setIntroTab('overview');
          setIsAboutOpen(true);
        }}
        onOpenWhySwitch={handleOpenWhySwitch}
        onOpenDownload={() => setIsDownloadOpen(true)}
        onOpenProStatus={() => setIsProStatusOpen(true)}
        isAppInstalled={isAppInstalled}
        isOfficeMode={isOfficeMode}
        onLaunchOrbitStation={() => setIsOrbitWorkstationActive(true)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <Header
          onOpenTools={() => setIsToolsOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
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
          onNewChat={handleCreateNewSession}
          onToggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
          userName={userName}
          onChangeName={() => setIsNameModalOpen(true)}
          isAppInstalled={isAppInstalled}
          isOfficeMode={isOfficeMode}
          onImportToWorkplace={handleImportLatestToWorkplace}
        />

        {/* Full-width Workspace Chat View */}
        <main className="flex-1 overflow-hidden relative flex flex-col min-w-0">
          <ChatView
            activeModel={activeModel}
            setActiveModel={handleSetActiveModel}
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
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenTools={() => setIsToolsOpen(true)}
            isAppInstalled={isAppInstalled}
          />
        </main>

        {/* Dedicated Mobile Bottom Navigation Bar (md:hidden) */}
        <MobileBottomNav
          onOpenTools={() => setIsToolsOpen(true)}
          onOpenDownload={() => setIsDownloadOpen(true)}
          onOpenProStatus={() => setIsProStatusOpen(true)}
          isAppInstalled={isAppInstalled}
          isOfficeMode={isOfficeMode}
        />
      </div>

      {/* Tools Hub Modal */}
      <ToolsModal
        isOpen={isToolsOpen}
        onClose={() => setIsToolsOpen(false)}
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
        onLaunchOrbitStation={() => setIsOrbitWorkstationActive(true)}
      />

      {/* Introducing Girionix AI Landing & Announcement Page */}
      <IntroducingGirionixPage
        isOpen={isAboutOpen}
        initialTab={introTab}
        onClose={handleCloseIntro}
        onLaunchApp={() => {
          handleCloseIntro();
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
          if (installed) setActiveModel(AI_MODELS[0]);
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

      {/* AI Smart Scratchpad Modal (Ctrl+J) */}
      <ScratchpadModal
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
        activeModel={activeModel}
      />

      {/* Welcome Name Onboarding Modal */}
      {!isOfficeMode && (
        <WelcomeNameModal
          isOpen={isNameModalOpen}
          currentUserName={userName}
          onClose={() => setIsNameModalOpen(false)}
          onSaveName={(name) => {
            setUserName(name);
            setIsNameModalOpen(false);
          }}
        />
      )}

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
        setActiveModel={handleSetActiveModel}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Universal API & Engine Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onApiKeyUpdated={() => {
          setActiveModel(prev => ({ ...prev }));
        }}
      />
    </div>
  );
}
