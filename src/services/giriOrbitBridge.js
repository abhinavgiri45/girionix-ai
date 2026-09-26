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

export function normalizeToolName(tool) {
  if (!tool || typeof tool !== 'string') return null;
  const t = tool.toLowerCase().trim();
  if (t === 'axis' || t === 'sheet' || t === 'sheets' || t === 'spreadsheet' || t === 'grid' || t === 'table') return 'axis';
  if (t === 'drift' || t === 'doc' || t === 'docs' || t === 'writer' || t === 'word') return 'drift';
  if (t === 'kinetic' || t === 'show' || t === 'slides' || t === 'presentation' || t === 'deck') return 'kinetic';
  if (t === 'aegis' || t === 'pdf' || t === 'pdf-studio' || t === 'pdfstudio') return 'aegis';
  return null;
}

class GiriOrbitBridgeService {
  constructor() {
    let initialTool = 'drift';
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const raw = params.get('tool') || params.get('lockTool') || params.get('officeTool') || params.get('app') || params.get('station');
        const norm = normalizeToolName(raw);
        if (norm) initialTool = norm;
      } catch (_) {}
    }

    this.orbitContext = {
      connected: false,
      activeTool: initialTool, // 'drift' | 'axis' | 'kinetic' | 'aegis'
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
      
      // 1. Explicit dedicated Orbit route
      const isExplicitPath = path === '/orbit' || path.startsWith('/orbit/') || 
                             path === '/office' || path.startsWith('/office/');
      if (isExplicitPath) return true;

      // 2. Explicit dedicated Orbit query parameter
      const isExplicitParam = params.get('mode') === 'orbit' || 
                              params.get('mode') === 'office' || 
                              params.get('source') === 'orbit' || 
                              params.get('portal') === 'orbit' ||
                              params.get('embed') === 'orbit' ||
                              params.get('embed') === 'office';
      if (isExplicitParam) return true;

      // 3. True iframe embedding from Giri Orbit parent
      const isIframe = window.self !== window.top;
      if (isIframe) {
        const isOrbitReferrer = typeof document !== 'undefined' && 
                                document.referrer && 
                                document.referrer.includes('giri-orbit.pages.dev');
        if (isOrbitReferrer || params.get('embed') === 'true' || params.has('orbit') || params.has('office')) {
          return true;
        }
      }

      return false;
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

      const type = e.data.type || '';
      const payload = e.data.payload || e.data;

      // Extract tool across any known Giri Orbit message protocol
      const rawTool = payload.tool || payload.activeTool || payload.officeTool || 
                      payload.currentView || payload.module || payload.mode || 
                      payload.lockTool || e.data.tool || e.data.activeTool;
      const normalizedTool = normalizeToolName(rawTool);

      if (normalizedTool) {
        this.orbitContext.activeTool = normalizedTool;
        this.orbitContext.connected = true;
        this.notifyListeners();
        window.dispatchEvent(new CustomEvent('girionix:orbit-tool-detected', { detail: { tool: normalizedTool } }));
      }

      // Handle handshake from parent Giri Orbit
      if (type === 'GIRI_ORBIT_HANDSHAKE' || type === 'GIRIONIX_ORBIT_HANDSHAKE') {
        this.orbitContext.connected = true;
        if (normalizedTool) this.orbitContext.activeTool = normalizedTool;
        if (payload.documentTitle) this.orbitContext.documentTitle = payload.documentTitle;
        if (payload.operatorName || payload.userName) {
          this.orbitContext.operatorName = payload.operatorName || payload.userName;
        }
        this.notifyListeners();
        
        // Acknowledge handshake
        if (e.source) {
          e.source.postMessage({
            type: 'GIRIONIX_ORBIT_ACKNOWLEDGE',
            payload: { status: 'ready', activeTool: this.orbitContext.activeTool, edition: 'Giri Orbit Dedicated AI Workstation v2.0' }
          }, '*');
        }
      }

      // Handle direct tool selection / lock messages from parent Giri Orbit
      if (
        type === 'SET_ACTIVE_TOOL' || 
        type === 'LOCK_TOOL' || 
        type === 'ORBIT_TOOL_CHANGE' || 
        type === 'GIRIONIX_SET_TOOL' || 
        type === 'SET_OFFICE_TOOL' || 
        type === 'SELECT_TOOL' || 
        type === 'GIRI_ORBIT_SELECT_TOOL'
      ) {
        if (normalizedTool) {
          this.orbitContext.activeTool = normalizedTool;
          this.orbitContext.connected = true;
          this.notifyListeners();
        }
      }

      // Handle context injection (e.g. user selected text in Drift or a cell in Axis)
      if (type === 'GIRI_ORBIT_INJECT_CONTEXT' || type === 'INJECT_CONTEXT') {
        if (normalizedTool) this.orbitContext.activeTool = normalizedTool;
        if (payload.documentTitle) this.orbitContext.documentTitle = payload.documentTitle;
        if (payload.selectedContent) this.orbitContext.selectedContent = payload.selectedContent;
        this.orbitContext.connected = true;
        this.notifyListeners();
      }

      // Handle prompt execution from parent Giri Orbit Quick Assist
      if (type === 'GIRIONIX_EXECUTE_PROMPT') {
        const prompt = payload.prompt || e.data.prompt || '';
        if (prompt) {
          window.dispatchEvent(new CustomEvent('girionix:orbit-execute-prompt', { detail: { prompt } }));
        }
      }

      // Handle request for latest AI message
      if (type === 'GIRIONIX_REQUEST_LATEST_MESSAGE') {
        window.dispatchEvent(new CustomEvent('girionix:orbit-request-latest', { detail: { source: e.source } }));
      }
    });

    // Announce availability and immediately request current tool from parent window if embedded
    if (window.self !== window.top) {
      try {
        window.parent.postMessage({
          type: 'GIRIONIX_ORBIT_STATION_MOUNTED',
          payload: { timestamp: Date.now(), station: 'Girionix Orbit Co-Pilot' }
        }, '*');
        window.parent.postMessage({
          type: 'GIRIONIX_REQUEST_ACTIVE_TOOL'
        }, '*');
        window.parent.postMessage({
          type: 'GIRI_ORBIT_GET_STATE'
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
  buildOrbitSystemDirective(activeTool = 'drift', autoDetected = false) {
    const tool = ORBIT_TOOLS[activeTool?.toUpperCase()] || ORBIT_TOOLS.DRIFT;
    const autoNote = autoDetected 
      ? `\n[INTELLIGENT AUTO-IDENTIFICATION: Context dynamically tuned to ${tool.name} (${tool.category}) based on prompt semantics and office workflow requirements]`
      : '';

    return `\n\n[GIRI ORBIT HIGH-PRECISION SUITE DIRECTIVE: ACTIVE TOOL = ${tool.name.toUpperCase()} (${tool.category.toUpperCase()})]${autoNote}
You are functioning as the official dedicated AI Co-Pilot for ${tool.name} in the Giri Orbit Enterprise Office Suite (https://giri-orbit.pages.dev).
You MUST provide world-class, professional output tailored strictly to the current office tool context:

- When ACTIVE TOOL is GIRI AXIS (Spreadsheets & Financial Models):
  1. Provide structured financial assumptions and architecture first.
  2. Structure numerical projections strictly inside a high-density, perfectly formatted Markdown Table with clear column headers (e.g. Metric, Q1, Q2, Q3, Q4, FY Total, YoY Growth).
  3. Include an explicit section: "### 📐 Executable Spreadsheet Formulas (For Giri Axis / Excel)" detailing the exact formulas (e.g. \`=SUM(C2:F2)\`, \`=AVERAGE(B3:B10)\`, \`=IF(E5>0, "Profitable", "Deficit")\`, \`=VLOOKUP(...)\`) so the operator can copy them straight into spreadsheet cells.
  4. Conclude with 3 key financial sensitivity notes and margin variances.

- When ACTIVE TOOL is GIRI KINETIC (Presentations & Keynotes):
  1. Structure your output slide-by-slide with horizontal rule separators (\`---\`).
  2. For EACH slide, supply:
     - \`### 🎞️ Slide [N]: [Catchy Executive Title]\`
     - **Headline / Core Hook**: (1 punchy line)
     - **Slide Visual & Layout**: (Describe charts, iconography, or split-column visuals)
     - **Key Talking Points**: (3-4 crisp, high-impact bullet points)
     - **Speaker Notes / Stage Track**: (What the presenter should say out loud)
  3. Keep language punchy, persuasive, and designed for high visual engagement.

- When ACTIVE TOOL is GIRI AEGIS (PDF Studio & Compliance Auditing):
  1. Produce legally structured, audit-grade documentation (e.g. NDA, SLA addendum, terms, compliance disclosure).
  2. Include an official cryptographic audit stamp banner at the top or bottom:
\`\`\`
╔══════════════════════════════════════════════════════════════════════════════╗
║ GIRI AEGIS ENTERPRISE VERIFICATION STAMP & AUDIT ADDENDUM                    ║
║ Document ID: GIRI-AEGIS-${Math.floor(100000 + Math.random() * 900000)} • Status: VERIFIED & COMPLIANT           ║
║ Cryptographic Protocol: SHA-256 ZERO-TELEMETRY CERTIFIED                     ║
║ Authority: Giri Corporation Enterprise Digital Governance Framework          ║
╚══════════════════════════════════════════════════════════════════════════════╝
\`\`\`
  3. Use formal legal precision, defined terms, liability limitations, and execution signature blocks.

- When ACTIVE TOOL is GIRI DRIFT (Word Processor & Executive Documentation):
  1. Structure as an enterprise memorandum, whitepaper, or standard operating procedure (SOP).
  2. Include Executive Summary, Background, Strategic Objectives, Scope & Deliverables, Risk Mitigation, and Action Items with owners and deadlines.
  3. Provide publication-ready prose with clean markdown hierarchy (#, ##, ###, bullet points, callout blockquotes).

Deliver immediate, production-ready, executive-quality results with zero filler.`;
  }
}

/**
 * Intelligent Tool Auto-Identification Engine
 * Evaluates prompt keywords, formulas, and structural patterns to classify
 * the optimal Giri Orbit tool: 'axis', 'kinetic', 'aegis', or 'drift'.
 */
export function detectToolFromPrompt(text, currentTool = 'drift') {
  if (!text || typeof text !== 'string') {
    const currentObj = ORBIT_TOOLS[currentTool?.toUpperCase()] || ORBIT_TOOLS.DRIFT;
    return {
      detectedTool: currentTool || 'drift',
      toolName: currentObj.name,
      confidence: 'none',
      reason: 'No prompt text',
      matchedKeywords: []
    };
  }

  const clean = text.toLowerCase();

  // Pattern definitions with weights
  const axisPatterns = [
    { pattern: /=(sum|average|vlookup|hlookup|xlookup|if|count|index|match|pmt|irr|npv|stdev|round|max|min)\s*\(/i, weight: 15, name: 'spreadsheet formula' },
    { pattern: /\b(spreadsheet|worksheet|tabular|csv|excel|tsv|workbook|sheet)\b/i, weight: 8, name: 'spreadsheet' },
    { pattern: /\b(table of|in a table|data table|column[s]?|row[s]?|cell[s]?)\b/i, weight: 6, name: 'table structure' },
    { pattern: /\b(revenue|opex|capex|ebitda|gross profit|net income|balance sheet|p&l|profit and loss|cash flow|cagr|variance|financial model|unit economics|cac|ltv|churn rate|arpu|q1|q2|q3|q4|fiscal year)\b/i, weight: 5, name: 'financial metrics' },
    { pattern: /\b(calculate|sum of|average of|forecast model|budget tracker|projection table)\b/i, weight: 5, name: 'numerical forecast' }
  ];

  const kineticPatterns = [
    { pattern: /\b(slide[s]?|slide \d+|slideshow|keynote|pitch deck|deck outline|presentation deck|powerpoint|ppt|deck)\b/i, weight: 10, name: 'presentation slide' },
    { pattern: /\b(presentation outline|pitch to investors|investor pitch|board deck|all-hands deck|keynote speech|speaker notes|talk track)\b/i, weight: 8, name: 'presentation outline' },
    { pattern: /\b(swot analysis slide|market traction slide|product reveal keynote|vision slide|closing slide)\b/i, weight: 7, name: 'keynote slide' }
  ];

  const aegisPatterns = [
    { pattern: /\b(pdf|contract|agreement|nda|non-disclosure|sla|service level agreement|sublease|memorandum of understanding|mou)\b/i, weight: 10, name: 'contract / agreement' },
    { pattern: /\b(compliance|audit stamp|audit trail|cryptographic seal|verification seal|gdpr|soc-2|hipaa|iso 27001|regulatory compliance)\b/i, weight: 9, name: 'audit stamp / compliance' },
    { pattern: /\b(indemnity|governing law|jurisdiction|confidentiality clause|liability clause|severability|sign-off block|authorized signature)\b/i, weight: 7, name: 'legal clause' },
    { pattern: /\b(watermark|tamper-evident|zero-telemetry stamp|digital seal)\b/i, weight: 8, name: 'security seal' }
  ];

  const driftPatterns = [
    { pattern: /\b(executive memo|memorandum|briefing memo|strategic briefing|formal letter|press release|whitepaper|manifesto)\b/i, weight: 8, name: 'executive memo' },
    { pattern: /\b(sop|standard operating procedure|documentation|policy document|handbook|minutes of meeting)\b/i, weight: 7, name: 'SOP / documentation' },
    { pattern: /\b(draft a doc|draft a document|write an article|essay|narrative|writeup)\b/i, weight: 5, name: 'document drafting' }
  ];

  let scores = {
    axis: 0,
    kinetic: 0,
    aegis: 0,
    drift: 0
  };

  let matchedReasons = {
    axis: [],
    kinetic: [],
    aegis: [],
    drift: []
  };

  const evaluate = (toolKey, list) => {
    for (const item of list) {
      if (item.pattern.test(clean)) {
        scores[toolKey] += item.weight;
        matchedReasons[toolKey].push(item.name);
      }
    }
  };

  evaluate('axis', axisPatterns);
  evaluate('kinetic', kineticPatterns);
  evaluate('aegis', aegisPatterns);
  evaluate('drift', driftPatterns);

  // Direct explicit keyword override (e.g. "for Giri Axis", "in Giri Kinetic", "for Aegis")
  if (clean.includes('axis') || clean.includes('giri axis')) {
    scores.axis += 25;
    matchedReasons.axis.push('Explicit Axis reference');
  }
  if (clean.includes('kinetic') || clean.includes('giri kinetic')) {
    scores.kinetic += 25;
    matchedReasons.kinetic.push('Explicit Kinetic reference');
  }
  if (clean.includes('aegis') || clean.includes('giri aegis')) {
    scores.aegis += 25;
    matchedReasons.aegis.push('Explicit Aegis reference');
  }
  if (clean.includes('drift') || clean.includes('giri drift')) {
    scores.drift += 25;
    matchedReasons.drift.push('Explicit Drift reference');
  }

  // Find max score
  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [topTool, topScore] = entries[0];

  if (topScore >= 5) {
    const confidence = topScore >= 12 ? 'high' : topScore >= 7 ? 'medium' : 'low';
    const toolObj = ORBIT_TOOLS[topTool.toUpperCase()];
    return {
      detectedTool: topTool,
      toolName: toolObj?.name || topTool,
      confidence,
      score: topScore,
      reason: matchedReasons[topTool].slice(0, 2).join(' & ') || 'Contextually matched input',
      matchedKeywords: matchedReasons[topTool]
    };
  }

  // Default fallback to current tool
  const currentObj = ORBIT_TOOLS[currentTool?.toUpperCase()] || ORBIT_TOOLS.DRIFT;
  return {
    detectedTool: currentTool || 'drift',
    toolName: currentObj.name,
    confidence: 'neutral',
    score: 0,
    reason: `Station default (${currentObj.name})`,
    matchedKeywords: []
  };
}

export const giriOrbitBridge = new GiriOrbitBridgeService();
