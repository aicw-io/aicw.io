import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CodePreview,
  Button,
  Input,
  Textarea,
  Select,
  ValidationResult,
  DownloadButton,
} from '../shared';
import { AiAssistBanner } from '../ai';
import {
  generateLlmsTxt,
  validateLlmsData,
  createLlmsLink,
  createEmptyLlmsData,
} from '@/lib/seo-tools/services';
import {
  LLMS_SECTIONS,
  LLMS_LINK_CATEGORIES,
  LLMS_TEMPLATES,
} from '@/lib/seo-tools/constants';
import type { LlmsData, LlmsSectionData, LlmsLink } from '@/lib/seo-tools/types';

const STORAGE_KEY = 'aicw-llms-data';

export function LlmsGenerator() {
  const [data, setData] = useState<LlmsData>(createEmptyLlmsData());
  const [newLinkName, setNewLinkName] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkCategory, setNewLinkCategory] = useState('primary');
  const [aiGeneratedContent, setAiGeneratedContent] = useState<string | null>(null);

  // Handle AI-generated llms.txt content
  const handleAiGenerate = useCallback((result: string) => {
    setAiGeneratedContent(result);
  }, []);

  // Clear AI-generated content
  const clearAiContent = useCallback(() => {
    setAiGeneratedContent(null);
  }, []);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Generate output
  const output = useMemo(() => generateLlmsTxt(data), [data]);
  const validation = useMemo(() => validateLlmsData(data), [data]);

  // Handlers
  const handleTemplateSelect = useCallback((templateId: string) => {
    const template = LLMS_TEMPLATES.find((t) => t.id === templateId);
    if (template && template.data) {
      setData({
        title: template.data.title || '',
        tagline: template.data.tagline || '',
        url: template.data.url || '',
        overview: template.data.overview || '',
        sections: (template.data.sections || []).map((s) => ({
          ...s,
          id: s.id || crypto.randomUUID(),
        })),
        links: (template.data.links || []).map((l) => ({
          ...l,
          id: l.id || crypto.randomUUID(),
        })),
      });
      setAiGeneratedContent(null);
    }
  }, []);

  const handleAddLink = useCallback(() => {
    if (!newLinkName.trim() || !newLinkUrl.trim()) return;

    const link = createLlmsLink(newLinkName.trim(), newLinkUrl.trim(), {
      category: newLinkCategory,
    });
    link.order = data.links.length;

    setData((prev) => ({
      ...prev,
      links: [...prev.links, link],
    }));
    setNewLinkName('');
    setNewLinkUrl('');
  }, [newLinkName, newLinkUrl, newLinkCategory, data.links.length]);

  const handleRemoveLink = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      links: prev.links.filter((l) => l.id !== id),
    }));
  }, []);

  const handleUpdateLink = useCallback(
    (id: string, field: keyof LlmsLink, value: string) => {
      setData((prev) => ({
        ...prev,
        links: prev.links.map((l) =>
          l.id === id ? { ...l, [field]: value } : l
        ),
      }));
    },
    []
  );

  const handleAddSection = useCallback((sectionId: string) => {
    const sectionDef = LLMS_SECTIONS.find((s) => s.id === sectionId);
    if (!sectionDef) return;

    const newSection: LlmsSectionData = {
      id: crypto.randomUUID(),
      name: sectionDef.name,
      content: '',
      order: data.sections.length,
      enabled: true,
    };

    setData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  }, [data.sections.length]);

  const handleRemoveSection = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== id),
    }));
  }, []);

  const handleUpdateSection = useCallback(
    (id: string, field: keyof LlmsSectionData, value: string | boolean) => {
      setData((prev) => ({
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === id ? { ...s, [field]: value } : s
        ),
      }));
    },
    []
  );

  const handleClear = useCallback(() => {
    if (confirm('Are you sure you want to clear all data?')) {
      setData(createEmptyLlmsData());
      setAiGeneratedContent(null);
    }
  }, []);

  const templateOptions = LLMS_TEMPLATES.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const categoryOptions = LLMS_LINK_CATEGORIES.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const availableSections = LLMS_SECTIONS.filter(
    (s) => !data.sections.some((ds) => ds.name === s.name)
  );

  return (
    <div className="space-y-6">
      {/* AI Assist Banner */}
      <AiAssistBanner tool="llms" onGenerate={handleAiGenerate} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - Form */}
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <Select
            options={templateOptions}
            value=""
            onChange={(e) => handleTemplateSelect(e.target.value)}
            placeholder="Load template..."
            className="w-48"
          />
          <Button variant="outline" size="sm" onClick={handleClear}>
            Clear All
          </Button>
        </div>

        {/* Site Info */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
          <h3 className="font-semibold text-gray-900">Site Information</h3>
          <Input
            label="Title *"
            value={data.title}
            onChange={(e) => setData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Your Site Name"
          />
          <Input
            label="Tagline"
            value={data.tagline || ''}
            onChange={(e) => setData((prev) => ({ ...prev, tagline: e.target.value }))}
            placeholder="A brief tagline"
          />
          <Input
            label="URL"
            value={data.url || ''}
            onChange={(e) => setData((prev) => ({ ...prev, url: e.target.value }))}
            placeholder="https://example.com"
          />
        </div>

        {/* Overview */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
          <h3 className="font-semibold text-gray-900">Overview *</h3>
          <Textarea
            value={data.overview}
            onChange={(e) => setData((prev) => ({ ...prev, overview: e.target.value }))}
            placeholder="A brief description of your site/project..."
            className="min-h-[150px]"
          />
          <div className="text-sm text-gray-500">
            {data.overview.length} characters
          </div>
        </div>

        {/* Links */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
          <h3 className="font-semibold text-gray-900">Quick Links</h3>

          {/* Add link form */}
          <div className="grid grid-cols-[1fr,1fr,auto,auto] gap-2 items-end">
            <Input
              value={newLinkName}
              onChange={(e) => setNewLinkName(e.target.value)}
              placeholder="Link name"
            />
            <Input
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              placeholder="https://..."
            />
            <Select
              options={categoryOptions}
              value={newLinkCategory}
              onChange={(e) => setNewLinkCategory(e.target.value)}
              className="w-36"
            />
            <Button onClick={handleAddLink} disabled={!newLinkName.trim() || !newLinkUrl.trim()}>
              Add
            </Button>
          </div>

          {/* Links list */}
          {data.links.length > 0 && (
            <div className="space-y-2">
              {data.links.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center gap-2 p-2 bg-white rounded border"
                >
                  <span className="flex-1 truncate text-sm">{link.name}</span>
                  <span className="text-xs text-gray-500 truncate max-w-[150px]">
                    {link.url}
                  </span>
                  <button
                    onClick={() => handleRemoveLink(link.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Custom Sections */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Custom Sections</h3>
            {availableSections.length > 0 && (
              <Select
                options={availableSections.map((s) => ({ value: s.id, label: s.name }))}
                value=""
                onChange={(e) => handleAddSection(e.target.value)}
                placeholder="Add section..."
                className="w-40"
              />
            )}
          </div>

          {data.sections.map((section) => (
            <div
              key={section.id}
              className="p-3 bg-white rounded border space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">{section.name}</span>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={section.enabled}
                      onChange={(e) =>
                        handleUpdateSection(section.id, 'enabled', e.target.checked)
                      }
                      className="rounded border-gray-300"
                    />
                    Enabled
                  </label>
                  <button
                    onClick={() => handleRemoveSection(section.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <Textarea
                value={section.content}
                onChange={(e) =>
                  handleUpdateSection(section.id, 'content', e.target.value)
                }
                placeholder={`Content for ${section.name}...`}
                className="min-h-[100px]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right Column - Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Preview</h3>
          <DownloadButton
            content={aiGeneratedContent || output}
            filename="llms.txt"
            mimeType="text/plain"
            label="Download llms.txt"
          />
        </div>

        {aiGeneratedContent ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-purple-700">
              <span>&#10024;</span>
              <span>AI Generated</span>
              <button
                onClick={clearAiContent}
                className="text-gray-500 hover:text-gray-700 text-xs underline ml-auto"
              >
                Clear
              </button>
            </div>
            <CodePreview
              code={aiGeneratedContent}
              language="txt"
              filename="llms.txt"
              showDownload={true}
            />
          </div>
        ) : (
          <>
            <ValidationResult
              isValid={validation.isValid}
              errors={validation.errors}
              warnings={validation.warnings}
            />

            <div className="text-sm text-gray-600">
              {validation.stats.wordCount} words | {validation.stats.characterCount} characters |{' '}
              {validation.stats.sectionCount} sections | {validation.stats.linkCount} links
            </div>

            <CodePreview
              code={output}
              language="txt"
              filename="llms.txt"
              showDownload={true}
            />
          </>
        )}
      </div>
      </div>
    </div>
  );
}
