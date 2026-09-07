import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  Monitor, 
  Laptop, 
  Terminal, 
  Sparkles, 
  Check, 
  ArrowRight, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  Crown, 
  Layers, 
  Cpu, 
  Lock, 
  Radio, 
  ExternalLink, 
  HardDrive, 
  Trash2,
  Activity,
  CheckSquare,
  AlertTriangle,
  FileCode,
  Share2,
  PlusSquare
} from 'lucide-react';
import { detectUserOS, getPlatformDetailedSpecs } from '../../services/osDetector';
import { triggerFileDownload } from '../../services/downloadHelper';
import { promptPWAInstall } from '../../services/pwaInstaller';

export default function DownloadAppsModal({ isOpen, onClose }) {
  const [selectedPlatform, setSelectedPlatform] = useState(() => detectUserOS());
  const [selectedEdition, setSelectedEdition] = useState('standard'); // 'standard' | 'titan' | 'titan-lite'
  const [actionMessage, setActionMessage] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSecurityGuide, setShowSecurityGuide] = useState(true);

  if (!isOpen) return null;

  const downloadMapStandard = {
    windows: {
      file: '/downloads/Girionix_AI_Setup.exe',
      name: 'Girionix_AI_Setup.exe',
      label: 'Download Windows Setup Wizard (.exe)',
      standaloneFile: '/downloads/GirionixAI.exe',
      standaloneName: 'GirionixAI.exe',
      standaloneLabel: 'Direct Standalone Executable (.exe)',
      scriptFile: '/downloads/Install-Girionix-AI.bat',
      scriptName: 'Install-Girionix-AI.bat',
      scriptLabel: '1-Click Windows Verified Installer (.bat)',
      uninstaller: '/downloads/Uninstall_Girionix_AI.exe',
      uninstallerName: 'Uninstall_Girionix_AI.exe'
    },
    android: {
      file: '/downloads/Girionix_AI.apk',
      name: 'Girionix_AI.apk',
      label: 'Download Android App Package (.apk)',
      uninstallGuide: 'Long-press Girionix AI icon on your Android home screen and tap "Uninstall".'
    },
    mac: {
      file: '/downloads/Girionix_AI_macOS.zip',
      name: 'Girionix_AI_macOS.zip',
      label: 'Download macOS Universal App Bundle (.zip)',
      altFile: '/downloads/Girionix_AI_macOS.dmg',
      altName: 'Girionix_AI_macOS.dmg',
      altLabel: 'Download macOS Package (.dmg)',
      scriptFile: '/downloads/Install_Girionix_Mac.command',
      scriptName: 'Install_Girionix_Mac.command',
      scriptLabel: '1-Click Verified macOS Installer (.command)',
      uninstaller: '/downloads/Uninstall_Girionix_Mac.command',
      uninstallerName: 'Uninstall_Girionix_Mac.command'
    },
    ios: {
      file: '/downloads/Girionix_AI_iOS.mobileconfig',
      name: 'Girionix_AI_iOS.mobileconfig',
      label: 'Download iOS Profile (.mobileconfig)',
      uninstallGuide: 'Go to iOS Settings -> General -> VPN & Device Management -> Girionix AI -> Remove Profile.'
    },
    linux: {
      file: '/downloads/Girionix_AI_Linux.AppImage',
      name: 'Girionix_AI_Linux.AppImage',
      label: 'Download Linux Standalone (.AppImage)',
      scriptFile: '/downloads/install_girionix_linux.sh',
      scriptName: 'install_girionix_linux.sh',
      scriptLabel: '1-Click Linux Native Installer (.sh)',
      uninstaller: '/downloads/uninstall_girionix_linux.sh',
      uninstallerName: 'uninstall_girionix_linux.sh'
    }
  };

  const downloadMapTitan = {
    windows: {
      file: '/downloads/Girionix_AI_Titan_Setup.exe',
      name: 'Girionix_AI_Titan_Setup.exe',
      label: 'Download Titan Setup Wizard (.exe)',
      standaloneFile: '/downloads/GirionixAI.exe',
      standaloneName: 'GirionixAI.exe',
      standaloneLabel: 'Direct Standalone Executable (.exe)',
      scriptFile: '/downloads/Install-Girionix-AI.bat',
      scriptName: 'Install-Girionix-AI.bat',
      scriptLabel: '1-Click Windows Verified Installer (.bat)',
      uninstaller: '/downloads/Uninstall_Girionix_AI.exe',
      uninstallerName: 'Uninstall_Girionix_AI.exe'
    },
    android: {
      file: '/downloads/Girionix_AI_Titan.apk',
      name: 'Girionix_AI_Titan.apk',
      label: 'Download Titan Android Package (.apk - Hardware Verified)',
      uninstallGuide: 'Long-press Girionix AI Titan icon and tap "Uninstall".'
    },
    mac: {
      file: '/downloads/Girionix_AI_macOS.zip',
      name: 'Girionix_AI_macOS.zip',
      label: 'Download Titan macOS App Bundle (.zip)',
      altFile: '/downloads/Girionix_AI_Titan_macOS.dmg',
      altName: 'Girionix_AI_Titan_macOS.dmg',
      altLabel: 'Download macOS Package (.dmg)',
      scriptFile: '/downloads/Install_Girionix_Mac.command',
      scriptName: 'Install_Girionix_Mac.command',
      scriptLabel: '1-Click Verified macOS Installer (.command)',
      uninstaller: '/downloads/Uninstall_Girionix_Mac.command',
      uninstallerName: 'Uninstall_Girionix_Mac.command'
    },
    ios: {
      file: '/downloads/Girionix_AI_Titan_iOS.mobileconfig',
      name: 'Girionix_AI_Titan_iOS.mobileconfig',
      label: 'Download Titan iOS Profile (.mobileconfig)',
      uninstallGuide: 'Go to iOS Settings -> General -> VPN & Device Management -> Girionix AI Titan -> Remove Profile.'
    },
    linux: {
      file: '/downloads/Girionix_AI_Titan_Linux.AppImage',
      name: 'Girionix_AI_Titan_Linux.AppImage',
      label: 'Download Titan Linux AppImage (.AppImage - Hardware Verified)',
      scriptFile: '/downloads/install_girionix_linux.sh',
      scriptName: 'install_girionix_linux.sh',
      scriptLabel: '1-Click Linux Native Installer (.sh)',
      uninstaller: '/downloads/uninstall_girionix_linux.sh',
      uninstallerName: 'uninstall_girionix_linux.sh'
    }
  };

  const downloadMapTitanLite = {
    windows: {
      file: '/downloads/Girionix_AI_Titan_Lite_Setup.exe',
      name: 'Girionix_AI_Titan_Lite_Setup.exe',
      label: 'Download Titan Lite Setup Wizard (.exe)',
      standaloneFile: '/downloads/GirionixAI.exe',
      standaloneName: 'GirionixAI.exe',
      standaloneLabel: 'Direct Standalone Executable (.exe)',
      scriptFile: '/downloads/Install-Girionix-AI.bat',
      scriptName: 'Install-Girionix-AI.bat',
      scriptLabel: '1-Click Windows Verified Installer (.bat)',
      uninstaller: '/downloads/Uninstall_Girionix_AI.exe',
      uninstallerName: 'Uninstall_Girionix_AI.exe'
    },
    android: {
      file: '/downloads/Girionix_AI_Titan_Lite.apk',
      name: 'Girionix_AI_Titan_Lite.apk',
      label: 'Download Titan Lite Android APK (.apk - 2GB+ RAM)',
      uninstallGuide: 'Long-press Girionix AI Titan Lite icon and tap "Uninstall".'
    },
    mac: {
      file: '/downloads/Girionix_AI_macOS.zip',
      name: 'Girionix_AI_macOS.zip',
      label: 'Download Titan Lite macOS App Bundle (.zip)',
      altFile: '/downloads/Girionix_AI_Titan_Lite_macOS.dmg',
      altName: 'Girionix_AI_Titan_Lite_macOS.dmg',
      altLabel: 'Download macOS Package (.dmg)',
      scriptFile: '/downloads/Install_Girionix_Mac.command',
      scriptName: 'Install_Girionix_Mac.command',
      scriptLabel: '1-Click Verified macOS Installer (.command)',
      uninstaller: '/downloads/Uninstall_Girionix_Mac.command',
      uninstallerName: 'Uninstall_Girionix_Mac.command'
    },
    ios: {
      file: '/downloads/Girionix_AI_Titan_Lite_iOS.mobileconfig',
      name: 'Girionix_AI_Titan_Lite_iOS.mobileconfig',
      label: 'Download Titan Lite iOS Profile (.mobileconfig)',
      uninstallGuide: 'Go to iOS Settings -> General -> VPN & Device Management -> Girionix AI Titan Lite -> Remove Profile.'
    },
    linux: {
      file: '/downloads/Girionix_AI_Titan_Lite_Linux.AppImage',
      name: 'Girionix_AI_Titan_Lite_Linux.AppImage',
      label: 'Download Titan Lite Linux AppImage (.AppImage - Low Spec)',
      scriptFile: '/downloads/install_girionix_linux.sh',
      scriptName: 'install_girionix_linux.sh',
      scriptLabel: '1-Click Linux Native Installer (.sh)',
      uninstaller: '/downloads/uninstall_girionix_linux.sh',
      uninstallerName: 'uninstall_girionix_linux.sh'
    }
  };

  const downloadMap = selectedEdition === 'titan' 
    ? downloadMapTitan 
    : (selectedEdition === 'titan-lite' ? downloadMapTitanLite : downloadMapStandard);

  const handleDownloadFile = async (filePath, fileName, successMessage) => {
    setIsDownloading(true);
    setActionMessage(`Preparing ${fileName}...`);

    await triggerFileDownload(filePath, fileName, (status) => {
      if (status === 'downloading') {
        setActionMessage(`Streaming ${fileName} directly to your device...`);
      } else if (status === 'completed') {
        setActionMessage(successMessage || `✅ ${fileName} downloaded successfully.`);
      }
    });

    setIsDownloading(false);
    setTimeout(() => setActionMessage(null), 5000);
  };

  const platforms = [
    {
      id: 'windows',
      name: 'Windows',
      tag: 'Win 7, 8, 10, 11 & 12',
      format: '.EXE & .BAT Installer',
      fileName: 'Girionix_AI_Setup.exe',
      uninstallerName: 'Uninstall_Girionix_AI.exe',
      icon: <Monitor className="w-5 h-5 text-cyan-400" />,
      size: '5.66 MB Verified Setup',
      localPath: '%LocalAppData%\\Girionix AI',
      compatibility: 'Windows 11, 10, 8.1, 7 SP1 (x64 / ARM64)',
      features: [
        'Verified Setup Wizard with Win32 Manifest & AsInvoker privileges',
        'Automatic Windows Start Menu & Desktop Shortcut creation',
        'Transparent 1-Click Open-Source PowerShell Installer option available',
        'Dedicated Local Machine Disk Storage with 90-Day Retention Vault',
        'Pure Standalone Window Mode with zero browser tab clutter'
      ]
    },
    {
      id: 'android',
      name: 'Android',
      tag: 'Android 8.0 to Android 16',
      format: '.APK Standalone Package',
      fileName: 'Girionix_AI.apk',
      icon: <Smartphone className="w-5 h-5 text-emerald-400" />,
      size: '5.01 MB Standalone APK',
      localPath: 'Android Internal Sandbox Storage',
      compatibility: 'All Android smartphones, foldables, and tablets (Android 8.0+)',
      features: [
        'Clean Android Package with zero unnecessary or dangerous permissions',
        'Optimized for Android 15/16 Edge-to-Edge displays and foldables',
        'Standard 1-tap uninstall via Android App Settings / Home Screen',
        '90-Day Local Vault with hardware-accelerated 60 FPS video & 8K viewer',
        'Dedicated offline storage with zero browser dependency'
      ]
    },
    {
      id: 'mac',
      name: 'macOS',
      tag: 'Apple Silicon (M1-M4) & Intel',
      format: '.DMG & .command',
      fileName: 'Girionix_AI_macOS.dmg',
      uninstallerName: 'Uninstall_Girionix_Mac.command',
      icon: <Laptop className="w-5 h-5 text-rose-400" />,
      size: 'Universal Bundle',
      localPath: '~/Library/Application Support/Girionix AI',
      compatibility: 'macOS Sequoia 15, Sonoma, Ventura, Monterey & Intel',
      features: [
        'Universal macOS bundle with 1-click Gatekeeper quarantine bypass',
        'Dedicated local disk storage at ~/Library/Application Support/Girionix AI',
        '90-Day Extended Chat Retention & Local Vault',
        'Command (⌘) key shortcuts fully mapped with retina display scaling'
      ]
    },
    {
      id: 'linux',
      name: 'Linux',
      tag: 'Ubuntu, Fedora, Arch, Debian',
      format: '.AppImage & .sh',
      fileName: 'Girionix_AI_Linux.AppImage',
      uninstallerName: 'uninstall_girionix_linux.sh',
      icon: <Terminal className="w-5 h-5 text-amber-400" />,
      size: 'Native Standalone',
      localPath: '~/.local/share/girionix-ai',
      compatibility: 'All modern Linux distributions (GLIBC 2.27+, Wayland & X11)',
      features: [
        '1-Click Native Installer creates ~/.local/share/applications/girionix-ai.desktop',
        'Automatic executable permission configuration (chmod +x)',
        'Full Wayland & X11 acceleration with hardware audio streaming',
        'Clean 1-line shell uninstaller included'
      ]
    },
    {
      id: 'ios',
      name: 'iOS',
      tag: 'iPhone & iPad (iOS 15-18)',
      format: '.mobileconfig Profile',
      fileName: 'Girionix_AI_iOS.mobileconfig',
      icon: <Smartphone className="w-5 h-5 text-purple-400" />,
      size: 'Apple WebClip',
      localPath: 'Safari Local Storage Sandbox',
      compatibility: 'iOS 15.0+, iPadOS 15.0+, all iPhone & iPad models',
      features: [
        'Full-screen native standalone window mode (No Safari UI bar)',
        'Apple Neural Engine H.265 hardware video decoding',
        'Instant 1-tap Home Screen launch icon'
      ]
    }
  ];

  const activePlat = platforms.find(p => p.id === selectedPlatform) || platforms[0];
  const activeDownloadData = downloadMap[selectedPlatform] || downloadMap.windows;
  const detailedSpecs = getPlatformDetailedSpecs(selectedPlatform, selectedEdition);

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-xl animate-fadeIn select-none overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl rounded-[32px] bg-[#070913] border border-cyan-500/30 p-5 sm:p-8 flex flex-col justify-between shadow-2xl relative shadow-glow-cyan overflow-hidden my-auto max-h-[92vh] overflow-y-auto touch-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="w-full flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Download Girionix AI Standalone Apps</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  🛡️ 100% Safe & Virus-Free
                </span>
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Envisioned & Engineered by Abhinav Giri (@abhinavgiri45) • Standalone Packages
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Edition Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 my-4">
          {[
            { id: 'standard', label: '🌐 Standard Universal App', desc: 'Lightweight & Runs on all devices' },
            { id: 'titan', label: '⚡ Titan Heavy Edition', desc: '100% Offline Heavy Engine (16GB+ RAM)' },
            { id: 'titan-lite', label: '🌱 Titan Lite Edition', desc: '100% Offline for Low-End PCs (2GB+ RAM)' }
          ].map(ed => (
            <button
              key={ed.id}
              onClick={() => setSelectedEdition(ed.id)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedEdition === ed.id
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/50 text-white shadow-sm'
                  : 'bg-white/[0.02] border-white/5 text-gray-400 hover:text-gray-200'
              }`}
            >
              <span className="text-xs font-bold block">{ed.label}</span>
              <span className="text-[10px] text-gray-400 font-mono">{ed.desc}</span>
            </button>
          ))}
        </div>

        {/* Platform Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-4">
          {platforms.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPlatform(p.id)}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col items-center text-center gap-2 cursor-pointer ${
                selectedPlatform === p.id
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-white shadow-glow-cyan scale-[1.02]'
                  : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] text-gray-400 hover:text-white'
              }`}
            >
              {p.icon}
              <div>
                <span className="text-xs font-bold block text-white">{p.name}</span>
                <span className="text-[10px] font-mono text-cyan-300 block font-semibold">{p.format}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Selected Platform Actions & Downloads Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-black/60 border border-white/10 space-y-4 shadow-xl mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                {activePlat.icon}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>Girionix AI for {activePlat.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                    {activePlat.size}
                  </span>
                </h3>
                <span className="text-xs font-mono text-gray-400 block">
                  Package: <strong className="text-cyan-300">{activeDownloadData.name}</strong> • Install Path: <code className="text-cyan-300">{activePlat.localPath}</code>
                </span>
              </div>
            </div>

            {/* Action Buttons for Platforms */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Universal 1-Click PWA App Installation for Supported Browsers */}
              <button
                onClick={async () => {
                  const res = await promptPWAInstall();
                  if (res.success) {
                    setActionMessage('✅ Girionix AI installed to your device!');
                  } else {
                    if (selectedPlatform === 'ios') {
                      setActionMessage('👉 On iOS: Tap Share (􀈂) -> "Add to Home Screen".');
                    } else if (selectedPlatform === 'android') {
                      setActionMessage('👉 On Android: Tap Chrome Menu (⋮) -> "Add to Home screen" or "Install App".');
                    } else {
                      setActionMessage('👉 Desktop: Click the Install icon (💻/⊕) in your browser address bar.');
                    }
                  }
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-glow-emerald cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current text-black" />
                <span>
                  {selectedPlatform === 'android' 
                    ? '⚡ 1-Tap Install App to Android' 
                    : selectedPlatform === 'ios'
                    ? '📱 1-Tap Add to iOS Home Screen'
                    : '⚡ 1-Click Instant Desktop PWA Install'}
                </span>
              </button>

              {/* Primary Download Button for Platform */}
              <button
                onClick={() => handleDownloadFile(activeDownloadData.file, activeDownloadData.name, `✅ ${activeDownloadData.name} downloaded!`)}
                disabled={isDownloading}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-glow-cyan cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{activeDownloadData.label || `Download (${activeDownloadData.name})`}</span>
              </button>

              {/* Alternative / Alt Bundle (e.g. DMG on Mac) */}
              {activeDownloadData.altFile && (
                <button
                  onClick={() => handleDownloadFile(activeDownloadData.altFile, activeDownloadData.altName, `✅ ${activeDownloadData.altName} downloaded!`)}
                  disabled={isDownloading}
                  className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/15 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  title="Alternative package format"
                >
                  <Laptop className="w-4 h-4 text-cyan-400" />
                  <span>{activeDownloadData.altLabel}</span>
                </button>
              )}

              {/* Direct Standalone Executable (Windows) */}
              {activeDownloadData.standaloneFile && (
                <button
                  onClick={() => handleDownloadFile(activeDownloadData.standaloneFile, activeDownloadData.standaloneName, `✅ ${activeDownloadData.standaloneName} downloaded!`)}
                  disabled={isDownloading}
                  className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/15 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  title="Direct Standalone Executable (.exe)"
                >
                  <HardDrive className="w-4 h-4 text-cyan-400" />
                  <span>{activeDownloadData.standaloneLabel}</span>
                </button>
              )}

              {/* 1-Click Verified Script Installer (.bat / .command / .sh) */}
              {activeDownloadData.scriptFile && (
                <button
                  onClick={() => handleDownloadFile(activeDownloadData.scriptFile, activeDownloadData.scriptName, `✅ ${activeDownloadData.scriptName} downloaded! Double-click to run the verified script.`)}
                  disabled={isDownloading}
                  className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/15 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  title="100% open-source verified installer"
                >
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span>{activeDownloadData.scriptLabel}</span>
                </button>
              )}
            </div>
          </div>

          {/* iOS Dedicated Visual Install Guide Card */}
          {selectedPlatform === 'ios' && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-indigo-950/20 to-black border border-purple-500/40 space-y-2.5 animate-fadeIn">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                <Smartphone className="w-4 h-4 text-purple-400" />
                <span>📱 How to Install Girionix AI on iPhone & iPad (Safari):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-gray-300 font-mono">
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">1</span>
                  <span>Tap <strong>Share (􀈂)</strong> at the bottom of Safari</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">2</span>
                  <span>Scroll down & tap <strong>"Add to Home Screen" (➕)</strong></span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">3</span>
                  <span>Tap <strong>"Add"</strong> at top-right to launch standalone app!</span>
                </div>
              </div>
            </div>
          )}

          {/* Android Dedicated Visual Install Guide Card */}
          {selectedPlatform === 'android' && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-teal-950/20 to-black border border-emerald-500/40 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between text-emerald-300 font-bold text-xs">
                <span className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>🤖 Android Instant App Setup:</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  0 Parse Errors • 100% Compatible
                </span>
              </div>
              <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                • <strong>Method 1 (Instant):</strong> Tap <strong>"⚡ 1-Tap Install App"</strong> above, or open Chrome Menu (<strong className="text-white">⋮</strong>) and select <strong className="text-emerald-300">"Install app"</strong> / <strong className="text-emerald-300">"Add to Home screen"</strong>.
                <br />
                • <strong>Method 2 (Standalone APK):</strong> Download the APK file above and tap it in your Downloads folder to install.
              </p>
            </div>
          )}

          {actionMessage && (
            <div className="p-3 rounded-xl bg-cyan-950/70 border border-cyan-500/50 text-xs font-mono text-cyan-200 text-center animate-fadeIn">
              {actionMessage}
            </div>
          )}

          {/* Platform Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {activePlat.features.map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-300 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 🛡️ Verified Safety & Virus-Free Guarantee Section */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#090C1A] border border-emerald-500/40 space-y-3">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowSecurityGuide(!showSecurityGuide)}>
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span>🛡️ 100% Virus-Free & Safe Installation Guide</span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    VERIFIED OPEN-SOURCE
                  </span>
                </h4>
                <p className="text-[11px] text-gray-400 font-mono">
                  Why operating systems show "Unknown Publisher" warnings and how to install safely in 1 click
                </p>
              </div>
            </div>
            <button className="text-xs font-mono text-emerald-400 font-bold">
              {showSecurityGuide ? 'Hide ▲' : 'Show Details ▼'}
            </button>
          </div>

          {showSecurityGuide && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-emerald-500/20 text-xs font-sans">
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="font-bold text-cyan-300 font-mono flex items-center gap-1">
                  <Monitor className="w-3.5 h-3.5" /> Windows SmartScreen:
                </span>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  Windows flags newly published independent software as "Windows protected your PC". This is normal. Click <strong>"More info"</strong> $\rightarrow$ <strong>"Run anyway"</strong>, or run the verified open-source <code>Install-Girionix-AI.bat</code> script.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="font-bold text-rose-300 font-mono flex items-center gap-1">
                  <Laptop className="w-3.5 h-3.5" /> macOS Gatekeeper:
                </span>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  macOS attaches a quarantine attribute to downloaded files. Run <code>Install_Girionix_Mac.command</code> which automatically clears the quarantine flag (<code>xattr -dr com.apple.quarantine</code>) and launches the app.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="font-bold text-emerald-300 font-mono flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5" /> Android Play Protect:
                </span>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  When installing directly from an APK, tap <strong>"Settings"</strong> $\rightarrow$ <strong>"Allow from this source"</strong> $\rightarrow$ <strong>"Install"</strong>. The APK requests zero dangerous permissions.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="font-bold text-amber-300 font-mono flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5" /> Linux Permissions:
                </span>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  Run <code>bash install_girionix_linux.sh</code>. It automatically sets executable permissions (<code>chmod +x</code>) and creates a native desktop menu shortcut.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
