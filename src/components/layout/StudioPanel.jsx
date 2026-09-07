import React from 'react';
import GoogleAIStudio from '../studio/GoogleAIStudio';

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
    <div className="flex-1 flex flex-col h-full bg-[#131314] border-l border-[#3c4043]/40 overflow-hidden shadow-2xl">
      {/* Main Google AI Studio Viewport */}
      <div className="flex-1 overflow-hidden relative">
        <GoogleAIStudio 
          activeModel={activeModel}
          isTitanMode={isTitanMode}
          injectedCode={injectedCode}
          onClose={onClose}
          initialMode={activeStudioTab === 'freeform' ? 'freeform' : activeStudioTab === 'structured' ? 'structured' : activeStudioTab === 'multimodal' ? 'multimodal' : 'chat'}
        />
      </div>
    </div>
  );
}
