import { useState } from 'react';
import { Button, Textarea } from '../shared';
import type { AiTool } from './constants';

interface AiAssistInputProps {
  tool: AiTool;
  isGenerating: boolean;
  onGenerate: (input: string) => void;
  onDisable: () => void;
}

const EXAMPLES: Record<AiTool, string> = {
  schema:
    'A blog post about React hooks best practices, written by Jane Doe, published today on our tech blog at example.com',
  llms:
    'A SaaS product called TaskFlow that helps teams manage projects. Main features are task boards, time tracking, and team collaboration. Website is taskflow.io',
};

const PLACEHOLDERS: Record<AiTool, string> = {
  schema: 'Describe your content (article, product, business, etc.)...',
  llms: 'Describe your website or product...',
};

export function AiAssistInput({
  tool,
  isGenerating,
  onGenerate,
  onDisable,
}: AiAssistInputProps) {
  const [input, setInput] = useState('');

  const handleGenerate = () => {
    if (input.trim()) {
      onGenerate(input.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey && input.trim()) {
      handleGenerate();
    }
  };

  return (
    <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">&#10024;</span>
          <span className="font-medium text-gray-900">AI Assist</span>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
            Beta
          </span>
        </div>
        <button
          onClick={onDisable}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Disable
        </button>
      </div>

      <div className="space-y-3">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={PLACEHOLDERS[tool]}
          className="min-h-[100px] bg-white"
          disabled={isGenerating}
        />

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Example: "{EXAMPLES[tool].slice(0, 60)}..."
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">&#8984;+Enter</span>
            <Button
              size="sm"
              onClick={handleGenerate}
              disabled={!input.trim() || isGenerating}
              className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin mr-2">&#9696;</span>
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
