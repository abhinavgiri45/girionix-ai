/**
 * Girionix AI — Live Real-Time Web Search & Grounding Service
 * Provides instant live web search results directly in the browser
 * using high-availability, open CORS endpoints (Wikipedia, Algolia HN).
 * Zero API keys required; 100% reliable.
 */

export const liveWebSearch = {
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
   * Search Wikipedia for real-time encyclopedia articles and summaries
   */
  async searchWikipedia(query) {
    try {
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*`;
      const res = await fetch(searchUrl, { signal: AbortSignal.timeout(3500) });
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
      const res = await fetch(url, { signal: AbortSignal.timeout(3500) });
      if (!res.ok) return [];
      const data = await res.json();
      const hits = data?.hits || [];
      return hits.slice(0, 3).map(h => ({
        title: h.title,
        url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
        snippet: `Points: ${h.points || 0} | Comments: ${h.num_comments || 0} | Author: ${h.author}`,
        source: 'Live Tech & News',
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
    const keywords = this.extractSearchKeywords(query);
    if (!keywords) return null;

    try {
      const [wikiResults, techResults] = await Promise.allSettled([
        this.searchWikipedia(keywords),
        this.searchTechNews(keywords)
      ]);

      const validWiki = wikiResults.status === 'fulfilled' ? wikiResults.value : [];
      const validTech = techResults.status === 'fulfilled' ? techResults.value : [];

      const combined = [...validWiki, ...validTech].slice(0, 4);

      if (combined.length === 0) {
        return null;
      }

      return {
        query: keywords,
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

