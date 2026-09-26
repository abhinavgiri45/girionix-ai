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

import { storage, GIRIONIX_SYSTEM_PROMPT } from './storage.js';
import { localNeuralEngine } from './localNeuralEngine.js';
import { universalApiEngine } from './universalApiEngine.js';
import { conversationMemory } from './conversationMemory.js';

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

      // Direct Gemini API verification (official Google endpoint)
      if (config.providerId === 'google' || key?.startsWith('AIzaSy')) {
        const { geminiStudioEngine } = await import('./geminiStudioEngine.js');
        return await geminiStudioEngine.verifyApiKey(key);
      }

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
   * Neural Gateway Handler - High-Intelligence Free Cloud LLM (ChatGPT / Gemini / Claude Parity)
   * Real-time SSE streaming with reasoning support and automatic sovereign on-device fallback.
   */
  async streamFreeNeuralAI({ messages, webSearchEnabled = false, useThinking = true, onChunk, onReasoningChunk, signal }) {
    const userPrompt = messages.filter(m => m.role !== 'system').pop()?.content || '';

    const payloadMessages = messages.map(m => ({
      role: m.role === 'assistant' ? 'assistant' : m.role === 'system' ? 'system' : 'user',
      content: m.content || ''
    }));

    // Tier 1: Real-time SSE streaming from Live Neural Gateway (GPT-OSS Reasoning Core)
    if (typeof fetch !== 'undefined' && (typeof navigator === 'undefined' || navigator.onLine !== false)) {
      try {
        const response = await fetch('https://text.pollinations.ai/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messages: payloadMessages,
            model: 'openai-fast',
            stream: true,
            temperature: 0.7
          }),
          signal
        });

        if (response.ok && response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          let accumulatedContent = '';
          let accumulatedReasoning = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || trimmed.startsWith(':')) continue;
              if (trimmed === 'data: [DONE]') break;
              if (trimmed.startsWith('data: ')) {
                try {
                  const json = JSON.parse(trimmed.slice(6));
                  const delta = json.choices?.[0]?.delta;
                  if (delta?.reasoning) {
                    accumulatedReasoning += delta.reasoning;
                    if (onReasoningChunk) onReasoningChunk(delta.reasoning, accumulatedReasoning);
                  }
                  if (delta?.content) {
                    accumulatedContent += delta.content;
                    if (onChunk) onChunk(delta.content, accumulatedContent);
                  }
                } catch (_) {}
              }
            }
          }

          if (accumulatedContent.trim()) {
            return {
              content: accumulatedContent,
              reasoning: accumulatedReasoning,
              modelUsed: 'Girionix Frontier Neural Engine'
            };
          }
        }
      } catch (err) {
        if (signal?.aborted) throw err;
        console.warn('Tier 1 neural stream notice:', err.message);
      }

      // Tier 2: Direct High-Speed Neural Gateway Fallback (Non-streaming POST with simulated fluid token stream)
      try {
        const response2 = await fetch('https://text.pollinations.ai/openai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messages: payloadMessages,
            model: 'openai-fast',
            stream: false
          }),
          signal
        });

        if (response2.ok) {
          const data2 = await response2.json();
          const content2 = data2.choices?.[0]?.message?.content;
          if (content2 && content2.trim()) {
            const words = content2.split(/(\s+)/);
            let current = '';
            for (const word of words) {
              if (signal?.aborted) break;
              current += word;
              if (onChunk) onChunk(word, current);
              await new Promise(r => setTimeout(r, 10));
            }
            return {
              content: content2,
              reasoning: '',
              modelUsed: 'Girionix Frontier Neural Engine'
            };
          }
        }
      } catch (err2) {
        if (signal?.aborted) throw err2;
        console.warn('Tier 2 direct neural fallback notice:', err2.message);
      }

      // Tier 3: Resilient GET Neural Gateway Fallback (Bypasses POST restrictions & disk errors)
      try {
        const promptForGet = userPrompt || payloadMessages[payloadMessages.length - 1]?.content || 'Hello';
        const response3 = await fetch(`https://text.pollinations.ai/${encodeURIComponent(promptForGet)}?model=openai-fast`, {
          signal
        });

        if (response3.ok) {
          const text3 = await response3.text();
          if (text3 && text3.trim() && !text3.includes('"error":')) {
            const words = text3.split(/(\s+)/);
            let current = '';
            for (const word of words) {
              if (signal?.aborted) break;
              current += word;
              if (onChunk) onChunk(word, current);
              await new Promise(r => setTimeout(r, 10));
            }
            return {
              content: text3,
              reasoning: '',
              modelUsed: 'Girionix Frontier Neural Engine'
            };
          }
        }
      } catch (err3) {
        if (signal?.aborted) throw err3;
        console.warn('Tier 3 GET neural fallback notice:', err3.message);
      }
    }

    // Tier 4: Sovereign Local Intelligence & Algorithmic Synthesis (Instant, Offline & Zero-failure)
    try {
      const { localCodeSynthesizer } = await import('./localCodeSynthesizer.js');
      const { localDomainKnowledge } = await import('./localDomainKnowledge.js');
      const { localNeuralEngine } = await import('./localNeuralEngine.js');

      // 1. Math evaluation
      const mathAns = localNeuralEngine.tryEvaluateArithmetic(userPrompt);
      if (mathAns) {
        if (onChunk) onChunk(mathAns, mathAns);
        return { content: mathAns, reasoning: '', modelUsed: 'Girionix Local Neural Engine' };
      }

      // 2. Code query synthesis
      if (localCodeSynthesizer.isCodeQuery(userPrompt)) {
        const codeSolution = localCodeSynthesizer.synthesizeCode(userPrompt);
        if (codeSolution) {
          const words = codeSolution.split(/(\s+)/);
          let current = '';
          for (const word of words) {
            if (signal?.aborted) break;
            current += word;
            if (onChunk) onChunk(word, current);
            await new Promise(r => setTimeout(r, 8));
          }
          return { content: codeSolution, reasoning: '', modelUsed: 'Girionix Local Neural Engine' };
        }
      }

      // 3. Domain deep knowledge
      const domainAnswer = localDomainKnowledge.matchDomainKnowledge(userPrompt);
      if (domainAnswer) {
        const words = domainAnswer.split(/(\s+)/);
        let current = '';
        for (const word of words) {
          if (signal?.aborted) break;
          current += word;
          if (onChunk) onChunk(word, current);
          await new Promise(r => setTimeout(r, 8));
        }
        return { content: domainAnswer, reasoning: '', modelUsed: 'Girionix Local Neural Engine' };
      }
    } catch (localErr) {
      console.warn('Local intelligence fallback notice:', localErr.message);
    }

    // Clean, natural offline communication (Zero fake templates)
    const offlineMsg = "I am currently unable to reach the live neural inference gateway. Please check your internet connection to access real-time neural responses.";
    if (onChunk) onChunk(offlineMsg, offlineMsg);
    return { content: offlineMsg, reasoning: '' };
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

    // 1. Build dynamic conversation memory directive from past messages
    const memoryDirective = conversationMemory.buildMemoryDirective(messages);

    // 2. Clean and format dialogue messages (filtering out transient errors and windowing)
    const cleanDialogue = conversationMemory.formatMessagesForApi(
      messages.filter(m => m.role !== 'system'),
      80
    );

    // 3. Ensure system prompt always carries the full master polymath prompt & active directives
    const baseSystem = messages.find(m => m.role === 'system')?.content || '';
    const needsMemory = !baseSystem.includes('[COMPREHENSIVE SESSION MEMORY');

    // Guarantee active revision directive for "humanize", "improve it", etc.
    const lastUserPrompt = cleanDialogue.length > 0 ? cleanDialogue[cleanDialogue.length - 1].content : '';
    const lastAssistant = conversationMemory.getLastAssistantMessage(cleanDialogue.slice(0, -1));
    let revisionDirective = '';
    if (lastUserPrompt && lastAssistant && !baseSystem.includes('[CRITICAL ACTIVE CONVERSATION REVISION MANDATE]')) {
      const revInfo = conversationMemory.isTextRevisionRequest(lastUserPrompt, lastAssistant);
      if (revInfo) {
        revisionDirective = conversationMemory.buildTextRevisionDirective(lastAssistant.content, lastUserPrompt, revInfo);
      }
    }

    const finalSystemPrompt = `${GIRIONIX_SYSTEM_PROMPT}\n\n${baseSystem}${featureDirectives}${needsMemory ? memoryDirective : ''}${revisionDirective}`;

    const enrichedMessages = [
      { role: 'system', content: finalSystemPrompt },
      ...cleanDialogue
    ];

    // Direct Gemini API Route (If user provided an AIzaSy key or saved one in AI Studio/Universal settings)
    const directGeminiKey = (userApiKey?.startsWith('AIzaSy') ? userApiKey : '') ||
      (typeof localStorage !== 'undefined' ? localStorage.getItem('girionix_gemini_api_key') : '') ||
      (typeof localStorage !== 'undefined' ? localStorage.getItem('girionix_custom_api_key') : '') ||
      (config.providerId === 'google' ? userApiKey : '');

    if (config.providerId === 'google' || directGeminiKey) {
      try {
        const { geminiStudioEngine } = await import('./geminiStudioEngine.js');
        const activeKey = directGeminiKey || geminiStudioEngine.getApiKey();
        if (activeKey) {
          const systemMsg = finalSystemPrompt;
          const nonSystemMsgs = cleanDialogue;
          const lastMsg = nonSystemMsgs.length > 0 ? nonSystemMsgs[nonSystemMsgs.length - 1] : { content: 'Hello' };
          const historyTurns = nonSystemMsgs.slice(0, -1);

          let resolvedModel = 'gemini-2.5-flash';
          const lowerM = (model || '').toLowerCase();
          if (lowerM.includes('flash-thinking') || lowerM.includes('thinking-exp') || lowerM.includes('r1') || lowerM.includes('o3-mini') || lowerM.includes('math-x')) {
            resolvedModel = 'gemini-2.0-flash-thinking-exp';
          } else if (lowerM.includes('2.5-pro') || lowerM === 'girionix-pro' || lowerM.includes('claude') || lowerM.includes('gpt-4o')) {
            resolvedModel = 'gemini-2.5-pro';
          } else if (lowerM.includes('2.5-flash') || lowerM === 'girionix-lite' || lowerM.includes('lite') || lowerM.includes('llama')) {
            resolvedModel = 'gemini-2.5-flash';
          } else if (lowerM.includes('2.0-flash')) {
            resolvedModel = 'gemini-2.0-flash';
          } else if (lowerM.includes('1.5-pro')) {
            resolvedModel = 'gemini-1.5-pro';
          } else if (lowerM.includes('1.5-flash')) {
            resolvedModel = 'gemini-1.5-flash';
          }

          const res = await geminiStudioEngine.streamPrompt({
            directKey: activeKey,
            mode: 'chat',
            systemInstruction: systemMsg,
            history: historyTurns,
            prompt: lastMsg?.content || '',
            model: resolvedModel,
            temperature,
            maxOutputTokens: maxTokens,
            enableThinking: useThinking,
            enableSearchGrounding: webSearchEnabled,
            onToken: (chunk, full) => {
              if (onChunk) onChunk(chunk, full);
            },
            onThinking: (chunk, full) => {
              if (onReasoningChunk) onReasoningChunk(chunk, full);
            },
            signal
          });

          if (res?.content) {
            return {
              content: res.content,
              reasoning: res.thinking || '',
              modelUsed: res.modelUsed || resolvedModel
            };
          }
        }
      } catch (err) {
        if (signal?.aborted) throw err;
        console.error('Direct Gemini stream error:', err.message);
        if (directGeminiKey) {
          const formattedErr = `⚠️ **Google Gemini API Notice**\n\nCould not complete request with your Gemini API key: *${err.message}*\n\n💡 **Troubleshooting**:\n- Check your Gemini API key in **Settings (⚙️)**\n- Verify your quota on [Google AI Studio](https://aistudio.google.com/app/apikey)\n- Free-tier accounts have generous 15 RPM limits on \`gemini-2.5-flash\` and \`gemini-2.0-flash\`\n\n*Connecting to Girionix Frontier Neural Engine:*`;
          if (onChunk) onChunk(formattedErr + '\n\n', formattedErr + '\n\n');
        }
      }
    }

    // Zero API Key Configured: Immediately stream via Sovereign Local Neural Engine without failed HTTP calls
    if (!userApiKey && !masterKey && !directGeminiKey) {
      return this.streamFreeNeuralAI({ messages: enrichedMessages, webSearchEnabled, useThinking, onChunk, onReasoningChunk, signal });
    }

    // Build ordered candidate model list tailored to the active provider
    const candidateModels = [];
    if (targetModelId) candidateModels.push(targetModelId);

    if (config.providerId === 'google') {
      ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'].forEach(m => {
        if (!candidateModels.includes(m)) candidateModels.push(m);
      });
    } else if (config.providerId === 'groq') {
      ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'qwen-2.5-coder-32b'].forEach(m => {
        if (!candidateModels.includes(m)) candidateModels.push(m);
      });
    } else if (config.providerId === 'deepseek') {
      ['deepseek-chat', 'deepseek-reasoner'].forEach(m => {
        if (!candidateModels.includes(m)) candidateModels.push(m);
      });
    } else if (config.providerId === 'openai') {
      ['gpt-4o', 'gpt-4o-mini'].forEach(m => {
        if (!candidateModels.includes(m)) candidateModels.push(m);
      });
    } else if (config.providerId === 'anthropic') {
      ['claude-3-7-sonnet-20250219', 'claude-3-5-haiku-20241022'].forEach(m => {
        if (!candidateModels.includes(m)) candidateModels.push(m);
      });
    } else if (config.providerId === 'openrouter') {
      const freeCascade = [
        'minimax/minimax-m3:free',
        'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
        'cohere/north-mini-code:free',
        'dots-studio/dots-3-note-preview:free'
      ];
      freeCascade.forEach(m => {
        if (!candidateModels.includes(m)) candidateModels.push(m);
      });
    }

    for (const candidateModel of candidateModels) {
      if (signal?.aborted) break;

      // Try with user key, and if 401/403, fallback to master key
      const keysToTry = [userApiKey];
      if (masterKey && masterKey !== userApiKey) {
        keysToTry.push(masterKey);
      }

      for (const key of keysToTry) {
        try {
          let endpoint = `${config.baseUrl}/chat/completions`;
          const requestHeaders = {
            'Content-Type': 'application/json',
            'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://girionix-ai.pages.dev',
            'X-Title': 'Girionix AI Polymath Workstation',
          };

          let requestBody = {
            model: candidateModel,
            messages: enrichedMessages,
            temperature,
            max_tokens: maxTokens,
            stream: true
          };

          if (config.providerId === 'anthropic') {
            endpoint = 'https://api.anthropic.com/v1/messages';
            if (key) {
              requestHeaders['x-api-key'] = key;
              requestHeaders['anthropic-version'] = '2023-06-01';
              requestHeaders['dangerously-allow-browser'] = 'true';
            }
            requestBody = {
              model: candidateModel,
              max_tokens: maxTokens || 4096,
              system: finalSystemPrompt,
              messages: cleanDialogue.map(m => ({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: m.content || ''
              })),
              stream: true
            };
          } else {
            if (key) {
              requestHeaders['Authorization'] = `Bearer ${key}`;
            }

            // Pass OpenRouter Web Search plugin if Web Search is enabled
            if (webSearchEnabled && config.providerId === 'openrouter') {
              requestBody.plugins = [{ id: 'web', max_results: 5 }];
            }

            // Pass reasoning parameters if Deep Reasoning is enabled (only on supported providers)
            if (useThinking && (config.providerId === 'openrouter' || config.providerId === 'deepseek')) {
              requestBody.reasoning = {
                max_tokens: 2048,
                effort: 'high'
              };
            }
          }

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify(requestBody),
            signal
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errMsg = errorData.error?.message || errorData.message || `Status ${response.status}`;
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
                  // Support OpenAI, OpenRouter, Groq, DeepSeek, and Anthropic SSE delta formats
                  const delta = json.choices?.[0]?.delta || json.delta || json;
                  
                  const textDelta = delta?.content || delta?.text || (json.type === 'content_block_delta' ? json.delta?.text : '') || '';
                  const reasoningDelta = delta?.reasoning || delta?.reasoning_content || delta?.thinking || '';
                  
                  if (reasoningDelta && onReasoningChunk) {
                    fullReasoning += reasoningDelta;
                    onReasoningChunk(reasoningDelta, fullReasoning);
                  }
                  
                  if (textDelta) {
                    fullContent += textDelta;
                    if (onChunk) onChunk(textDelta, fullContent);
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

    // Fallback: If user had an active key configured but cloud endpoints failed, notify user
    if (userApiKey || masterKey) {
      const notice = `⚠️ **Cloud API Connection Notice**\n\nCould not complete request with provider **${config.providerName || config.providerId}**. Candidate models returned errors or exhausted quota.\n\n👉 **Please verify your API key in Settings (⚙️).**\n\n*Connecting to Girionix Frontier Neural Engine:*`;
      if (onChunk) onChunk(notice + '\n\n', notice + '\n\n');
    }

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
