import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CodeEditor,
  CodePreview,
  ValidationResult,
  Tabs,
  TabPanel,
  Button,
  Input,
  Select,
  Badge,
  DownloadButton,
} from '../shared';
import { parseRobotsTxt, testUrl, validateRobotsTxt } from '@/lib/seo-tools/services';
import {
  ROBOTS_USER_AGENTS,
  ROBOTS_USER_AGENT_CATEGORIES,
  ROBOTS_TEMPLATES,
} from '@/lib/seo-tools/constants';
import type {
  RobotsParsedFile,
  RobotsValidationResult,
  UrlTestResult,
} from '@/lib/seo-tools/types';

const STORAGE_KEY = 'aicw-robots-content';

export function RobotsTester() {
  // State
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState('validation');
  const [testUrlValue, setTestUrlValue] = useState('');
  const [selectedBot, setSelectedBot] = useState('googlebot');
  const [urlTestResults, setUrlTestResults] = useState<UrlTestResult[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setContent(saved);
    } else {
      // Load default template
      setContent(ROBOTS_TEMPLATES[0].content);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (content) {
      localStorage.setItem(STORAGE_KEY, content);
    }
  }, [content]);

  // Parse and validate
  const parsed: RobotsParsedFile | null = useMemo(() => {
    if (!content.trim()) return null;
    return parseRobotsTxt(content);
  }, [content]);

  const validation: RobotsValidationResult | null = useMemo(() => {
    if (!parsed) return null;
    return validateRobotsTxt(parsed);
  }, [parsed]);

  const errorLines = useMemo(() => {
    if (!validation) return [];
    return validation.errors.filter((e) => e.line).map((e) => e.line!);
  }, [validation]);

  // Handlers
  const handleTemplateSelect = useCallback((templateId: string) => {
    const template = ROBOTS_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setContent(template.content);
    }
  }, []);

  const handleTestUrl = useCallback(() => {
    if (!parsed || !testUrlValue.trim()) return;

    const bot = ROBOTS_USER_AGENTS.find((b) => b.id === selectedBot);
    if (!bot) return;

    const result = testUrl(parsed, testUrlValue, bot.pattern);
    setUrlTestResults((prev) => [result, ...prev.slice(0, 9)]);
    setTestUrlValue('');
  }, [parsed, testUrlValue, selectedBot]);

  const handleTestAllBots = useCallback(() => {
    if (!parsed || !testUrlValue.trim()) return;

    const results = ROBOTS_USER_AGENTS.map((bot) =>
      testUrl(parsed, testUrlValue, bot.pattern)
    );
    setUrlTestResults(results);
  }, [parsed, testUrlValue]);

  const handleClearResults = useCallback(() => {
    setUrlTestResults([]);
  }, []);

  const tabs = [
    { id: 'validation', label: 'Validation', badge: validation?.errors.length },
    { id: 'url-test', label: 'Test URL' },
    { id: 'bot-test', label: 'Test Bots' },
  ];

  const botOptions = ROBOTS_USER_AGENTS.map((bot) => ({
    value: bot.id,
    label: `${bot.name} (${bot.pattern})`,
  }));

  const templateOptions = ROBOTS_TEMPLATES.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Editor */}
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <Select
            options={templateOptions}
            value=""
            onChange={(e) => handleTemplateSelect(e.target.value)}
            placeholder="Load template..."
            className="w-48"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setContent('')}
          >
            Clear
          </Button>
          <div className="ml-auto">
            <DownloadButton
              content={content}
              filename="robots.txt"
              mimeType="text/plain"
              size="sm"
              label="Download"
            />
          </div>
        </div>

        {/* Editor */}
        <CodeEditor
          value={content}
          onChange={setContent}
          language="robots.txt"
          placeholder="Paste your robots.txt content here..."
          errorLines={errorLines}
          minHeight="400px"
          maxHeight="600px"
        />

        {/* Stats */}
        {validation && (
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>{validation.stats.lineCount} lines</span>
            <span>{validation.stats.userAgentCount} user agents</span>
            <span>{validation.stats.ruleCount} rules</span>
            <span>{validation.stats.sitemapCount} sitemaps</span>
            <span>{Math.round(validation.stats.fileSize / 1024)}KB</span>
          </div>
        )}
      </div>

      {/* Right Column - Results */}
      <div className="space-y-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* Validation Tab */}
        <TabPanel isActive={activeTab === 'validation'} className="pt-4">
          {validation ? (
            <ValidationResult
              isValid={validation.isValid}
              errors={validation.errors}
              warnings={validation.warnings}
            />
          ) : (
            <div className="text-center py-12 text-gray-500">
              Enter robots.txt content to validate
            </div>
          )}
        </TabPanel>

        {/* URL Test Tab */}
        <TabPanel isActive={activeTab === 'url-test'} className="pt-4 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                value={testUrlValue}
                onChange={(e) => setTestUrlValue(e.target.value)}
                placeholder="/path/to/page or https://example.com/page"
                onKeyDown={(e) => e.key === 'Enter' && handleTestUrl()}
              />
            </div>
            <Select
              options={botOptions}
              value={selectedBot}
              onChange={(e) => setSelectedBot(e.target.value)}
              className="w-56"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleTestUrl} disabled={!testUrlValue.trim()}>
              Test URL
            </Button>
            <Button
              variant="outline"
              onClick={handleTestAllBots}
              disabled={!testUrlValue.trim()}
            >
              Test All Bots
            </Button>
            {urlTestResults.length > 0 && (
              <Button variant="ghost" onClick={handleClearResults}>
                Clear Results
              </Button>
            )}
          </div>

          {/* Results */}
          {urlTestResults.length > 0 && (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {urlTestResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.isAllowed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={result.isAllowed ? 'success' : 'error'}>
                        {result.isAllowed ? 'Allowed' : 'Blocked'}
                      </Badge>
                      <span className="font-medium text-gray-900">
                        {result.userAgent}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 truncate max-w-[200px]">
                      {result.url}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{result.reason}</p>
                </div>
              ))}
            </div>
          )}
        </TabPanel>

        {/* Bot Test Tab */}
        <TabPanel isActive={activeTab === 'bot-test'} className="pt-4">
          <div className="space-y-6">
            {ROBOTS_USER_AGENT_CATEGORIES.map((category) => {
              const bots = ROBOTS_USER_AGENTS.filter(
                (b) => b.category === category.id
              );
              return (
                <div key={category.id}>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    {category.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {bots.map((bot) => {
                      const result = parsed
                        ? testUrl(parsed, '/', bot.pattern)
                        : null;
                      return (
                        <div
                          key={bot.id}
                          className={`p-2 rounded border text-sm ${
                            result
                              ? result.isAllowed
                                ? 'bg-green-50 border-green-200'
                                : 'bg-red-50 border-red-200'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{bot.name}</span>
                            {result && (
                              <Badge
                                variant={result.isAllowed ? 'success' : 'error'}
                              >
                                {result.isAllowed ? 'OK' : 'X'}
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {bot.pattern}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </TabPanel>
      </div>
    </div>
  );
}
