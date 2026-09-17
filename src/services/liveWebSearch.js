/**
 * Girionix AI — Live Real-Time Web Search & Grounding Service
 * Provides instant live web search results directly in the browser
 * using high-availability, open CORS endpoints (DuckDuckGo, Wikipedia, Algolia HN).
 * Zero API keys required; 100% reliable.
 */

function getTimeoutSignal(ms = 3500) {
  try {
    if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
      return AbortSignal.timeout(ms);
    }
  } catch (_) {}
  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), ms);
  return ctrl.signal;
}

export const liveWebSearch = {
  /**
   * Identifies conversational chit-chat, personal queries, greetings, and basic math
   * that should NEVER trigger encyclopedic web searches (e.g. searching 'hello' finding Hello Kitty).
   */
  isConversationalOrNonSearchQuery(prompt) {
    if (!prompt) return true;
    const clean = prompt.trim().toLowerCase();
    // 1. Common greetings
    if (/^(hi|hello|hey|namaste|greetings|good\s+(morning|afternoon|evening|night)|yo|sup|hola)\b/i.test(clean)) return true;
    // 2. Personal & wellbeing questions
    if (/^(how\s+are\s+(you|u|ya)|how\s+r\s+u|how's\s+it\s+going|how\s+do\s+you\s+do|what's\s+up|wassup|how\s+have\s+you\s+been)\b/i.test(clean)) return true;
    // 3. Identity questions
    if (/^(who\s+are\s+you|what\s+is\s+your\s+name|who\s+created\s+you|who\s+made\s+you|what\s+can\s+you\s+do|introduce\s+yourself)\b/i.test(clean)) return true;
    // 4. Politeness, affirmations & farewells
    if (/^(thank\s+you|thanks|thank\s+u|bye|goodbye|see\s+you|see\s+ya|ok|okay|cool|great|awesome|yes|no)\b/i.test(clean)) return true;
    // 5. Jokes & humor
    if (/^(tell\s+me\s+a\s+joke|make\s+me\s+laugh|say\s+something\s+funny|crack\s+a\s+joke)\b/i.test(clean)) return true;
    // 6. Simple arithmetic/math expressions
    if (/^[\d\s\+\-\*\/\^\(\)\.=]+$/.test(clean) && clean.length < 30) return true;
    return false;
  },

  /**
   * Cleans a user prompt into crisp search keywords
   */
  extractSearchKeywords(prompt) {
    if (!prompt) return '';
    return prompt
      .replace(/^(who is|who was|what is|what are|what was|where is|when was|how does|why is|tell me about|explain|search for|search|look up|find|give me information about|latest news on|current status of)/i, '')
      .replace(/[?!.,;:"'()[\]{}]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 100);
  },

  /**
   * Search DuckDuckGo Instant Answer API for direct factual encyclopedic definitions
   */
  async searchDuckDuckGo(query) {
    try {
      const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
      const res = await fetch(url, { signal: getTimeoutSignal(3500) });
      if (!res.ok) return [];
      const data = await res.json();
      const results = [];

      if (data.AbstractText && data.AbstractText.trim()) {
        results.push({
          title: data.Heading || query,
          url: data.AbstractURL || 'https://duckduckgo.com/?q=' + encodeURIComponent(query),
          snippet: data.AbstractText.trim(),
          source: data.AbstractSource || 'DuckDuckGo Knowledge Graph',
          isDirectAnswer: true
        });
      }

      if (Array.isArray(data.RelatedTopics)) {
        for (const topic of data.RelatedTopics.slice(0, 2)) {
          if (topic.Text && topic.FirstURL) {
            results.push({
              title: topic.Text.split(' - ')[0] || query,
              url: topic.FirstURL,
              snippet: topic.Text,
              source: 'DuckDuckGo Direct Facts'
            });
          }
        }
      }

      return results;
    } catch (_) {
      return [];
    }
  },

  /**
   * Search Wikipedia for real-time encyclopedia articles and summaries
   */
  async searchWikipedia(query) {
    try {
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*`;
      const res = await fetch(searchUrl, { signal: getTimeoutSignal(3500) });
      if (!res.ok) return [];
      const data = await res.json();
      const hits = data?.query?.search || [];
      if (!hits.length) return [];

      const topHits = hits.slice(0, 3);
      const results = [];

      for (const item of topHits) {
        const cleanSnippet = (item.snippet || '')
          .replace(/<span class="searchmatch">/g, '**')
          .replace(/<\/span>/g, '**')
          .replace(/<[^>]+>/g, '')
          .trim();

        results.push({
          title: item.title,
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/\s+/g, '_'))}`,
          snippet: cleanSnippet,
          source: 'Wikipedia Encyclopedia',
          timestamp: item.timestamp
        });
      }
      return results;
    } catch (_) {
      return [];
    }
  },

  /**
   * Search Algolia Hacker News for live technical/computing/AI discussions
   */
  async searchTechNews(query) {
    try {
      const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=3`;
      const res = await fetch(url, { signal: getTimeoutSignal(3500) });
      if (!res.ok) return [];
      const data = await res.json();
      const hits = data?.hits || [];
      return hits.slice(0, 2).map(h => ({
        title: h.title,
        url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
        snippet: `Points: ${h.points || 0} | Comments: ${h.num_comments || 0} | Author: ${h.author}`,
        source: 'Live Tech & Discussions',
        timestamp: h.created_at
      }));
    } catch (_) {
      return [];
    }
  },

  /**
   * Primary unified search executor
   */
  async performSearch(query) {
    const rawQuery = (query || '').trim();
    if (!rawQuery || this.isConversationalOrNonSearchQuery(rawQuery)) {
      return null;
    }

    const keywords = this.extractSearchKeywords(rawQuery) || rawQuery;
    if (!keywords || keywords.length < 2) return null;

    try {
      const [ddgResults, wikiResults, techResults] = await Promise.allSettled([
        this.searchDuckDuckGo(keywords),
        this.searchWikipedia(keywords),
        this.searchTechNews(keywords)
      ]);

      const validDdg = ddgResults.status === 'fulfilled' ? ddgResults.value : [];
      const validWiki = wikiResults.status === 'fulfilled' ? wikiResults.value : [];
      const validTech = techResults.status === 'fulfilled' ? techResults.value : [];

      const combined = [...validDdg, ...validWiki, ...validTech].slice(0, 4);

      if (combined.length === 0) {
        return null;
      }

      // Extract direct factual summary text
      const directHit = combined.find(c => c.snippet && c.snippet.length > 30);
      const factualSummary = directHit ? directHit.snippet : combined[0]?.snippet || '';

      return {
        query: keywords,
        factualSummary,
        results: combined,
        formattedSourcesMarkdown: combined.map((r, i) => 
          `[${i + 1}] **[${r.title}](${r.url})** — *${r.source}*\n> ${r.snippet}`
        ).join('\n\n')
      };
    } catch (_) {
      return null;
    }
  }
};


