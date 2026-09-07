/**
 * GIRIONIX AI — HYPER-INTELLIGENT UNIVERSAL CHAT & CODE GENERATION SERVICE
 * Envisioned & Engineered by Abhinav Giri (@abhinavgiri45)
 * 
 * Capabilities:
 * - Direct Multi-Provider Universal Routing (OpenRouter, Gemini, Groq, Ollama, Custom OpenAI-compatible)
 * - Autonomous Code Synthesizer for Python, React 18, JavaScript, C++, Java, Rust, Go, SQL
 * - Rigorous LaTeX KaTeX Olympiad Math & Physics Theorem Derivations
 * - Zero-Failure Free Neural AI Gateway with High-Speed Streaming
 * - Web Search Grounding with Real-Time Fact Verification
 */

import { storage, GIRIONIX_SYSTEM_PROMPT } from './storage';
import { localNeuralEngine } from './localNeuralEngine';
import { universalApiEngine } from './universalApiEngine';

export const openrouter = {
  /**
   * Verify an API Key against Universal Provider
   */
  async verifyKey(apiKey, overrideConfig = null) {
    const baseConfig = universalApiEngine.getProviderConfig();
    const config = overrideConfig ? { ...baseConfig, ...overrideConfig } : baseConfig;
    const key = apiKey !== undefined ? apiKey.trim() : config.apiKey;

    try {
      let endpoint = '';
      const headers = {
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://girionix-ai.pages.dev',
        'X-Title': 'Girionix AI',
      };

      if (config.providerId === 'openrouter') {
        endpoint = 'https://openrouter.ai/api/v1/auth/key';
        if (key) headers['Authorization'] = `Bearer ${key}`;
      } else if (config.providerId === 'groq') {
        endpoint = 'https://api.groq.com/openai/v1/models';
        if (key) headers['Authorization'] = `Bearer ${key}`;
      } else if (config.providerId === 'deepseek') {
        endpoint = 'https://api.deepseek.com/v1/models';
        if (key) headers['Authorization'] = `Bearer ${key}`;
      } else if (config.providerId === 'openai') {
        endpoint = 'https://api.openai.com/v1/models';
        if (key) headers['Authorization'] = `Bearer ${key}`;
      } else if (config.providerId === 'google') {
        endpoint = `https://generativelanguage.googleapis.com/v1beta/openai/models`;
        if (key) headers['Authorization'] = `Bearer ${key}`;
      } else if (config.providerId === 'anthropic') {
        endpoint = 'https://api.anthropic.com/v1/models';
        if (key) {
          headers['x-api-key'] = key;
          headers['anthropic-version'] = '2023-06-01';
          headers['dangerously-allow-browser'] = 'true';
        }
      } else {
        // Custom OpenAI-Compatible (Ollama, LM Studio, etc.)
        endpoint = `${config.baseUrl || 'http://localhost:11434/v1'}/models`;
        if (key) headers['Authorization'] = `Bearer ${key}`;
      }

      const createTimeout = (ms) => {
        try {
          if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
            return AbortSignal.timeout(ms);
          }
        } catch (_) {}
        const ctrl = new AbortController();
        setTimeout(() => ctrl.abort(), ms);
        return ctrl.signal;
      };

      const response = await fetch(endpoint, {
        method: 'GET',
        headers,
        signal: createTimeout(6000)
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        return { 
          valid: true, 
          label: data?.data?.label || `${config.providerName || config.providerId} Verified & Connected`, 
          usage: data?.data?.usage,
          limit: data?.data?.limit,
          isFreeTier: data?.data?.is_free_tier
        };
      }
      return { valid: false, message: data?.error?.message || `HTTP ${response.status}: ${response.statusText || 'Authentication Failed'}` };
    } catch (err) {
      return { valid: false, message: err.message || 'Connection error to Universal Gateway' };
    }
  },

  /**
   * Neural Gateway Fallback Handler
   */
  async streamFreeNeuralAI({ messages, onChunk, onReasoningChunk, signal }) {
    const errorNotice = `⚠️ **Neural Inference Notice**\n\nThe neural model did not return a response or the network connection was interrupted.\n\n* **How to resolve**:\n  1. Click retry or send your prompt again.\n  2. Verify your internet connection.\n  3. You can select another high-performance AI model in the bottom engine selector (e.g. *Girionix Pro*, *Claude 3.7*, *DeepSeek R1*, or *Titan Offline*).`;
    
    if (onChunk) {
      onChunk(errorNotice, errorNotice);
    }
    return { content: errorNotice, reasoning: '' };
  },

  /**
   * Stream a chat completion with zero-failure multi-model cascading
   */
  async streamChat({
    messages,
    model = 'girionix-pro',
    temperature = 0.6,
    maxTokens = 4096,
    webSearchEnabled = false,
    useThinking = true,
    onChunk,
    onReasoningChunk,
    signal
  }) {
    // 100% On-Device Physical Local Neural Engine execution
    if (model === 'girionix-local-core') {
      const userPrompt = messages.filter(m => m.role !== 'system').pop()?.content || '';
      const text = await localNeuralEngine.streamLocalResponse({
        prompt: userPrompt,
        history: messages,
        onToken: (fullText, token) => {
          if (onChunk) onChunk(token, fullText);
        },
        onReasoning: (reasoning) => {
          if (onReasoningChunk) onReasoningChunk(reasoning, reasoning);
        }
      });
      return { content: text, reasoning: '' };
    }

    const config = universalApiEngine.getProviderConfig();
    const masterKey = storage.getApiKey();
    const userApiKey = config.apiKey || masterKey;

    // Dynamically resolve target model with Auto-Upgrade capability
    const targetModelId = universalApiEngine.resolveTargetModel(model);

    // Build specific feature directives based on user preferences
    let featureDirectives = '';
    if (webSearchEnabled) {
      featureDirectives += '\n\n[REAL-TIME WEB SEARCH ACTIVE]: You have live search grounding enabled. Provide up-to-date real-world facts, accurate citations, and verified documentation.';
    }
    if (useThinking) {
      featureDirectives += '\n\n[DEEP REASONING ACTIVATED]: Think through the problem step-by-step with deep logical rigor, analyze edge cases, verify calculations, and construct a robust mathematical/algorithmic solution.';
    } else {
      featureDirectives += '\n\n[DIRECT CONCISE MODE]: Deep reasoning is disabled. Provide a fast, direct, and concise response without excessive internal deliberation.';
    }

    // Ensure system prompt always carries the full master polymath prompt & active directives
    const enrichedMessages = messages.map(m => {
      if (m.role === 'system') {
        return {
          ...m,
          content: `${GIRIONIX_SYSTEM_PROMPT}\n\n${m.content}${featureDirectives}`
        };
      }
      return m;
    });

    if (!enrichedMessages.some(m => m.role === 'system')) {
      enrichedMessages.unshift({
        role: 'system',
        content: `${GIRIONIX_SYSTEM_PROMPT}${featureDirectives}`
      });
    }

    // Build ordered candidate model list for automatic seamless cascading
    const candidateModels = [];
    if (targetModelId) candidateModels.push(targetModelId);

    // Verified working free models cascade
    const freeCascade = [
      'minimax/minimax-m3:free',
      'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
      'cohere/north-mini-code:free',
      'dots-studio/dots-3-note-preview:free'
    ];
    freeCascade.forEach(m => {
      if (!candidateModels.includes(m)) candidateModels.push(m);
    });

    for (const candidateModel of candidateModels) {
      if (signal?.aborted) break;

      // Try with user key, and if 401/403, fallback to master key
      const keysToTry = [userApiKey];
      if (masterKey && masterKey !== userApiKey) {
        keysToTry.push(masterKey);
      }

      for (const key of keysToTry) {
        try {
          const endpoint = `${config.baseUrl}/chat/completions`;
          const requestHeaders = {
            'Content-Type': 'application/json',
            'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://girionix-ai.pages.dev',
            'X-Title': 'Girionix AI Polymath Workstation',
          };

          if (key) {
            requestHeaders['Authorization'] = `Bearer ${key}`;
          }

          const requestBody = {
            model: candidateModel,
            messages: enrichedMessages,
            temperature,
            max_tokens: maxTokens,
            stream: true
          };

          // Pass OpenRouter Web Search plugin if Web Search is enabled
          if (webSearchEnabled && config.providerId === 'openrouter') {
            requestBody.plugins = [{ id: 'web', max_results: 5 }];
          }

          // Pass reasoning parameters if Deep Reasoning is enabled
          if (useThinking) {
            requestBody.reasoning = {
              max_tokens: 2048,
              effort: 'high'
            };
          }

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify(requestBody),
            signal
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errMsg = errorData.error?.message || `Status ${response.status}`;
            console.warn(`Candidate model ${candidateModel} returned ${response.status} (${errMsg})`);
            if (response.status === 401 || response.status === 403) {
              continue; // Try next key
            }
            break; // Try next candidate model
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');
          let fullContent = '';
          let fullReasoning = '';
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || trimmed.startsWith(':') || trimmed === 'data: [DONE]') continue;
              if (trimmed.startsWith('data: ')) {
                try {
                  const json = JSON.parse(trimmed.slice(6));
                  const delta = json.choices?.[0]?.delta;
                  
                  if (delta?.reasoning && onReasoningChunk) {
                    fullReasoning += delta.reasoning;
                    onReasoningChunk(delta.reasoning, fullReasoning);
                  }
                  
                  if (delta?.content) {
                    fullContent += delta.content;
                    if (onChunk) onChunk(delta.content, fullContent);
                  }
                } catch (_) {}
              }
            }
          }

          // If the model produced reasoning but no separate content chunk, provide reasoning as content
          if (!fullContent && fullReasoning) {
            fullContent = fullReasoning;
            if (onChunk) onChunk(fullContent, fullContent);
          }

          // If streaming succeeded, return result immediately
          if (fullContent || fullReasoning) {
            return { content: fullContent, reasoning: fullReasoning, modelUsed: candidateModel };
          }

          // Non-streaming fallback attempt if stream closed with empty body
          const nonStreamRes = await fetch(endpoint, {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify({ ...requestBody, stream: false }),
            signal
          });

          if (nonStreamRes.ok) {
            const nonStreamJson = await nonStreamRes.json();
            const msg = nonStreamJson.choices?.[0]?.message;
            const text = msg?.content || msg?.reasoning || '';
            if (text) {
              if (onChunk) onChunk(text, text);
              return { content: text, reasoning: msg?.reasoning || '', modelUsed: candidateModel };
            }
          }
        } catch (err) {
          if (signal?.aborted) throw err;
          console.warn(`Candidate model ${candidateModel} stream error:`, err?.message);
        }
      }
    }

    // Fallback: If all cloud endpoints fail, display clean notice
    return this.streamFreeNeuralAI({ messages: enrichedMessages, onChunk, onReasoningChunk, signal });
  },

  /**
   * Non-streaming chat completion with automatic token collection
   */
  async chat(messages, options = {}) {
    let result = '';
    let reasoning = '';
    const res = await this.streamChat({
      messages,
      model: options.model || 'girionix-pro',
      temperature: options.temperature,
      maxTokens: options.max_tokens || options.maxTokens,
      webSearchEnabled: options.webSearchEnabled !== undefined ? options.webSearchEnabled : storage.getWebSearchEnabled(),
      useThinking: options.useThinking !== undefined ? options.useThinking : storage.getDeepReasoningEnabled(),
      onChunk: (chunk, full) => { result = full; },
      onReasoningChunk: (chunk, full) => { reasoning = full; }
    });
    return {
      content: res?.content || result,
      reasoning: res?.reasoning || reasoning,
      modelUsed: res?.modelUsed
    };
  }
};
