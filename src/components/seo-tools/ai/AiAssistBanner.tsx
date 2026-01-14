import { useState, useEffect, useCallback } from 'react';
import { Button } from '../shared';
import { useAiAssist } from './useAiAssist';
import { AiConsentDialog } from './AiConsentDialog';
import { AiLoadingProgress } from './AiLoadingProgress';
import { AiAssistInput } from './AiAssistInput';
import type { AiTool, BannerState } from './constants';

interface AiAssistBannerProps {
  tool: AiTool;
  onGenerate: (result: string) => void;
}

export function AiAssistBanner({ tool, onGenerate }: AiAssistBannerProps) {
  const [bannerState, setBannerState] = useState<BannerState>('collapsed');
  const [dismissed, setDismissed] = useState(false);

  const {
    state: aiState,
    progress,
    progressText,
    error,
    supportStatus,
    hasConsent,
    checkSupport,
    loadModel,
    generate,
    unload,
    setConsent,
  } = useAiAssist();

  // Check support on mount
  useEffect(() => {
    checkSupport().then((status) => {
      if (!status.supported) {
        setBannerState('unsupported');
      } else if (hasConsent === true) {
        // User previously consented, check if model is already loaded
        if (aiState === 'ready') {
          setBannerState('ready');
        }
      }
    });
  }, [checkSupport, hasConsent, aiState]);

  // Sync banner state with AI state
  useEffect(() => {
    if (aiState === 'loading') {
      setBannerState('loading');
    } else if (aiState === 'ready') {
      setBannerState('ready');
    } else if (aiState === 'generating') {
      setBannerState('generating');
    } else if (aiState === 'error') {
      setBannerState('error');
    }
  }, [aiState]);

  const handleTryClick = useCallback(async () => {
    const status = await checkSupport();
    if (!status.supported) {
      setBannerState('unsupported');
      return;
    }

    // If user already consented and remembered, skip dialog
    if (hasConsent === true) {
      setBannerState('loading');
      await loadModel();
    } else {
      setBannerState('consent');
    }
  }, [checkSupport, hasConsent, loadModel]);

  const handleAcceptConsent = useCallback(
    async (dontAskAgain: boolean) => {
      setConsent(true, dontAskAgain);
      setBannerState('loading');
      const success = await loadModel();
      if (!success) {
        setBannerState('error');
      }
    },
    [setConsent, loadModel]
  );

  const handleCancelConsent = useCallback(() => {
    setBannerState('collapsed');
  }, []);

  const handleCancelLoading = useCallback(() => {
    unload();
    setBannerState('collapsed');
  }, [unload]);

  const handleGenerate = useCallback(
    async (input: string) => {
      const result = await generate(input, tool);
      if (result) {
        onGenerate(result);
      }
    },
    [generate, tool, onGenerate]
  );

  const handleDisable = useCallback(() => {
    setBannerState('collapsed');
  }, []);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
  }, []);

  const handleRetry = useCallback(async () => {
    setBannerState('loading');
    await loadModel();
  }, [loadModel]);

  // Don't render if dismissed
  if (dismissed) {
    return null;
  }

  // Collapsed state - simple banner
  if (bannerState === 'collapsed') {
    return (
      <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">&#10024;</span>
          <span className="text-sm text-gray-700">
            <strong>AI Assist:</strong> Describe your content in plain English
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleTryClick}
          className="border-purple-300 text-purple-700 hover:bg-purple-100"
        >
          Try
        </Button>
      </div>
    );
  }

  // Unsupported state
  if (bannerState === 'unsupported') {
    return (
      <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>&#9888;&#65039;</span>
          <span className="text-sm text-amber-800">
            <strong>AI Assist</strong> requires WebGPU (Chrome/Edge 113+).{' '}
            {supportStatus.reason}
          </span>
        </div>
        <button
          onClick={handleDismiss}
          className="text-amber-600 hover:text-amber-800"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    );
  }

  // Error state
  if (bannerState === 'error') {
    return (
      <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>&#10060;</span>
            <span className="text-sm text-red-800">
              {error || 'Something went wrong. Please try again.'}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRetry}
              className="border-red-300 text-red-700"
            >
              Retry
            </Button>
            <button
              onClick={handleDismiss}
              className="text-red-600 hover:text-red-800"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Consent dialog
  if (bannerState === 'consent') {
    return (
      <div className="mb-4">
        <AiConsentDialog
          onAccept={handleAcceptConsent}
          onCancel={handleCancelConsent}
          hasLowMemory={supportStatus.hasLowMemory}
        />
      </div>
    );
  }

  // Loading state
  if (bannerState === 'loading') {
    return (
      <div className="mb-4">
        <AiLoadingProgress
          progress={progress}
          progressText={progressText}
          onCancel={handleCancelLoading}
        />
      </div>
    );
  }

  // Ready/Generating state
  if (bannerState === 'ready' || bannerState === 'generating') {
    return (
      <div className="mb-4">
        <AiAssistInput
          tool={tool}
          isGenerating={bannerState === 'generating'}
          onGenerate={handleGenerate}
          onDisable={handleDisable}
        />
      </div>
    );
  }

  return null;
}
