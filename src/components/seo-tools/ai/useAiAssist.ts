import { useState, useCallback, useRef, useEffect } from 'react';
import {
  AI_MODEL_ID,
  STORAGE_KEYS,
  SCHEMA_SYSTEM_PROMPT,
  LLMS_SYSTEM_PROMPT,
  SCHEMA_USER_PROMPT_TEMPLATE,
  LLMS_USER_PROMPT_TEMPLATE,
  type AiTool,
  type AiState,
  type AiSupportStatus,
} from './constants';

interface UseAiAssistReturn {
  state: AiState;
  progress: number;
  progressText: string;
  error: string | null;
  supportStatus: AiSupportStatus;
  hasConsent: boolean | null;
  dontAskAgain: boolean;

  checkSupport: () => Promise<AiSupportStatus>;
  loadModel: () => Promise<boolean>;
  generate: (input: string, tool: AiTool) => Promise<string | null>;
  unload: () => void;
  setConsent: (granted: boolean, remember: boolean) => void;
  resetConsent: () => void;
}

// Singleton engine reference to avoid reloading
let engineInstance: any = null;
let engineLoading = false;

export function useAiAssist(): UseAiAssistReturn {
  const [state, setState] = useState<AiState>('idle');
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [supportStatus, setSupportStatus] = useState<AiSupportStatus>({
    supported: false,
  });
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);
  const [dontAskAgain, setDontAskAgain] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Load consent state from localStorage
  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEYS.consent);
    const dontAsk = localStorage.getItem(STORAGE_KEYS.dontAskAgain);

    if (consent === 'granted') {
      setHasConsent(true);
    } else if (consent === 'denied') {
      setHasConsent(false);
    }

    setDontAskAgain(dontAsk === 'true');

    // If we already have an engine loaded, set state to ready
    if (engineInstance) {
      setState('ready');
    }
  }, []);

  const checkSupport = useCallback(async (): Promise<AiSupportStatus> => {
    // Check WebGPU support
    if (typeof navigator === 'undefined' || !navigator.gpu) {
      const status = {
        supported: false,
        reason: 'WebGPU is not available in this browser',
      };
      setSupportStatus(status);
      return status;
    }

    try {
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        const status = {
          supported: false,
          reason: 'No WebGPU adapter found',
        };
        setSupportStatus(status);
        return status;
      }

      // Check device memory (Chrome/Edge only)
      const memory = (navigator as any).deviceMemory;
      const hasLowMemory = memory && memory < 8;

      const status: AiSupportStatus = {
        supported: true,
        hasLowMemory,
        reason: hasLowMemory
          ? 'Low memory detected - performance may be affected'
          : undefined,
      };
      setSupportStatus(status);
      return status;
    } catch {
      const status = {
        supported: false,
        reason: 'Failed to initialize WebGPU',
      };
      setSupportStatus(status);
      return status;
    }
  }, []);

  const loadModel = useCallback(async (): Promise<boolean> => {
    // If already loaded, return immediately
    if (engineInstance) {
      setState('ready');
      return true;
    }

    // If another load is in progress, wait for it
    if (engineLoading) {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (engineInstance) {
            clearInterval(checkInterval);
            setState('ready');
            resolve(true);
          } else if (!engineLoading) {
            clearInterval(checkInterval);
            resolve(false);
          }
        }, 100);
      });
    }

    engineLoading = true;
    setState('loading');
    setProgress(0);
    setProgressText('Initializing...');
    setError(null);

    abortControllerRef.current = new AbortController();

    try {
      // Dynamic import to avoid loading WebLLM until needed
      const { CreateMLCEngine } = await import('@mlc-ai/web-llm');

      const engine = await CreateMLCEngine(AI_MODEL_ID, {
        initProgressCallback: (report) => {
          const progressValue = Math.round(report.progress * 100);
          setProgress(progressValue);
          setProgressText(report.text || `Loading... ${progressValue}%`);
        },
      });

      engineInstance = engine;
      engineLoading = false;
      setState('ready');
      localStorage.setItem(STORAGE_KEYS.modelCached, 'true');
      return true;
    } catch (err) {
      engineLoading = false;
      const message =
        err instanceof Error ? err.message : 'Failed to load AI model';
      setError(message);
      setState('error');
      return false;
    }
  }, []);

  const generate = useCallback(
    async (input: string, tool: AiTool): Promise<string | null> => {
      if (!engineInstance) {
        setError('AI model not loaded');
        return null;
      }

      setState('generating');
      setError(null);

      const systemPrompt =
        tool === 'schema' ? SCHEMA_SYSTEM_PROMPT : LLMS_SYSTEM_PROMPT;
      const userPromptTemplate =
        tool === 'schema'
          ? SCHEMA_USER_PROMPT_TEMPLATE
          : LLMS_USER_PROMPT_TEMPLATE;
      const userPrompt = userPromptTemplate.replace('{input}', input);

      try {
        const response = await engineInstance.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 2048,
        });

        setState('ready');

        const content = response.choices[0]?.message?.content;
        if (!content) {
          setError('No response from AI');
          return null;
        }

        // Clean up the response - remove markdown code blocks if present
        let cleanedContent = content.trim();
        if (cleanedContent.startsWith('```json')) {
          cleanedContent = cleanedContent.slice(7);
        } else if (cleanedContent.startsWith('```')) {
          cleanedContent = cleanedContent.slice(3);
        }
        if (cleanedContent.endsWith('```')) {
          cleanedContent = cleanedContent.slice(0, -3);
        }

        return cleanedContent.trim();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'AI generation failed';
        setError(message);
        setState('ready');
        return null;
      }
    },
    []
  );

  const unload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    // Note: WebLLM doesn't have an explicit unload method
    // The model stays cached in IndexedDB for future use
    setState('idle');
    setProgress(0);
    setProgressText('');
  }, []);

  const setConsent = useCallback((granted: boolean, remember: boolean) => {
    setHasConsent(granted);
    setDontAskAgain(remember);

    if (remember) {
      localStorage.setItem(
        STORAGE_KEYS.consent,
        granted ? 'granted' : 'denied'
      );
      localStorage.setItem(STORAGE_KEYS.dontAskAgain, 'true');
    }
  }, []);

  const resetConsent = useCallback(() => {
    setHasConsent(null);
    setDontAskAgain(false);
    localStorage.removeItem(STORAGE_KEYS.consent);
    localStorage.removeItem(STORAGE_KEYS.dontAskAgain);
  }, []);

  return {
    state,
    progress,
    progressText,
    error,
    supportStatus,
    hasConsent,
    dontAskAgain,
    checkSupport,
    loadModel,
    generate,
    unload,
    setConsent,
    resetConsent,
  };
}
