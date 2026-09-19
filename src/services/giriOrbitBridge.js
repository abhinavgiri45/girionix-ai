/**
 * Giri Orbit Dedicated Bridge & Protocol Contract
 * Formal integration treaty between Girionix AI and Giri Orbit (https://giri-orbit.pages.dev)
 * 
 * Provides an isolated, dedicated AI workstation specifically designed for:
 * 1. Giri Drift (Word Processor & Executive Docs)
 * 2. Giri Axis (Spreadsheets & Financial Modeling)
 * 3. Giri Kinetic (Presentations & Keynote Decks)
 * 4. Giri Aegis (PDF Studio & Compliance Auditing)
 */

export const GIRI_ORBIT_ORIGIN = 'https://giri-orbit.pages.dev';

export const ORBIT_TOOLS = {
  DRIFT: {
    id: 'drift',
    name: 'Giri Drift',
    category: 'Word Processor',
    icon: 'FileText',
    color: 'blue',
    accent: '#3B82F6',
    tagline: 'Executive Documentation & Strategic Briefings',
    samplePrompt: 'Draft an executive briefing memorandum on Q3 operational milestones with clear deliverables and recommendations for Giri Drift.'
  },
  AXIS: {
    id: 'axis',
    name: 'Giri Axis',
    category: 'Spreadsheet Model',
    icon: 'Table',
    color: 'emerald',
    accent: '#10B981',
    tagline: '4-Quarter Financial Projections & Mathematical Models',
    samplePrompt: 'Generate a 4-quarter financial projection spreadsheet table with Revenue, OPEX, EBITDA, and spreadsheet formulas for Giri Axis.'
  },
  KINETIC: {
    id: 'kinetic',
    name: 'Giri Kinetic',
    category: 'Presentation Deck',
    icon: 'Presentation',
    color: 'purple',
    accent: '#A855F7',
    tagline: 'High-Impact Executive Keynotes & Strategic Slides',
    samplePrompt: 'Create a 4-slide executive keynote presentation outline with SWOT analysis, KPI metrics, and vision for Giri Kinetic.'
  },
  AEGIS: {
    id: 'aegis',
    name: 'Giri Aegis',
    category: 'PDF Studio',
    icon: 'ShieldCheck',
    color: 'cyan',
    accent: '#06B6D4',
    tagline: 'Cryptographic Audit Stamps & Compliance Seals',
    samplePrompt: 'Synthesize an enterprise cryptographic audit addendum and legal compliance verification stamp for an official PDF document.'
  }
};

class GiriOrbitBridgeService {
  constructor() {
    this.orbitContext = {
      connected: false,
      activeTool: 'drift', // 'drift' | 'axis' | 'kinetic' | 'aegis'
      documentTitle: 'Untitled Document',
      operatorName: 'Orbit Workspace Member',
      selectedContent: ''
    };
    this.listeners = new Set();
  }

  /**
   * Check if current runtime is within the dedicated Giri Orbit Workstation
   */
  isOrbitMode() {
    try {
      if (typeof window === 'undefined') return false;
      const path = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const params = new URLSearchParams(window.location.search);
      
      const isExplicitPath = path === '/orbit' || path.startsWith('/orbit/');
      const isExplicitParam = params.get('mode') === 'orbit' || 
                              params.get('mode') === 'office' || 
                              params.get('source') === 'orbit' || 
                              params.get('portal') === 'orbit' ||
                              params.get('embed') === 'orbit' ||
                              params.get('embed') === 'office';
      const isOrbitReferrer = typeof document !== 'undefined' && 
                              document.referrer && 
                              document.referrer.includes('giri-orbit.pages.dev');
      const isIframeFromOrbit = (window.self !== window.top) && (isOrbitReferrer || params.has('orbit') || params.has('office'));

      return Boolean(isExplicitPath || isExplicitParam || isIframeFromOrbit);
    } catch (_) {
      return false;
    }
  }

