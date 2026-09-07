import React from 'react';
import StudioDedicatedBar from './StudioDedicatedBar';
import CodeStudio from '../code/CodeStudio';
import ScriptStudio from '../script/ScriptStudio';
import MathLab from '../math/MathLab';
import ImageStudio from '../image/ImageStudio';
import VideoStudio from '../video/VideoStudio';
import AudioStudio from '../audio/AudioStudio';

export default function StudioPanel({
  activeStudioTab,
  setActiveStudioTab,
  activeModel,
  injectedCode,
  onClose,
  isAppInstalled,
  isTitanMode = false,
  onOpenDownload
}) {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#060814] border-l border-white/[0.08] overflow-hidden shadow-2xl">
      {/* Dedicated Specialized AI Model & Domain Switcher Bar */}
      <StudioDedicatedBar
        activeStudioTab={activeStudioTab}
        setActiveStudioTab={setActiveStudioTab}
        isTitanMode={isTitanMode}
        onClose={onClose}
        isAppInstalled={isAppInstalled}
        onOpenDownload={onOpenDownload}
      />

      {/* Main Studio Viewport */}
      <div className="flex-1 overflow-hidden relative">
        {activeStudioTab === 'code' && (
          <CodeStudio 
            activeModel={activeModel} 
            injectedCode={injectedCode} 
            isTitanMode={isTitanMode}
          />
        )}
        {activeStudioTab === 'script' && (
          <ScriptStudio 
            activeModel={activeModel} 
            isTitanMode={isTitanMode}
          />
        )}
        {activeStudioTab === 'math' && (
          <MathLab 
            activeModel={activeModel} 
            isTitanMode={isTitanMode}
          />
        )}
        {activeStudioTab === 'image' && (
          <ImageStudio 
            activeModel={activeModel} 
            isTitanMode={isTitanMode}
            onOpenVideoStudio={() => setActiveStudioTab('video')}
          />
        )}
        {activeStudioTab === 'video' && (
          <VideoStudio 
            activeModel={activeModel} 
            isAppInstalled={isAppInstalled} 
            isTitanMode={isTitanMode} 
            onOpenDownload={onOpenDownload} 
          />
        )}
        {activeStudioTab === 'audio' && (
          <AudioStudio 
            activeModel={activeModel} 
            isTitanMode={isTitanMode}
          />
        )}
      </div>
    </div>
  );
}
