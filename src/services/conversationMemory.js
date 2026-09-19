/**
 * GIRIONIX AI — HIGH-FIDELITY CONVERSATION MEMORY & CONTINUITY ENGINE
 * Envisioned & Engineered by Abhinav Giri (@abhinavgiri45) under Giri Corporation.
 * 
 * Capabilities:
 * 1. Deep Multi-Turn Context Preservation: Retains full conversational thread across turns.
 * 2. Anaphora & Reference Resolution: Resolves pronouns ("it", "that", "the code", "why?", "more examples")
 *    using the immediate previous assistant & user turns.
 * 3. Exact Memory Recall: Accurately answers "what was my last question?", "what did you say earlier?",
 *    "what is my name?", "recap our conversation", and "summarize our chat".
 * 4. Gemini API Multi-Turn Alternation Normalizer: Eliminates HTTP 400 Bad Request errors
 *    ("Please ensure that multiturn requests alternate between user and model roles") by
 *    strictly normalizing and merging consecutive turns into seamless alternating dialogue.
 * 5. Clean Context Buffer & Token Management: Filters out ephemeral UI errors and formats
 *    high-fidelity dialogue turns for OpenAI, Anthropic, Gemini, DeepSeek, and Groq.
 */

import { storage } from './storage.js';

export const conversationMemory = {
  /**
   * Cleans raw message content:
   * - Strips ephemeral error notices
   * - Preserves media and code metadata
   */
  cleanMessageText(content) {
    if (!content || typeof content !== 'string') return '';
    let cleaned = content.trim();

    // Strip transient system error notices
    if (cleaned.startsWith('⚠️') && (cleaned.includes('Notice') || cleaned.includes('Status') || cleaned.includes('Tools (🔧)'))) {
      return '';
    }

    return cleaned;
  },

  /**
   * Filters and normalizes session messages into valid dialogue turns
   */
  getValidTurns(messages = []) {
    if (!Array.isArray(messages)) return [];

    const validTurns = [];
    for (const msg of messages) {
      if (!msg) continue;
      if (msg.id === 'welcome') continue;

      const role = msg.role === 'assistant' || msg.role === 'model' ? 'assistant' : 'user';
      let text = this.cleanMessageText(msg.content);

      // Preserve media indicators if textual content was minimal
      if (!text) {
        if (msg.generatedImage) {
          text = `[Assistant generated visual design: "${msg.generatedImage.prompt || 'Image'}"]`;
        } else if (msg.generatedVideo) {
          text = `[Assistant generated cinematic video storyboard: "${msg.generatedVideo.prompt || 'Video'}"]`;
        } else if (msg.mindMapTopic) {
          text = `[Assistant generated dynamic mind map for: "${msg.mindMapTopic}"]`;
        } else if (msg.attachedFile) {
          text = `[User provided file: ${msg.attachedFile.name} (${msg.attachedFile.size || ''})]`;
        }
      }

      if (text) {
        validTurns.push({
          id: msg.id,
          role,
          content: text,
          timestamp: msg.timestamp || ''
        });
      }
    }

    return validTurns;
  },

  /**
   * Extract conversational entities, user preferences, and working memory facts
   */
  /**
   * Extract conversational entities, user preferences, and working memory facts
   */
  extractSessionMemory(messages = [], defaultUserName = '') {
    const turns = this.getValidTurns(messages);
    const userTurns = turns.filter(t => t.role === 'user');

    const memory = {
      userName: defaultUserName || storage.getUserName() || 'Friend',
      activeTopic: '',
      codeLanguage: '',
      keyEntities: [],
      recentTurnsSummary: [],
      turnCount: turns.length,
      totalUserQuestions: userTurns.length,
      firstUserPrompt: userTurns[0]?.content || '',
      lastUserPrompt: userTurns.length > 0 ? userTurns[userTurns.length - 1]?.content : '',
      previousUserPrompt: userTurns.length > 1 ? userTurns[userTurns.length - 2]?.content : '',
      allUserPrompts: userTurns.map((t, idx) => ({
        order: idx + 1,
        content: t.content,
        timestamp: t.timestamp || ''
      })),
      fullChronology: []
    };

    if (turns.length === 0) return memory;

    // Build structured chronological exchanges
    const chronology = [];
    for (let i = 0; i < turns.length; i++) {
      const t = turns[i];
      if (t.role === 'user') {
        const nextTurn = turns[i + 1];
        const asstResp = (nextTurn && nextTurn.role === 'assistant') ? nextTurn.content : '';
        chronology.push({
          turn: chronology.length + 1,
          userPrompt: t.content,
          assistantSummary: asstResp ? (asstResp.slice(0, 160).replace(/\n/g, ' ') + (asstResp.length > 160 ? '...' : '')) : 'In progress'
        });
      }
    }
    memory.fullChronology = chronology;

    // Scan user turns for explicit identity statements ("my name is...", "call me...")
    for (const turn of turns) {
      if (turn.role === 'user') {
        const nameMatch = turn.content.match(/(?:my name is|call me|i am|this is)\s+([A-Z][a-zA-Z0-9_]{1,20})/i);
        if (nameMatch && !['who', 'what', 'here', 'ready', 'back', 'just', 'building'].includes(nameMatch[1].toLowerCase())) {
          memory.userName = nameMatch[1];
        }

        // Detect coding language or framework
        const langMatch = turn.content.match(/\b(python|javascript|typescript|react|next\.?js|tailwind|rust|c\+\+|golang|html|css|sql|node\.?js|docker)\b/i);
        if (langMatch) {
          memory.codeLanguage = langMatch[1];
        }

        // Detect project / app name
        const projectMatch = turn.content.match(/(?:building|making|creating|working on)\s+(?:an?\s+)?(?:app|project|website|tool|platform|system)\s+(?:called|named)?\s*([A-Za-z0-9_-]{2,25})/i);
        if (projectMatch && !memory.keyEntities.includes(projectMatch[1])) {
          memory.keyEntities.push(projectMatch[1]);
        }
      }
    }

    // Determine active topic from the most recent 2 user queries
    if (userTurns.length > 0) {
      const lastUser = userTurns[userTurns.length - 1].content;
      memory.activeTopic = lastUser.slice(0, 80).replace(/[?!.]+$/, '');
    }

    // Build brief synopsis of recent turns (up to 6)
    const recent = turns.slice(-6);
    memory.recentTurnsSummary = recent.map(t => `${t.role === 'user' ? 'User' : 'Assistant'}: "${t.content.slice(0, 120).replace(/\n/g, ' ')}..."`);

    return memory;
  },

  /**
   * Builds an explicit memory directive to inject into system prompt for cloud LLMs
   */
  buildMemoryDirective(messages = [], userName = '') {
    const memory = this.extractSessionMemory(messages, userName);
    if (memory.turnCount <= 1 && memory.totalUserQuestions <= 1) {
      return `\n\n[CONVERSATION CONTINUITY]: User name is ${memory.userName}. Remember everything the user states in this session and maintain perfect continuity.`;
    }

    let directive = `\n\n[COMPREHENSIVE SESSION MEMORY & CONVERSATIONAL CONTINUITY MANIFEST]:`;
    directive += `\n- User Name: ${memory.userName}`;
    directive += `\n- Total Dialogue Turns: ${memory.turnCount}`;
    directive += `\n- Total User Inquiries: ${memory.totalUserQuestions}`;
    if (memory.firstUserPrompt) {
      directive += `\n- INCEPTION / FIRST QUESTION (At the very beginning): "${memory.firstUserPrompt}"`;
    }
    if (memory.previousUserPrompt) {
      directive += `\n- PREVIOUS QUESTION (Right before current): "${memory.previousUserPrompt}"`;
    }
    if (memory.activeTopic) {
      directive += `\n- Current Conversation Subject: "${memory.activeTopic}"`;
    }
    if (memory.codeLanguage) {
      directive += `\n- Active Code Stack: ${memory.codeLanguage}`;
    }
    if (memory.keyEntities.length > 0) {
      directive += `\n- Key Entities & Projects Mentioned: ${memory.keyEntities.join(', ')}`;
    }
    if (memory.allUserPrompts.length > 0) {
      directive += `\n- CHRONOLOGICAL LOG OF ALL USER QUESTIONS FROM BEGINNING TO NOW:`;
      memory.allUserPrompts.forEach(p => {
        directive += `\n   [Turn ${p.order}]: "${p.content.slice(0, 140).replace(/\n/g, ' ')}"`;
      });
    }
    directive += `\n- STRICT CONTINUITY & RECALL PROTOCOL:`;
    directive += `\n  1. You have complete recall of this entire session from the very first question at the beginning.`;
    directive += `\n  2. If the user asks what they asked earlier, at the beginning, before, or requests a recap, cite the exact questions and details from the chronological log above with 100% precision.`;
    directive += `\n  3. Resolve all pronouns ("it", "that", "the previous code", "the last point") and conversational acknowledgments ("nice", "cool", "great", "ok") seamlessly without losing context or starting an unrelated topic.`;

    return directive;
  },

  /**
   * Formats messages for standard chat completion APIs (OpenAI, OpenRouter, Groq, DeepSeek)
   * - Retains a generous sliding window of history turns (default 80 turns)
   * - Guarantees non-empty text content
   * - Filters out transient errors
   */
  formatMessagesForApi(messages = [], maxTurns = 80) {
    const valid = this.getValidTurns(messages);
    const windowed = valid.slice(-maxTurns);

    return windowed.map(turn => ({
      role: turn.role,
      content: turn.content
    }));
  },

  /**
   * Formats and STRICTLY NORMALIZES history turns for Google Gemini API
   * 
   * Gemini API Rules:
   * 1. Must alternate strictly: user -> model -> user -> model
   * 2. First turn MUST be 'user'
   * 3. Last turn MUST be 'user' (containing the current prompt)
   * 4. Consecutive messages with the same role MUST be merged into one
   * 5. No empty parts allowed
   */
  formatGeminiContents(historyTurns = [], currentPrompt = '', files = []) {
    const rawItems = [];

    // 1. Process prior history turns
    if (Array.isArray(historyTurns)) {
      for (const turn of historyTurns) {
        if (!turn) continue;
        const role = turn.role === 'assistant' || turn.role === 'model' ? 'model' : 'user';
        const text = this.cleanMessageText(turn.content);
        if (text) {
          rawItems.push({ role, text });
        }
      }
    }

    // 2. Add current prompt
    if (currentPrompt && currentPrompt.trim()) {
      rawItems.push({ role: 'user', text: currentPrompt.trim() });
    }

    if (rawItems.length === 0) {
      return [{ role: 'user', parts: [{ text: currentPrompt || 'Hello' }] }];
    }

    // 3. Normalization pass: Merge consecutive roles and ensure alternating structure
    const normalized = [];

    for (const item of rawItems) {
      if (normalized.length === 0) {
        // First turn in Gemini must be user
        if (item.role === 'user') {
          normalized.push({
            role: 'user',
            parts: [{ text: item.text }]
          });
        } else {
          // If first message in history was model, synthesize a neutral user query before it
          normalized.push({
            role: 'user',
            parts: [{ text: 'Hello' }]
          });
          normalized.push({
            role: 'model',
            parts: [{ text: item.text }]
          });
        }
      } else {
        const lastTurn = normalized[normalized.length - 1];
        if (lastTurn.role === item.role) {
          // Merge consecutive identical roles with double newline
          const existingText = lastTurn.parts[0]?.text || '';
          lastTurn.parts[0] = { text: `${existingText}\n\n${item.text}` };
        } else {
          normalized.push({
            role: item.role,
            parts: [{ text: item.text }]
          });
        }
      }
    }

    // 4. Ensure the last turn is role: 'user'
    if (normalized.length > 0 && normalized[normalized.length - 1].role === 'model') {
      normalized.push({
        role: 'user',
        parts: [{ text: currentPrompt.trim() || 'Please continue.' }]
      });
    }

    return normalized;
  },

  /**
   * Checks if user prompt is asking a direct memory recall question:
   * e.g. "what was my last question?", "what did you say earlier?", "what did i ask at the beginning?",
   * "what did i ask before?", "list all my questions", "what is my name?",
   * "summarize our chat", "recap our conversation"
   */
  resolveMemoryQuery(prompt, messages = [], defaultUserName = '') {
    if (!prompt) return null;
    const p = prompt.trim().toLowerCase();
    const turns = this.getValidTurns(messages);

    // Filter to turns preceding the current prompt
    const priorTurns = turns.filter(t => t.content.trim().toLowerCase() !== p);
    if (priorTurns.length === 0) return null;

    const priorUserTurns = priorTurns.filter(t => t.role === 'user');
    const priorAssistantTurns = priorTurns.filter(t => t.role === 'assistant');

    // 1. INCEPTION / FIRST QUESTION: "What did I ask at the beginning?" / "What was my first question?"
    if (/\b(what\s+(?:was|is)\s+my\s+(?:first|initial)\s+(?:question|message|prompt)|what\s+did\s+i\s+(?:first\s+)?(?:ask|say|start\s+with)\s+(?:at\s+the\s+beginning|at\s+first|in\s+the\s+beginning|from\s+the\s+start|initially|first)|how\s+did\s+(?:we|our\s+chat|our\s+conversation)\s+start|what\s+was\s+the\s+(?:first|initial)\s+topic|what\s+did\s+i\s+ask\s+(?:at\s+the\s+beginning|initially|first)|at\s+the\s+beginning\s+(?:what\s+did\s+i\s+ask|what\s+was\s+my\s+question))\b/i.test(p)) {
      if (priorUserTurns.length === 0) {
        return "You haven't asked any prior questions in this session yet!";
      }
      const first = priorUserTurns[0];
      return `At the very beginning of our conversation, your first question was:\n\n> **"${first.content}"**\n\nI have the full context of our entire conversation preserved in active memory. Would you like to revisit that topic or continue with what we're working on?`;
    }

    // 2. LIST ALL QUESTIONS: "List all questions I've asked", "What are all the questions I asked"
    if (/\b((list|show|what\s+are)\s+(all\s+)?(the\s+)?(questions|messages|prompts)\s+(i('ve|\s+have)?\s+asked|in\s+this\s+chat|so\s+far)|what\s+have\s+i\s+asked\s+(so\s+far|in\s+this\s+conversation|all\s+together)|all\s+questions\s+asked)\b/i.test(p)) {
      if (priorUserTurns.length === 0) {
        return "You haven't asked any questions in this conversation yet!";
      }
      let listResp = `### 📋 All Inquiries in This Conversation (${priorUserTurns.length} Questions):\n\n`;
      priorUserTurns.forEach((u, i) => {
        listResp += `${i + 1}. **"${u.content.replace(/\n/g, ' ')}"**\n`;
      });
      listResp += `\n*All prior context and answers are securely held in active memory.*`;
      return listResp;
    }

    // 3. ORDINAL QUESTION: "What was my second / third / 2nd question?"
    const ordMatch = p.match(/\bwhat\s+(?:was|is)\s+(?:my\s+)?(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|\d+(?:st|nd|rd|th)?)\s+(?:question|message|prompt)\b/i);
    if (ordMatch && ordMatch[1]) {
      const ordMap = {
        first: 1, '1st': 1,
        second: 2, '2nd': 2,
        third: 3, '3rd': 3,
        fourth: 4, '4th': 4,
        fifth: 5, '5th': 5,
        sixth: 6, '6th': 6,
        seventh: 7, '7th': 7,
        eighth: 8, '8th': 8,
        ninth: 9, '9th': 9,
        tenth: 10, '10th': 10
      };
      const rawOrd = ordMatch[1].toLowerCase();
      const targetIdx = ordMap[rawOrd] || parseInt(rawOrd, 10);
      if (targetIdx && targetIdx > 0) {
        if (targetIdx <= priorUserTurns.length) {
          const targetTurn = priorUserTurns[targetIdx - 1];
          return `Your ${ordMatch[1]} question in this session was:\n\n> **"${targetTurn.content}"**\n\nWould you like me to revisit or expand upon that?`;
        } else {
          return `You have only asked **${priorUserTurns.length} question${priorUserTurns.length === 1 ? '' : 's'}** so far in this session!`;
        }
      }
    }

    // 4. PREVIOUS / PRIOR QUESTION: "What did I ask before?" / "What was my last question?" / "What did I ask earlier?"
    if (/\b(what\s+(was|is)\s+my\s+(last|previous)\s+(question|message|prompt)|what\s+did\s+i\s+(just\s+)?(ask|say|write)\s*(before|prior|earlier|last)?|what\s+did\s+i\s+ask\s+before(\s+this|\s+it)?|what\s+did\s+i\s+ask\s+earlier|what\s+was\s+asked\s+before|repeat\s+my\s+question)\b/i.test(p)) {
      if (priorUserTurns.length === 0) {
        return "You haven't asked any prior questions in this session yet!";
      }
      const last = priorUserTurns[priorUserTurns.length - 1];
      return `Right before this, you asked:\n\n> **"${last.content}"**\n\nWould you like me to elaborate further on that, provide additional examples, or explore a new question?`;
    }

    // 5. ASSISTANT'S PREVIOUS RESPONSE: "What did you just say?" / "What was your last response?"
    if (/\b(what\s+did\s+you\s+(just\s+)?(say|reply|answer)|what\s+was\s+your\s+(last|previous)\s+(response|answer|output)|repeat\s+what\s+you\s+said)\b/i.test(p)) {
      if (priorAssistantTurns.length === 0) {
        return "I haven't provided a previous response in this conversation yet!";
      }
      const last = priorAssistantTurns[priorAssistantTurns.length - 1];
      const preview = last.content.length > 500 ? last.content.slice(0, 500) + '...' : last.content;
      return `In my previous response, I stated:\n\n${preview}\n\nWould you like me to explain any specific part in deeper detail?`;
    }

    // 6. IDENTITY & NAME RECALL: "What is my name?" / "Do you remember my name?"
    if (/\b(what\s+is\s+my\s+name|do\s+you\s+(remember|know)\s+my\s+name|who\s+am\s+i)\b/i.test(p)) {
      const memory = this.extractSessionMemory(priorTurns, defaultUserName);
      if (memory.userName && memory.userName !== 'Friend') {
        return `Your name is **${memory.userName}**! 😊 I have it stored in active conversation memory. How can I assist you right now?`;
      }
      return `I don't have your name recorded yet! You can tell me your name anytime (e.g. *"My name is Abhinav"*), and I will remember it throughout our conversation.`;
    }

    // 7. SUMMARY & RECAP: "Summarize our conversation" / "Recap our chat"
    if (/\b(summarize\s+(our\s+)?(chat|conversation|discussion)|recap\s+(our\s+)?(chat|conversation|discussion)|what\s+have\s+we\s+talked\s+about|what\s+did\s+we\s+discuss)\b/i.test(p)) {
      if (priorTurns.length <= 1) {
        return "We just started our conversation! Feel free to ask a question, share code, or explore a topic.";
      }

      let recap = `### 📋 Conversation Summary & Key Points\n\n`;
      recap += `Here is a recap of what we've covered across **${priorTurns.length} dialogue turns**:\n\n`;

      const bulletPoints = [];
      for (let i = 0; i < priorTurns.length; i += 2) {
        const userT = priorTurns[i];
        const asstT = priorTurns[i + 1];
        if (userT && userT.role === 'user') {
          const userSummary = userT.content.slice(0, 80).replace(/\n/g, ' ');
          let asstSummary = asstT ? asstT.content.slice(0, 100).replace(/\n/g, ' ') : 'Addressed';
          bulletPoints.push(`- **User**: *"${userSummary}..."*\n  **Takeaway**: ${asstSummary}...`);
        }
      }

      recap += bulletPoints.slice(-6).join('\n\n');
      recap += `\n\n---\n\n*All context is maintained in active working memory. What would you like to build or discuss next?*`;
      return recap;
    }

    return null;
  },

  /**
   * Resolves contextual follow-up pronouns, acknowledgments, and continuity:
   * e.g. "nice", "cool", "great", "ok", "explain it in detail", "give me 5 more examples", "write unit tests for this", "why?"
   */
  resolveFollowupContext(prompt, messages = []) {
    if (!prompt) return { isFollowup: false };
    const p = prompt.trim().toLowerCase();
    const turns = this.getValidTurns(messages);

    if (turns.length === 0) return { isFollowup: false };

    // Find the last assistant response and last user query preceding this prompt
    const priorTurns = turns.filter(t => t.content.trim().toLowerCase() !== p);
    const assistantTurns = priorTurns.filter(t => t.role === 'assistant');
    const userTurns = priorTurns.filter(t => t.role === 'user');

    const lastAssistant = assistantTurns.length > 0 ? assistantTurns[assistantTurns.length - 1] : null;
    const lastUser = userTurns.length > 0 ? userTurns[userTurns.length - 1] : null;

    if (!lastAssistant) return { isFollowup: false };

    // Follow-up triggers
    const isAcknowledgment = /^(nice|cool|great|awesome|good|superb|excellent|amazing|ok|okay|k|alright|fine|perfect|got\s+it|understood|i\s+see|makes\s+sense|yes|yep|yeah|sure|wow|sweet|neat|right|sounds\s+good|very\s+nice|so\s+good|good\s+one)[!.]*$/i.test(p);
    const isPronounFollowup = /\b(it|that|this|the above|the code|the previous|the latter|the former)\b/i.test(p);
    const isElaborationFollowup = /\b(explain\s+more|elaborate|tell\s+me\s+more|give\s+me\s+more|more\s+examples|expand\s+on\s+that|why\s+is\s+that|why\?|how\s+does\s+that\s+work)\b/i.test(p);
    const isCodeFollowup = /\b(test\s+cases?|unit\s+tests?|optimize\s+it|refactor\s+it|debug\s+it|add\s+types?|typescript\s+version|convert\s+to\s+python)\b/i.test(p);
    const isTranslationFollowup = /\b(translate\s+(it|this|that)?\s*(to|into)?\s*(hindi|spanish|french|german|japanese))\b/i.test(p);

    if (!isAcknowledgment && !isPronounFollowup && !isElaborationFollowup && !isCodeFollowup && !isTranslationFollowup) {
      return { isFollowup: false };
    }

    // Extract target topic from previous assistant message
    const lines = lastAssistant.content.split('\n').map(l => l.trim()).filter(Boolean);
    let targetSubject = '';

    // Check for markdown headers (# Title)
    for (const line of lines) {
      if (line.startsWith('#') || line.startsWith('**')) {
        targetSubject = line.replace(/^[#* \-_]+/, '').replace(/[*_:]+$/, '').trim();
        if (targetSubject.length > 3 && targetSubject.length < 80) break;
      }
    }

    if (!targetSubject && lastUser) {
      targetSubject = lastUser.content.slice(0, 60).replace(/[?!.]+$/, '');
    }

    return {
      isFollowup: true,
      isAcknowledgment,
      targetSubject: targetSubject || 'the previously discussed topic',
      lastAssistantText: lastAssistant.content,
      lastUserPrompt: lastUser?.content || '',
      isCodeFollowup,
      isTranslationFollowup
    };
  }
};