  /**
   * Initialize bridge listener for bidirectional parent/iframe communication
   */
  initBridge() {
    if (typeof window === 'undefined') return;

    window.addEventListener('message', (e) => {
      if (!e.data || typeof e.data !== 'object') return;

      // Handle handshake from parent Giri Orbit
      if (e.data.type === 'GIRI_ORBIT_HANDSHAKE' || e.data.type === 'GIRIONIX_ORBIT_HANDSHAKE') {
        const payload = e.data.payload || {};
        this.orbitContext = {
          connected: true,
          activeTool: payload.activeTool || this.orbitContext.activeTool,
          documentTitle: payload.documentTitle || this.orbitContext.documentTitle,
          operatorName: payload.operatorName || payload.userName || this.orbitContext.operatorName,
          selectedContent: payload.selectedContent || ''
        };
        this.notifyListeners();
        
        // Acknowledge handshake
        if (e.source) {
          e.source.postMessage({
            type: 'GIRIONIX_ORBIT_ACKNOWLEDGE',
            payload: { status: 'ready', edition: 'Giri Orbit Dedicated AI Workstation v2.0' }
          }, '*');
        }
      }

      // Handle context injection (e.g. user selected text in Drift or a cell in Axis)
      if (e.data.type === 'GIRI_ORBIT_INJECT_CONTEXT') {
        const payload = e.data.payload || {};
        if (payload.activeTool) this.orbitContext.activeTool = payload.activeTool;
        if (payload.documentTitle) this.orbitContext.documentTitle = payload.documentTitle;
        if (payload.selectedContent) this.orbitContext.selectedContent = payload.selectedContent;
        this.orbitContext.connected = true;
        this.notifyListeners();
      }

      // Handle request for latest AI message
      if (e.data.type === 'GIRIONIX_REQUEST_LATEST_MESSAGE') {
        window.dispatchEvent(new CustomEvent('girionix:orbit-request-latest', { detail: { source: e.source } }));
      }
    });

    // Announce availability to parent window if embedded
    if (window.self !== window.top) {
      try {
        window.parent.postMessage({
          type: 'GIRIONIX_ORBIT_STATION_MOUNTED',
          payload: { timestamp: Date.now(), station: 'Girionix Orbit Co-Pilot' }
        }, '*');
      } catch (_) {}
    }
  }

  /**
   * Subscribe to Orbit context changes
   */
  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.orbitContext);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach(cb => {
      try { cb(this.orbitContext); } catch (_) {}
    });
  }

  /**
   * Import content into active Giri Orbit workplace (Drift, Axis, Kinetic, Aegis)
   */
  importToWorkplace(content, toolId = null) {
    if (typeof window === 'undefined' || !content) return;

    const targetTool = toolId || this.orbitContext.activeTool || 'drift';
    const payload = {
      tool: targetTool,
      text: content,
      timestamp: Date.now(),
      format: targetTool === 'axis' ? 'table' : targetTool === 'kinetic' ? 'slides' : 'markdown'
    };

    // 1. Post to parent window (if embedded in Giri Orbit iframe)
    try {
      window.parent.postMessage({
        type: 'GIRIONIX_IMPORT_TO_WORKPLACE',
        payload
      }, '*');
    } catch (_) {}

    // 2. Post to opener window (if opened as popup from Giri Orbit)
    try {
      if (window.opener) {
        window.opener.postMessage({
          type: 'GIRIONIX_IMPORT_TO_WORKPLACE',
          payload
        }, '*');
      }
    } catch (_) {}

    // 3. Fallback: Copy clean formatted text to clipboard
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(content);
      }
    } catch (_) {}

    return true;
  }

  /**
   * Build an official office system prompt directive for the active Orbit tool
   */
  buildOrbitSystemDirective(activeTool = 'drift') {
    const tool = ORBIT_TOOLS[activeTool?.toUpperCase()] || ORBIT_TOOLS.DRIFT;
    return `\n\n[GIRI ORBIT DEDICATED SUITE DIRECTIVE: ACTIVE TOOL = ${tool.name.toUpperCase()} (${tool.category.toUpperCase()})]
You are functioning as the official dedicated AI Co-Pilot for ${tool.name} in the Giri Orbit Office Suite (https://giri-orbit.pages.dev).
- Target Output Requirements:
  - If Giri Drift (Docs): Provide clear executive headings, bulleted deliverables, and publication-ready prose.
  - If Giri Axis (Spreadsheets): Structure outputs strictly as formatted tabular data with headers, and supply executable spreadsheet formulas (e.g. =SUM, =AVERAGE, =VLOOKUP, =GROWTH).
  - If Giri Kinetic (Presentations): Format content as a slide deck with Slide 1 (Title/Vision), Slide 2 (Key Metrics/Data), Slide 3 (SWOT/Strategy), Slide 4 (Next Milestones & CTA).
  - If Giri Aegis (PDF & Security): Provide an official compliance audit stamp, cryptographic verification notation, and zero-telemetry sign-off block.
- Maintain professional, enterprise-grade executive precision.`;
  }
}

export const giriOrbitBridge = new GiriOrbitBridgeService();
