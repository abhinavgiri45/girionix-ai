import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Play, 
  Square, 
  Code2, 
  Settings, 
  Trash2, 
  Sliders, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Layers, 
  Plus, 
  Paperclip, 
  X, 
  Search, 
  Terminal, 
  FileCode, 
  Cpu, 
  Clock, 
  Gauge, 
  ExternalLink, 
  HelpCircle, 
  Share2, 
  Save, 
  FolderPlus,
  BookOpen,
  Send,
  Zap,
  CheckCircle2,
  Table,
  Columns3,
  Bot,
  Key,
  RefreshCw,
  Shield,
  Edit2,
  RotateCcw
} from 'lucide-react';
import GoogleStudioOutput from './GoogleStudioOutput';
import { geminiStudioEngine, OFFICIAL_GEMINI_MODELS } from '../../services/geminiStudioEngine';
import { openrouter } from '../../services/openrouter';
import { universalApiEngine } from '../../services/universalApiEngine';
import { storage } from '../../services/storage';

// Preset sample prompt library
const SAMPLE_PROMPTS = [
  {
    name: "Python Fibonacci with AST Analysis",
    mode: "chat",
    system: "You are an expert Python architect and algorithmic researcher. Write high-performance, cleanly typed, vectorized code with asymptotic Big-O complexity analysis and unit tests.",
    userPrompt: "Write a high-performance Python 3.12 function to calculate the N-th Fibonacci number using matrix exponentiation O(log N). Include docstrings, type hints, and benchmark against recursive approaches."
  },
  {
    name: "Quantum Hilbert Space & KaTeX Derivation",
    mode: "chat",
    system: "You are a theoretical physicist. Format all mathematical expressions in rigorous KaTeX LaTeX notation ($ for inline, $$ for block formulas). Provide step-by-step physical reasoning.",
    userPrompt: "Derive the Heisenberg Uncertainty Principle $\\Delta x \\Delta p \\ge \\frac{\\hbar}{2}$ from the Robertson-Schrödinger relation using Cauchy-Schwarz inequality for quantum operators."
  },
  {
    name: "Structured JSON Sentiment Classifier",
    mode: "structured",
    system: "You are an automated customer sentiment classification engine. Respond with strict JSON schemas.",
    fields: { input: "Customer Review", output: "Sentiment JSON" },
    examples: [
      { input: "The battery lasts all day and the camera is breathtaking!", output: '{"sentiment": "positive", "confidence": 0.98, "aspects": ["battery", "camera"]}' },
      { input: "Device overheated within 10 minutes and support was unresponsive.", output: '{"sentiment": "negative", "confidence": 0.95, "aspects": ["thermals", "support"]}' }
    ],
    testInput: "Screen is gorgeous, but delivery arrived two days late and packaging was slightly dented."
  },
  {
    name: "Fullstack React Component with Tailwind",
    mode: "chat",
    system: "You are a senior frontend engineer. Output pure, self-contained modern React 18 functional components with Tailwind CSS and interactive state.",
    userPrompt: "Create a modern, responsive Glassmorphism dashboard card displaying real-time system metrics (CPU load, memory usage, network latency) with interactive hover micro-interactions."
  }
];

