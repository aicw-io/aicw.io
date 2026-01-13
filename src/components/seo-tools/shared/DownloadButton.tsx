import { useCallback } from 'react';
import { Button } from './ui';

interface DownloadButtonProps {
  content: string;
  filename: string;
  mimeType?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  label?: string;
}

export function DownloadButton({
  content,
  filename,
  mimeType = 'text/plain',
  className = '',
  size = 'sm',
  variant = 'primary',
  label,
}: DownloadButtonProps) {
  const handleDownload = useCallback(() => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [content, filename, mimeType]);

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleDownload}
      className={className}
      disabled={!content}
    >
      <svg
        className="w-4 h-4 mr-1.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      {label || `Download ${filename}`}
    </Button>
  );
}
