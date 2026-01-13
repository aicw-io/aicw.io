import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  CodePreview,
  Button,
  Input,
  Select,
  Badge,
  DownloadButton,
  Alert,
} from '../shared';
import {
  generateSitemapXml,
  createSitemapUrl,
} from '@/lib/seo-tools/services';
import {
  SITEMAP_CHANGE_FREQUENCIES,
  SITEMAP_PRIORITY_OPTIONS,
  SITEMAP_DEFAULTS,
  SITEMAP_LIMITS,
} from '@/lib/seo-tools/constants';
import type { SitemapUrl, ChangeFrequency, Priority } from '@/lib/seo-tools/types';

const STORAGE_KEY = 'aicw-sitemap-urls';

export function SitemapGenerator() {
  // State
  const [urls, setUrls] = useState<SitemapUrl[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [bulkUrls, setBulkUrls] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);

  // Settings
  const [defaultPriority, setDefaultPriority] = useState<Priority>(SITEMAP_DEFAULTS.PRIORITY);
  const [defaultChangefreq, setDefaultChangefreq] = useState<ChangeFrequency>(SITEMAP_DEFAULTS.CHANGE_FREQUENCY);
  const [includePriority, setIncludePriority] = useState(SITEMAP_DEFAULTS.INCLUDE_PRIORITY);
  const [includeChangefreq, setIncludeChangefreq] = useState(SITEMAP_DEFAULTS.INCLUDE_CHANGEFREQ);
  const [includeLastmod, setIncludeLastmod] = useState(SITEMAP_DEFAULTS.INCLUDE_LASTMOD);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setUrls(JSON.parse(saved));
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
  }, [urls]);

  // Generate sitemap
  const result = useMemo(() => {
    return generateSitemapXml(urls, {
      defaultPriority,
      defaultChangefreq,
      includePriority,
      includeChangefreq,
      includeLastmod,
    });
  }, [urls, defaultPriority, defaultChangefreq, includePriority, includeChangefreq, includeLastmod]);

  // Handlers
  const handleAddUrl = useCallback(() => {
    if (!newUrl.trim()) return;

    const urlToAdd = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`;
    const sitemapUrl = createSitemapUrl(urlToAdd, {
      priority: defaultPriority,
      changefreq: defaultChangefreq,
      lastmod: new Date().toISOString().split('T')[0],
    });

    setUrls((prev) => [...prev, sitemapUrl]);
    setNewUrl('');
  }, [newUrl, defaultPriority, defaultChangefreq]);

  const handleBulkAdd = useCallback(() => {
    if (!bulkUrls.trim()) return;

    const lines = bulkUrls.split('\n').filter((line) => line.trim());
    const newUrls = lines.map((line) => {
      const urlToAdd = line.trim().startsWith('http') ? line.trim() : `https://${line.trim()}`;
      return createSitemapUrl(urlToAdd, {
        priority: defaultPriority,
        changefreq: defaultChangefreq,
        lastmod: new Date().toISOString().split('T')[0],
      });
    });

    setUrls((prev) => [...prev, ...newUrls]);
    setBulkUrls('');
    setShowBulkInput(false);
  }, [bulkUrls, defaultPriority, defaultChangefreq]);

  const handleRemoveUrl = useCallback((id: string) => {
    setUrls((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const handleUpdateUrl = useCallback(
    (id: string, field: keyof SitemapUrl, value: string) => {
      setUrls((prev) =>
        prev.map((u) => {
          if (u.id !== id) return u;
          return { ...u, [field]: value };
        })
      );
    },
    []
  );

  const handleClearAll = useCallback(() => {
    if (confirm('Are you sure you want to remove all URLs?')) {
      setUrls([]);
    }
  }, []);

  const priorityOptions = SITEMAP_PRIORITY_OPTIONS.map((p) => ({
    value: p.value,
    label: p.label,
  }));

  const changefreqOptions = SITEMAP_CHANGE_FREQUENCIES.map((f) => ({
    value: f.value,
    label: f.label,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column - URL Management */}
      <div className="space-y-4">
        {/* Add URL */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Add URLs</h3>
          {!showBulkInput ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://example.com/page"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddUrl()}
                />
                <Button onClick={handleAddUrl} disabled={!newUrl.trim()}>
                  Add
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowBulkInput(true)}>
                Bulk add URLs
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                value={bulkUrls}
                onChange={(e) => setBulkUrls(e.target.value)}
                placeholder="Enter URLs, one per line..."
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <Button onClick={handleBulkAdd} disabled={!bulkUrls.trim()}>
                  Add All
                </Button>
                <Button variant="ghost" onClick={() => setShowBulkInput(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Default Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              options={priorityOptions}
              value={defaultPriority}
              onChange={(e) => setDefaultPriority(e.target.value as Priority)}
            />
            <Select
              label="Change Frequency"
              options={changefreqOptions}
              value={defaultChangefreq}
              onChange={(e) => setDefaultChangefreq(e.target.value as ChangeFrequency)}
            />
          </div>
          <div className="mt-4 space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includePriority}
                onChange={(e) => setIncludePriority(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Include priority</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeChangefreq}
                onChange={(e) => setIncludeChangefreq(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Include change frequency</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeLastmod}
                onChange={(e) => setIncludeLastmod(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Include last modified</span>
            </label>
          </div>
        </div>

        {/* URL List */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
            <span className="font-semibold text-gray-900">
              URLs ({urls.length})
            </span>
            {urls.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClearAll}>
                Clear All
              </Button>
            )}
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {urls.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No URLs added yet. Add URLs above to generate a sitemap.
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                    <th className="px-4 py-2">URL</th>
                    <th className="px-4 py-2 w-20">Priority</th>
                    <th className="px-4 py-2 w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {urls.map((url) => (
                    <tr key={url.id} className={!url.isValid ? 'bg-red-50' : ''}>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          {!url.isValid && (
                            <Badge variant="error">Invalid</Badge>
                          )}
                          <span className="text-sm truncate max-w-[300px]">
                            {url.loc}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={url.priority || defaultPriority}
                          onChange={(e) =>
                            handleUpdateUrl(url.id, 'priority', e.target.value)
                          }
                          className="text-xs border rounded px-1 py-0.5"
                        >
                          {priorityOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.value}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleRemoveUrl(url.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">XML Preview</h3>
          <DownloadButton
            content={result.xml}
            filename="sitemap.xml"
            mimeType="application/xml"
            label="Download sitemap.xml"
            disabled={urls.length === 0}
          />
        </div>

        {result.warnings.length > 0 && (
          <Alert variant="warning">
            {result.warnings.map((w, i) => (
              <p key={i}>{w}</p>
            ))}
          </Alert>
        )}

        <div className="text-sm text-gray-600">
          {result.urlCount} URLs | {Math.round(result.fileSize / 1024)}KB
          {result.urlCount > SITEMAP_LIMITS.MAX_URLS_PER_SITEMAP && (
            <span className="text-red-600 ml-2">
              (exceeds {SITEMAP_LIMITS.MAX_URLS_PER_SITEMAP} URL limit)
            </span>
          )}
        </div>

        <CodePreview
          code={result.xml}
          language="xml"
          filename="sitemap.xml"
          showDownload={true}
        />
      </div>
    </div>
  );
}