export default function GoogleAIStudio({ 
  activeModel, 
  isTitanMode = false,
  injectedCode = null,
  onClose = null,
  initialMode = 'chat'
}) {
  // Mode: 'chat' | 'freeform' | 'structured'
  const [studioMode, setStudioMode] = useState(initialMode || 'chat');
  const [promptTitle, setPromptTitle] = useState('Untitled prompt');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // System Instructions
  const [isSystemInstructionsOpen, setIsSystemInstructionsOpen] = useState(false);
  const [systemInstruction, setSystemInstruction] = useState(
    'You are a helpful, expert AI polymath who gives rigorous, verified answers, writes clean, modern code, and formats formulas in clear KaTeX math.'
  );

  // Chat Mode State
  const [chatTurns, setChatTurns] = useState([
    {
      id: 'turn-1',
      role: 'user',
      content: 'Write a Python function to generate Fibonacci sequence up to N elements and verify its execution.',
      tokens: 18
    },
    {
      id: 'turn-2',
      role: 'model',
      content: `Here is an efficient, generator-based implementation of the Fibonacci sequence in modern Python 3.12:

\`\`\`python
def fibonacci_sequence(n: int) -> list[int]:
    """Generates the first n Fibonacci numbers."""
    if n <= 0:
        return []
    if n == 1:
        return [0]
    
    seq = [0, 1]
    while len(seq) < n:
        seq.append(seq[-1] + seq[-2])
    return seq

# Run demonstration
result = fibonacci_sequence(10)
print(f"Fibonacci (10 elements): {result}")
\`\`\`

### Mathematical Definition
The Fibonacci sequence is defined by the recurrence relation:
$$F_0 = 0, \\quad F_1 = 1, \\quad F_n = F_{n-1} + F_{n-2} \\quad \\text{for } n \\ge 2$$

The closed-form representation is given by Binet's Formula:
$$F_n = \\frac{\\phi^n - \\psi^n}{\\sqrt{5}} = \\frac{1}{\\sqrt{5}}\\left[\\left(\\frac{1+\\sqrt{5}}{2}\\right)^n - \\left(\\frac{1-\\sqrt{5}}{2}\\right)^n\\right]$$

You can click **▶ Run Code** above to execute this code right inside the in-browser Google AI sandbox!`,
      thinking: "The user requests an efficient Fibonacci generator in Python. I should provide a typed function with docstrings, provide the recurrence relation in KaTeX math, and include executable code with a print statement so they can test the in-browser sandbox runner.",
      latencyMs: 642,
      tokenCount: 268,
      speedTokensPerSec: 74,
      finishReason: 'stop'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [editingTurnId, setEditingTurnId] = useState(null);
  const [editingTurnContent, setEditingTurnContent] = useState('');

  // Freeform Mode State
  const [freeformContent, setFreeformContent] = useState(
    'Analyze the key architectural advantages of Transformer models over traditional Recurrent Neural Networks (RNNs).\n\nKey areas to cover:\n1. Parallelized matrix training\n2. Self-attention mechanism $O(N^2)$ vs sequential hidden states $O(N)$\n3. Long-range context retention and vanishing gradients'
  );
  const [freeformOutput, setFreeformOutput] = useState(null);

  // Structured Mode State
  const [structuredFields, setStructuredFields] = useState({
    input: "Customer Review",
    output: "Sentiment & Key Themes"
  });
  const [structuredExamples, setStructuredExamples] = useState([
    {
      id: 'ex-1',
      input: "The battery lasts all day and the camera is breathtaking!",
      output: '{"sentiment": "positive", "score": 0.98, "themes": ["battery", "camera"]}'
    },
    {
      id: 'ex-2',
      input: "Device overheated within 10 minutes and customer support refused replacement.",
      output: '{"sentiment": "negative", "score": 0.95, "themes": ["thermals", "support"]}'
    }
  ]);
  const [structuredTestInput, setStructuredTestInput] = useState(
    "The screen is bright and vivid in direct sunlight, but the speakers crackle at maximum volume."
  );
  const [structuredOutput, setStructuredOutput] = useState(null);

  // Run Settings State
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-pro');
  const [temperature, setTemperature] = useState(1.0);
  const [topP, setTopP] = useState(0.95);
  const [topK, setTopK] = useState(40);
  const [maxOutputTokens, setMaxOutputTokens] = useState(8192);
  const [thinkingBudget, setThinkingBudget] = useState(2048);
  const [enableThinking, setEnableThinking] = useState(true);
  const [enableSearchGrounding, setEnableSearchGrounding] = useState(true);
  const [enableCodeExecution, setEnableCodeExecution] = useState(true);
  const [enableJsonMode, setEnableJsonMode] = useState(false);
  const [safetyThreshold, setSafetyThreshold] = useState('BLOCK_NONE'); // 'BLOCK_NONE' | 'BLOCK_FEW' | 'BLOCK_SOME'

  // API Key Modal State
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => geminiStudioEngine.getApiKey());
  const [isVerifyingKey, setIsVerifyingKey] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState(null);
  const [hasDirectKey, setHasDirectKey] = useState(() => geminiStudioEngine.hasApiKey());

  // Mobile Run Settings Drawer
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);

  // Get Code Modal
  const [isGetCodeOpen, setIsGetCodeOpen] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('python'); // 'python' | 'javascript' | 'curl' | 'swift' | 'kotlin'
  const [copiedCode, setCopiedCode] = useState(false);

  // Streaming & Execution state
  const [isGenerating, setIsGenerating] = useState(false);
  const chatBottomRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    if (studioMode === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatTurns, studioMode, isGenerating]);

  // Handle injected code (from chat "Open in Code Studio")
  useEffect(() => {
    if (injectedCode) {
      setStudioMode('chat');
      setChatTurns(prev => [
        ...prev,
        {
          id: `injected-${Date.now()}`,
          role: 'user',
          content: `Here is code to review, optimize, and run in the AI Studio environment:\n\n\`\`\`\n${injectedCode}\n\`\`\``,
          tokens: Math.round(injectedCode.length / 4)
        }
      ]);
    }
  }, [injectedCode]);

  // Calculate approximate context token usage
  const approximateTokenCount = () => {
    let text = systemInstruction || '';
    if (studioMode === 'chat') {
      text += chatTurns.map(t => t.content).join(' ') + chatInput;
    } else if (studioMode === 'freeform') {
      text += freeformContent;
    } else if (studioMode === 'structured') {
      text += structuredExamples.map(e => e.input + ' ' + e.output).join(' ') + structuredTestInput;
    }
    return Math.round(text.length / 4);
  };

  const currentTokenCount = approximateTokenCount();
  const activeModelMeta = OFFICIAL_GEMINI_MODELS.find(m => m.id === selectedModel) || OFFICIAL_GEMINI_MODELS[0];
  const maxModelContext = activeModelMeta.contextWindow || 1048576;
  const contextPercentage = Math.min(100, Math.max(0.01, (currentTokenCount / maxModelContext) * 100)).toFixed(2);

  // File Upload Handler
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedFiles(prev => [
          ...prev,
          {
            name: file.name,
            size: `${(file.size / 1024).toFixed(1)} KB`,
            type: file.type,
            dataUrl: typeof reader.result === 'string' ? reader.result : '',
            text: typeof reader.result === 'string' && !file.type.startsWith('image/') ? reader.result : ''
          }
        ]);
      };
      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  // Stop Generation handler
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
  };

  // API Key Save & Verification
  const handleSaveApiKey = async () => {
    setIsVerifyingKey(true);
    setVerifyStatus(null);
    try {
      const res = await geminiStudioEngine.verifyApiKey(apiKeyInput);
      if (res.valid) {
        geminiStudioEngine.setApiKey(apiKeyInput);
        setHasDirectKey(true);
        setVerifyStatus({ success: true, message: res.label });
        setTimeout(() => setIsApiKeyModalOpen(false), 1200);
      } else {
        setVerifyStatus({ success: false, message: res.message });
      }
    } catch (err) {
      setVerifyStatus({ success: false, message: err.message });
    } finally {
      setIsVerifyingKey(false);
    }
  };

  const handleClearApiKey = () => {
    geminiStudioEngine.setApiKey('');
    setApiKeyInput('');
    setHasDirectKey(false);
    setVerifyStatus({ success: true, message: 'Reverted to Free Neural AI Gateway' });
  };

  // Run generation with Real-Time Streaming
  const handleRun = async () => {
    if (isGenerating) return;

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    if (studioMode === 'chat') {
      if (!chatInput.trim() && attachedFiles.length === 0 && chatTurns.length === 0) return;

      const userText = chatInput.trim();
      const currentAttachments = [...attachedFiles];

      const userTurn = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: userText || '(Attached files provided)',
        tokens: Math.round((userText || '').length / 4),
        attachments: currentAttachments
      };

      const modelTurnId = `model-${Date.now()}`;
      const placeholderModelTurn = {
        id: modelTurnId,
        role: 'model',
        content: '',
        thinking: enableThinking ? '' : null,
        latencyMs: 0,
        tokenCount: 0,
        speedTokensPerSec: 0,
        finishReason: null,
        isStreaming: true,
        groundingSources: enableSearchGrounding ? [
          { title: "Google DeepMind Gemini 2.5", url: "https://deepmind.google/technologies/gemini/" },
          { title: "Google AI for Developers", url: "https://ai.google.dev/" }
        ] : []
      };

      setChatTurns(prev => [...prev, userTurn, placeholderModelTurn]);
      setChatInput('');
      setAttachedFiles([]);
      setIsGenerating(true);

      try {
        await geminiStudioEngine.streamPrompt({
          mode: 'chat',
          systemInstruction,
          prompt: userText,
          history: chatTurns,
          files: currentAttachments,
          model: selectedModel,
          temperature,
          topP,
          topK,
          maxOutputTokens,
          thinkingBudget,
          enableThinking,
          enableSearchGrounding,
          enableJsonMode,
          onToken: (chunk, full) => {
            setChatTurns(prev => prev.map(t => {
              if (t.id === modelTurnId) {
                return { ...t, content: full };
              }
              return t;
            }));
          },
          onThinking: (chunk, full) => {
            setChatTurns(prev => prev.map(t => {
              if (t.id === modelTurnId) {
                return { ...t, thinking: full };
              }
              return t;
            }));
          },
          onMetrics: (metrics) => {
            setChatTurns(prev => prev.map(t => {
              if (t.id === modelTurnId) {
                return { 
                  ...t, 
                  latencyMs: metrics.latencyMs, 
                  tokenCount: metrics.tokenCount, 
                  speedTokensPerSec: metrics.speedTokensPerSec,
                  finishReason: metrics.finishReason || t.finishReason
                };
              }
              return t;
            }));
          },
          signal
        });
      } catch (err) {
        if (!signal.aborted) {
          setChatTurns(prev => prev.map(t => {
            if (t.id === modelTurnId) {
              return { 
                ...t, 
                content: t.content ? `${t.content}\n\n*[Generation stopped: ${err.message}]*` : `### Error\n${err.message}`, 
                finishReason: 'error' 
              };
            }
            return t;
          }));
        }
      } finally {
        setChatTurns(prev => prev.map(t => t.id === modelTurnId ? { ...t, isStreaming: false, finishReason: t.finishReason || 'stop' } : t));
        setIsGenerating(false);
      }
    } else if (studioMode === 'freeform') {
      if (!freeformContent.trim()) return;
      setIsGenerating(true);

      setFreeformOutput({
        content: '',
        thinking: enableThinking ? '' : null,
        latencyMs: 0,
        tokenCount: 0,
        speedTokensPerSec: 0,
        finishReason: null,
        isStreaming: true
      });

      try {
        await geminiStudioEngine.streamPrompt({
          mode: 'freeform',
          systemInstruction,
          prompt: freeformContent,
          model: selectedModel,
          temperature,
          topP,
          topK,
          maxOutputTokens,
          thinkingBudget,
          enableThinking,
          enableSearchGrounding,
          enableJsonMode,
          onToken: (chunk, full) => {
            setFreeformOutput(prev => prev ? { ...prev, content: full } : null);
          },
          onThinking: (chunk, full) => {
            setFreeformOutput(prev => prev ? { ...prev, thinking: full } : null);
          },
          onMetrics: (metrics) => {
            setFreeformOutput(prev => prev ? { 
              ...prev, 
              latencyMs: metrics.latencyMs, 
              tokenCount: metrics.tokenCount, 
              speedTokensPerSec: metrics.speedTokensPerSec,
              finishReason: metrics.finishReason || prev.finishReason
            } : null);
          },
          signal
        });
      } catch (err) {
        if (!signal.aborted) {
          setFreeformOutput(prev => prev ? { ...prev, content: `Error: ${err.message}`, finishReason: 'error' } : null);
        }
      } finally {
        setFreeformOutput(prev => prev ? { ...prev, isStreaming: false, finishReason: prev.finishReason || 'stop' } : null);
        setIsGenerating(false);
      }
    } else if (studioMode === 'structured') {
      if (!structuredTestInput.trim()) return;
      setIsGenerating(true);

      setStructuredOutput({
        content: '',
        thinking: enableThinking ? '' : null,
        latencyMs: 0,
        tokenCount: 0,
        speedTokensPerSec: 0,
        finishReason: null,
        isStreaming: true
      });

      const fewShotPrompt = `${systemInstruction}\n\nTask: Map field "${structuredFields.input}" to output field "${structuredFields.output}".\n\n` +
        structuredExamples.map((ex, i) => `Example ${i + 1}:\n${structuredFields.input}: ${ex.input}\n${structuredFields.output}: ${ex.output}`).join('\n\n') +
        `\n\nProcess:\n${structuredFields.input}: ${structuredTestInput}\n${structuredFields.output}:`;

      try {
        await geminiStudioEngine.streamPrompt({
          mode: 'structured',
          systemInstruction,
          prompt: fewShotPrompt,
          model: selectedModel,
          temperature,
          topP,
          topK,
          maxOutputTokens,
          thinkingBudget,
          enableThinking,
          enableSearchGrounding,
          enableJsonMode: true,
          onToken: (chunk, full) => {
            setStructuredOutput(prev => prev ? { ...prev, content: full } : null);
          },
          onThinking: (chunk, full) => {
            setStructuredOutput(prev => prev ? { ...prev, thinking: full } : null);
          },
          onMetrics: (metrics) => {
            setStructuredOutput(prev => prev ? { 
              ...prev, 
              latencyMs: metrics.latencyMs, 
              tokenCount: metrics.tokenCount, 
              speedTokensPerSec: metrics.speedTokensPerSec,
              finishReason: metrics.finishReason || prev.finishReason
            } : null);
          },
          signal
        });
      } catch (err) {
        if (!signal.aborted) {
          setStructuredOutput(prev => prev ? { ...prev, content: `Error: ${err.message}`, finishReason: 'error' } : null);
        }
      } finally {
        setStructuredOutput(prev => prev ? { ...prev, isStreaming: false, finishReason: prev.finishReason || 'stop' } : null);
        setIsGenerating(false);
      }
    }
  };

  // Keyboard shortcut Ctrl+Enter to Run
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleRun();
    }
  };

  // Load preset sample prompt
  const handleLoadSample = (sample) => {
    setStudioMode(sample.mode);
    setPromptTitle(sample.name);
    setSystemInstruction(sample.system);
    setIsSystemInstructionsOpen(true);

    if (sample.mode === 'chat') {
      setChatTurns([
        {
          id: `sample-u-${Date.now()}`,
          role: 'user',
          content: sample.userPrompt,
          tokens: Math.round(sample.userPrompt.length / 4)
        }
      ]);
    } else if (sample.mode === 'structured') {
      setStructuredFields(sample.fields);
      setStructuredExamples(sample.examples.map((ex, i) => ({ id: `ex-${i}`, ...ex })));
      setStructuredTestInput(sample.testInput);
    }
  };

  // Clear workspace
  const handleClear = () => {
    if (isGenerating) handleStop();
    if (studioMode === 'chat') {
      setChatTurns([]);
      setChatInput('');
      setAttachedFiles([]);
    } else if (studioMode === 'freeform') {
      setFreeformContent('');
      setFreeformOutput(null);
    } else if (studioMode === 'structured') {
      setStructuredTestInput('');
      setStructuredOutput(null);
    }
  };

  // Edit past user turn and fork conversation
  const handleSaveEditTurn = (turnId) => {
    const turnIndex = chatTurns.findIndex(t => t.id === turnId);
    if (turnIndex === -1) return;

    const trimmed = chatTurns.slice(0, turnIndex);
    const updatedUserTurn = {
      ...chatTurns[turnIndex],
      content: editingTurnContent,
      tokens: Math.round(editingTurnContent.length / 4)
    };

    setChatTurns([...trimmed, updatedUserTurn]);
    setEditingTurnId(null);
    setEditingTurnContent('');
  };

  // Delete a turn
  const handleDeleteTurn = (turnId) => {
    setChatTurns(prev => prev.filter(t => t.id !== turnId));
  };

  // Regenerate last model response
  const handleRegenerate = () => {
    if (chatTurns.length < 2 || isGenerating) return;
    const lastUserTurn = [...chatTurns].reverse().find(t => t.role === 'user');
    if (!lastUserTurn) return;

    // Drop last model turn and rerun
    const trimmed = chatTurns.filter((_, idx) => idx < chatTurns.length - 1);
    setChatTurns(trimmed);
    setChatInput(lastUserTurn.content);
    setTimeout(() => handleRun(), 100);
  };

  // Official Google GenAI SDK Code generation for Get Code modal
  const generateSdkCode = () => {
    const activeSys = systemInstruction.replace(/"/g, '\\"');
    const model = selectedModel;
    const lastContent = (studioMode === 'chat' ? (chatTurns[chatTurns.length - 1]?.content || 'Hello') : freeformContent).replace(/"/g, '\\"');

    if (codeLanguage === 'python') {
      return `# Official Google GenAI SDK (google-genai)
# pip install google-genai

from google import genai
from google.genai import types

# Initialize client using GEMINI_API_KEY environment variable
client = genai.Client()

response = client.models.generate_content(
    model="${model}",
    contents="${lastContent}",
    config=types.GenerateContentConfig(
        system_instruction="${activeSys}",
        temperature=${temperature},
        top_p=${topP},
        top_k=${topK},
        max_output_tokens=${maxOutputTokens},
        ${enableThinking ? `thinking_config=types.ThinkingConfig(thinking_budget=${thinkingBudget}),` : ''}
        ${enableSearchGrounding ? `tools=[types.Tool(google_search=types.GoogleSearch())],` : ''}
    ),
)

print(response.text)
`;
    }

    if (codeLanguage === 'javascript') {
      return `// Official Google GenAI SDK (@google/genai)
// npm install @google/genai

import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI();

async function main() {
  const response = await ai.models.generateContent({
    model: '${model}',
    contents: '${lastContent.replace(/'/g, "\\'")}',
    config: {
      systemInstruction: '${activeSys}',
      temperature: ${temperature},
      topP: ${topP},
      topK: ${topK},
      maxOutputTokens: ${maxOutputTokens},
      ${enableThinking ? `thinkingConfig: { thinkingBudget: ${thinkingBudget} },` : ''}
      ${enableSearchGrounding ? `tools: [{ googleSearch: {} }],` : ''}
    }
  });

  console.log(response.text);
}

main();
`;
    }

    if (codeLanguage === 'curl') {
      return `curl "https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=\${GEMINI_API_KEY}" \\
  -H 'Content-Type: application/json' \\
  -X POST \\
  -d '{
    "system_instruction": { "parts": [{ "text": "${activeSys}" }] },
    "contents": [{ "parts": [{ "text": "${lastContent}" }] }],
    "generationConfig": {
      "temperature": ${temperature},
      "topP": ${topP},
      "topK": ${topK},
      "maxOutputTokens": ${maxOutputTokens}
    }
  }'
`;
    }

    if (codeLanguage === 'swift') {
      return `// Google GenAI Swift SDK
import GoogleGenAI

let ai = GoogleGenAI()

let config = GenerateContentConfig(
    systemInstruction: "${activeSys}",
    temperature: ${temperature},
    topP: ${topP},
    maxOutputTokens: ${maxOutputTokens}
)

let response = try await ai.models.generateContent(
    model: "${model}",
    prompt: "${lastContent}",
    config: config
)

print(response.text ?? "")
`;
    }

    if (codeLanguage === 'kotlin') {
      return `// Google GenAI Android / Kotlin SDK
import com.google.genai.Client
import com.google.genai.types.GenerateContentConfig

val client = Client()

val config = GenerateContentConfig(
    systemInstruction = "${activeSys}",
    temperature = ${temperature}f,
    topP = ${topP}f,
    maxOutputTokens = ${maxOutputTokens}
)

val response = client.models.generateContent(
    model = "${model}",
    prompt = "${lastContent}",
    config = config
)

println(response.text)
`;
    }

    return '';
  };

  const handleCopyCodeSnippet = () => {
    navigator.clipboard.writeText(generateSdkCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#131314] text-[#e3e3e3] select-none overflow-hidden relative font-sans">
      {/* 1. Google AI Studio Header Bar */}
      <div className="px-3 sm:px-4 py-2.5 bg-[#1e1f20] border-b border-[#3c4043] flex items-center justify-between gap-2.5 flex-wrap shrink-0 z-10">
        {/* Left: Brand Identity & Editable Prompt Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4772 12 22C12 16.4772 16.4772 12 22 12C16.4772 12 12 7.52285 12 2Z" fill="url(#gemini_grad_hdr)" />
              <defs>
                <linearGradient id="gemini_grad_hdr" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4285F4" />
                  <stop offset="0.33" stopColor="#9B72CF" />
                  <stop offset="0.66" stopColor="#D96570" />
                  <stop offset="1" stopColor="#FBBC05" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-sm font-medium text-[#e3e3e3] tracking-tight hidden sm:inline">Google AI Studio</span>
          </div>

          <div className="h-4 w-px bg-[#444746] hidden sm:block" />

          {/* Editable Prompt Title */}
          {isEditingTitle ? (
            <input
              type="text"
              value={promptTitle}
              onChange={(e) => setPromptTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
              autoFocus
              className="bg-[#131314] border border-[#a8c7fa] rounded-lg px-2.5 py-0.5 text-xs text-[#e3e3e3] focus:outline-none max-w-[140px] sm:max-w-[220px]"
            />
          ) : (
            <div 
              onClick={() => setIsEditingTitle(true)}
              className="text-xs font-normal text-[#c4c7c5] hover:text-white cursor-pointer truncate max-w-[140px] sm:max-w-[220px] px-1.5 py-0.5 rounded hover:bg-[#282a2c] transition-colors flex items-center gap-1"
              title="Click to rename prompt"
            >
              <span>{promptTitle}</span>
              <span className="text-[10px] text-[#8e918f]">✎</span>
            </div>
          )}
        </div>

        {/* Center: Mode Tabs (Chat prompt | Freeform prompt | Structured prompt) */}
        <div className="flex items-center p-0.5 rounded-full bg-[#131314] border border-[#3c4043] text-xs font-medium">
          <button
            onClick={() => setStudioMode('chat')}
            className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
              studioMode === 'chat'
                ? 'bg-[#282a2c] text-[#a8c7fa] font-medium shadow-sm'
                : 'text-[#c4c7c5] hover:text-white'
            }`}
            title="Multi-turn Conversational Chat Prompt"
          >
            <span>Chat prompt</span>
          </button>

          <button
            onClick={() => setStudioMode('freeform')}
            className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
              studioMode === 'freeform'
                ? 'bg-[#282a2c] text-[#a8c7fa] font-medium shadow-sm'
                : 'text-[#c4c7c5] hover:text-white'
            }`}
            title="Single-turn Rich Freeform Canvas"
          >
            <span>Freeform prompt</span>
          </button>

          <button
            onClick={() => setStudioMode('structured')}
            className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
              studioMode === 'structured'
                ? 'bg-[#282a2c] text-[#a8c7fa] font-medium shadow-sm'
                : 'text-[#c4c7c5] hover:text-white'
            }`}
            title="Structured Few-Shot Examples Table"
          >
            <span>Structured prompt</span>
          </button>
        </div>

        {/* Right: Quick Action Controls (<> Get Code, Sample Prompts, API Key, Big Blue Run button) */}
        <div className="flex items-center gap-2">
          {/* Direct Google Gemini API Key Button (Official Google AI Studio Top Nav Feature) */}
          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
              hasDirectKey
                ? 'bg-[#004a77]/40 text-[#a8c7fa] border-[#a8c7fa]/40 hover:bg-[#004a77]/60 shadow-sm'
                : 'bg-[#282a2c] hover:bg-[#3c4043] text-[#c4c7c5] hover:text-white border-[#444746]'
            }`}
            title="Set official Google Gemini API Key (aistudio.google.com)"
          >
            <Key className="w-3.5 h-3.5 text-[#a8c7fa]" />
            <span className="hidden md:inline">{hasDirectKey ? 'API Key Active' : 'Get API Key'}</span>
            {hasDirectKey && <span className="w-1.5 h-1.5 rounded-full bg-[#7adaa2]" />}
          </button>

          {/* Sample Prompts Dropdown */}
          <div className="relative group">
            <button
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#282a2c] hover:bg-[#3c4043] text-[#c4c7c5] hover:text-white border border-[#444746] text-xs font-medium transition-all cursor-pointer"
              title="Load AI Studio Sample Prompts"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#a8c7fa]" />
              <span className="hidden md:inline">Samples</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            <div className="absolute right-0 mt-1 w-64 rounded-2xl bg-[#1e1f20] border border-[#444746] p-2 shadow-2xl z-50 hidden group-hover:block space-y-1">
              <div className="px-2 py-1 text-[10px] font-mono text-[#8e918f] uppercase border-b border-[#3c4043]">
                Sample Prompts Library
              </div>
              {SAMPLE_PROMPTS.map((sample, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => handleLoadSample(sample)}
                  className="w-full text-left p-2 rounded-xl text-xs hover:bg-[#282a2c] text-[#c4c7c5] hover:text-[#a8c7fa] transition-colors cursor-pointer"
                >
                  <div className="font-medium text-[#e3e3e3]">{sample.name}</div>
                  <div className="text-[10px] text-[#8e918f] capitalize">{sample.mode} prompt</div>
                </button>
              ))}
            </div>
          </div>

          {/* <> Get Code Modal Trigger */}
          <button
            onClick={() => setIsGetCodeOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#282a2c] hover:bg-[#3c4043] text-[#c4c7c5] hover:text-white border border-[#444746] text-xs font-medium transition-all cursor-pointer"
            title="Get Python, JavaScript, and cURL SDK code"
          >
            <Code2 className="w-3.5 h-3.5 text-[#a8c7fa]" />
            <span className="hidden sm:inline">Get code</span>
          </button>

          {/* Big Blue Google Run / Stop Button */}
          {isGenerating ? (
            <button
              onClick={handleStop}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium text-xs bg-[#ba1a1a] hover:bg-[#ff5449] text-white shadow-sm transition-all cursor-pointer animate-pulse"
              title="Stop prompt generation"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              onClick={handleRun}
              disabled={isGenerating || (studioMode === 'chat' && !chatInput.trim() && attachedFiles.length === 0 && chatTurns.length === 0)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium text-xs bg-[#0b57d0] hover:bg-[#1a73e8] text-white shadow-sm transition-all cursor-pointer disabled:opacity-40"
              title="Run prompt generation (Ctrl+Enter)"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run</span>
              <span className="hidden sm:inline text-[10px] text-blue-200/80 font-mono ml-0.5">Ctrl+↵</span>
            </button>
          )}

          {/* Clear Workspace */}
          <button
            onClick={handleClear}
            className="p-1.5 rounded-lg hover:bg-[#282a2c] text-[#8e918f] hover:text-[#ff897d] transition-colors cursor-pointer"
            title="Clear prompt and responses"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Run Settings Button (< lg) */}
          <button
            onClick={() => setIsMobileSettingsOpen(true)}
            className="lg:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#282a2c] text-[#a8c7fa] border border-[#444746] text-xs font-medium cursor-pointer"
            title="Open Run Settings"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          {/* Close Studio Split Button if provided */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#282a2c] text-[#8e918f] hover:text-white transition-colors cursor-pointer ml-0.5"
              title="Close AI Studio"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Body: Workspace on Left/Center, Run Settings on Right */}
      <div className="flex-1 flex overflow-hidden relative min-w-0 bg-[#131314]">
        {/* Workspace Canvas (Full width on mobile, flexible on desktop) */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#131314] min-w-0">
          {/* Collapsible System Instructions Card */}
          <div className="border-b border-[#3c4043] bg-[#1e1f20] shrink-0">
            <button
              onClick={() => setIsSystemInstructionsOpen(!isSystemInstructionsOpen)}
              className="w-full px-4 py-2 flex items-center justify-between text-xs font-mono text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Bot className="w-3.5 h-3.5 text-[#a8c7fa]" />
                <span className="font-bold text-gray-200">System instructions</span>
                <span className="text-[10px] text-gray-500 font-normal hidden sm:inline">
                  (Optional, tell the model how to behave)
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-gray-400">
                {isSystemInstructionsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </div>
            </button>

            {isSystemInstructionsOpen && (
              <div className="px-4 pb-3 pt-1 animate-fadeIn bg-[#1e1f20]">
                <textarea
                  value={systemInstruction}
                  onChange={(e) => setSystemInstruction(e.target.value)}
                  placeholder="Optional tone and style instructions for the model (e.g. You are a helpful math tutor...)"
                  rows={2}
                  className="w-full bg-[#131314] border border-[#444746] rounded-xl p-2.5 text-base sm:text-xs text-[#e3e3e3] placeholder-[#8e918f] focus:outline-none focus:border-[#a8c7fa] resize-y leading-relaxed font-sans"
                />
              </div>
            )}
          </div>

          {/* Mode A: Chat Prompt Workspace */}
          {studioMode === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-[#131314]">
              {/* Conversation Turns List */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 touch-scroll">
                {chatTurns.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#8e918f] space-y-3">
                    <div className="p-4 rounded-3xl bg-[#1e1f20] border border-[#444746]">
                      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4772 12 22C12 16.4772 16.4772 12 22 12C16.4772 12 12 7.52285 12 2Z" fill="url(#gemini_center)" />
                        <defs>
                          <linearGradient id="gemini_center" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#4285F4" />
                            <stop offset="0.5" stopColor="#9B72CF" />
                            <stop offset="1" stopColor="#D96570" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-[#e3e3e3] text-base">Google AI Studio Chat Prompt</h3>
                      <p className="text-xs text-[#8e918f] max-w-sm">
                        Type a user prompt below or pick from the sample library. Features real-time token streaming, step-by-step thinking tokens, syntax-highlighted code with in-browser execution sandbox, and KaTeX LaTeX formulas.
                      </p>
                    </div>
                  </div>
                ) : (
                  chatTurns.map((turn) => {
                    const isUser = turn.role === 'user';
                    const isEditing = editingTurnId === turn.id;

                    return (
                      <div key={turn.id} className="space-y-1.5 group">
                        {/* Turn Header */}
                        <div className="flex items-center justify-between text-xs font-mono text-[#8e918f] px-1">
                          <div className="flex items-center gap-1.5">
                            {isUser ? (
                              <span className="font-medium text-[#c4c7c5] flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-[#a8c7fa]" />
                                <span>User</span>
                              </span>
                            ) : (
                              <span className="font-medium text-[#a8c7fa] flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                  <path d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4772 12 22C12 16.4772 16.4772 12 22 12C16.4772 12 12 7.52285 12 2Z" fill="#a8c7fa" />
                                </svg>
                                <span>Model ({selectedModel})</span>
                              </span>
                            )}
                            {turn.tokens && (
                              <span className="text-[10px] text-[#8e918f]">({turn.tokens} tokens)</span>
                            )}
                          </div>

                          {/* Quick Action: Edit / Delete */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                            {isUser && !isEditing && (
                              <button
                                onClick={() => {
                                  setEditingTurnId(turn.id);
                                  setEditingTurnContent(turn.content);
                                }}
                                className="p-1 rounded hover:bg-[#282a2c] text-[#8e918f] hover:text-[#e3e3e3] cursor-pointer"
                                title="Edit prompt and re-run"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteTurn(turn.id)}
                              className="p-1 rounded hover:bg-[#282a2c] text-[#8e918f] hover:text-[#ff897d] cursor-pointer"
                              title="Delete turn"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Turn Body */}
                        {isUser ? (
                          isEditing ? (
                            <div className="p-3 rounded-2xl bg-[#1e1f20] border border-[#a8c7fa] space-y-2">
                              <textarea
                                value={editingTurnContent}
                                onChange={(e) => setEditingTurnContent(e.target.value)}
                                rows={3}
                                className="w-full bg-[#131314] border border-[#444746] rounded-xl p-2.5 text-xs text-[#e3e3e3] focus:outline-none font-sans resize-y"
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setEditingTurnId(null)}
                                  className="px-3 py-1 rounded-lg text-xs text-[#c4c7c5] hover:text-white"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSaveEditTurn(turn.id)}
                                  className="px-3 py-1 rounded-lg bg-[#0b57d0] hover:bg-[#1a73e8] text-white text-xs font-medium"
                                >
                                  Save & Fork
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3.5 rounded-2xl bg-[#1e1f20] border border-[#3c4043] text-xs sm:text-sm text-[#e3e3e3] leading-relaxed whitespace-pre-wrap selection:bg-[#004a77]">
                              {turn.content}
                              {turn.attachments && turn.attachments.length > 0 && (
                                <div className="mt-2.5 flex flex-wrap gap-2 pt-2 border-t border-[#3c4043]">
                                  {turn.attachments.map((file, fIdx) => (
                                    <div key={fIdx} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#131314] border border-[#444746] text-[10px] font-mono text-[#a8c7fa]">
                                      <Paperclip className="w-3 h-3" />
                                      <span>{file.name}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        ) : (
                          <GoogleStudioOutput
                            text={turn.content}
                            thinking={turn.thinking}
                            modelName={selectedModel}
                            latencyMs={turn.latencyMs}
                            tokenCount={turn.tokenCount}
                            speedTokensPerSec={turn.speedTokensPerSec}
                            finishReason={turn.finishReason}
                            groundingSources={turn.groundingSources}
                            isStreaming={turn.isStreaming}
                            onRegenerate={handleRegenerate}
                          />
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Bottom Run Composer Bar */}
              <div className="p-2.5 sm:p-3.5 bg-[#1e1f20] border-t border-[#3c4043] shrink-0">
                {/* Attached files pills */}
                {attachedFiles.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-2">
                    {attachedFiles.map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#131314] border border-[#a8c7fa]/40 text-xs font-mono text-[#a8c7fa]">
                        <Paperclip className="w-3 h-3" />
                        <span>{f.name}</span>
                        <button 
                          onClick={() => setAttachedFiles(attachedFiles.filter((_, idx) => idx !== i))}
                          className="hover:text-white ml-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="relative flex items-end rounded-2xl bg-[#131314] border border-[#444746] focus-within:border-[#a8c7fa] transition-colors p-2">
                  {/* File Attachment Input */}
                  <label className="p-2 text-[#8e918f] hover:text-[#e3e3e3] rounded-full hover:bg-[#282a2c] transition-colors cursor-pointer mb-0.5" title="Insert media (Images, Audio, Video, Files)">
                    <Plus className="w-4 h-4" />
                    <input 
                      type="file" 
                      multiple 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </label>

                  {/* Textarea */}
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type something or use Ctrl+Enter to Run..."
                    rows={1}
                    className="flex-1 bg-transparent text-base sm:text-sm text-[#e3e3e3] placeholder-[#8e918f] px-3 py-1.5 focus:outline-none resize-none leading-relaxed max-h-36 overflow-y-auto font-sans"
                  />

                  {/* Run / Stop Button */}
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {isGenerating ? (
                      <button
                        onClick={handleStop}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-xs bg-[#ba1a1a] hover:bg-[#ff5449] text-white shadow-sm transition-all cursor-pointer animate-pulse"
                        title="Stop generation"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>Stop</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleRun}
                        disabled={isGenerating || (!chatInput.trim() && attachedFiles.length === 0)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-xs bg-[#0b57d0] hover:bg-[#1a73e8] text-white shadow-sm transition-all cursor-pointer disabled:opacity-35"
                        title="Run model generation (Ctrl+Enter)"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Run</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mode B: Freeform Prompt Workspace */}
          {studioMode === 'freeform' && (
            <div className="flex-1 flex flex-col overflow-hidden p-3 sm:p-5 space-y-3 touch-scroll overflow-y-auto bg-[#131314]">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono text-[#8e918f]">
                  <span>Freeform Prompt Canvas</span>
                  <span>{Math.round(freeformContent.length / 4)} tokens</span>
                </div>
                <textarea
                  value={freeformContent}
                  onChange={(e) => setFreeformContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter your prompt here. You can insert test variables like {{variable}} and instructions freely..."
                  rows={8}
                  className="w-full bg-[#1e1f20] border border-[#3c4043] rounded-2xl p-4 text-base sm:text-xs text-[#e3e3e3] placeholder-[#8e918f] focus:outline-none focus:border-[#a8c7fa] resize-y leading-relaxed font-mono"
                />
              </div>

              <div className="flex justify-end gap-2">
                {isGenerating ? (
                  <button
                    onClick={handleStop}
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#ba1a1a] hover:bg-[#ff5449] text-white font-medium text-xs shadow-sm transition-all cursor-pointer animate-pulse"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop Freeform</span>
                  </button>
                ) : (
                  <button
                    onClick={handleRun}
                    disabled={isGenerating || !freeformContent.trim()}
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#0b57d0] hover:bg-[#1a73e8] text-white font-medium text-xs shadow-sm transition-all cursor-pointer disabled:opacity-35"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run (Ctrl+Enter)</span>
                  </button>
                )}
              </div>

              {freeformOutput && (
                <div className="mt-4 pt-4 border-t border-[#3c4043]">
                  <GoogleStudioOutput
                    text={freeformOutput.content}
                    thinking={freeformOutput.thinking}
                    modelName={selectedModel}
                    latencyMs={freeformOutput.latencyMs}
                    tokenCount={freeformOutput.tokenCount}
                    speedTokensPerSec={freeformOutput.speedTokensPerSec}
                    finishReason={freeformOutput.finishReason}
                    isStreaming={freeformOutput.isStreaming}
                  />
                </div>
              )}
            </div>
          )}

          {/* Mode C: Structured Prompt Workspace */}
          {studioMode === 'structured' && (
            <div className="flex-1 flex flex-col overflow-hidden p-3 sm:p-5 space-y-4 touch-scroll overflow-y-auto bg-[#131314]">
              {/* Field Configuration Header */}
              <div className="p-3.5 rounded-2xl bg-[#1e1f20] border border-[#3c4043] flex flex-col sm:flex-row items-center gap-3 justify-between">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-mono text-[#a8c7fa] font-bold">Input Field:</span>
                  <input
                    type="text"
                    value={structuredFields.input}
                    onChange={(e) => setStructuredFields({ ...structuredFields, input: e.target.value })}
                    className="bg-[#131314] border border-[#444746] rounded-lg px-2.5 py-1 text-xs text-[#e3e3e3] focus:outline-none focus:border-[#a8c7fa] flex-1 sm:w-36 font-mono"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-mono text-[#d0bcff] font-bold">Output Field:</span>
                  <input
                    type="text"
                    value={structuredFields.output}
                    onChange={(e) => setStructuredFields({ ...structuredFields, output: e.target.value })}
                    className="bg-[#131314] border border-[#444746] rounded-lg px-2.5 py-1 text-xs text-[#e3e3e3] focus:outline-none focus:border-[#d0bcff] flex-1 sm:w-36 font-mono"
                  />
                </div>
              </div>

              {/* Few-Shot Demonstrations */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#8e918f]">
                  <span>Examples ({structuredExamples.length} few-shot pairs)</span>
                  <button
                    onClick={() => setStructuredExamples([...structuredExamples, { id: `ex-${Date.now()}`, input: '', output: '' }])}
                    className="flex items-center gap-1 text-[#a8c7fa] hover:text-white cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Example</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {structuredExamples.map((ex, idx) => (
                    <div key={ex.id} className="p-3 rounded-2xl bg-[#1e1f20] border border-[#3c4043] space-y-2 relative group">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#8e918f]">
                        <span>Example #{idx + 1}</span>
                        {structuredExamples.length > 1 && (
                          <button
                            onClick={() => setStructuredExamples(structuredExamples.filter(item => item.id !== ex.id))}
                            className="hover:text-[#ff897d] text-[#8e918f] cursor-pointer"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <textarea
                          value={ex.input}
                          onChange={(e) => {
                            const copy = [...structuredExamples];
                            copy[idx].input = e.target.value;
                            setStructuredExamples(copy);
                          }}
                          placeholder={`Enter ${structuredFields.input}...`}
                          rows={2}
                          className="w-full bg-[#131314] border border-[#444746] rounded-xl p-2 text-base sm:text-xs text-[#e3e3e3] focus:outline-none focus:border-[#a8c7fa] font-mono resize-none"
                        />
                        <textarea
                          value={ex.output}
                          onChange={(e) => {
                            const copy = [...structuredExamples];
                            copy[idx].output = e.target.value;
                            setStructuredExamples(copy);
                          }}
                          placeholder={`Expected ${structuredFields.output}...`}
                          rows={2}
                          className="w-full bg-[#131314] border border-[#444746] rounded-xl p-2 text-base sm:text-xs text-[#e3e3e3] focus:outline-none focus:border-[#d0bcff] font-mono resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Test Case Execution Section */}
              <div className="space-y-2 pt-2 border-t border-[#3c4043]">
                <div className="text-xs font-mono text-[#c4c7c5] font-bold">Test Case:</div>
                <textarea
                  value={structuredTestInput}
                  onChange={(e) => setStructuredTestInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Enter test ${structuredFields.input} to evaluate...`}
                  rows={3}
                  className="w-full bg-[#1e1f20] border border-[#3c4043] rounded-xl p-3 text-base sm:text-xs text-[#e3e3e3] focus:outline-none focus:border-[#a8c7fa] font-mono"
                />

                <div className="flex justify-end gap-2">
                  {isGenerating ? (
                    <button
                      onClick={handleStop}
                      className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#ba1a1a] hover:bg-[#ff5449] text-white font-medium text-xs shadow-sm transition-all cursor-pointer animate-pulse"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Stop Structured</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleRun}
                      disabled={isGenerating || !structuredTestInput.trim()}
                      className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#0b57d0] hover:bg-[#1a73e8] text-white font-medium text-xs shadow-sm transition-all cursor-pointer disabled:opacity-35"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Run Structured (Ctrl+Enter)</span>
                    </button>
                  )}
                </div>
              </div>

              {structuredOutput && (
                <div className="mt-4 pt-4 border-t border-[#3c4043]">
                  <GoogleStudioOutput
                    text={structuredOutput.content}
                    thinking={structuredOutput.thinking}
                    modelName={selectedModel}
                    latencyMs={structuredOutput.latencyMs}
                    tokenCount={structuredOutput.tokenCount}
                    speedTokensPerSec={structuredOutput.speedTokensPerSec}
                    finishReason={structuredOutput.finishReason}
                    isStreaming={structuredOutput.isStreaming}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Run Settings Sidebar (Docked on lg+ screens - Google AI Studio Material 3 Dark theme) */}
        <div className="hidden lg:flex w-72 xl:w-80 flex-col bg-[#1e1f20] border-l border-[#3c4043] overflow-y-auto p-4 space-y-4 shrink-0 text-xs font-sans">
          <div className="flex items-center justify-between border-b border-[#3c4043] pb-2.5">
            <div className="flex items-center gap-2 text-[#e3e3e3] font-medium text-sm">
              <Sliders className="w-4 h-4 text-[#a8c7fa]" />
              <span>Run settings</span>
            </div>
            <div className="text-[11px] text-[#a8c7fa] font-mono font-medium">Gemini 2.5</div>
          </div>

          {/* Model Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] text-[#c4c7c5] font-medium">Model</label>
            <div className="relative">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-[#131314] border border-[#444746] rounded-xl p-2.5 text-xs text-[#e3e3e3] focus:outline-none focus:border-[#a8c7fa] cursor-pointer appearance-none font-sans"
              >
                {OFFICIAL_GEMINI_MODELS.map(m => (
                  <option key={m.id} value={m.id} className="bg-[#1e1f20] text-[#e3e3e3]">
                    {m.name} ({m.badge})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#8e918f] absolute right-3 top-3 pointer-events-none" />
            </div>
            <p className="text-[10px] text-[#8e918f] leading-tight">
              {OFFICIAL_GEMINI_MODELS.find(m => m.id === selectedModel)?.desc}
            </p>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#c4c7c5] font-medium">Temperature</span>
              <span className="text-[#a8c7fa] font-mono font-medium">{temperature}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-[#0b57d0] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#8e918f]">
              <span>Precise (0.0)</span>
              <span>Balanced (1.0)</span>
              <span>Creative (2.0)</span>
            </div>
          </div>

          {/* Top P Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#c4c7c5] font-medium">Top P</span>
              <span className="text-[#a8c7fa] font-mono font-medium">{topP}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={topP}
              onChange={(e) => setTopP(parseFloat(e.target.value))}
              className="w-full accent-[#0b57d0] cursor-pointer"
            />
          </div>

          {/* Top K Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#c4c7c5] font-medium">Top K</span>
              <span className="text-[#a8c7fa] font-mono font-medium">{topK}</span>
            </div>
            <input
              type="range"
              min="1"
              max="64"
              step="1"
              value={topK}
              onChange={(e) => setTopK(parseInt(e.target.value))}
              className="w-full accent-[#0b57d0] cursor-pointer"
            />
          </div>

          {/* Max Output Tokens */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#c4c7c5] font-medium">Max Output Tokens</span>
              <span className="text-[#a8c7fa] font-mono font-medium">{maxOutputTokens}</span>
            </div>
            <input
              type="range"
              min="256"
              max="16384"
              step="256"
              value={maxOutputTokens}
              onChange={(e) => setMaxOutputTokens(parseInt(e.target.value))}
              className="w-full accent-[#0b57d0] cursor-pointer"
            />
          </div>

          {/* Thinking Budget Box */}
          <div className="p-3 rounded-2xl bg-[#131314] border border-[#3c4043] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#e3e3e3]">Thinking process</span>
              <input
                type="checkbox"
                checked={enableThinking}
                onChange={(e) => setEnableThinking(e.target.checked)}
                className="accent-[#0b57d0] w-4 h-4 cursor-pointer"
              />
            </div>
            {enableThinking && (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[10px] text-[#8e918f]">
                  <span>Thinking Budget</span>
                  <span className="text-[#a8c7fa] font-mono">{thinkingBudget} tokens</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="16384"
                  step="512"
                  value={thinkingBudget}
                  onChange={(e) => setThinkingBudget(parseInt(e.target.value))}
                  className="w-full accent-[#0b57d0] cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Tools Toggles */}
          <div className="space-y-2 pt-1 border-t border-[#3c4043]">
            <label className="text-[11px] text-[#c4c7c5] font-medium uppercase tracking-wider">Tools & Extensions</label>
            
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#131314] border border-[#444746]">
              <span className="text-xs text-[#e3e3e3]">Google Search Grounding</span>
              <input
                type="checkbox"
                checked={enableSearchGrounding}
                onChange={(e) => setEnableSearchGrounding(e.target.checked)}
                className="accent-[#0b57d0] w-3.5 h-3.5 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#131314] border border-[#444746]">
              <span className="text-xs text-[#e3e3e3]">Code Execution Sandbox</span>
              <input
                type="checkbox"
                checked={enableCodeExecution}
                onChange={(e) => setEnableCodeExecution(e.target.checked)}
                className="accent-[#0b57d0] w-3.5 h-3.5 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#131314] border border-[#444746]">
              <span className="text-xs text-[#e3e3e3]">JSON Schema Output</span>
              <input
                type="checkbox"
                checked={enableJsonMode}
                onChange={(e) => setEnableJsonMode(e.target.checked)}
                className="accent-[#0b57d0] w-3.5 h-3.5 cursor-pointer"
              />
            </div>
          </div>

          {/* Safety Settings */}
          <div className="space-y-1.5 pt-1 border-t border-[#3c4043]">
            <div className="flex items-center gap-1 text-[11px] text-[#c4c7c5] font-medium">
              <Shield className="w-3.5 h-3.5 text-[#a8c7fa]" />
              <span>Safety Settings</span>
            </div>
            <select
              value={safetyThreshold}
              onChange={(e) => setSafetyThreshold(e.target.value)}
              className="w-full bg-[#131314] border border-[#444746] rounded-xl p-2 text-xs text-[#e3e3e3] focus:outline-none"
            >
              <option value="BLOCK_NONE">Block None (Developer Full Freedom)</option>
              <option value="BLOCK_FEW">Block Few (High threshold)</option>
              <option value="BLOCK_SOME">Block Some (Standard filter)</option>
            </select>
          </div>

          {/* Context Window Usage Meter */}
          <div className="p-3 rounded-2xl bg-[#131314] border border-[#3c4043] space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#c4c7c5] font-medium">Context Window</span>
              <span className="text-[#a8c7fa] font-mono font-medium">{contextPercentage}%</span>
            </div>
            <div className="w-full bg-[#282a2c] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#4285F4] to-[#9B72CF] h-full transition-all duration-300"
                style={{ width: `${Math.max(1, contextPercentage)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#8e918f] font-mono">
              <span>{currentTokenCount.toLocaleString()} tokens</span>
              <span>{maxModelContext.toLocaleString()} tokens</span>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Google Gemini API Key Modal (Official Google AI Studio Flow) */}
      {isApiKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#1e1f20] border border-[#3c4043] rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#3c4043] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#282a2c] text-[#a8c7fa]">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Google AI Studio API Key</h3>
                  <p className="text-[11px] text-[#8e918f]">Direct connection to Gemini API</p>
                </div>
              </div>
              <button 
                onClick={() => setIsApiKeyModalOpen(false)}
                className="p-1 rounded-lg text-[#8e918f] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-[#c4c7c5] leading-relaxed">
              <p>
                Get a free API key with 1,000,000+ token context window directly from Google:
              </p>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#a8c7fa] hover:underline font-medium"
              >
                <span>Get API key from Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-[#c4c7c5] font-medium">Gemini API Key (starts with AIzaSy...):</label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-[#131314] border border-[#444746] rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#a8c7fa]"
              />
            </div>

            {verifyStatus && (
              <div className={`p-2.5 rounded-xl text-xs font-mono flex items-center gap-2 ${
                verifyStatus.success ? 'bg-[#7adaa2]/15 text-[#7adaa2] border border-[#7adaa2]/30' : 'bg-[#ff897d]/15 text-[#ff897d] border border-[#ff897d]/30'
              }`}>
                {verifyStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
                <span>{verifyStatus.message}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              {hasDirectKey ? (
                <button
                  onClick={handleClearApiKey}
                  className="text-xs text-[#ff897d] hover:underline cursor-pointer"
                >
                  Clear Key & Use Free Gateway
                </button>
              ) : (
                <span className="text-[11px] text-[#8e918f]">Free Neural Gateway Active</span>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsApiKeyModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-[#c4c7c5] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveApiKey}
                  disabled={isVerifyingKey || !apiKeyInput.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0b57d0] hover:bg-[#1a73e8] text-white text-xs font-medium cursor-pointer disabled:opacity-40"
                >
                  {isVerifyingKey ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{isVerifyingKey ? 'Verifying...' : 'Save Key'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Slide-Up Run Settings Bottom Sheet Drawer (< lg screens) */}
      {isMobileSettingsOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div 
            onClick={() => setIsMobileSettingsOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          />

          <div className="relative z-10 w-full max-h-[85vh] bg-[#1e1f20] border-t border-[#3c4043] rounded-t-3xl p-5 overflow-y-auto space-y-4 shadow-2xl animate-fadeIn text-xs font-sans">
            <div className="w-12 h-1 bg-[#444746] rounded-full mx-auto mb-2" />

            <div className="flex items-center justify-between border-b border-[#3c4043] pb-2">
              <div className="flex items-center gap-2 text-[#e3e3e3] font-medium text-sm">
                <Sliders className="w-4 h-4 text-[#a8c7fa]" />
                <span>Run settings</span>
              </div>
              <button
                onClick={() => setIsMobileSettingsOpen(false)}
                className="p-1 rounded-lg text-[#8e918f] hover:text-[#e3e3e3]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-[#c4c7c5] font-medium">Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-[#131314] border border-[#444746] rounded-xl p-3 text-sm text-[#e3e3e3] focus:outline-none font-sans"
              >
                {OFFICIAL_GEMINI_MODELS.map(m => (
                  <option key={m.id} value={m.id} className="bg-[#1e1f20] text-[#e3e3e3]">
                    {m.name} ({m.badge})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#c4c7c5]">Temperature: {temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-[#0b57d0] cursor-pointer h-2"
              />
            </div>

            <div className="p-3 rounded-2xl bg-[#131314] border border-[#3c4043] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#e3e3e3]">Thinking process</span>
                <input
                  type="checkbox"
                  checked={enableThinking}
                  onChange={(e) => setEnableThinking(e.target.checked)}
                  className="accent-[#0b57d0] w-5 h-5 cursor-pointer"
                />
              </div>
              {enableThinking && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-[#8e918f]">
                    <span>Budget: {thinkingBudget} tokens</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="16384"
                    step="512"
                    value={thinkingBudget}
                    onChange={(e) => setThinkingBudget(parseInt(e.target.value))}
                    className="w-full accent-[#0b57d0] h-2"
                  />
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMobileSettingsOpen(false)}
              className="w-full py-3 rounded-xl bg-[#0b57d0] hover:bg-[#1a73e8] text-white font-medium text-sm transition-all"
            >
              Apply Settings
            </button>
          </div>
        </div>
      )}

      {/* <> Get Code Export Modal */}
      {isGetCodeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#1e1f20] border border-[#3c4043] rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-fadeIn">
            <div className="p-4 bg-[#1e1f20] border-b border-[#3c4043] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#282a2c] text-[#a8c7fa]">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-medium text-[#e3e3e3] text-sm">Get code</h3>
                  <p className="text-[11px] text-[#8e918f] font-sans">Export prompt to official Google GenAI SDKs</p>
                </div>
              </div>
              <button
                onClick={() => setIsGetCodeOpen(false)}
                className="p-1.5 rounded-xl hover:bg-[#282a2c] text-[#8e918f] hover:text-[#e3e3e3] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-4 py-2 bg-[#131314] border-b border-[#3c4043] flex items-center gap-1 overflow-x-auto no-scrollbar">
              {[
                { id: 'python', label: 'Python (google-genai)' },
                { id: 'javascript', label: 'JavaScript (@google/genai)' },
                { id: 'curl', label: 'cURL' },
                { id: 'swift', label: 'Swift' },
                { id: 'kotlin', label: 'Kotlin (Android)' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setCodeLanguage(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                    codeLanguage === tab.id
                      ? 'bg-[#282a2c] text-[#a8c7fa] font-medium border border-[#444746]'
                      : 'text-[#8e918f] hover:text-[#e3e3e3]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 p-4 bg-[#131314] overflow-x-auto text-xs font-mono text-[#e3e3e3] selection:bg-[#004a77]">
              <pre className="m-0 whitespace-pre-wrap leading-relaxed font-mono">
                <code>{generateSdkCode()}</code>
              </pre>
            </div>

            <div className="p-3.5 bg-[#1e1f20] border-t border-[#3c4043] flex items-center justify-between">
              <span className="text-[11px] text-[#8e918f] font-sans">
                Official Google GenAI SDK configured for <strong className="text-[#e3e3e3]">{selectedModel}</strong>
              </span>
              <button
                onClick={handleCopyCodeSnippet}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0b57d0] hover:bg-[#1a73e8] text-white font-medium text-xs transition-all cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied code!' : 'Copy code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
