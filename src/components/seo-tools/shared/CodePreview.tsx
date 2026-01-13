import { CopyButton } from './CopyButton';
import { DownloadButton } from './DownloadButton';

interface CodePreviewProps {
  code: string;
  language?: string;
  filename?: string;
  showDownload?: boolean;
  className?: string;
}

export function CodePreview({
  code,
  language = 'text',
  filename,
  showDownload = false,
  className = '',
}: CodePreviewProps) {
  const getMimeType = (lang: string): string => {
    const mimeTypes: Record<string, string> = {
      xml: 'application/xml',
      json: 'application/json',
      html: 'text/html',
      text: 'text/plain',
      txt: 'text/plain',
      md: 'text/markdown',
    };
    return mimeTypes[lang] || 'text/plain';
  };

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden bg-white ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-200">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {language}
        </span>
        <div className="flex items-center gap-2">
          <CopyButton text={code} size="sm" variant="ghost" />
          {showDownload && filename && (
            <DownloadButton
              content={code}
              filename={filename}
              mimeType={getMimeType(language)}
              size="sm"
              variant="ghost"
              label="Download"
            />
          )}
        </div>
      </div>

      {/* Code */}
      <div className="overflow-auto max-h-[500px]">
        <pre className="p-4 text-sm font-mono leading-6 whitespace-pre-wrap break-words">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
